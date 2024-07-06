// Everyone who helped make this possible, HBR, Vanquish3r, DedZed, Sebek and FireRat, And thank you to everyone who helped test it
// firescreen toggle by HBR & Fire Thank you HBR!
let fireScreenOn = 1;
// Create screen on space load 
window.addEventListener('load', (event) => {
  setTimeout(() => { 
    console.log("Loading FireScreen"); loadscripts(); 
    setTimeout(() => { enableFireScreen(); }, 5000);
  }, 2500);
});

function loadscripts() {
let scriptloaded = document.getElementById("screen-scripts");
if (scriptloaded) { console.log("Fire Screen Scripts Already Loaded"); 
  } else {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = "screen-scripts";
    script.src = 'https://firer.at/test/firescreenscripts.js';
    document.body.appendChild(script);
    console.log("Added Fire Screen Scripts")
  }
};

function disableFireScreen() {
  let firescreen = document.getElementById("fires-browser");
  if (firescreen) {
    // Browser is on, remove it
    firescreen.parentElement.removeChild(firescreen);
		console.log("Fire screen Disabled"); 
  }
  fireScreenOn = 0;
  keepsoundlevel();
};

function enableFireScreen() {
  console.log("Enabling Fire Screen");
  // window.enableControllerExtras(); // CAN REMOVE THIS LINE
  const scripts = document.getElementsByTagName("script");
  for (let i = 0; i < scripts.length; i++) {
    if (
      getAttrOrDef(scripts[i], "src", "") ===
      "https://firer.at/test/firescreen.js" ) {
      const pPos = getV3FromStr(getAttrOrDef(scripts[i], "position", "1 2 -1"));
      const pRot = getV3FromStr(getAttrOrDef(scripts[i], "rotation", "0 0 0"));
      const pSca = getV3FromStr(getAttrOrDef(scripts[i], "scale", "1 1 1"));
      const pVolume = getAttrOrDef(scripts[i], "volumelevel", "0.1");
      const pWebsite = getAttrOrDef(scripts[i], "website", "https://firer.at/pages/games.html");
      const pMipmaps = getAttrOrDef(scripts[i], "mipmaps", "1");
      const pPixelsperunit = getAttrOrDef(scripts[i], "pixelsperunit", "1600");
      const pBackdrop = getAttrOrDef(scripts[i], "backdrop", "1");
      const pURL = "url: " + pWebsite + "; mipMaps: " + pMipmaps + "; pixelsPerUnit: " + pPixelsperunit + "; mode: local;";
      createFireScreen(pPos, pRot, pSca, pVolume, pURL, pBackdrop);
    }
  }
}

function createFireScreen(p_pos, p_rot, p_sca, p_volume, p_url, p_backdrop) {
  //just to be sure we don't create multiple
  disableFireScreen();
  //now add it
  const firescreen = document.createElement("a-entity");
  firescreen.id = "fires-browser";
  firescreen.setAttribute("position", p_pos);
  firescreen.setAttribute("rotation", p_rot);
  firescreen.setAttribute("scale", p_sca);
  firescreen.setAttribute("volumelevel", p_volume);
  firescreen.setAttribute( "sq-browser", p_url);
  firescreen.setAttribute("sq-browser-interaction");
  firescreen.setAttribute("enable-interaction");
  firescreen.setAttribute( "sq-rigidbody", "useGravity: false; drag:10; angularDrag:10;");
  document.querySelector("a-scene").appendChild(firescreen);
  fireScreenOn = 1;
  // setPublicSpaceProp('firescreenon', '1');
  addfirescreenpart00(); // for the collider to allow it to be moved
  if (p_backdrop == "1") {addfirescreenpart01();}; // Backdrop for contrast
  addfirescreenpart02(); // lock/unlock button to toggle the screen collider 
  addfirescreenpart03(); // Grow Button
  addfirescreenpart04(); // Shrink Button
  addfirescreenpart05(); // Rotate Left Button
  addfirescreenpart06(); // Rotate Right Button
  addfirescreenpart07(); // Tilt Forwards Button
  addfirescreenpart08(); // Tilt Backwards Button
  addfirescreenpart09(); // Toggle Rotations Button
  addfirescreenpart10(); // Mute/UnMute Button
  addfirescreenpart11(); // Volume Up Button
  addfirescreenpart12(); // Volume Down Button
  addfirescreenpart13(); // Hide/Show Buttons Button
  addfirescreenpart14(); // Info Button
  addfirescreenpart15(); // Go Back Button
  addfirescreenpart16(); // Go Forwards Button
  addfirescreenpart17(); // Home Button
  addfirescreenpart18(); // Google Button
  addfirescreenpart19(); // Jackbox Button
  addfirescreenpart20(); // Papas.tv
  addfirescreenpart21(); // Banter Events
  // addfirescreenpart22(); // Test Mute Button
  keepsoundlevel();
		console.log("Fire screen Enabled"); 
};

