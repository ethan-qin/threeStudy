import * as React from 'react';
import { WebGLRenderer, PerspectiveCamera, Scene, AxesHelper, BufferGeometry, BufferAttribute, MeshBasicMaterial, Mesh, SphereGeometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';
export interface IChapter6Props {
}

export interface IChapter6State {
}

export default class Chapter6 extends React.Component<IChapter6Props, IChapter6State> {
  constructor(props: IChapter6Props) {
    super(props);

    this.state = {
    }
  }
  componentDidMount() {
    if (this.containerRef.current) {
      let width = this.containerRef.current.clientWidth;
      let height = this.containerRef.current.clientHeight;
      let renderer = new WebGLRenderer({
        antialias: true
      });
      let scene = new Scene();
      let axersHelper = new AxesHelper(1000);
      let stats = new Stats()
      this.containerRef.current.appendChild(stats.dom)
      renderer.setSize(width, height);
      let camera = new PerspectiveCamera(45, width / height, 0.1, 1000);
      let controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = false;
      camera.position.set(0, 10, 10);
      scene.add(axersHelper)
      scene.add(this.createBufferGeometry())
      this.containerRef.current.appendChild(renderer.domElement);
      let render = () => {
        requestAnimationFrame(render);
        stats.begin();
        controls.update();
        renderer.render(scene, camera)
        stats.end();
      }
      render()
    }
  }
  createBufferGeometry() {
    let geometry = new BufferGeometry().fromGeometry(new SphereGeometry(5, 64, 64));
    let material = new MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    });
    let mesh = new Mesh(geometry, material);
    return mesh;

  }
  private containerRef = React.createRef<HTMLDivElement>()
  public render() {
    return (
      <div ref={this.containerRef} style={{ width: '100%', height: '100%' }}>
      </div>
    );
  }
}
