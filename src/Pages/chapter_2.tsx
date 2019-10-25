import * as React from 'react';
import { Scene, WebGLRenderer, PerspectiveCamera, SphereGeometry, MeshPhongMaterial, Mesh, AxesHelper, ImageLoader, ImageUtils, AmbientLight, Color, DirectionalLight, Texture, Side, DoubleSide, Vector3, MeshMatcapMaterial, BackSide, MeshBasicMaterial } from 'three';
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
      let renderer = new WebGLRenderer();
      renderer.setSize(width, height);
      let camera = new PerspectiveCamera(45, width / height, 0.1, 1600);
      camera.position.set(0, 250, 200);
      camera.lookAt(0, 0, 0);
      let controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.maxDistance = 800;
      // let axesHelper = new AxesHelper(900);
      // let ambientLight = new AmbientLight(0x888888);
      // scene.add(ambientLight)
      let directionLight = new DirectionalLight(0xffffff, 1);
      directionLight.position.set(300, 200, -100)
      scene.add(directionLight);
      // scene.add(axesHelper)
      let earthGeomery = new SphereGeometry(80, 320, 320);
      let material = new MeshPhongMaterial();
      material.map = ImageUtils.loadTexture('./images/earthmap1k.jpg')
      material.bumpMap = ImageUtils.loadTexture('./images/earthbump1k.jpg');
      material.bumpScale = 1;
      material.specularMap = ImageUtils.loadTexture('./images/earthspec1k.jpg');
      material.specular = new Color('#666')
      let earthMesh = new Mesh(earthGeomery, material);
      // earthMesh.position.set(0, 1, 0)  
      let cloudGeomary = new SphereGeometry(80.2, 320, 320);

      var geometry1  = new SphereGeometry(800, 32, 32)
      var material1  = new MeshBasicMaterial()
      material1.map   = ImageUtils.loadTexture('./images/galaxy_starfield.png')
      material1.side  = BackSide
      var mesh1  = new Mesh(geometry1, material1)
      scene.add(mesh1)

      this.makeCanvasCloud().then(f => {
        let cloudMaterial = new MeshPhongMaterial({
          map: new Texture(f),
          side: DoubleSide,
          opacity: 0.8,
          transparent: true
        })
        let cloudMesh = new Mesh(cloudGeomary, cloudMaterial);
        // cloudMesh.position.set(0, 1, 0)
        if (cloudMaterial.map) {
          cloudMaterial.map.needsUpdate = true;
        }
        scene.add(cloudMesh)
        if (this.containerRef.current) {
          scene.add(earthMesh);
          this.containerRef.current.appendChild(renderer.domElement);
          let animate = () => {
            earthMesh.rotation.y += 0.001;
            cloudMesh.rotation.y += 0.002;
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
  public render() {
    return (
      <div id="container" ref={this.containerRef} style={{ width: '100%', height: '100%' }}>
      </div>
    );
  }
}
