"use strict";

var birthplace = require('./birthplace');
function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomDate() {
  var today = new Date();
  var start = new Date();
  start.setFullYear(start.getFullYear() - 99);
  return new Date(start.getTime() + Math.random() * (today.getTime() - start.getTime()));
}
function twoDigitFormat(num) {
  return ('0' + num).slice(-2);
}
function dateToCode(date) {
  var code = '';
  code += date.getFullYear().toString().substr(2, 2);
  code += twoDigitFormat(date.getMonth() + 1);
  code += twoDigitFormat(date.getDate());
  return code;
}
function randomBirthplace() {
  var randomCode;
  do {
    randomCode = twoDigitFormat(randomNumberBetween(1, 99));
  } while (!birthplace.isValid(randomCode));
  return randomCode;
}
function randomSpecialNumber() {
  var code = '';
  for (var i = 0; i < 4; i += 1) {
    code += randomNumberBetween(0, 9);
  }
  return code;
}
function generateRandom() {
  return dateToCode(randomDate()) + randomBirthplace() + randomSpecialNumber();
}
module.exports = {
  generateRandom: generateRandom
};