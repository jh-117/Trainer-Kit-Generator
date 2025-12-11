import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TrainingInput {
  industry: string;
  topic: string;
  fileContent?: string;
}

interface TrainingModule {
  title: string;
  description: string;
  durationMinutes: number;
}

interface TrainingPlan {
  title: string;
  targetAudience: string;
  learningObjectives: string[];
  modules: TrainingModule[];
  suggestedEnhancements: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { industry, topic, fileContent }: TrainingInput = await req.json();
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const systemPrompt = `You are an expert training program designer. Generate a comprehensive training plan in JSON format based on the provided industry and topic.`;

    const userPrompt = `Create a detailed training plan for:
Industry: ${industry}
Topic: ${topic}${fileContent ? `\n\nReference Material:\n${fileContent}` : ''}

Return a JSON object with this exact structure:
{
  "title": "string",
  "targetAudience": "string",
  "learningObjectives": ["objective1", "objective2", ...],
  "modules": [
    {
      "title": "string",
      "description": "string",
      "durationMinutes": number
    }
  ],
  "suggestedEnhancements": ["enhancement1", "enhancement2", ...]
}

Provide 3-5 learning objectives, 4-6 modules with realistic durations, and 3-4 suggested enhancements.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const plan: TrainingPlan = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(plan), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate training plan" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
