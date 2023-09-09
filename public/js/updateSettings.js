/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'

// type is either password or data
export const updateSettings = async (data, type) => {
  console.log({data});
  try {
    const url = type === 'password' 
      ? 'http://localhost:8000/api/v1/users/updateMyPassword' 
      : 'http://localhost:8000/api/v1/users/updateMe'
    const res = await axios({
      method: 'PATCH',
      url,
      data
    })
    if(res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`)
      // window.setTimeout(()=> {
      //   location.assign('/me')
      // }, 1500)
    }
  } catch (error) {
    console.log(error.response.data);
    showAlert('error', error.response.data.message)
  }
}

