import Vue from 'vue';
import Router from 'vue-router';
import VueResource from 'vue-resource';
// 引入组件,语法:import 自定义名称 form './url'
import goods from 'components/goods/goods.vue';
import seller from 'components/seller/seller.vue';
import ratings from 'components/ratings/ratings.vue';

import 'common/stylus/index.styl';
// 安装vue-router插件
Vue.use(Router);
Vue.use(VueResource);
// 实例一个Router,并配置
export default new Router({
  linkActiveClass: 'active',
  routes: [
    {// 定义路径,关联组件
      path: '/goods',
      component: goods
    },
    {
      path: '/seller',
      component: seller
    },
    {
      path: '/ratings',
      component: ratings
    }
  ]
});
