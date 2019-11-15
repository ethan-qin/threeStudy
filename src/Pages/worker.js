import { ImageBitmapLoader } from "three";
export default () => {
  console.log(1111111111111111111111111);
  
  self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
    if (!e) return;
    let loader = new ImageBitmapLoader().setPath('./');
    loader.load('./images/snowflake1.png', function (imageBitMap) {
      console.log(imageBitMap);

    })
    console.log(e);

  })
}
