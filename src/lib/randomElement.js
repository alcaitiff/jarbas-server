const randomElement = function (arr) {
  if (Array.isArray(arr)) {
    return arr[Math.floor(Math.random() * arr.length)];
  } else {
    return null;
  }
}
module.exports = randomElement;