import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { OktaAuth } from '@okta/okta-auth-js'
import OktaVue from '@okta/okta-vue'
import OktaSignIn from '@okta/okta-signin-widget'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const isLocalhost = window.location.hostname === 'localhost';

const oktaSignIn = new OktaSignIn({
    baseUrl: 'https://dev-35229771.okta.com/',
    clientId: '0oahgn5stel9AdhFq5d7',
    redirectUri: isLocalhost ? 'http://localhost:5173/login/callback' : 'https://fitnessplaner-frontend-webtech-ss24-e6t9.onrender.com/login/callback',
    authParams: {
        pkce: true,
        issuer: 'https://dev-35229771.okta.com/oauth2/default',
        display: 'page',
        scopes: ['openid', 'profile', 'email']
    },
    features: { registration: true },
    useInteractionCodeFlow: false,
    useClassicEngine: true,
})

const oktaAuth = new OktaAuth({
    issuer: 'https://dev-35229771.okta.com/oauth2/default',
    clientId: '0oahgn5stel9AdhFq5d7',
    redirectUri: isLocalhost ? 'http://localhost:5173/login/callback' : 'https://fitnessplaner-frontend-webtech-ss24-e6t9.onrender.com/login/callback',
    scopes: ['openid', 'profile', 'email']
})

const app = createApp(App)

app.use(OktaVue, {
    oktaAuth,
    onAuthRequired: () => {
        router.push('/login')
    },
    onAuthResume: () => {
        router.push('/login')
    } })
app.use(router)

app.mount('#app')

export { oktaAuth, oktaSignIn }