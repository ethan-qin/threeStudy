import * as React from 'react';
import { Scene, WebGLRenderer, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh, Vector3, ArrowHelper, AxesHelper, DirectionalLight, LineBasicMaterial, SphereGeometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface IChapter1Props {
}

export interface IChapter1State {
}

export default class Chapter1 extends React.Component<IChapter1Props, IChapter1State> {
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
      let camera = new PerspectiveCamera(70, width / height, 0.1, 1000);
      camera.position.set(8, 15, 8);
      camera.lookAt(0, 10, 0);
      let cubeGeometry = new BoxGeometry(2, 2, 2);
      let material = new MeshBasicMaterial({ color: 0xff0000, wireframe: true });
      let cube = new Mesh(cubeGeometry, material);
      cube.position.set(0, 10, 0);
      scene.add(cube);

      let controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      let sphereGeometry = new SphereGeometry(2, 20, 20);
      let sphere = new Mesh(sphereGeometry, material);
      sphere.position.set(0, 5, 0);
      scene.add(sphere)
      var axesHelper = new AxesHelper(100);
      scene.add(axesHelper);
      this.containerRef.current.appendChild(renderer.domElement);
      let render = () => {
        requestAnimationFrame(render)
        controls.update()
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
      render()
    }
  }
  public render() {
    return (
      <div id="container" ref={this.containerRef} style={{ width: '100%', height: '100%' }}>
      </div>
    );
  }
}
