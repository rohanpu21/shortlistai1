import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth validation
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

    // Input validation
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

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert resume rewriter for Indian freshers. You take a resume and its ATS analysis feedback, then produce a fully rewritten, ATS-optimized resume as structured JSON.

You MUST respond with valid JSON only, no markdown, no code blocks.

Return this exact structure:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number",
  "linkedin": "linkedin URL or empty string",
  "github": "github URL or empty string",
  "location": "City, State",
  "objective": "A 2-3 sentence professional summary/objective tailored for the role",
  "education": [
    {
      "degree": "B.Tech in Computer Science",
      "institution": "College Name",
      "year": "2022-2026",
      "gpa": "8.5/10 or empty string"
    }
  ],
  "experience": [
    {
      "title": "Role Title",
      "company": "Company Name",
      "duration": "Jun 2025 - Aug 2025",
      "bullets": [
        "Action-verb bullet point with quantified achievement",
        "Another bullet point"
      ]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "tech": "React, Node.js, MongoDB",
      "bullets": [
        "What you built and the impact",
        "Another bullet"
      ]
    }
  ],
  "skills": {
    "languages": ["Python", "JavaScript", "Java"],
    "frameworks": ["React", "Node.js", "Express"],
    "tools": ["Git", "Docker", "AWS"],
    "soft_skills": ["Leadership", "Communication"]
  },
  "certifications": ["Certification name - Issuer"],
  "achievements": ["Achievement with context"]
}

Rules:
- Incorporate ALL missing keywords from the analysis
- Fix ALL formatting issues mentioned
- Apply ALL rewrite suggestions
- Use strong action verbs: Developed, Implemented, Engineered, Optimized, Architected
- Quantify achievements wherever possible (%, numbers, scale)
- Keep it to 1 page worth of content (concise)
- Maintain truthfulness - enhance presentation, don't fabricate
- If a section is empty in the original, include it with reasonable content based on context
- Target Indian IT job market (TCS, Infosys, Wipro, etc.)`;

    const userPrompt = `Here is the resume file "${fileName}" as base64:
${fileBase64}

Here is the ATS analysis feedback:
${JSON.stringify(analysis, null, 2)}

Rewrite this resume incorporating all the feedback. Return ONLY the structured JSON.`;

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
