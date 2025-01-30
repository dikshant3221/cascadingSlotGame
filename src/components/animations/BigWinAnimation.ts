import * as PIXI from "pixi.js";
import { gsap } from "gsap";
//----------------------- BigWinAnimation.ts -----------------------
class BigWinAnimation {
  private app: PIXI.Application;
  private animatedSprite?: PIXI.AnimatedSprite;

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  public play(): PIXI.AnimatedSprite {
    this.animatedSprite = this.createBigWinSprite();
    this.app.stage.addChild(this.animatedSprite);
    this.scaleUp();
    return this.animatedSprite;
  }

  private createBigWinSprite(): PIXI.AnimatedSprite {
    const textures = ["type1", "type2", "type3", "type4", "type5"].map(type =>
      PIXI.Texture.from(`gefa_bigwin_${type}`)
    );

    const sprite = new PIXI.AnimatedSprite(textures);
    sprite.animationSpeed = 1;
    sprite.loop = true;
    sprite.anchor.set(0.5);
    sprite.scale.set(0);
    sprite.position.set(920, 420);
    sprite.play();

    return sprite;
  }

  public scaleUp() {
    gsap.to(this.animatedSprite!.scale, {
      x: 0.6,
      y: 0.6,
      duration: 0.5,
      ease: "power2.out"
    });
  }

  public scaleDown(onComplete: () => void) {
    gsap.to(this.animatedSprite!.scale, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => this.destroy(onComplete)
    });
  }

  private destroy(onComplete: () => void) {
    this.app.stage.removeChild(this.animatedSprite!);
    this.animatedSprite!.destroy();
    onComplete();
  }
}

export default BigWinAnimation;