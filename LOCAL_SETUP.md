# Local Setup Instructions

This document provides instructions on how to set up and run this project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Getting Started

1.  **Clone or Download the Project:**
    If you haven't already, download the project source code to your local machine.

2.  **Install Dependencies:**
    Open your terminal, navigate to the project root directory, and run:
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    The project requires certain environment variables to function correctly (especially for AI features and data persistence).

    -   Copy the `.env.example` file to create a `.env` file:
        ```bash
        cp .env.example .env
        ```
    -   Open the `.env` file and fill in the required values:
        -   **`GEMINI_API_KEY`**: Obtain an API key from the [Google AI Studio](https://aistudio.google.com/app/apikey).
        -   **`VITE_SUPABASE_URL`**: Your Supabase Project URL.
        -   **`VITE_SUPABASE_ANON_KEY`**: Your Supabase Anonymous API Key.

    *Note: For the Supabase variables, you will need to set up a free project on [Supabase](https://supabase.com/).*

4.  **Database Setup (Supabase):**
    If you want to use the persistent data features:
    -   Create a new project in Supabase.
    -   Go to the **SQL Editor** in your Supabase dashboard.
    -   Paste the contents of `supabase-schema.sql` (found in the root directory) and run it to set up the necessary tables.

5.  **Run the Development Server:**
    Start the local development server by running:
    ```bash
    npm run dev
    ```
    The app will typically be available at `http://localhost:3000` (or the port specified in your terminal).

## Building for Production

To create an optimized production build, run:
```bash
npm run build
```
The static files will be generated in the `dist/` directory, which can be deployed to any static site hosting service (like Vercel, Netlify, or Firebase Hosting).

## Troubleshooting

-   **AI Features Not Working:** Ensure your `GEMINI_API_KEY` is correct and has not reached its quota limits.
-   **Database Errors:** Verify your Supabase URL and Anon Key are correctly set in the `.env` file and that you have run the schema migration.
-   **Node Version:** If you encounter installation errors, try using a more recent version of Node.js.
