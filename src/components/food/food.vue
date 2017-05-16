<template>
  <div>
    <transition name="move">
      <div class="food" v-show="showFlag" ref="foodPage">
        <div class="food-content">
          <div class="image-header">
            <img :src="food.image">
            <div class="back" @click="hide">
              <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <div class="content">
            <h1 class="title">{{ food.name }}</h1>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="now">￥{{ food.price }}</span><span class="old" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food" @drop="_drop"></cartcontrol>
            </div>
            <transition name="fade">
              <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count===0">加入购物车</div>
            </transition>
          </div>
          <split v-show="food.info"></split>
          <div class="info" v-show="food.info">
            <h1 class="title">商品信息</h1>
            <p class="text">{{ food.info }}</p>
          </div>
          <split></split>
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <ratingSelect @changeType="changeType" @changeContent="changeContent" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingSelect>
            <div class="rating-wrapper">
              <ul v-show="food.ratings && food.ratings.length">
                <li class="rating-item border-1px" v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings">
                  <div class="user">
                    <span class="name">{{ rating.username }}</span>
                    <img class="avatar" :src="rating.avatar" alt="" width="12" height="12">
                  </div>
                  <div class="time">{{ rating.rateTime | formatDate }}</div>
                  <p class="text">
                    <span :class="{'icon-thumb_up': rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>{{ rating.text }}
                  </p>
                </li>
              </ul>
              <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  /* 导入一个js模块function*/
  import {formatDate} from 'common/js/date.js';
  /* 导入BScroll插件*/
  import BScroll from 'better-scroll';
  /* 导入cartcontrol组件*/
  import cartcontrol from 'components/cartcontrol/cartcontrol.vue';
  /* 导入split组件*/
  import split from 'components/split/split.vue';
  /* 导入ratingSelect组件*/
  import ratingSelect from 'components/ratingSelect/ratingSelect.vue';

  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      /* 评论筛选功能实现*/
      needShow(type, text) {
        /* 如果选择了只看内容并没有内容,则不显示*/
        if (this.onlyContent && !text) {
          return false;
        }
        /* 如果selectType为ALL,则显示全部评论*/
        if (this.selectType === ALL) {
          return true;
        } else { /* 根据rating.rateType与selectType对比,相同则显示*/
          return type === this.selectType;
        }
      },
      /* 在ratingSelect子组件传回参数,更改selectType值*/
      changeType(type) {
        this.selectType = type;
        /* 当内容改变时,重新定位BScroll*/
        this.$nextTick(() => {
            this.scroll.refresh();
          });
      },
      /* 同上,监听子组件数据更改请求*/
      changeContent(content) {
        this.onlyContent = content;
        /* 当内容改变时,重新定位BScroll*/
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      _drop(target) {
        /* 体验优化,异步执行下落动画*/
        this.$nextTick(() => {
          /* 子组件可硬用this.$parent访问父组件，this.$root访问祖根实例，每个父组件都有一个数组this.$children来包含所有子元素。*/
          this.$parent.$refs.shopcart.drop(target);
        });
      },
      addFirst(e) {
        if (!e._constructed) {
          return;
        }
        Vue.set(this.food, 'count', 1);
        this.$emit('drop', e.target);
      },
      show() {
        /* 当food组件显示时,把定义好的数据传到food组件*/
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = false;

        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foodPage, {
              click: true,
              bounceTime: 300
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide() {
        this.showFlag = false;
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol,
      split,
      ratingSelect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  @import "stylus/food.stylus";
</style>
