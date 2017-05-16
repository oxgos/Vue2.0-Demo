<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <!--引入路由路径-->
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
     <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  /* 导入header组件*/
  import header from 'components/header/header.vue';

  import { urlParse } from 'common/js/util';

  /* 定义数据是否正确常量*/
  const ERR_OK = 0;

  export default {
    data () {
      return {
        /* 定义存放seller值*/
        seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
           })()
        }
      };
     },
    created () {
      /* Vue resource异步请求数据*/
      this.$http.get('/api/seller?id=' + this.seller.id).then(function(response) {
        if (response.body.errNo === ERR_OK) {
       /* this.seller = response.body.data;*/
        this.seller = Object.assign({}, this.seller, response.body.data);
      }
    });
  },
    /* 导入声明组件*/
    components: {
      'v-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl";

  #app
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      border-1px(rgba(7, 17 ,27, .1))
      .tab-item
        flex: 1
        text-align: center
        & > a
          display: block
          font-size: 14px
          color: rgb(77, 85, 93)
          &.active
            color: rgb(240, 20, 20)
</style>
