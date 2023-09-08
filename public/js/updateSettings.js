/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'

export const updateData = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:8000/api/v1/users/updateMe',
      data: { name, email }
    })
    if(res.data.status === 'success') {
      showAlert('success', 'Updated successfully')
      // window.setTimeout(()=> {
      //   location.assign('/me')
      // }, 1500)
    }
  } catch (error) {
    console.log(error.response.data);
    showAlert('error', error.response.data.message)
  }
}

