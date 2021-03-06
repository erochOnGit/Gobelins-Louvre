export default class Tile {
  constructor(texture, x, y, z, width, height, vertexCount) {
    this.texture = texture;
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width || 1;
    this.height = height || 1;
    this.vertexCountX = vertexCount / 2;
    this.vertexCountY = vertexCount / 2;
    this.geometry = new THREE.BoxGeometry(
      this.width,
      this.height,
      0.01,
      this.vertexCountX,
      this.vertexCountY
    );

    this.material = new THREE.MeshLambertMaterial({
      map: this.texture,
      transparent: true,
      alphaTest: 0.5
      // color:Math.random()*0x00ffff
      // wireframe: true
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(this.x, this.y, this.z);
  }
}
