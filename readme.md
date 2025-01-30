# Slot Game

## Game Overview
This is a **4x5 reel slot game** built from scratch. The game features:
- Custom **reel spin mechanics** 
- **Cascading reels** implemented based on the original sliding reel response.

## Getting Started
Follow these steps to set up and run the game:

### 1. Clone the Repository
```sh
# Replace <repository-url> with the actual URL
git clone https://github.com/dikshant3221/cascadingSlotGame
cd <project-folder>
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Build the Project
```sh
npm run build
```

### 4. Start the Development Server
```sh
npm start
```
This will launch the game locally in your browser.

## Folder Structure
```
src/
│── assets/                   # Game assets (images, sounds, etc.)
│── components/               # Game components
│   │── animations/           # Handles win animations, effects
│   │── reels/                # Reel mechanics (spinning, cascading)
│   │── ui/                   # UI elements like buttons, overlays
│── core/                     # Core game logic
│── index.html                # Entry file
│── package.json              # Project metadata and dependencies
│── README.md                 # Project documentation
│── tsconfig.json             # TypeScript configuration
│── webpack.config.js         # Webpack bundling configuration
```

## Technologies Used
- **TypeScript** for type safety and maintainability
- **Webpack** for bundling and optimizing the project
- **HTML5 & CSS3** for UI and game rendering
- **Custom JavaScript animations** for smooth reel transitions
- **Pixi.js** for rendering 2D animations

## Contribution
If you'd like to contribute, feel free to submit a pull request or report issues.

## License
This project is licensed under the MIT License.

