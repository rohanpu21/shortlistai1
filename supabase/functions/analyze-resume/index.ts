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

async function extractTextFromDOCX(data: Uint8Array): Promise<string> {
  const zip = await JSZip.loadAsync(data);
  const docXml = await zip.file("word/document.xml")?.async("string");
  if (!docXml) throw new Error("Invalid DOCX: no document.xml found");
  // Strip XML tags and decode common entities
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

    const { fileBase64, fileName, jobDescription } = await req.json();

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

    // Decode base64 to binary
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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume analyzer for Indian students and professionals across ALL domains — Engineering, MBA, Commerce, Arts, Science, Law, Medicine, Design, etc.

IMPORTANT: First, detect the candidate's field/domain from their resume content (education, skills, experience). Then tailor your entire analysis to that specific domain.

For example:
- MBA resumes → evaluate for consulting, FMCG, banking, marketing roles (McKinsey, Deloitte, HUL, HDFC, etc.)
- Engineering/IT resumes → evaluate for software/IT roles (TCS, Infosys, Wipro, etc.)
- Commerce resumes → evaluate for finance, accounting, audit roles (Big 4, banks, etc.)
- Design resumes → evaluate for UI/UX, creative roles
- Law resumes → evaluate for law firm, corporate counsel roles
- Always match keywords, suggestions, and company references to the detected domain.

You MUST respond with valid JSON only, no markdown, no code blocks, just raw JSON in this exact format:
{
  "ats_score": <number 0-100>,
  "detected_domain": "<detected field like MBA-Marketing, CS/IT, Commerce-Finance, etc.>",
  "summary": "<1-2 sentence overall assessment>",
  "keyword_gaps": ["<missing keyword 1>", "<missing keyword 2>", ...],
  "formatting_issues": ["<issue 1>", "<issue 2>", ...],
  "rewrite_suggestions": ["<suggestion with before→after example>", ...],
  "section_feedback": [
    {"section": "<section name>", "feedback": "<specific feedback>", "rating": "<good|average|poor>"},
    ...
  ]
}

Scoring criteria:
- Keywords relevance (domain-specific): 30%
- Formatting & ATS compatibility: 20%  
- Action verbs & quantified achievements: 20%
- Section completeness: 15%
- Overall clarity and conciseness: 15%

Be specific and actionable. Reference companies and roles relevant to the candidate's actual domain in the Indian job market.`;

    let userPrompt = `Analyze this resume. The text has been extracted from a ${fileType.toUpperCase()} file named "${fileName}".

Here is the full resume text:
---
${resumeText}
---`;

    if (jobDescription) {
      userPrompt += `\n\nAlso compare against this Job Description and identify keyword gaps:\n${jobDescription}`;
    } else {
      userPrompt += `\n\nNo specific job description provided. Auto-detect the candidate's domain from the resume and analyze for relevant roles in that field within the Indian job market.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5",
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
      throw new Error("AI analysis failed");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    let analysis;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = {
        ats_score: 50,
        summary: "Analysis completed but response format was unexpected. Please try again.",
        keyword_gaps: [],
        formatting_issues: ["Could not fully parse the analysis"],
        rewrite_suggestions: [],
        section_feedback: [],
      };
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
