
# 7 Days to End With You - Web App

This is a word puzzle and deciphering web app inspired by the game "7 Days to End with You." The app allows users to enter coded or ciphered text and attempts to automatically decipher it using Caesar shift analysis and English word scoring. It provides a virtual keyboard, visual feedback, and interactive results for each possible shift.

## Features

- Enter coded or ciphered text and see all possible Caesar shift decodings ranked by English-likeness.
- Visual keyboard for easy input.
- Each shift result is scored and ranked, with the best matches highlighted.
- Designed for word puzzle fans and language game enthusiasts.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)

## Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```

## Running the App in Development Mode

Start the development server with hot reload:

```sh
npm run dev
```

Open the local URL shown in the terminal (usually http://localhost:5173) to use the app.

## Building for Production

To build the app for deployment:

```sh
npm run build
```

The output will be in the `dist/` folder.

## Previewing the Production Build

To locally preview the built app as it will appear in production:

```sh
npm run preview
```

## Project Structure

- `App.tsx` - Main application logic and UI
- `components/` - React components (keyboard, letter tiles, etc.)
- `services/` - Logic for Caesar shift, word scoring, and dictionary loading
- `types.ts` - Shared type definitions
- `vite.config.ts` - Vite configuration

## License

This project is for educational and non-commercial use. All rights to the original game "7 Days to End with You" belong to its creators.
