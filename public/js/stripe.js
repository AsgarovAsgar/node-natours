import axios from 'axios'
import { showAlert } from './alerts'

const stripe = Stripe('pk_test_51NostTKyaA7GbyZM1FeAgdsecqbHAvtxILRTzrlpmnd65YYLF1Pwo4UFt9dszgpL1rYT44jq3eFovC0D9M9Jq7lE00Ug0iH4fu')

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`)

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    })
  } catch (error) {
    console.log(error);
    showAlert('error', error)
  }
}