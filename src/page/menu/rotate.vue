<template>
  <div :style="setStyle(rotateLeft, rotateRight)" class="menu_rotate">
    <div :style="!rotateLeft && 'display:none'" @click="rotateTo('left')">
      <div class="icon" v-html="icons.rotateLeft"></div>
    </div>
    <div @click="rotateTo('right')" :style="!rotateRight && 'display:none'">
      <div class="icon" v-html="icons.rotateRight"></div>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import icons from "../icons.js";
export default {
  props: {
    canvas: {
      type: Object,
      default: () => {}
    },
    currItem: {
      type: Object,
      default: () => {}
    },
    rotateRight: {
      type: Boolean,
      default: false
    },
    rotateLeft: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      icons
    };
  },
  computed: {
    setStyle() {
      return function(left, right) {
        if (left && right) {
          return {
            display: "flex",
            flex: 2
          };
        }
        if (!left && !right) {
          return {
            display: "none"
          };
        }

        return {
          display: "flex",
          flex: 1
        };
      };
    }
  },
  methods: {
    rotateTo(direction) {
      console.log("this.currItem", this.currItem);
      console.log("---", this.canvas.getZoom());

      // this.canvas.setZoom(1);
      this.currItem.rotateTo(direction);
      // 更新canvas的宽高
      const { imageInfo, rotate } = this.currItem;

      console.log("imageInfo.scale.width", imageInfo.scale.width);
      console.log("imageInfo.scale.height", imageInfo.scale.height);
      if (rotate % 180 === 0) {
        console.log("A");
        this.canvas.setWidth(imageInfo.scale.width);
        this.canvas.setHeight(imageInfo.scale.height);
      } else {
        console.log("B");
        this.canvas.setWidth(imageInfo.scale.height);
        this.canvas.setHeight(imageInfo.scale.width);
      }

      // setTimeout(() => {
      //   let center = this.canvas.getCenter();
      //   let zoomPoint = new fabric.Point(center.left, center.top);

      //   console.log("zoomPoint", zoomPoint);
      //   this.canvas.zoomToPoint({ x: 400, y: 188 }, 1);
      // }, 2000);

      this.canvas.discardActiveObject();
      let sel = new fabric.ActiveSelection(this.canvas.getObjects(), {
        canvas: this.canvas,
        cornerSize: 0,
        hasControls: false
      });

      this.canvas.setActiveObject(sel);
      direction === "left" ? sel.rotate(-90) : sel.rotate(90);
      sel.bottom = 0;
      // sel.left = 0;
      sel.center();

      this.canvas.renderAll();

      // let center = this.canvas.getCenter();
      // let zoomPoint = new fabric.Point(center.left, center.top);

      // 作为组整体旋转
    }
  }
};
</script>

<style lang="less" scoped>
.menu_rotate {
  justify-content: space-around;
}
</style>
