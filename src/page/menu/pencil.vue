<template>
  <div>
    <button @click="dealClick">
      画笔
    </button>
    <span>{{ pressure }}</span>
  </div>
</template>
<script>
import { fabric } from "fabric";
// import Pressure from "pressure";
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
      baseLineList: [6, 10, 15, 25]
    };
  },
  mounted() {
    // this.canvas.on("mouse:down", this.handleDown);
    // this.canvas.on("mouse:up", this.hanleUp);
    // this.canvas.on("mouse:move", this.hanleMove);
    // console.log("this.canvas", this.canvas, this.canvas.handleDown);
    // this.canvas.isDrawingMode = true;
  },
  methods: {
    dealClick() {
      this.$emit("click");
    },

    freeDraw() {
      var hLinePatternBrush = new fabric.PatternBrush(this.canvas);
      hLinePatternBrush.getPatternSrc = (function(fabric) {
        return function() {
          // console.log("fff");
          var patternCanvas = fabric.document.createElement("canvas");
          patternCanvas.width = patternCanvas.height = 10;
          var ctx = patternCanvas.getContext("2d");
          ctx.strokeStyle = "green";
          ctx.lineWidth = 40;
          ctx.beginPath();
          ctx.moveTo(5, 0);
          ctx.lineTo(5, 10);
          ctx.closePath();
          ctx.stroke();
          return patternCanvas;
        };
      })(fabric);

      this.canvas.freeDrawingBrush = hLinePatternBrush;
      this.canvas.freeDrawingBrush.width = 5;
    }
  },
  watch: {
    mode(newMode) {
      // if (newMode !== "pencil") {
      //   this.canvas.isDrawingMode = false;
      //   this.canvas.off("mouse:down");
      //   this.canvas.off("mouse:up");
      //   this.canvas.off("mouse:move");
      // }
      if (newMode === "pencil") {
        this.canvas.off("mouse:down");
        this.canvas.off("mouse:up");
        this.canvas.off("mouse:move");
        this.canvas.isDrawingMode = true;
        this.freeDraw();
        // this.canvas.on("mouse:down", this.handleDown);
        // this.canvas.on("mouse:move", this.handleMove);
        // this.canvas.on("mouse:up", this.handleUp);
      }

      if (newMode !== "pencil") {
        this.canvas.isDrawingMode = false;
      }
    }
  }
};
// handleUp(e) {
//     if (!this.canDraw) return;
//     const { x, y, pressure } = this.getPos(e);
//     this.priviousPressure = pressure;
//     this.points.push({ x, y, command: "L" });
//     if (this.points.length > 3) {
//       const lastTwoPoints = this.points.slice(-2);
//       const controlPoint = lastTwoPoints[0];
//       const endPoint = {
//         x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
//         y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
//       };
//       this.drawPath(
//         this.beginPoint,
//         controlPoint,
//         endPoint,
//         ((this.priviousPressure + pressure) / 2) * this.baseLineList[0]
//       );
//       this.beginPoint = endPoint;
//     } else {
//       this.priviousPressure = pressure;
//     }
//     this.beginPoint = null;
//     this.canDraw = false;
//     this.points = [];
//   },
//   handleDown(e) {
//     this.canDraw = true;
//     const { x, y, pressure } = this.getPos(e);
//     this.priviousPressure = pressure;
//     // this.points.push({ x, y });
//     this.points.push({ x, y, command: "M" });
//     this.beginPoint = { x, y };
//   },
//   handleMove(e) {
//     if (!this.canDraw) return;
//     const { x, y, pressure } = this.getPos(e);
//     this.priviousPressure = pressure;
//     this.points.push({ x, y, command: "L" });
//     if (this.points.length > 3) {
//       const lastTwoPoints = this.points.slice(-2);
//       const controlPoint = lastTwoPoints[0];
//       const endPoint = {
//         x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
//         y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
//       };
//       this.drawPath(
//         this.beginPoint,
//         controlPoint,
//         endPoint,
//         pressure * this.baseLineList[0]
//       );
//       this.beginPoint = endPoint;
//     }
//   },
//   pathToCurve(path, controlPointsNum = 2) {
//     // M 开始 L 结束
//     let support = ["M", "L"];
//     let curve = { 2: "Q", 3: "C" };
//     let str = "";
//     for (let i = 0; i < path.length; i++) {
//       let { command, x, y } = path[i];
//       if (!support.includes(command)) {
//         throw new Error(`${command} is not support width start`);
//       }
//       if (i % controlPointsNum === 0) {
//         // 剩余点数不够组成曲线时使用L
//         let cmd =
//           i + controlPointsNum <= path.length ? curve[controlPointsNum] : "L";
//         str += ` ${cmd} ${x} ${y}`;
//       } else {
//         str += ` ${x} ${y}`;
//       }
//     }
//     return str;
//   },

//   getPos(e) {
//     return {
//       x: e.absolutePointer.x,
//       y: e.absolutePointer.y,
//       pressure: Math.random()
//     };
//   },

//   drawPath(beginPoint, controlPoint, endPoint, width) {
//     let c = document.createElement("canvas");
//     this.ctx = c.getContext("2d");
//     this.ctx.beginPath();
//     this.ctx.moveTo(beginPoint.x, beginPoint.y);
//     this.ctx.quadraticCurveTo(
//       controlPoint.x,
//       controlPoint.y,
//       endPoint.x,
//       endPoint.y
//     );

//     this.ctx.lineWidth = width;
//     this.ctx.stroke();
//     this.ctx.closePath();
//     let p = this.pathToCurve(this.points);
//     var path = new fabric.Path(p, {
//       fill: null,
//       stroke: this.color || "red",
//       strokeWidth: width,
//       strokeLineCap: "round",
//       strokeLineJoin: "round",
//       evented: false,
//       hasControls: false,
//       hasBorders: false,
//       selectable: true,
//       isDrawingMode: false
//       // strokeStyle
//     });
//     this.canvas.add(path);
//   },
</script>
