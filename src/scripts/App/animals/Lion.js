import AnimatedTile from "../AnimatedTile";
import lionColor from "src/assets/animations/lion/sprite-lion-couleur.png";
import lionEdge from "src/assets/animations/lion/sprite-lion-trait.png";
import TextureAnimator from "src/utils/TextureAnimator";

export default class Lion {
  constructor({ position, width, height, vertexCount, id }) {
    this.width = width;
    this.height = height;
    this.vertexCount = vertexCount;
    this.position = position || new THREE.TextureLoader();
    this.id = "lion" + id;
    let textureLoader = new THREE.TextureLoader();
    this.edge = textureLoader.load(lionColor);
    this.color = textureLoader.load(lionEdge);
    this.animationEdge = new TextureAnimator(this.edge, 2, 9, 18, 75); // texture, #horiz, #vert, #total, duration.
    this.animationColor = new TextureAnimator(this.color, 2, 9, 18, 75); // texture, #horiz, #vert, #total, duration.

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
