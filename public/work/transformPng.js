/*
 * @Author: ethan.qin
 * @Date: 2019-10-25 15:39:19
 * @LastEditTime: 2019-10-25 16:50:18
 * @LastEditors: ethan.qin
 */
addEventListener('message', (message) => {
  console.log('in webworker', message);
  postMessage('this is the response ' + message.data);
});
  // let canvasResults = document.createElement('canvas');
  // canvasResults.width = 1024;
  // canvasResults.height = 512;
  // let contextResult = canvasResults.getContext('2d');
  // let imageMap = new Image();
  // imageMap.addEventListener('load', () => {
  //   let canvasMap = document.createElement('canvas');
  //   canvasMap.width = imageMap.width;
  //   canvasMap.height = imageMap.height;
  //   let contextMap = canvasMap.getContext('2d');
  //   if (contextMap) {
  //     contextMap.drawImage(imageMap, 0, 0);
  //     let dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);
  //     let imageTrans = new Image();
  //     imageTrans.addEventListener('load', () => {
  //       let canvasTrans = document.createElement('canvas');
  //       canvasTrans.width = imageTrans.width;
  //       canvasTrans.height = imageTrans.height;
  //       let contextTrans = canvasTrans.getContext('2d');
  //       if (contextTrans) {
  //         contextTrans.drawImage(imageTrans, 0, 0);
  //         let dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
  //         let dataResult = contextTrans.getImageData(0, 0, canvasMap.width, canvasMap.height);
  //         for (let index = 0, offset = 0; index < imageMap.height; index++) {
  //           for (let j = 0; j < imageMap.width; j++ , offset += 4) {
  //             dataResult.data[offset + 0] = dataMap.data[offset + 0]
  //             dataResult.data[offset + 1] = dataMap.data[offset + 1]
  //             dataResult.data[offset + 2] = dataMap.data[offset + 2]
  //             dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0]
  //           }

  //         }
  //         if (contextResult) {
  //           contextResult.putImageData(dataResult, 0, 0)
  //           postMessage(canvasResults)
  //         }
  //       }
  //     }, false)
  //     imageTrans.src = './images/earthcloudmaptrans.jpg'
  //   }

  // }, false);
  // imageMap.src = "./images/earthcloudmap.jpg"