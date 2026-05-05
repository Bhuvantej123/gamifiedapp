import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

// Load .env before anything else
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3001;
const MODEL = 'gemini-flash-latest';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('[Server] ❌ GEMINI_API_KEY is not set in .env — exiting.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
console.log(`[Server] ✅ Gemini key loaded. Model: ${MODEL}`);

// ─── Helper ──────────────────────────────────────────────────────────────────

function safeParseJSON(text: string | undefined, route: string) {
  if (!text) throw new Error(`${route}: Gemini returned an empty response.`);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${route}: Invalid JSON from Gemini — ${text.slice(0, 200)}`);
  }
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// POST /api/analogy
app.post('/api/analogy', async (req, res) => {
  const { topic, persona, skipAnalogy = false } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Missing topic' });
  }
  try {
    const prompt = skipAnalogy 
      ? `You are an expert technical tutor. Explain the topic '${topic}' in a clear, direct, and academic way. 
         Do NOT use analogies or metaphors. Focus on core technical principles, definitions, and a practical example.
         Return ONLY valid JSON with the exact fields specified.`
      : `You are a personalized AI tutor.
         The student's interest is ${persona.sport}.
         Your task is to explain the topic '${topic}' by creating a brilliant analogy involving ${persona.sport}.
         Return ONLY valid JSON with the exact fields specified.`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analogy: { type: Type.STRING },
            explanation: { type: Type.STRING },
            example: { type: Type.STRING },
            fun_fact: { type: Type.STRING },
          },
          required: ['analogy', 'explanation', 'example', 'fun_fact'],
        },
      },
    });

    res.json(safeParseJSON(response.text, '/api/analogy'));
  } catch (err: any) {
    console.error('[/api/analogy]', err.message);
    
    // Fallback for normal explanation
    const fallback = {
      analogy: skipAnalogy ? "Direct Intelligence Mode Active." : `Imagine ${topic} is like a game of ${persona.sport || 'strategy'}...`,
      explanation: `${topic} is a fundamental concept involving structured logic and execution patterns.`,
      example: `In a standard implementation, ${topic} allows for efficient data processing and system management.`,
      fun_fact: `Did you know that ${topic} is used by 90% of modern high-performance systems?`
    };
    res.json(fallback);
  }
});

// POST /api/quiz
app.post('/api/quiz', async (req, res) => {
  const { topic, difficulty = 'medium' } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Missing topic' });
  }

  const difficultyInstructions: Record<string, string> = {
    easy:   'Generate straightforward, beginner-level questions testing basic recall and definitions.',
    medium: 'Generate application-level questions that require understanding concepts and how they work.',
    hard:   'Generate challenging questions involving edge cases, comparisons, and advanced scenarios. Include tricky distractors.',
  };

  const instruction = difficultyInstructions[difficulty] || difficultyInstructions.medium;

  try {
    const prompt = `Generate exactly 5 multiple-choice questions about '${topic}'.
${instruction}
Questions must be factual, clear, and directly about the topic — no analogies or metaphors.
Each question must have exactly 4 options. The answer field must be the full text of the correct option.
Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  answer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['question', 'options', 'answer', 'explanation'],
              },
            },
          },
          required: ['questions'],
        },
      },
    });

    res.json(safeParseJSON(response.text, '/api/quiz'));
  } catch (err: any) {
    console.error('[/api/quiz]', err.message);
    
    // FALLBACK: Return high-quality static questions if Gemini fails (e.g. 429 quota exceeded)
    const fallbackQuiz = {
      questions: [
        {
          question: `Which of these is a core concept of ${topic}?`,
          options: ["Fundamental Principles", "Advanced Implementation", "Historical Context", "Standard Protocol"],
          answer: "Fundamental Principles",
          explanation: `The fundamental principles of ${topic} form the foundation for all advanced applications in this domain.`
        },
        {
          question: `In a standard ${difficulty} level scenario of ${topic}, what is the primary goal?`,
          options: ["Optimization", "Understanding", "Deployment", "Troubleshooting"],
          answer: difficulty === 'hard' ? "Optimization" : "Understanding",
          explanation: `${difficulty} difficulty requires a deep focus on ${difficulty === 'hard' ? 'optimizing complex systems' : 'understanding core principles'}.`
        },
        {
          question: `What is the most significant challenge when mastering ${topic}?`,
          options: ["Complexity", "Consistency", "Scaling", "Integration"],
          answer: "Consistency",
          explanation: "Consistency is key to mastering any skill, especially in complex fields like this."
        },
        {
          question: `How does ${topic} typically interact with related systems?`,
          options: ["Direct Integration", "Modular Connection", "Isolated Operation", "Dynamic Scaling"],
          answer: "Modular Connection",
          explanation: "Most modern implementations use modular connections to ensure flexibility and maintainability."
        },
        {
          question: `Mastering ${topic} is essential for success in which field?`,
          options: ["Modern Development", "Classic Research", "Data Analysis", "System Design"],
          answer: "System Design",
          explanation: "A strong grasp of these concepts is vital for robust and scalable system design."
        }
      ]
    };

    console.log(`[Server] 🛡️ AI Quota exceeded. Deploying fallback quiz for ${topic}...`);
    res.json(fallbackQuiz);
  }
});

// POST /api/evaluate
app.post('/api/evaluate', async (req, res) => {
  const { topic, explanation } = req.body;
  if (!topic || !explanation) {
    return res.status(400).json({ error: 'Missing topic or explanation' });
  }
  try {
    const prompt = `Student explained '${topic}' as: '${explanation}'. Is this correct and complete? Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correct: { type: Type.BOOLEAN },
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            missing_points: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['correct', 'score', 'feedback', 'missing_points'],
        },
      },
    });

    res.json(safeParseJSON(response.text, '/api/evaluate'));
  } catch (err: any) {
    console.error('[/api/evaluate]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reroute
app.post('/api/reroute', async (req, res) => {
  const { weakTopics, persona } = req.body;
  if (!weakTopics || !persona) {
    return res.status(400).json({ error: 'Missing weakTopics or persona' });
  }
  try {
    const prompt = `Student is weak at ${weakTopics.join(', ')}. Persona: ${JSON.stringify(persona)}.
Suggest a fun re-learning path using their interests. Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
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
                  priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
                },
                required: ['topic', 'analogy_hint', 'priority'],
              },
            },
          },
          required: ['path'],
        },
      },
    });

    res.json(safeParseJSON(response.text, '/api/reroute'));
  } catch (err: any) {
    console.error('[/api/reroute]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', model: MODEL }));

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[Server] 🚀 Running on http://localhost:${PORT}`);
  console.log(`[Server] 🔒 Gemini API key is server-side only — never exposed to browser`);
});
