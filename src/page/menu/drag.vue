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
