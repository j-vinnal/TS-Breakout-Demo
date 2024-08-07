import Brain from "./brain";
import { BORDER_COLOR, TEXT_COLOR } from "./colors";
import Ball from "./components/ball";
import Brick from "./components/brick";
import Paddle from "./components/paddle";

export default class UI {
  // real screen dimensions
  width: number = -1;
  height: number = -1;
  scaleX: number = 1;
  scaleY: number = 1;
  brain: Brain;
  appContainer: HTMLDivElement;

  constructor(brain: Brain, appContainer: HTMLDivElement) {
    this.brain = brain;
    this.appContainer = appContainer;
    this.setScreenDimensions();
  }

  setScreenDimensions(
    width: number = document.documentElement.clientWidth,
    height: number = document.documentElement.clientHeight
  ) {
    this.width = width;
    this.height = height;

    let minDimension = Math.min(width, height);

    this.width = minDimension;
    this.height = minDimension;

    let scaleX = this.width / this.brain.width;
    let scaleY = this.height / this.brain.height;

    let minScale = Math.min(scaleX, scaleY);
    this.scaleX = minScale;
    this.scaleY = minScale;
  }

  calculateScaledX(x: number): number {
    return x * this.scaleX; //| 0;
  }

  calculateScaledY(y: number): number {
    return y * this.scaleY; // | 0;
  }

  createDiv(styles: Partial<CSSStyleDeclaration>): HTMLDivElement {
    const div = document.createElement("div");
    Object.assign(div.style, styles);
    return div;
  }

  drawBorderSingle(left: number, top: number, width: number, height: number) {
    let div = document.createElement("div");

    div.style.zIndex = "10";
    div.style.position = "fixed";

    div.style.left = left + "px";
    div.style.top = top + "px";

    div.style.width = width + "px";
    div.style.height = height + "px";
    div.style.backgroundColor = BORDER_COLOR;

    this.appContainer.append(div);
  }

  drawBorder() {
    // top
    this.drawBorderSingle(
      0,
      0,
      this.width,
      this.calculateScaledY(this.brain.borderThickness)
    );

    // bottom
    this.drawBorderSingle(
      0,
      this.height - this.calculateScaledY(this.brain.borderThickness),
      this.width,
      this.calculateScaledY(this.brain.borderThickness)
    );

    // left
    this.drawBorderSingle(
      0,
      0,
      this.calculateScaledX(this.brain.borderThickness),
      this.height
    );

    // right
    this.drawBorderSingle(
      this.width - this.calculateScaledX(this.brain.borderThickness),
      0,
      this.calculateScaledX(this.brain.borderThickness),
      this.height
    );
  }

  drawPaddle(paddle: Paddle) {
    let div = document.createElement("div");

    div.style.zIndex = "10";
    div.style.position = "fixed";

    div.style.left = this.calculateScaledX(paddle.left) + "px";
    div.style.top = this.calculateScaledY(paddle.top) + "px";

    div.style.width = this.calculateScaledX(paddle.width) + "px";

    div.style.height = this.calculateScaledY(paddle.height) + "px";
    div.style.backgroundColor = paddle.color;

    this.appContainer.append(div);
  }

  drawBrick(brick: Brick) {
    let div = document.createElement("div");

    div.style.zIndex = "10";
    div.style.position = "fixed";

    div.style.left = this.calculateScaledX(brick.left) + "px";
    div.style.top = this.calculateScaledY(brick.top) + "px";

    div.style.width = this.calculateScaledX(brick.width) + "px";

    div.style.height = this.calculateScaledY(brick.height) + "px";
    div.style.backgroundColor = brick.color;
    div.innerHTML = brick.brickLevel.toString();
    div.style.fontSize =
      this.calculateScaledX(this.brain.borderThickness) + "px";

    div.style.display = "flex";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";

    this.appContainer.append(div);
  }

  // draw bricks
  drawBricks() {
    this.brain.bricks.forEach((brick) => {
      // if (brick.isVisible) {
      this.drawBrick(brick);
      //  }
    });
  }

  drawBall(ball: Ball) {
    let div = document.createElement("div");

    div.style.zIndex = "5";
    div.style.position = "fixed";

    div.style.width = this.calculateScaledX(ball.radius) * 2 + "px";
    div.style.height = this.calculateScaledY(ball.radius) * 2 + "px";

    div.style.left = this.calculateScaledX(ball.left) + "px";
    div.style.top = this.calculateScaledY(ball.top) + "px";

    div.style.backgroundColor = ball.color;
    div.style.borderRadius = "50%";

    this.appContainer.append(div);
  }

