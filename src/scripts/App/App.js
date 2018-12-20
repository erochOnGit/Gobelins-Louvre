// example import asset
// import imgPath from './assets/img.jpg';

// TODO : add Dat.GUI
// TODO : add Stats

var OrbitControls = require("three-orbit-controls")(THREE);

import * as dat from "dat.gui";
import handleInteraction from "src/utils/handleInteraction";
import browserCheck from "src/utils/browserCheck";

import backgroundTexture from "src/assets/background.jpg";

import Tile from "./Tile";
import Scene from "./Scene";

import {
  scene1img,
  scene2img,
  scene3img,
  scene4img
} from "src/utils/sceneImport.js";
import "./rstat.js";
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

    // var gui = new dat.GUI();

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
    let d = this.getDimensionsFromDistance(this.camera.position.z);
    let backgroundTile = new Tile(
      textureLoaded,
      0,
      0,
      0 / 100,
      d.width,
      d.height
    );
    this.scene.add(backgroundTile.mesh);
    backgroundTile.mesh.position.set(0, -backgroundTile.height / 2, 0);

    for (let i = 0; i < 10; i++) {
      let background = backgroundTile.mesh.clone();
      this.scene.add(background);
      background.position.set(0, -backgroundTile.height - i * d.height, 0);
    }

    // this.scene1 = new Scene({
    //   images: scene1img,
    //   camera: this.camera,
    //   index: 1
    // }); // images, camera,
    // this.scene.add(this.scene1.group);
    // this.scene1.group.position.set(0, -5, 0);

    this.scene2 = new Scene({
      images: scene2img,
      camera: this.camera,
      index: 2
    });
    this.scene2.addLion(0, 0, 0);
    this.scene.add(this.scene2.group);
    this.scene2.group.position.set(0, -15, 0);

    this.scene3 = new Scene({
      images: scene3img,

      camera: this.camera,
      index: 3
    });
    this.fishes = [];
    this.scene3.addFishes(this.fishes);
    this.scene.add(this.scene3.group);
    this.scene3.group.position.set(0, -35, 0);

    // this.scene4 = new Scene({
    //   images: scene4img,
    //   camera: this.camera,
    //   index: 4
    // });
    // this.scene.add(this.scene4.group);
    // this.scene4.group.position.set(0, -45, 0);

    //**************************** ***************************/

    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    this.onWindowResize();
    this.clock = new THREE.Clock();
    this.time = this.clock.startTime;
    console.log(this.clock);

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  render() {
    var delta = this.clock.getDelta();
    this.fishes.forEach(fish => {
      fish.flock(this.fishes);
      fish.limits();
      fish.update(delta);
    });
    this.time += delta;
    // this.scene4.group.rotation.z = Math.sin(this.time);
    this.renderer.render(this.scene, this.camera);

    // this.camera.position.y -= 0.01
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  getDimensionsFromDistance(dist) {
    let vFOV = THREE.Math.degToRad(this.camera.fov);
    let height = 2 * Math.tan(vFOV / 2) * dist;
    let width = height * this.camera.aspect;
    return {
      height: height,
      width: width
    };
  }
}
