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
    },
    currItem: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    rotateTo(direction) {
      this.currItem.rotateTo(direction);
      // 更新canvas的宽高
      const { imageInfo, rotate } = this.currItem;
      if (rotate % 180 === 0) {
        // this.resetCanvasWH(this.scaleWH.width, this.scaleWH.height);
        this.canvas.setWidth(imageInfo.scale.width);
        this.canvas.setHeight(imageInfo.scale.height);
      } else {
        this.canvas.setWidth(imageInfo.scale.height);
        this.canvas.setHeight(imageInfo.scale.width);
      }
      // 作为组整体旋转
      this.canvas.discardActiveObject();
      let sel = new fabric.ActiveSelection(this.canvas.getObjects(), {
        canvas: this.canvas,
        cornerSize: 0,
        hasControls: false
      });

      this.canvas.setActiveObject(sel);
      direction === "left" ? sel.rotate(-90) : sel.rotate(90);
      sel.center();

      this.canvas.renderAll();
    }
  }
};
</script>

<style lang="less" scoped></style>
