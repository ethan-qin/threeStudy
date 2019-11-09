import * as React from 'react';
import { PerspectiveCamera, ArrayCamera, Scene, AmbientLight, DirectionalLight, PlaneBufferGeometry, MeshPhongMaterial, Mesh, WebGLRenderer, CylinderBufferGeometry, MeshBasicMaterial, Vector4 } from 'three';

export interface IChapter9Props {
}

export interface IChapter9State {
}

export default class Chapter9 extends React.Component<IChapter9Props, IChapter9State> {
  constructor(props: IChapter9Props) {
    super(props);

    this.state = {
    }
  }
  componentDidMount() {
    if (this.containerRef.current) {
      let ASPECT_RATIO = this.containerRef.current.clientWidth / this.containerRef.current.clientHeight;
      let AMOUNT = 6;
      let width = (this.containerRef.current.clientWidth / AMOUNT) * window.devicePixelRatio
      let height = (this.containerRef.current.clientHeight / AMOUNT) * window.devicePixelRatio;
      console.log(this.containerRef.current.clientWidth);

      let cameras: PerspectiveCamera[] = [];
      for (let y = 0; y < AMOUNT; y++) {
        for (let x = 0; x < AMOUNT; x++) {
          let subcamera = new PerspectiveCamera(40, ASPECT_RATIO, 0.1, 10);
          (subcamera as any).viewport = new Vector4(Math.floor(x * width), Math.floor(y * height), Math.ceil(width), Math.ceil(height))
          subcamera.position.set((x / AMOUNT) - 0.5, 0.5 - (y / AMOUNT), 1.5);
          subcamera.position.multiplyScalar(2);
          subcamera.lookAt(0, 0, 0);
          subcamera.updateMatrixWorld();
          cameras.push(subcamera)
        }

      }
      let camera = new ArrayCamera(cameras);
      camera.position.z = 3;
      let scene = new Scene();
      scene.add(new AmbientLight(0x222244));
      let light = new DirectionalLight();
      light.position.set(0.5, 0.5, 1);
      light.castShadow = true;
      light.shadow.camera.zoom = 4;
      scene.add(light);
      let backgroundGeometry = new PlaneBufferGeometry(100, 100);
      let backgroundMaterial = new MeshPhongMaterial({
        color: 0x000066
      });
      let background = new Mesh(backgroundGeometry, backgroundMaterial);
      background.receiveShadow = true;
      background.position.set(0, 0, -1);
      scene.add(background);
      let geometry = new CylinderBufferGeometry(0.5, 0.5, 1, 32);
      let material = new MeshBasicMaterial({ color: 0xff0000, wireframe: false });
      let mesh = new Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      let renderer = new WebGLRenderer({
        antialias: true
      });
      renderer.setSize(this.containerRef.current.clientWidth, this.containerRef.current.clientHeight);
      renderer.shadowMap.enabled = true;
      this.containerRef.current.appendChild(renderer.domElement);
      let render = () => {
        requestAnimationFrame(render);
        mesh.rotation.x += 0.005;
        mesh.rotation.z += 0.01;
        renderer.render(scene, camera);
      }
      render()
    }
  }
  private containerRef = React.createRef<HTMLDivElement>();
  public render() {
    return (
      <div ref={this.containerRef} style={{ width: '100%', height: '100%' }}></div>
    );
  }
}
