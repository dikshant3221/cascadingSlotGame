import * as PIXI from "pixi.js";
import WinFrameAnimation from "./WinFrameAnimation"
import BigWinAnimation from "./BigWinAnimation"
import WinCounterAnimation from "./WinCounterAnimation"

//----------------------- WinAnimation.ts -----------------------
class WinAnimation {
  private frameAnimation: WinFrameAnimation;
  private bigWinAnimation: BigWinAnimation;
  private winCounter: WinCounterAnimation;
  private app: PIXI.Application;
  private spinButton:any;


  constructor(app: PIXI.Application) {
    this.app=app;
    this.frameAnimation = new WinFrameAnimation(app);
    this.bigWinAnimation = new BigWinAnimation(app);
    this.winCounter = new WinCounterAnimation(app);
  }

  public playWinAnimations(
   
    mainGameResult: any,
    positionArray: any[],
    slideableReel: any,
    reelGrid: any,
    reelContainer: any,
    spinButton:any
  ) {
    this.spinButton =spinButton;
    const framePositions = this.findWinAnimPositions(mainGameResult);
    this.winCounter = new WinCounterAnimation(this.app);
    this.frameAnimation.createFrameAnimations(framePositions, positionArray);

    setTimeout(() => {
      const bigWinAnim = this.bigWinAnimation.play();
      setTimeout(() => this.winCounter.play(10000), 500);
      setTimeout(() => this.cleanupAnimations(bigWinAnim, slideableReel, reelGrid, mainGameResult, reelContainer,positionArray), 5000);
    }, 2000);
  }

  private findWinAnimPositions(mainGameResult: any) {
    const winningPos = new Set<{ x: number; y: number }>();
    
    mainGameResult.winnings.forEach((winning: any) => {
      winning.items.forEach((item: any) => winningPos.add(item.point));
    });

    return Array.from(winningPos);
  }

  private cleanupAnimations(
    bigWinAnim: PIXI.AnimatedSprite,
    slideableReel: any,
    reelGrid: any,
    mainGameResult: any,
    reelContainer: any,
    positionArray:any
  ) {
    this.bigWinAnimation.scaleDown(() => {
      this.frameAnimation.clearExistingFrames();
      if (mainGameResult.childGameResult) {
        this.winCounter.destroy();
        slideableReel.playDissolveAnm(
          this.findWinAnimPositions(mainGameResult),
          positionArray,
          reelGrid,
          mainGameResult.childGameResult,
          reelContainer,
          this.spinButton
        );
      }
    });
  }
}

export default WinAnimation;