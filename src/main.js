import Vue from 'vue';
import App from '@/App.vue';
import axios from 'axios';
Vue.prototype.$api = axios.create();

import { Auth0Plugin } from "./auth";
import router from '@/router';
import store from '@/store';

import moment from 'moment';
import VueQrcodeReader from "vue-qrcode-reader";
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

import 'bootstrap';
import './css/app.scss';


import VueMaterial from 'vue-material'
// import { MdButton, MdContent, MdTabs } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
// import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/default.css'
// import 'vue-material/dist/components/index.css'

window.$ = window.jQuery = require('jquery');

Vue.use(VueMaterial);
// Vue.use(MdButton)
// Vue.use(MdContent)
// Vue.use(MdTabs)



Vue.prototype.moment = moment;

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title(to);
  }
  // next();
  console.log("coming here");
  $.get("/session").then(session => {
    console.log("session", session);
    store.commit('setUser', session.user);
    // console.log("set user");
    // keepGoing();
    next();
  }).catch(() => {
    store.commit('setUser', null);
    // keepGoing();
    next();
  })
})

async function main() {

  let resp = await Vue.prototype.$api.get('/api/auth0-secrets');
  let secrets = resp.data;
  let domain = secrets.AUTH0_DOMAIN;
  let clientId = secrets.AUTH0_CLIENT_ID;

  Vue.use(Auth0Plugin, {
    domain,
    clientId
  });

  Vue.config.productionTip = false;

  new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App),
  });

}


main();
