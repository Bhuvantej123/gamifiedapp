import { Persona } from '../types';

// All AI calls go through our own Express server (/api/*)
// The Gemini API key lives server-side only — never in the browser bundle.
const BASE = '/api';

async function postJSON(route: string, body: object) {
  const res = await fetch(`${BASE}${route}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({ error: `Server returned ${res.status}` }));

  if (!res.ok) {
    throw new Error(data.error || `Request to ${route} failed with status ${res.status}`);
  }

  return data;
}

export async function getAnalogy(topic: string, persona: Persona, skipAnalogy = false) {
  return postJSON('/analogy', { topic, persona, skipAnalogy });
}

export async function getQuiz(topic: string, difficulty: string) {
  return postJSON('/quiz', { topic, difficulty });
}

export async function evaluateExplanation(topic: string, explanation: string) {
  return postJSON('/evaluate', { topic, explanation });
}

export async function getRerouteSuggestions(weakTopics: string[], persona: Persona) {
  return postJSON('/reroute', { weakTopics, persona });
}
