

window.loadDoneCallback = () => {
  setTimeout(() => window.loaded = true, 3000);
}
// window.addEventListener('load', (event) => {
// if(window.isBanter){
//   AframeInjection.addEventListener('spaceStateChange', async e => {
//     i++;
//     console.log("Space State Listener. " + i)
//     e.detail.changes.forEach(change => {
//       switch(change.property) {
//       case "zephitestprop":
//         if (zephitestprop && zephitestprop !== change.newValue) {
//         console.log(zephitestprop);
//         console.log("Fire Screen change");
//         zephitestprop = change.newValue;
//         }
//         console.log("zephitestprop: Change");
//         console.log(change);
//         console.log("zephitestprop: Change.property");
//         console.log(change.property);
//         console.log("zephitestprop: zephitestprop");
//         console.log(zephitestprop);
//         console.log("zephitestprop: " + zephitestprop);
//       break; 
//       case "teststateprop":
//         if (teststateprop && teststateprop !== change.newValue) {
//         console.log(teststateprop);
//         console.log("teststateprop change");
//         teststateprop = change.newValue;
//         }
//         console.log("teststateprop value: " + teststateprop);
//       break; 
//       }
//       })
//   });
// };

AframeInjection.addEventListener('spaceStateChange', async e => {
  console.log("Space State Listener. ");
  e.detail.changes.forEach(change => { 
    console.log(change);
  });
});


/////////////////////////////////////////////////

 // Toggles the space state
AFRAME.registerComponent("toggle-sstate", {
	init: function () {
	  this.el.addEventListener("click", () => {
      if (firesscreenon == "1") {
        setPublicSpaceProp('firesscreenon', '0');
      } else {
        setPublicSpaceProp('firesscreenon', '1');
      };
		this.el.setAttribute("color","#ffffff");
		setTimeout(() => {  this.el.setAttribute("color","#333333"); }, 100);
		});  }, 	});

 // Disables the space state property
AFRAME.registerComponent("disable-sstate", {
	init: function () {
	  this.el.addEventListener("click", () => {
        setPublicSpaceProp('firesscreenon', '0');
		this.el.setAttribute("color","#ffffff");
		setTimeout(() => {  this.el.setAttribute("color","#333333"); }, 100);
		});  }, 	});
 // Enables the space state property
AFRAME.registerComponent("enable-sstate", {
	init: function () {
	  this.el.addEventListener("click", () => {
        setPublicSpaceProp('firesscreenon', '1');
		this.el.setAttribute("color","#ffffff");
		setTimeout(() => {  this.el.setAttribute("color","#333333"); }, 100);
		});  }, 	});

////////////////////////////////////


  AFRAME.registerComponent("toggle-fscreen", {
	init: function () {
	  this.el.addEventListener("click", () => {
      toggleFireScreen();
		this.el.setAttribute("color","#ffffff");
		setTimeout(() => {  this.el.setAttribute("color","#00FF00"); }, 100);
		});  }, 	});


  AFRAME.registerComponent("disable-screen", {
	init: function () {
	  this.el.addEventListener("click", () => {
      disablefirescreencast();
		this.el.setAttribute("color","#ffffff");
		setTimeout(() => {  this.el.setAttribute("color","#333333"); }, 100);
		});  }, 	});
      
  AFRAME.registerComponent("enable-screen", {
	init: function () {
	  this.el.addEventListener("click", () => {
      enablefirescreencast();
		this.el.setAttribute("color","#ffffff");
		setTimeout(() => {  this.el.setAttribute("color","#333333"); }, 100);
		});  }, 	});

  AFRAME.registerComponent("disable-fscreen", {
	init: function () {
	  this.el.addEventListener("click", () => {
      disableFireScreen();
		this.el.setAttribute("color","#ffffff");
		setTimeout(() => {  this.el.setAttribute("color","#333333"); }, 100);
		});  }, 	});
      
  AFRAME.registerComponent("enable-fscreen", {
	init: function () {
	  this.el.addEventListener("click", () => {
      enableFireScreen();
		this.el.setAttribute("color","#ffffff");
		setTimeout(() => {  this.el.setAttribute("color","#333333"); }, 100);
		});  }, 	});
