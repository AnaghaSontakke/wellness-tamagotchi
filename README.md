# Wellness Tamagotchi 🎮

A modern web application that gamifies personal wellness and goal-setting through an interactive AI-powered virtual companion. Track your progress, set goals, and watch your digital buddy grow as you achieve your wellness objectives.

## Features

- 🤖 AI-powered chat companion powered by Google Gemini/Mistral AI/Neocortex Smart Agents
- 🎯 Goal tracking and management
- ⏱️ Focus mode for productivity
- 💬 Interactive conversations with your digital pal
- 🎨 Engaging character animations
- 📱 Mobile-first responsive design

## Prerequisites

Before running this project, ensure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Google Gemini API Key** - [Get one here](https://ai.google.dev/)

## Installation

### 1. Clone or Download the Repository

```bash
# If cloning from git
git clone <repository-url>
cd wellness-tamagotchi

# Or navigate to the downloaded folder
cd wellness-tamagotchi
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Your Gemini API Key

Create a `.env.local` file in the project root directory:

```bash
# On Windows (PowerShell)
echo 'GEMINI_API_KEY=your_api_key_here' > .env.local

# On macOS/Linux
echo "GEMINI_API_KEY=your_api_key_here" > .env.local
```

Or manually create the file `.env.local` in the project root with:

```
GEMINI_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with your actual Gemini API key from [Google AI Studio](https://ai.google.dev/).

## Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

Create an optimized production build:

```bash
npm build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
wellness-tamagotchi/
├── components/           # React components
│   ├── AddGoal.tsx
│   ├── Chat.tsx
│   ├── ChooseBuddy.tsx
│   ├── ChooseGoal.tsx
│   ├── Dashboard.tsx
│   ├── FocusMode.tsx
│   ├── HowItWorks.tsx
│   └── Welcome.tsx
├── services/            # API and service modules
│   └── geminiService.ts
├── Assets/              # Images and animations
├── App.tsx              # Main app component
├── GameContext.tsx      # Game state management
├── index.tsx            # Entry point
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

## Technology Stack

- **Frontend Framework**: React 19.2
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **AI Integration**: Google Generative AI (Gemini)
- **Styling**: Tailwind CSS (via classes)

## Troubleshooting

### Port 3000 Already in Use

If port 3000 is already in use, you can specify a different port:

```bash
npm run dev -- --port 3001
```

### API Key Not Working

- Verify your API key is correct in `.env.local`
- Ensure the file is named exactly `.env.local` (with the dot prefix)
- Make sure there are no extra spaces in the key
- Restart the development server after updating the key

### Dependencies Not Installing

Try clearing the npm cache and reinstalling:

```bash
npm cache clean --force
npm install
```

## Development

For development with TypeScript, the project includes:
- Full type checking with TypeScript
- Vite's fast HMR (Hot Module Replacement)
- React plugin for Vite

## License

This project is provided as-is for use and modification.

## Support

For issues or questions, please refer to the code comments or open an issue in the repository.
