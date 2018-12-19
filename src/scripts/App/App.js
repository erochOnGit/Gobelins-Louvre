// example import asset
// import imgPath from './assets/img.jpg';

// TODO : add Dat.GUI
// TODO : add Stats

var OrbitControls = require("three-orbit-controls")(THREE);

import * as dat from "dat.gui";
import handleInteraction from "src/utils/handleInteraction";
import browserCheck from "src/utils/browserCheck";

import backgroundTexture from "src/assets/background.jpg";

import Scene from "./Scene";
import Tile from "./Tile";
import Plain from "./Plain";
import {scene1img} from "src/utils/sceneImport.js";
import "./rstat.js"
export default class App {
  constructor() {
    this.container = document.createElement("div");
    this.container.id = "main";
    document.body.appendChild(this.container);
    document.body.classList.add(browserCheck());

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 10;

    var size = 10;
    var divisions = 10;

    var gui = new dat.GUI();

    this.scene = new THREE.Scene();
    
   
    //handle scroll and click
    handleInteraction(this);
    // this.controls = new OrbitControls(this.camera);

    // var gridHelper = new THREE.GridHelper(size, divisions);
    // this.scene.add(gridHelper);

    //**************** add light to the scene *****************/

    let ambientLight = new THREE.AmbientLight(0x505050);
    this.scene.add(ambientLight);
    var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    this.scene.add(directionalLight);
    directionalLight.position.set(0, -10, 4);

    //***************** add obj to the scene ******************/

    let textureLoaded = new THREE.TextureLoader().load(backgroundTexture);
    let d = this.getDimensionsFromDistance(this.camera.position.z)
    let backgroundTile = new Plain(textureLoaded, 0, 0, 0 / 100, d.width, d.height);
    this.scene.add(backgroundTile.mesh);
    backgroundTile.mesh.position.set(0, -backgroundTile.height / 2, 0);

    // for(let i = 0; i<10;  i++) {
    //   let background = backgroundTile.mesh.clone();
    //   this.scene.add(background)
    //   background.position.set(0,-backgroundTile.height-i*2*d.height,0)
    // }

    this.scene1 = new Scene(scene1img,this.camera,1)
    this.scene.add(this.scene1.group)
    this.scene1.group.position.set(0,-5,0)
    
    // this.scene2 = new Scene(scene2img,this.camera,2)
    // this.scene.add(this.scene2.group)
    // this.scene2.group.position.set(0,-22,0)

    // this.scene3 = new Scene(scene3img,this.camera,3)
    // this.scene.add(this.scene3.group)
    // this.scene3.group.position.set(0,-56,0)

    // this.scene4 = new Scene(scene4img,this.camera,4)
    // this.scene.add(this.scene4.group)
    // this.scene4.group.position.set(0,-73,0)

    //**************************** ***************************/

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    this.onWindowResize();

    this.glS = new glStats(); // init at any point      
    this.tS = new threeStats( this.renderer ); // init after WebGLRenderer is created

this.rS = new rStats( {
    values: {
        frame: { caption: 'Total frame time (ms)', over: 16 },
        fps: { caption: 'Framerate (FPS)', below: 30 },
        calls: { caption: 'Calls (three.js)', over: 3000 },
        raf: { caption: 'Time since last rAF (ms)' },
        rstats: { caption: 'rStats update (ms)' }
    },
    groups: [
        { caption: 'Framerate', values: [ 'fps', 'raf' ] },
        { caption: 'Frame Budget', values: [ 'frame', 'texture', 'setup', 'render' ] }
    ],
    fractions: [
        { base: 'frame', steps: [ 'action1', 'render' ] }
    ],
    plugins: [
      this.tS,
      this.glS
    ]
} );

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  render() {

    this.rS( 'frame' ).start();
    this.glS.start();

    this.rS( 'frame' ).start();
    this.rS( 'rAF' ).tick();
    this.rS( 'FPS' ).frame();    
    /* Do rendery stuff */
    
    this.rS( 'render' ).start();
    /* Perform render */
    this.renderer.render(this.scene, this.camera);

    this.rS( 'render' ).end();
    
    this.rS( 'frame' ).end();
    this.rS().update();


  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  getDimensionsFromDistance(dist) {
    let vFOV = THREE.Math.degToRad( this.camera.fov )
    let height = 2 * Math.tan( vFOV / 2 ) * dist
    let width = height * this.camera.aspect
    return {
      height : height,
      width : width
    }
  }
}
