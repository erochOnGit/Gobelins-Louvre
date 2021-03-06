import { TweenLite } from "gsap/TweenMax";

let tweenC = null;
let tweenS = null;

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
    if (tweenC) {
      tweenC.kill();
    }

    if (tweenS && scroll > 5) {
      tweenS.kill();
    }

    tweenC = TweenLite.to(app.camera.position, 0.5, {
      ease: Power1.easeOut,
      y: app.camera.position.y - scroll,
      onStart: ()=>{
        
      }
    });

    app.scrollAmount = app.camera.position.y

    
    

    if (scroll > 5) {
      tweenS = TweenLite.to(app.zoomBlur.uniforms.strength, 0.25, {
        ease: Power1.easeIn,
        value: scroll / 100,
        onComplete: () => {
          TweenLite.to(app.zoomBlur.uniforms.strength, 0.25, {
            ease: Power1.easeOut,
            value: 0
          });
        }
      });
    }

    // app.camera.position.y += (-scroll - app.camera.position.y) * 0.1
  };
  window.addEventListener("wheel", handleWheel.bind(app));

  let start = { x: 0, y: 0 };

  let touchStart = event => {
    start.x = event.touches[0].pageX;
    start.y = event.touches[0].pageY;
  };

  let touchMove = event => {
    let offset = {};

    offset.x = start.x - event.touches[0].pageX;
    offset.y = start.y - event.touches[0].pageY;

    app.camera.position.y += -offset.y / 2000;
  };

  window.addEventListener("touchstart", touchStart.bind(app), false);
  window.addEventListener("touchmove", touchMove.bind(app), false);

  let raycastClick = event => {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    app.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    app.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and mouse position
    app.raycaster.setFromCamera(app.mouse, app.camera);

    // calculate objects intersecting the picking ray
    app.intersects = app.raycaster.intersectObjects(app.scene.children, true);

    for (var i = 0; i < app.intersects.length; i++) {
      // app.intersects[i].object.material.color.set(0xff0000);
      if (app.intersects[i].object.hover) {
        app.animationTiles.forEach(animationTile => {
          if (animationTile.id == app.intersects[i].object.name) {
            // console.log("done", animationTile);
            animationTile.animate();
            // console.log(animationTile.hover);
          }
        });
      }
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
    app.intersects = app.raycaster.intersectObjects(app.scene.children, true);

    for (var i = 0; i < app.intersects.length; i++) {
      // app.intersects[i].object.material.color.set(0xff0000);
      if (app.intersects[i].object.hover) {
        console.log("on est la");
      }
    }
  };
  window.addEventListener("mousemove", raycasHover.bind(app));
  window.addEventListener("click", raycastClick.bind(app));
};
