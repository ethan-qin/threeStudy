import * as React from 'react';
import { WebGLRenderer, PerspectiveCamera, AxesHelper, Scene, Object3D, BufferGeometry, BoxGeometry, MeshBasicMaterial, Color, Mesh, SphereGeometry, } from 'three';
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
export interface IChapter7Props {
}

export interface IChapter7State {
}

export default class Chapter7 extends React.Component<IChapter7Props, IChapter7State> {
  constructor(props: IChapter7Props) {
    super(props);

    this.state = {
    }
  }
  componentDidMount() {
    if (this.containerRef.current) {
      let width = this.containerRef.current.clientWidth;
      let height = this.containerRef.current.clientWidth;
      let scene = new Scene();
      let renderer = new WebGLRenderer({
        antialias: true
      });
      renderer.setSize(width, height);
      let camera = new PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(10, 1, 3);
      this.containerRef.current.appendChild(renderer.domElement);
      let controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = false;
      let axesHelper = new AxesHelper(100);
      let axesHelper2 = new AxesHelper(100);
      let stats = new Stats();
      let object = new Object3D();
      object.position.set(0, 3, 0)
      let geometry = new BufferGeometry().fromGeometry(new BoxGeometry(1, 1))
      let material = new MeshBasicMaterial({
        color: new Color('red'),
        wireframe: true
      });
      let mesh = new Mesh(geometry, material);
      let circleGeomery = new BufferGeometry().fromGeometry(new SphereGeometry(1, 21, 21));
      let circleMesh = new Mesh(circleGeomery, material)
      circleMesh.position.set(2, 0, 0);
      scene.add(axesHelper);
      object.add(mesh);
      object.add(circleMesh)
      object.add(axesHelper2);
      scene.add(object);
      this.containerRef.current.appendChild(stats.dom);
      let angle = 0.01;
      let render = () => {
        object.position.set(10 * Math.sin(angle), 3 * Math.cos(angle), 10 * Math.cos(angle));
        // controls.target = new Vector3().copy(object.position);
        camera.position.set(object.position.x + 5, object.position.y + 5, object.position.z + 30);
        angle += 0.01;
        mesh.rotation.x += 0.1;
        mesh.rotation.y += 0.1;
        circleMesh.rotation.x += 0.03;
        circleMesh.rotation.y += 0.03;
        controls.update();
        renderer.render(scene, camera);
        stats.end();
        requestAnimationFrame(render);
      }
      render();
    }
  }
  private containerRef = React.createRef<HTMLDivElement>();
  public render() {
    return (
      <div ref={this.containerRef} style={{ width: '100%', height: '100%' }}>

      </div>
    );
  }
}
