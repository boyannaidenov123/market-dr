module.exports = function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }