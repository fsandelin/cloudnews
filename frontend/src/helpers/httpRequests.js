import axios from 'axios'
import { baseUrl } from './constants'

export const getAvailableServices = (dispatch, action) => {
  axios.get(`${baseUrl}api/available_services`)
    .then(res => {
      dispatch(action, res.data)
    })
    .catch(err => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(err)
      }
    })
}

export const requestData = (dispatch, addNewsAction, makeNewsRequestAction) => ({ service, from, until, pageNumber }) => {
  axios.get(`${baseUrl}api/news`, { params: { service: service, from, until, pageNumber } })
    .then(res => {
      if (!res.status.toString().includes('204')) {
        dispatch(addNewsAction, res.data)
        setTimeout(() => {
          dispatch(makeNewsRequestAction, { service, from, until, pageNumber: pageNumber + 1 })
        }, 2000)
      }
    })
    .catch(err => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(err)
      }
    })
}
