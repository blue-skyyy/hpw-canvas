const imageList = [
  // "http://lorempixel.com/400/400/fashion",
  "http://b.hiphotos.baidu.com/image/pic/item/359b033b5bb5c9ea5c0e3c23d139b6003bf3b374.jpg",
  "http://a.hiphotos.baidu.com/image/pic/item/8d5494eef01f3a292d2472199d25bc315d607c7c.jpg",
  "http://g.hiphotos.baidu.com/image/pic/item/6d81800a19d8bc3e770bd00d868ba61ea9d345f2.jpg"
];

const scaleWH = (imageW, imageH, maxWidth, maxHeight) => {
  // 用于设定图片的宽度和高度
  let tempWidth;
  let tempHeight;

  if (imageW > 0 && imageH > 0) {
    //原图片宽高比例 大于 指定的宽高比例，这就说明了原图片的宽度必然 > 高度
    if (imageW / imageH >= maxWidth / maxHeight) {
      if (imageW > maxWidth) {
        tempWidth = maxWidth;
        // 按原图片的比例进行缩放
        tempHeight = (imageH * maxWidth) / imageW;
      } else {
        // 按原图片的大小进行缩放
        tempWidth = imageW;
        tempHeight = imageH;
      }
    } else {
      // 原图片的高度必然 > 宽度
      if (imageH > maxHeight) {
        tempHeight = maxHeight;
        // 按原图片的比例进行缩放
        tempWidth = (imageW * maxHeight) / imageH;
      } else {
        // 按原图片的大小进行缩放
        tempWidth = imageW;
        tempHeight = imageH;
      }
    }
    return {
      // 让canvas有留白
      width: Number((tempWidth - 10).toFixed(2)),
      height: Number((tempHeight - 10).toFixed(2))
    };
  }
};

export { scaleWH, imageList };
