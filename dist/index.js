"use strict";

var birthplace = require('./birthplace');
var random = require('./random');

// Check if date is before disregarding year.
function dateIsBefore(before, max) {
  var bNorm = new Date(0, before.getMonth(), before.getDate());
  var mNorm = new Date(0, max.getMonth(), max.getDate());
  return bNorm < mNorm;
}
function codeToDate(year, month, day) {
  var today = new Date();
  if (year == '00') {
    // A way to fix leap year bug
    year = today.getFullYear().toString().slice(0, 2) + '00';
  }
  var birthDate = new Date(year, month - 1, day);
  var age = today.getYear() - birthDate.getYear();

  // Works for now. Update this in year 2099.
  // For same year, checks if date has passed.
  if (age > 100 || age == 100 && dateIsBefore(birthDate, today)) {
    birthDate.setFullYear(birthDate.getFullYear() + 100);
  }

  // Check valid date.
  return birthDate.getDate() == day && birthDate.getMonth() == month - 1 ? birthDate : NaN;
}
function codeToGender(code) {
  return code % 2 === 0 ? 'female' : 'male';
}
function extractParts(icNum) {
  var regex = /^(\d{2})(\d{2})(\d{2})-?(\d{2})-?(\d{3})(\d{1})$/;
  var parts = icNum.match(regex);
  if (!parts) {
    throw new Error('Invalid MyKad number format');
  }
  return parts;
}
function isValid(icNum) {
  var parts;
  try {
    parts = extractParts(icNum);
  } catch (error) {
    return false;
  }
  var birthDate = codeToDate(parts[1], parts[2], parts[3]);
  return !isNaN(birthDate) && birthplace.isValid(parts[4]);
}
function parse(icNum, cb) {
  var parts;
  try {
    parts = extractParts(icNum);
  } catch (error) {
    if (!cb) throw error;
    return cb(error, null);
  }
  var parsedData = {
    birthDate: codeToDate(parts[1], parts[2], parts[3]),
    birthPlace: birthplace.parse(parts[4]),
    gender: codeToGender(parts[6])
  };
  if (cb) {
    return cb(null, parsedData);
  }
  return parsedData;
}
function format(icNum, cb) {
  var parts;
  try {
    parts = extractParts(icNum);
  } catch (error) {
    if (!cb) throw error;
    return cb(error, null);
  }
  var formatted = "".concat(parts[1]).concat(parts[2]).concat(parts[3], "-").concat(parts[4], "-").concat(parts[5]).concat(parts[6]);
  if (cb) {
    return cb(null, formatted);
  }
  return formatted;
}
function unformat(icNum, cb) {
  if (!cb) {
    try {
      var formatted = format(icNum);
      return formatted.replace(/-/g, '');
    } catch (error) {
      throw error;
    }
  }
  format(icNum, function (err, formatted) {
    if (err) {
      return cb(err, null);
    }
    return cb(null, formatted.replace(/-/g, ''));
  });
}
module.exports = {
  isValid: isValid,
  parse: parse,
  format: format,
  unformat: unformat,
  generateRandom: random.generateRandom
};