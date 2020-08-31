<template>
  <div :style="setStyle(rotateLeft, rotateRight)" class="menu_rotate">
    <div :style="!rotateLeft && 'display:none'" @click="rotateTo('left')">
      <div class="icon" v-html="icons.rotateLeft"></div>
    </div>
    <div
      @click="rotateTo('right')"
      style="marginLeft:8px;"
      :style="!rotateRight && 'display:none'"
    >
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
        console.log("left", left, right);
        // if (left && right) {
        //   return {
        //     display: "flex",
        //     flex: 1
        //   };
        // }
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
      this.currItem.rotateTo(direction);
      // 更新canvas的宽高
      const { imageInfo, rotate } = this.currItem;
      if (rotate % 180 === 0) {
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

<style lang="less" scoped>
.menu_rotate {
  background: red;
}
</style>
