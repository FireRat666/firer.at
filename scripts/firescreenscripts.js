// SDK2 Based FireScreen, V0.9 Beta 1.0.1 -- Thank you Everyone who helped make this possible, HBR, Vanquish3r, DedZed, Sebek, Skizot, Shane and FireRat, And thank you to everyone who helped test it
// FireScreen Tablet for Screen Casts / live streams with volume controls or a portable browser for any website.
var thisScriptLocation = `https://51.firer.at/scripts/`; // CHANGE THIS URL IF MAKING A COPY OF THIS SCRIPT AND THE ONES BELOW
var fireScriptName = `${thisScriptLocation}firescreenv2.js`;
var announcerscripturlv2 = `${thisScriptLocation}announcer.js`;
var fireScreen2On = false;
var playersuseridv2 = null;
var customButShader = 'Unlit/Diffuse';
var defaulTransparent = 'Unlit/DiffuseTransparent';
var whiteColour = new BS.Vector4(1,1,1,1);
var customButtonSize = new BS.Vector3(0.2,0.04,1);
var textPlaneColour = new BS.Vector4(0.1,0.1,0.1,1);
var fireScreenSetup = false;
// create a reference to the banter scene
var firescenev2 = BS.BanterScene.GetInstance();
// if (typeof window.theNumberofBrowsers === 'undefined') { window.theNumberofBrowsers = 0; } // Initialize only once 


(function() {
  const initialValues = {
    firstrunhandcontrols: true,
    handControlsDisabled: true,
    theNumberofBrowsers: 0,
  };

  for (const [key, value] of Object.entries(initialValues)) {
    if (typeof window[key] === 'undefined') { window[key] = value; } // Initialize Variables only once 
  }
})();

// This Function adds geometry to the given game Object
async function createGeometry(thingy1, geomtype, options = {}) {
  const defaultOptions = {
    thewidth: 1, theheight: 1, depth: 1, widthSegments: 1, heightSegments: 1, depthSegments: 1, radius: 1, segments: 24, thetaStart: 0, thetaLength: Math.PI * 2, phiStart: 0, phiLength: Math.PI * 2, radialSegments: 8, openEnded: false, radiusTop: 1, radiusBottom: 1, innerRadius: 0.3, outerRadius: 1, thetaSegments: 24, phiSegments: 8, tube: 0.4, tubularSegments: 16, arc: Math.PI * 2, p: 2, q: 3, stacks: 5, slices: 5, detail: 0, parametricPoints: ""
  };
  const config = { ...defaultOptions, ...options };
  const geometry = await thingy1.AddComponent(new BS.BanterGeometry( 
    geomtype, 0, config.thewidth, config.theheight, config.depth, config.widthSegments, config.heightSegments, config.depthSegments, config.radius, config.segments, config.thetaStart, config.thetaLength, config.phiStart, config.phiLength, config.radialSegments, config.openEnded, config.radiusTop, config.radiusBottom, config.innerRadius, config.outerRadius, config.thetaSegments, config.phiSegments, config.tube, config.tubularSegments, config.arc, config.p, config.q, config.stacks, config.slices, config.detail, config.parametricPoints
  ));
  return geometry;
};

async function createMaterial(objectThing, options = {}) {
  const shaderName = options.shaderName || 'Sprites/Diffuse';
  const texture = options.texture || null;
  const color = options.color || whiteColour;
  const side = options.side || 0;
  const generateMipMaps = options.generateMipMaps || true;
  return objectThing.AddComponent(new BS.BanterMaterial(shaderName, texture, color, side, generateMipMaps));
};

function updateButtonColor(buttonObject, revertColour) {
  let material = buttonObject.GetComponent(BS.ComponentType.BanterMaterial);
  material.color = new BS.Vector4(1,1,1,0.7); setTimeout(() => { material.color = revertColour; }, 100);
};
  
function adjustScale(geometrytransform, direction) {
  let scaleX = Number(parseFloat(geometrytransform.localScale.x).toFixed(3));
  let scaleY = Number(parseFloat(geometrytransform.localScale.y).toFixed(3));
  let adjustment;
  if (scaleX < 0.5) { adjustment = 0.025;
  } else if (scaleX < 2) { adjustment = 0.05;
  } else if (scaleX < 5) { adjustment = 0.1;
  } else { adjustment = 0.5; }
  if (direction === "shrink") { adjustment = -adjustment;
    if (scaleX + adjustment <= 0) { scaleX = 0.025; scaleY = 0.025; } }
  scaleX += adjustment; scaleY += adjustment; geometrytransform.localScale = new BS.Vector3(scaleX, scaleY, 1);
  return adjustment;
};

async function createCustomButton(name, firebrowser, parentObject, buttonObjects, position, text, textposition, url, clickHandler) {
  const buttonObject = await createUIButton(name, null, position, textPlaneColour, parentObject, false, "false", 1, 1, customButShader, customButtonSize);
  buttonObjects.push(buttonObject); let material = buttonObject.GetComponent(BS.ComponentType.BanterMaterial);
  const textObject = await new BS.GameObject(`${name}Text${window.theNumberofBrowsers}`).Async();
  const banterText = await textObject.AddComponent(new BS.BanterText(text, whiteColour, "Center", "Center", 0.20, true, true, new BS.Vector2(2,1)));
  const textTransform = await textObject.AddComponent(new BS.Transform());
  textTransform.localPosition = textposition; await textObject.SetParent(parentObject, false);
  buttonObjects.push(textObject);
  buttonObject.On('click', () => { console.log(`CLICKED: ${name}`);
      firebrowser.url = url; material.color = new BS.Vector4(0.3,0.3,0.3,1);
      setTimeout(() => { material.color = textPlaneColour; }, 100); if (clickHandler) clickHandler();
  });
};

