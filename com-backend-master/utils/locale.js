const en = require("../constants/messages/en.json");
const es = require("../constants/messages/es.json");

const MESSAGES = {
  en,
  es,
};

const KEYS = Object.fromEntries(Object.keys(en).map((key) => [key, key]));

const $t = (locale, code) =>
  (MESSAGES[locale] && MESSAGES[locale][code]) || MESSAGES["es"][code];

module.exports = {
  $t,
  KEYS,
};
