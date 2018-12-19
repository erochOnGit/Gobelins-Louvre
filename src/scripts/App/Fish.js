import AnimatedTile from "./AnimatedTile";
import fishColor from "src/assets/animations/fish/sprite-poisson-couleurs.png";
import fishEdge from "src/assets/animations/fish/sprite-poisson-trait.png";
import TextureAnimator from "src/utils/TextureAnimator";
export default class Fish {
  constructor({ position, velocity, width, height, vertexCount }) {
    this.width = width;
    this.height = height;
    this.vertexCount = vertexCount;

    this.position = position || new THREE.Vector3(0, 1, 0);
    this.velocity = velocity || new THREE.Vector3(0.0, 0.001, 0.0);
    this.acceleration = new THREE.Vector3();
    this.angle = 0;
    this.limit = this.position.y;
    this.perception = 0.25;

    let textureLoader = new THREE.TextureLoader();
    this.edge = textureLoader.load(fishColor);
    this.color = textureLoader.load(fishEdge);
    this.animationEdge = new TextureAnimator(this.edge, 5, 12, 60, 75); // texture, #horiz, #vert, #total, duration.
    this.animationColor = new TextureAnimator(this.color, 5, 12, 60, 75); // texture, #horiz, #vert, #total, duration.

    this.tileEdge = new AnimatedTile(
      this.edge,
      this.position.x,
      this.position.y,
      this.position.z,
      this.width,
      this.height,
      this.vertexCount
    );

    this.tileColor = new AnimatedTile(
      this.color,
      this.position.x,
      this.position.y,
      this.position.z,
      this.width,
      this.height,
      this.vertexCount
    );
  }

  align(fishes) {
    let steering = new THREE.Vector3();
    let total = 0;
    fishes.forEach(fish => {
      let distance = this.position.distanceTo(fish.position);
      if (fish != this && distance < this.perception) {
        steering.add(fish.velocity);
        total++;
      }
    });
    if (total > 0) {
      steering.divideScalar(total);
      steering.sub(this.velocity);
    }
    if (steering.length() > 0.00001) {
      steering.divideScalar(100);
    }
    return steering;
  }

  swim() {
    let steering = new THREE.Vector3();
    let total = 0;

    let center = new THREE.Vector3(this.position.x, 0, this.position.z);
    let distance = this.position.distanceTo(center);

    steering.add(center);
    steering.sub(this.position);
    steering.sub(this.velocity);

    if (steering.length() > 0.00001) {
      steering.divideScalar(1000);
    }
    return steering;
  }

  flock(fishes) {
    this.acceleration.multiplyScalar(0);

    this.alignement = this.align(fishes);
    this.swiming = this.swim(fishes);

    this.acceleration.add(this.alignement);
    this.acceleration.add(this.swiming);
  }

  update(delta) {
    this.animationEdge.update(1000 * delta);
    this.animationColor.update(1000 * delta);

    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);

    if (this.velocity.x < 0.01) {
      this.velocity.x = this.velocity.x * 2;
    }

    let dx = this.velocity.x;
    let dy = this.velocity.y;
    // console.log(Math.atan2(dy, dx));
    this.angle = Math.atan2(dy, dx) + Math.PI;

    this.tileEdge.mesh.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    );
    this.tileColor.mesh.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    );

    this.tileEdge.mesh.rotation.z = this.angle;
    this.tileColor.mesh.rotation.z = this.angle;
  }

  limits() {
    if (this.position.x > 2.5) {
      this.position.x = -2.4;
    } else if (this.position.x < -2.5) {
      this.position.x = 2.4;
    }
    if (this.position.y > this.limit + 2.5) {
      this.position.y = 2.4;
      this.velocity.x * -1;
    } else if (this.position.y < -this.limit - 2.5) {
      this.position.y = -2.4;
      this.velocity.x * -1;
    }
    // if (this.position.z > this.limit) {
    //   this.position.z = -this.limit;
    // } else if (this.position.z < -this.limit) {
    //   this.position.z = this.limit;
    // }
  }
}
