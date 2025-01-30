import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { Sprite } from "pixi.js";
export default class SlideableReels {
  private app;
  private frameAnim: any = [];
  private reelGrid: any;
  private dissolveSymbolPos: any = [];
  private isAnimating = false;
  private readonly REEL_ROWS = 4;
  private readonly REEL_COUNT = 5;
  private readonly SYMBOL_SIZE = 50;
  private readonly BASE_POSITION = { x: 100, y: 18 };
  private symbolHeight:number = 0;
  private mainGameResult:any;
  private reelContainer:any;
  private spinButton:any

  constructor(app: any) {
    this.app = app; // PIXI.Application instance
  }

    // Main cascading method
  public async removeWinningSymbols(): Promise<void> {
    if (this.isAnimating) return;
    this.isAnimating = true;

    try {
      // Step 1: Fade out winning symbols
      await this.fadeOutWinningSymbols();
      
      // Step 2: Shift remaining symbols down
      await this.shiftSymbolsDown();
      
      // Step 3: Add new symbols at top
      await this.addNewSymbols();
      this.spinButton.interactive = true;
    } finally {
      this.isAnimating = false;
    }
  }

  private async fadeOutWinningSymbols(): Promise<void> {
    const fadePromises: Promise<void>[] = [];
  
    for (const pos of this.dissolveSymbolPos) {
      const reel = pos.x;
      const row = this.REEL_ROWS - 1 - pos.y; // Convert to bottom-to-top index
      const symbol = this.reelGrid[reel][row];
  
      if (symbol) {
        fadePromises.push(
          new Promise((resolve) => {
            // Use GSAP to fade out the symbol
            gsap.to(symbol, {
              alpha: 0, // Target alpha
              duration: 0.5, // Adjust duration as needed
              onComplete: () => {
                this.app.stage.removeChild(symbol); // Remove the symbol from the stage
                symbol.destroy(); // Destroy the symbol to free memory
                this.reelGrid[reel][row] = null; // Update grid to reflect removal
                setTimeout(()=>{
                  resolve(); // Resolve the promise
                },500)
                
              },
            });
          })
        );
      }
    }
  
    await Promise.all(fadePromises); // Wait for all animations to complete
    this.dissolveSymbolPos = []; // Reset winning positions
  }
  

  private async shiftSymbolsDown(): Promise<void> {
    const movePromises: Promise<void>[] = [];

    for (let reelIndex = 0; reelIndex < this.REEL_COUNT; reelIndex++) {
        const reel = this.reelGrid[reelIndex];
        let emptyRows: number[] = []; // Track empty (null) positions
        let symbolsToMove: { row: number; symbol: Sprite }[] = []; // Track symbols that need to move

        // Step 1: Identify empty rows and symbols to move
        for (let row = 0; row < this.REEL_ROWS; row++) {
            if (!reel[row]) {
                // Collect empty row positions
                emptyRows.push(row);
            } else if (emptyRows.length > 0) {
                // Collect symbols that need to move
                symbolsToMove.push({ row, symbol: reel[row]! });
            }
        }

        // Step 2: Skip this reel if no empty rows exist or no symbols need to move
        if (emptyRows.length === 0 || symbolsToMove.length === 0) continue;

        // Step 3: Shift symbols into empty rows
        for (let i = 0; i < emptyRows.length && symbolsToMove.length > 0; i++) {
            const emptyRow = emptyRows[i];
            const { row: symbolRow, symbol } = symbolsToMove.shift()!;

            // Move the symbol to the empty row
            const targetY = this.calculateSymbolPosition(symbol,emptyRow);
            movePromises.push(this.animateSymbolMove(symbol, targetY));

            // Update the reel grid
            reel[emptyRow] = symbol;
            reel[symbolRow] = null;
        }
    }

    // Wait for all animations to complete
    await Promise.all(movePromises);
}


private async addNewSymbols(): Promise<void> {
  const createPromises: Promise<void>[] = [];

  for (let reel = 0; reel < this.REEL_COUNT; reel++) {
    const filledSlots = this.reelGrid[reel].filter((symbol: any) => symbol !== null).length;
    const symbolsToAdd = this.REEL_ROWS - filledSlots;

    if (symbolsToAdd > 0) {
      for (let i = 0; i < symbolsToAdd; i++) {
        const position = this.reelGrid[reel].findIndex((symbol: any) => symbol === null);

        if (position === -1) continue; // Skip if no empty slot found (shouldn't happen)

        const newSymbol = this.createRandomSymbol(reel, i);
        this.reelGrid[reel][position] = newSymbol;

        // Start the symbol above the reel (off-screen top)
        newSymbol.y = -this.symbolHeight;
        newSymbol.x = this.reelGrid[reel][0].x;
        const targetY = this.calculateSymbolPosition(this.reelGrid[reel][i], 4 - position);

        // Introduce a 1000ms delay before calling animateSymbolMove
        const delayedAnimation = new Promise<void>(resolve => {
          setTimeout(async () => {
            await this.animateSymbolMove(newSymbol, targetY);
            resolve();
          }, 100*reel);
        });

        createPromises.push(delayedAnimation);
      }
    }
  }

  await Promise.all(createPromises);
}


private animateSymbolMove(symbol: PIXI.Sprite, targetY: number): Promise<void> {
  return new Promise((resolve) => {
    gsap.killTweensOf(symbol);  // Ensure no conflicting animations
    gsap.to(symbol, {
      y: targetY,
      duration: 0.5,
      ease: "power1.out",
      onComplete: () => {
        resolve();
      }
    });
  });
}

private calculateSymbolPosition(symbol: PIXI.Sprite, position: number): number {
  // Calculate the target Y position based on the symbol's position in the grid
  // Adjust this calculation as needed to ensure proper spacing
  return  this.BASE_POSITION.y  + position * this.symbolHeight;
}


