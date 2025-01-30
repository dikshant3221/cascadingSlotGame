import {Assets} from "pixi.js";

class AssetLoader {
  private static readonly ASSET_LIST = [
    { alias: "mainResourcesDesktop", src: "./assets/mainResourcesDesktop.json" },
    { alias: "mainResourcesHighQuality", src: "./assets/mainResourcesHighQuality.json" },
    { alias: "sym_high3", src: "./assets/sym_high3.json" },
    { alias: "spinButton", src: "./assets/spinButton.svg" },
    { alias: "backgrounds", src: "./assets/backgrounds.json" },
    { alias: "reel_elements", src: "./assets/reel_elements.json" },
    { alias: "features1a", src: "./assets/features1a.json" },
    { alias: "features2", src: "./assets/features2.json" },
    { alias: "count_up_atlas", src: "./assets/count_up_atlas.json" }
  ];

  async load() {
    await Assets.load(AssetLoader.ASSET_LIST);
  }
}

export default AssetLoader;
