import { GoogleGenAI, Type } from "@google/genai";
import { TrainingInput, TrainingPlan, GeneratedKit } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const base64Content = base64Data.split(',')[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateTrainingPlan = async (input: TrainingInput): Promise<TrainingPlan> => {
  const model = "gemini-2.5-flash";
  let prompt = "";
  let parts: any[] = [];

  if (input.file) {
    const filePart = await fileToGenerativePart(input.file);
    parts.push(filePart);
    prompt = `Analyze this uploaded training document for the ${input.industry} industry on the topic of "${input.topic}". 
    Create a structured training plan based on it. Extract key modules, learning objectives, and suggest enhancements.`;
  } else {
    prompt = `Create a comprehensive training plan for the ${input.industry} industry specifically on the topic of "${input.topic}". 
    The plan should be professional, actionable, and suitable for adult learners. Include 4-6 distinct modules.`;
  }

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          targetAudience: { type: Type.STRING },
          learningObjectives: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          modules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                durationMinutes: { type: Type.NUMBER },
              },
            },
          },
          suggestedEnhancements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Suggestions like specific role-plays, case studies, or quizzes",
          },
        },
        required: ["title", "targetAudience", "learningObjectives", "modules", "suggestedEnhancements"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text) as TrainingPlan;
};

export const generateFullKit = async (plan: TrainingPlan): Promise<GeneratedKit> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `You are a world-class instructional designer. Based on the following training plan JSON, generate the full content kit.
  
  Training Plan:
  ${JSON.stringify(plan)}
  
  Please generate:
  1. A slide deck (approx 5-8 key slides covering the modules). For each slide, provide a specific 'visualSearchTerm' that describes an ideal Unsplash/Pexels stock photo for the background (e.g., 'corporate meeting', 'factory safety gear', 'data server room').
  2. 5 Study Flashcards (key concepts).
  3. A one-page Participant Handout (Markdown format).
  4. A Facilitator Guide (Markdown format) with timing and delivery tips.
  5. A general visual image prompt (3-5 words) that describes the overall theme.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          slides: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.ARRAY, items: { type: Type.STRING } },
                speakerNotes: { type: Type.STRING },
                visualSearchTerm: { type: Type.STRING, description: "Keyword to search for a relevant background image for this specific slide." },
              },
            },
          },
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING },
                back: { type: Type.STRING },
              },
            },
          },
          handoutMarkdown: { type: Type.STRING },
          facilitatorGuideMarkdown: { type: Type.STRING },
          backgroundImagePrompt: { type: Type.STRING, description: "A keyword string to search/generate a background image" },
        },
        required: ["slides", "flashcards", "handoutMarkdown", "facilitatorGuideMarkdown", "backgroundImagePrompt"],
      },
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate kit");
  }

  return JSON.parse(response.text) as GeneratedKit;
};
