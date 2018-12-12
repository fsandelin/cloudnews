function compareDates(a, b) {
  const dA = new Date(a.from);
  const dB = new Date(b.from);
  if (dA < dB) {
    return -1;
  }
  if (dA > dB) {
    return 1;
  }
  return 0;
}

function getNextDay(date) {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay;
}

function getPreviousDay(date) {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() - 1);
  return nextDay;
}

function getIncludedTimespans(newFrom, newUntil, timespans) {
  let tentFrom = null;
  let tentUntil = null;
  let placedFrom = false;
  const includedTimespans = [];
  for (let i = 0; i < timespans.length; i += 1) {
    tentFrom = new Date(timespans[i].from);
    tentUntil = new Date(timespans[i].until);
    if (!placedFrom) {
      if (newFrom > getNextDay(tentUntil)) {
        continue;
      } else {
        placedFrom = true;
      }
    }
    if (placedFrom) {
      if (newUntil < getPreviousDay(tentFrom)) {
        break;
      }
      includedTimespans.push(timespans[i]);
    }
  }
  return includedTimespans;
}

function getNewTimespan(inputFrom, inputUntil, timespans) {
  if (timespans.length === 0) return { from: inputFrom, until: inputUntil };
  const firstFrom = new Date(timespans[0].from);
  const lastUntil = new Date(timespans[timespans.length - 1].until);

  let newFrom = null;
  let newUntil = null;

  if (firstFrom < inputFrom) {
    newFrom = firstFrom;
  } else {
    newFrom = inputFrom;
  }

  if (lastUntil > inputUntil) {
    newUntil = lastUntil;
  } else {
    newUntil = inputUntil;
  }

  return { from: newFrom, until: newUntil };
}

module.exports = {
  compareDates,
  getNextDay,
  getPreviousDay,
  getIncludedTimespans,
  getNewTimespan,
};
