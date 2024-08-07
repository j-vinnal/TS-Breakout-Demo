import Brick from "./components/brick";
import Paddle from "./components/paddle";
import Ball from "./components/ball";

const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 1000;
const DEFAULT_BORDER_THICKNESS = 30;
const DEFAULT_PADDLE_POSITION = { left: 400, top: 850 };
const DEFAULT_BALL_POSITION = { left: 500, top: 500 };
const DEFAULT_BALL_RADIUS = 25;
const DEFAULT_BRICK_HEIGHT = 50;
const DEFAULT_BRICK_SPACING = 10;
const DEFAULT_COLUMNS = 10;
const DEFAULT_INITIAL_LIVES = 3;
const DEFAULT_INITIAL_LEVEL = 1;

export default class Brain {
  width: number = DEFAULT_WIDTH;
  height: number = DEFAULT_HEIGHT;
  borderThickness: number = DEFAULT_BORDER_THICKNESS;
  paddle = new Paddle(
    DEFAULT_PADDLE_POSITION.left,
    DEFAULT_PADDLE_POSITION.top
  );
  bricks: Brick[] = [];
  ball = new Ball(
    DEFAULT_BALL_POSITION.left,
    DEFAULT_BALL_POSITION.top,
    DEFAULT_BALL_RADIUS
  );
  score: number = 0;
  lives: number = DEFAULT_INITIAL_LIVES;
  level: number = DEFAULT_INITIAL_LEVEL;
  gameover = false;
  scoreHistory: { score: number; level: number }[] = [];

  constructor() {
    this.initializeGame();
  }

  initializeGame() {
    this.createBricks();
    this.resetBaddlePosition();
    this.createBall();
  }

  createBricks() {
    const brickHeightWithSpacing = DEFAULT_BRICK_HEIGHT + DEFAULT_BRICK_SPACING;
    const rows = this.level;
    const availableWidth = this.width - 2 * this.borderThickness;
    const brickWidth =
      (availableWidth - (DEFAULT_COLUMNS - 1) * DEFAULT_BRICK_SPACING) /
      DEFAULT_COLUMNS;

    this.bricks = [];

    for (let i = 0; i < DEFAULT_COLUMNS; i++) {
      for (let j = 0; j < rows; j++) {
        const left =
          this.borderThickness + i * (brickWidth + DEFAULT_BRICK_SPACING);
        const top = this.borderThickness + j * brickHeightWithSpacing;
        this.bricks.push(
          new Brick(left, top, brickWidth, DEFAULT_BRICK_HEIGHT, this.level)
        );
      }
    }
  }

  checkBrickCollision() {
    const ballLeft = this.ball.left;
    const ballRight = this.ball.left + this.ball.radius * 2;

    // Check if all bricks are destroyed and create new ones
    if (this.bricks.length === 0) {
      this.level = this.level + 1;

      this.initializeGame();

      this.ball.dx = this.ball.dx * 1.2;
      this.ball.dy = this.ball.dy * 1.2;
    }

    for (let i = 0; i < this.bricks.length; i++) {
      let brick = this.bricks[i];

      //Check if the ball has hit the brick with the left or right side
      if (
        ((ballRight + this.ball.dx >= brick.left &&
          ballLeft + this.ball.dx <= brick.left + brick.width) ||
          (ballLeft + this.ball.dx <= brick.left + brick.width &&
            ballRight + this.ball.dx >= brick.left)) &&
        //Check if the ball has hit the brick with the top side
        ((this.ball.top + this.ball.dy >= brick.top &&
          this.ball.top + this.ball.dy <= brick.top + brick.height) ||
          //Check if the ball has hit the brick with the bottom side
          (this.ball.top + this.ball.radius * 2 + this.ball.dy >= brick.top &&
            this.ball.top + this.ball.radius * 2 + this.ball.dy <=
              brick.top + brick.height))
      ) {
        this.ball.dy = -this.ball.dy;

        brick.hit();
        if (brick.brickLevel === 0) {
          this.bricks.splice(i, 1);
          this.score = this.score + this.level;
        }

        break;
      }
    }
  }

