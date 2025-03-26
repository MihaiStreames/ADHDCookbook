# ADHD Cookbook

ADHD Cookbook is a mobile app I built to make cooking more manageable for myself and others with ADHD. After struggling
with overwhelming recipe websites and complicated instructions, I created this distraction-friendly cooking app that
breaks everything down into clear, manageable steps.

## Why I Made This

As someone with ADHD, cooking from traditional recipes is often frustrating:

- Getting lost in long paragraphs of instructions
- Forgetting where I left off when distracted
- Losing track of which ingredients I need for each step
- Getting overwhelmed by too much information at once

This app addresses all these issues by presenting cooking in an ADHD-friendly way:

- **One step at a time:** See only what you need to focus on now
- **Visual cues:** Photos for each step make instructions clearer
- **Ingredient linking:** Each step shows exactly which ingredients you need right now
- **Progress tracking:** Check off completed steps so you never lose your place

## Features

- **Step-by-Step Instructions**: Each cooking step is presented individually to reduce overwhelm
- **Ingredient Linking**: Steps show exactly which ingredients you need for that step
- **Visual Aids**: Add photos to steps to make instructions clearer
- **Check-off System**: Mark completed steps to keep your place
- **Servings Calculator**: Automatically adjusts ingredient quantities
- **Dark Mode**: Reduce eye strain with light/dark themes
- **Complete Offline Support**: No internet required to use the app

## Installation

### Download

The app is available on:

- [Google Play Store](#) (coming soon)
- [Apple App Store](#) (coming soon)

### Build From Source

#### Prerequisites

- Node.js (14.0 or later)
- npm or Yarn
- Expo CLI (`npm install -g expo-cli`)

#### Setup

1. Clone the repository:

```bash
git clone https://github.com/MihaiStreames/ADHD.Cookbook
cd ADHD.Cookbook/src/
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

4. Open the app on your device using Expo Go, or run on a simulator/emulator:

```bash
npm run android
# or
npm run ios
```

## Tech Stack

- React Native
- Expo
- TypeScript
- AsyncStorage for local data persistence
- React Navigation for screen navigation

## Roadmap

- [ ] Recipe categorization and tags
- [ ] Shopping list generation
- [ ] Cloud sync for recipes across devices
- [ ] Import recipes from websites

## Contributing

I welcome contributions to make ADHD Cookbook even better! If you'd like to help, please check out
the [Contributing Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.