import Plain from "./Plain";

export default class Scene {
    constructor(images,camera,index) {
        this.group = new THREE.Group();
        this.camera = camera;
        this.images = images
        this.index = index.toString()
        this.illustrations = []
        this.addImages()
        
    }
    
    addImages() {
        for(let i=0; i<Object.keys(this.images).length;i++) {
            let mesh = []
            mesh.push(this.images[Object.keys(this.images)[i]]);
            mesh.map((texture, index) => {
              let layer = parseInt(Object.keys(this.images)[i].match(/(LAYER_\d+(\.\d)*)/g)[0].split('LAYER_')[1])
                layer *= 0.5

                let partie = parseInt(Object.keys(this.images)[i].match(/(PARTIE_\d+(\.\d)*)/g)[0].split('PARTIE_')[1])-1
                console.log(partie)
                let d = this.getDimensionsFromDistance(this.camera.position.z-layer)
              let height = (4096/2)/1920
              let textureLoaded = new THREE.TextureLoader().load(texture);
              let illu = new Plain(textureLoaded, 0, -partie*d.width*height, layer, d.width, d.width*height, 1);


              illu.mesh.rotation.set(0,-180* Math.PI/180,180* Math.PI/180)
              illu.mesh.scale.set(1,-1,-1)

            this.illustrations.push(illu.mesh)
            illu.mesh.renderOrder = this.index
            illu.material.depthTest = false;
              this.group.add(illu.mesh)
        
              return illu;
            });
        }
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