<template>
  <!--添加/减少购物商品组件-->
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" @click.stop.prevent="decreaseCart($event)" v-show="food.count>0">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{ food.count }}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    props: {
      /* 关联goods.vue数据food*/
      food: {
        type: Object
      }
    },
    methods: {
      /* addCart方法:点击后,添加购买商品数量*/
      addCart(e) {
        /* 去除pc端时触发的点击事件*/
        if (!e._constructed) {
          return;
        }
        if (!this.food.count) {
          /* 设置对象的属性(添加数据里没有的属性的方法,前面需import Vue from 'vue')*/
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        this.$emit('drop', e.target);
      },
      /* decreaseCart方法:点击后,减少购买商品数量*/
      decreaseCart(e) {
        if (!e._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "stylus/control.stylus";
</style>
