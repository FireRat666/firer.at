// Thank you Everyone who helped make this possible, HBR, Vanquish3r, DedZed, Sebek, Skizot, Shane and FireRat, And thank you to everyone who helped test it
// FireScreen Tablet for Screen Casts with volume controls or for a portable browser
// VERSION: 1.2 Beta 1.3.2
var thishostnameurl = "https://firer.at/scripts/"; // CHANGE THIS URL IF MAKING A COPY OF THIS SCRIPT AND THE ONES BELOW
var thisscriptsurl = thishostnameurl + "firescreen.js"; // CHANGE THIS
var announcerscripturl = thishostnameurl + "announcer.js"; // CHANGE THIS
var fireScreenOn = false;
var thebuttoncolor = "";
var playersuserid = false;

(function() {
  const initialValues = {
    announcerfirstrun: true,
    firstrunhandcontrols: true,
    handControlsDisabled: true,
    NumberofBrowsers: 0,
  };

  for (const [key, value] of Object.entries(initialValues)) {
    if (typeof window[key] === 'undefined') { window[key] = value; } // Initialize Variables only once 
  }
})();

async function enableFireScreen() {
  console.log("FIRESCREEN: Enabling Screen(s)");
  const firescripts = document.querySelectorAll(`script[src^='${thisscriptsurl}']`);
  console.log(`FIRESCREEN: Found ${firescripts.length} matching scripts`);
  firescripts.forEach((script) => { if (script.dataset.processed) { return; }; 
    window.NumberofBrowsers++; console.log(`FIRESCREEN: Loading browser ${window.NumberofBrowsers}`); script.dataset.processed = 'true';const thisBrowserNumber = window.NumberofBrowsers;

      const defaults = {
        position: "1 2 -1",
        rotation: "0 0 0",
        scale: "1 1 1",
        volumelevel: "0.25",
        website: "https://firer.at/pages/games.html",
        mipmaps: "1",
        pixelsperunit: "1200",
        width: "1024",
        height: "576",
        backdrop: "true",
        castmode: "false",
        "hand-controls": "false",
        "disable-interaction": "false",
        announcer: "false",
        announce: "false",
        "announce-420": "false",
        "announce-events": "undefined",
        "button-color": "#00FF00",
        "backdrop-color": "#000000",
        "volup-color": "#00FF00",
        "voldown-color": "#FF0000",
        "mute-color": "#FFFFFF",
        "button-position": "0 0 0",
        "button-rotation": "0 0 0",
        "icon-mute-url": "https://firer.at/files/VolumeMute.png",
        "icon-volup-url": "https://firer.at/files/VolumeHigh.png",
        "icon-voldown-url": "https://firer.at/files/VolumeLow.png",
        "icon-direction-url": "https://firer.at/files/Arrow.png",
        "custom-button01-url": "false",
        "custom-button01-text": "Custom Button 01",
        "custom-button02-url": "false",
        "custom-button02-text": "Custom Button 02",
        "custom-button03-url": "false",
        "custom-button03-text": "Custom Button 03",
      };
      const params = Object.fromEntries( Object.entries(defaults).map(([key, defaultValue]) => [ key, getAttrOrDef(script, key, defaultValue), ]) );
      const pPos = getV3FromStr(params.position); const pRot = getV3FromStr(params.rotation); const pSca = getV3FromStr(params.scale);
      const pURL = `url: ${params.website}; mipMaps: ${params.mipmaps}; pixelsPerUnit: ${params.pixelsperunit}; pageWidth: ${params.width}; pageHeight: ${params.height}; mode: local;`;
      createFireScreen(pPos, pRot, pSca, params.volumelevel, pURL, params.backdrop, params.castmode, params.website, params["button-color"], params.announcer, params.announce, params["announce-420"], params["announce-events"], params["backdrop-color"], params["icon-mute-url"], params["icon-volup-url"], params["icon-voldown-url"], params["icon-direction-url"], params["volup-color"], params["voldown-color"], params["mute-color"], params["disable-interaction"], params["button-position"], params["button-rotation"], params["hand-controls"], params.width, params.height, params["custom-button01-url"], params["custom-button01-text"], params["custom-button02-url"], params["custom-button02-text"], params["custom-button03-url"], params["custom-button03-text"],thisBrowserNumber);
  })
};

function disableFireScreen() {
  for (let i = 1; i <= window.NumberofBrowsers; i++) {
		let firescreen = document.getElementById(`fires-browser${i}`);
		if (firescreen) { // Browser is on, remove it
			firescreen.parentElement.removeChild(firescreen);
			console.log("FIRESCREEN: ${i} Fire Screen(s) Disabled"); 
		}
	}
	fireScreenOn = false; keepsoundlevel();
};

