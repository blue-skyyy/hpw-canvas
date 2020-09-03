<template>
  <div id="container">
    <div id="image_canvas_wrap" ref="image_canvas_wrap">
      <canvas id="image_canvas" ref="image_canvas"></canvas>
    </div>
    <div id="menu">
      <menu-switch-image
        @prevFunc="prev"
        @nextFunc="next"
        :prev="myConfig && myConfig.prev"
        :next="myConfig && myConfig.next"
        class="menu_item"
      >
      </menu-switch-image>

      <menu-undo
        :mode="mode"
        :canvas="canvas"
        @click="switchMode('undo')"
        class="menu_item"
      ></menu-undo>

      <menu-drag
        :mode="mode"
        :canvas="canvas"
        @click="switchMode('drag')"
        class="menu_item"
      />
      <menu-pencil
        :mode="mode"
        :canvas="canvas"
        @click="switchMode('pencil')"
        :color="myConfig && myConfig.color"
        :pencilSizeList="myConfig && myConfig.pencilSizeList"
        :pencilSize="myConfig && myConfig.pencilSize"
        @changeConfig="changeConfig"
        ref="pencil"
        class="menu_item"
      />

      <menu-eraser
        :canvas="canvas"
        :mode="mode"
        @click="switchMode('eraser')"
        class="menu_item"
      />
      <menu-color
        @click="switchMode"
        class="menu_item"
        :colorList="myConfig && myConfig.colorList"
        :mode="mode"
        @changeConfig="changeConfig"
      >
      </menu-color>

      <menu-rotate
        class="menu_item"
        :canvas="canvas"
        :currItem="currItem"
        :rotateRight="myConfig && myConfig.rotateRight"
        :rotateLeft="myConfig && myConfig.rotateLeft"
      />

      <menu-zoom
        class="menu_item"
        :canvas="canvas"
        :zoomIn="myConfig && myConfig.zoomIn"
        :zoomOut="myConfig && myConfig.zoomOut"
      />

      <menu-restore
        :canvas="canvas"
        :bg="currItem && currItem.bgImg"
        :currItem="currItem"
        class="menu_item"
      ></menu-restore>

      <menu-download :canvas="canvas" class="menu_item"> </menu-download>
    </div>
    <!-- <button @click="addrect">添加对象</button>
    <button @click="delreact">删除对象</button>
    <button @click="prev">上一张</button>
    <button @click="next">下一张</button>
    <button @click="saveCurrState">保存</button>
    <button @click="undo">上一步</button>
    <button @click="test">测试</button> -->
  </div>
</template>

