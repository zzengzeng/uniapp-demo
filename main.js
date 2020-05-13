import Vue from 'vue'
import App from './App'

import store from './store'

Vue.config.productionTip = false

import vueFilter from './static/js/filters'
for (let key in vueFilter) {
  Vue.filter(key, vueFilter[key])
}

Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