function createButton(position, width, height, color, src, attributes = {}, rotation = null, visible = true, buttonClass = "buttons") {
  let button = document.createElement("a-plane");
  button.setAttribute("position", position);
  button.setAttribute("width", width);
  button.setAttribute("height", height);
  button.setAttribute("color", color || thebuttoncolor);
  button.setAttribute("material", "transparent: true");
  button.setAttribute("sq-collider");
  button.setAttribute("sq-interactable");
  button.setAttribute("class", buttonClass);
  button.setAttribute("src", src);
  button.setAttribute("visible", visible);
  if (rotation) { button.setAttribute("rotation", rotation); };
  for (let [key, value] of Object.entries(attributes)) { button.setAttribute(key, value); };
  return button;
};

function createFireScreen(p_pos, p_rot, p_sca, p_volume, p_url, p_backdrop, p_castmode, p_website, p_buttoncolor, p_announcer, p_announce, p_announce420, p_announceevents,
  p_backdropcolor, p_iconmuteurl, p_iconvolupurl, p_iconvoldownurl, p_icondirectionurl, p_volupcolor, p_voldowncolor, p_mutecolor,
  p_disableinteraction, p_buttonpos, p_buttonrot, p_handbuttons, p_width, p_height, p_custombutton01url, p_custombutton01text,
  p_custombutton02url, p_custombutton02text, p_custombutton03url, p_custombutton03text, p_thisBrowserNumber) {

    thebuttoncolor = p_buttoncolor; fireScreenOn = true;
  // Setup the Announcer only on the first run if enabled
  if (!window.AnnouncerScriptInitialized && !window.FireScriptLoaded) { window.FireScriptLoaded = true;
    window.announcerfirstrun = false;
    console.log("FIRESCREEN: Adding the Announcer Script");
    const announcerscript = document.createElement("script");
    announcerscript.id = "fires-announcer";
    announcerscript.setAttribute("src", announcerscripturl);
    announcerscript.setAttribute("announce", p_announce);
    announcerscript.setAttribute("announce-420", p_announce420);
    announcerscript.setAttribute("announce-events", p_announceevents === "undefined" ? (p_announce === "true" ? "true" : "false") : p_announceevents);
    document.querySelector("body").appendChild(announcerscript);
  };

  let firescreen = document.createElement("a-entity");
  firescreen.id = `fires-browser${p_thisBrowserNumber}`;
  firescreen.setAttribute("position", p_pos);
  firescreen.setAttribute("rotation", p_rot);
  firescreen.setAttribute("scale", p_sca);
  firescreen.setAttribute("pageWidth", p_width);
  firescreen.setAttribute("pageHeight", p_height);
  firescreen.setAttribute("volumelevel", p_volume);
  firescreen.setAttribute("button-color", p_buttoncolor);
  firescreen.setAttribute("mute-color", p_mutecolor);
  firescreen.setAttribute("sq-browser", p_url);
  if (p_disableinteraction === "false") {
      firescreen.setAttribute("sq-browser-interaction");
      firescreen.setAttribute("enable-interaction");
  };
  firescreen.setAttribute("class", "firescreenc");
  firescreen.setAttribute("name", "firescreenc");

  if (p_castmode == "false") {
      firescreen.setAttribute("sq-rigidbody", "useGravity: false; drag:10; angularDrag:10;");
  };

  let firecollider = createButton("0 0 -0.005", "1.0", "0.55", "#ff0000", null, {"sq-boxcollider": "", "sq-grabbable": "", "scale" : "1.0 0.55 0.05", "enableLock" : "false", "opacity" : "0"}, null, false, "collider");
  firescreen.appendChild(firecollider);

  if (p_backdrop == "true") {
      let firebackdrop = document.createElement("a-box");
      firebackdrop.setAttribute("opacity", "0.9");
      firebackdrop.setAttribute("position", "0 0 -0.015");
      firebackdrop.setAttribute("depth", "0.01");
      firebackdrop.setAttribute("width", "1.09");
      firebackdrop.setAttribute("height", "0.64");
      firebackdrop.setAttribute("color", p_backdropcolor);
      firescreen.appendChild(firebackdrop);
  };

  let [ButRotX, ButRotY, ButRotZ] = p_buttonrot.split(" ").map(Number);
  let TheButRot = new BS.Vector3(ButRotX, ButRotY, ButRotZ);

  if (p_castmode == "false") {
      // Lock/Unlock button
      firescreen.appendChild(createButton("0 0.38 0", "0.1", "0.1", p_buttoncolor === "#00FF00" ? "#FFFF00" : p_buttoncolor, "https://firer.at/files/HG2.png", {"lockbutton": ""}, TheButRot));
      // Google button
      firescreen.appendChild(createButton("-0.6 0.16 0", "0.1", "0.1", "#FFFFFF", "https://firer.at/files/Google.png", {"click-url": "url:https://google.com/"}));
      // Info button
      firescreen.appendChild(createButton("-0.6 0.28 0", "0.1", "0.1", p_buttoncolor, "https://firer.at/files/Info.png", {"click-url": "url:https://firer.at/pages/Info.html"}));
      // Grow and Shrink buttons
      firescreen.appendChild(createButton("0.6 0.06 0", "0.1", "0.1", p_buttoncolor, "https://firer.at/files/expand.png", {"scale-screen": "size: shrink; avalue: 0.1"}, TheButRot));
      firescreen.appendChild(createButton("0.6 -0.06 0", "0.1", "0.1", p_buttoncolor, "https://firer.at/files/shrink.png", {"scale-screen": "size: shrink; avalue: -0.1"}, TheButRot));
      // Rotate and Tilt buttons
      firescreen.appendChild(createButton("-0.5 -0.37 0", "0.1", "0.1", p_buttoncolor, "https://firer.at/files/RL.png", {"rotate": "axis: y; amount: 5"}, null, false, "tilt"));
      firescreen.appendChild(createButton("0.5 -0.37 0", "0.1", "0.1", p_buttoncolor, "https://firer.at/files/RR.png", {"rotate": "axis: y; amount: -5"}, null, false, "tilt"));
      firescreen.appendChild(createButton("-0.4 -0.37 0", "0.1", "0.1", p_buttoncolor, "https://firer.at/files/TF.png", {"rotate": "axis: x; amount: -5"}, null, false, "tilt"));
      firescreen.appendChild(createButton("0.4 -0.37 0", "0.1", "0.1", p_buttoncolor, "https://firer.at/files/TB.png", {"rotate": "axis: x; amount: 5"}, null, false, "tilt"));
      // Toggle rotation button
      firescreen.appendChild(createButton("-0.6 -0.3 0", "0.1", "0.1", "#FFFFFF", "https://firer.at/files/Rot.png", {"enablerot": "false"}, TheButRot));
      // Hide/Show keyboard button
      firescreen.appendChild(createButton("-0.6 -0.15 0", "0.1", "0.1", "#FFFFFF", "https://firer.at/files/Keyboard.png", {"forcekeyboard": "false"}, TheButRot));
      // Hide/Show buttons toggle
      firescreen.appendChild(createButton("-0.6 0 0", "0.1", "0.1", "#FFFFFF", "https://firer.at/files/Eye.png", {"hidebuttons": ""}, TheButRot, true, ""));
  };

  // Home button
  let homeButtonPos = computeButtonPosition(p_buttonpos, "-0.27 0.38 0");
  firescreen.appendChild(createButton(homeButtonPos, "0.1", "0.1", p_buttoncolor === "#00FF00" ? "#FF0000" : p_buttoncolor, "https://firer.at/files/Home.png", {"click-url": `url:${p_website}`}, TheButRot));
  // Forward button
  let forwardButtonPos = computeButtonPosition(p_buttonpos, "-0.4 0.38 0");
  let forwardButtonRot = new BS.Vector3(ButRotX, ButRotY, ButRotZ + 180);
  firescreen.appendChild(createButton(forwardButtonPos, "0.1", "0.1", p_buttoncolor, p_icondirectionurl, {"navigate-browser": "action: goforward"}, forwardButtonRot));
  // Backward button
  let backButtonPos = computeButtonPosition(p_buttonpos, "-0.5 0.38 0");
  firescreen.appendChild(createButton(backButtonPos, "0.1", "0.1", p_buttoncolor, p_icondirectionurl, {"navigate-browser": "action: goback"}, TheButRot));
  // Mute Toggle Button
  let muteButtonPos = computeButtonPosition(p_buttonpos, "0.2 0.38 0");
  let muteButton = createButton(muteButtonPos, "0.1", "0.1", p_mutecolor, p_iconmuteurl, {"toggle-mute": ""}, TheButRot, true, "firemutebutc buttons");
  firescreen.appendChild(muteButton);
  // volUp Button
  let volUpButtonPos = computeButtonPosition(p_buttonpos, "0.5 0.38 0");
  let volUpButton = createButton(volUpButtonPos, "0.1", "0.1", p_volupcolor || p_buttoncolor, p_iconvolupurl, {"volume-level": "vvalue: 1"}, TheButRot);
  firescreen.appendChild(volUpButton);
  // volDown Button
  let volDownButtonPos = computeButtonPosition(p_buttonpos, "0.35 0.38 0");
  let volDownButton = createButton(volDownButtonPos, "0.1", "0.1", p_voldowncolor || p_buttoncolor, p_iconvoldownurl, {"volume-level": "vvalue: -1"}, TheButRot);
  firescreen.appendChild(volDownButton);

  function addCustomButton(url, text, position) {
      if (url !== "false") {
          let button = createButton(position, "0.2", "0.04", "#000000", null, {"click-url": `url:${url}`});
          let buttonText = document.createElement("a-text");
          buttonText.setAttribute("value", text);
          buttonText.setAttribute("position", "0 0 0.005");
          buttonText.setAttribute("scale", "0.11 0.11 0.11");
          buttonText.setAttribute("color", "#FFFFFF");
          buttonText.setAttribute("align", "center");
          button.appendChild(buttonText);
          firescreen.appendChild(button);
      };
  };

  addCustomButton(p_custombutton01url, p_custombutton01text, "0.68 0.3 0");
  addCustomButton(p_custombutton02url, p_custombutton02text, "0.68 0.25 0");
  addCustomButton(p_custombutton03url, p_custombutton03text, "0.68 -0.3 0");

  document.querySelector("a-scene").appendChild(firescreen);
  setTimeout(() => {
      setupBrowsers();
      setTimeout(() => { keepsoundlevel(); }, 2000);
  }, 4500);

  if (p_handbuttons === "true" && window.firstrunhandcontrols) {
    window.firstrunhandcontrols = false; console.log("FIRESCREEN: Enabling Hand Controls");
    let handControl = new window.handButtonCrap(p_voldowncolor, p_volupcolor, p_mutecolor, p_iconvolupurl, p_iconvoldownurl, p_iconmuteurl, p_buttoncolor); handControl.initialize();
  };
  console.log(`FIRESCREEN: ${p_thisBrowserNumber} screen(s) Enabled`);
};

