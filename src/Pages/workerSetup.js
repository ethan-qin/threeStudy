/*
 * @Author: ethan.qin
 * @Date: 2019-11-13 17:28:03
 * @LastEditTime: 2019-11-15 17:10:18
 * @LastEditors: ethan.qin
 */
var URL = window.URL || window.webkitURL;

module.exports = function (content, url) {
  console.log(content);

  try {
    try {
      var blob;
      console.log(1111);

      try {
        console.log('1');
        // BlobBuilder = Deprecated, but widely implemented
        var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
        console.log('2');

        blob = new BlobBuilder();
        console.log('3');

        blob.append(content);
        console.log('4');

        blob = blob.getBlob();
        console.log('blob', blob);

      } catch (e) {
        // The proposed API
        console.log('e', e);

        blob = new Blob([content]);
      }

      return new Worker(URL.createObjectURL(blob));
    } catch (e) {
      console.log('e', e);

      return new Worker('data:application/javascript,' + encodeURIComponent(content));
    }
  } catch (e) {
    if (!url) {
      throw Error('Inline worker is not supported');
    }
    console.log('结束啦');

    return new Worker(url);
  }
};