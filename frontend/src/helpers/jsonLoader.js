import axios from 'axios'

export const getEuropeCountries = () => axios.get(`dist/meta-info-europe-countries.min.json`)
export const getSwedishCounties = () => axios.get(`dist/meta-info-sweden-counties.min.json`)
export const getSwedishMunicipalities = () => axios.get(`dist/meta-info-sweden-municipalities.min.json`)
export const getSwedishCities = () => axios.get(`dist/meta-info-sweden-cities.min.json`)
