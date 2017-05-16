<template>
  <div>
    <!--商品页面-->
    <div class="goods">
      <!--右侧菜单栏-->
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,index) in goods" class="menu-item" :class="{ 'current':currentIndex === index }" @click="selectMenu(index,$event)">
					<span class="text border-1px">
						<span v-show="item.type>0" :class="classMap[item.type]" class="icon"></span>{{ item.name }}
					</span>
          </li>
        </ul>
      </div>
      <!--左侧商品列表栏-->
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="item in goods" class="food-list food-list-hook">
            <h1 class="title">{{ item.name }}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item border-1px" @click="selectedFood(food,$event)">
                <div class="icon">
                  <img :src="food.icon" width="57" height="57">
                </div>
                <div class="content">
                  <h2 class="name">{{ food.name }}</h2>

                  <p class="desc">{{ food.description }}</p>

                  <div class="extra">
                    <span class="count">月售{{ food.sellCount }}份</span><span>好评率{{ food.rating }}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{ food.price }}</span><span class="old" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol @drop="_drop" :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!--页脚购物车栏-->
      <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    </div>
    <food :food="selectFood" ref="food" @drop="_drop"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  /* 导入BScroll插件*/
  import BScroll from 'better-scroll';
  /* 导入shopcart组件*/
  import shopcart from 'components/shopcart/shopcart.vue';
  /* 导入cartcontrol组件*/
  import cartcontrol from 'components/cartcontrol/cartcontrol.vue';
  /* 导入food组件*/
  import food from 'components/food/food.vue';

  /* 定义数据是否正确常量*/
  const ERR_OK = 0;

  export default {
    props: {
      /* 绑定取得App.vue传来的seller值*/
      seller: {
        type: Object
      }
    },
    data() {
      return {
        /* 存放服务器取得goods的数据*/
        goods: [],
        /* 存放每个good类别到页面顶部的高度*/
        listHeight: [],
        /* 滑动后距离顶部的Y值*/
        scrollY: 0,
        selectFood: {}
      };
    },
    computed: {
      /* 计算good类别的索引值(层数)*/
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      /* 选择了的商品属性,与shopcart绑定,把选定的商品传过去*/
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created() {
      /* Vue resource异步请求数据*/
      this.$http.get('/api/goods').then((response) => {
        if (response.body.errNo === ERR_OK) {
          this.goods = response.body.data;
          /* DOM的渲染完成在nextTick之后,所以在nextTick的callback操作DOM才正确和安全*/
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      }
    );
      /* 定义good.type所对应的图标class*/
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    methods: {
      selectedFood(food, e) {
        if (!e._constructed) {
          return;
        }
        this.selectFood = food;
        this.$refs.food.show();
      },
      _drop(target) {
        /* 体验优化,异步执行下落动画*/
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      },
      /* 点击menu所触发的事件,跳转至相对应的商品列表*/
      selectMenu(index, e) {
        if (!e._constructed) {
          return;
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 200);
      },
      /* BScroll列表上下滑动效果*/
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          /* 默认阻止了click事件,click: true变为可用*/
          click: true,
          startX: 0,
          startY: 0,
          bounceTime: 300/* 弹力动画持续的毫秒数*/
          /* bounce: false*//* 是否启用弹力动画*/
        });

        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3,
          startX: 0,
          startY: 0,
          bounceTime: 300
        });
        /* 滑动后距离顶部的Y值*/
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      /* 计算每个good类别到页面顶部的高度*/
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      }
    },
    /* 导入声明组件*/
    components: {
      shopcart,
      cartcontrol,
      food
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "stylus/goods.stylus";
</style>
