<template>
  <div>
    <div id="image_canvas_wrap" ref="image_canvas_wrap">
      <canvas id="image_canvas"></canvas>
    </div>
    <button @click="next">下一张</button>
    <button @click="prev">上一张</button>
  </div>
</template>

<script>
import { fabric } from "fabric";
import { imageList } from "./util.js";
import Item from "./Item";
const methods = {
  prev() {
    this.currIndex -= 1;
    this.switchImage(this.currIndex);
  },
  next() {
    this.currIndex += 1;
    this.switchImage(this.currIndex);
  },
  setCanvasWH(w, h) {
    this.canvas.setWidth(w);
    this.canvas.setHeight(h);
  },
  initCanvas() {
    this.canvas.on("object:added", this.dealAdd);
    this.canvas.on("object:modified", this.dealModify);
    this.canvas.on("object:removed", this.dealRemove);
  },
  toNext() {
    this.currIndex += 1;
    this.switchImage(this.currIndex);
  },
  dealAdd() {
    if (this.historyChanging) return;
    console.log("----dealAdd----");
    this.save();
  },
  dealModify() {
    if (this.historyChanging) return;
    // console.log("added");
  },
  dealRemove() {
    if (this.historyChanging) return;
    // console.log("removed");
  },
  clearBoard() {
    this.canvas.getObjects().forEach((child) => {
      this.canvas.remove(child);
    });
  },

  renderBgImg(index, itemObj, fisrtRender = false) {
    const { imageInfo } = itemObj;
    // console.log("imageInfo", imageInfo);
    if (fisrtRender) {
      let bgImg = new fabric.Image();
      let scaleX = Number(
        (imageInfo.scale.width / imageInfo.origin.width).toFixed(2)
      );

      let scaleY = Number(
        (imageInfo.scale.height / imageInfo.origin.height).toFixed(2)
      );

      bgImg.setSrc(this.itemList[index].url, () => {
        bgImg.hasBorders = false;
        bgImg.hasControls = false;
        bgImg.selectable = false;
        bgImg.scaleable = false;
        bgImg.scaleY = scaleY;
        bgImg.scaleX = scaleX;
        bgImg.zIndex = 1;
        bgImg.top = 0;
        bgImg.left = 0;
        this.clearBoard();
        this.setCanvasWH(imageInfo.scale.width, imageInfo.scale.height);
        // 初次加载的Image，需要自动创建一条历史记录
        // this.save();
        this.canvas.add(bgImg);
        this.canvas.renderAll();
        this.historyChanging = false;
        this.switching = false;
      });
    }
  },
  switchImage(index) {
    if (this.currIndex < 0) return;
    let obj = this.itemList[index];
    if (!obj) return;
    let itemObj;
    if (obj && !obj.rendered) {
      // 首次渲染
      itemObj = new Item(
        {
          url: this.itemList[index].url,
          // canvas: this.canvas
          conWH: this.conWH
        },
        () => this.renderBgImg(index, itemObj, true)
      );
      this.currItem = itemObj;
    } else if (obj && obj.rendered) {
      // 非首次渲染
    }
  },
  saveCurrStaste() {
    // 保存当前状态
    if (!this.currItem) return;
  }
};
export default {
  mounted() {
    let canvas = new fabric.Canvas("image_canvas", {
      isDrawingMode: true
    });

    let containerDOM;
    this.$nextTick(() => {
      containerDOM = this.$refs.image_canvas_wrap;
      this.conWH = {
        width: containerDOM.clientWidth,
        height: containerDOM.clientHeight
      };
      // this.setCanvasWH(this.conWH.width, this.conWH.height);
    });
    this.canvas = canvas;

    //
    this.itemList = this.itemList.map((d) => {
      return {
        url: d,
        rendered: false
      };
    });

    this.toNext();
  },
  methods,
  data() {
    return {
      canvas: null,
      conWH: {},
      historyChanging: false,
      itemList: imageList,
      currIndex: -1,
      currItem: null
      // statusList: null,
    };
  }
};
</script>

<style lang="less" scoped>
#image_canvas_wrap {
  box-sizing: border-box;
  width: 800px;
  height: 600px;
  margin: 0 auto;
  border: 1px solid green;
  display: flex;
  align-items: center;
  justify-content: center;
  #image_canvas {
    height: 100%;
    width: 100%;
    border: 1px solid red;
  }
}
</style>
