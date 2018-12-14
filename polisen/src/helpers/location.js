const counties = require('./assets/counties.json');
const municipalities = require('./assets/municipalities.json');
const { findStringInText } = require('./misc');

const municipalityWithSuffixOrEmptyString = (municipality) => {
  if (municipality === undefined || municipality === '') {
    return '';
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
};

const findLocationForMunicipalityNews = (news) => {
  const municipality = municipalityWithSuffixOrEmptyString(news.location.name);
  if (municipality === '') return {};

  const { county, cities } = municipalities[municipality];
  const city = findStringInText(news.summary, cities);

  return {
    country: 'Sweden',
    county: county,
    municipality: municipality,
    city: city
  };
};

const formatMunicipalityStrings = (municipalities) => Object.keys(municipalities).map((c) => c.substr(0, c.length - 7)); // Remove ' kommun'

const findLocationForCountyNews = (news) => {
  const municipalityList = formatMunicipalityStrings(counties[county_temp]);
  const municipality = municipalityWithSuffixOrEmptyString(findStringInText(news.summary, municipalityList));

  return {
    country: 'Sweden',
    county: news.location.name,
    municipality: municipality,
    city: ''
  };
};

const findLocation = (news) => {
  if (news.location.name.substr(-3) === 'län') {
    return findLocationForCountyNews(news);
  }
  if (news.location.name.substr(-6) === 'kommun') {
    return findLocationForMunicipalityNews(news);
  }
  return {
    country: 'Sweden',
    county: '',
    municipality: '',
    city: ''
  };
};

module.exports = {
  findLocation
};