   /**
   * Retrieves a random symbol key for use in the reels.
   */
   private getSymbolKey(symbolId:any): string {
    return ["gefa_sym_9", "gefa_sym_10", "gefa_sym_A", "gefa_sym_h1", "gefa_sym_h2", "gefa_sym_h3", "gefa_sym_J", "gefa_sym_K", "gefa_sym_Q", "gefa_sym_scatter"][symbolId];
  }

  private createRandomSymbol(reel: number, row: number): PIXI.Sprite {
    let randomSymbolKey = this.getSymbolKey(this.mainGameResult.reels[reel].symbols[row+1]);
    const symbol = PIXI.Sprite.from(randomSymbolKey);
    symbol.x = this.calculateReelPosition(reel);
    symbol.y = this.calculateSymbolPosition(symbol,row);
    symbol.scale.set(0.5);
    symbol.anchor.set(0.5)
    this.reelContainer.children[reel].addChild(symbol);
    return symbol;
  }

  

  private calculateReelPosition(reel: number): number {
    return this.BASE_POSITION.x + reel * (this.SYMBOL_SIZE + 5);
  }


  public playDissolveAnm(framePos: any, posArr: any, reelGrid: any,mainGameResult:any,reelContainer:any,spinButton:any) {
    this.reelContainer = reelContainer;
    this.spinButton = spinButton;
    this.mainGameResult = mainGameResult;
    this.reelGrid = reelGrid;
    this.symbolHeight = this.reelGrid[0][0].height;
    const uniqueArray: any = [
      ...new Map(framePos.map((item: any) => [`${item.x}-${item.y}`, item])).values(),
    ];

    for (let i = 0; i < uniqueArray.length; i++) {
      if (uniqueArray[i].x < 3 && uniqueArray[i].y < 5) {
        this.frameAnim.push(
          this.createAndPlayDissolveAnimation(
            posArr[uniqueArray[i].x][uniqueArray[i].y].x + 80,
            posArr[uniqueArray[i].x][uniqueArray[i].y].y + 120
          )
        );

        this.dissolveSymbolPos.push({ x: uniqueArray[i].x, y: uniqueArray[i].y });
      }
    }

    this.removeWinningSymbols();
  }


  private createAndPlayDissolveAnimation(
    x: number = 0,
    y: number = 0,
    animationSpeed = 0.5,
    loop = false
  ) {
    const frames = [];
    for (let i = 0; i < 30; i++) {
      const frameName = `${"gefa_disapp_effect"}_${i.toString().padStart(3, "0")}`;
      frames.push(PIXI.Texture.from(frameName));
    }

    const animatedSprite = new PIXI.AnimatedSprite(frames);

    animatedSprite.animationSpeed = animationSpeed;
    animatedSprite.loop = loop;
    animatedSprite.play();

    animatedSprite.anchor.set(0.5);
    animatedSprite.scale.set(0.6);
    animatedSprite.x = x;
    animatedSprite.y = y;
    this.app.stage.addChild(animatedSprite);
    animatedSprite.onComplete = () => {
      animatedSprite.visible = false;
    };
    return animatedSprite;
  }
}
