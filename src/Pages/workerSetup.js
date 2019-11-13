/*
 * @Author: ethan.qin
 * @Date: 2019-11-13 17:28:03
 * @LastEditTime: 2019-11-13 17:28:05
 * @LastEditors: ethan.qin
 */
export default class WebWorker {
	constructor(worker) {
		const code = worker.toString();
		const blob = new Blob(['('+code+')()']);
		return new Worker(URL.createObjectURL(blob));
	}
}
