
let firesscreenon = 1;
let teststateprop = "0";
let i = 0;

window.loadDoneCallback = () => {
  setTimeout(() => window.loaded = true, 3000);
}

// window.addEventListener('load', (event) => {
document.addEventListener("DOMContentLoaded", () => {
  i++;
  console.log("AdventListener Load Event. " + i);
  if(window.isBanter){
  let isFirstRun = false;
  console.log("set first run false");
      }
      AframeInjection.addEventListener('spaceStateChange', async e => {
            console.log("Space State Listener. " + i)
            i++;
            await window.AframeInjection.waitFor(window, "loaded");
            console.log("changes. " + i)
            i++;
            e.detail.changes.forEach(change => {
                 switch(change.property) {
                 case "firesscreenon":
                     if (firesscreenon && firesscreenon !== change.newValue) {
                      console.log(firesscreenon);
                      console.log("Fire Screen change");
                      firesscreenon = change.newValue;
                     }
                     if (firesscreenon == "1") {
                      console.log("Fire Screen: 1");
                      enableFireScreen();
                     }
                     if (firesscreenon == "0") {
                      console.log("Fire Screen: 0");
                      disableFireScreen();
                     }
                  console.log("SpaceStateValue: " + firesscreenon);
                 break; 
                 case "teststateprop":
                     if (teststateprop && teststateprop !== change.newValue) {
                      console.log(teststateprop);
                      console.log("teststateprop change");
                      teststateprop = change.newValue;
                     }
                     if (teststateprop == "1") {
                      console.log("teststateprop: 1");
                     }
                     if (teststateprop == "0") {
                      console.log("teststateprop: 0");
                     }
                  console.log("teststateprop value: " + teststateprop);
                 break; 
                 }
                 })
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
