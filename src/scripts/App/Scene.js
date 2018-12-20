import Tile from "./Tile";
import Fish from "./animals/Fish";
import Lion from "./animals/Lion";
import Stork from "./animals/Stork";
import StorkWalking from "./animals/StorkWalking";

import SimplexNoise from 'simplex-noise'

export default class Scene {
  constructor(images, camera, index) {
    this.group = new THREE.Group();
    this.camera = camera;
    this.images = images;
    this.index = index.toString();
    this.illustrations = [];
    this.addImages();
    this.simplex = new SimplexNoise();
  }

  addFishes(fishes) {
    this.fishes = [];
    for (let i = 0; i < 20; i++) {
      let fish = new Fish({
        position: new THREE.Vector3(
          Math.random() * 2.5,
          Math.random() * 2.5,
          this.illustrations.length * 0.5 - 2 - Math.floor(i / 3)
        ),
        velocity: new THREE.Vector3(
          (Math.random() * 3 - 1.5) / 10,
          (Math.random() * 3 - 1.5) / 100,
          0
        ),
        width: 0.5,
        height: 0.5,
        vertexCount: 10
      });

      fishes.push(fish);
      this.fishes.push(fish);
      fish.tileEdge.mesh.renderOrder = this.index;
      fish.tileColor.mesh.renderOrder = this.index;
      fish.tileEdge.material.depthTest = false;
      fish.tileColor.material.depthTest = false;
      this.group.add(fish.tileEdge.mesh);
      this.group.add(fish.tileColor.mesh);
    }
  }

  addLion(x, y, z) {
    let lion = new Lion({
      position: new THREE.Vector3(x, y, z),
      width: 2,
      height: 2,
      vertexCount: 10
    });
    lion.tileEdge.mesh.renderOrder = this.index;
    lion.tileColor.mesh.renderOrder = this.index;
    lion.tileEdge.mesh.position.set(x, y, 2);
    lion.tileColor.mesh.position.set(x, y, 2);

    this.group.add(lion.tileEdge.mesh);
    this.group.add(lion.tileColor.mesh);
  }

  addStork(x, y, z) {
    let stork = new Stork({
      position: new THREE.Vector3(x, y, z),
      width: 2,
      height: 2,
      vertexCount: 10
    });
    stork.tileEdge.mesh.renderOrder = this.index;
    stork.tileColor.mesh.renderOrder = this.index;
    stork.tileEdge.mesh.position.set(x, y, 2);
    stork.tileColor.mesh.position.set(x, y, 2);

    this.group.add(stork.tileEdge.mesh);
    this.group.add(stork.tileColor.mesh);
  }

  addStorkWalking(x, y, z) {
    let storkWalking = new StorkWalking({
      position: new THREE.Vector3(x, y, z),
      width: 2,
      height: 2,
      vertexCount: 10
    });
    storkWalking.tileEdge.mesh.renderOrder = this.index;
    storkWalking.tileColor.mesh.renderOrder = this.index;
    storkWalking.tileEdge.mesh.position.set(x, y, 2);
    storkWalking.tileColor.mesh.position.set(x, y, 2);

    this.group.add(storkWalking.tileEdge.mesh);
    this.group.add(storkWalking.tileColor.mesh);
  }
  addImages() {
    for (let i = 0; i < Object.keys(this.images).length; i++) {
      let mesh = [];
      mesh.push(this.images[Object.keys(this.images)[i]]);
      mesh.map((texture, index) => {
        let layer = parseInt(
          Object.keys(this.images)
            [i].match(/(LAYER_\d+(\.\d)*)/g)[0]
            .split("LAYER_")[1]
        );
        layer *= 0.5;

        let partie =
          parseInt(
            Object.keys(this.images)
              [i].match(/(PARTIE_\d+(\.\d)*)/g)[0]
              .split("PARTIE_")[1]
          ) - 1;
        let d = this.getDimensionsFromDistance(this.camera.position.z - layer);
        let height = 4096 / 2 / 1920;
        let textureLoaded = new THREE.TextureLoader().load(texture);
        let illu = new Tile(
          textureLoaded,
          0,
          -partie * d.width * height,
          layer,
          d.width,
          d.width * height,
          1
        );

        illu.mesh.rotation.set(
          0,
          (-180 * Math.PI) / 180,
          (180 * Math.PI) / 180
        );
        illu.mesh.scale.set(1, -1, -1);

        this.illustrations.push({
          mesh: illu.mesh,
          y: layer,
          x: -partie * d.width * height
        });
        illu.mesh.renderOrder = this.index;
        illu.material.depthTest = false;
        this.group.add(illu.mesh);

        return illu;
      });
    }
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

  waves(t) {
    this.illustrations.forEach((wave)=>{
      wave.mesh.position.x = this.simplex.noise2D(wave.y, t/5)/2
      wave.mesh.position.y = wave.x + this.simplex.noise2D(wave.y, t/5)/3
      this.group.scale.set(1.1,1.1,1.1)
    })
  }

  hublot(t) {
    let wave = this.illustrations[0]
      wave.mesh.position.x = this.simplex.noise2D(wave.x, t/5)/2
      wave.mesh.position.y = wave.x + this.simplex.noise2D(wave.y, t/5)/3
  }
}
