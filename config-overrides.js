/*
 * @Author: ethan.qin
 * @Date: 2019-10-21 16:48:32
 * @LastEditTime: 2019-10-21 16:51:07
 * @LastEditors: ethan.qin
 */
const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA57A' },
  }),
);