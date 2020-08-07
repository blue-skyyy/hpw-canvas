<template>
  <div>
    <div id="image_canvas_wrap" ref="image_canvas_wrap">
      <canvas id="image_canvas"></canvas>
    </div>
    <button @click="addrect">添加对象</button>
    <button @click="delreact">删除对象</button>
    <button @click="prev">上一张</button>
    <button @click="next">下一张</button>
    <button @click="saveCurrState">保存</button>
    <button @click="undo">上一步</button>
    <button @click="test">测试</button>
    <menu-drag />
  </div>
</template>

<script>
import { fabric } from "fabric";
import { imageList } from "./util.js";
import Item from "./Item";
import MenuDrag from "./menu/drag.vue";
const methods = {
  test() {
    // this.canvas.absolutePan({ x: 10, y: 10 });
    // this.canvas.renderAll();
    var units = 10;
    var delta = new fabric.Point(0, units);
    this.canvas.relativePan(delta);
  },
  drag(e) {
    let odiv = e.target; //获取目标元素

    //算出鼠标相对元素的位置
    let disX = e.clientX - odiv.offsetLeft;
    let disY = e.clientY - odiv.offsetTop;
    document.onmousemove = (e) => {
      //鼠标按下并移动的事件
      //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
      let left = e.clientX - disX;
      let top = e.clientY - disY;

      //绑定元素位置到positionX和positionY上面
      this.positionX = top;
      this.positionY = left;

      //移动当前元素
      odiv.style.left = left + "px";
      odiv.style.top = top + "px";
    };
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  },
  addrect() {
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
    this.rect = rect;

    this.canvas.add(rect);
    this.canvas.renderAll();
  },
  delreact() {
    this.canvas.remove(this.rect);
    this.canvas.renderAll();
  },
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
    this.canvas.on("path:created", this.dealCreated);
  },
  dealCreated(e) {
    console.log("e", e);
  },
  toNext() {
    this.currIndex += 1;
    this.switchImage(this.currIndex);
  },
  dealAdd() {
    // console.log("----dealAdd----");

    if (this.historyChanging) return;
    // this.save();
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

  afterSwitch(index, itemObj, fisrtRender = false) {
    const { imageInfo } = itemObj;
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
        this.clearBoard();
        this.setCanvasWH(imageInfo.scale.width, imageInfo.scale.height);
        // 初次加载的Image，需要自动创建一条历史记录
        // this.save();
        this.currItem.bgImg = bgImg;
        this.canvas.add(bgImg);
        this.canvas.renderAll();
        this.historyChanging = false;
        this.switching = false;
      });
    } else {
      // 非首次加载
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
        () => this.afterSwitch(index, itemObj, true)
      );
      this.currItem = itemObj;
    } else if (obj && obj.rendered) {
      // 非首次渲染
      let state = itemObj.getCurrState();
      this.canvas.loadFromJSON(state, () => {
        this.afterSwitch(index, itemObj, false);
        // this.bgImg = this.canvas.getObjects()[0];
        // this.bgImg.rotate(itemObj.rotate);
        // this.isCorrectionWorkVersion && this.changeZoom(itemObj.zoom);
        // afterSwitch(false);
      });
    }
  },
  saveCurrState() {
    // 保存当前状态
    if (!this.currItem) return;

    this.currItem.save("dt===", this.canvas.toJSON());
  },
  undo() {
    // debugger;
    let h = this.currItem.getPreHistory();
    console.log("h", h);
    this.canvas.loadFromJSON(h, () => {
      this.canvas.renderAll();
    });
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

    this.initCanvas();

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
  },
  components: {
    MenuDrag
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
    position: absolute;
  }
}
</style>
