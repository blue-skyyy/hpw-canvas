<template>
  <div>
    <div class="canvas-container">
      <canvas ref="canvas"
              id="canvas"></canvas>
      <h5-canvas :width="config.width"
                 :height="config.height"
                 :color="color"
                 :mode="mode"
                 ref="h5canvas"
                 :item="currItem"
                 class="h5canvas"></h5-canvas>
    </div>
    <button @click="changeMode('pencil')">画笔模式</button>
    <button @click="changeMode('eraser')">橡皮擦模式</button>
    <button @click="saveState">保存状态</button>
    <button @click="reStoreState">清除状态</button>
    <button @click="undo">上一步</button>
    <button @click="switchToNext(1)">切换图片</button>
    <button @click="exportTest">导出</button>
    <button @click="composeImageTest">生成合成图片</button>
    <button @click="addRect">添加fabric对象</button>
    <img :src="baseUrl" />
    <img :src="composeUrl" />
  </div>
</template>

<script>
import { fabric } from "fabric";
import h5Canvas from "./module/h5canvas";
import Item from "./Item.js";
import { isImageVaild, composeCanvas } from "../utils.js";

const defaultConfig = {
  width: 800,
  height: 500
};
export default {
  components: {
    h5Canvas
  },
  data () {
    return {
      canvas: null,
      points: [],
      beginPoint: null,
      endPoint: null,
      ctx: null,
      canDraw: false,
      priviousPressure: 0,
      baseLineList: [6, 10, 15, 25],
      pathStr: "",
      color: "red",
      mode: "pencil",
      config: Object.assign({}, defaultConfig),
      imagesList: [
        "https://img.vipkidstatic.com/beeschool/server/20200717/ccb8432c-acf2-4f63-b51d-4195a3fde520.png",
        "https://img.vipkidstatic.com/beeschool/server/20200717/b279967c-4d95-4603-899c-74db4092d5b8.png"
      ],
      currIndex: 0,
      itemList: [],
      currItem: null,
      isFirstRender: true,
      loadedStatus: [],
      baseUrl: null,
      composeUrl: null
    };
  },
  mounted () {
    this.initCanvas();
    this.switchToNext();
  },
  methods: {
    undo () {
      // 返回上一步
      let state = this.currItem.getPreState();
      this.canvas.loadFromJSON(state, () => {
        this.canvas.renderAll();
      })
      // this.currItem.getCurrState
    },
    addRect () {
      var rect = new fabric.Rect({
        top: 50, //距离画布上边的距离
        left: 100, //距离画布左侧的距离，单位是像素
        width: 100, //矩形的宽度
        height: 70, //矩形的高度
        fill: "blue", //填充的颜色
        stroke: "orange", // 边框原色
        strokeWidth: 5, // 边框大小
        rx: 8, //圆角半径
        ry: 4 //圆角半径
      });

      this.canvas.add(rect);
    },
    composeImageTest () {
      // console.log("this.canvas.toDataURL()", this.canvas.toDataURL());
      let url = composeCanvas(
        this.config.width,
        this.config.height,
        document.querySelector(".h5canvas"),
        // this.canvas.toDataURL()
        document.querySelector("#canvas")
        // document.querySelector(".lower-canvas")
      );
      this.composeUrl = url;
      console.log("url", url);
    },
    exportTest () {
      this.baseUrl = this.currItem.h5exprot();
    },
    saveState () {
      // this.$refs.h5canvas.save();
      this.currItem.h5save();
    },
    reStoreState () {
      this.currItem.geth5State("undo");
    },
    pre () { },
    changeMode (mode) {
      this.mode = mode;
    },

    initCanvas () {
      let canvas = new fabric.Canvas("canvas", {
        isDrawingMode: false,
        width: 800,
        height: 500
      });

      canvas.on("object:modified", () => {
        console.log("object:modified");
        let state = JSON.stringify(canvas);
        this.currItem.save(state);
      })
      canvas.on("object:added", () => {
        console.log("object:added");
        let state = JSON.stringify(canvas);
        this.currItem.save(state);
      })
      canvas.on("object:removed", () => {
        console.log("object:removed")
      })
      // canvas.on("after:render", () => { })
      this.canvas = canvas;

      this.loadedStatus = new Array(this.imagesList.lenthg).fill(false);
    },
    switchToNext (index) {
      this.switchImage(index);
    },
    save () {
      // this.currItem.save(flag || false);
    },
    async switchImage (index) {
      // 每加载一张图片才会生成一个实例
      this.currIndex = index || 0;

      if (!this.loadedStatus[this.currIndex]) {
        // 首次加载
        let item = new Item({
          url: this.imagesList[this.currIndex],
          canvas: this.canvas,
          h5canvas: this.$refs.h5canvas
        });
        item.checkImageUrl().then((res) => {
          // if (res.status ===)
          if (res.status === "ok") {
            let center = this.canvas.getCenter();
            this.canvas.setBackgroundImage(
              this.imagesList[this.currIndex],
              this.canvas.renderAll.bind(this.canvas),
              {
                scaleX: 1,
                scaleY: 1,
                top: center.top,
                left: center.left,
                originX: "center",
                originY: "center",
                crossOrigin: "anonymous",
                isBackImg: true,
              }
            );
            // 图片合法
            this.itemList.push(item);
            this.currItem = item;
            this.loadedStatus[this.currIndex] = true;
            // 自动保存一条记录
            this.currItem.h5save("init");
            setTimeout(() => {
              this.currItem.save(JSON.stringify(this.canvas), "init");
            }, 100)
          }
        });
      } else {
        // 非首次加载
      }
    },
    async switchImagetest (index) {
      // 每加载一张图片才会生成一个实例
      this.currIndex = index || 0;
      if (this.isFirstRender) {
        // 首次渲染
        let promiseList = [];
        this.imagesList.forEach((url) => {
          promiseList.push(isImageVaild(url));
        });
        const result = await Promise.allSettled(promiseList);
        result.forEach((p) => {
          // if (p.status === "fulfilled") {
          //   this.itemList.push(new Item({ p: res.url, canvas: this.canvas }));
          // }
          if (p.status === "rejected" || p.status === "fulfilled") {
            this.itemList.push(
              new Item({ url: p.value.url, canvas: this.canvas })
            );
          }
        });
        this.isFirstRender = false;
      }
      this.currItem = this.itemList[this.currIndex];
      this.currItem.historyList.push(JSON.stringify(this.canvas));
      let center = this.canvas.getCenter();
      this.canvas.setBackgroundImage(
        this.itemList[this.currIndex].url,
        this.canvas.renderAll.bind(this.canvas),
        {
          // width: (this.canvas.width / 3) * 2,
          // height: this.canvas.height,
          // height: 800,
          // origin: "center"
          scaleX: 1,
          scaleY: 1,
          // top: 0,
          top: center.top,
          left: center.left,
          // left: 0,
          originX: "center",
          originY: "center"
          // originX: "center",
          // originY: "top"
        }
      );
      this.$refs.h5canvas.save();
    },
    pathToCurve (path, controlPointsNum = 2) {
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
    }
  }
};
</script>

<style lang="less" scoped>
.canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 5px solid red;
  position: relative;
  overflow-y: scroll;
  #canvas {
    box-sizing: border-box;
  }
  // .h5-canvas {
  //   border: 1px solid green;
  //   position: absolute;
  //   z-index: 999;
  // }
}
</style>
