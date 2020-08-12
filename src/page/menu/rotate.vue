<template>
  <div>
    <button @click="rotateTo('left')">左旋转</button>
    <button @click="rotateTo('right')">右旋转</button>
  </div>
</template>

<script>
import { fabric } from "fabric";
export default {
  props: {
    canvas: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    rotateTo(direction) {
      // 作为组整体旋转
      this.canvas.discardActiveObject();
      let sel = new fabric.ActiveSelection(this.canvas.getObjects(), {
        canvas: this.canvas,
        cornerSize: 0,
        hasControls: false
      });

      this.canvas.setActiveObject(sel);

      if (direction === "left") {
        sel.rotate(-90);
      }

      if (direction === "right") {
        sel.rotate(90);
      }

      this.canvas.renderAll();
    }
  }
};
</script>

<style lang="less" scoped></style>
