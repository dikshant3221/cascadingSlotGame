import { Application } from "pixi.js";
import GameBackground from "./GameBackground";
import GameResponseHandler from "./GameResponseHandler";
import GameReels from "../components/reels/Reel";
import WinAnimation from "../components/animations/WinAnimation";
import SlideableReels from "../components/reels/SlideableReels";
import AssetLoader from "./AssetLoader";


class GameApp {
  private app!: Application;
  private gameComponents: {
    background?: GameBackground,
    reels?: GameReels,
    slideableReels?: SlideableReels,
    winAnimation?: WinAnimation
  } = {};

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      this.app = await this.createPixiApp();
      await this.loadAssets();
      this.initComponents();
    } catch (error) {
      console.error("Game initialization failed:", error);
    }
  }

  private async createPixiApp(): Promise<Application> {
    const app = new Application();
    await app.init({ background: "#000000", resizeTo: window });
    document.body.appendChild(app.canvas);
    return app;
  }

  private async loadAssets() {
    await new AssetLoader().load();
  }

  private initComponents() {
    const responseHandler = new GameResponseHandler();
    
    this.gameComponents.slideableReels = new SlideableReels(this.app);
    this.gameComponents.winAnimation = new WinAnimation(this.app);
    this.gameComponents.background = new GameBackground(this.app);
    
    this.gameComponents.reels = new GameReels(
      this.app,
      responseHandler,
      this.gameComponents.winAnimation,
      this.gameComponents.slideableReels
    );
  }
}

new GameApp();