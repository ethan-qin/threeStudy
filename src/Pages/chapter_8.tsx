import * as React from 'react';
import { PerspectiveCamera, Scene, Color, Fog, AmbientLight, DirectionalLight } from 'three';


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

      // scene
      let scene = new Scene();
      scene.background = new Color(0xcce0ff);
      scene.fog = new Fog(0xcce0ff, 500, 10000);

      // camera
      let camera = new PerspectiveCamera(30, width / height, 1, 10000);
      camera.position.set(1000, 50, 1500);

      // light
      scene.add(new AmbientLight(0x666666));
      let light = new DirectionalLight(0xdfebff, 1);
      light.position.set(50, 200, 100);
      light.position.multiplyScalar(1.3);
      light.castShadow = true;
      let d = 300;
      light.shadow.camera.left = -d;
      light.shadow.camera.right = d;
      light.shadow.camera.top = d;
      light.shadow.camera.bottom = -d;
      light.shadow.camera.far = 1000;
      scene.add(light);

      // cloth
      // let loader = new TextureLoader();
      // let clothTexture = loader.load('./images/circuit_pattern.png');
      // clothTexture.anisotropy = 16;
      // let clothMaterial = new MeshLambertMaterial({
      //   map: clothTexture,
      //   side: DoubleSide,
      //   alphaTest: 0.5
      // })
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
