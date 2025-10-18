const fs = require('fs');
const path = require('path');

class DictionaryLoader {
  static loadFrequenciesFromResource(filePath) {
    const freqs = new Map();
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const lines = data.split('\n');
      
      let rank = 0;
      for (let i = 1; i < lines.length; i++) { // Skip header
        const line = lines[i].trim();
        if (line) {
          const word = line.split(',')[0].toUpperCase();
          freqs.set(word, rank++);
        }
      }
    } catch (error) {
      console.error('Error loading frequencies:', error);
    }
    return freqs;
  }

  static loadWordsFromResource(filePath, length, trie, minFreq, freqs, banned = new Set()) {
    let count = 0;
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const lines = data.split('\n');
      
      for (const line of lines) {
        const word = line.trim().toUpperCase();
        if (word.length !== length || banned.has(word)) continue;
        if (minFreq > 0 && (!freqs.has(word) || freqs.get(word) > minFreq)) continue;
        trie.add(word);
        count++;
      }
    } catch (error) {
      console.error('Error loading words:', error);
    }
    return count;
  }
}

module.exports = DictionaryLoader;