async function createUIButton(name, thetexture, position, thecolor, thisparent, clickHandler = false, rotation = false, width = 0.1, height = 0.1, theShader = defaulTransparent, localScale = new BS.Vector3(1, 1, 1)) {
  const buttonObject = await new BS.GameObject(name).Async();
  const buttonGeometry = await createGeometry(buttonObject, BS.GeometryType.PlaneGeometry, { thewidth: width, theheight: height });
  const buttonCollider = await buttonObject.AddComponent(new BS.BoxCollider(true, new BS.Vector3(0,0,0), new BS.Vector3(width, height, 0.01)));
  const buttonMaterial = await createMaterial(buttonObject, { shaderName: theShader, texture: thetexture, color: thecolor });
  const buttonTransform = await buttonObject.AddComponent(new BS.Transform());
  buttonTransform.position = position; buttonTransform.localScale = localScale;
  rotation ? buttonTransform.localEulerAngles = rotation : rotation; buttonObject.SetLayer(5); // UI Layer
  await buttonObject.SetParent(thisparent, false);
  if (clickHandler) {
    createButtonAction(buttonObject, clickHandler);
  }; return buttonObject;
};

function adjustVolume(firebrowser, change) { // Pass -1 to decrease the volume Pass 1 to increase the volume
  let firevolume = firebrowser.volumeLevel;
  let currentVolume = Number(firevolume); let adjustment;
  if (currentVolume < 0.1) { adjustment = 0.01; // Tiny adjustment for low volume
  } else if (currentVolume < 0.5) { adjustment = 0.03; // Medium adjustment for medium volume
  } else { adjustment = 0.05; } // Big adjustment for high volume
  firevolume = currentVolume + (change * adjustment);
  firevolume = Math.max(0, Math.min(firevolume, 1)).toFixed(2);
  let firepercent = (firevolume * 100).toFixed(0);
  firebrowser.volumeLevel = firevolume;
  let tempvolumeLevel = Math.max(0, Math.min(1, firevolume)).toFixed(1);
  runBrowserActions(firebrowser, `
    (function() { document.querySelectorAll('video, audio').forEach(el => {
      if ('volume' in el) { try { el.volume = ${tempvolumeLevel}; console.log('[Banter Volume Injection] HTML5 volume set for element: ', el.id || el.src); }
          catch (e) {  console.error("[Banter Volume Injection] HTML5 volume error for element:", el.id || el.src, e.message, e.stack); }
    } }); })();
  `);
  runBrowserActions(firebrowser, `typeof player !== 'undefined' && player.setVolume(${firepercent});
    document.querySelectorAll('video, audio').forEach((elem) => elem.volume=${firevolume}); 
    document.querySelector('.html5-video-player') ? document.querySelector('.html5-video-player').setVolume(${firepercent}) : null;`);
    // if (change !== 0 && window.videoPlayerCore && typeof window.videoPlayerCore.setVolume === 'function') { // Translate change: use 1 for increase, and 0 for decrease.
    //   let volCommand = (change === 1) ? 1 : 0; window.videoPlayerCore.setVolume(volCommand);
    // };
  console.log(`FIRESCREEN2: Volume is: ${firevolume}`);
};

function toggleButtonVisibility(defaultobjects, customButtonObjects, visible, exceptions = []) {
  defaultobjects.forEach(button => { if (!exceptions.includes(button.name)) { button.SetActive(visible); } });
  customButtonObjects.forEach(button => { if (button && !exceptions.includes(button.name)) { button.SetActive(visible); } });
}

function runBrowserActions(firebrowser, script) {
  firebrowser.RunActions(JSON.stringify({"actions": [{ "actionType": "runscript","strparam1": script }]}));
};

function createButtonAction(buttonObject, clickHandler) {
  buttonObject.On('click', (e) => { clickHandler(e); });
};

