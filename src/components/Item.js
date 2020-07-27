import { isImageVaild } from "../utils.js";
// 每张带修饰图片产生一个实例
export default class Item {
  constructor(options) {
    this.scale = 1;
    this.historyList = [];
    this.currentStateIndex = -1;
    this.url = options.url;
    this.canvas = options.canvas;
    this.originState = null;
    this.h5 = {
      originState: null,
      canvas: options.h5canvas,
      historyList: [],
      currentStateIndex: -1
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

  getCurrState (index) {
    // 当前状态 
    // 
    console.log("index", index, this.historyList);

    if (!this.historyList.length) return;

    let historyList = this.historyList;
    if (index < 0) {
      // 左边界
      this.h5.canvas.putImageData(this.h5.originState, 0, 0);
      this.historyList = [];
      return this.originState;
    }
    this.historyList = this.historyList.slice(0, index + 1);
    let data = historyList[index].data;
    if (historyList[index].type === "h5") {
      // 原生
      console.log("data", data);
      this.h5.canvas.putImageData(data, 0, 0);
      // this.h5.canvas.putImageData(imageData, 0, 0);
      return;
    } else {
      // fabirc
      return historyList[index].data;
    }
    // this
  }
  getPreState () {
    // this
    console.log("currentStateIndex", this.currentStateIndex);
    if (!this.historyList.length) return;
    // if (this.currentStateIndex)
    let index = this.currentStateIndex;
    this.currentStateIndex = (index - 1) <= -1 ? -1 : (index - 1);
    console.log("currentStateIndex", this.currentStateIndex);
    return this.getCurrState(this.currentStateIndex);
    // this.currentStateIndex
  }

  checkImageUrl () {
    return isImageVaild(this.url);
  }
  currItem () { }
  getCurrStateIndex () {
    return this.currentStateIndex;
  }
  save (data, flag = false) {
    if (flag === "init") {
      this.originState = data;
      return;
    }
    if (!flag) {
      if (this.h5.historyList.length) {
        if (data === this.historyList[this.h5.historyList.length - 1]) {
          // 状态相等不保存
          return;
        }
      }
      this.historyList.push({ data: data, type: "fabric" });
      this.currentStateIndex = this.currentStateIndex + 1;
    }

    console.log("save", this.currentStateIndex);
  }
  h5save (flag = false) {
    if (flag === "init") {
      this.h5.originState = this.h5.canvas.saveImageData();
      return;
    }

    if (!flag) {
      let imageData = this.h5.canvas.saveImageData();
      if (this.h5.historyList.length) {
        if (JSON.stringify(imageData) === JSON.stringify(this.historyList[this.h5.historyList.length - 1])) {
          // 状态相等不保存
          return;
        }
      }
      this.historyList.push({ data: imageData, type: "h5" });
      this.currentStateIndex += 1;
    }

    // let imageData = this.h5.canvas.saveImageData();
    // if (this.h5.historyList.length) {
    //   if (JSON.stringify(imageData) === JSON.stringify(this.historyList[this.h5.historyList.length - 1])) {
    //     // 状态相等不保存
    //     return;
    //   }
    // }

    // this.h5.historyList.push(imageData);
    // this.h5.currentStateIndex = this.h5.currentStateIndex + 1;
    console.log(
      "this.h5.save",
      this.historyList,
      // this.h5.currentStateIndex
    );
  }
  geth5State (flag) {
    if (!this.h5.historyList.length) return;
    let imageData;
    if (flag === "undo" && this.h5.currentStateIndex > 0) {
      // 回退
      imageData = this.h5.historyList[this.h5.currentStateIndex - 1];
      this.h5.canvas.putImageData(imageData, 0, 0);
      this.h5.currentStateIndex -= 1;
      // 始终保存最原始记录
      this.h5.historyList = this.h5.historyList.slice(
        0,
        this.h5.currentStateIndex === 0 ? 1 : this.h5.currentStateIndex
      );

      // console.log(" this.h5.inded", this.h5.currentStateIndex);
      // console.log("this.h5.historyList", this.h5.historyList);
    }

    // if (!this.h5.hstoryList.length) return;
    // this.ctx.putImageData(imageData, 0, 0);
    // this.h5.currentStateIndex -= 1;
  }
  h5undo () {
    if (!this.h5.hstoryList.length) return;
    let imageData = this.h5.historyList[this.h5.currentStateIndex - 1];
    this.ctx.putImageData(imageData, 0, 0);
    this.h5.currentStateIndex -= 1;
  }
  h5exprot () {
    return this.h5.canvas.export();
  }
}
