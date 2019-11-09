import * as React from 'react';
import {  WebGLRenderer, PerspectiveCamera, AxesHelper, Scene, AmbientLight, LineBasicMaterial, Geometry, Vector3, LineLoop } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface IChapter5Props {
}

export interface IChapter5State {
}

export default class Chapter5 extends React.Component<IChapter5Props, IChapter5State> {
  constructor(props: IChapter5Props) {
    super(props);

    this.state = {
    }
  }
  componentDidMount() {
    if (this.containerRef.current) {
      let width = this.containerRef.current.clientWidth;
      let height = this.containerRef.current.clientHeight;
      let scene = new Scene();
      let renderer = new WebGLRenderer({
        antialias: true
      })
      renderer.setSize(width, height);
      let camera = new PerspectiveCamera(45, width / height, 0.1, 10000);
      camera.position.set(0, 20, 30);
      camera.lookAt(0, 0, 0)
      let ambientLight = new AmbientLight(0x404040);
      scene.add(ambientLight);
      let controls = new OrbitControls(camera, renderer.domElement);
      let axerHelper = new AxesHelper(10000);
      scene.add(axerHelper);
      this.containerRef.current.appendChild(renderer.domElement);
      // let geometry = new CircleGeometry(10, 64);
      // let material = new LineBasicMaterial({ color: 0xff0000 });
      // let mesh = new Mesh(geometry, material);
      let segmentCount = 360;
      let radius = 10;
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
      scene.add(cube);
      let render = () => {
        requestAnimationFrame(render);
        controls.update();
        renderer.render(scene, camera)
      }
      render()
    }
  }
  private containerRef = React.createRef<HTMLDivElement>()
  public render() {
    return (
      <div ref={this.containerRef} style={{ width: '100%', height: '100%' }}>

      </div>
    );
  }
}
