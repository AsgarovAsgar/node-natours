/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/users/login',
      data: { email, password }
    })
    if(res.data.status === 'success') {
      showAlert('success', 'Logged in successfully')
      window.setTimeout(()=> {
        location.assign('/')
      }, 1500)
    }
  } catch (error) {
    console.log(error.response.data);
    showAlert('error', error.response.data.message)
  }
}

export const logout = async (res, req) => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:8000/api/v1/users/logout',
    })
    if(res.data.status = 'success') location.reload(true)
  } catch (error) {
    showAlert('error', 'Error logging out. Please, try again later')
  }
}

