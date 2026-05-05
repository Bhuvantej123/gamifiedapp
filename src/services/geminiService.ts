import { GoogleGenAI, Type } from "@google/genai";
import { Persona } from "../types";

// Vite exposes this via the `define` block in vite.config.ts
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is missing. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

// Use gemini-1.5-flash — universally available on the free tier.
// gemini-2.5-flash requires special API access and causes 404/403 errors on standard keys.
const MODEL = "gemini-2.0-flash-lite";

/** Parse the response text safely — throw a meaningful error if empty or invalid JSON. */
function safeParseJSON(text: string | undefined, fnName: string): any {
  if (!text) {
    throw new Error(
      `${fnName}: Gemini returned an empty response. This may be due to a safety filter or quota limit.`
    );
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(
      `${fnName}: Failed to parse Gemini JSON response. Raw response: ${text.slice(0, 200)}`
    );
  }
}

export async function getAnalogy(topic: string, persona: Persona) {
  if (!apiKey) {
    throw new Error(
      "Gemini API Key is missing. Please check your .env file and restart the dev server."
    );
  }

  const prompt = `You are a personalized AI tutor. 
Student persona: ${JSON.stringify(persona)}. 
Explain '${topic}' using a creative analogy from their world (their sport: ${persona.sport}, hobby: ${persona.hobby}, or movie theme: ${persona.movie_theme}). 
Return ONLY valid JSON with the exact fields specified.`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analogy: { type: Type.STRING },
          explanation: { type: Type.STRING },
          example: { type: Type.STRING },
          fun_fact: { type: Type.STRING },
        },
        required: ["analogy", "explanation", "example", "fun_fact"],
      },
    },
  });

  return safeParseJSON(response.text, "getAnalogy");
}

export async function getQuiz(topic: string, persona: Persona) {
  if (!apiKey) {
    throw new Error(
      "Gemini API Key is missing. Please check your .env file and restart the dev server."
    );
  }

  const prompt = `Generate 5 MCQ questions on '${topic}' for a student who loves ${persona.sport}. 
Make them scenario-based and fun. 
Return ONLY valid JSON with the exact fields specified.`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                answer: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ["question", "options", "answer", "explanation"],
            },
          },
        },
        required: ["questions"],
      },
    },
  });

  return safeParseJSON(response.text, "getQuiz");
}

export async function evaluateExplanation(
  topic: string,
  explanation: string
) {
  if (!apiKey) {
    throw new Error(
      "Gemini API Key is missing. Please check your .env file and restart the dev server."
    );
  }

  const prompt = `Student explained '${topic}' as: '${explanation}'. Is this correct and complete? Return ONLY valid JSON.`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correct: { type: Type.BOOLEAN },
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          missing_points: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["correct", "score", "feedback", "missing_points"],
      },
    },
  });

  return safeParseJSON(response.text, "evaluateExplanation");
}

export async function getRerouteSuggestions(
  weakTopics: string[],
  persona: Persona
) {
  if (!apiKey) {
    throw new Error(
      "Gemini API Key is missing. Please check your .env file and restart the dev server."
    );
  }

  const prompt = `Student is weak at ${weakTopics.join(", ")}. Their persona: ${JSON.stringify(persona)}. 
Suggest a fun re-learning path using their interests. Return ONLY valid JSON.`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          path: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                analogy_hint: { type: Type.STRING },
                priority: {
                  type: Type.STRING,
                  enum: ["high", "medium", "low"],
                },
              },
              required: ["topic", "analogy_hint", "priority"],
            },
          },
        },
        required: ["path"],
      },
    },
  });

  return safeParseJSON(response.text, "getRerouteSuggestions");
}
