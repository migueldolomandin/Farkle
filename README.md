# Farkle

Farkle is a dice game where players roll combinations of six 6-sided dice to score points, keeping any scoring dice between throws. 
The game ends when a player reaches a certain number of points, usually 10,000. Farkle is easy to learn and can be enjoyed by players of all ages.

---

## How to Play

### Each Player's Turn

- The player must roll all six dice at once.
- The player must set aside any scoring dice after each roll.
- The player can choose to end their turn and keep the points they have scored, or they can continue rolling the remaining dice.
- If the player rolls dice but none of them score, they have "farkled" and lose all their points for that turn.

### Scoring

Here are the different ways you can score points in Farkle:

- **1** = 100 points
- **5** = 50 points
- **Three of a kind** (other than three 1's) = 100 times the number on the dice (e.g. three 4's = 400 points)
- **Four of a kind** = 1000 points
- **Five of a kind** = 2000 points
- **Six of a kind** = 3000 points
- **Three pairs** = 1500 points
- **Two triplets** = 2500 points
- **Four of a kind with a pair** = 1500 points
- **Straight (1-6)** = 1500 points

### Winning

The game ends when a player reaches 10,000 points. The first player to reach that score is the winner!

### Scoring Threshold

In this version of the game, you can only begin accumulating points once you have thrown 500 or more points on a throw. 
After that threshold, every round following that you can score and add any number of points to your total score.

---

## Running the Tests

- Open a terminal.
- In the terminal, run the following command to execute all tests: `npm run start`

---

## Running the Game

- Open a terminal.
- In the terminal, run the following command to start the application: `node app`

---

## Game Logic: [Some] Possible Player Actions

### Roll Dice

- Roll 6 dice at the start of your turn
- Roll the dice you did not keep, keeping at least 1 dice per throw until you decide to end your turn or you roll a farkle

### Gather Dice

- You must gather at least 1 dice per throw
- You cannot keep non-scoring dice

### Win Condition

- Once a player reaches 10,000 points on their turn, they win and the game ends

---

## Tasks

- Identify and fix broken tests
- Add a test in any of the existing test suites under 'specs'
- Create a new test suite, add one simple test
- Identify potential issues/improvements