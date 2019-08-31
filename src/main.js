// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VeLine from 'v-charts/lib/line.common'
import router from './router'
import moment from 'moment'
import "./tools/filter";

Vue.config.productionTip = false

Vue.prototype.$moment = moment;

Vue.component(VeLine.name, VeLine)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
