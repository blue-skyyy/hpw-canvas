<template>
  <div class="menu_switch_image">
    <div
      @click="switchImage('prev')"
      style="marginLeft:8px;"
      :style="!prev && 'display:none'"
    >
      <div class="icon" v-html="icons.prev"></div>
    </div>
    <div :style="!next && 'display:none'" @click="switchImage('next')">
      <div class="icon" v-html="icons.next"></div>
    </div>
  </div>
</template>

<script>
import icons from "../icons.js";
export default {
  props: {
    prev: {
      type: Boolean,
      default: false
    },
    next: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      icons
    };
  },
  methods: {
    switchImage(flag) {
      if (flag === "prev") {
        this.$emit("prevFunc");
      }

      if (flag === "next") {
        this.$emit("nextFunc");
      }
    }
  }
};
</script>

<style lang="less" scoped></style>
