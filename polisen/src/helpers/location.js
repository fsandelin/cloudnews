const counties = require('./../assets/counties.json');
const municipalities = require('./../assets/municipalities.json');
const { findStringInText } = require('./misc');

const municipalityWithSuffix = (municipality) => {
  if (municipality === undefined) {
    return null;
  }
  if (municipalities[municipality + ' kommun'] !== undefined) {
    return municipality + ' kommun';
  }
  if (municipalities[municipality + 's kommun'] !== undefined) {
    return municipality + 's kommun';
  }
  if (municipality === 'Falun') {
    return 'Falu kommun';
  }
  return null;
};

const createLocationObject = (county, municipality, city) => {
  return {
    country: 'Sweden',
    county: county || '',
    municipality: municipality || '',
    city: city || ''
  };
};

const findLocationForMunicipalityNews = (news) => {
  const municipality = municipalityWithSuffix(news.location.name);
  if (municipality === undefined) return createLocationObject();

  const { county, cities } = municipalities[municipality];
  const city = findStringInText(news.summary, cities);

  return createLocationObject(county, municipality, city)
};

const formatMunicipalityStrings = (municipalities) => {
  return Object.keys(municipalities).map((c) => c.substr(0, c.length - 7)); // Remove ' kommun'
};

const findLocationForCountyNews = (news) => {
  const municipalities = counties[news.location.name];
  if (municipalities === undefined) return createLocationObject();

  const municipalityList = formatMunicipalityStrings(municipalities);
  const municipalityWithoutSuffix = findStringInText(news.summary, municipalityList);
  const municipality = municipalityWithSuffix(municipalityWithoutSuffix);

  return createLocationObject(news.location.name, municipality);
};

const findLocation = (news) => {
  if (news.location.name.substr(-3) === 'län') {
    return findLocationForCountyNews(news);
  }
  if (news.location.name.substr(-6) === 'kommun') {
    return findLocationForMunicipalityNews(news);
  }
  return createLocationObject();
};

module.exports = {
  findLocation
};
