import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileBase64, fileName, jobDescription } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume analyzer specifically designed for Indian freshers and students. You analyze resumes thoroughly and provide actionable feedback.

You MUST respond with valid JSON only, no markdown, no code blocks, just raw JSON in this exact format:
{
  "ats_score": <number 0-100>,
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
- Keywords relevance: 30%
- Formatting & ATS compatibility: 20%  
- Action verbs & quantified achievements: 20%
- Section completeness (education, experience, skills, projects): 15%
- Overall clarity and conciseness: 15%

Be specific and actionable. Reference Indian job market context (TCS, Infosys, Wipro, etc.)`;

    let userPrompt = `Analyze this resume file named "${fileName}". The file content is provided as base64 data.

Here is the base64 content of the resume:
${fileBase64}`;

    if (jobDescription) {
      userPrompt += `\n\nAlso compare against this Job Description and identify keyword gaps:\n${jobDescription}`;
    } else {
      userPrompt += `\n\nNo specific job description provided. Analyze for general software/IT roles common for Indian freshers (TCS, Infosys, Wipro, Cognizant, etc.)`;
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
      // Try to parse, handling potential markdown code blocks
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      analysis = JSON.parse(cleaned);
    } catch {
      // Fallback
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
