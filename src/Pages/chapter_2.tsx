import * as React from 'react';
import { Scene, WebGLRenderer, PerspectiveCamera, SphereGeometry, MeshPhongMaterial, Mesh, Color, DirectionalLight, Texture, DoubleSide, BackSide, MeshBasicMaterial, TextureLoader, MeshLambertMaterial, Vector3 } from 'three';
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
      const camOffset = 100;
      let direction = new Vector3();
      let width = this.containerRef.current.clientWidth;
      let height = this.containerRef.current.clientHeight;
      let scene = new Scene();
      let renderer = new WebGLRenderer({ powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      let camera = this.createCamera(width, height);
      let controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.maxDistance = 1500;
      // controls.enablePan = false;
      // controls.enableZoom = false;
      let earth = this.createEarth()
      let earthSmall = this.createEarth()
      earthSmall.position.set(0, 0, 450);
      scene.add(earth);
      scene.add(earthSmall);
      scene.add(this.createDirectLight());
      scene.add(this.createBackground())
      const Sun = new Mesh(new SphereGeometry(10.2, 16, 16),
        new MeshLambertMaterial({
          color: 0xffff00,
          emissive: 0xdd4422,
          opacity: 0
        })
      );
      Sun.name = 'Sun';
      scene.add(Sun);
      this.makeCanvasCloud().then(f => {
        let cloud = this.createEarthCloud(f);
        scene.add(cloud)
        if (this.containerRef.current) {
          this.containerRef.current.appendChild(renderer.domElement);
          let angle = 0;
          let animate = () => {
            requestAnimationFrame(animate);
            // direction.subVectors(camera.position, controls.target);
            // direction.normalize().multiplyScalar(camOffset);
            // camera.position.copy(direction.add(controls.target));
            // earth.getWorldPosition(controls.target)
            controls.target = new Vector3().copy(earth.position)
            angle += 0.01;
            earth.rotation.y += 0.001;
            cloud.rotation.y += 0.002;
            earthSmall.position.set(450 * Math.sin(angle), 0, 450 * Math.cos(angle));
            // cloud.position.set(500 * Math.sin(angle), 0, 500 * Math.cos(angle));
            controls.update();
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
    let camera = new PerspectiveCamera(45, width / height, 0.1, 10000);
    camera.position.set(0, 200, 0);
    // camera.lookAt(0, 0, 0);
    return camera
  }

  // 创建地球
  createEarth() {
    let geomary = new SphereGeometry(8, 32, 32);
    let material = new MeshPhongMaterial({
      map: new TextureLoader().load('./images/earth1.jpg'),
      bumpMap: new TextureLoader().load('./images/bathymetry.jpg'),
      bumpScale: 1.5,
      shininess: 5
    })
    let Earth = new Mesh(geomary, material);
    Earth.position.set(0, 0, 500)
    return Earth;
  }
  // 创建地球云层

  createEarthCloud(cloud: HTMLCanvasElement) {
    let geomary = new SphereGeometry(8.2, 32, 32);
    let cloudTexture = new Texture(cloud);
    cloudTexture.needsUpdate = true;
    let material = new MeshPhongMaterial({
      map: cloudTexture,
      side: DoubleSide,
      opacity: 0.8,
      transparent: true
    })
    let mesh = new Mesh(geomary, material);
    mesh.position.set(0, 0, 500)
    return mesh;
  }
  // 创建背景图
  createBackground() {
    let geomery = new SphereGeometry(1500, 32, 32);
    let material = new MeshBasicMaterial({
      map: new TextureLoader().load('./images/galaxy_starfield.png'),
      side: BackSide
    })
    return new Mesh(geomery, material)
  }

  // 创建点光源
  createDirectLight() {
    let light = new DirectionalLight(0xffffff, 1.5);
    light.position.set(10, 0, 0);
    return light;
  }
  public render() {
    return (
      <div id="container" ref={this.containerRef} style={{ width: '100%', height: '100%' }}>
      </div>
    );
  }
}
