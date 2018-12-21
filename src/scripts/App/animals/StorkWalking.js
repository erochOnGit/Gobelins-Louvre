import AnimatedTile from "../AnimatedTile";
import storkWalkingColor from "src/assets/animations/birdWalking/sprite-oiseau02-couleur.png";
import storkWalkingEdge from "src/assets/animations/birdWalking/sprite-oiseau02-trait.png";
import TextureAnimator from "src/utils/TextureAnimator";

export default class Stork {
  constructor({ position, width, height, vertexCount, id }) {
    this.width = width;
    this.height = height;
    this.vertexCount = vertexCount;
    this.id = "storkWalking" + id;
    this.position = position || new THREE.TextureLoader();

    let textureLoader = new THREE.TextureLoader();
    this.edge = textureLoader.load(storkWalkingColor);
    this.color = textureLoader.load(storkWalkingEdge);
    this.animationEdge = new TextureAnimator(this.edge, 2, 14, 18, 75); // texture, #horiz, #vert, #total, duration.
    this.animationColor = new TextureAnimator(this.color, 2, 14, 18, 75); // texture, #horiz, #vert, #total, duration.

    this.tileEdge = new AnimatedTile(
      this.edge,
      this.position.x,
      this.position.y,
      this.position.z,
      this.width,
      this.height,
      this.vertexCount
    );
    this.tileEdge.mesh.hover = true;
    this.tileEdge.mesh.name = this.id;
    this.tileColor = new AnimatedTile(
      this.color,
      this.position.x,
      this.position.y,
      this.position.z,
      this.width,
      this.height,
      this.vertexCount
    );
    this.tileColor.mesh.hover = true;
    this.tileColor.mesh.name = this.id;
    this.hovered = false;
    this.frame = 0;
  }

  animate() {
    if (!this.hovered) {
      this.hovered = true;
      this.frame = 0;
    }
  }
  update(delta) {
    if (this.hovered) {
      this.animationEdge.update(1000 * delta);
      this.animationColor.update(1000 * delta);
      this.frame++;
      if (this.frame > 18) {
        this.hovered = false;
      }
    }

    // this.tileEdge.mesh.position.set(
    //   this.position.x,
    //   this.position.y,
    //   this.position.z
    // );
    // this.tileColor.mesh.position.set(
    //   this.position.x,
    //   this.position.y,
    //   this.position.z
    // );
  }
}
