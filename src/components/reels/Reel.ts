import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";
import { gsap } from "gsap";

/**
 * GameReels class handles the creation and spinning of slot machine reels.
 */
export default class GameReels {
  private app: PIXI.Application;
  private reelGrid: PIXI.Sprite[][] = [];
  private spinning: boolean = false;
  private reelContainer: PIXI.Container = new PIXI.Container();
  private maskGraphics: PIXI.Graphics = new PIXI.Graphics();
  private posArr: { x: number; y: number }[][] = [];
  private gameResponseHandler;
  private winAnimation;
  private slideableReel;

  constructor(app: PIXI.Application, gameResponseHandler:any,winAnimation:any,reel:any) {
    this.app = app;
    this.winAnimation = winAnimation;
    this.slideableReel = reel;
    this.gameResponseHandler = gameResponseHandler;
    this.app.stage.addChild(this.reelContainer);
    this.reelContainer.position.set(0,25);
    this.createReels();
  }

  /**
   * Initializes the reels, mask, and spin button.
   */
  private createReels(): void {
    const rows = 4, columns = 5, reelWidth = 200, reelHeight = 200, gap = 2, startX = 440, startY = 85;
    this.createMask(startX, startY+45, columns, reelWidth, gap, rows, reelHeight -5);
    let reels =  this.gameResponseHandler.getMainGameResult().reels;
    for (let col = 0; col < columns; col++) {
      this.reelGrid[col] = [];
      let reel: PIXI.Container = new PIXI.Container();
      this.reelContainer.addChild(reel);
      for (let row = 0; row < rows; row++) {
        let reelId = reels[col].symbols[row+1];
        this.initializeSymbol(col, row, startX, startY, reelWidth, reelHeight,reelId,reel);
      }
    }

    this.createSpinButton();
  }

 /**
 * Creates a mask for the reel container to limit visible area.
 */
private createMask(startX: number, startY: number, columns: number, reelWidth: number, gap: number, rows: number, reelHeight: number): void {
  // Update maskGraphics with rect() and fill()
  this.maskGraphics
      .rect(startX - reelWidth / 2, startY - reelHeight / 2 + 42, columns * (reelWidth + gap), rows * reelHeight - 80)
      .fill(0xffffff);

  // Create new mask using rect() and fill()
  const mask = new PIXI.Graphics();
  mask.rect(startX - reelWidth / 2, startY - reelHeight / 2 + 102, columns * (reelWidth + 50), rows * reelHeight - 160)
      .fill(0xffffff);

  this.reelContainer.mask = mask;
}

  /**
   * Initializes a single symbol and adds it to the reel grid.
   */
  private initializeSymbol(col: number, row: number, startX: number, startY: number, reelWidth: number, reelHeight: number,reelId:number,reel:any): void {
    if (!this.posArr[col]) this.posArr[col] = [];
    const randomSymbolKey = this.getSymbolKey(reelId);
    let x = startX + col * reelWidth;
    let y = startY + (row * reelHeight) / 1.2;
    let symbol = Sprite.from(randomSymbolKey);
    symbol.x = x; 
    symbol.y = y;
    symbol.scale.set(0.5);
    this.posArr[col].push({ x, y });
    this.reelGrid[col].push(symbol);
    reel.addChild(symbol);
  }


  /**
   * Creates the spin button and adds functionality to trigger reel spins.
   */
  private createSpinButton(): void {
    const spinButton = PIXI.Sprite.from("spinButton");
    spinButton.x = 1500; spinButton.y = 320; spinButton.interactive = true; spinButton.scale.set(0.9);
    spinButton.on("pointerdown", () => !this.spinning && this.spinReels(spinButton));
    this.app.stage.addChild(spinButton);
  }

  /**
   * Retrieves a random symbol key for use in the reels.
   */
  private getSymbolKey(symbolId:any): string {
    return ["gefa_sym_9", "gefa_sym_10", "gefa_sym_A", "gefa_sym_h1", "gefa_sym_h2", "gefa_sym_h3", "gefa_sym_J", "gefa_sym_K", "gefa_sym_Q", "gefa_sym_scatter"][symbolId];
  }

  /**
   * Initiates the spinning animation for the reels.
   */
  private spinReels(spinButton:any): void {
    spinButton.interactive = false;
    this.spinning = true;
    this.startRemovingSymbols(0, () => this.addNewSymbolsToAllReels(() => {
      this.spinning = false;
      this.winAnimation.playWinAnimations(this.gameResponseHandler.getMainGameResult(), this.posArr, this.slideableReel,this.reelGrid,this.reelContainer,spinButton);
    }
    ));
  }

  /**
   * Animates the removal of existing symbols from the reels.
   */
  private startRemovingSymbols(reelIndex: number, onComplete: () => void): void {
  
    if (reelIndex >= this.reelGrid.length) {
      this.app.ticker.addOnce(() => onComplete()); // Delay before starting the next phase
      return;
    }
    const column = this.reelGrid[reelIndex], spinDuration = 300;
    column.forEach((symbol) => {
      gsap.to(symbol, {
        y: symbol.y + 800,
        duration: spinDuration / 1000,
        ease: "power2.inOut",
        onComplete: () => {
          symbol.destroy();
          const symbolIndex = column.indexOf(symbol);
          if (symbolIndex !== -1) column.splice(symbolIndex, 1);
        },
      });
    });
    PIXI.Ticker.shared.addOnce(() => setTimeout(() => this.startRemovingSymbols(reelIndex + 1, onComplete), 50));
  }

  /**
   * Adds new symbols to all reels and animates them into view.
   */
  private addNewSymbolsToAllReels(onComplete: () => void): void {
    const spinDuration = 500, newSymbols: PIXI.Sprite[][] = [];
    this.reelGrid.forEach((column, reelIndex) => {
      newSymbols[reelIndex] = [];
      let reels = this.gameResponseHandler.getMainGameResult().reels;
      for (let i = 0; i < 4; i++) {
        let reelId = reels[reelIndex].symbols[i+1];
        const randomSymbolKey = this.getSymbolKey(reelId), x = 0, y = 160 - 200 - i * 200, symbol = PIXI.Sprite.from(randomSymbolKey);
        symbol.anchor.set(0.5); symbol.x = x; symbol.y = y;
        symbol.scale.set(0.5);
        this.reelContainer.children[i].addChild(symbol);
        column.unshift(symbol);
        newSymbols[reelIndex].push(symbol);
      }
    });
    newSymbols.forEach((column, reelIndex) => {
      column.forEach((symbol, index) => {
        const delay = reelIndex * 100 + index * 20;
        symbol.x = this.posArr[reelIndex][3 - index].x + 80;
        setTimeout(() => gsap.to(symbol, { y: this.posArr[reelIndex][index].y + 80, duration: spinDuration / 1000, ease: "power2.inOut" }), delay);
      });
    });
    setTimeout(() => onComplete(), spinDuration + this.reelGrid.length * 200);
  }
}
