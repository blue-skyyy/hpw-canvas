<template>
  <div>
    <div class="menu_download">
      <div @click="dealClick" v-html="downloadIcon" class="eraser_icon"></div>
    </div>
  </div>
</template>

<script>
import icons from "../icons.js";

export default {
  name: "download",
  props: {
    mode: {
      default: "",
      type: String
    },
    canvas: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      downloadIcon: icons.download
      // isShow: false
    };
  },

  watch: {
    // mode(newmode) {
    //   if (newmode === "eraser") {
    //     this.eraserIcon = icons.activeEraser;
    //   } else {
    //     this.eraserIcon = icons.eraser;
    //   }
    // },
    // canvas(newCanvas) {
    //   newCanvas.on("mouse:down", this.dealMousedown);
    //   newCanvas.on("object:over", this.dealMouseover);
    // }
  },
  methods: {
    dealClick() {
      this.$emit("click");
    }
  }
};
</script>