// for the collider to allow it to be moved
function addfirescreenpart00() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("opacity", "0");
  firescreen.setAttribute("position", "0 0 0");
  firescreen.setAttribute("scale", "1.0 0.55 0.05");
  firescreen.setAttribute("color", "#ff0000");
  firescreen.setAttribute("sq-boxcollider");
  firescreen.setAttribute("sq-grabbable");
  firescreen.setAttribute("visible", "false");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Backdrop for contrast
function addfirescreenpart01() {
  const firescreen = document.createElement("a-box");
  firescreen.setAttribute("opacity", "0.9");
  firescreen.setAttribute("position", "0 0 -0.015");
  firescreen.setAttribute("depth", "0.01");
  firescreen.setAttribute("width", "1.09");
  firescreen.setAttribute("height", "0.64");
  firescreen.setAttribute("color", "#000000");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// lock/unlock button to toggle the screen collider 
function addfirescreenpart02() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("position", "0 0.38 0");
  firescreen.setAttribute("width", "0.1");
  firescreen.setAttribute("height", "0.1");
  firescreen.setAttribute("color", "#FF0000");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "buttons");
  firescreen.setAttribute("src", "https://firer.at/files/HG2.png");
  firescreen.setAttribute("lockbutton");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Grow Button
function addfirescreenpart03() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("position", "0.6 0.06 0");
  firescreen.setAttribute("width", "0.1");
  firescreen.setAttribute("height", "0.1");
  firescreen.setAttribute("color", "#00FF00");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "buttons");
  firescreen.setAttribute("src", "https://firer.at/files/expand.png");
  firescreen.setAttribute("scale-screen", "size: shrink; avalue: 0.1");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Shrink Button
function addfirescreenpart04() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("position", "0.6 -0.06 0");
  firescreen.setAttribute("width", "0.1");
  firescreen.setAttribute("height", "0.1");
  firescreen.setAttribute("color", "#00FF00");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "buttons");
  firescreen.setAttribute("src", "https://firer.at/files/shrink.png");
  firescreen.setAttribute("scale-screen", "size: shrink; avalue: -0.1");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Rotate Left Button
function addfirescreenpart05() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("position", "-0.5 -0.37 0");
  firescreen.setAttribute("width", "0.1");
  firescreen.setAttribute("height", "0.1");
  firescreen.setAttribute("color", "#00FF00");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "tilt buttons");
  firescreen.setAttribute("src", "https://firer.at/files/RL.png");
  firescreen.setAttribute("visible", "false");
  firescreen.setAttribute("rotate", "axis: y; amount: -10");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Rotate Right Button
function addfirescreenpart06() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("position", "0.5 -0.37 0");
  firescreen.setAttribute("width", "0.1");
  firescreen.setAttribute("height", "0.1");
  firescreen.setAttribute("color", "#00FF00");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "tilt buttons");
  firescreen.setAttribute("src", "https://firer.at/files/RR.png");
  firescreen.setAttribute("visible", "false");
  firescreen.setAttribute("rotate", "axis: y; amount: 10");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Tilt Forwards Button
function addfirescreenpart07() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("position", "-0.4 -0.37 0");
  firescreen.setAttribute("width", "0.1");
  firescreen.setAttribute("height", "0.1");
  firescreen.setAttribute("color", "#00FF00");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "tilt buttons");
  firescreen.setAttribute("src", "https://firer.at/files/TF.png");
  firescreen.setAttribute("visible", "false");
  firescreen.setAttribute("rotate", "axis: x; amount: 5");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Tilt Backwards Button
function addfirescreenpart08() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("position", "0.4 -0.37 0");
  firescreen.setAttribute("width", "0.1");
  firescreen.setAttribute("height", "0.1");
  firescreen.setAttribute("color", "#00FF00");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "tilt buttons");
  firescreen.setAttribute("src", "https://firer.at/files/TB.png");
  firescreen.setAttribute("visible", "false");
  firescreen.setAttribute("rotate", "axis: x; amount: -5");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Toggle Rotations Button
function addfirescreenpart09() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("position", "-0.6 -0.3 0");
  firescreen.setAttribute("width", "0.1");
  firescreen.setAttribute("height", "0.1");
  firescreen.setAttribute("color", "#FFFFFF");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "buttons");
  firescreen.setAttribute("src", "https://firer.at/files/Rot.png");
  firescreen.setAttribute("enablerot", "false");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Mute/UnMute Button
