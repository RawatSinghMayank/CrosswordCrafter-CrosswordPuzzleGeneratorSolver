const path = require('path');
const fs = require('fs');
const Trie = require('../models/Trie');
const DictionaryLoader = require('../models/DictionaryLoader');
const CrosswordGenerator = require('../models/CrosswordGenerator');
const CrosswordGridRepository = require('../repositories/CrosswordGridRepository');

class CrosswordService {
  constructor() {
    this.gridRepository = new CrosswordGridRepository();
  }

  async generateCrosswords() {
    try {
      const freqPath = path.join(__dirname, '../resources/dictionaries/ngram_freq_dict.csv');
      const dictPath = path.join(__dirname, '../resources/dictionaries/scrabble_words');

      if (!fs.existsSync(freqPath)) {
        throw new Error('Frequency file not found');
      }
      if (!fs.existsSync(dictPath)) {
        throw new Error('Dictionary file not found');
      }

      const freqs = DictionaryLoader.loadFrequenciesFromResource(freqPath);

      const hTrie = new Trie();
      DictionaryLoader.loadWordsFromResource(
        dictPath,
        5, // SIZE_W
        hTrie,
        20000, // MIN_FREQ_W
        freqs,
        new Set()
      );

      let vTrie = hTrie;
      if (5 !== 5) { // SIZE_W !== SIZE_H
        vTrie = new Trie();
        DictionaryLoader.loadWordsFromResource(
          dictPath,
          5, // SIZE_H
          vTrie,
          20000, // MIN_FREQ_H
          freqs,
          new Set()
        );
      }

      const solver = new CrosswordGenerator(hTrie, vTrie);
      const grids = solver.solveAndReturnGrids();

      // Save to MySQL
      for (const grid of grids) {
        await this.gridRepository.save(new (require('../models/CrosswordGrid'))(grid));
      }

      return grids;
    } catch (error) {
      console.error('Error generating crosswords:', error);
      throw error;
    }
  }

  async getRandomGrid() {
    try {
      const count = await this.gridRepository.count();
      if (count === 0) return null;

      const randomId = 1 + Math.floor(Math.random() * count);
      const grid = await this.gridRepository.findById(randomId);
      return grid ? grid.grid : null;
    } catch (error) {
      console.error('Error getting random grid:', error);
      return null;
    }
  }
}

module.exports = CrosswordService;
