import * as React from 'react';
import { Scene, WebGLRenderer, PerspectiveCamera, SphereGeometry, MeshPhongMaterial, Mesh, Color, DirectionalLight, Texture, DoubleSide, BackSide, MeshBasicMaterial, TextureLoader, MeshLambertMaterial, Vector3, PointLight, Geometry, CircleGeometry, LineBasicMaterial, LineLoop, AxesHelper } from 'three';
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
      let renderer = new WebGLRenderer({ powerPreference: 'high-performance', antialias: true });
      renderer.setSize(width, height);
      let camera = this.createCamera(width, height);
      let controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = false;
      controls.maxDistance = 1500;
      // controls.enablePan = false;
      // controls.enableZoom = false;
      let earth = this.createEarth()
      let moon = this.createMoon()
      let earthSmall = this.createEarth()
      earthSmall.position.set(0, 0, 450);
      let axerHelper = new AxesHelper(10000);
      scene.add(axerHelper)
      scene.add(earth);
      scene.add(moon);
      scene.add(this.createEarthAnnuls())
      scene.add(earthSmall);
      scene.add(this.createDirectLight());
      scene.add(this.createBackground())
      this.makeCanvasCloud().then(f => {
        let cloud = this.createEarthCloud(f);
        scene.add(cloud)
        if (this.containerRef.current) {
          this.containerRef.current.appendChild(renderer.domElement);
          let angle = 0;
          let animate = () => {
            requestAnimationFrame(animate);
            controls.target = new Vector3().copy(earth.position)
            angle += 0.01;
            earth.rotation.y += 0.001;
            cloud.rotation.y += 0.002;
            earthSmall.position.set(450 * Math.sin(angle), 0, 450 * Math.cos(angle));
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
  createEarthAnnuls() {
    let segmentCount = 50000;
    let radius = 500;
    let geometry = new Geometry();
    let material = new LineBasicMaterial({ color: 0xffff00 });

    for (var i = 0; i <= segmentCount; i++) {
      var theta = (i / segmentCount) * Math.PI * 2;
      geometry.vertices.push(
        new Vector3(
          Math.cos(theta) * radius,
          Math.sin(theta) * radius,
          0));
    }
    let cube = new LineLoop(geometry, material);
    cube.rotation.x = Math.PI / 2;
    return cube;
  }
  // 创建地球
  createEarth() {
    let geomary = new SphereGeometry(8, 32, 32);
    let material = new MeshPhongMaterial({
      map: new TextureLoader().load('./images/earth1.jpg'),
      bumpMap: new TextureLoader().load('./images/bathymetry.jpg'),
      bumpScale: 1.5,
      shininess: 5,
    })
    let Earth = new Mesh(geomary, material);
    Earth.position.set(0, 0, 500)
    return Earth;
  }
  // 创建月球
  createMoon() {
    let geomary = new SphereGeometry(2, 32, 32);
    let material = new MeshPhongMaterial({
      map: new TextureLoader().load('./images/moon.jpg'),
      bumpMap: new TextureLoader().load('./images/moon-bump.jpg'),
      bumpScale: 0.05,
      shininess: 5,
    })
    let Moon = new Mesh(geomary, material);
    Moon.position.set(0, 0, 450)
    return Moon;
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
    let light = new PointLight(0xffffff, 1);
    light.add(new Mesh(new SphereGeometry(100.2, 36, 36),
      new MeshLambertMaterial({
        color: 0xffff00,
        emissive: 0xdd4422,
        opacity: 0
      })))
    return light;
  }
  public render() {
    return (
      <div id="container" ref={this.containerRef} style={{ width: '100%', height: '100%' }}>
      </div>
    );
  }
}
