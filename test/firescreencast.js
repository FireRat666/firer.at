// Everyone who helped make this possible, HBR, Vanquish3r, DedZed, Sebek and FireRat, And thank you to everyone who helped test it
// firescreencast toggle by HBR. & Fire Thank you HBR!
let firescreencastOn = 0;
// Create screen on space load window.onload = (event) => { enablefirescreencast(); };
window.addEventListener('load', (event) => {
	if(window.isBanter) {
  setTimeout(() => { 
    console.log("Load Event Test"); loadfscripts(); 
    setTimeout(() => { enablefirescreencast(); }, 5000);
  }, 2000);console.log("Window is Banter, Starting Script");
	} else {console.log("Window is Not Banter, Not Starting Script");};
});

function loadfscripts() {
let scriptloaded = document.getElementById("screen-scripts");
if (scriptloaded) { console.log("Fire Screen Cast Scripts Already Loaded");
  } else {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = "screen-scripts";
    script.src = 'https://firer.at/scripts/firescreenscripts.js';
    document.body.appendChild(script); 
    console.log("Added Fire Screen Cast Scripts")
  }
};

function disablefirescreencast() {
  let firescreencast = document.getElementById("website-browser");
  if (firescreencast) {
    // Browser is on, remove it
    firescreencast.parentElement.removeChild(firescreencast);
		console.log("Screen Disabled"); 
  }
  firescreencastOn = 0;
  keepsssoundlevel();
}

function enablefirescreencast() {
  console.log("Enabling Fire Screen Cast");
  // window.enableControllerExtras(); // CAN REMOVE THIS LINE
  const scripts = document.getElementsByTagName("script");
  for (let i = 0; i < scripts.length; i++) {
    if (
      getAttrOrDef(scripts[i], "src", "") ===
      "https://firer.at/scripts/firescreencast.js" ) {
      const pPos = getV3FromStr(getAttrOrDef(scripts[i], "position", "1 2 -1"));
      const pRot = getV3FromStr(getAttrOrDef(scripts[i], "rotation", "0 0 0"));
      const pSca = getV3FromStr(getAttrOrDef(scripts[i], "scale", "1 1 1"));
      const pVolume = getAttrOrDef(scripts[i], "volumelevel", "0.1");
      const pWebsite = getAttrOrDef(scripts[i], "website", "https://firer.at/pages/games.html");
      const pMipmaps = getAttrOrDef(scripts[i], "mipmaps", "1");
      const pPixelsperunit = getAttrOrDef(scripts[i], "pixelsperunit", "1600");
      const pBackdrop = getAttrOrDef(scripts[i], "backdrop", "1");
      const pURL = "url: " + pWebsite + "; mipMaps: " + pMipmaps + "; pixelsPerUnit: " + pPixelsperunit + "; mode: local;";
      createfirescreencast(pPos, pRot, pSca, pVolume, pURL, pBackdrop);
    }
  }
}

function createfirescreencast(p_pos, p_rot, p_sca, p_volume, p_url, p_backdrop) {
  //just to be sure we don't create multiple
  disablefirescreencast();
  //now add it
  const firescreencast = document.createElement("a-entity");
  firescreencast.id = "website-browser";
  firescreencast.setAttribute("position", p_pos);
  firescreencast.setAttribute("rotation", p_rot);
  firescreencast.setAttribute("scale", p_sca);
  firescreencast.setAttribute("volumelevel", p_volume);
  firescreencast.setAttribute( "sq-browser", p_url);
  firescreencast.setAttribute("sq-browser-interaction");
  firescreencast.setAttribute("enable-interaction");
  document.querySelector("a-scene").appendChild(firescreencast);
  if (p_backdrop == "1") {addfirescreencastpart1();};
  addfirescreencastpart2();
  addfirescreencastpart3();
  addfirescreencastpart4();
  addfirescreencastpart5();
  firescreencastOn = 1;
  keepsssoundlevel();
		console.log("Screen Enabled"); 
};

// Backdrop for contrast
function addfirescreencastpart1() {
  const firescreencast = document.createElement("a-box");
  firescreencast.setAttribute("opacity", "0.9");
  firescreencast.setAttribute("position", "0 0 -0.015");
  firescreencast.setAttribute("depth", "0.01");
  firescreencast.setAttribute("width", "1.09");
  firescreencast.setAttribute("height", "0.64");
  firescreencast.setAttribute("color", "#000000");
  document.getElementById("website-browser").appendChild(firescreencast);
};