function setupfirescreen2() {
  const allScriptTags = document.getElementsByTagName('script');
  // console.log("FIRESCREEN2: All script tags:", Array.from(allScriptTags).map(s => s.src));
  const allscripts = document.querySelectorAll(`script[src^='${fireScriptName}']`);
  console.log(`FIRESCREEN2: Found ${allscripts.length} matching scripts`);
  allscripts.forEach((script, index) => { if (script.dataset.processed) { return; }; 
    window.theNumberofBrowsers++; console.log(`FIRESCREEN2: Loading browser ${window.theNumberofBrowsers}`); script.dataset.processed = 'true';const thisBrowserNumber = window.theNumberofBrowsers;
    const defaultParams = { position: "0 2 0", rotation: "0 0 0", scale: "1 1 1", castmode: "false", "lock-position": "false", "screen-position": "0 0 -0.02", "screen-rotation": "0 0 0", "screen-scale": "1 1 1", volumelevel: "0.25",
      website: "https://firer.at/pages/games.html", mipmaps: "1", pixelsperunit: "1200", width: "1024", height: "576",
      backdrop: "true", "hand-controls": "false", "disable-interaction": "false", "disable-rotation": false, announce: "false", "announce-420": "false", "announce-events": "undefined",
      "button-color": "0 1 0 1", "backdrop-color": "0 0 0 0.9", "volup-color": "0 1 0 1", "voldown-color": "1 1 0 1", "mute-color": "1 1 1 1", "space-sync": "false",
      "icon-mute-url": "https://firer.at/files/VolumeMute.png", "icon-volup-url": "https://firer.at/files/VolumeHigh.png",
      "icon-voldown-url": "https://firer.at/files/VolumeLow.png", "icon-direction-url": "https://firer.at/files/Arrow.png",
      "custom-button01-url": "false", "custom-button01-text": "Custom Button 01",
      "custom-button02-url": "false", "custom-button02-text": "Custom Button 02",
      "custom-button03-url": "false", "custom-button03-text": "Custom Button 03",
      "custom-button04-url": "false", "custom-button04-text": "Custom Button 04"
    };

    const numberAttributes = { position: getV3FromStrv2, rotation: getV3FromStrv2, scale: getV3FromStrv2, "screen-position": getV3FromStrv2, "screen-rotation": getV3FromStrv2, "screen-scale": getV3FromStrv2, "button-color": getV4FromStr, "backdrop-color": getV4FromStr, "volup-color": getV4FromStr, "voldown-color": getV4FromStr, "mute-color": getV4FromStr };
    // Function to get or convert attribute
    const getParam = (key) => { const attr = script.getAttribute(key);
      const value = attr !== null ? attr : defaultParams[key];
      return numberAttributes[key] ? numberAttributes[key](value) : value; };

    const params = {}; Object.keys(defaultParams).forEach(key => { params[key] = getParam(key); });
    const {
      position, rotation, scale, castmode, "lock-position": lockPosition, "screen-position": screenPosition, "screen-rotation": screenRotation, "screen-scale": screenScale, volumelevel, mipmaps, pixelsperunit, backdrop, website, "button-color": buttonColor, announce, "announce-420": announce420, "backdrop-color": backdropColor, "icon-mute-url": iconMuteUrl, "icon-volup-url": iconVolUpUrl, "icon-voldown-url": iconVolDownUrl, "icon-direction-url": iconDirectionUrl, "volup-color": volUpColor, "voldown-color": volDownColor, "mute-color": muteColor, "disable-interaction": disableInteraction, "disable-rotation": disableRotation, "space-sync": spaceSync, "hand-controls": handControls, width, height, "announce-events": announceEvents, "custom-button01-url": customButton01Url, "custom-button01-text": customButton01Text, "custom-button02-url": customButton02Url, "custom-button02-text": customButton02Text, "custom-button03-url": customButton03Url, "custom-button03-text": customButton03Text, "custom-button04-url": customButton04Url, "custom-button04-text": customButton04Text
    } = params;

    sdk2tests(position, rotation, scale, castmode, lockPosition, screenPosition, screenRotation, screenScale, volumelevel, mipmaps, pixelsperunit, backdrop, website, buttonColor, announce, announce420,
      backdropColor, iconMuteUrl, iconVolUpUrl, iconVolDownUrl, iconDirectionUrl, volUpColor, volDownColor, muteColor,
      disableInteraction, disableRotation, spaceSync, handControls, width, height, announceEvents, thisBrowserNumber, customButton01Url, customButton01Text,
      customButton02Url, customButton02Text, customButton03Url, customButton03Text, customButton04Url, customButton04Text);
    });
};

