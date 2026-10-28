/**
 * Parses cookie-date using algorithm defined in https://datatracker.ietf.org/doc/html/rfc6265#section-5.1.1.
 * The algorithm is lenient and recognizes various date formats used in the wild,
 * e.g. rfc1123-date, rfc850-date or asctime-date.
 *
 * @param {string} cookieDate
 * @returns {Date | undefined} - undefined when cookie-date cannot be parsed
 */

// eslint-disable-next-line no-control-regex
const delimiter = /[\x09\x20-\x2F\x3B-\x40\x5B-\x60\x7B-\x7E]+/;
const timeProduction = /^(\d{1,2}):(\d{1,2}):(\d{1,2})(?:\D[\s\S]*)?$/;
const dayOfMonthProduction = /^(\d{1,2})(?:\D[\s\S]*)?$/;
const monthProduction = /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i;
const yearProduction = /^(\d{2,4})(?:\D[\s\S]*)?$/;
const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const parseCookieDate = (cookieDate) => {
  const tokens = String(cookieDate)
    .split(delimiter)
    .filter((token) => token.length > 0);
  let time;
  let dayOfMonth;
  let month;
  let year;

  for (const token of tokens) {
    let match;

    if (time === undefined && (match = timeProduction.exec(token)) !== null) {
      time = match.slice(1, 4).map(Number);
    } else if (dayOfMonth === undefined && (match = dayOfMonthProduction.exec(token)) !== null) {
      dayOfMonth = Number(match[1]);
    } else if (month === undefined && (match = monthProduction.exec(token)) !== null) {
      month = months.indexOf(match[1].toLowerCase());
    } else if (year === undefined && (match = yearProduction.exec(token)) !== null) {
      year = Number(match[1]);
    }
  }

  if (time === undefined || dayOfMonth === undefined || month === undefined) return undefined;
  if (year === undefined) return undefined;

  if (year >= 70 && year <= 99) year += 1900;
  if (year >= 0 && year <= 69) year += 2000;

  const [hour, minute, second] = time;

  if (dayOfMonth < 1 || dayOfMonth > 31) return undefined;
  if (year < 1601) return undefined;
  if (hour > 23 || minute > 59 || second > 59) return undefined;

  const date = new Date(Date.UTC(year, month, dayOfMonth, hour, minute, second));

  // reject non-existent dates, e.g. 31 Feb
  if (date.getUTCMonth() !== month || date.getUTCDate() !== dayOfMonth) return undefined;

  return date;
};

export default parseCookieDate;