function addfirescreenpart10() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("position", "0.2 0.38 0");
  firescreen.setAttribute("width", "0.1");
  firescreen.setAttribute("height", "0.1");
  firescreen.setAttribute("color", "#FFFFFF");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "buttons");
  firescreen.setAttribute("src", "https://firer.at/files/VolumeMute.png");
  firescreen.setAttribute("toggle-mute");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Volume Up Button
function addfirescreenpart11() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("position", "0.5 0.38 0");
  firescreen.setAttribute("width", "0.1");
  firescreen.setAttribute("height", "0.1");
  firescreen.setAttribute("color", "#00FF00");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "buttons");
  firescreen.setAttribute("src", "https://firer.at/files/VolumeHigh.png");
  firescreen.setAttribute("volume-level", "vvalue: 0.05");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Volume Down Button
function addfirescreenpart12() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("position", "0.35 0.38 0");
  firescreen.setAttribute("width", "0.1");
  firescreen.setAttribute("height", "0.1");
  firescreen.setAttribute("color", "#00FF00");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "buttons");
  firescreen.setAttribute("src", "https://firer.at/files/VolumeLow.png");
  firescreen.setAttribute("volume-level", "vvalue: -0.05");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Hide/Show Buttons Button
function addfirescreenpart13() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("position", "-0.6 0 0");
  firescreen.setAttribute("width", "0.1");
  firescreen.setAttribute("height", "0.1");
  firescreen.setAttribute("color", "#FFFFFF");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("src", "https://firer.at/files/Eye.png");
  firescreen.setAttribute("hidebuttons");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Info Button
function addfirescreenpart14() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("position", "-0.6 0.28 0");
  firescreen.setAttribute("width", "0.1");
  firescreen.setAttribute("height", "0.1");
  firescreen.setAttribute("color", "#00FF00");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "buttons");
  firescreen.setAttribute("src", "https://firer.at/files/Info.png");
  firescreen.setAttribute("click-url", "url: https://firer.at/pages/Info.html");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Go Back Button
function addfirescreenpart15() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("position", "-0.5 0.38 0");
  firescreen.setAttribute("width", "0.1");
  firescreen.setAttribute("height", "0.1");
  firescreen.setAttribute("color", "#00FF00");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "buttons");
  firescreen.setAttribute("src", "https://firer.at/files/Arrow.png");
  firescreen.setAttribute("navigate-browser", "action: goback");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Go Forwards Button
function addfirescreenpart16() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("position", "-0.4 0.38 0");
  firescreen.setAttribute("width", "0.1");
  firescreen.setAttribute("height", "0.1");
  firescreen.setAttribute("color", "#00FF00");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "buttons");
  firescreen.setAttribute("src", "https://firer.at/files/Arrow.png");
  firescreen.setAttribute("navigate-browser", "action: goforward");
  firescreen.setAttribute("rotation", "0 0 180");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Home Button
function addfirescreenpart17() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("position", "-0.27 0.38 0");
  firescreen.setAttribute("width", "0.1");
  firescreen.setAttribute("height", "0.1");
  firescreen.setAttribute("color", "#FF0000");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "buttons");
  firescreen.setAttribute("src", "https://firer.at/files/Home.png");
  firescreen.setAttribute("click-url", "url: https://firer.at/pages/games.html");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Google Button
function addfirescreenpart18() {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("position", "-0.6 0.16 0");
  firescreen.setAttribute("width", "0.1");
  firescreen.setAttribute("height", "0.1");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "buttons");
  firescreen.setAttribute("src", "https://firer.at/files/Google.png");
  firescreen.setAttribute("click-url", "url:https://google.com/");
  document.getElementById("fires-browser").appendChild(firescreen);
};

// Extra Button 1 Part 1
function addfirescreenpart19() {
  const firescreen = document.createElement("a-plane");
  firescreen.id = "extra-button-1";
  firescreen.setAttribute("position", "0.68 0.3 0");
  firescreen.setAttribute("width", "0.2");
  firescreen.setAttribute("height", "0.04");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("color", "#000000");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "buttons");
  firescreen.setAttribute("click-url", "url: https://jackbox.tv/");
  document.getElementById("fires-browser").appendChild(firescreen);
  addfirescreenpart19p2();
};

// Extra Button 1 Part 2
function addfirescreenpart19p2() {
  const firescreen = document.createElement("a-text");
  firescreen.setAttribute("value", "Jackbox.tv");
  firescreen.setAttribute("position", "0 0 0.01");
  firescreen.setAttribute("scale", "0.11 0.11 0.11");
  firescreen.setAttribute("color", "#FFFFFF");
  firescreen.setAttribute("align", "center");
  document.getElementById("extra-button-1").appendChild(firescreen);
};

