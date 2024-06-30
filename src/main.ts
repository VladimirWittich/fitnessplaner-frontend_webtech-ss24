// Importe
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaVue from '@okta/okta-vue';
import OktaSignIn from '@okta/okta-signin-widget';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/main.css';

// Definiere, ob wir uns auf localhost befinden
const isLocalhost = window.location.hostname === 'localhost';

// OktaSignIn Konfiguration
const oktaSignInConfig = {
    baseUrl: 'https://dev-50314961.okta.com',
    clientId: '0oai026m0zU1OtlHO5d7',
    redirectUri: '',
    authParams: {
        pkce: true,
        issuer: 'https://dev-50314961.okta.com/',
        scopes: ['openid', 'profile', 'email']
    },
    features: { registration: true },
    useInteractionCodeFlow: false,
    useClassicEngine: true,
};


if (isLocalhost) {
    oktaSignInConfig.redirectUri = 'http://localhost:5173/login/callback';
} else {
    oktaSignInConfig.redirectUri = 'https://fitnessplaner-frontend-webtech-ss24-e6t9.onrender.com/login/callback';
}

const oktaSignIn = new OktaSignIn(oktaSignInConfig);


const oktaAuthConfig = {
    issuer: 'https://dev-50314961.okta.com/oauth2/default',
    clientId: '0oai026m0zU1OtlHO5d7',
    redirectUri: window.location.origin + '/login/callback',
    scopes: ['openid', 'profile', 'email']
};

const oktaAuth = new OktaAuth(oktaAuthConfig);

// Erstelle die Vue-App
const app = createApp(App);

// Verwende OktaVue Plugin
app.use(OktaVue, {
    oktaAuth,
    onAuthRequired: () => {
        router.push('/login');
    },
    onAuthResume: () => {
        router.push('/login');
    }
});

app.use(router);

app.mount('#app');

export { oktaAuth, oktaSignIn };