  resetBaddlePosition() {
    this.paddle = new Paddle(500 - 100, 1000 - 150);
  }

  createBall() {
    const ballLeft =
      this.paddle.left + this.paddle.width / 2 - DEFAULT_BALL_RADIUS;
    const ballTop = this.paddle.top - DEFAULT_BALL_RADIUS * 2;
    this.ball = new Ball(ballLeft, ballTop, DEFAULT_BALL_RADIUS);
  }

  checkPaddleCollision() {
    //defaul values
    //baddle position left = 400, right = 600
    //ball position left 475, right 525

    const ballBottom = this.ball.top + this.ball.radius * 2;
    const ballLeft = this.ball.left;
    const ballRight = this.ball.left + this.ball.radius * 2;
  
    if (
      ((ballRight + this.ball.dx >= this.paddle.left &&
        ballLeft + this.ball.dx <= this.paddle.left + this.paddle.width) ||
        (ballLeft + this.ball.dx <= this.paddle.left + this.paddle.width &&
          ballRight + this.ball.dx >= this.paddle.left)) &&
      ballBottom + this.ball.dy >= this.paddle.top &&
      ballBottom + this.ball.dy <= this.paddle.top + this.paddle.height
    ) {
      // Calculate collision position
      let collisionPosition = (this.ball.left + this.ball.radius) - (this.paddle.left + this.paddle.width / 2);
      collisionPosition = collisionPosition / (this.paddle.width / 2);
  
      // Calculate angle
      const angle = collisionPosition * Math.PI / 3; // 60 degrees
  
      // Update ball direction based on angle
      const speed = Math.sqrt(this.ball.dx * this.ball.dx + this.ball.dy * this.ball.dy);
      this.ball.dx = Math.sin(angle) * speed;
      this.ball.dy = -Math.cos(angle) * speed;
    }
  }
  
  checkBorderCollision() {
    if (this.ball.isMoving) {
      //check if ball is out of the game
      if (this.ball.top + this.ball.dy >= 1000 - this.borderThickness) {
        // Check if game is over, score should be saved
        if (this.lives === 0) {
          this.gameover = true;
          this.ball.stopMove();

          this.saveScore();
          return;
        }

        this.lives = this.lives - 1;
        this.createBall();
        this.ball.stopMove();
      }

      //check whether the ball has hit left or right border
      if (
        this.ball.left + this.ball.dx >=
          this.width - this.borderThickness - this.ball.radius * 2 ||
        this.ball.left + this.ball.dx <= this.borderThickness
      ) {
        this.ball.dx = -this.ball.dx; // Change ball direction on x-axis
      }

      //Check if the ball has hit the top border
      if (this.ball.top + this.ball.dy <= this.borderThickness) {
        this.ball.dy = -this.ball.dy; // Change ball direction on x-axis
      }

      this.ball.left += this.ball.dx;
      this.ball.top += this.ball.dy;
    }
  }

  saveScore() {
    this.scoreHistory.push({ score: this.score, level: this.level });
    this.scoreHistory.sort((a, b) => b.score - a.score);
    this.scoreHistory = this.scoreHistory.slice(0, 5);
  }

  startGame() {
    this.checkBorderCollision();
    this.checkPaddleCollision();
    this.checkBrickCollision();
  }

  newGame() {
    this.paddle = new Paddle(
      DEFAULT_PADDLE_POSITION.left,
      DEFAULT_PADDLE_POSITION.top
    );
    this.score = 0;
    this.level = DEFAULT_INITIAL_LEVEL;
    this.lives = DEFAULT_INITIAL_LIVES;
    this.gameover = false;

    this.initializeGame();
  }

  startMoveBall() {
    this.ball.startMove();
  }

  stopMoveBall() {
    this.ball.stopMove();
  }

  startMovePaddle(step: number) {
    if (this.ball.isMoving) {
      this.paddle.startMove(step, this.borderThickness, this.width);
    }
  }

  stopMovePaddle() {
    this.paddle.stopMove();
  }
}
