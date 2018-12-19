const flatten = (arr) => [].concat.apply([], arr);

const findStringInText = (str, strList) => {
  return strList.find(s => str.toLowerCase().includes(s.toLowerCase()));
};

const dateIsGiven = (body) => {
  return (body !== undefined && body.from !== undefined && body.from !== '' && body.until !== undefined);
};

const stripTimeOfDate = (date) => date.substr(0, 10);

const getDateRange = (from, until) => {
  const dates = [];
  for (const date = new Date(until); date >= new Date(from); date.setDate(date.getDate() - 1)) {
    dates.push(date.toISOString());
  }
  return dates;
};

module.exports = {
  flatten,
  findStringInText,
  dateIsGiven,
  stripTimeOfDate,
  getDateRange
};