async function sdk2tests(p_pos, p_rot, p_sca, p_castmode, p_lockposition, p_screenposition, p_screenrotation, p_screenscale, p_volume, p_mipmaps, p_pixelsperunit, p_backdrop, p_website, p_buttoncolor, p_announce, p_announce420, p_backdropcolor, p_iconmuteurl, p_iconvolupurl, p_iconvoldownurl, p_icondirectionurl, p_volupcolor, p_voldowncolor, p_mutecolor, p_disableinteraction, p_disableRotation, p_spacesync, p_handbuttons, p_width, p_height, p_announceevents, p_thisBrowserNumber, p_custombuttonurl01, p_custombutton01text, p_custombuttonurl02, p_custombutton02text, p_custombuttonurl03, p_custombutton03text, p_custombuttonurl04, p_custombutton04text) {
  fireScreen2On = true;
  let keyboardstate = false;
  let playerislockedv2 = false;
  let customButtonObjects = [];
  const screenObject = await new BS.GameObject(`MyBrowser${p_thisBrowserNumber}`).Async();
  console.log(`FIRESCREEN2: Width:${p_width}, Height:${p_height}, Number:${p_thisBrowserNumber}, URL:${p_website}`);
  let firebrowser = await screenObject.AddComponent(new BS.BanterBrowser(p_website, p_mipmaps, p_pixelsperunit, p_width, p_height, null));
  firebrowser.homePage = p_website; // Set variable for default Home Page for later use
  firebrowser.volumeLevel = p_volume; // Set variable for Volume Level for later use
  firebrowser.muteState = false; // Set variable for Mute State for later use
  let isbillboarded;
  p_disableRotation ? isbillboarded = false : isbillboarded = true;
  if (p_disableinteraction === "false") { firebrowser.ToggleInteraction(true); }

  const geometryObject = await new BS.GameObject(`MainParentObject${p_thisBrowserNumber}`).Async();
  const geometry = await createGeometry(geometryObject, BS.GeometryType.PlaneGeometry, { thewidth: 1.09, theheight: 0.64 });
  // geometry Transform Stuff
  const geometrytransform = await geometryObject.AddComponent(new BS.Transform());
  geometrytransform.position = p_pos; geometrytransform.eulerAngles = p_rot;
  const size = new BS.Vector3(1.09,0.64,0.01);
  const boxCollider = await geometryObject.AddComponent(new BS.BoxCollider(false, new BS.Vector3(0,0,0), size));
  await geometryObject.SetLayer(20);
  const firerigidBody = await geometryObject.AddComponent(new BS.BanterRigidbody(1, 10, 10, true, false, new BS.Vector3(0,0,0), 0, false, false, false, false, false, false, new BS.Vector3(0,0,0), new BS.Vector3(0,0,0)));

  if (p_backdrop !== "true") { p_backdropcolor = new BS.Vector4(0,0,0,0); }; // If Backdrop is disabled, Hide it
  const material = await createMaterial(geometryObject, { color: p_backdropcolor });
  // firebrowser Transform Stuff
  const browsertransform = await screenObject.AddComponent(new BS.Transform());
  browsertransform.position = p_screenposition; browsertransform.localScale = p_screenscale; browsertransform.eulerAngles = p_screenrotation;
  await screenObject.SetParent(geometryObject, false); // Make the screen a child of the Main Geometry Object
  const dynamicFriction = 100; const staticFriction = 100;  // ADD FRICTION
  const physicMaterial = await geometryObject.AddComponent(new BS.BanterPhysicMaterial(dynamicFriction, staticFriction));

  let TButPos = 0.38; let LButPos = -0.6; let RButPos = 0.6;
  if (Number(p_height) === 720) {TButPos += 0.07; LButPos += -0.14; RButPos += 0.14;} else if (Number(p_height) === 1080) {TButPos += 0.23; LButPos += -0.45; RButPos += 0.45;};

  let BUTTON_CONFIGS = { home: { icon: "https://firer.at/files/Home.png", position: new BS.Vector3(-0.2,TButPos,0), color: p_buttoncolor,
    clickHandler: () => { console.log("Home Clicked!"); firebrowser.url = firebrowser.homePage; // `${p_website}?${Math.floor(Math.random() * 1000) + 1}`
      updateButtonColor(uiButtons.home, p_buttoncolor); }
    }, info: { icon: "https://firer.at/files/Info.png", position: new BS.Vector3(LButPos,0.28,0), color: p_buttoncolor,
      clickHandler: () => { console.log("Info Clicked!"); firebrowser.url = "https://firer.at/pages/Info.html";
      updateButtonColor(uiButtons.info, p_buttoncolor); }
    }, google: { icon: "https://firer.at/files/Google.png", position: new BS.Vector3(LButPos,0.16,0), color: whiteColour,
      clickHandler: () => { console.log("Google Clicked!"); firebrowser.url = "https://google.com/";
      updateButtonColor(uiButtons.google, whiteColour); }
    }, keyboard: { icon: "https://firer.at/files/Keyboard.png", position: new BS.Vector3(LButPos,-0.15,0), color: whiteColour,
      clickHandler: () => { console.log("Keyboard Clicked!"); keyboardstate = !keyboardstate; firebrowser.ToggleKeyboard(keyboardstate ? 1 : 0);
        uiButtons.keyboard.GetComponent(BS.ComponentType.BanterMaterial).color = keyboardstate ? p_buttoncolor : whiteColour; }
    }, mute: { icon: p_iconmuteurl, position: new BS.Vector3(0.167,TButPos,0), color: p_mutecolor,
      clickHandler: () => { console.log("Mute Clicked!"); firebrowser.muteState = !firebrowser.muteState;
      runBrowserActions(firebrowser, `document.querySelectorAll('video, audio').forEach((elem) => elem.muted=${firebrowser.muteState});`);
      uiButtons.mute.GetComponent(BS.ComponentType.BanterMaterial).color = firebrowser.muteState ? new BS.Vector4(1,0,0,1) : (p_mutecolor ? p_mutecolor : p_buttoncolor); }
    }, volDown: { icon: p_iconvoldownurl, position: new BS.Vector3(0.334,TButPos,0), color: p_voldowncolor,
      clickHandler: () => { console.log("Volume Down Clicked!"); adjustVolume(firebrowser, -1);
      updateButtonColor(uiButtons.volDown, p_voldowncolor ? p_voldowncolor : p_buttoncolor); }
    }, pageBack: { icon: p_icondirectionurl, position: new BS.Vector3(-0.5,TButPos,0), color: p_buttoncolor,
      clickHandler: () => { console.log("Back Clicked!"); firebrowser.RunActions(JSON.stringify({"actions":[{"actionType": "goback"}]}));
      updateButtonColor(uiButtons.pageBack, p_buttoncolor); }
    }, sizeGrow: { icon: "https://firer.at/files/expand.png", position: new BS.Vector3(RButPos,0.06,0), color: p_buttoncolor,
      clickHandler: () => { console.log("Grow Clicked!"); adjustScale(geometrytransform, "grow");
      updateButtonColor(uiButtons.sizeGrow, p_buttoncolor); }
    }, sizeShrink: { icon: "https://firer.at/files/shrink.png", position: new BS.Vector3(RButPos,-0.06,0), color: p_buttoncolor,
      clickHandler: () => { console.log("Shrink Clicked!"); adjustScale(geometrytransform, "shrink");
      updateButtonColor(uiButtons.sizeShrink, p_buttoncolor); }
    }, pageForward: { icon: p_icondirectionurl, position: new BS.Vector3(-0.38,TButPos,0), color: p_buttoncolor,
      clickHandler: () => { console.log("Forward Clicked!"); firebrowser.RunActions(JSON.stringify({"actions":[{"actionType": "goforward"}]}));
      updateButtonColor(uiButtons.pageForward, p_buttoncolor); }, rotation: new BS.Vector3(0,0,180)
    }, volUp: { icon: p_iconvolupurl, position: new BS.Vector3(0.495,TButPos,0), color: p_volupcolor,
      clickHandler: () => { console.log("Volume Up Clicked!"); adjustVolume(firebrowser, 1);
      updateButtonColor(uiButtons.volUp, p_volupcolor ? p_volupcolor : p_buttoncolor); }
    }, billboard: { icon: "https://firer.at/files/Rot.png", position: new BS.Vector3(LButPos,-0.3,0), color: isbillboarded ? p_buttoncolor : whiteColour,
      clickHandler: () => {isbillboarded = !isbillboarded; console.log("Billboard Clicked!");
        firesbillBoard.enableXAxis = isbillboarded; firesbillBoard.enableYAxis = isbillboarded;
        uiButtons.billboard.GetComponent(BS.ComponentType.BanterMaterial).color = isbillboarded ? p_buttoncolor : whiteColour; }
    }
  };

  var buttonsObjectsThing = [];
  
  async function createUIButtons(parent) {
    buttonsObjectsThing = {};
    for (const [name, config] of Object.entries(BUTTON_CONFIGS)) {
      buttonsObjectsThing[name] = await createUIButton( `FireButton_${name}`,
        config.icon, config.position, config.color, parent, config.clickHandler, config.rotation);
    } return buttonsObjectsThing;
  };
  let uiButtons = await createUIButtons(geometryObject);

  let buttonsvisible = true;
  const hideShowObject = await createUIButton("FireButton_hideShow", "https://firer.at/files/Eye.png", new BS.Vector3(LButPos,0,0), p_buttoncolor, geometryObject);
  createButtonAction(hideShowObject, () => { console.log("HideShow Clicked!");buttonsvisible = !buttonsvisible; toggleButtonVisibility(Object.values(uiButtons), customButtonObjects, buttonsvisible ? 1 : 0)
    hideShowObject.GetComponent(BS.ComponentType.BanterMaterial).color = buttonsvisible ? p_buttoncolor : new BS.Vector4(1, 1, 1, 0.5);
  });
  
  let RCButPos = 0.68; let RCTexPos = 1.59;
  if (Number(p_height) === 720) {RCButPos += 0.14; RCTexPos += 0.14;} else if (Number(p_height) === 1080) {RCButPos += 0.4; RCTexPos += 0.4;};

  if (p_custombuttonurl01 !== "false") {  console.log(`${p_custombutton01text} : ${p_custombuttonurl01}`);
    await createCustomButton("CustomButton01", firebrowser, geometryObject, customButtonObjects, new BS.Vector3(RCButPos,0.30,0), p_custombutton01text, new BS.Vector3(RCTexPos,-0.188,-0.005), p_custombuttonurl01, () => {});};
  if (p_custombuttonurl02 !== "false") { console.log(`${p_custombutton02text} : ${p_custombuttonurl02}`);
    await createCustomButton("CustomButton02", firebrowser, geometryObject, customButtonObjects, new BS.Vector3(RCButPos,0.25,0), p_custombutton02text, new BS.Vector3(RCTexPos,-0.237,-0.005), p_custombuttonurl02, () => {});};
  if (p_custombuttonurl03 !== "false") { console.log(`${p_custombutton03text} : ${p_custombuttonurl03}`);
    await createCustomButton("CustomButton03", firebrowser, geometryObject, customButtonObjects, new BS.Vector3(RCButPos,0.20,0), p_custombutton03text, new BS.Vector3(RCTexPos,-0.287,-0.005), p_custombuttonurl03, () => {});};
  if (p_custombuttonurl04 !== "false") { console.log(`${p_custombutton04text} : ${p_custombuttonurl04}`);
    await createCustomButton("CustomButton04", firebrowser, geometryObject, customButtonObjects, new BS.Vector3(RCButPos,0.15,0), p_custombutton04text, new BS.Vector3(RCTexPos,-0.336,-0.005), p_custombuttonurl04, () => {});};

  if (p_castmode === "true") {
    const alwaysVisibleButtons = ["FireButton_home", "FireButton_volUp", "FireButton_volDown", "FireButton_mute", "FireButton_pageBack", "FireButton_pageForward"];
    toggleButtonVisibility(Object.values(uiButtons), customButtonObjects, 0, alwaysVisibleButtons); hideShowObject.SetActive(0);
  };

  const firesbillBoard = await geometryObject.AddComponent(new BS.BanterBillboard(0, isbillboarded, isbillboarded, true));  // Bill Board the geometryObject
  geometrytransform.localScale = p_sca; // SET THE SCALE FOR THE SCREEN
  firerigidBody.gameObject.On('grab', () => {console.log("GRABBED!"); if (p_lockposition !== "true") {console.log("Not locked!"); firerigidBody.isKinematic = false; }});  // When user Grabs the Browser, Make it moveable
  firerigidBody.gameObject.On('drop', () => {console.log("DROPPED!"); firerigidBody.isKinematic = true; }); // When user Drops the Browser, Lock it in place

  firescenev2.On("one-shot", async e => { console.log(e.detail);
    const data = JSON.parse(e.detail.data); const isAdmin = e.detail.fromAdmin;
    if (isAdmin || e.detail.fromId === "f67ed8a5ca07764685a64c7fef073ab9") {console.log(isAdmin ? "Current Shot is from Admin" : "Current Shot is from Target ID");
      if (data.fireurl) firebrowser.url = data.fireurl;
      if (data.firevolume) { const fireVolume = Number(parseFloat(data.firevolume).toFixed(2)); const firePercent = (fireVolume * 100).toFixed(0);
        runBrowserActions(firebrowser, `document.querySelectorAll('video, audio').forEach(elem => elem.volume = ${fireVolume});
          document.querySelector('.html5-video-player') ? document.querySelector('.html5-video-player').setVolume(${firePercent}) : null;`);};
      if (data.browseraction) { runBrowserActions(firebrowser, data.browseraction); console.log(data.browseraction); };
      if (data.spaceaction) { console.log(data.spaceaction); new Function(data.spaceaction)(); };
      if (data.gohome) { console.log(data.gohome); firebrowser.url = firebrowser.homePage; };
      if (data.sethome1) { console.log(data.sethome1);
        let firebrowser1 = await BS.BanterScene.GetInstance().Find(`MyBrowser1`);
        if (firebrowser1) {
          let thebrowser1 = firebrowser1.GetComponent(BS.ComponentType.BanterBrowser);
          firebrowser1.homePage = data.sethome1; firebrowser1.url = data.sethome1;
        };
      };
      if (data.firevolumeup) { console.log(data.firevolumeup); adjustForAll("adjustVolume", 1); youtubePlayerControl(1); };
      if (data.firevolumedown) { console.log(data.firevolumedown); adjustForAll("adjustVolume", -1); youtubePlayerControl(0); };
      if (data.firemutetoggle) { console.log(data.firemutetoggle); adjustForAll("toggleMute"); youtubePlayerControl(null, "mute"); };
    } else { console.log("Current Shot From Admin Is False");
      console.log(e.detail.fromId);
    };
  });
  
  async function initializeV2() { await waitForUserIdv2(); if (window.handControlsDisabled && p_handbuttons === "true" && window.firstrunhandcontrols) { playersuseridv2 = firescenev2.localUser.uid; window.handControlsDisabled = false; setupHandControlsV2(); } }

  async function waitForUserIdv2() { while (!firescenev2.localUser || firescenev2.localUser.uid === undefined) { await new Promise(resolve => setTimeout(resolve, 200)); } }
  
  initializeV2();
  firescenev2.On("user-joined", e => {
    if (e.detail.isLocal) { // Setup Hand Controls only on the first run if enabled
      if (p_handbuttons === "true" && window.firstrunhandcontrols) {
        window.firstrunhandcontrols = false; playersuseridv2 = e.detail.uid;
        console.log("FIRESCREEN2: Enabling Hand Controls"); setupHandControlsV2();
      };
      console.log("FIRESCREEN2: user-joined");
    };
  });

  firescenev2.On("user-left", e => { if (e.detail.isLocal) { window.firstrunhandcontrols = true;
      console.log("FIRESCREEN2: Local User Left, Resetting firstrunhandcontrols variable"); };
  });

  function clickABut(uniqueAttribute, lastChild = false) {
    document.querySelector(uniqueAttribute)?.[lastChild ? 'lastChild' : 'firstChild']?.dispatchEvent(new Event("click"));
    // console.log(`clicked ${uniqueAttribute}`);
  };

  async function youtubePlayerControl(value, action = null) {
    const core = window.videoPlayerCore; if (!core) return;
    const methodName = (action === "mute" || action === "openPlaylist") ? action : "volume"; // Choose the method name based on the action.
    if (typeof core[methodName] !== "function") return;  // Only call if it's a function.
    return methodName === "volume" ? core[methodName](value) : core[methodName](); // Call with or without the value argument.

    // if (window.videoPlayerCore && typeof window.videoPlayerCore.setVolume === 'function' && Action === null) { window.videoPlayerCore.setVolume(value); } 
    // else if (window.videoPlayerCore && typeof window.videoPlayerCore.mute === 'function' && Action === "mute") { window.videoPlayerCore.mute(); } 
    // else if (window.videoPlayerCore && typeof window.videoPlayerCore.openPlaylist === 'function' && Action === "openPlaylist") { window.videoPlayerCore.openPlaylist(); }

  };

  async function setupHandControlsV2() {
    // THE CONTAINER FOR THE HAND BUTTONS
    const plane20Object = await new BS.GameObject("handContainer").Async();
    const plane20geometry = await createGeometry(plane20Object, BS.GeometryType.PlaneGeometry);
    const plane20Collider = await plane20Object.AddComponent(new BS.BoxCollider(true, new BS.Vector3(0, 0, 0), new BS.Vector3(1,1,1)));
    const plane20material = await createMaterial(plane20Object, { shaderName: defaulTransparent, color: new BS.Vector4(0,0,0,0), side: 1 });
    const plane20transform = await plane20Object.AddComponent(new BS.Transform());
    plane20transform.localPosition = new BS.Vector3(0,0.046,0.030);
    plane20transform.localScale = new BS.Vector3(0.1,0.1,0.1);
    // plane20transform.eulerAngles = new BS.Vector3(5,-95,0);
    plane20transform.rotation = new BS.Vector4(0.25,0,0.8,1);
    setTimeout(async () => { await firescenev2.LegacyAttachObject(plane20Object, playersuseridv2, BS.LegacyAttachmentPosition.LEFT_HAND); }, 1000);
    // Hand Volume Up Button
    const hvolUpButton = await createUIButton("hVolumeUpButton", p_iconvolupurl, new BS.Vector3(0.4,0.4,0.3), p_volupcolor, plane20Object, () => { adjustForAll("adjustVolume", 1); youtubePlayerControl(1); // clickABut('[position="0.693 0 0"]'); clickABut('[position="1.78 0 0"]', true); //vidya.sdq.st VolUp
      updateButtonColor(hvolUpButton, p_volupcolor); }, new BS.Vector3(180,0,0),1,1, defaulTransparent, new BS.Vector3(0.4,0.4,0.4));
    // Hand Volume Down Button
    const hvolDownButton = await createUIButton("hVolumeDownButton", p_iconvoldownurl, new BS.Vector3(0.0,0.4,0.3), p_voldowncolor, plane20Object, () => { adjustForAll("adjustVolume", -1); youtubePlayerControl(0); // clickABut('[position="0.471 0 0"]'); clickABut('[position="1.25 0 0"]', true); //vidya.sdq.st VolDown
      updateButtonColor(hvolDownButton, p_voldowncolor); }, new BS.Vector3(180,0,0),1,1, defaulTransparent, new BS.Vector3(0.4,0.4,0.4));
    // Hand Mute Button
    const hmuteButton = await createUIButton("hMuteButton", p_iconmuteurl, new BS.Vector3(-0.4,0.4,0.3), p_mutecolor, plane20Object, () => { adjustForAll("toggleMute"); youtubePlayerControl(null, "mute"); // clickABut('[position="0.23 0 0"]'); clickABut('[position="0.73 0 0"]', true); //vidya.sdq.st Mute
      let muteMaterial = hmuteButton.GetComponent(BS.ComponentType.BanterMaterial);
      muteMaterial.color = firebrowser.muteState ? p_mutecolor : new BS.Vector4(1, 0, 0, 1); }, new BS.Vector3(180,0,0),1,1,defaulTransparent, new BS.Vector3(0.4,0.4,0.4));
    // Hand Lock Button
    const hlockButton = await createUIButton("hLockButton", 'https://firer.at/files/lock.png', new BS.Vector3(0,-0.1,0.3), new BS.Vector4(1, 1, 1, 0.7), plane20Object, () => {
      playerislockedv2 = !playerislockedv2; playerislockedv2 ? firescenev2.LegacyLockPlayer() : firescenev2.LegacyUnlockPlayer();
      let plane24material = hlockButton.GetComponent(BS.ComponentType.BanterMaterial);
      plane24material.color = playerislockedv2 ? new BS.Vector4(1,0,0,1) : new BS.Vector4(1, 1, 1, 0.7); }, new BS.Vector3(180,0,0),1,1, defaulTransparent, new BS.Vector3(0.4,0.4,0.4));
    // Hand Home Button
    const hhomeButton = await createUIButton("hHomeButton", "https://firer.at/files/Home.png", new BS.Vector3(0.4,-0.1,0.3), p_buttoncolor, plane20Object, () => { adjustForAll("goHome"); youtubePlayerControl(null, "openPlaylist"); // clickABut('[position="-0.633 0 0"]'); clickABut('[position="-1.7 0 0"]', true); //vidya.sdq.st Playlist
      updateButtonColor(hhomeButton, p_buttoncolor); }, new BS.Vector3(180,0,0),1,1, defaulTransparent, new BS.Vector3(0.4,0.4,0.4));
    console.log("FIRESCREEN2: Hand Buttons Setup Complete");
  };

  let waitingforunity = true;
  var screeninterval;
  if (p_thisBrowserNumber < 1) {p_thisBrowserNumber++}; 
  if (waitingforunity) { screeninterval = setInterval(function() {
    if (firescenev2.unityLoaded) { waitingforunity = false; clearInterval(screeninterval);
      if (!window.FireScriptLoaded && !window.AnnouncerScriptInitialized) { window.FireScriptLoaded = true; console.log("FIRESCREEN2: Announcer Initialising"); announcerstufffunc(); }; };
  }, p_thisBrowserNumber * 1000); };
  // browser-message - Fired when a message is received from a browser in the space.  
  screenObject.On("browser-message", e => { console.log(e) });
  screenObject.On("browsermessage", e => { console.log(e) });
  screenObject.On("menu-browser-message", e => { console.log(e) });
  screenObject.On("menubrowsermessage", e => { console.log(e) });

  function announcerstufffunc() {
    console.log("FIRESCREEN2: Announcer Script Called");
    // Setup the Announcer only on the first run if enabled
    setTimeout(() => { 
      const thisscripts = Array.from(document.getElementsByTagName('script'));
      const matchingAnnouncerScriptFound = thisscripts.some(script => script.src.startsWith(`${announcerscripturlv2}`) || script.src.startsWith(`${thisScriptLocation}announce`) );
      if (!matchingAnnouncerScriptFound && !window.AnnouncerScriptInitialized) {
        console.log("FIRESCREEN2: matchingAnnouncerScriptFound is not found, Adding the Announcer Script");
        const announcerscript = document.createElement("script");
        announcerscript.id = "fires-announcer";
        announcerscript.setAttribute("src", announcerscripturlv2);
        announcerscript.setAttribute("announce", p_announce);
        announcerscript.setAttribute("announce-420", p_announce420);
        announcerscript.setAttribute("announce-events", p_announceevents === "undefined" ? (p_announce === "true" ? "true" : "false") : p_announceevents );
        document.querySelector("body").appendChild(announcerscript);
      } else { console.log('FIRESCREEN2: matchingAnnouncerScriptFound or AnnouncerScriptInitialized, Moving on'); };
    }, 1000);
    setTimeout(() => { timenow = Date.now(); }, 1000);
  };
  if (p_spacesync === 'true') {let syncedurl = await getSpaceStateStuff('fireurl'); firebrowser.url = syncedurl;
    await createCustomButton("SpaceSyncButton", firebrowser, geometryObject, customButtonObjects, new BS.Vector3(RCButPos,0.35,0), "Synced Button", new BS.Vector3(RCTexPos,-0.139,-0.005), syncedurl, async () => {
      firebrowser.url = await getSpaceStateStuff('fireurl');
    });
  };
  setTimeout(async () => { adjustVolume(firebrowser, 0); // attempt to set default sound level for the page
  }, 5000);
};

