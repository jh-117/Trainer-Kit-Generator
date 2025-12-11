import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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

interface Slide {
  title: string;
  content: string[];
  speakerNotes: string;
  visualSearchTerm: string;
}

interface Flashcard {
  front: string;
  back: string;
}

interface GeneratedKit {
  slides: Slide[];
  flashcards: Flashcard[];
  handoutMarkdown: string;
  facilitatorGuideMarkdown: string;
  backgroundImagePrompt: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const plan: TrainingPlan = await req.json();
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const systemPrompt = `You are an expert instructional designer creating comprehensive training materials. Generate slides, flashcards, and documentation in JSON format.`;

    const userPrompt = `Based on this training plan, create a complete training kit:

Title: ${plan.title}
Target Audience: ${plan.targetAudience}
Learning Objectives: ${plan.learningObjectives.join(", ")}
Modules: ${plan.modules.map(m => `${m.title} (${m.durationMinutes} min)`).join(", ")}

Return a JSON object with this exact structure:
{
  "slides": [
    {
      "title": "string",
      "content": ["bullet1", "bullet2", ...],
      "speakerNotes": "string",
      "visualSearchTerm": "string for finding relevant images"
    }
  ],
  "flashcards": [
    {
      "front": "question or term",
      "back": "answer or definition"
    }
  ],
  "handoutMarkdown": "Complete markdown document for participant handout",
  "facilitatorGuideMarkdown": "Complete markdown document with facilitation tips",
  "backgroundImagePrompt": "A description for a background image that fits the training theme"
}

Create:
- 8-12 slides covering all modules with an intro and conclusion slide
- 10-15 flashcards for key concepts
- A comprehensive handout (markdown format) with all key information
- A detailed facilitator guide (markdown format) with timing, tips, and activities
- A professional background image description

Make content engaging, professional, and aligned with the learning objectives.`;

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
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const kit: GeneratedKit = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(kit), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate training kit" }),
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
