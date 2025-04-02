# Brick Breaker Game

A modern implementation of the classic Brick Breaker game built with SolidJS and HTML5 Canvas. Break all the bricks with a bouncing ball while controlling a paddle to prevent the ball from falling.

## Features

- Smooth gameplay with HTML5 Canvas
- Responsive paddle control with mouse and keyboard
- Progressive difficulty (ball speed increases as you break more bricks)
- Score tracking
- Game over screen with replay functionality
- Modern UI with clean design

## Live Demo

[Add your deployed game URL here when available]

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GauravTyagi03/website.git
cd website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## How to Play

- Move the paddle left and right using either:
  - Mouse movement
  - Left and right arrow keys
- Break all the bricks to win
- Don't let the ball fall below the paddle
- The ball speed increases as you break more bricks
- Press SPACE to restart when game is over

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- [SolidJS](https://www.solidjs.com/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- HTML5 Canvas - Game rendering

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

Learn more about deploying your application with the [documentations](https://vite.dev/guide/static-deploy.html)
