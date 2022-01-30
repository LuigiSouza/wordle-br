export function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function xmur3(seed) {
  for (var i = 0, h = 1779033703 ^ seed.length; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

export function mapLimit(value, min, max) {
  return (value % (max - min)) + min;
}