<script>
import { fabric } from "fabric";
import { imageList } from "./util.js";
import Item from "./Item";
import MenuDrag from "./menu/drag.vue";
import MenuPencil from "./menu/pencil.vue";
import MenuZoom from "./menu/zoom.vue";
import MenuRestore from "./menu/restore.vue";
import MenuRotate from "./menu/rotate.vue";
import MenuColor from "./menu/color.vue";
import MenuEraser from "./menu/eraser.vue";
import MenuSwitchImage from "./menu/switchImage.vue";
import MenuDownload from "./menu/download.vue";
import MenuUndo from "./menu/undo.vue";
const methods = {
  initEvents() {
    // 点击菜单外区域将弹出层清除
    document.addEventListener("click", (e) => {
      let menu = document.querySelector("#menu");
      if (!e.target.id === "menu" || !menu.contains(e.target)) {
        this.$refs.pencil.unShow();
      }
    });
  },
  changeConfig(prop, value) {
    this.myConfig[prop] = value;
    // console.log(" this.myConfig----change", this.myConfig);
  },
  freeDraw(canvas = this.canvas) {
    this.canvas.isDrawingMode = true;
    var hLinePatternBrush = new fabric.PatternBrush(canvas);
    hLinePatternBrush.getPatternSrc = (function(fabric) {
      return function() {
        var patternCanvas = fabric.document.createElement("canvas");
        patternCanvas.width = patternCanvas.height = 10;
        var ctx = patternCanvas.getContext("2d");
        ctx.strokeStyle = "green";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.lineTo(5, 10);
        ctx.closePath();
        ctx.stroke();
        return patternCanvas;
      };
    })(fabric);

    canvas.freeDrawingBrush = hLinePatternBrush;
    // canvas.freeDrawingBrush.width = 20;
  },
  switchMode(mode) {
    // if (this.mode === mode) {
    //   this.mode = "";
    //   return;
    // }
    this.mode = mode;

    console.log("this.mode", this.mode);
  },
  test() {
    this.freeDraw(this.canvas);
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

    // this.canvas.on("mouse:wheel", this.mouseWheel);
    this.canvas.on("path:created", this.dealCreated);
  },
  dealCreated() {
    if (this.mode === "eraser") {
      // let objs = this.canvas.getObjects();
      // console.log("objs", objs);
      // let paths = [];
      // for (let i = 0; i < objs.length; i++) {
      //   if (objs[i].get("type") === "path" && objs[i].modeType === "eraser") {
      //     // path类型
      //     paths.push(objs[i]);
      //   }
      // }
    }

    if (this.mode === "pencil") {
      // cxt.globalCompositeOperation = "source-over";
      // e.path.set({
      //   globalCompositeOperation: "source-over"
      // });
      // e.path.globalCompositeOperation = "source-over";
      // e.path.selectable = false;
      // e.path.evented = false;
      // e.path.absolutePositioned = true;
    }

    // this.canvas.renderAll();
  },
  toNext() {
    this.currIndex += 1;
    this.switchImage(this.currIndex);
  },
  dealAdd() {
    // console.log("----dealAdd----", e);
    // if (this.historyChanging) return;
    // if (e.target.isBg) return;
    // if (!e.target.isContainedWithinObject(this.currItem.bgImg)) {
    // e.target.set({
    //   hasBorders: false,
    //   hasControls: false,
    //   selectable: false
    // });
    // this.canvas.remove(e.target);
    // setTimeout(() => alert("请在图片范围内操作"), 500);
    //   return;
    // }
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
        bgImg.scaleY = scaleY;
        bgImg.scaleX = scaleX;
        bgImg.translateX = "center";
        bgImg.translateY = "center";
        bgImg.globalCompositeOperation = "destination-over";
        bgImg.crossOrigin = "Anonymous";
        bgImg.left = 0;
        bgImg.top = 0;
        bgImg.zIndex = 1;
        bgImg.isBg = true;
        this.clearBoard();
        this.setCanvasWH(
          imageInfo.scale.width - 10,
          imageInfo.scale.height - 10
        );
        // 初次加载的Image，需要自动创建一条历史记录
        // this.save();
        bgImg.sendToBack();
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
    let h = this.currItem.getPreHistory();
    this.canvas.loadFromJSON(h, () => {
      this.canvas.renderAll();
    });
  }
};
export default {
  mounted() {
    // 静用缓存 该属性会对line hover事件产生影响 高亮不生效
    fabric.Object.prototype.objectCaching = false;
    let canvas = new fabric.Canvas("image_canvas", {
      // isDrawingMode: true
    });

    // 实现mouseover事件
    canvas.findTarget = (function(originalFn) {
      return function() {
        let target = originalFn.apply(this, arguments);
        if (target) {
          if (this._hoveredTarget !== target) {
            canvas.fire("object:over", { target: target });
            if (this._hoveredTarget) {
              canvas.fire("object:out", { target: this._hoveredTarget });
            }
            this._hoveredTarget = target;
          }
        } else if (this._hoveredTarget) {
          canvas.fire("object:out", { target: this._hoveredTarget });
          this._hoveredTarget = null;
        }
        return target;
      };
    })(canvas.findTarget);
    // var f = fabric;
    // canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);

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

    this.initEvents();
    // this.freeDraw(canvas);

    this.itemList = this.itemList.map((d) => {
      return {
        url: d,
        rendered: false
      };
    });

    this.toNext();
  },
  methods,
  props: {
    config: {
      default: () => {},
      type: Object
    }
  },
  data() {
    const defaultConfig = {
      colorList: ["red", "green", "blue", "pink"],
      color: "red",
      pencilSizeList: [10, 15, 20, 40],
      pencilSize: 15,
      rotateLeft: true,
      rotateRight: true,
      zoomIn: true,
      zoomOut: true,
      prev: true,
      next: true
    };
    return {
      canvas: null,
      conWH: {},
      historyChanging: false,
      itemList: imageList,
      currIndex: -1,
      currItem: null,
      panning: false,
      mode: "",
      freeDrawingBrushWidth: 20,
      myConfig: Object.assign({}, defaultConfig, this.config)

      // colors: {}
      // statusList: null,
    };
  },
  components: {
    MenuDrag,
    MenuPencil,
    MenuZoom,
    MenuRestore,
    MenuRotate,
    MenuColor,
    MenuEraser,
    MenuSwitchImage,
    MenuDownload,
    MenuUndo
  }
};
</script>

<style lang="less" scoped>
#container {
  // overflow: hidden;
}
#image_canvas_wrap {
  // box-sizing: border-box;
  box-sizing: content-box;
  width: 800px;
  height: 600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: scroll;
  background: #fff;
  background-image: linear-gradient(
      45deg,
      #ccc 25%,
      transparent 25%,
      transparent 75%,
      #ccc 75%,
      #ccc
    ),
    linear-gradient(
      45deg,
      #ccc 25%,
      transparent 25%,
      transparent 75%,
      #ccc 75%,
      #ccc
    );
  background-size: 24px 24px;
  background-position: 0 0, 12px 12px;
  #image_canvas {
    height: 100%;
    width: 100%;
    border: 3px solid #29323c;
    box-sizing: border-box;
  }
}
#menu {
  width: 800px;
  height: 50px;
  position: relative;
  z-index: 1;

  background: #485563; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to bottom,
    #29323c,
    #485563
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom,
    #29323c,
    #485563
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  margin: 0 auto;
  display: flex;
  align-items: center;
  .menu_item {
    flex: 1;
    position: relative;
  }
}
</style>
