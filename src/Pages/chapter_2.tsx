import * as React from 'react';
import { Scene, WebGLRenderer, PerspectiveCamera, SphereGeometry, MeshPhongMaterial, Mesh, AxesHelper, ImageLoader, ImageUtils, AmbientLight, Color, DirectionalLight, Texture } from 'three';
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
      let camera = new PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 10, 2);
      camera.lookAt(0, 0, 0);
      let controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      let axesHelper = new AxesHelper(100);
      var ambientLight = new AmbientLight(0x404040);
      scene.add(ambientLight)
      var directionLight = new DirectionalLight(0x404040);
      scene.add(directionLight);
      scene.add(axesHelper)
      let earthGeomery = new SphereGeometry(0.5, 32, 32);
      let material = new MeshPhongMaterial();
      material.map = ImageUtils.loadTexture('./images/earthmap1k.jpg')
      material.bumpMap = ImageUtils.loadTexture('./images/earthbump1k.jpg');
      material.bumpScale = 0.07;
      material.specularMap = ImageUtils.loadTexture('./image/earthspec1k.jpg');
      material.specular = new Color('grey')
      let earthMesh = new Mesh(earthGeomery, material);
      let cloudGeomary = new SphereGeometry(0.51, 32, 32);
      let img = new Image()
      img.src = './image/earthspec1k.jpg';
      let cloudMaterial = new MeshPhongMaterial({
        map: new Texture()
      })
      scene.add(earthMesh);
      this.containerRef.current.appendChild(renderer.domElement);
      let animate = () => {
        // earthMesh.rotation.x += 0.1;
        // earthMesh.rotation.y += 0.01;
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }
      animate()
    }
  }
  makeCanvasCloud() {
    let canvasResults = document.createElement('canvas');
    canvasResults.width = 1024;
    canvasResults.height = 512;
    let contextResult = canvasResults.getContext('2d');
    let imageTrans = new Image();
    imageTrans.addEventListener('load', () => {
      let canvasTrans = document.createElement('canvas');
      canvasTrans.width = imageTrans.width;
      canvasTrans.height = imageTrans.height;
      let contextTrans = canvasTrans.getContext('2d');
      if (contextTrans) {
        contextTrans.drawImage(imageTrans, 0, 0);
        let dataTrans = contextTrans.getImageData(0, 0, imageTrans.width, imageTrans.height);

      }

    }, false)
  }
  public render() {
    return (
      <div id="container" ref={this.containerRef} style={{ width: '100%', height: '100%' }}>
      </div>
    );
  }
}
