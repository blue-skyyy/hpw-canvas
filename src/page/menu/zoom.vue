<template>
  <div>
    <button
      v-if="zoomStatus && zoomStatus === 'zoom_out'"
      @click="setZoom('out')"
    >
      放大
    </button>
    <button
      v-if="zoomStatus && zoomStatus === 'zoom_in'"
      @click="setZoom('in')"
    >
      缩小
    </button>
  </div>
</template>

<script>
import { fabric } from "fabric";
export default {
  props: {
    zoomStatus: {
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
      zoomStep: 0.1
    };
  },
  methods: {
    setZoom(type) {
      // 以中心点为基点做缩放
      let zoom = this.canvas.getZoom();
      let center = this.canvas.getCenter();
      let zoomPoint = new fabric.Point(center.left, center.top);
      if (type == "out") {
        // 放大
        zoom = zoom + this.zoomStep;
        zoom = Math.min(3, zoom); //最大是原来的3倍
        this.canvas.zoomToPoint(zoomPoint, zoom);
      }

      if (type === "in") {
        zoom = zoom - this.zoomStep;
        zoom = Math.max(0.1, zoom); //最小为原来的1/10
        this.canvas.zoomToPoint(zoomPoint, zoom);
      }
    }
  }
};
</script>

<style lang="less"></style>
