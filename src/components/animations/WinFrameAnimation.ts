import * as PIXI from "pixi.js";
//----------------------- WinFrameAnimation.ts -----------------------
class WinFrameAnimation {
  private app: PIXI.Application;
  private frames: PIXI.AnimatedSprite[] = [];

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  public createFrameAnimations(framePositions: any[], positionArray: any[]) {
    this.clearExistingFrames();
    
    for (const position of framePositions) {
      if (position.x < 3 && position.y < 5) {
        const { x, y } = positionArray[position.x][position.y];
        const frame = this.createFrameAnimation(x + 80, y + 105);
        this.frames.push(frame);
      }
    }
  }

  private createFrameAnimation(x: number, y: number): PIXI.AnimatedSprite {
    const textures = Array.from({ length: 14 }, (_, i) =>
      PIXI.Texture.from(`gefa_glow_size_3b_${i.toString().padStart(2, "0")}`)
    );

    const animatedSprite = new PIXI.AnimatedSprite(textures);
    animatedSprite.animationSpeed = 0.5;
    animatedSprite.loop = true;
    animatedSprite.anchor.set(0.5);
    animatedSprite.scale.set(0.8);
    animatedSprite.position.set(x, y);
    animatedSprite.play();

    this.app.stage.addChild(animatedSprite);
    return animatedSprite;
  }

  public clearExistingFrames() {
    this.frames.forEach(frame => {
      this.app.stage.removeChild(frame);
      frame.destroy();
    });
    this.frames = [];
  }
}

export default WinFrameAnimation;
