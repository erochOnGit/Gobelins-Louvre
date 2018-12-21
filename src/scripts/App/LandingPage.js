var OrbitControls = require("three-orbit-controls")(THREE);
import handleInteraction from "src/utils/handleInteraction";

import encreDiffusion from "src/assets/animations/encre/encre_03.mp4";
import landingPicture from "src/assets/LandingPage/accueil-illustration.jpg";
import titre from "src/assets/LandingPage/titre.svg";
import button from "src/assets/LandingPage/button.svg";
import audioPicto from "src/assets/LandingPage/pictocasque.svg";
import AnimatedTile from "./AnimatedTile";

export default class LandingPage {
  constructor(app) {
    this.group = new THREE.Group();
    this.app = app;
    this.camera = app.camera;
    this.images = landingPicture;
    this.index = 15;
    this.illustrations = [];
    this.addImages();
    this.addDOM();
  }

  addImages() {
    let textureLoaded = new THREE.TextureLoader().load(this.images);

    let d = this.getDimensionsFromDistance(this.camera.position.z);
    let height = 4096 / 2 / 1920;
    this.videoDOM = document.createElement("video");
    this.sourceDOM = document.createElement("source");
    this.videoDOM.id = "video";
    this.videoDOM.style.position = "absolute";
    this.videoDOM.style.zIndex = "-5";
    this.videoDOM.style.display = "none";
    this.sourceDOM.src = encreDiffusion;
    // this.sourceDOM.src = ball;
    this.sourceDOM.type = "video/mp4";

    document.body.appendChild(this.videoDOM);
    this.videoDOM.appendChild(this.sourceDOM);
    var video = document.getElementById("video");

    this.VideoTexture = new THREE.VideoTexture(video);
    this.VideoTexture.minFilter = THREE.LinearFilter;
    this.VideoTexture.magFilter = THREE.LinearFilter;
    this.VideoTexture.format = THREE.RGBFormat;
    let illu = new AnimatedTile(
      textureLoaded,
      0,
      0,
      0,
      d.width,
      d.height,
      1,
      this.VideoTexture
    );

    illu.mesh.rotation.set(0, (-180 * Math.PI) / 180, (180 * Math.PI) / 180);
    illu.mesh.scale.set(1, -1, -1);

    this.illustrations.push(illu.mesh);
    illu.mesh.renderOrder = this.index;
    illu.material.depthTest = false;
    this.group.add(illu.mesh);
  }
  addDOM() {
    this.section = document.createElement("section");
    this.section.classList.add("landing");
    let p = document.createElement("p");
    let audio = document.createElement("img");
    let title = document.createElement("img");
    title.classList.add("title");
    let buttonSvg = document.createElement("div");
    let buttonPic = document.createElement("img");
    title.src = titre;
    audio.src = audioPicto;
    buttonPic.src = button;
    buttonSvg.classList.add("button");
    p.classList.add("paragraphe");
    audio.classList.add("audio");
    p.innerText =
      "La forteresse oubliée du Roi Sargon II, redécouverte par erreur, près de 2000 ans plus tard après sa construction.... Retournez dans le passé et découvrez l’histoire de ce palais éphémère et mystérieux.";

    buttonSvg.addEventListener("click", this.startExperience.bind(this));

    buttonSvg.appendChild(buttonPic);
    this.section.appendChild(audio);
    this.section.appendChild(title);
    this.section.appendChild(p);
    this.section.appendChild(buttonSvg);

    document.querySelector("#main").appendChild(this.section);
  }
  startExperience() {
    handleInteraction(this.app);
    this.section.style.opacity = 0;
    this.section.style.transform = "translateY(-200px)";
    this.videoDOM.play();
    // this.controls = new OrbitControls(this.camera);
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
