import { Farkle } from "../../app/farkle.js";
import { expect } from "chai";
import sinon from "../../node_modules/sinon/pkg/sinon-esm.js";

let getValidPlayerCountStub;
let initializePlayerScoresStub;
let playRoundStub;
let consoleLogStub;

describe("Win condition", () => {
  beforeEach(() => {
    getValidPlayerCountStub = sinon.stub(Farkle, "getValidPlayerCount");
    initializePlayerScoresStub = sinon.stub(Farkle, "initializePlayerScores");
    playRoundStub = sinon.stub(Farkle, "playRound");
    consoleLogStub = sinon.stub(console, "log");
  });

  afterEach(() => {
    getValidPlayerCountStub.restore();
    initializePlayerScoresStub.restore();
    playRoundStub.restore();
    consoleLogStub.restore();
  });

  it("should play the game and exit when a player has won", () => {
    const playerScores = [9000, 0];
    const expectedMessage = `Congratulations Player 2, you won with a score of ${playerScores[0]}!`;

    initializePlayerScoresStub.onCall(0).returns(playerScores);
    getValidPlayerCountStub.onCall(0).returns("2");
    Farkle.startGame();

    sinon.assert.calledWithMatch(consoleLogStub, expectedMessage);
  });
});