function computeButtonPosition(basePos, offsetPos) {
    const baseArray = basePos.split(" ").map(Number);
    const offsetArray = offsetPos.split(" ").map(Number);
    return baseArray.map((base, i) => base + offsetArray[i]).join(" ");
};

// Sets the default sound level probably
var volInterval = null;
var soundlevelfirstrun = true;
function keepsoundlevel() {
  var loopCount = 0; const maxLoops = 10;
  if (fireScreenOn && soundlevelfirstrun) {
	console.log("FIRESCREEN: keepsoundlevel loop");
	soundlevelfirstrun = false;
  // Loop to keep sound level set, runs every second
  volInterval = setInterval(function() {
    for (let i = 1; i <= window.NumberofBrowsers; i++) {
			const theBrowser = document.getElementById(`fires-browser${i}`);
			const volume = parseFloat(theBrowser.getAttribute("volumelevel"));
			theBrowser.components["sq-browser"].runActions([ { actionType: "runscript", strparam1:
			`document.querySelectorAll('video, audio').forEach((elem) => elem.volume=${volume});document.querySelector('.html5-video-player').setVolume("${Math.round(volume * 100)});`, }, ]);
		}; loopCount++; if (loopCount >= maxLoops) { clearInterval(volInterval); };
    }, 5000); } else if (!fireScreenOn) { clearInterval(volInterval); };
};

