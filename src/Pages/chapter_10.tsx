import * as React from 'react';
import { PerspectiveCamera, Scene, FogExp2, BufferGeometry, TextureLoader, Float32BufferAttribute, PointsMaterial, AddEquation, AdditiveBlending, Texture, PointLight, Points, WebGLRenderer, AxesHelper, Clock, Color, DirectionalLight, PolarGridHelper, SkinnedMesh, Material, MeshPhongMaterial, Mesh, AmbientLight, PlaneBufferGeometry, Camera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader';
import { MMDAnimationHelper } from 'three/examples/jsm/animation/MMDAnimationHelper';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { message } from 'antd';
import { GUI } from "dat.gui";
import worker from './worker.js';
import WebWorker from './workerSetup';
import Stats from 'stats.js';
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
  async componentDidMount() {
    let workerer = new WebWorker(worker);
    // workerer.on
    (window as any).Ammo = Ammo;
    if (this.containerRef.current) {
      let width = this.containerRef.current.clientWidth;
      let height = this.containerRef.current.clientHeight;
      let camera = this.makeCamera(width, height);
      let scene = this.makeScene()
      const { points, materials } = this.makePoints();
      let renderer = this.makeRenderer(width, height);
      const controls = this.makeControls(camera, renderer);
      const { directionalLight, ambientLight } = this.makeLight()
      const { gridHelper, plane } = this.makeFloor()
      let effect = new OutlineEffect(renderer, {})
      this.containerRef.current.appendChild(renderer.domElement);
      points.map(item => {
        scene.add(item)
      })
      scene.add(gridHelper);
      scene.add(plane);
      scene.add(ambientLight)
      scene.add(directionalLight);
      let clock = new Clock();
      let modelResult = await this.loadModel();
      if (modelResult) {
        const { helper, mesh } = modelResult;
        scene.add(mesh);
        let stats = new Stats();
        this.containerRef.current.appendChild(stats.dom)
        let render = () => {
          stats.begin();
          let time = Date.now() * 0.00005;
          controls.update();
          for (let i = 0; i < scene.children.length; i++) {
            let object = scene.children[i];
            if (object instanceof Points) {
              object.rotation.y = time * (i < 4 ? i + 2 : - (i + 2));
              object.rotation.x = time * (i < 4 ? i + 2 : - (i + 2));
              object.rotation.z = time * (i < 4 ? i + 2 : - (i + 2));
            }

          }
          helper.update(clock.getDelta())
          effect.render(scene, camera);
          stats.end();
          renderer.setAnimationLoop(render)
        }
        render()
      }
    }
  }

  loadModel(): Promise<{ helper: MMDAnimationHelper, mesh: Mesh, ikHelper: any, physicsHelper: any }> {
    let loader = new MMDLoader()
    let helper = new MMDAnimationHelper({
      afterglow: 2.0
    });
    return new Promise((resolve, reject) => {
      loader.loadWithAnimation('./mmd/miku_v2.pmd', './mmd/wavefile_v2.vmd', (mmd) => {
        const dancer = mmd.mesh;
        dancer.traverse(child => {
          child.castShadow = true;
          child.receiveShadow = false;
        })
        dancer.position.set(0, 0, 0);
        helper.add(dancer, {
          animation: mmd.animation,
          physics: true
        })
        let ikHelper = (helper as any).objects.get(dancer).ikSolver.createHelper();
        ikHelper.visible = false;
        let physicsHelper = (helper as any).objects.get(dancer).physics.createHelper();
        physicsHelper.visible = false;
        let array: Material[] = [];
        for (let index = 0, il = (dancer.material as Material[]).length; index < il; index++) {
          let meshPoneMaterial = new MeshPhongMaterial();
          meshPoneMaterial.copy((dancer.material as Material[])[index]);
          meshPoneMaterial.needsUpdate = true;
          array.push(meshPoneMaterial)
        }
        dancer.material = array;

        resolve({
          helper: helper,
          mesh: dancer,
          ikHelper: ikHelper,
          physicsHelper: physicsHelper
        })
      });
    })
  }

  makePoints() {
    let geometry = new BufferGeometry();
    let vertices = [];
    let points: Points[] = [];
    let textureLoader = new TextureLoader();
    let sprites1 = textureLoader.load('./images/snowflake1.png');
    let sprites2 = textureLoader.load('./images/snowflake2.png');
    let sprites3 = textureLoader.load('./images/snowflake3.png');
    let sprites4 = textureLoader.load('./images/snowflake4.png');
    let sprites5 = textureLoader.load('./images/snowflake5.png');
    for (let index = 0; index < 10000; index++) {
      let x = Math.random() * 2000 - 1000;
      let y = Math.random() * 2000 - 1000;
      let z = Math.random() * 2000 - 1000;
      vertices.push(x, y, z);
    }
    geometry.addAttribute('position', new Float32BufferAttribute(vertices, 3, true))
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
      // particles.matrixAutoUpdate = false;
      particles.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      points.push(particles)
    }
    return {
      materials: materials,
      points: points
    }
  }

  makeControls(camera: Camera, renderer: WebGLRenderer) {
    let controls = new OrbitControls(camera, renderer.domElement);
    controls.maxDistance = 500;
    controls.autoRotate = false;
    controls.maxPolarAngle = Math.PI / 2.01;
    return controls;
  }

  makeFloor() {
    let gridHelper = new PolarGridHelper(50, 20, 10, 10, new Color('black'), new Color('black'));
    (gridHelper.material as Material).opacity = 0.7;
    (gridHelper.material as Material).transparent = true;
    gridHelper.position.y = 0;
    let planeGeometry = new PlaneBufferGeometry(100, 100, 32);
    let planeMateria = new MeshPhongMaterial();
    let plane = new Mesh(planeGeometry, planeMateria);
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI * 0.5;
    return {
      gridHelper: gridHelper,
      plane: plane
    }
  }

  makeLight() {
    let directionalLight = new DirectionalLight(0x666666);
    directionalLight.position.set(0, 20, -20)
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.top = 40;
    directionalLight.shadow.camera.bottom = -40;
    directionalLight.shadow.camera.left = -40;
    directionalLight.shadow.camera.right = 40;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    let ambientLight = new AmbientLight(0x666666);
    return {
      directionalLight: directionalLight,
      ambientLight: ambientLight
    }
  }

  makeScene() {
    let scene = new Scene();
    scene.fog = new FogExp2(0x000000, 0.0008);
    return scene;
  }

  makeCamera(width: number, height: number) {
    let camera = new PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(0, 10, 70);
    camera.lookAt(0, 0, 0);
    return camera;
  }

  makeRenderer(width: number, height: number) {
    let renderer = new WebGLRenderer({
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.shadowMapEnabled = true;
    return renderer;
  }
  private containerRef = React.createRef<HTMLDivElement>();
  public render() {
    return (
      <div ref={this.containerRef} style={{ width: '100%', height: '100%' }}>

      </div>
    );
  }
}
