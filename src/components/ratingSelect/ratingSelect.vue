<template>
  <div class="ratingSelect">
    <div class="rating-type border-1px">
      <span class="block positive" :class="{'active': selectType === 2}" @click="select(2, $event)">{{ desc.all }}<span class="count">{{ ratings.length }}</span></span>
      <span class="block positive" :class="{'active': selectType === 0}" @click="select(0, $event)">{{ desc.positive }}<span class="count">{{ positives.length }}</span></span>
      <span class="block negative" :class="{'active': selectType === 1}" @click="select(1, $event)">{{ desc.negative }}<span class="count">{{ negatives.length }}</span></span>
    </div>
    <div class="switch" :class="{'on':onlyContent}" @click="toggleContent(!onlyContent,$event)">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  /* 定义常量,评价的类型*/
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            position: '满意',
            negative: '不满意'
          };
        }
      }
    },
    computed: {
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    },
    methods: {
      toggleContent(content, e) {
        if (!e._constructed) {
          return;
        }
        this.$emit('changeContent', content);
      },
      select(type, e) {
        if (!e._constructed) {
          return;
        }
        /*  错误写法,子组件不能反向修改父组件的值*/
        /* this.selectType = type;*/
        /* 应用$emit方法,创建事件,把值传回父组件,父组件绑定事件,创建方法,用传回的参数修改值,再传给子组件*/
        this.$emit('changeType', type);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  @import "stylus/ratingSelect.styl";
</style>
