import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/common.css'
import './assets/index.css'
import './assets/animate.css'
import 'whatwg-fetch'
import Index from './Index.vue'

Vue.use(ElementUI)

new Vue({
  el: '.container',
  render: h => h(Index)
})
