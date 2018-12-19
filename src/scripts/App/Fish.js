import AnimatedTile from "./AnimatedTile";
export default class Fish {
  constructor(textureTrait, textureColor, x, y, z, width, height, vertexCount) {
    this.textureTrait = textureTrait;
    this.textureColor = textureColor;
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.height = height;
    this.vertexCount = vertexCount;

    this.tileTrait = new AnimatedTile(
      this.textureTrait,
      this.x,
      this.y,
      this.z,
      this.width,
      this.height,
      this.vertexCount
    );
    this.tileColor = new AnimatedTile(
      this.textureTrait,
      this.x,
      this.y,
      this.z,
      this.width,
      this.height,
      this.vertexCount
    );
  }
}
