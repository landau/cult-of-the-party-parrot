'use strict';

module.exports = getRandomItem;

function getRandomItem(arr) {
  const len = arr.length - 1;
  const rand = Math.floor(Math.random() * len);
  return arr[rand];
}
