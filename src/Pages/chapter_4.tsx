import * as React from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PerspectiveCamera, WebGLRenderer, AxesHelper, Scene, AmbientLight, Vector3, SkeletonHelper, DirectionalLight, Mesh, PlaneBufferGeometry, MeshPhongMaterial, AnimationMixer, Clock, GridHelper } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
export interface IChapter4Props {
}

export interface IChapter4State {
}

export default class Chapter4 extends React.Component<IChapter4Props, IChapter4State> {
  constructor(props: IChapter4Props) {
    super(props);

    this.state = {
    }
  }
  private containerRef = React.createRef<HTMLDivElement>();
  componentDidMount() {
    if (this.containerRef.current) {
      let clock = new Clock();
      let mixer: any = null;
      let width = this.containerRef.current.clientWidth;
      let height = this.containerRef.current.clientHeight;
      let camera = new PerspectiveCamera(45, width / height, 0.1, 10000);
      camera.position.set(0, 500, 500);
      let scene = new Scene();
      let renderer = new WebGLRenderer({
        antialias: true
      });
      renderer.shadowMapEnabled = true;
      renderer.setSize(width, height);
      let axerHelp = new AxesHelper(1000);
      scene.add(axerHelp)
      this.containerRef.current.appendChild(renderer.domElement);
      let loader = new FBXLoader();
      let light = new DirectionalLight(0xffffff);
      light.position.set(0, 100, 100);
      light.castShadow = true;
      light.shadow.camera.top = 180;
      light.shadow.camera.bottom = -100;
      light.shadow.camera.left = -120;
      light.shadow.camera.right = 120;
      scene.add(light)
      let floor = new Mesh(new PlaneBufferGeometry(1000, 1000), new MeshPhongMaterial({
        color: 0xffffff,
        depthWrite: false
      }));
      floor.receiveShadow = true;
      floor.rotation.x = -Math.PI / 2;
      scene.add(floor)
      let grid = new GridHelper(2000, 20, 0x000000, 0x000000);
      (grid.material as any).opacity = 0.2;
      (grid.material as any).transparent = true;
      scene.add(grid);

      loader.load('./fbx/Dancing.fbx', (mesh) => {
        mesh.traverse((child) => {
          child.castShadow = true;
          child.receiveShadow = true;
        })
        let meshHelper = new SkeletonHelper(mesh);
        mixer = (mesh as any).mixer = new AnimationMixer(mesh);
        let action = mixer.clipAction((mesh as any).animations[0])
        action.play()
        scene.add(meshHelper)
        scene.add(mesh)
      })
      let render = () => {
        window.requestAnimationFrame(render);
        let time = clock.getDelta();
        if (mixer !== null) {
          mixer.update(time);
        }
        controls.update()
        renderer.render(scene, camera)
      }
      let controls = new OrbitControls(camera, renderer.domElement)
      render()
    }
  }
  public render() {
    return (
      <div ref={this.containerRef} style={{ width: '100%', height: '100%' }}>
      </div>
    );
  }
}