function getV3FromStrv2(strVector3) {
  const [x, y, z] = strVector3.split(" ").map(Number);
  return new BS.Vector3(x, y, z);
};

function getV4FromStr(strVector4) {
  if (strVector4 === "false") return false;
  const [x, y, z, w] = strVector4.split(" ").map(Number);
  return new BS.Vector4(x, y, z, w);
};

// function getAttrOrDef(script, attr, defaultValue) { script.hasAttribute(attr) ? script.getAttribute(attr) : defaultValue };

function keepsoundlevel2() { 
  var volinterval2;
  if (fireScreen2On && !window.NotRunKeepSoundLoop) {
  console.log("FIRESCREEN2: keepsoundlevel loop");
  window.NotRunKeepSoundLoop = true;
  // Loop to keep sound level set, runs every set second(s)
    volinterval2 = setInterval(async function() {
      let thisloopnumber = 0;
      while (thisloopnumber < window.theNumberofBrowsers) { thisloopnumber++
        let firebrowserthing = await BS.BanterScene.GetInstance().Find(`MyBrowser${thisloopnumber}`);
        let thebrowserpart = firebrowserthing.GetComponent(BS.ComponentType.BanterBrowser);
        runBrowserActions( thebrowserpart, 
          `typeof player !== 'undefined' && player.setVolume(${Number((thebrowserpart.volumeLevel * 100).toFixed(0))});
          document.querySelectorAll('video, audio').forEach((elem) => elem.volume=${thebrowserpart.volumeLevel});
          document.querySelector('.html5-video-player') ? document.querySelector('.html5-video-player').setVolume(${(thebrowserpart.volumeLevel * 100).toFixed(0)}) : null;`
        );
      };
    }, 5000); } else if (fireScreen2On) { console.log("FIRESCREEN2: ALREADY SET soundlevel loop"); } else { console.log("FIRESCREEN2: CLEAR soundlevel loop"); clearInterval(volinterval2); }
};

