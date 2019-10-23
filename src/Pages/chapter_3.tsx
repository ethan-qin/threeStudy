import * as React from 'react';

import { Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, PCFSoftShadowMap, DirectionalLight } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface IChapter1Props {
}

export interface IChapter1State {
}

export default class Chapter3 extends React.Component<IChapter1Props, IChapter1State> {
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
      let renderer = new WebGLRenderer();
      let loader = new GLTFLoader();
      let scene = new Scene();
      renderer.setSize(width, height);
      let camera = new PerspectiveCamera(75, width / height, 0.1, 200);
      camera.position.set(0, 2, -10);
      camera.lookAt(0, 0, 0);
      let controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = true;
      controls.minDistance = 5;
      controls.maxDistance = 30;
      controls.maxPolarAngle = Math.PI;
      controls.autoRotate = true;
      this.containerRef.current.appendChild(renderer.domElement);
      loader.load('./gltf/jack/scene.gltf', (gltf) => {
        scene.add(gltf.scene);
      }, (loading) => {
        console.log((loading.loaded / loading.total * 100) + '% loaded');
      }, (error) => {
        alert("模型加载出错")
      })
      let animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera)
      }
      animate()
    }
  }
  public render() {
    return (
      <div id="container" ref={this.containerRef} style={{ width: '100%', height: '100%' }}>
      </div>
    );
  }
}
