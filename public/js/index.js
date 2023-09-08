import '@babel/polyfill'
import { displayMap } from './mapbox'
import { login, logout } from './login'
import { updateData } from './updateSettings'

const mapBoxEl = document.getElementById('map')
const formEl = document.querySelector('.form--login')
const nameEl = document.querySelector('#name')
const emailEl = document.querySelector('#email')
const passwordEl = document.querySelector('#password')
const logOutBtn = document.querySelector('.nav__el--logout')
const userDataForm = document.querySelector('.form-user-data')

// delegation
if(mapBoxEl) {
  const locations = JSON.parse(mapBoxEl.dataset.locations)
  displayMap(locations)
}

if(formEl) {
  formEl.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = emailEl.value
    const password = passwordEl.value
    login(email, password)
  })
}

if(logOutBtn) {
  logOutBtn.addEventListener('click', logout)
}

if(userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = nameEl.value
    const email = emailEl.value
    updateData(name, email)
  })
}