import * as React from 'react';
import { Scene, WebGLRenderer, PerspectiveCamera, SphereGeometry, MeshPhongMaterial, Mesh, Color, DirectionalLight, Texture, DoubleSide, BackSide, MeshBasicMaterial, TextureLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
export interface IChapter1Props {
}

export interface IChapter1State {
}

export default class Chapter2 extends React.Component<IChapter1Props, IChapter1State> {
  constructor(props: IChapter1Props) {
    super(props);

    this.state = {
    }
  }
  private containerRef = React.createRef<HTMLDivElement>()
  componentDidMount() {
    if (this.containerRef.current) {
      let width = this.containerRef.current.clientWidth;
      let height = this.containerRef.current.clientHeight;
      let scene = new Scene();
      let renderer = new WebGLRenderer({ powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      let camera = this.createCamera(width, height);
      let controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.maxDistance = 800;
      let earth = this.createEarth()
      scene.add(earth);
      scene.add(this.createDirectLight());
      scene.add(this.createBackground())
      this.makeCanvasCloud().then(f => {
        let cloud = this.createEarthCloud(f);
        scene.add(cloud)
        if (this.containerRef.current) {
          this.containerRef.current.appendChild(renderer.domElement);
          let animate = () => {
            earth.rotation.y += 0.001;
            cloud.rotation.y += 0.002;
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
          }
          animate()

        }
      })
    }
  }
  makeCanvasCloud(): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      let canvasResults = document.createElement('canvas');
      canvasResults.width = 1024;
      canvasResults.height = 512;
      let contextResult = canvasResults.getContext('2d');
      let imageMap = new Image();
      imageMap.addEventListener('load', () => {
        let canvasMap = document.createElement('canvas');
        canvasMap.width = imageMap.width;
        canvasMap.height = imageMap.height;
        let contextMap = canvasMap.getContext('2d');
        if (contextMap) {
          contextMap.drawImage(imageMap, 0, 0);
          let dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);
          let imageTrans = new Image();
          imageTrans.addEventListener('load', () => {
            let canvasTrans = document.createElement('canvas');
            canvasTrans.width = imageTrans.width;
            canvasTrans.height = imageTrans.height;
            let contextTrans = canvasTrans.getContext('2d');
            if (contextTrans) {
              contextTrans.drawImage(imageTrans, 0, 0);
              let dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
              let dataResult = contextTrans.getImageData(0, 0, canvasMap.width, canvasMap.height);
              for (let index = 0, offset = 0; index < imageMap.height; index++) {
                for (let j = 0; j < imageMap.width; j++ , offset += 4) {
                  dataResult.data[offset + 0] = dataMap.data[offset + 0]
                  dataResult.data[offset + 1] = dataMap.data[offset + 1]
                  dataResult.data[offset + 2] = dataMap.data[offset + 2]
                  dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0]
                }

              }
              if (contextResult) {
                contextResult.putImageData(dataResult, 0, 0)
                resolve(canvasResults)
              } else {
                reject()
              }
            } else {
              reject()
            }
          }, false)
          imageTrans.src = './images/earthcloudmaptrans.jpg'
        } else {
          reject()
        }

      }, false);
      imageMap.src = "./images/earthcloudmap.jpg"
    })
  }

  // 创建camera
  createCamera(width: number, height: number) {
    let camera = new PerspectiveCamera(45, width / height, 0.1, 1600);
    camera.position.set(-80, 200, 500);
    camera.lookAt(0, 0, 0);
    return camera
  }

  // 创建地球
  createEarth() {
    let geomary = new SphereGeometry(80, 80, 80);
    let material = new MeshPhongMaterial({
      map: new TextureLoader().load('./images/earthmap1k.jpg'),
      bumpMap: new TextureLoader().load('./images/earthbump1k.jpg'),
      bumpScale: 1,
      specularMap: new TextureLoader().load('./images/earthspec1k.jpg'),
      specular: new Color('#666'),
      shininess: 5
    })
    return new Mesh(geomary, material);
  }
  // 创建地球云层

  createEarthCloud(cloud: HTMLCanvasElement) {
    let geomary = new SphereGeometry(80.2, 90, 90);
    let cloudTexture = new Texture(cloud);
    cloudTexture.needsUpdate = true;
    let material = new MeshPhongMaterial({
      map: cloudTexture,
      side: DoubleSide,
      opacity: 0.8,
      transparent: true
    })
    let mesh = new Mesh(geomary, material);
    return mesh;
  }
  // 创建背景图
  createBackground() {
    let geomery = new SphereGeometry(800, 32, 32);
    let material = new MeshBasicMaterial({
      map: new TextureLoader().load('./images/galaxy_starfield.png'),
      side: BackSide
    })
    return new Mesh(geomery, material)
  }

  // 创建点光源
  createDirectLight() {
    let light = new DirectionalLight(0xffffff, 1.5);
    light.position.set(300, 200, 500);
    return light;
  }
  public render() {
    return (
      <div id="container" ref={this.containerRef} style={{ width: '100%', height: '100%' }}>
      </div>
    );
  }
}