  drawGameInfo() {
    let div = document.createElement("div");
    // Height - from top of the bottom border to bottom of the paddle
    let divHeight =
      this.calculateScaledY(this.brain.height) -
      this.calculateScaledY(this.brain.borderThickness) -
      this.calculateScaledY(this.brain.paddle.top) -
      this.calculateScaledY(this.brain.paddle.height);
    // Width - 2 * border thicknes
    let divWidth =
      this.calculateScaledX(this.brain.width) -
      this.calculateScaledX(this.brain.borderThickness) * 2;

    div.style.zIndex = "10";
    div.style.position = "fixed";

    div.style.left = this.calculateScaledX(this.brain.borderThickness) + "px";
    div.style.top =
      this.calculateScaledY(this.brain.height) -
      this.calculateScaledY(this.brain.borderThickness) -
      divHeight +
      "px";

    div.style.width = divWidth + "px";
    div.style.height = divHeight + "px";

    div.style.display = "flex";
    div.style.justifyContent = "space-between";
    div.style.alignItems = "center";

    // Create score div
    let scoreDiv = document.createElement("div");
    scoreDiv.style.color = TEXT_COLOR;
    scoreDiv.style.paddingLeft =
      this.calculateScaledX(this.brain.borderThickness) + "px";
    scoreDiv.style.borderRadius = "10px";
    scoreDiv.style.fontSize =
      this.calculateScaledX(this.brain.borderThickness) + "px";
    scoreDiv.innerHTML = "Score: " + this.brain.score;

    // Create level div
    let levelDiv = document.createElement("div");
    levelDiv.style.color = TEXT_COLOR;
    levelDiv.style.paddingRight =
      this.calculateScaledX(this.brain.borderThickness) + "px";
    levelDiv.style.borderRadius = "10px";
    levelDiv.style.fontSize =
      this.calculateScaledX(this.brain.borderThickness) + "px";
    levelDiv.innerHTML = "Level: " + this.brain.level;

    // Create lives div
    let livesDiv = document.createElement("div");
    livesDiv.style.color = TEXT_COLOR;
    livesDiv.style.paddingRight =
      this.calculateScaledX(this.brain.borderThickness) + "px";
    livesDiv.style.borderRadius = "10px";
    livesDiv.style.fontSize =
      this.calculateScaledX(this.brain.borderThickness) + "px";
    livesDiv.innerHTML = "Lives: " + this.brain.lives;

    div.append(scoreDiv);
    div.append(levelDiv);
    div.append(livesDiv);

    this.appContainer.append(div);
  }

  drawScoreBoard() {
    let div = document.createElement("div");

    div.style.zIndex = "10";
    div.style.position = "fixed";

    div.style.left =
      this.calculateScaledX(this.brain.width) +
      this.calculateScaledX(this.brain.borderThickness) +
      "px";
    div.style.top = this.calculateScaledY(this.brain.borderThickness) + "px";
    div.style.width =
      this.calculateScaledX(this.brain.width) -
      this.calculateScaledX(this.brain.borderThickness) * 2 +
      "px";
    div.style.color = TEXT_COLOR;
    div.style.borderRadius = "10px";
    div.style.fontSize =
      this.calculateScaledX(this.brain.borderThickness) + "px";

    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.justifyContent = "left";
    div.style.alignItems = "left";

    let titleDiv = document.createElement("div");
    titleDiv.innerHTML = "Top 5 scores: ";
    div.append(titleDiv);

    this.brain.scoreHistory.forEach((entry, index) => {
      let scoreDiv = document.createElement("div");
      scoreDiv.style.color = TEXT_COLOR;
      scoreDiv.style.fontSize =
        this.calculateScaledX(this.brain.borderThickness) + "px";
      scoreDiv.innerHTML = `${index + 1}) Score: ${entry.score}, Level: ${entry.level}`;
      div.append(scoreDiv);
    });

    this.appContainer.append(div);
  }

  drawGameMenu() {
    let divWidth =
      this.calculateScaledX(this.brain.width) -
      this.calculateScaledX(this.brain.borderThickness) * 2;

    let div = document.createElement("div");

    div.style.zIndex = "10";
    div.style.position = "fixed";

    div.style.left = this.calculateScaledX(this.brain.borderThickness) + "px";
    div.style.top = this.calculateScaledY(this.brain.height) / 2 + "px";
    div.style.width = divWidth + "px";

    div.style.color = TEXT_COLOR;
    div.style.borderRadius = "10px";
    div.style.fontSize =
      this.calculateScaledX(this.brain.borderThickness) + "px";

    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";

    if (this.brain.gameover) {
      let gameOverDiv = document.createElement("div");
      gameOverDiv.style.fontWeight = "bold";
      gameOverDiv.innerHTML = "Game Over";
      gameOverDiv.style.marginBottom = "10px";
      div.append(gameOverDiv);
    }

    if (this.brain.ball.isMoving === false) {
      let menuDiv = document.createElement("div");
      menuDiv.style.display = "flex";
      menuDiv.style.flexDirection = "column";
      menuDiv.style.justifyContent = "center";
      menuDiv.style.alignItems = "left";

      let startGameDiv = document.createElement("div");
      startGameDiv.innerHTML = "P) Start game";
      menuDiv.append(startGameDiv);

      let pauseGameDiv = document.createElement("div");
      pauseGameDiv.innerHTML = "O) Pause game";
      menuDiv.append(pauseGameDiv);

      div.append(menuDiv);
    }

    this.appContainer.append(div);
  }

  draw() {
    // clear previous render - need optimazation
    this.appContainer.innerHTML = "";

    this.setScreenDimensions();
    this.drawBorder();
    this.drawPaddle(this.brain.paddle);
    this.drawBricks();
    this.drawBall(this.brain.ball);
    this.drawGameInfo();
    this.drawScoreBoard();
    this.drawGameMenu();
  }
}
