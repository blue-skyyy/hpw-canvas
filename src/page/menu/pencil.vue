<template>
  <div class="menu_pencil">
    <div v-html="pencil" class="pencil_icon" @click.stop="dealClick"></div>
    <div class="pencil_box" v-show="isShow">
      <div
        class="pencil_item"
        v-for="(d, index) in pencilSizeList"
        @click.stop="changePencilSize(d)"
        :key="index"
        :class="{ active: d === pencilSize }"
        :style="setStyle(index)"
      ></div>
    </div>
  </div>
</template>
<script>
// 两个问题
// 1. 用pointer去模拟库事件，会影响整体大小
// 2. 删除时候由于写了多次会导致path成为多条path
import { fabric } from "fabric";
// import { fabric } from "fabric";
// import Pressure from "pressure";

import icons from "../icons.js";
export default {
  name: "pencil",
  props: {
    mode: {
      default: "",
      type: String
    },
    canvas: {
      default: () => {},
      type: Object
    },
    color: {
      default: "",
      type: String
    },
    pencilSizeList: {
      default: () => [],
      type: Array
    },
    pencilSize: {
      default: 1,
      type: Number
    }
  },
  data() {
    return {
      points: [],
      canDraw: false,
      priviousPressure: 0,
      beginPoint: null,
      endPoint: null,
      pressure: null,
      // baseLineList: [6, 10, 15, 25],
      pencil: icons.pencil,
      isShow: false,
      positionStarStr: ""
    };
  },
  computed: {
    setStyle() {
      return function(index) {
        return {
          width: `${4 * (index + 2)}px`,
          height: `${4 * (index + 2)}px`
        };
      };
    }
  },
  methods: {
    pathEnd() {
      if (!this.canDraw) return;
      let ctxCanvasPathString = this.pathToCurve(this.points);
      ctxCanvasPathString = `${this.positionStarStr} ${ctxCanvasPathString}`;
      this.positionStarStr = "";
      this.points = [];
      this.canDraw = false;
      // ctxCanvasPathString =
      // "M 347 114 Q 352 114 354 114 Q 365 114 370 114 Q 383 114 387 116 Q 392 117 392 117 Q 395 117 395 117 Q 397 113 400 110 Q 406 103 410 99 Q 417 91 418 89 Q 420 87 420 86 Q 422 86 422 85 Q 422 83 423 83 Q 424 82 426 82 Q 426 82 427 82 Q 427 81 426 81 L 424 78";
      this.drawPath(ctxCanvasPathString);
    },
    getPos(e) {
      return {
        x: e.offsetX,
        y: e.offsetY
        // pressure: e.pressure
      };
    },
    pathStart({ x, y }) {
      this.positionStarStr = `M ${x} ${y}`;
    },
    onPointup() {
      if (!this.canDraw) return;
      this.pathEnd();
      // let pos = this.getPos(e);
      // this.points.push({ x: pos.x, y: pos.y, command: "M" });
      // this.drawPath();
      // this.points = [];
      // this.positionStarStr = null;
      // this.canDraw = false;
    },
    onPointdown(e) {
      this.canDraw = true;
      let pos = this.getPos(e);
      this.positionStarStr = `M ${pos.x} ${pos.y}`;
      // this.points.push({ x: pos.x, y: pos.y, command: "M" });
    },
    onPointmove(e) {
      if (!this.canDraw) return;
      let pos = this.getPos(e);
      this.points.push({ x: pos.x, y: pos.y, command: "L" });
    },

    // onPointleave(e) {
    //   if (!this.canDraw) return;
    //   let pos = this.getPos(e);
    //   this.points.push({ x: pos.x, y: pos.y, command: "M" });
    //   this.canDraw = false;
    // },

    // onPointup(e) {
    //   if (!this.canDraw) return;
    //   const { x, y, pressure } = this.getPos(e);
    //   this.priviousPressure = pressure;
    //   this.points.push({ x, y, command: "L" });
    //   if (this.points.length > 3) {
    //     const lastTwoPoints = this.points.slice(-2);
    //     const controlPoint = lastTwoPoints[0];
    //     const endPoint = {
    //       x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
    //       y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
    //     };
    //     this.drawPath(
    //       this.beginPoint,
    //       controlPoint,
    //       endPoint,
    //       (this.priviousPressure + pressure) / 2
    //     );
    //     this.beginPoint = endPoint;
    //   } else {
    //     this.priviousPressure = pressure;
    //   }
    //   this.beginPoint = null;
    //   this.canDraw = false;
    //   this.points = [];
    // },
    // onPointdown(e) {
    //   this.canDraw = true;
    //   const { x, y, pressure } = this.getPos(e);
    //   this.priviousPressure = pressure;
    //   this.points.push({ x, y, command: "M" });
    //   this.beginPoint = { x, y };
    // },
    // onPointmove(e) {
    //   if (!this.canDraw) return;
    //   const { x, y, pressure } = this.getPos(e);
    //   this.priviousPressure = pressure;
    //   this.points.push({ x, y, command: "L" });
    //   if (this.points.length > 3) {
    //     const lastTwoPoints = this.points.slice(-2);
    //     // const controlPoint = lastTwoPoints[0];
    //     const endPoint = {
    //       x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
    //       y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
    //     };
    //     // this.drawPath(this.beginPoint, controlPoint, endPoint, pressure);
    //     this.beginPoint = endPoint;
    //   }
    // },
    pathToCurve(path, controlPointsNum = 2) {
      // M 开始 L 结束
      let support = ["M", "L"];
      let curve = { 2: "Q", 3: "C" };
      let str = "";
      for (let i = 0; i < path.length; i++) {
        let { command, x, y } = path[i];
        if (!support.includes(command)) {
          throw new Error(`${command} is not support width start`);
        }
        if (i % controlPointsNum === 0) {
          // 剩余点数不够组成曲线时使用L
          let cmd =
            i + controlPointsNum <= path.length ? curve[controlPointsNum] : "L";
          str += ` ${cmd} ${x} ${y}`;
        } else {
          str += ` ${x} ${y}`;
        }
      }
      return str;
    },

    drawPath(str) {
      let path = new fabric.Path(str, {
        fill: null,
        stroke: "green",
        strokeWidth: 4,
        strokeLineCap: "round",
        strokeLineJoin: "round",
        // originX: "center",
        // originY: "top",
        pathOffset: null,
        evented: true,
        hasControls: true,
        hasBorders: true,
        selectable: true,
        isDrawingMode: false,
        className: "custom_path"
      });
      this.canvas.add(path);

      // path.setCoords();

      // path.calcCoords();
      // var r = path.getBoundingRect();
      // path.set({ left: -r.left, top: -r.top });
      // path.calcCoords();

      // console.log("r", r);
      // console.log("Path", path);
      // path._setPositionDimensions();

      // var path = new fabric.Path("M 65 0 Q 100, 100, 200, 0");
      // var path = new fabric.Path("M 65 0 Q 100, 100, 200, 0", {
      //   fill: "",
      //   stroke: "black"
      //   objectCaching: false
      // });
      // path.set({ left: 10, top: 0 });
      // canvas.add(path);
      // path.padding = 0;
      // path.setCoords();

      path.set("className", "custom_path");

      // path.on("mousedown", this.onMouseDownLine);s
      // path.on("mousemove", this.onMouseMoveLine);
      // this.canvas.setActiveObject(path);
      this.canvas.requestRenderAll();
    },

    // onMouseDownLine(e) {
    //   console.log("onMouseDownLine");
    //   // console.log("e", e.target.get("type"));
    //   if (!e.target) return;

    //   this.canvas.remove(e.target);
    //   this.canvas.renderAll();
    //   // this.sendDeleteLinePath(target.id);
    // },
    unShow() {
      this.isShow = false;
    },
    changePencilSize(size) {
      this.$emit("changeConfig", "pencilSize", size);
      this.isShow = false;
    },
    dealClick() {
      // console.log("yes");
      this.isShow = true;
      // this.pencil = icons.activePencil;

      this.$emit("click");
    },

    freeDraw() {
      let cxt = this.canvas.getContext("2d");
      cxt.globalCompositeOperation = "source-over";
      // fabric.Path.globalCompositeOperation = "source-over";
      this.canvas.freeDrawingBrush = null;
      let pencilBrush = new fabric.PencilBrush(this.canvas);

      // console.log("color", this.color, "width", this.pencilSize);
      // pencilBrush.color = this.color;
      pencilBrush.width = this.pencilSize;
      this.canvas.freeDrawingBrush = pencilBrush;
    }
  },
  watch: {
    mode(newMode) {
      if (newMode === "pencil") {
        this.canvas.discardActiveObject();
        // console.log("A");
        this.pencil = icons.activePencil;
        this.canvas.isDrawingMode = true;
        // this.isShow = true;
        // let brush = this.canvas.freeDrawingBrush;
        // brush.color = this.color;
        // brush.width = this.pencilSize;

        let container = document.querySelector("#image_canvas_wrap");
        container.addEventListener("pointerdown", this.onPointdown);
        container.addEventListener("pointermove", this.onPointmove);
        container.addEventListener("pointerup", this.onPointup);
        // container.addEventListener("pointerleave", this.onPointleave);

        // console.log("container", container);
        // this.freeDraw();
        // this.canvas.on("mouse:down", this.handleDown);
        // this.canvas.on("mouse:move", this.handleMove);
        // this.canvas.on("mouse:up", this.handleUp);
      }

      if (newMode !== "pencil") {
        // console.log("B");
        this.canvas.isDrawingMode = false;
        this.pencil = icons.pencil;
        this.isShow = false;

        let container = document.querySelector("#image_canvas_wrap");
        container.removeEventListener("pointerdown", this.onPointdown);
        container.removeEventListener("pointermove", this.onPointmove);
        container.removeEventListener("pointerup", this.onPointup);
      }
    },
    pencilSize(val) {
      this.canvas.freeDrawingBrush.width = val;
    },
    color(val) {
      this.canvas.freeDrawingBrush.color = val;
    }
  }
};
</script>

<style lang="less" scoped>
.menu_pencil {
  position: relative;
  .pencil_box {
    position: absolute;
    top: 30px;
    display: flex;
    left: 50%;
    transform: translate(-50%, 0);
    padding: 8px 6px;
    background: #383c36;
    align-items: center;
    &::after {
      content: "";
      position: absolute;
      padding: 0;
      width: 0;
      height: 0;
      border-right: 10px solid transparent;
      border-left: 10px solid transparent;
      border-bottom: 10px solid #383c36;
      top: -10px;
      left: 50%;
      transform: translate(-50%, 0);
    }
    .pencil_item {
      margin: 0 3px;
      background: #f2f2ee;
      border-radius: 50%;
    }
    .active {
      background: #999;
    }
  }
}
</style>
