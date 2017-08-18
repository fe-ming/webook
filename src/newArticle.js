import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'whatwg-fetch'
import './assets/common.css'
import './assets/newArticle.css'
import './assets/animate.css'
import NewArticle from './NewArticle.vue'

Vue.use(ElementUI)

new Vue({
  el: '.container',
  render: h => h(NewArticle)
})
