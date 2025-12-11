// api/generate.ts
export const config = {
  runtime: 'edge',
};

interface RequestBody {
  action: 'plan' | 'kit';
  industry?: string;
  topic?: string;
  plan?: any;
  fileContent?: string;
}

const callOpenAI = async (messages: any[], apiKey: string) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API Error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export default async function handler(request: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers }
      );
    }

    const body: RequestBody = await request.json();
    const { action, industry, topic, plan, fileContent } = body;

    if (action === 'plan') {
      const messages: any[] = [
        {
          role: "system",
          content: `You are an expert instructional designer specializing in corporate training. 
          You create comprehensive, engaging training plans tailored to specific industries and topics.
          Always respond with valid JSON matching the requested schema.`
        }
      ];

      let userMessage = "";
      if (fileContent) {
        userMessage = `Analyze this uploaded training document for the ${industry} industry on the topic of "${topic}". 
        Create a structured training plan based on it. Extract key modules, learning objectives, and suggest enhancements.
        
        Document content: ${fileContent.substring(0, 2000)}...`;
      } else {
        userMessage = `Create a comprehensive training plan for the ${industry} industry specifically on the topic of "${topic}". 
        The plan should be professional, actionable, and suitable for adult learners. Include 4-6 distinct modules.
        
        Provide varied content based on the specific industry and topic combination.`;
      }

      messages.push({ role: "user", content: userMessage });
      messages.push({
        role: "user",
        content: `Respond with a JSON object with this exact structure:
        {
          "title": "string",
          "targetAudience": "string",
          "learningObjectives": ["string"],
          "modules": [{"title": "string", "description": "string", "durationMinutes": number}],
          "suggestedEnhancements": ["string"]
        }`
      });

      const responseText = await callOpenAI(messages, apiKey);
      return new Response(responseText, { status: 200, headers });
    } 
    
    else if (action === 'kit') {
      const messages = [
        {
          role: "system",
          content: `You are a world-class instructional designer. Generate comprehensive training materials with engaging, industry-specific content. Always respond with valid JSON.`
        },
        {
          role: "user",
          content: `Based on this training plan, generate a complete training kit:

${JSON.stringify(plan, null, 2)}

Generate 5-8 slides, 5 flashcards, a participant handout (markdown), and a facilitator guide (markdown).

Respond with this JSON structure:
{
  "slides": [{"title": "string", "content": ["string"], "speakerNotes": "string", "visualSearchTerm": "string"}],
  "flashcards": [{"front": "string", "back": "string"}],
  "handoutMarkdown": "string",
  "facilitatorGuideMarkdown": "string",
  "backgroundImagePrompt": "string"
}`
        }
      ];

      const responseText = await callOpenAI(messages, apiKey);
      return new Response(responseText, { status: 200, headers });
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers }
    );

  } catch (error: any) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request', details: error.message }),
      { status: 500, headers }
    );
  }
}