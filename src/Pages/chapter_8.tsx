import * as React from 'react';
import { WebGLRenderer, PerspectiveCamera, AxesHelper, Scene, Object3D, BoxBufferGeometry, BufferGeometry, BoxGeometry, MeshBasicMaterial, Color, MeshLambertMaterial, Mesh, CircleGeometry, SphereGeometry, Vector3, Fog, AmbientLight, DirectionalLight } from 'three';
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
export interface IChapter8Props {
}

export interface IChapter8State {
}

export default class Chapter8 extends React.Component<IChapter8Props, IChapter8State> {
  constructor(props: IChapter8Props) {
    super(props);

    this.state = {
    }
  }
  componentDidMount() {
    if (this.containerRef.current) {
      let width = this.containerRef.current.clientWidth;
      let height = this.containerRef.current.clientWidth;
      let stats = new Stats();
      this.containerRef.current.appendChild(stats.dom);
      let scene = new Scene();
      let renderer = new WebGLRenderer({
        antialias: true
      });
      renderer.shadowMap.enabled = true;
      renderer.setSize(width, height);
      let camera = new PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(10, 1, 3);
      this.containerRef.current.appendChild(renderer.domElement);
      let controls = new OrbitControls(camera, renderer.domElement);
      controls.maxDistance = 1500;
      controls.minDistance = 1;
      controls.autoRotate = false;
      let mesh = new Mesh(new BoxGeometry(1, 1), new MeshBasicMaterial({
        color: new Color('blue'),
        wireframe: true
      }))
      scene.add(mesh)
      let axesHelper = new AxesHelper(100); 
      scene.add(axesHelper);
      scene.background = new Color(0xcceff);
      scene.fog = new Fog(0xcce0ff, 500, 10000);
      scene.add(new AmbientLight(0x666666));
      let light = new DirectionalLight(0xfebff, 1);
      light.position.set(50, 200, 100);
      light.position.multiplyScalar(1.3);
      light.castShadow = true;
      light.shadow.camera.left = -300;
      light.shadow.camera.right = 300;
      light.shadow.camera.top = 300;
      light.shadow.camera.bottom = -300;
      let render = () => {
        stats.begin();
        // controls.update();
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
