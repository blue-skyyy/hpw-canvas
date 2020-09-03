<template>
  <div class="menu_restore">
    <div @click="dealClick" v-html="restoreIcon"></div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import icons from "../icons.js";

export default {
  data() {
    return {
      restoreIcon: icons.restore
    };
  },
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
    dealClick() {
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
