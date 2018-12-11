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
