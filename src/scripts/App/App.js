import * as dat from "dat.gui";
import browserCheck from "src/utils/browserCheck";

import backgroundTexture from "src/assets/background.jpg";

import Tile from "./Tile";
import Scene from "./Scene";
import LandingPage from "./LandingPage";

import {
  scene1img,
  scene2img,
  scene3img,
  scene4img,
  scene5img,
  scene6img,
  scene7img,
  scene8img
} from "src/utils/sceneImport.js";
import "./rstat.js";

//composer
import "three/examples/js/postprocessing/EffectComposer";
import "three/examples/js/shaders/CopyShader";
import "three/examples/js/shaders/FXAAShader.js";
import "three/examples/js/postprocessing/RenderPass";
import "three/examples/js/postprocessing/ShaderPass";
import "three/examples/js/postprocessing/UnrealBloomPass";
import "three/examples/js/shaders/LuminosityHighPassShader";

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
    this.camera.position.z = 20;

    this.scene = new THREE.Scene();

    this.landingPage = new LandingPage(this);
    this.scene.add(this.landingPage.group);

    //handle scroll and click
    // handleInteraction(this);
    // this.controls = new OrbitControls(this.camera);
    // this.controls.enabled = false;

    //**************** add light to the scene *****************/

    let ambientLight = new THREE.AmbientLight(0x505050);
    this.scene.add(ambientLight);
    // var width = 10;
    // var height = 10;
    // var intensity = 1;
    // var rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  100, 100 );
    // rectLight.position.set( 0, 0, 10 );
    // // rectLight.lookAt( 0, 0, 0 );
    // this.scene.add( rectLight )
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
    this.scene.add(this.directionalLight);
    this.directionalLight.position.set(0, 0, 500);

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

    let ratio = 4096 / 2 / 1920;
    let reduce = 0.5;
    this.animationTiles = [];
    this.scene1 = new Scene(scene1img, this.camera, 1);
    this.scene.add(this.scene1.group);
    this.scene1.group.position.set(0, -d.width * ratio * reduce, 0);

    this.scene2 = new Scene(scene2img, this.camera, 2);
    this.scene.add(this.scene2.group);
    this.scene2.group.position.set(0, -1.7 * d.width * ratio * reduce, 0);

    this.scene3 = new Scene(scene3img, this.camera, 3);
    this.scene.add(this.scene3.group);
    this.scene3.group.position.set(0, -3.5 * d.width * ratio * reduce, 0);

    this.waves = new Scene(scene3img, this.camera, 4);
    this.scene.add(this.waves.group);
    this.waves.group.position.set(0, -4.5 * d.width * ratio * reduce, 0);

    this.scene4 = new Scene(scene4img, this.camera, 5);
    this.scene.add(this.scene4.group);
    this.scene4.group.position.set(0, -4.5 * d.width * ratio * reduce, 0);

    this.scene5 = new Scene(scene5img, this.camera, 8);
    this.scene.add(this.scene5.group);
    this.scene5.group.position.set(0, -7 * d.width * ratio * reduce, 0);

    this.scene6 = new Scene(scene6img, this.camera, 6);
    this.animationTiles.push(this.scene6.addLion(0, 0, 0));
    this.scene.add(this.scene6.group);
    this.scene6.group.position.set(0, -8 * d.width * ratio * reduce, 0);

    this.scene7 = new Scene(scene7img, this.camera, 7);
    this.scene.add(this.scene7.group);
    this.scene7.group.position.set(0, -9.5 * d.width * ratio * reduce, 0);

    this.scene8 = new Scene(scene8img, this.camera, 8);
    this.animationTiles.push(this.scene8.addStork(1, 1, 0));
    this.animationTiles.push(this.scene8.addStorkWalking(-1, 1, 0));
    this.scene.add(this.scene8.group);
    this.scene8.group.position.set(0, -10.5 * d.width * ratio * reduce, 0);

    this.fishes = [];
    this.scene3.addFishes(this.fishes);
    this.scene.add(this.scene3.group);
    // this.scene3.group.position.set(0, -35, 0);

    //**************************** ***************************/

    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    this.addComposer();

    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    this.onWindowResize();
    this.clock = new THREE.Clock();
    this.time = this.clock.startTime;

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  render() {
    var delta = this.clock.getDelta();
    this.fishes.forEach(fish => {
      fish.flock(this.fishes);
      fish.limits();
      fish.update(delta);
    });
    this.animationTiles.forEach(animationTile => {
      animationTile.update();
    });
    this.time += delta;
    // this.renderer.render(this.scene, this.camera);
    this.composer.render();

    // this.camera.position.y -= 0.01
    this.scene5.hublot(this.time);
    this.scene3.waves(this.time);
    this.waves.waves(this.time);
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

  addComposer() {
    this.composer = new THREE.EffectComposer(this.renderer);

    let renderPass = new THREE.RenderPass(this.scene, this.camera);

    let zoomBlurFrag = {
      uniforms: {
        tDiffuse: { type: "t", value: null },
        resolution: {
          value: new THREE.Vector2(
            window.innerWidth * window.devicePixelRatio,
            window.innerHeight * window.devicePixelRatio
          )
        },
        center: {
          value: new THREE.Vector2(
            window.innerWidth / 2,
            window.innerHeight / 2
          )
        },
        strength: {
          value: 0.0
        }
      },

      vertexShader: `
      
          varying vec2 vUv;
      
          void main() {
      
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      
          }
          `,

      fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform vec2 center;
      uniform float strength;
      uniform vec2 resolution;
      varying vec2 vUv;
      
      float random(vec3 scale,float seed){return fract(sin(dot(gl_FragCoord.xyz+seed,scale))*43758.5453+seed);}
      
      void main(){
        vec4 color=vec4(0.0);
        float total=0.0;
        vec2 toCenter=center-vUv*resolution;
        float offset=random(vec3(12.9898,78.233,151.7182),0.0);
        for(float t=0.0;t<=40.0;t++){
          float percent=(t+offset)/40.0;
          float weight=4.0*(percent-percent*percent);
          vec4 sample=texture2D(tDiffuse,vUv+toCenter*percent*strength/resolution);
          sample.rgb*=sample.a;
          color+=sample*weight;
          total+=weight;
        }
        gl_FragColor=color/total;
        gl_FragColor.rgb/=gl_FragColor.a+0.00001;
      }
        `
    };
    this.zoomBlur = new THREE.ShaderPass(zoomBlurFrag);

    this.params = {
      exposure: 1,
      bloomStrength: 1,
      bloomThreshold: 0,
      bloomRadius: 0
    };

    this.bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    this.bloomPass.threshold = this.params.bloomThreshold;
    this.bloomPass.strength = this.params.bloomStrength;
    this.bloomPass.radius = this.params.bloomRadius;

    let antialiasPass = new THREE.ShaderPass(THREE.FXAAShader);

    this.composer.addPass(renderPass);
    this.composer.addPass(this.zoomBlur);
    // this.composer.addPass(bloomPass);
    this.composer.addPass(antialiasPass);
    antialiasPass.renderToScreen = true;
  }
}
