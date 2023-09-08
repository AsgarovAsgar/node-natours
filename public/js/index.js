import '@babel/polyfill'
import { displayMap } from './mapbox'
import { login, logout } from './login'

const mapBoxEl = document.getElementById('map')
const formEl = document.querySelector('.form')
const emailEl = document.querySelector('#email')
const passwordEl = document.querySelector('#password')
const logOutBtn = document.querySelector('.nav__el--logout')

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