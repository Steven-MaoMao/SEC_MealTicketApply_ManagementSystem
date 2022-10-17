import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import axios from 'axios'
import md5 from 'js-md5'

Vue.use(ElementUI)
Vue.prototype.$md5 = md5

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://localhost:8888'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
