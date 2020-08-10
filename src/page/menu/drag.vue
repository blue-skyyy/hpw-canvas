<template>
  <button @click="dealClick">
    拖拽
  </button>
</template>

<script>
import { fabric } from "fabric";
export default {
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
    return {};
  },
  methods: {
    dealClick() {
      this.$emit("click");
    }
  },
  watch: {
    mode(newMode) {
      if (newMode === "drag") {
        this.canvas.off("mouse:down");
        this.canvas.off("mouse:up");
        this.canvas.off("mouse:move");
        console.log("drag===========add======Event");
        this.canvas.on({
          "mouse:down": () => {
            this.panning = true;
            this.canvas.selection = false;
          },
          "mouse:up": () => {
            this.panning = false;
            this.canvas.selection = true;
          },
          "mouse:move": (e) => {
            if (this.panning && e && e.e) {
              let delta = new fabric.Point(e.e.movementX, e.e.movementY);
              this.canvas.relativePan(delta);
            }
          }
        });
      }
      // if (newMode !== "drag" && this.canvas) {
      //   console.log("drag===========remove========Event");
      //   this.canvas.off("mouse:down");
      //   this.canvas.off("mouse:up");
      //   this.canvas.off("mouse:move");
      // }
    }
  }
};
</script>

<style lang="less" scoped>
div {
  // background: red;
  display: inline-block;
}
</style>