// Extra Button 2 Part 1
function addfirescreenpart20() {
  const firescreen = document.createElement("a-plane");
  firescreen.id = "extra-button-2";
  firescreen.setAttribute("position", "0.68 0.25 0");
  firescreen.setAttribute("width", "0.2");
  firescreen.setAttribute("height", "0.04");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("color", "#000000");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "buttons");
  firescreen.setAttribute("click-url", "url: https://papas.tv/");
  document.getElementById("fires-browser").appendChild(firescreen);
  addfirescreenpart20p2();
};

// Extra Button 2 Part 2
function addfirescreenpart20p2() {
  const firescreen = document.createElement("a-text");
  firescreen.setAttribute("value", "Papas.tv");
  firescreen.setAttribute("position", "0 0 0.01");
  firescreen.setAttribute("scale", "0.11 0.11 0.11");
  firescreen.setAttribute("color", "#FFFFFF");
  firescreen.setAttribute("align", "center");
  document.getElementById("extra-button-2").appendChild(firescreen);
};

// Extra Button 3 Part 1
function addfirescreenpart21() {
  const firescreen = document.createElement("a-plane");
  firescreen.id = "extra-button-3";
  firescreen.setAttribute("position", "0.68 -0.3 0");
  firescreen.setAttribute("width", "0.2");
  firescreen.setAttribute("height", "0.04");
  firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("color", "#000000");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "buttons");
  firescreen.setAttribute("click-url", "url: https://bantervr.com/events");
  document.getElementById("fires-browser").appendChild(firescreen);
  addfirescreenpart21p2();
};

// Extra Button 3 Part 2
function addfirescreenpart21p2() {
  const firescreen = document.createElement("a-text");
  firescreen.setAttribute("value", "Banter Events");
  firescreen.setAttribute("position", "0 0 0.01");
  firescreen.setAttribute("scale", "0.11 0.11 0.11");
  firescreen.setAttribute("color", "#FFFFFF");
  firescreen.setAttribute("align", "center");
  document.getElementById("extra-button-3").appendChild(firescreen);
};

class FCore {
tmutefunction(){
		console.log("Mute Hand Clicked");
};
// Mute/UnMute Button
addfirescreenpart22() {

    const handbutcontainer = document.createElement("a-entity");
    handbutcontainer.setAttribute("scale", "0.1 0.1 0.1");
    handbutcontainer.setAttribute("position", "0 0 0");
    handbutcontainer.setAttribute("sq-lefthand", "whoToShow: onlyme;");
    [
      {
        image: "https://firer.at/files/VolumeMute.png",
        position: "-0.1 0.0 -0.0", 
        buttontype: "fires-handmute", 
        aattribute: "mute-hand", 
        callback: () => this.tmutefunction()
      },
      {
        image: "https://firer.at/files/VolumeHigh.png",
        position: "-0.1 0.5 -0.5", 
        buttontype: "fires-handcontrols", 
        aattribute: "mute-hand", 
        callback: () => this.tmutefunction()
      }
    ].forEach(item => {
  const firescreen = document.createElement("a-plane");
  firescreen.setAttribute("sq-lefthand", "whoToShow: onlyme;");
  firescreen.id = item.buttontype;
  firescreen.setAttribute("position", item.position);
  firescreen.setAttribute("scale", "0.5 0.5 0.5");
  firescreen.setAttribute("rotation", "0 -90 180");
  // firescreen.setAttribute("color", "#FFFFFF");
  // firescreen.setAttribute("transparent", true);
  // firescreen.setAttribute("material", "transparent: true");
  firescreen.setAttribute("sq-collider");
  firescreen.setAttribute("sq-interactable");
  firescreen.setAttribute("class", "buttons");
  firescreen.setAttribute("src", item.image);
  firescreen.setAttribute(item.aattribute, "");
  firescreen.addEventListener("click", () => item.callback());
  // document.getElementById("fires-browser").appendChild(firescreen);
  // document.querySelector("a-scene").appendChild(firescreen);
  handbutcontainer.appendChild(firescreen);
      })
  document.querySelector("a-scene").appendChild(handbutcontainer);
};
}
window.videoPlayerCore = new FCore();
// Sets the default sound level probably
var volinterval = null;
function keepsoundlevel() {
  let firescreen = document.getElementById("fires-browser");
  if (fireScreenOn) {
  // Loop to keep sound level set, runs every second
    volinterval = setInterval(function() {
      let volume = parseFloat(firescreen.getAttribute("volumelevel"));
      firescreen.components["sq-browser"].runActions([ { actionType: "runscript", strparam1:
      "document.querySelectorAll('video, audio').forEach((elem) => elem.volume=" + volume + ");", }, ]);
      // console.log("The volume is: " + volume);
    }, 1000); } else { clearInterval(volinterval); }
};
