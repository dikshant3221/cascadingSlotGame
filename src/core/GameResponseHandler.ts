class GameResponseHandler {
  private response ={"mainGameResult":{"winnings":[{"wagerPositionId":10,"winFactor":2,"winSum":4,"wagerId":10,"winExtensions":[],"items":[{"point":{"x":0,"y":0},"symbol":1},{"point":{"x":1,"y":1},"symbol":1},{"point":{"x":2,"y":0},"symbol":1}],"highlight":{"payGroupMemberId":1,"occurrence":3},"lid":10,"eid":1},{"wagerPositionId":16,"winFactor":2,"winSum":4,"wagerId":16,"winExtensions":[],"items":[{"point":{"x":0,"y":1},"symbol":1},{"point":{"x":1,"y":1},"symbol":1},{"point":{"x":2,"y":0},"symbol":1}],"highlight":{"payGroupMemberId":1,"occurrence":3},"lid":16,"eid":1}],"creatorName":"MAIN_GAME","parameters":{},"childGameResult":{"winnings":[],"creatorName":"MAIN_GAME","parameters":{"LAST_ROUND_MATRIX":{"reelExtracts":{"0":{"visibleSymbolCount":3,"swingOffSize":1,"symbols":[1,4,3,5]},"1":{"visibleSymbolCount":3,"swingOffSize":1,"symbols":[2,4,3,6]},"2":{"visibleSymbolCount":3,"swingOffSize":1,"symbols":[0,0,2,9]},"3":{"visibleSymbolCount":3,"swingOffSize":1,"symbols":[3,3,2,3]},"4":{"visibleSymbolCount":3,"swingOffSize":1,"symbols":[4,4,5,5]}}}},"freeGameRound":0,"freeGamesTotal":0,"multiplier":1,"resultGeneratorKey":{"keyName":"SLIDE"},"baseRound":0,"reels":{"0":{"visibleSymbolCount":2,"swingOffSize":1,"symbols":[1,4,3]},"1":{"visibleSymbolCount":1,"swingOffSize":1,"symbols":[2,4]},"2":{"visibleSymbolCount":1,"swingOffSize":1,"symbols":[0,0]},"3":{"visibleSymbolCount":0,"swingOffSize":0,"symbols":[]},"4":{"visibleSymbolCount":0,"swingOffSize":0,"symbols":[]}}},"freeGameRound":0,"freeGamesTotal":0,"multiplier":1,"resultGeneratorKey":{"keyName":"SLOT_MACHINE"},"baseRound":1,"reels":{"0":{"visibleSymbolCount":3,"swingOffSize":1,"symbols":[3,1,1,5,5,4]},"1":{"visibleSymbolCount":3,"swingOffSize":1,"symbols":[4,3,1,6,6,0,0,7]},"2":{"visibleSymbolCount":3,"swingOffSize":1,"symbols":[0,1,2,9,4,6,5,7,3,3]},"3":{"visibleSymbolCount":3,"swingOffSize":1,"symbols":[3,3,2,3,0,0,0,8,1,1,6,2]},"4":{"visibleSymbolCount":3,"swingOffSize":1,"symbols":[4,4,5,5,2,2,0,0,8,8,7,4,3,3]}}},"nextGameActions":[{"id":"RISK_BLACKRED_CHOICE","minTotalWager":0,"maxTotalWager":0,"wagerCondition":"ADD","debitType":"WAGER","wagerPositions":[]},{"id":"RISK_LADDER_CHOICE","minTotalWager":0,"maxTotalWager":0,"wagerCondition":"ADD","debitType":"WAGER","wagerPositions":[]},{"id":"FINISH_GAME","minTotalWager":0,"maxTotalWager":0,"wagerCondition":"ADD","debitType":"WAGER","wagerPositions":[]}],"accounting":{"debit":60,"credit":8,"debitType":"WAGER","creditType":"WIN"},"uncommittedWinSum":8,"riskPot":8,"lastWagerSum":60,"nextGameFlowName":"RISK_CHOICE","responseType":"ACTION"}

  // Method to return the main game result from the response
  getMainGameResult() {
      return this.response.mainGameResult || null;
  }

  // Method to return winnings
  getWinnings() {
      return this.response.mainGameResult ? this.response.mainGameResult.winnings : [];
  }

  // Method to return next game actions
  getNextGameActions() {
      return this.response.nextGameActions || [];
  }


}

export default GameResponseHandler;
