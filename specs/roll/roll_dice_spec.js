import { Farkle } from "../../app/farkle.js";
import sinon from "../../node_modules/sinon/pkg/sinon-esm.js";
import readlineSync from "readline-sync";

let getValidPlayerCountStub;
let rollDiceStub;
let promptStub;
let consoleLogStub;

describe("Rolling Dice", () => {
  beforeEach(() => {
    getValidPlayerCountStub = sinon.stub(Farkle, "getValidPlayerCount");
    rollDiceStub = sinon.stub(Farkle, "rollDice");
    promptStub = sinon.stub(readlineSync, "question");
    consoleLogStub = sinon.stub(console, "log");
  });

  afterEach(() => {
    getValidPlayerCountStub.restore();
    rollDiceStub.restore();
    promptStub.restore();
    consoleLogStub.restore();
  });

  it("Roll 8 dice again after rolling a sweep", () => {
    const playerScores = [0, 0];
    const playerOneRoll = [1, 2, 3, 4, 5, 6];
    const playerTwoRoll = [1, 4, 2, 5, 1, 3];
    const currentPlayer = 1;
    const expectedMessage =
      "All dice used, would you like to roll 6 more dice? (y/n)";

    getValidPlayerCountStub.onCall(0).returns(2);
    promptStub.onCall(0).returns("n");
    promptStub.onCall(1).returns("y");
    promptStub.onCall(2).returns("y");
    rollDiceStub.onCall(0).returns(playerOneRoll);
    rollDiceStub.onCall(1).returns(playerTwoRoll);
    Farkle.playRound(currentPlayer, playerScores);

    sinon.assert.calledWithMatch(promptStub, expectedMessage);
  });

  it("Farkle rolls are reported", () => {
    const playerScores = [0, 0];
    const farkle_roll = [2, 4, 6, 1, 3, 6];
    const currentPlayer = 1;
    const expectedMessage = "Farkle! You scored 0 points.";

    rollDiceStub.onCall(0).returns(farkle_roll);
    Farkle.playRound(currentPlayer, playerScores);

    sinon.assert.calledWithMatch(consoleLogStub, expectedMessage);
  });
});
