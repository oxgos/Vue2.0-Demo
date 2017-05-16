// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router/index';

Vue.config.productionTip = false;
// 用Vue.extend构造器,创建一个App实例,并$mount挂载主要id
/* let MyApp = Vue.extend(App);
new MyApp({
  router
}).$mount('#app');*/
/* 实例Vue,绑定元素#app,引入router,渲染App,挂载$mount*/
new Vue({
  el: '#app',
  router,
  render: elm => elm(App)
}).$mount('#app');
/* 默认起始路径*/
 router.push('/goods');

