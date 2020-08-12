<template>
  <div>
    <button @click="restore">恢复</button>
  </div>
</template>

<script>
import { fabric } from "fabric";
export default {
  props: {
    canvas: {
      type: Object,
      default: () => {}
    },
    bg: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    restore() {
      // 缩放
      let center = this.canvas.getCenter();
      let zoomPoint = new fabric.Point(center.left, center.top);
      this.canvas.zoomToPoint(zoomPoint, 1);

      // 位置
      // this.canvas.discardActiveObject();
      // let sel = new fabric.ActiveSelection(this.canvas.getObjects(), {
      //   canvas: this.canvas,
      //   cornerSize: 0,
      //   hasControls: true
      // });

      // console.log("sel", sel, this.bg);

      // this.canvas.setActiveObject(sel);

      // this.canvas.renderAll();
    }
  }
};
</script>

<style lang="less" scoped></style>
