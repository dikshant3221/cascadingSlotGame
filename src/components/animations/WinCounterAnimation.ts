import * as PIXI from "pixi.js";
//----------------------- WinCounterAnimation.ts -----------------------
class WinCounterAnimation {
  private app: PIXI.Application;
  private counterText?: PIXI.Text;
  private ticker = new PIXI.Ticker();

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  public play(targetValue: number) {
    // Clean up previous instance if exists
    if (this.counterText) {
      this.app.stage.removeChild(this.counterText);
      this.counterText.destroy();
    }

    // Create new text instance each time
    this.counterText = this.createCounterText();
    this.app.stage.addChild(this.counterText);
    this.animateCounter(targetValue);
  }

  private createCounterText(): PIXI.Text {
    const text = new PIXI.Text({
      text: "$0",
      style: {
        fontFamily: "Arial",
        fontSize: 60,
        fill: "#FFFFFF",
        fontWeight: "bold"
      }
    });

    text.anchor.set(0.5);
    text.position.set(920, 480);
    text.scale.set(0);
    return text;
  }

  private animateCounter(targetValue: number) {
    this.ticker.stop(); // Stop any existing animation
    const scaleUpDuration = 500;
    const counterDuration = 4000;
    const scaleDownDuration = 250;
    let elapsedTime = 0;
    let currentValue = 0;

    this.ticker.add((deltaTime: any) => {
      elapsedTime += deltaTime.deltaTime * PIXI.Ticker.shared.elapsedMS;

      if (!this.counterText) return;

      if (elapsedTime <= scaleUpDuration) {
        const scale = elapsedTime / scaleUpDuration;
        this.counterText.scale.set(scale);
        currentValue = Math.floor(targetValue * scale);
        this.counterText.text = `$${currentValue.toLocaleString()}`;
      } else if (elapsedTime <= scaleUpDuration + counterDuration) {
        const progress = (elapsedTime - scaleUpDuration) / counterDuration;
        currentValue = Math.floor(targetValue * progress);
        this.counterText.text = `$${currentValue.toLocaleString()}`;
      } else if (elapsedTime <= scaleUpDuration + counterDuration + scaleDownDuration) {
        const scale = 1 - ((elapsedTime - scaleUpDuration - counterDuration) / scaleDownDuration);
        this.counterText.scale.set(scale);
      } else {
        this.ticker.stop();
        if (this.counterText) {
          this.app.stage.removeChild(this.counterText);
          this.counterText.destroy();
          this.counterText = undefined;
        }
      }
    });

    this.ticker.start();
  }

  public destroy() {
    this.ticker.stop();
    this.ticker.destroy();
    if (this.counterText) {
      this.app.stage.removeChild(this.counterText);
      this.counterText.destroy();
      this.counterText = undefined;
    }
  }
}
export default WinCounterAnimation;