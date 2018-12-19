export default class AnimatedTile {
  constructor(edgeTexture, x, y, z, width, height, vertexCount, VideoTexture) {
    this.texture = edgeTexture;
    this.textureAlpha = VideoTexture || null;
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width || 1;
    this.height = height || 1;
    this.vertexCountX = vertexCount / 2;
    this.vertexCountY = vertexCount / 2;

    this.material = new THREE.MeshPhongMaterial({
      transparent: true,
      map: this.texture,
      alphaMap: this.textureAlpha,
      lights: true
    });

    this.geometry = new THREE.PlaneGeometry(
      this.width,
      this.height,
      this.vertexCountX,
      this.vertexCountY
    );
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(this.x, this.y, this.z);
  }
}