// Set the width and height of the screen(s)
var notalreadysetup = true;
async function setupBrowsers() {
	if (notalreadysetup) {
		notalreadysetup = false;
    for (let i = 1; i <= window.NumberofBrowsers; i++) {
      const browserElement = document.getElementById(`fires-browser${i}`);
      const browserPageWidth = browserElement.getAttribute("pageWidth");
      const browserPageHeight = browserElement.getAttribute("pageHeight");
      browserElement.browser.pageWidth = browserPageWidth; browserElement.browser.pageHeight = browserPageHeight;
      browserElement.transform.WatchProperties([BS.PropertyName.position, BS.PropertyName.eulerAngles]); // Test Watch Properties
      const { rotation } = browserElement.object3D;
      browserElement.transform.eulerAngles = new BS.Vector3(rotation.x, rotation.y, rotation.z);
      console.log(`FIRESCREEN: ${i} Width is: ${browserPageWidth} and Height: ${browserPageHeight}`);
      if (!window.announcerfirstrun) { timenow = Date.now(); }
    };
	};
};

function handleButtonClick(element) {
  const buttonColor = element.getAttribute("color");
  element.setAttribute("color", (buttonColor === "#FFFFFF" ? "#00FF00" : "#FFFFFF"));
  setTimeout(() => {
    element.setAttribute("color", buttonColor);
  }, 100);
}

// Enables Interaction for all the browser windows by HBR
AFRAME.registerComponent("enable-interaction", { init: async function() { await window.AframeInjection.waitFor(this.el, "browser"); this.el.browser.ToggleInteraction(true) } });
    
// Listens for button clicks to open the urls on either Screen by HBR
AFRAME.registerComponent("click-url", {
schema: { url: { type: "string", default: "" }, },
init: function () { this.el.addEventListener("click", () => {
  const TheBrowser = this.el.parentElement; handleButtonClick(this.el);
  TheBrowser.setAttribute("sq-browser", { url: this.data.url, pixelsPerUnit: 1600, mipMaps: 1, mode: "local", });		
});		},		});
		
// Toggle Button for locking and unlocking either screen By Fire with help from HBR
AFRAME.registerComponent("lockbutton", {
init: function () {
  this.el.addEventListener("click", () => {                         
  const TheBrowser = this.el.parentElement;
  const lockToggle = this.el;
  const ColliderScreen = lockToggle.parentElement.children[0];
  let thisbuttoncolor = TheBrowser.getAttribute("button-color");
  const isLockEnabled = ColliderScreen.getAttribute("enableLock") === "true";
  const newColor = isLockEnabled ? (thisbuttoncolor === "#00FF00" ? "#FFFF00" : thisbuttoncolor) : "#00FF00";
  lockToggle.setAttribute("color", newColor);
  ColliderScreen.setAttribute("enableLock", isLockEnabled ? "false" : "true");
});  }, 	});

