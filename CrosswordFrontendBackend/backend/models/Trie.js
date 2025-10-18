class Trie {
  constructor() {
    this.NUM_LETTERS = 26;
    this.nodes = new Array(this.NUM_LETTERS).fill(null);
  }

  add(str) {
    let ptr = this;
    for (const c of str) {
      const ix = c.charCodeAt(0) - 'A'.charCodeAt(0);
      if (ix < 0 || ix >= this.NUM_LETTERS) {
        throw new Error(`Invalid character: ${c}`);
      }
      if (ptr.nodes[ix] === null) {
        ptr.nodes[ix] = new Trie();
      }
      ptr = ptr.nodes[ix];
    }
  }

  has(str) {
    let ptr = this;
    for (const c of str) {
      const ix = c.charCodeAt(0) - 'A'.charCodeAt(0);
      if (ix < 0 || ix >= this.NUM_LETTERS) return false;
      if (ptr.nodes[ix] === null) return false;
      ptr = ptr.nodes[ix];
    }
    return true;
  }

  descend(ix) {
    return this.nodes[ix];
  }

  hasIx(ix) {
    return this.nodes[ix] !== null;
  }

  hasLetter(c) {
    return this.nodes[c.charCodeAt(0) - 'A'.charCodeAt(0)] !== null;
  }

  iter() {
    return new TrieIter(this.nodes);
  }
}

class TrieIter {
  constructor(nodes) {
    this.nodes = nodes;
    this.ix = -1;
    this.NUM_LETTERS = 26;
  }

  next() {
    while (++this.ix < this.NUM_LETTERS) {
      if (this.nodes[this.ix] !== null) return true;
    }
    return false;
  }

  getIx() {
    return this.ix;
  }

  getLetter() {
    return String.fromCharCode(this.ix + 'A'.charCodeAt(0));
  }

  get() {
    return this.nodes[this.ix];
  }
}

module.exports = Trie;
