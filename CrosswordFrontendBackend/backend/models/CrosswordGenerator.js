const Trie = require('./Trie');

class CrosswordGenerator {
  constructor(hTrie, vTrie) {
    this.SIZE_W = 5;
    this.SIZE_H = 5;
    this.MIN_FREQ_W = 20000;
    this.MIN_FREQ_H = 20000;
    this.UNIQUE = true;
    this.DIAGONALS = false;
    
    this.VTRIE_SIZE = this.DIAGONALS ? this.SIZE_W + 2 : this.SIZE_W;
    
    this.grid = new Array(this.SIZE_H * this.SIZE_W);
    this.horizontalTrie = hTrie;
    this.verticalTrie = vTrie;
    this.generatedGrids = [];
  }

  solveAndReturnGrids() {
    const vTries = new Array(this.VTRIE_SIZE).fill(this.verticalTrie);
    this.boxSearch(this.horizontalTrie, vTries, 0);
    return this.generatedGrids;
  }

  boxSearch(trie, vTries, pos) {
    const v_ix = pos % this.SIZE_W;

    if (v_ix === 0) {
      if (pos === this.SIZE_H * this.SIZE_W) {
        this.collectGrid();
        return;
      }
      trie = this.horizontalTrie;
    }

    const iter = trie.iter();
    while (iter.next()) {
      if (!vTries[v_ix].hasIx(iter.getIx())) continue;
      this.grid[pos] = iter.getLetter();

      const backupV = vTries[v_ix];
      vTries[v_ix] = vTries[v_ix].descend(iter.getIx());

      this.boxSearch(iter.get(), vTries, pos + 1);
      vTries[v_ix] = backupV;
    }
  }

  collectGrid() {
    if (this.UNIQUE && this.SIZE_W === this.SIZE_H) {
      for (let i = 0; i < this.SIZE_H; i++) {
        let same = 0;
        for (let j = 0; j < this.SIZE_W; j++) {
          if (this.grid[i * this.SIZE_W + j] === this.grid[j * this.SIZE_W + i]) {
            same++;
          }
        }
        if (same === this.SIZE_W) return;
      }
    }

    let sb = '';
    for (let i = 0; i < this.SIZE_H; i++) {
      for (let j = 0; j < this.SIZE_W; j++) {
        sb += this.grid[i * this.SIZE_W + j];
      }
      sb += '\n';
    }
    this.generatedGrids.push(sb);
  }
}

module.exports = CrosswordGenerator;
