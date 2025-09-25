import { Farkle } from "../../app/farkle.js";
import { expect } from "chai";
import * as assert from "assert";
import sinon from "../../node_modules/sinon/pkg/sinon-esm.js";
import readlineSync from "readline-sync";

let promptStub;
let consoleLogStub;

describe("Gathering Dice", () => {
  beforeEach(() => {
    promptStub = sinon.stub(readlineSync, "question");
    consoleLogStub = sinon.stub(console, "log");
  });

  afterEach(() => {
    promptStub.restore();
    consoleLogStub.restore();
  });

  it("Gathers 1 dice corectly", () => {
    const roll = [1, 2, 5, 6, 3, 4];
    const keptDice = "1";
    const expected = [1];

    promptStub.onCall(0).returns(keptDice);
    const actual = Farkle.gatherDice(roll, keptDice);

    assert.deepEqual(expected, actual);
  });

  it("Gathers 2 dice corectly", () => {
    const roll = [1, 2, 4, 6, 3, 4];
    const keptDice = "1 3";
    const actual = [1, 7];

    promptStub.onCall(0).returns(keptDice);
    const expected = Farkle.gatherDice(roll, keptDice);

    assert.deepEqual(actual, actual);
  });

  it("Validates user input for gathering dice - not rolled", () => {
    const roll = [1, 2, 5, 6, 3, 4];
    const incorrectInput = "7";
    const correctInput = "1";
    const expectedMessage = `Die(s) ${correctInput} was not rolled. Please choose dice from your roll.`;

    promptStub.onCall(0).returns(correctInput);
    const actual = Farkle.gatherDice(roll, incorrectInput);

    sinon.assert.calledWithMatch(consoleLogStub, expectedMessage);
    assert.deepEqual([1], actual);
  });

  it("Validates use input for gathering dice - non-scoring dice", () => {
    const roll = [1, 2, 5, 6, 3, 4];
    const incorrectInput = "6";
    const correctInput = "1";
    const expectedMessage =
      "Invalid input. Cannot keep non-scoring dice. Please enter the numbers of the dice you want to keep separated by spaces.";

    promptStub.onCall(0).returns(correctInput);
    const actual = Farkle.gatherDice(roll, incorrectInput);

    sinon.assert.calledWithMatch(consoleLogStub, expectedMessage);
    assert.deepEqual([1], actual);
  });

  it("Validates user input for gathering dice - invalid input", () => {
    const roll = [1, 2, 5, 6, 3, 4];
    const incorrectInput = "mario";
    const correctInput = "1";
    const expectedMessage =
      "Invalid input. Please enter the numbers of the dice you want to keep separated by spaces.";

    promptStub.onCall(0).returns(correctInput);
    const actual = Farkle.gatherDice(roll, incorrectInput);

    sinon.assert.calledWithMatch(consoleLogStub, expectedMessage);
    assert.deepEqual([1], actual);
  });
});