function updateLockState(state) {
  document.querySelectorAll('.firescreenc').forEach(element => {
    const ColliderScreen = element.children[0];
    if (ColliderScreen.getAttribute("enableLock") === "true") { ColliderScreen.setAttribute("visible", state);
    } else if (ColliderScreen.getAttribute("visible")) { ColliderScreen.setAttribute("visible", false); };
  });
};

// Toggle Button Thing for locking and unlocking either screen By Fire with help from HBR
BS.BanterScene.GetInstance().On("button-pressed", e => { console.log(e.detail); if (e.detail.button === 1) { updateLockState(true); } });

BS.BanterScene.GetInstance().On("button-released", e => { if (e.detail.button === 1) { updateLockState(false); } });

// window.buttonPressCallback = (button) => {        
//   switch (button) {
//     case "RightGrip":
//     case "LeftGrip":
//       updateLockState(true);
//       break;
//     case "RightGripRelease":
//     case "LeftGripRelease":
//       updateLockState(false);
//       break;
//   }
// };

// Toggle Button for Keyboard By Fire with help from HBR
AFRAME.registerComponent("forcekeyboard", {
  init: function () { this.el.addEventListener("click", () => {
    const TheBrowser = this.el.parentElement;
    const isKeyboardActive = this.el.getAttribute("forcekeyboard") === "true";
    const buttonColor = TheBrowser.getAttribute("button-color");
    TheBrowser.browser.ToggleKeyboard(isKeyboardActive ? 0 : 1);
    this.el.setAttribute("forcekeyboard", !isKeyboardActive);
    this.el.setAttribute("color", isKeyboardActive ? "#FFFFFF" : buttonColor);
}); }, });

// Toggle Sound for browser screen By Fire with help from HBR
AFRAME.registerComponent("toggle-mute", {
  init: function () { this.el.addEventListener("click", () => { 
      const browserElement = this.el.parentElement; const muteButton = this.el;
      const isMuted = browserElement.getAttribute("datamuted") === "true";
      const muteColor = browserElement.getAttribute("mute-color");
      const newMutedState = !isMuted;
      const newColor = newMutedState ? (muteColor === "#FF0000" ? "#FFFF00" : "#FF0000") : muteColor;
      muteButton.setAttribute("color", newColor);
      browserElement.setAttribute("datamuted", String(newMutedState));
      browserElement.components["sq-browser"].runActions([{ actionType: "runscript", strparam1: `document.querySelectorAll('video, audio').forEach((elem) => elem.muted = ${newMutedState});` }]);
  })}
});

// Changes Scale of either Screen when button clicked with help from HBR
AFRAME.registerComponent("scale-screen", {
schema: {
  size: { type: "string" },
  avalue: { type: "number" },
},
init: function () { this.el.addEventListener("click", () => {
  const screenScale = this.el.parentElement;
  let { scale } = screenScale.object3D;
  const delta = this.data.size === "grow" ? -this.data.avalue : this.data.avalue;
  let newScaleX = Math.max(0.05, (scale.x + delta).toFixed(2));
  let newScaleY = Math.max(0.05, (scale.y + delta).toFixed(2));
  handleButtonClick(this.el);
  screenScale.setAttribute("scale", `${newScaleX} ${newScaleY} 1`);
});		},		});
		
// Rotate either screen when buttons clicked by HBR
AFRAME.registerComponent("rotate", {
  schema: { axis: { type: "string" }, amount: { type: "number" }, },
  init: function () {
    this.el.addEventListener("click", () => {
      const browserRotation = this.el.parentElement;
      const { x, y, z } = browserRotation.transform.eulerAngles;
      const newRotation = { x, y, z };
      if (this.data.axis === "x") { newRotation.x += this.data.amount;
      } else if (this.data.axis === "y") { newRotation.y += this.data.amount; };
      handleButtonClick(this.el);
      browserRotation.transform.eulerAngles = new BS.Vector3(newRotation.x, newRotation.y, 0);
}); }, });

// Toggle for hiding and showing the rotation buttons By Fire with help from HBR
AFRAME.registerComponent("enablerot", {
init: function () { this.el.addEventListener("click", () => {
  const isVisible = this.el.parentElement.children[7].getAttribute("visible");
  const newColor = isVisible ? "#FFFFFF" : this.el.parentElement.getAttribute("button-color");
  const visibilityState = isVisible ? "false" : "true"; this.el.setAttribute("color", newColor);
  document.querySelectorAll(".tilt").forEach(el => el.setAttribute("visible", visibilityState));
});  }, 	});
		
// Toggle for hiding and showing buttons By Fire with help from HBR
AFRAME.registerComponent("hidebuttons", {
init: function () { this.el.addEventListener("click", () => {
  const isVisible = this.el.parentElement.children[2].getAttribute("visible");
  this.el.setAttribute("color", isVisible ? this.el.parentElement.getAttribute("button-color") : "#FFFFFF");
  const visibility = isVisible ? "false" : "true";
  Array.from(document.getElementsByClassName("buttons")).forEach((el) => {
    el.setAttribute("visible", visibility);
  });
});  }, 	});
		
