import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";
import JSZip from "https://esm.sh/jszip@3.10.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function detectFileType(fileName: string): "pdf" | "docx" | "unknown" {
  const ext = fileName.toLowerCase().split(".").pop();
  if (ext === "pdf") return "pdf";
  if (ext === "docx" || ext === "doc") return "docx";
  return "unknown";
}

async function extractTextFromPDF(data: Uint8Array): Promise<string> {
  try {
    const { extractText } = await import("https://esm.sh/unpdf@0.12.1");
    const result = await extractText(data);
    if (typeof result === "string") return result;
    if (result && typeof result.text === "string") return result.text;
    if (result && Array.isArray(result.text)) return result.text.join("\n\n");
    if (result && Array.isArray(result.pages)) return result.pages.join("\n\n");
    return String(result);
  } catch (err) {
    console.error("unpdf failed, trying pdfjs-serverless:", err);
    const mod = await import("https://esm.sh/pdfjs-serverless@0.5.0");
    const getDocument = mod.getDocument || mod.default?.getDocument || mod.default;
    const doc = await getDocument({ data, useSystemFonts: true }).promise;
    const texts: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(" ");
      texts.push(pageText);
    }
    return texts.join("\n\n");
  }
}

async function extractTextFromDOCX(data: Uint8Array): Promise<string> {
  const zip = await JSZip.loadAsync(data);
  const docXml = await zip.file("word/document.xml")?.async("string");
  if (!docXml) throw new Error("Invalid DOCX: no document.xml found");
  const text = docXml
    .replace(/<w:br[^>]*\/>/gi, "\n")
    .replace(/<\/w:p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text;
}

async function extractText(data: Uint8Array, fileType: "pdf" | "docx"): Promise<string> {
  if (fileType === "pdf") return extractTextFromPDF(data);
  return extractTextFromDOCX(data);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { fileBase64, fileName, analysis } = await req.json();

    if (!fileBase64 || typeof fileBase64 !== "string") {
      return new Response(JSON.stringify({ error: "fileBase64 is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!fileName || typeof fileName !== "string") {
      return new Response(JSON.stringify({ error: "fileName is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!analysis || typeof analysis !== "object") {
      return new Response(JSON.stringify({ error: "analysis is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (fileBase64.length > 28_000_000) {
      return new Response(JSON.stringify({ error: "File too large. Max 20MB." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fileType = detectFileType(fileName);
    if (fileType === "unknown") {
      return new Response(JSON.stringify({ error: "Unsupported file format. Please upload a PDF or DOCX file." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Strip data URI prefix if present
    const base64Data = fileBase64.includes(",") ? fileBase64.split(",")[1] : fileBase64;

    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    let resumeText: string;
    try {
      resumeText = await extractText(bytes, fileType);
    } catch (parseErr) {
      console.error("Text extraction failed:", parseErr);
      return new Response(JSON.stringify({ error: "Failed to extract text from file. Please ensure it's a valid PDF or DOCX." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!resumeText || resumeText.trim().length < 20) {
      return new Response(JSON.stringify({ error: "Could not extract meaningful text from the file. It may be image-based or corrupted." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Extracted ${resumeText.length} chars from ${fileType} file "${fileName}"`);

    const SARVAM_API_KEY = Deno.env.get("SARVAM_API_KEY");
    if (!SARVAM_API_KEY) throw new Error("SARVAM_API_KEY is not configured");

    const systemPrompt = `You are an expert resume formatter and optimizer. Your job is to ENHANCE the presentation of an existing resume — NOT to add new content.

You MUST respond with valid JSON only, no markdown, no code blocks.

STRICT RULES — VIOLATIONS ARE UNACCEPTABLE:
1. NEVER invent, fabricate, or add projects, skills, experiences, certifications, or achievements that are NOT in the original resume.
2. NEVER add technologies, tools, or frameworks the candidate did not mention.
3. ONLY use keywords from the analysis feedback IF they genuinely describe something already present in the resume. Do NOT force-fit keywords.
4. If a section is empty or missing in the original, leave it as an empty array — do NOT fill it with made-up content.
5. You MAY rephrase bullets with stronger action verbs and quantify achievements where the data supports it.
6. You MAY improve formatting, ordering, and clarity.
7. You MAY fix grammar, spelling, and punctuation.
8. Maintain the candidate's actual domain (MBA, Engineering, Commerce, etc.) — do NOT shift to a different field.

Return this exact structure:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number",
  "linkedin": "linkedin URL or empty string",
  "github": "github URL or empty string",
  "location": "City, State",
  "objective": "A 2-3 sentence professional summary based ONLY on what's in the resume",
  "education": [
    {
      "degree": "Degree as stated in resume",
      "institution": "College Name from resume",
      "year": "Year from resume",
      "gpa": "GPA from resume or empty string"
    }
  ],
  "experience": [
    {
      "title": "Role Title from resume",
      "company": "Company Name from resume",
      "duration": "Duration from resume",
      "bullets": [
        "Rephrased bullet with stronger action verb — same core content",
        "Another rephrased bullet"
      ]
    }
  ],
  "projects": [
    {
      "name": "Project Name from resume",
      "tech": "Tech stack mentioned in resume for this project",
      "bullets": [
        "Enhanced description of what they actually built",
        "Another bullet preserving original meaning"
      ]
    }
  ],
  "skills": {
    "languages": ["Only languages mentioned in resume"],
    "frameworks": ["Only frameworks mentioned in resume"],
    "tools": ["Only tools mentioned in resume"],
    "soft_skills": ["Only soft skills evident from resume"]
  },
  "certifications": ["Only certifications listed in resume"],
  "achievements": ["Only achievements listed in resume"]
}

Enhancement techniques (apply WITHOUT changing facts):
- Use strong action verbs: Developed, Implemented, Engineered, Optimized, Spearheaded, Orchestrated
- Quantify where the resume provides data (%, numbers, scale)
- Improve clarity and conciseness
- Better organize and structure existing content
- Fix ATS formatting issues (remove tables, graphics references, etc.)`;

    const userPrompt = `Here is the extracted text from the resume file "${fileName}":
---
${resumeText}
---

Here is the ATS analysis feedback:
${JSON.stringify(analysis, null, 2)}

Rewrite this resume incorporating the feedback. Return ONLY the structured JSON. Remember: do NOT invent any content — only enhance what exists in the resume text above.`;

    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SARVAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sarvam-m4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI rewrite failed");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    let resumeData;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      resumeData = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse rewrite response:", content);
      throw new Error("Failed to parse AI response. Please try again.");
    }

    return new Response(JSON.stringify({ resumeData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("rewrite-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
