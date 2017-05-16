<template>
  <ul v-if="mySeller.supports" class="supports">
    <li class="support-item" v-for="(item,index) in mySeller.supports">
      <span class="icon" :class="classMap[item.type]"></span>
      <span class="text">{{ item.description }}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      mySeller: {
        type: Object
      }
    },
    data() {
      return {
        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      };
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "stylus/support.styl";
</style>
