const random = require("./random");

module.exports = function configName(isTrader) {
  const number = random(10, 100000);
  if (isTrader) {
    return "Trader" + number;
  }
  return "User" + number;
};