async function adjustForAll(action, change) {
	let thisloopnumber = 0;
	while (thisloopnumber < window.theNumberofBrowsers) {
		thisloopnumber++
		// let firebrowserthing = await BS.BanterScene.GetInstance().Find(`MyBrowser${thisloopnumber}`);
    let thebrowserpart = (await BS.BanterScene.GetInstance().Find(`MyBrowser${thisloopnumber}`)).GetComponent(BS.ComponentType.BanterBrowser);
		if (action === "adjustVolume") adjustVolume(thebrowserpart, change);
		if (action === "soundLevels") keepsoundlevel2(thebrowserpart);
		if (action === "goHome") thebrowserpart.url = thebrowserpart.homePage;
		if (action === "goURL") thebrowserpart.url = change;
		if (action === "toggleMute") {
      thebrowserpart.muteState = !thebrowserpart.muteState; thebrowserpart.muteState ? muteState = "mute" : muteState = "unMute";
      runBrowserActions(thebrowserpart, `document.querySelectorAll('video, audio').forEach((elem) => elem.muted=${thebrowserpart.muteState}); typeof player !== 'undefined' && player.${muteState}(); document.querySelector('.html5-video-player').${muteState}();`);
    };
		if (action === "browserAction") {
      runBrowserActions(thebrowserpart, `${change}`);
    };
    console.log(action);
	};
};

