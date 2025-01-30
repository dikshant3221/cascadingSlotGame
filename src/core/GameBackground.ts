// GameBackground.ts
import { Application, Sprite } from "pixi.js";
import * as PIXI from "pixi.js";
export default class GameBackground {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
    this.createBackground();
  }

  createBackground() {
    // Add the background image
    const gameBackground = Sprite.from("gefa_back_basegame");

    // Position it at the top-left corner
    gameBackground.x = 0;
    gameBackground.y = 0;

    // Scale the background to fit the game screen
    gameBackground.width = this.app.screen.width;
    gameBackground.height = this.app.screen.height;

    // Add background to stage
    this.app.stage.addChild(gameBackground);

    // Additional elements (like clover hit and fixed line tags)
    this.createLogo();
    this.lineFixedTag();
  }

  private createLogo() {
    const frames = [];
    for (let i = 0; i <= 25; i++) {
      const frame = `gefa_title_${i.toString().padStart(3, "0")}`;
      frames.push(PIXI.Texture.from(frame));
    }
    const animatedSprite = new PIXI.AnimatedSprite(frames);
    animatedSprite.animationSpeed = 0.5; // Adjust speed
    animatedSprite.loop = true;
    animatedSprite.play();
    animatedSprite.position.set(718, -40);
    this.app.stage.addChild(animatedSprite);
  }

  lineFixedTag() {
    // Add cloverHit image
    const cloverHit = Sprite.from("linesBackground");
    cloverHit.x = 125;
    cloverHit.y = 470;
    cloverHit.rotation = 0;
    cloverHit.width = cloverHit.height + 50;
    cloverHit.height = cloverHit.width + 45;
    this.app.stage.addChild(cloverHit);

    // Add fixed image
    const fixed = Sprite.from("100Fixed");
    fixed.x = 140;
    fixed.y = 470;
    fixed.rotation = 0; 
    fixed.width = fixed.height + 15;
    fixed.height = fixed.width + 115;
    this.app.stage.addChild(fixed);
  }
}