// Mute/UnMute Button
function addfirescreencastpart2() {
  const firescreencast = document.createElement("a-plane");
  firescreencast.setAttribute("opacity", "1");
  firescreencast.setAttribute("position", "0.2 0.38 0");
  firescreencast.setAttribute("width", "0.1");
  firescreencast.setAttribute("height", "0.1");
  firescreencast.setAttribute("color", "#FFFFFF");
  firescreencast.setAttribute("material", "transparent: true");
  firescreencast.setAttribute("sq-collider");
  firescreencast.setAttribute("sq-interactable");
  firescreencast.setAttribute("src", "https://firer.at/files/VolumeMute.png");
  firescreencast.setAttribute("toggle-mute");
  firescreencast.setAttribute("class", "buttons");
  document.getElementById("website-browser").appendChild(firescreencast);
};

// Volume Up Button
function addfirescreencastpart3() {
  const firescreencast = document.createElement("a-plane");
  firescreencast.setAttribute("opacity", "1");
  firescreencast.setAttribute("position", "0.5 0.38 0");
  firescreencast.setAttribute("width", "0.1");
  firescreencast.setAttribute("height", "0.1");
  firescreencast.setAttribute("color", "#00FF00");
  firescreencast.setAttribute("material", "transparent: true");
  firescreencast.setAttribute("sq-collider");
  firescreencast.setAttribute("sq-interactable");
  firescreencast.setAttribute("src", "https://firer.at/files/VolumeHigh.png");
  firescreencast.setAttribute("volume-level", "vvalue: 0.05");
  firescreencast.setAttribute("class", "buttons");
  document.getElementById("website-browser").appendChild(firescreencast);
};

// Volume Down Button
function addfirescreencastpart4() {
  const firescreencast = document.createElement("a-plane");
  firescreencast.setAttribute("opacity", "1");
  firescreencast.setAttribute("position", "0.35 0.38 0");
  firescreencast.setAttribute("width", "0.1");
  firescreencast.setAttribute("height", "0.1");
  firescreencast.setAttribute("color", "#00FF00");
  firescreencast.setAttribute("material", "transparent: true");
  firescreencast.setAttribute("sq-collider");
  firescreencast.setAttribute("sq-interactable");
  firescreencast.setAttribute("src", "https://firer.at/files/VolumeLow.png");
  firescreencast.setAttribute("volume-level", "vvalue: -0.05");
  firescreencast.setAttribute("class", "buttons");
  document.getElementById("website-browser").appendChild(firescreencast);
};

// Go Back Button
function addfirescreencastpart5() {
  const firescreencast = document.createElement("a-plane");
  firescreencast.setAttribute("opacity", "1");
  firescreencast.setAttribute("position", "-0.5 0.38 0");
  firescreencast.setAttribute("width", "0.1");
  firescreencast.setAttribute("height", "0.1");
  firescreencast.setAttribute("color", "#00FF00");
  firescreencast.setAttribute("material", "transparent: true");
  firescreencast.setAttribute("sq-collider");
  firescreencast.setAttribute("sq-interactable");
  firescreencast.setAttribute("src", "https://firer.at/files/Arrow.png");
  firescreencast.setAttribute("navigate-browser", "action: goback");
  firescreencast.setAttribute("class", "buttons");
  document.getElementById("website-browser").appendChild(firescreencast);
};

// Sets the default sound level probably
var sssvolinterval = null;
function keepsssoundlevel() {
  let firescreencast = document.getElementById("website-browser");
  if (firescreencastOn) {
  // Loop to keep sound level set, runs every second
    sssvolinterval = setInterval(function() {
      let volume = parseFloat(firescreencast.getAttribute("volumelevel"));
      firescreencast.components["sq-browser"].runActions([ { actionType: "runscript", strparam1:
      "document.querySelectorAll('video, audio').forEach((elem) => elem.volume=" + volume + ");", }, ]);
      // console.log("The sss volume is: " + volume);
    }, 1000); } else { clearInterval(sssvolinterval); }
};

function getV3FromStr(strVector3) {
  return new THREE.Vector3().fromArray(strVector3.split(" ").map(parseFloat));
}

function getAttrOrDef(pScript, pAttr, pDefault) {
  if (pScript.hasAttribute(pAttr)) {
    return pScript.getAttribute(pAttr);
  } else {
    return pDefault;
  }
}
  
