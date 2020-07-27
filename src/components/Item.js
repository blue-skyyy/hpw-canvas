import { isImageVaild } from "../utils.js";
// 每张带修饰图片产生一个实例
export default class Item {
  constructor(options) {
    this.scale = 1;
    this.historyList = [];
    this.currentStateIndex = -1;
    this.url = options.url;
    this.canvas = options.canvas;
    this.h5 = {
      canvas: options.h5canvas,
      historyList: [],
      currentSatateIndex: -1
    };
    // this.h5canvas = options.h5canvas;
    // this.h5HistoryList = [];
    // this.h5StateIndex = -1;
    // this.h5Current
    // this.url = url;
    // checkImage() {

    // }
    //  this.url
  }

  // 当前状态
  getCurrState() {}
  checkImageUrl() {
    return isImageVaild(this.url);
  }
  currItem() {}
  getCurrStateIndex() {
    return this.currentStateIndex;
  }
  save() {
    // 一个是fabric 一个是h5canvas 由currentStateIndex 关联
  }
  h5save() {
    let imageData = this.h5.canvas.saveImageData();
    this.h5.historyList.push(imageData);
    this.h5.currentSatateIndex = this.h5.currentSatateIndex + 1;
    console.log(
      "this.h5.save",
      this.h5.historyList,
      this.h5.currentSatateIndex
    );
  }
  geth5State(flag) {
    // let flags =
    // let
    // console.log("this.h5.historyList.length", this.h5.historyList.length);
    if (!this.h5.historyList.length) return;
    let imageData;
    if (flag === "undo" && this.h5.currentSatateIndex > 0) {
      // 回退
      imageData = this.h5.historyList[this.h5.currentSatateIndex - 1];
      // console.log("imageData", imageData, this.h5.currentSatateIndex);
      this.h5.canvas.putImageData(imageData, 0, 0);
      this.h5.currentSatateIndex -= 1;
      // 始终保存最原始记录
      this.h5.historyList = this.h5.historyList.slice(
        0,
        this.h5.currentSatateIndex === 0 ? 1 : this.h5.currentSatateIndex
      );

      console.log(" this.h5.inded", this.h5.currentSatateIndex);
      console.log("this.h5.historyList", this.h5.historyList);
    }

    if (flag === "redo") {
      // 前进
    }
    // if (!this.h5.hstoryList.length) return;
    // this.ctx.putImageData(imageData, 0, 0);
    // this.h5.currentSatateIndex -= 1;
  }
  h5undo() {
    if (!this.h5.hstoryList.length) return;
    let imageData = this.h5.historyList[this.h5.currentSatateIndex - 1];
    this.ctx.putImageData(imageData, 0, 0);
    this.h5.currentSatateIndex -= 1;
  }
  h5exprot() {
    return this.h5.canvas.export();
  }
}