async function getSpaceStateStuff(argument) {
  return new Promise((resolve) => {
    const thisintervalvar = setInterval(async () => {
      if (firescenev2.localUser && firescenev2.localUser.uid !== undefined) { clearInterval(thisintervalvar);
        const result = await spaceStateStuff(argument); resolve(result); }
    }, 100);
  });
};

function spaceStateStuff(argument) {
  let SpaceStateScene = BS.BanterScene.GetInstance().spaceState;
  let ProtectedSpacestatethings = SpaceStateScene.protected;
  let PublicSpacestatethings = SpaceStateScene.public;
  for (const [key, value] of Object.entries(PublicSpacestatethings)) {
    console.log(`Public Space State Key: ${key}, Value: ${value}`);
    // if (key === argument) { console.log(`Return Public Space State Key ${key}`); return value; };
  };
  for (const [key, value] of Object.entries(ProtectedSpacestatethings)) {
    console.log(`Protected Space State Key: ${key}, Value: ${value}`);
    if (key === argument) { console.log(`Return Space State Key ${key}`); return value; };
  }; 
  console.log(`Return NULL State Key`);
  return null;
};

if (!window.fireScreenScriptInitialized) {
  window.fireScreenScriptInitialized = true;
  console.log("FIRESCREEN2: Initializing the script");
  setTimeout(() => { setupfirescreen2(); }, 500);
} else {
  setTimeout(() => { setupfirescreen2(); }, 1500);
};

