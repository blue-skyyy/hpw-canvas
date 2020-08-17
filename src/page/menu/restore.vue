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
    },
    currItem: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    restore() {
      this.canvas.discardActiveObject();

      const { imageInfo, rotate } = this.currItem;

      this.canvas.setWidth(imageInfo.scale.width);
      this.canvas.setHeight(imageInfo.scale.height);

      let sel = new fabric.ActiveSelection(this.canvas.getObjects(), {
        canvas: this.canvas,
        cornerSize: 0,
        hasBorders: false,
        selectable: false,
        hasControls: false
      });
      this.canvas.setActiveObject(sel);

      // 位置
      sel.left = 0;
      sel.top = 0;

      // 旋转
      sel.rotate(-rotate);
      sel.center();
      this.currItem.setRotate(0);

      // 缩放
      let center = this.canvas.getCenter();
      let zoomPoint = new fabric.Point(center.left, center.top);
      this.canvas.zoomToPoint(zoomPoint, 1);

      this.canvas.renderAll();
    }
  }
};
</script>

<style lang="less" scoped></style>