// Changes Volume of the Screen when button clicked By Fire with help from HBR
AFRAME.registerComponent("volume-level", {
schema: { vvalue: { type: "number" }, },
init: function () { this.el.addEventListener("click", () => {  
  const browserElement = this.el.parentElement;
  let volume = parseFloat(browserElement.getAttribute("volumelevel"));
  const adjustVolume = (volume, delta) => {
    const adjustment = volume < 0.1 ? 0.01 : (volume < 0.5 ? 0.02 : 0.05);
    return Math.max(0, Math.min(1, volume + delta * adjustment));
  };
  volume = Number((this.data.vvalue > 0 ? adjustVolume(volume, 1) : adjustVolume(volume, -1)).toFixed(2));
  let firepercent = (volume * 100).toFixed(0);
  browserElement.components["sq-browser"].runActions([{ actionType: "runscript", strparam1: `document.querySelectorAll('video, audio').forEach((elem) => elem.volume=${volume});document.querySelector('.html5-video-player').setVolume(${firepercent});`,}]);
  browserElement.setAttribute("volumelevel", volume);
  console.log(`FIRESCREEN: Volume Is : ${volume}`);
  handleButtonClick(this.el);
}); }, });
		
// Navigates browser page Backwards/Forward
AFRAME.registerComponent("navigate-browser", {
  schema: { action: { type: "string", default: "goback" } },
  init: function () { this.el.addEventListener("click", () => {
    handleButtonClick(this.el); this.el.parentElement.components['sq-browser'].runActions([{ actionType: this.data.action }]);
}); }, });

function getV3FromStr(strVector3) {
  const [x, y, z] = strVector3.split(" ").map(Number);
  return new BS.Vector3(x,y,z);
};

function getAttrOrDef(pScript, pAttr, pDefault) { return pScript.hasAttribute(pAttr) ? pScript.getAttribute(pAttr) : pDefault; };

// Create screen After Unity load 
var firstbrowserrun = true;
async function firescreenloadstuff() {
	const firescene = BS.BanterScene.GetInstance();
  firescene.On("user-joined", e => { if (e.detail.isLocal) playersuserid = e.detail.uid; });
 // Function to check if a given script is already present
 function isAFrameScriptPresent(scriptUrls) { const scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) { const src = getAttrOrDef(scripts[i], "src", "");
      if (scriptUrls.includes(src)) { console.log(`FIRESCREEN: AFrame ${src.match(/(\d+\.\d+\.\d+)/)[0]} Detected`); return true; };
    } return false;
  };

  // Function to safely append an element if it doesn't exist
  function appendIfNotExists(selector, tagName, parent, id) { let element = document.querySelector(selector);
    if (!element) { console.log(`FIRESCREEN: ${tagName.toUpperCase()} NOT Detected, Adding ${tagName.toUpperCase()}`);
      element = document.createElement(tagName); if (id) element.id = id; parent.appendChild(element);
    } else { console.log(`FIRESCREEN: ${tagName.toUpperCase()} Detected, NOT Adding ${tagName.toUpperCase()}`);
    } return element;
  };

  let firething = document.querySelector("#firething"); // Check if firething exists
  if (!firething) { console.log("FIRESCREEN: Setting up."); // Add firething, If it doesn't exist
    const firetag = document.createElement("firething"); firetag.id = "firething"; document.querySelector("head").appendChild(firetag);

    // A-Frame versions to check
    const aframeVersions = [
      "https://aframe.io/releases/1.6.0/aframe.min.js",
      "https://aframe.io/releases/1.5.0/aframe.min.js",
      "https://aframe.io/releases/1.4.2/aframe.min.js",
      "https://aframe.io/releases/1.4.1/aframe.min.js",
      "https://aframe.io/releases/1.4.0/aframe.min.js",
      "https://aframe.io/releases/1.3.0/aframe.min.js",
      "https://aframe.io/releases/1.2.0/aframe.min.js",
      "https://aframe.io/releases/1.1.0/aframe.min.js"
    ];

    // Check if any A-Frame version is already present
    let aframedetected = isAFrameScriptPresent(aframeVersions);

    // Add A-Frame if not detected
    if (!aframedetected) {
      console.log("FIRESCREEN: AFrame Was NOT Detected, Adding AFrame 1.4.0");
      const aframescript = document.createElement("script");
      aframescript.id = "aframe-script";
      aframescript.setAttribute("src", "https://aframe.io/releases/1.4.0/aframe.min.js");
      document.querySelector("head").appendChild(aframescript);
    };

    // Ensure body exists
    appendIfNotExists("body", "body", document.querySelector("head"));

    // Ensure a-scene exists
    appendIfNotExists("a-scene", "a-scene", document.querySelector("body"));

    console.log("FIRESCREEN: Waiting for Unity-Loaded Event");
  };

  firescene.On("one-shot", e => { console.log(e)
    const data = JSON.parse(e.detail.data);
    const isAdminOrLocalUser = e.detail.fromAdmin || e.detail.fromId === firescene.localUser.uid;
    if (isAdminOrLocalUser) { console.log(isAdminOrLocalUser ? "Current Shot is from Admin" : "Current Shot is from Local User");
      if (data.fireurlv1) setFirePageUrls(data.fireurlv1);
      if (data.firevolume) { const fireVolume = Number(parseFloat(data.firevolume).toFixed(2));
        document.querySelectorAll('.firescreenc').forEach(element => { element.setAttribute("volumelevel", fireVolume);
          element.components["sq-browser"].runActions([
            { actionType: "runscript", strparam1: `document.querySelectorAll('video, audio').forEach(elem => elem.volume=${fireVolume}); document.querySelector('.html5-video-player').setVolume(${(fireVolume * 100).toFixed(0)});` }
          ]);
        });
      };
    } else if (e.detail.fromId === "f67ed8a5ca07764685a64c7fef073ab9") {
      if (data.fireurlv1) setFirePageUrls(data.fireurlv1);
      if (data.firevolume) { const fireVolume = Number(parseFloat(data.firevolume).toFixed(2));
        document.querySelectorAll('.firescreenc').forEach(element => { element.setAttribute("volumelevel", fireVolume);
          element.components["sq-browser"].runActions([
            { actionType: "runscript", strparam1: `document.querySelectorAll('video, audio').forEach(elem => elem.volume=${fireVolume}); document.querySelector('.html5-video-player').setVolume(${(fireVolume * 100).toFixed(0)});` }
          ]);
        });
      };
    };
  });

  const waitForUnity = async () => { while (!firescene.unityLoaded) { await new Promise(resolve => setTimeout(resolve, 500)); } };
  await waitForUnity(); console.log("FIRESCREEN: Unity-Loaded");  setTimeout(() => { enableFireScreen(); }, 1000);
};

