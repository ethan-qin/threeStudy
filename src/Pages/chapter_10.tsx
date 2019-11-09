import * as React from 'react';
import { PerspectiveCamera, Scene, FogExp2, BufferGeometry, TextureLoader, Float32BufferAttribute, PointsMaterial, AddEquation, AdditiveBlending, Texture, PointLight, Points, WebGLRenderer, AxesHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader';
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper';
let Ammo = require('ammo.js')
export interface IChapter10Props {
}

export interface IChapter10State {
}

export default class Chapter10 extends React.Component<IChapter10Props, IChapter10State> {
  constructor(props: IChapter10Props) {
    super(props);

    this.state = {
    }
  }
  componentDidMount() {
    (window as any).Ammo = Ammo;
    if (this.containerRef.current) {
      let width = this.containerRef.current.clientWidth;
      let height = this.containerRef.current.clientHeight;
      let camera = new PerspectiveCamera(45, width / height, 1, 2000);
      camera.position.z = 1000;
      let scene = new Scene();
      scene.fog = new FogExp2(0x000000, 0.0008);
      let geometry = new BufferGeometry();
      let vertices = [];
      let textureLoader = new TextureLoader();
      let sprites1 = textureLoader.load('./images/snowflake1.png');
      let sprites2 = textureLoader.load('./images/snowflake2.png');
      let sprites3 = textureLoader.load('./images/snowflake3.png');
      let sprites4 = textureLoader.load('./images/snowflake4.png');
      let sprites5 = textureLoader.load('./images/snowflake5.png');
      for (let index = 0; index < 20000; index++) {
        let x = Math.random() * 2000 - 1000;
        let y = Math.random() * 2000 - 1000;
        let z = Math.random() * 2000 - 1000;
        vertices.push(x, y, z);
      }
      geometry.addAttribute('position', new Float32BufferAttribute(vertices, 3))
      let parameters: [Array<number>, Texture, number][] = [
        [[1.0, 0.2, 0.5], sprites2, 20],
        [[0.95, 0.1, 0.5], sprites3, 15],
        [[0.90, 0.05, 0.5], sprites1, 10],
        [[0.85, 0, 0.5], sprites5, 8],
        [[0.8, 0, 0.5], sprites4, 5],
      ]
      let materials: any[] = [];
      for (let index = 0; index < parameters.length; index++) {
        const color = parameters[index][0];
        const sprite = parameters[index][1];
        const size = parameters[index][2];
        materials[index] = new PointsMaterial({ size: size, map: sprite, blending: AdditiveBlending, depthTest: false, transparent: true });
        materials[index].color.setHSL(color[0], color[1], color[2]);
        let particles = new Points(geometry, materials[index]);
        particles.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
        scene.add(particles);
      }
      let renderer = new WebGLRenderer({
        antialias: true
      })
      renderer.setSize(width, height);
      let controls = new OrbitControls(camera, renderer.domElement);
      controls.maxDistance = 2000;
      controls.autoRotate = true;
      let axesHelper = new AxesHelper(2000)
      scene.add(axesHelper)
      this.containerRef.current.appendChild(renderer.domElement);
      let loader = new MMDLoader()
      let helper = new MMDAnimationHelper({
        afterglow: 2.0
      })
      loader.loadWithAnimation('./mmd/miku_v2.pmd', './mmd/wavefile_v2.vmd', (mmd) => {
        let mesh = mmd.mesh;
        mesh.position.set(0, 0, 0);
        scene.add(mesh);
        helper.add(mesh, {
          animation: mmd.animation,
          physics: true
        })
        let ikHelper = (helper as any).objects.get(mesh).ikSlover.createHelper();
        ikHelper.visible = false;
        let physicsHelper = (helper as any).objects.get(mesh).physics.createHelper();
        physicsHelper.visible = false;
        scene.add(ikHelper)
        scene.add(physicsHelper)

      })
      let render = () => {
        let time = Date.now() * 0.00005;
        controls.update();

        for (let i = 0; i < scene.children.length; i++) {
          let object = scene.children[i];

          if (object instanceof Points) {

            object.rotation.y = time * (i < 4 ? i + 1 : - (i + 1));

          }

        }

        for (let i = 0; i < materials.length; i++) {

          let color = parameters[i][0];

          let h = (360 * (color[0] + time) % 360) / 360;
          materials[i].color.setHSL(h, color[1], color[2]);

        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }
      render()
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
