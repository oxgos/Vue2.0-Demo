<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{ seller.score }}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{ seller.rankRate }}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{ seller.serviceScore }}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{ seller.foodScore }}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{ seller.deliveryTime }}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingSelect @changeType="changeType" @changeContent="changeContent" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings"></ratingSelect>
      <div class="rating-wrapper">
        <ul>
          <li class="rating-item border-1px" v-show="needShow(rating.rateType,rating.text)" v-for="rating in ratings">
            <div class="avatar">
              <img :src="rating.avatar" alt="" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{ rating.username }}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{ rating.deliveryTime }}分钟送达</span>
              </div>
              <p class="text">{{ rating.text }}</p>
              <div class="recommend" v-show="rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="item in rating.recommend">{{ item }}</span>
              </div>
              <div class="time">{{ rating.rateTime | formatDate }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  /* 导入BScroll插件*/
  import BScroll from 'better-scroll';
  /* 导入一个js模块function*/
  import {formatDate} from 'common/js/date.js';
  /* 导入star组件*/
  import star from 'components/star/star.vue';
  /* 导入split组件*/
  import split from 'components/split/split.vue';
  /* 导入ratingSelect组件*/
  import ratingSelect from 'components/ratingSelect/ratingSelect.vue';

  const ALL = 2;
  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      };
    },
    created() {
      this.$http.get('/api/ratings').then((response) => {
          if (response.body.errNo === ERR_OK) {
            this.ratings = response.body.data;

            this.$nextTick(() => {
              if (!this.$refs.ratings) {
                return;
              }
              this.scroll = new BScroll(this.$refs.ratings, {
                click: true,
                bounceTime: 300
              });
            });
          }
      });
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
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      star,
      split,
      ratingSelect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "stylus/ratings.styl";
</style>