if(window.isBanter) { 
  firescreenloadstuff();
}
var handbuttonmutestate = false;
var handscene = BS.BanterScene.GetInstance();

(function() {
  class handButtonCrap{
    constructor(p_voldowncolor, p_volupcolor, p_mutecolor, p_iconvolupurl, p_iconvoldownurl, p_iconmuteurl, p_buttoncolor) {
      this.volDownColor = p_voldowncolor;
      this.volUpColor = p_volupcolor;
      this.muteColor = p_mutecolor;
      this.buttoncolor = p_buttoncolor;
      this.IconVolUpUrl = p_iconvolupurl;
      this.IconVolDownUrl = p_iconvoldownurl;
      this.IconMuteUrl = p_iconmuteurl;

      this.playerislocked = false;
      console.log("HAND-CONTROLS: Delay Loading to avoid error");
      
      handscene.On("user-joined", e => {
        if (e.detail.isLocal && window.handControlsDisabled) { console.log("HAND-CONTROLS: Local User Joined");
          window.handControlsDisabled = false; playersuserid = e.detail.uid; this.setupHandControls(); };
      });

      handscene.On("user-left", e => { if (e.detail.isLocal) { window.handControlsDisabled = true;
          console.log("HAND-CONTROLS: Local User Left, Resetting variable"); };
      });

      if (playersuserid != false && handControlsDisabled) { console.log("HAND-CONTROLS: Enabling");
        handControlsDisabled = false; this.setupHandControls();
      } else { console.log("HAND-CONTROLS: Too Early, Waiting."); }
    };

    async initialize() { await this.waitForUserId(); if (window.handControlsDisabled) { window.handControlsDisabled = false; this.setupHandControls(); } }

    async waitForUserId() { while (!handscene.localUser || handscene.localUser.uid === undefined) { await new Promise(resolve => setTimeout(resolve, 200)); } }

    toggleMute() {  handbuttonmutestate = !handbuttonmutestate;
      this.runActionOnElements('.firescreenc', handbuttonmutestate);
      this.updateButtonColors('.firemutebutc', handbuttonmutestate);
      console.log(handbuttonmutestate);
      const fireMuteBut = document.getElementById("firemutebut");
      fireMuteBut.setAttribute("color", handbuttonmutestate ? "#FF0000" : this.muteColor);
    };

    runActionOnElements(selector, state) { document.querySelectorAll(selector).forEach(element => {
        element.components["sq-browser"].runActions([ { actionType: "runscript", strparam1: `document.querySelectorAll('video, audio').forEach(elem => elem.muted=${state});` } ]);
      });
    };

    updateButtonColors(selector, isActive) {
      document.querySelectorAll(selector).forEach(button => { const TheBrowser = button.parentElement;
        const thisButtonColor = TheBrowser.getAttribute("mute-color") || "#FFFFFF";
        button.setAttribute("color", isActive ? (thisButtonColor === "#FF0000" ? "#FFFF00" : "#FF0000") : thisButtonColor);
      });
    };

    adjustVolume(change) {
      document.querySelectorAll('.firescreenc').forEach((element, index) => {
        let volume = Number(parseFloat(element.getAttribute("volumelevel"))); let adjustment;
        if (volume < 0.1) { adjustment = 0.01; // Tiny adjustment for low volume
        } else if (volume < 0.5) { adjustment = 0.03; // Medium adjustment for medium volume
        } else { adjustment = 0.05; } // Big adjustment for high volume
        volume = Math.min(Math.max(0, (volume + (change * adjustment)).toFixed(2)), 1);
        this.updateVolume(element, volume, index + 1);
      });
    };

    updateVolume(element, volume, index) {
      const firePercent = Math.round(volume * 100);
      element.setAttribute("volumelevel", volume);
      console.log(`HAND-CONTROLS: FireScreen ${index}'s Volume is: ${volume}`);
      element.components["sq-browser"].runActions([
        { actionType: "runscript", strparam1: `document.querySelectorAll('video, audio').forEach(elem => elem.volume=${volume});` },
        { actionType: "runscript", strparam1: `document.querySelector('.html5-video-player').setVolume(${firePercent});` }
      ]);
    };

    volumeControlUp() { this.adjustVolume(1); this.flashButton("firevolupbut"); };

    volumeControlDown() { this.adjustVolume(-1); this.flashButton("firevoldownbut"); };

    flashButton(buttonId) {
      const button = document.getElementById(buttonId);
      const originalColor = button.getAttribute("color");
      button.setAttribute("color", "#FFFFFF");
      setTimeout(() => button.setAttribute("color", originalColor), 100);
    };

    lockPlayer() {
      const fireLockBut = document.getElementById("firelockpbut");
      this.playerislocked = !this.playerislocked;
      if (this.playerislocked) lockPlayer();
      else unlockPlayer();
      fireLockBut.setAttribute("color", this.playerislocked ? "#FF0000" : "#FFFF00");
    };

    navigateHome() {
      document.querySelectorAll('.firescreenc').forEach(element => {
        const homePage = element.getAttribute("sq-browser");
        element.setAttribute("sq-browser", homePage);
      });
      this.flashButton("firehomepbut");
    };

    setupHandControls() {
      if (!window.handControlsDisabled) {
        console.log("HAND-CONTROLS: Setting up Hand Controls");
      // This was a great innovation by HBR, who wanted Skizot to also get credit for the original idea. 
        const handControlsContainer = document.createElement("a-entity");
        handControlsContainer.setAttribute("scale", "0.1 0.1 0.1");
        handControlsContainer.setAttribute("rotation", "70 180 10");
        handControlsContainer.setAttribute("position", "0.04 0.006 -0.010");
        handControlsContainer.setAttribute("sq-lefthand", `whoToShow: ${playersuserid || handscene.localUser.uid}`);

        const buttons = [
          { image: this.IconVolUpUrl, position: "-1 0.2 -0.4", color: this.volUpColor, id: "firevolupbut", callback: this.volumeControlUp.bind(this) },
          { image: this.IconVolDownUrl, position: "-1 0.2 0", color: this.volDownColor, id: "firevoldownbut", callback: this.volumeControlDown.bind(this) },
          { image: "https://firer.at/files/lock.png", position: "-1 -0.4 0", color: this.buttoncolor, id: "firelockpbut", callback: this.lockPlayer.bind(this) },
          { image: "https://firer.at/files/Home.png", position: "-1 -0.4 -0.4", color: this.buttoncolor, id: "firehomepbut", callback: this.navigateHome.bind(this) },
          { image: this.IconMuteUrl, position: "-1 0.2 0.4", color: this.muteColor, id: "firemutebut", callback: this.toggleMute.bind(this) }
        ];

        buttons.forEach(({ image, position, color, id, callback }) => {
          const button = this.createButton(image, position, color, id, callback);
          handControlsContainer.appendChild(button);
        });
        document.querySelector("a-scene").appendChild(handControlsContainer);
      } else {
        console.log("HAND-CONTROLS: Already set up, skipping re-initialization.");
      };
    };

    createButton(image, position, color, id, callback) {
      const button = document.createElement("a-plane");
      button.setAttribute("sq-interactable", "");
      button.setAttribute("sq-collider", "");
      button.setAttribute("scale", "0.4 0.4 0.4");
      button.setAttribute("rotation", "0 -90 180");
      button.setAttribute("src", image);
      button.setAttribute("color", color);
      button.setAttribute("transparent", true);
      button.setAttribute("position", position);
      button.setAttribute("id", id);
      button.addEventListener("click", callback);
      return button;
    };
  };    
  window.handButtonCrap = handButtonCrap;
})();

function setFirePageUrls(thedata) {
  document.querySelectorAll('.firescreenc').forEach(firescreenc => {
    firescreenc.setAttribute("sq-browser", { url: thedata, pixelsPerUnit: 1200, mipMaps: 0, mode: "local" });
  });
};