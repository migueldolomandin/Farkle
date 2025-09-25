// Set up the game
import readlineSync from "readline-sync";

const COMBOS = {
  STRAIGHT: 1500,
  THREE_PAIRS: 1500,
  TWO_TRIPLETS: 2500,
  FOUR_OF_A_KIND: 1000,
  FIVE_OF_A_KIND: 2000,
  SIX_OF_A_KIND: 3000,
  FOUR_OF_A_KIND_WITH_A_PAIR: 1500,
};
let sweep = false;

class _Farkle {
  // Function to roll the dice
  rollDice(numDice) {
    const dice = [];
    for (let i = 0; i < numDice; i++) {
      dice.push(Math.floor(Math.random() * 6) + 1);
    }
    return dice;
  }

  calculateScore(roll) {
    let counts = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < roll.length; i++) {
      counts[roll[i] - 1]++;
    }

    const sortedDice = roll.sort();
    const uniqueDice = [...new Set(sortedDice)];
    let x_of_a_kind = null;
    let score = 0;
    // Check for scoring combinations
    switch (true) {
      case counts.includes(4) && counts.includes(2):
        sweep = true;
        return COMBOS.FOUR_OF_A_KIND_WITH_A_PAIR;
      case counts.includes(4):
        x_of_a_kind = this.findValueOccurringXTimes(roll, 4);
        score = COMBOS.FOUR_OF_A_KIND;
        if(counts[0] + counts[4] === 2) sweep = true
        break;
      case counts.includes(5):
        x_of_a_kind = this.findValueOccurringXTimes(roll, 5);
        score = COMBOS.FIVE_OF_A_KIND;
        switch(x_of_a_kind) {
          case 1:
            if(counts[4] === 1) sweep = true;
            break
          case 5:
            if(counts[0] === 1) sweep = true;
            break
          default:
            if(counts[0] + counts[4] === 1) sweep = true
        }
        break;
      case counts.includes(6):
        sweep = true;
        return COMBOS.SIX_OF_A_KIND;
      case uniqueDice.length == 6:
        sweep = true;
        return COMBOS.STRAIGHT;
      case uniqueDice.length == 3 &&
        counts[uniqueDice[0] - 1] == 2 &&
        counts[uniqueDice[1] - 1] == 2 &&
        counts[uniqueDice[2] - 1] == 2 &&
        roll.length == 6:
        sweep = true;
        return COMBOS.THREE_PAIRS;
      case uniqueDice.length == 2 &&
        counts[uniqueDice[0] - 1] == 3 &&
        counts[uniqueDice[1] - 1] == 3 &&
        roll.length == 6:
        sweep = true;
        return COMBOS.TWO_TRIPLETS;
      case counts.includes(3):
        switch (counts.indexOf(3) + 1) {
          case 1:
            x_of_a_kind = 1;
            score = 300;
            break;
          default:
            x_of_a_kind = this.findValueOccurringXTimes(roll, 3);
            score = (counts.indexOf(3) + 1) * 100;
            if(x_of_a_kind != 5 && counts[0] + counts[4] === 3) sweep = true
        }
    }
    if (x_of_a_kind != null) {
      switch (true) {
        case x_of_a_kind != 1 && x_of_a_kind != 5:
          return score + (counts[0] * 100 + counts[4] * 50);
        case x_of_a_kind == 1:
          return score + counts[4] * 50;
        case x_of_a_kind == 5:
          return score + counts[0] * 100;
        default:
          return score;
      }
    }
    return score + counts[0] * 100 + counts[4] * 50;
  }

  gatherDice(roll, keep) {
    const keepDice = keep.length != "" ? keep.split(" ").map(Number) : keep;
    const rolledDice = roll.slice();

    // Remove kept dice from rolled dice
    const keptDiceInRoll = [];
    for (let i = 0; i < rolledDice.length && keepDice.length > 0; i++) {
      const index = keepDice.indexOf(rolledDice[i]);
      if (index !== -1) {
        keptDiceInRoll.push(rolledDice[i]);
        keepDice.splice(index, 1);
        rolledDice.splice(i, 1);
        i--;
      }
    }

    // Validate kept dice
    if (keepDice.length > 0) {
      console.log(
        `Die(s) ${keepDice.join(
          ", "
        )} was not rolled. Please choose dice from your roll.`
      );
      return this.gatherDice(
        roll,
        readlineSync.question("Which dice would you like to keep? ")
      );
    }

    // Ensure at least one die was kept
    if (keptDiceInRoll.length === 0) {
      console.log(
        "You must keep at least one die. Please choose dice to keep."
      );
      return this.gatherDice(
        roll,
        readlineSync.question("Which dice would you like to keep? ")
      );
    }

    // Check that input contains only whitespace and numbers
    const diceToKeepArray = keep.trim().split(/\s+/).map(Number);
    if (diceToKeepArray.some(isNaN)) {
      console.log(
        "Invalid input. Please enter the numbers of the dice you want to keep separated by spaces."
      );
      return this.gatherDice(
        roll,
        readlineSync.question("Which dice would you like to keep? ")
      );
    }

    // Check that kept dice doesn't contain any non-scoring dice
    const diceToKeepScoresArray = diceToKeepArray.map((dice) =>
      this.calculateScore([dice])
    );
    const sortedDice = diceToKeepArray.sort();
    const uniqueDice = [...new Set(sortedDice)];
    if (diceToKeepScoresArray.some((x) => x === 0)) {
      switch (diceToKeepArray.length) {
        case 1:
        case 2:
          console.log(
            "Invalid input. Cannot keep non-scoring dice. Please enter the numbers of the dice you want to keep separated by spaces."
          );
          return this.gatherDice(
            roll,
            readlineSync.question("Which dice would you like to keep? ")
          );
        case 3:
        case 4:
        case 5:
          if (uniqueDice.length != 1) {
            console.log(
              "Invalid input. Cannot keep non-scoring dice. Please enter the numbers of the dice you want to keep separated by spaces."
            );
            return this.gatherDice(
              roll,
              readlineSync.question("Which dice would you like to keep? ")
            );
          }
          break;
        case 6:
          this.calculateScore(diceToKeepArray);
          if (!sweep) {
            sweep = false;
            console.log(
              "Invalid input. Cannot keep non-scoring dice. Please enter the numbers of the dice you want to keep separated by spaces."
            );
            return this.gatherDice(
              roll,
              readlineSync.question("Which dice would you like to keep? ")
            );
          }
          break;
      }
    }
    let counts = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < roll.length; i++) {
      counts[roll[i] - 1]++;
    }

    return keptDiceInRoll;
  }

  removeDice(rolledDice, keptDice) {
    for (let i = 0; i < keptDice.length; i++) {
      const index = rolledDice.indexOf(keptDice[i]);
      if (index !== -1) {
        rolledDice.splice(index, 1);
      }
    }
    return rolledDice;
  }

  printDice(roll) {
    const diceChars = [
      [" _____ ", "|     |", "|  o  |", "|_____|"],
      [" _____ ", "|    o|", "|     |", "|o____|"],
      [" _____ ", "|    o|", "|  o  |", "|o____|"],
      [" _____ ", "|o   o|", "|     |", "|o___o|"],
      [" _____ ", "|o   o|", "|  o  |", "|o___o|"],
      [" _____ ", "|o   o|", "|o   o|", "|o___o|"],
    ];

    for (let i = 0; i < 4; i++) {
      let row = "";
      for (let j = 0; j < roll.length; j++) {
        row += diceChars[roll[j] - 1][i] + " ";
      }
      console.log(row);
    }
    console.log(`\nYou rolled: ${roll.join(" ")}`);
  }

  findValueOccurringXTimes(arr, x) {
    const occurrenceMap = arr.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
    const result = Object.entries(occurrenceMap).find(
      ([_, count]) => count === x
    );
    return result ? Number(result[0]) : undefined;
  }

  sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
  }

  getValidPlayerCount() {
    this.sleep(1000);
    let playerCount = readlineSync.question("Enter number of players: ");
    if (isNaN(playerCount)) {
      console.log("Invalid input.");
      this.getValidPlayerCount();
      return;
    }
    return playerCount;
  }

  initializePlayerScores(playerCount) {
    return new Array(Number(playerCount)).fill(0);
  }

  playRound(currentPlayer, playerScores) {
    console.log(`Player ${currentPlayer + 1}, it's your turn!`);
    let roll = this.rollDice(6);
    this.printDice(roll);

    let roundScore = 0;

    while (true) {
      sweep = false;
      const scoreForDice = this.calculateScore(roll);
      if (scoreForDice == 0) {
        console.log(`Farkle! You scored 0 points.`);
        roundScore = 0;
        break;
      }

      console.log(`You can score ${scoreForDice} points with this roll.`);
      const rollAgain = readlineSync.question(
        "Do you want to roll again? (y/n) "
      );

      if (rollAgain.toLowerCase() === "n") {
        roundScore += scoreForDice;
        if (sweep == true) {
          console.log(`You chose to keep ${roundScore} points this throw.`);
          const rollSixDiceAgain = readlineSync.question(
            "All dice used, would you like to roll 6 more dice? (y/n) "
          );
          if (rollSixDiceAgain.toLowerCase() === "y") {
            roll = this.rollDice(6);
            this.printDice(roll);
            continue;
          }
        }
        console.log(`You chose to keep ${roundScore} points this round.`);
        if (playerScores[currentPlayer] == 0 && roundScore < 500) {
          console.log(
            "You didn't score more or equal to 500 points, discarding points, ending turn"
          );
          break;
        }
        playerScores[currentPlayer] += roundScore;
        console.log(`Your total score is now ${playerScores[currentPlayer]}.`);
        break;
      }

      const diceToKeepArray = this.gatherDice(
        roll,
        readlineSync.question(
          "Which dice do you want to keep? (Enter as a space-separated list, e.g. 1 4 5) "
        )
      );

      const scoreForKeptDice = this.calculateScore(diceToKeepArray);
      roundScore += scoreForKeptDice;
      console.log(
        `You chose to keep dice ${diceToKeepArray} which score ${scoreForKeptDice} points.`
      );

      const diceToRoll = this.removeDice(roll, diceToKeepArray);

      console.log(`Score so far this round: ${roundScore}.`);
      if (diceToRoll.length == 0) {
        if (sweep === true) {
          console.log(
            `You kept dice ${diceToKeepArray} which is a sweep, rolling 6 dice again\n`
          );
          roll = this.rollDice(6);
          this.printDice(roll);
          continue;
        }
        console.log(
          `You kept dice ${diceToKeepArray} and used all your dice. Ending turn\n`
        );
        if (playerScores[currentPlayer] == 0 && roundScore < 500) {
          console.log(
            "You didn't score more or equal to 500 points, discarding points"
          );
          break;
        }
        playerScores[currentPlayer] += roundScore;
        break;
      }
      roll = this.rollDice(diceToRoll.length);
      this.printDice(roll);
      console.log(
        `You kept dice ${diceToKeepArray} and rolled: ${roll.join(" ")}.\n`
      );
    }
  }

  checkPlayerHasWon(currentPlayer, score) {
    if (score >= 8000) {
      console.log(
        `Congratulations Player ${
          currentPlayer + 1
        }, you won with a score of ${score}!`
      );
      return true;
    }
    return false;
  }

  startGame() {
    console.log(`Let's play Farkle!`);
    const playerCount = this.getValidPlayerCount();
    const playerScores = this.initializePlayerScores(playerCount);
    let currentPlayer = 0;
    while (true) {
      this.playRound(currentPlayer, playerScores);
      if (
        this.checkPlayerHasWon(currentPlayer, playerScores[currentPlayer]) ==
        true
      ) {
        console.log(
          `Congratulations Player ${
            currentPlayer + 1
          }, you won with a score of ${playerScores[currentPlayer]}!`
        );
        break;
      }
      console.log(
        `Player ${currentPlayer + 1} turn ends, total score: ${
          playerScores[currentPlayer]
        }\n\n`
      );
      currentPlayer = (currentPlayer + 1) % playerCount;
      this.sleep(1500);
    }
  }
}

export const Farkle = new _Farkle();
