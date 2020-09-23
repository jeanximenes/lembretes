import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'

Vue.use(Router)

import routes from './router/router' 

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router: routes,
  render: h => h(App)
})
/*
new Vue({
  render: h => h(App),
}).$mount('#app')
*/