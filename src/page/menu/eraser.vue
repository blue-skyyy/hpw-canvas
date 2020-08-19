<template>
  <div>
    <button @click="getPath">获取当前所有path路径</button>

    <button @click="dealClick">改变模式</button>
  </div>
</template>

<script>
// import { fabric } from "fabric";

export default {
  name: "eraser",
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
    getPath() {},
    // this.canvas.isDrawingMode = true;

    // const EraserBrush = fabric.util.createClass(fabric.PencilBrush, {
    //   _finalizeAndAddPath() {
    //     console.log("EraserBrush");
    //     let ctx = this.canvas.contextTop;
    //     ctx.closePath();
    //     if (this.decimate) {
    //       this._points = this.decimatePoints(this._points, this.decimate);
    //     }
    //     let pathData = this.convertPointsToSVGPath(this._points).join("");
    //     // console.log("pathData", pathData);
    //     if (pathData === "M 0 0 Q 0 0 0 0 L 0 0") {
    //       // do not create 0 width/height paths, as they are
    //       // rendered inconsistently across browsers
    //       // Firefox 4, for example, renders a dot,
    //       // whereas Chrome 10 renders nothing
    //       this.canvas.requestRenderAll();
    //       return;
    //     }

    //     // use globalCompositeOperation to 'fake' eraser
    //     let path = this.createPath(pathData);
    //     // console.log("path", path);
    //     path.globalCompositeOperation = "destination-out";
    //     path.selectable = false;
    //     path.evented = false;
    //     path.absolutePositioned = true;
    //     path.set({
    //       nameType: "eraser",
    //       globalCompositeOperation: "destination-out",
    //       opacity: 0
    //       // stroke: "green",
    //       // strokeWidth: 20
    //     });

    dealClick() {
      this.$emit("click");
    }
  },
  watch: {
    // mode(newMode) {
    //   console.log("newMode", newMode);
    //   if (newMode === "pencil") {
    //     console.log("i");
    //   }
    // }
  }
};
</script>
