var OrbitControls = require("three-orbit-controls")(THREE);
import handleInteraction from "src/utils/handleInteraction";

import landingPicture from "src/assets/LandingPage/accueil-illustration.jpg";
import titre from "src/assets/LandingPage/titre.svg";
import button from "src/assets/LandingPage/button.svg";
import audioPicto from "src/assets/LandingPage/pictocasque.svg";
import AnimatedTile from "./AnimatedTile";

export default class LandingPage {
  constructor(app) {
    this.group = new THREE.Group();
    console.log(app);
    this.app = app;
    console.log(this.app);
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
    let illu = new AnimatedTile(textureLoaded, 0, 0, 0, d.width, d.height, 1);

    illu.mesh.rotation.set(0, (-180 * Math.PI) / 180, (180 * Math.PI) / 180);
    illu.mesh.scale.set(1, -1, -1);

    this.illustrations.push(illu.mesh);
    illu.mesh.renderOrder = this.index;
    illu.material.depthTest = false;
    this.group.add(illu.mesh);
  }
  addDOM() {
    let section = document.createElement("section");
    section.classList.add("landing");
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

    buttonSvg.addEventListener("click", this.startExperience);

    // console.log("yolo");
    buttonSvg.appendChild(buttonPic);
    section.appendChild(audio);
    section.appendChild(title);
    section.appendChild(p);
    section.appendChild(buttonSvg);

    document.querySelector("#main").appendChild(section);
  }
  startExperience() {
    console.log("start the exp", this.app);
    handleInteraction(this.app);
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
