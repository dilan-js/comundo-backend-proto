const weekOfDate = (date) => {
  const monday = new Date(date);
  monday.setDate(date.getDate() - (date.getDay()||7) + 1);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 7);

  return { monday, sunday };
};

const formated = (date) => ([
  String(date.getDate()).padStart(2, '0'),
  String(date.getMonth() + 1).padStart(2, '0'),
  date.getFullYear(),
].join('/'));

const relativeWeek = (weeksAgo) => {
  const { monday, sunday } = weekOfDate(new Date());
  monday.setDate(monday.getDate() - weeksAgo * 7);
  sunday.setDate(sunday.getDate() - weeksAgo * 7);

  return { monday, sunday };
};

const oneWeek = 1000 * 60 * 60 * 24 * 7;

const isoWeek = (date) => {
  const _date = new Date(date.valueOf());
  const dayn = (date.getDay() + 6) % 7;
  _date.setDate(_date.getDate() - dayn + 3);
  const firstThursday = _date.valueOf();
  _date.setMonth(0, 1);
  if (_date.getDay() !== 4) {
    _date.setMonth(0, 1 + ((4 - _date.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - _date) / oneWeek);
};

/**
 * @description Calculates difference between node instance and target timezone (ms)
 * @param {string} timeZone Time zone name
 * @returns {number} milliseconds
 */
const getTimezoneDiff = (timeZone) => {
  const date = new Date();
  date.setMilliseconds(0);
  const localDate = date.toLocaleString("en", { timeZone, hour12: false });
  const diffDate = new Date(Date.parse(localDate));
  diffDate.setMilliseconds(0);
  return (date - diffDate);
};

const localMidnight = (date, timeZone) => {
  const tzDiff = getTimezoneDiff(timeZone);
  const d = new Date(date);
  d.setMilliseconds(-tzDiff);
  const midnight = new Date(d.toDateString());
  midnight.setMilliseconds(tzDiff);
  return midnight;
};

const offsetMinutesToDate = (date, minutes, tzDiff = 0) => {
  const d = new Date(date);
  d.setUTCHours(d.getUTCHours(), minutes, 0, tzDiff);
  return d;
};

const nodeTimezoneDiff = getTimezoneDiff("Etc/UTC");

module.exports = {
  formated,
  getTimezoneDiff,
  isoWeek,
  localMidnight,
  nodeTimezoneDiff,
  offsetMinutesToDate,
  relativeWeek,
  weekOfDate,
};
