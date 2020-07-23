<template>
  <div>
    <canvas ref="canvas" id="canvas" style="touch-action:none;"></canvas>
    <canvas class="h5-canvas" style="display:block;"></canvas>
  </div>
</template>

<script>
import { fabric } from "fabric";
// v-on:touchstart="
//   (e) => {
//     e.preventDefault();
//   }
// "
// v-on:touchmove="
//   (e) => {
//     e.preventDefault();
//   }
// "
// v-on:pointermove="move"
export default {
  data() {
    return {
      canvas: null,
      points: [],
      beginPoint: null,
      endPoint: null,
      ctx: null,
      canDraw: false,
      priviousPressure: 0,
      baseLineList: [6, 10, 15, 25],
      pathStr: ""
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // this.canvas = new fabric.Canvas("canvas", {});
    // });
    this.initCanvas();
  },
  methods: {
    pathToCurve(path, controlPointsNum = 2) {
      let support = ["M", "L"];
      let curve = { 2: "Q", 3: "C" };
      let str = "";
      for (let i = 0; i < path.length; i++) {
        let { command, x, y } = path[i];
        // let [left, top] = value;

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
    initCanvas() {
      this.canvas = new fabric.Canvas("canvas", {
        isDrawingMode: true,
        width: 800,
        height: 500
      });

      // 可以
      let upper_canvas = document.querySelector(".h5-canvas");
      // let upper_canvas = document.querySelector(".upper-canvas");

      upper_canvas.width = 800;
      upper_canvas.height = 500;
      // upper_canvas.width = document.documentElement.clientWidth;
      // upper_canvas.height = document.documentElement.clientHeight;
      // let upper_canvas = document.querySelector("#canvas");
      this.ctx = upper_canvas.getContext("2d");
      this.ctx.globalCompositeOperation = "source-over";
      this.ctx.lineCap = "round"; //设置线条的结束端点样式
      this.ctx.lineJion = "round"; //设置两条线相交时，所创建的拐角类型
      // this.ctx.lineWidth = 10; // 线条宽度
      this.ctx.strokeStyle = "#02A556"; // 线条颜色

      upper_canvas.addEventListener("pointerdown", this.handledown, false);
      upper_canvas.addEventListener("pointermove", this.handleMove, false);
      upper_canvas.addEventListener("pointerup", this.handleUp, false);
    },
    handleUp(e) {
      if (!this.canDraw) return;
      const { x, y, pressure } = this.getPos(e);
      this.priviousPressure = pressure;
      this.points.push({ x, y, command: "L" });
      if (this.points.length > 3) {
        const lastTwoPoints = this.points.slice(-2);
        const controlPoint = lastTwoPoints[0];
        const endPoint = {
          x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
          y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
        };
        this.drawPath(
          this.beginPoint,
          controlPoint,
          endPoint,
          ((this.priviousPressure + pressure) / 2) * this.baseLineList[0]
        );
        this.beginPoint = endPoint;
      } else {
        this.priviousPressure = pressure;
      }
      this.beginPoint = null;
      this.canDraw = false;
      this.points = [];
    },
    handledown(e) {
      this.canDraw = true;
      const { x, y, pressure } = this.getPos(e);
      this.priviousPressure = pressure;
      this.points.push({ x, y, command: "M" });
      this.beginPoint = { x, y };
      // console.log(" this.beginPoint", this.beginPoint);
    },
    handleMove(e) {
      if (!this.canDraw) return;
      // console.log("move", e);
      // console.log("e", e);
      const { x, y, pressure } = this.getPos(e);
      this.priviousPressure = pressure;
      this.points.push({ x, y, command: "L" });
      if (this.points.length > 3) {
        const lastTwoPoints = this.points.slice(-2);
        const controlPoint = lastTwoPoints[0];
        const endPoint = {
          x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
          y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
        };
        this.drawPath(
          this.beginPoint,
          controlPoint,
          endPoint,
          pressure * this.baseLineList[0]
        );
        this.beginPoint = endPoint;
      }
    },

    getPos(e) {
      const { pressure } = e;
      console.log("e", e);
      return {
        x: e.layerX,
        y: e.layerY,
        pressure
      };
    },
    drawPath(beginPoint, controlPoint, endPoint, width) {
      // console.log("ddd", this.pathToCurve(this.points));
      let p = this.pathToCurve(this.points);
      var path = new fabric.Path(p, {
        fill: null,
        stroke: "red",
        strokeWidth: width,
        strokeLineCap: "round",
        strokeLineJoin: "round",
        evented: false,
        hasControls: false,
        hasBorders: false,
        selectable: false,
        isDrawingMode: false
        // strokeStyle
      });
      this.canvas.add(path);
      // console.log("beginPoint", beginPoint);
      this.ctx.beginPath();
      this.ctx.moveTo(beginPoint.x, beginPoint.y);
      this.ctx.quadraticCurveTo(
        controlPoint.x,
        controlPoint.y,
        endPoint.x,
        endPoint.y
      );
      this.ctx.lineWidth = width;
      this.ctx.stroke();
      this.ctx.closePath();
    }
  }
};
</script>

<style>
div {
  display: flex;
  justify-content: center;
}
canvas {
  border: 1px solid red;
}
.h5-canvas {
  border: 2px solid green;
}
</style>
