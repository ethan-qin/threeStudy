/*
 * @Author: ethan.qin
 * @Date: 2019-10-25 16:59:29
 * @LastEditTime: 2019-10-25 17:09:14
 * @LastEditors: ethan.qin
 */
export default class WebWorker {
  constructor(worker) {
    const code = worker.toString();
    const blob = new Blob(["(" + code + ")()"])
    return new Worker(URL.createObjectURL(blob));
  }
}