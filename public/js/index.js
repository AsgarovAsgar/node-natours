import '@babel/polyfill'
import { displayMap } from './mapbox'
import { login, logout } from './login'
import { updateSettings } from './updateSettings'
import { bookTour } from './stripe'

const mapBoxEl = document.getElementById('map')
const formEl = document.querySelector('.form--login')
const nameEl = document.querySelector('#name')
const emailEl = document.querySelector('#email')
const passwordEl = document.querySelector('#password')
const logOutBtn = document.querySelector('.nav__el--logout')
const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')
const bookBtn = document.querySelector('#book-tour')

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
    const form = new FormData()
    form.append('name', nameEl.value)
    form.append('email', emailEl.value)
    form.append('photo', document.querySelector('#photo').files[0])

    updateSettings(form, 'data')
  })
}

if(userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    document.querySelector('.btn--save-password').textContent = 'Updating...'
    const passwordCurrent = document.querySelector('#password-current').value
    const password = document.querySelector('#password').value
    const passwordConfirm = document.querySelector('#password-confirm').value
    await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password')
    document.querySelector('.btn--save-password').textContent = 'Save password'
    document.querySelector('#password-current').value = ''
    document.querySelector('#password').value = ''
    document.querySelector('#password-confirm').value = ''
  })
}

if(bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processsing...'
    const { tourId } = e.target.dataset
    bookTour(tourId)
  })
}