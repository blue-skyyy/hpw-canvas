<template>
  <div>
    <div class="menu_drag">
      <div @click="dealClick" v-html="dragIcon" class="drag_icon"></div>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import icons from "../icons.js";
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
    return {
      dragIcon: icons.drag
    };
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
        var sel = new fabric.ActiveSelection(this.canvas.getObjects(), {
          canvas: this.canvas
        });
        this.canvas.setActiveObject(sel);
        this.canvas.requestRenderAll();
      }
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
