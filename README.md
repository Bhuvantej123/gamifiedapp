# QuestIQ — AI Gamified Learning Platform

QuestIQ turns lessons into high-stakes quests. Using Gemini 3.0 Flash, it creates personalized analogies from your world (Sports, Movies, Hobbies) and tests your mastery through themed Boss Battles.

## 🚀 Hackathon Setup (Supabase)

To get this app fully functional, you need to set up your Supabase project:

1. **Create a Supabase Project** at [supabase.com](https://supabase.com).
2. **Run the Schema**: Go to the SQL Editor in Supabase and paste the contents of `supabase-schema.sql`.
3. **Get API Keys**: 
   - Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Settings > API.
   - Add them to your environment variables as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. **Enable Auth**: Ensure Email Auth is enabled in the Authentication settings.

## 🤖 AI Integration (Gemini)

QuestIQ uses the **Google Gemini SDK** directly on the frontend for low-latency, personalized content generation.

- **Analogy Engine**: Deeply rooted in student persona.
- **Boss Battles**: Scenario-based MCQs.
- **Skill Radar**: AI-driven insights into learning gaps.

## 🎨 Themes

QuestIQ ships with three immersive themes:
- **Wizarding World**: Deep purple & gold (Harry Potter inspired).
- **Avengers Initiative**: High-tech navy & red (Marvel inspired).
- **Endurance Mission**: Space void & electric blue (Interstellar inspired).

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 📜 Project Structure

- `src/services/geminiService.ts`: All AI logic.
- `src/store/`: State management for users and game stats.
- `src/utils/themeConfig.ts`: Theme palette definitions.
- `src/pages/BossBattle.tsx`: The quiz engine.
- `supabase-schema.sql`: Database structure.

---
Built for the Future of Education with ⚡ and Gemini.
