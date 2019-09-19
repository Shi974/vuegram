import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
const fb = require('./firebaseConfig')
import './assets/scss/app.scss'

Vue.config.productionTip = false

// handle page reloads
let app
fb.auth.onAuthStateChanged(user => {
  if (!app) {
    // app = new Vue({
    //   el: '#app',
    //   router,
    //   store,
    //   render: h => h(App)
    // })
    app = new Vue({
      router,
      store,
      // render: function (h) { return h(App) }
      render: h => h(App)
    }).$mount('#app')
  }
})