// setProtectedSpaceProp('fireurl', "https://firer.at/");
// await BS.BanterScene.GetInstance().OneShot(JSON.stringify({firevolume: "0.5"}));
// await firescenev2.OneShot(JSON.stringify({fireurl: "https://firer.at/"}));

// oneShot({fireurl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4"});
// oneShot({firevolume: "0.5"});
// oneShot({firevolume: "0"});

// oneShot({browseraction: "action"});
// oneShot({browseraction: `window.bantermessage(window.alert('test'));`});

// adjustForAll("browserAction", `window.bantermessage(window.alert('test'));`)

// runBrowserActions((await BS.BanterScene.GetInstance().Find(`MyBrowser1`)).GetComponent(BS.ComponentType.BanterBrowser), `window.bantermessage(window.alert('test'))`)

// (await BS.BanterScene.GetInstance().Find(`MyBrowser1`)).GetComponent(BS.ComponentType.BanterBrowser).RunActions(JSON.stringify({"actions": [{ "actionType": "runscript","strparam1": 
//   `window.bantermessage(window.alert('test'))` 
// }]}));

// `window.scrollBy(0,1000);`  `window.scrollBy(0,-1000);`

// scene.SetPublicSpaceProps({'testing': 'test'});
// let thebrowserpart = (await BS.BanterScene.GetInstance().Find(`MyBrowser${1}`)).GetComponent(BS.ComponentType.BanterBrowser);
// thebrowserpart.RunActions(JSON.stringify({"actions": [{ "actionType": "click2d","numParam1": 0.5, "numParam2": 0.5 }]}));
// window.videoPlayerCore.sendMessage({path: Commands.CLEAR_PLAYLIST});
// window.videoPlayerCore.sendMessage({path: Commands.REMOVE_PLAYLIST_ITEM, data: 0 });
// v = {}; v.id = "ApXoWvfEYVU"; v.link = "https://www.youtube.com/watch?v=ApXoWvfEYVU"; v.title = "This is Not the Right Title for This Video"; v.thumbnail = "https://daily.jstor.org/wp-content/uploads/2015/08/Fire.jpg"; 
// window.videoPlayerCore.sendMessage({path: Commands.ADD_TO_PLAYLIST, data: v });