import '@babel/polyfill'
import { displayMap } from './mapbox'
import { login } from './login'

const mapBoxEl = document.getElementById('map')
// delegation
if(mapBoxEl) {
  const locations = JSON.parse(mapBoxEl.dataset.locations)
  displayMap(locations)
}

const formEl = document.querySelector('.form')
const emailEl = document.querySelector('#email')
const passwordEl = document.querySelector('#password')

if(formEl) {
  formEl.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = emailEl.value
    const password = passwordEl.value
    login(email, password)
  })
}