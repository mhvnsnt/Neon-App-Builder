<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d11a661c-f4d4-4b82-bdc6-d6b743b0bf38

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Security setup (required)

The API is protected by a shared bearer token.

1. Generate a token: `openssl rand -hex 32`
2. Put it in `.env.local` (never commit it): `APP_AUTH_TOKEN="<your token>"`
3. Start the app with `npm run dev`. The first time the web UI calls the API it asks for the token and remembers it in that browser.

If `APP_AUTH_TOKEN` is unset, every `/api` route returns `503` (fail closed).

The agent's shell tools (`execute_command`, `execute_background_command`) are **off by default**. Set `ENABLE_SHELL_TOOL=1` only on your own machine. File tools are limited to the project folder.

`proof/harness.mjs` replays the attack checks: `node proof/harness.mjs after` (uses fake keys in a local `.data/` folder).
