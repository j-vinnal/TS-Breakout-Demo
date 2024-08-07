import { BRICK_COLOR } from "../colors";

export default class Brick {
  width = 100;
  height = 50;
  left = 0;
  top = 0;
  color = BRICK_COLOR;
  brickLevel = 1;

  constructor(
    left: number,
    top: number,
    width: number,
    height: number,
    level: number
  ) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.brickLevel = level;
  }

  hit() {
    if (this.brickLevel >= 1) {
      this.brickLevel = this.brickLevel - 1;
    }
  }
}
