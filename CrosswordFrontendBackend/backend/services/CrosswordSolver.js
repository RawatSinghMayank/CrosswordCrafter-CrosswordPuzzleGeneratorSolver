class CrosswordSolver {
  constructor() {
    this.size = 5;
  }

  setSize(size) {
    this.size = size;
  }

  insertVerticallyIfPossible(row, col, index, crossword, words, wordFill) {
    const word = words[index];
    const length = word.length;

    if (row + length > this.size) return false;

    if (row > 0 && crossword[row - 1][col] !== '+') return false;

    if (row + length < this.size && crossword[row + length][col] !== '+') return false;

    let count = 0;
    let tempRow = row;

    for (let i = 0; i < word.length; i++) {
      if (crossword[tempRow][col] === '+') {
        return false;
      } else if (crossword[tempRow][col] === '-') {
        count++;
      } else if (crossword[tempRow][col] === word[i]) {
        count++;
      } else {
        return false;
      }
      tempRow++;
    }

    tempRow = row;

    if (count === word.length) {
      for (let i = 0; i < word.length; i++) {
        if (crossword[tempRow][col] !== word[i]) {
          crossword[tempRow][col] = word[i];
          wordFill[index][i] = true;
        }
        tempRow++;
      }
      return true;
    }

    return false;
  }

  insertHorizontalIfPossible(row, col, index, crossword, words, wordFill) {
    const word = words[index];
    const length = word.length;

    if (col + length > this.size) return false;

    if (col > 0 && crossword[row][col - 1] !== '+') return false;

    if (col + length < this.size && crossword[row][col + length] !== '+') return false;

    let count = 0;
    let tempCol = col;

    for (let i = 0; i < word.length; i++) {
      if (crossword[row][tempCol] === '+') {
        return false;
      } else if (crossword[row][tempCol] === '-') {
        count++;
      } else if (crossword[row][tempCol] === word[i]) {
        count++;
      } else {
        return false;
      }
      tempCol++;
    }

    tempCol = col;

    if (count === word.length) {
      for (let i = 0; i < word.length; i++) {
        if (crossword[row][tempCol] !== word[i]) {
          crossword[row][tempCol] = word[i];
          wordFill[index][i] = true;
        }
        tempCol++;
      }
      return true;
    }

    return false;
  }

  removeHorizontal(row, col, index, crossword, words, wordFill) {
    for (let i = 0; i < words[index].length; i++) {
      if (wordFill[index][i]) {
        crossword[row][col + i] = '-';
      }
      wordFill[index][i] = false;
    }
  }

  removeVertically(row, col, index, crossword, words, wordFill) {
    for (let i = 0; i < words[index].length; i++) {
      if (wordFill[index][i]) {
        crossword[row + i][col] = '-';
      }
      wordFill[index][i] = false;
    }
  }

  crosswordPuzzle(crossword, words, listener) {
    const wordFill = new Array(words.length);
    for (let i = 0; i < words.length; i++) {
      wordFill[i] = new Array(words[i].length).fill(false);
    }

    this.solveCrosswordPuzzle(crossword, 0, words, wordFill, listener);
    return crossword;
  }

  solveCrosswordPuzzle(crossword, index, words, wordFill, listener) {
    if (index >= words.length) {
      if (listener) listener.onStep(crossword, index, 'solved');
      return true;
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (crossword[i][j] === '-' || crossword[i][j] === words[index][0]) {
          // Try horizontal placement
          let inserted = this.insertHorizontalIfPossible(i, j, index, crossword, words, wordFill);
          if (inserted) {
            if (listener) listener.onStep(crossword, index, 'placed');

            if (this.solveCrosswordPuzzle(crossword, index + 1, words, wordFill, listener))
              return true;

            this.removeHorizontal(i, j, index, crossword, words, wordFill);
            if (listener) listener.onStep(crossword, index, 'removed');
          }

          // Try vertical placement
          inserted = this.insertVerticallyIfPossible(i, j, index, crossword, words, wordFill);
          if (inserted) {
            if (listener) listener.onStep(crossword, index, 'placed');

            if (this.solveCrosswordPuzzle(crossword, index + 1, words, wordFill, listener))
              return true;

            this.removeVertically(i, j, index, crossword, words, wordFill);
            if (listener) listener.onStep(crossword, index, 'removed');
          }
        }
      }
    }
    return false;
  }

  sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }
}

module.exports = CrosswordSolver;
