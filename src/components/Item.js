import { isImageVaild } from "../utils.js";
// 每张带修饰图片产生一个实例
export default class Item {
  constructor(options) {
    this.scale = 1;
    this.historyList = [];
    this.historyIndex = -1;
    this.url = options.url;
    this.canvas = options.canvas;
    this.originState = null;
    this.h5 = {
      originState: null,
      canvas: options.h5canvas,
      historyList: [],
      historyIndex: -1
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
  getHis() {
    console.log("getHis---length", this.historyList.length);
  }

  getCurrState(index) {
    // 当前状态
    if (!this.historyList.length) return;

    let historyList = this.historyList;
    if (index <= 0) {
      // 左边界
      this.h5.canvas.putImageData(this.h5.originState, 0, 0);
      this.historyList = [];
      return this.originState;
    }
    this.historyList = this.historyList.slice(0, index + 1);
    let data = historyList[index].data;
    if (historyList[index].type === "h5") {
      // 原生
      // console.log("data", data);
      this.h5.canvas.putImageData(data, 0, 0);
      // this.h5.canvas.putImageData(imageData, 0, 0);
      // return;
    } else {
      // fabirc
      return historyList[index].data;
    }
    // this
  }
  getPreHistory() {
    console.log("getHis---length", this.historyList);
    let historyIndex = this.historyIndex - 1;
    console.log("getPreHistory----before", this.historyIndex);
    if (historyIndex < 0) {
      this.historyIndex = historyIndex;
      console.log("history index out of range");
      return [
        { type: "h5", data: this.h5.originState },
        { type: "fabric", data: this.originState }
      ];
    }
    // let history = this.historyList[historyIndex];
    // let historyList = []
    //   .concat(this.historyList)
    //   .slice(0, this.historyList.length - 2);
    // history应该是
    // for (let i = historyList.length - 1;i >=0 ; i--) {
    //   if ()
    // }
    // let i =historyList.lastIndexOf()
    // for (var i= historyList.length-1;i>=0;i--){
    //     console.log(historyList[i]);
    //     if ()
    // }
    // console.log("history", this.historyList[historyIndex]);
    if (!history) {
      console.log("no history");
      return null;
    }

    this.historyIndex = historyIndex;
    console.log("getPreHistory--after", this.historyIndex);
    return history;
    // if (this.historyList[historyIndex].type === "h5") {
    //   // 原生
    //   this.h5.canvas.putImageData(history, 0, 0);
    // } else {
    //   // fabirc
    //   return history;
    // }
  }

  isImageVaild() {
    return isImageVaild(this.url);
  }
  currItem() {}
  getCurrStateIndex() {
    return this.historyIndex;
  }
  save(type, data, flag = false) {
    if (flag === "init") {
      if (type === "h5") {
        this.h5.originState = data;
      } else if (type === "fabric") {
        this.originState = data;
      }

      // this.historyList.push({h5: {data: }})
    }
    if (!flag) {
      if (this.historyList.length) {
        if (
          JSON.stringify(data) ===
          JSON.stringify(this.historyList[this.historyList.length - 1].data)
        ) {
          // 状态相等不保存
          return;
        }
      }
      // 记录修改历史
      // 未考虑保存历史记录数量过大的情况
      let historyList = this.historyList;
      let historyIndex = this.historyIndex;
      console.log(
        "type",
        type,
        "save---before",
        this.historyIndex,
        "length",
        this.historyList.length
      );
      // 若从历史记录中的非终点开始进行了修改
      // 则需要移除之后的历史记录，并将当前作为新的终点
      // !注意，即使针对当前历史记录没有修改，也会进行保存，并抹掉之后的历史记录
      if (historyIndex < historyList.length - 1) {
        console.log("yes");
        historyList = historyList.slice(0, historyIndex + 1);
      }

      historyList.push({ data, type });

      historyIndex += 1;
      this.historyList = historyList;

      this.historyIndex = historyIndex;
    }
    // "this.historyList",
    // this.historyList
    console.log(
      "save----after",
      this.historyIndex,
      "length",
      this.historyList.length
    );
  }

  geth5State(flag) {
    if (!this.h5.historyList.length) return;
    let imageData;
    if (flag === "undo" && this.h5.historyIndex > 0) {
      // 回退
      imageData = this.h5.historyList[this.h5.historyIndex - 1];
      this.h5.canvas.putImageData(imageData, 0, 0);
      this.h5.historyIndex -= 1;
      // 始终保存最原始记录
      this.h5.historyList = this.h5.historyList.slice(
        0,
        this.h5.historyIndex === 0 ? 1 : this.h5.historyIndex
      );
    }
  }
  h5undo() {
    if (!this.h5.hstoryList.length) return;
    let imageData = this.h5.historyList[this.h5.historyIndex - 1];
    this.ctx.putImageData(imageData, 0, 0);
    this.h5.historyIndex -= 1;
  }
  h5exprot() {
    return this.h5.canvas.export();
  }
}
