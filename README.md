# TS Breakout Demo

This is a TypeScript implementation of the classic Breakout game. The game is developed without using the `<canvas>` element, making it a unique learning project. **Work is still in progress.**

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd repository
    npm install
    npm run dev
    ```

## Game Features

- **Dynamic UI**: The game interface is dynamically created using DOM manipulation.
- **Game Logic**: The game logic is handled in [`src/brain.ts`](src/brain.ts).
- **UI Rendering**: The UI rendering is managed by the [`UI`](src/ui.ts) class in [`src/ui.ts`](src/ui.ts).

## How to Play
- **Start Game**: Press `P` to start the game.
- **Pause Game**: Press `O` to pause the game.
- **Game Over**: The game displays a "Game Over" message when you lose.

## Pure JavaScript Version

A pure JavaScript version of this game is also available. You can find it at the following repository: [Pure JS Breakout Demo](https://github.com/j-vinnal/Pure-JS-Breakout-Demo).


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.