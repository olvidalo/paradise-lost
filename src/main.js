import './styles'

import Vue from 'vue'
// import VueMaterial from 'vue-material'
// import 'vue-material/dist/vue-material.min.css'
// import 'vue-material/dist/theme/default.css'
import App from './components/App.vue'

import Vuetify from 'vuetify'

import VueResource from 'vue-resource'

import { sync } from 'vuex-router-sync'

import store from './store'
import router from './router'

Vue.use(Vuetify)
Vue.use(VueResource)

sync(store, router)

const app = new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})