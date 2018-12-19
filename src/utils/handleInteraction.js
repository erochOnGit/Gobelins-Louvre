import { TweenLite } from "gsap/TweenMax";

let tween = null;

export default app => {
  app.raycaster = new THREE.Raycaster();
  app.mouse = new THREE.Vector2();
  app.intersects = [];

  let handleWheel = e => {
    if (Object.values(document.body.classList).includes("isFirefox")) {
      scrolling(e.deltaY); //we divide by 100 because it's too fast
    } else {
      scrolling(e.deltaY / 100); //we divide by 100 because it's too fast
    }
  };

  let scrolling = scroll => {
    // if(tween) {
    //   tween.kill()
    // }

    // tween = TweenLite.to(app.camera.position, 1, {
    //   ease: Power1.easeOut,
    //   y: app.camera.position.y - scroll
    // });

    app.camera.position.y -= scroll;
  };
  window.addEventListener("wheel", handleWheel.bind(app));
  let raycastClick = event => {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    app.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    app.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and mouse position
    app.raycaster.setFromCamera(app.mouse, app.camera);

    // calculate objects intersecting the picking ray
    app.intersects = app.raycaster.intersectObjects(app.scene.children);

    for (var i = 0; i < app.intersects.length; i++) {
      console.log(app.intersects[i]);
      app.intersects[i].object.material.color.set(0xff0000);
    }
  };
  let raycasHover = event => {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    app.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    app.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and mouse position
    app.raycaster.setFromCamera(app.mouse, app.camera);

    // calculate objects intersecting the picking ray
    app.intersects = app.raycaster.intersectObjects(app.scene.children);

    for (var i = 0; i < app.intersects.length; i++) {
      app.intersects[i].object.material.color.set(0xff0000);
    }
  };
  // window.addEventListener("mousemove", raycasHover.bind(app));
  window.addEventListener("click", raycastClick.bind(app));
};
