// SDK2 Based FireScreen, V0.69 Beta 2
var firescreenurlv2 = "https://51.firer.at/scripts/firescreenv2.js"; // "https://51.firer.at/scripts/firescreenv2.js";
var announcerscripturlv2 = "https://51.firer.at/scripts/announcer.js";
var fireScreen2On = false;
var firstrunhandcontrolsv2 = true;
var firevolume = 1;
var playersuseridv2 = null;
var the_announce = null;
var the_announce420 = null;
var the_announceevents = null;
var customButShader = 'Unlit/Diffuse';
var defaulTransparent = 'Unlit/DiffuseTransparent';
var thebuttonscolor;
var whiteColour = new BS.Vector4(1,1,1,1);
var customButtonSize = new BS.Vector3(0.2,0.04,1);
var textPlaneColour = new BS.Vector4(0.1,0.1,0.1,1);
var theNumberofBrowsers = 0;

// This Function adds geometry to the given game Object
async function createGeometry(thingy1, geomtype, options = {}) {
  const defaultOptions = {
    thewidth: 1, theheight: 1, depth: 1, widthSegments: 1, heightSegments: 1, depthSegments: 1, radius: 1, segments: 24, thetaStart: 0, thetaLength: Math.PI * 2, phiStart: 0, phiLength: Math.PI * 2, radialSegments: 8, openEnded: false, radiusTop: 1, radiusBottom: 1, innerRadius: 0.3, outerRadius: 1, thetaSegments: 24, phiSegments: 8, tube: 0.4, tubularSegments: 16, arc: Math.PI * 2, p: 2, q: 3, stacks: 5, slices: 5, detail: 0, parametricPoints: ""
  };
  const config = { ...defaultOptions, ...options };
  const geometry = await thingy1.AddComponent(new BS.BanterGeometry( 
    geomtype, null, config.thewidth, config.theheight, config.depth, config.widthSegments, config.heightSegments, config.depthSegments, config.radius, config.segments, config.thetaStart, config.thetaLength, config.phiStart, config.phiLength, config.radialSegments, config.openEnded, config.radiusTop, config.radiusBottom, config.innerRadius, config.outerRadius, config.thetaSegments, config.phiSegments, config.tube, config.tubularSegments, config.arc, config.p, config.q, config.stacks, config.slices, config.detail, config.parametricPoints
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

async function createCustomButton(name, firebrowser, screenObject, buttonObjects, position, text, textposition, url, clickHandler) {
  const buttonObject = await createUIButton(name, null, position, textPlaneColour, screenObject, false, "false", 1, 1, customButShader, customButtonSize);
  buttonObjects.push(buttonObject); let material = buttonObject.GetComponent(BS.ComponentType.BanterMaterial);
  const textObject = new BS.GameObject(`${name}Text${theNumberofBrowsers}`);
  const banterText = await textObject.AddComponent(new BS.BanterText(text, whiteColour, "Center", "Center", 0.20, true, true, new BS.Vector2(2,1)));
  const textTransform = await textObject.AddComponent(new BS.Transform());
  textTransform.localPosition = textposition; await textObject.SetParent(screenObject, false);
  buttonObjects.push(textObject);
  buttonObject.On('click', () => { console.log(`CLICKED: ${name}`);
      firebrowser.url = url; material.color = new BS.Vector4(0.3,0.3,0.3,1);
      setTimeout(() => { material.color = textPlaneColour; }, 100); if (clickHandler) clickHandler();
  });
};

async function createUIButton(name, thetexture, position, thecolor, thisparent, clickHandler = false, rotation = false, width = 0.1, height = 0.1, theShader = defaulTransparent, localScale = new BS.Vector3(1, 1, 1)) {
  const buttonObject = new BS.GameObject(name);
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
  let currentVolume = Number(firevolume); let adjustment;
  if (currentVolume < 0.1) { adjustment = 0.01; // Tiny adjustment for low volume
  } else if (currentVolume < 0.5) { adjustment = 0.03; // Medium adjustment for medium volume
  } else { adjustment = 0.05; } // Big adjustment for high volume
  firevolume = currentVolume + (change * adjustment);
  firevolume = Math.max(0, Math.min(firevolume, 1)).toFixed(2);
  let firepercent = (firevolume * 100).toFixed(0);
  runBrowserActions(firebrowser, `document.querySelectorAll('video, audio').forEach((elem) => elem.volume=${firevolume});`);
  runBrowserActions(firebrowser, `document.querySelector('.html5-video-player').setVolume(${firepercent});`);
  console.log(`FIRESCREEN2: Volume is: ${firevolume}`);
};

function toggleButtonVisibility(defaultobjects, customButtonObjects, visible) {
  defaultobjects.forEach(button => { button.SetActive(visible); });
  customButtonObjects.forEach(button => { if (button) {button.SetActive(visible); }; });
}

function runBrowserActions(firebrowser, script) {
  firebrowser.RunActions(JSON.stringify({"actions": [{ "actionType": "runscript","strparam1": script }]}));
};

function createButtonAction(buttonObject, clickHandler) {
  buttonObject.On('click', (e) => { clickHandler(e); });
};

function setupfirescreen2() {
  console.log("FIRESCREEN2: Setting up");
  const allscripts = document.querySelectorAll("script[src='" + firescreenurlv2 + "']");
  allscripts.forEach(script => { theNumberofBrowsers++;
    console.log("FIRESCREEN2: Loading");
    const defaultParams = { position: "0 2 0", rotation: "0 0 0", scale: "1 1 1", volumelevel: "0.25",
      website: "https://firer.at/pages/games.html", mipmaps: "1", pixelsperunit: "1200", width: "1024", height: "576",
      backdrop: "true", "hand-controls": "false", "disable-interaction": "false", "disable-rotation": false, announce: "false", "announce-420": "false", "announce-events": "undefined",
      "button-color": "0 1 0 1", "backdrop-color": "0 0 0 0.9", "volup-color": "0 1 0 1", "voldown-color": "1 1 0 1", "mute-color": "1 1 1 1", "button-position": "0 0 0",
      "icon-mute-url": "https://firer.at/files/VolumeMute.png", "icon-volup-url": "https://firer.at/files/VolumeHigh.png",
      "icon-voldown-url": "https://firer.at/files/VolumeLow.png", "icon-direction-url": "https://firer.at/files/Arrow.png",
      "custom-button01-url": "false", "custom-button01-text": "Custom Button 01",
      "custom-button02-url": "false", "custom-button02-text": "Custom Button 02",
      "custom-button03-url": "false", "custom-button03-text": "Custom Button 03",
      "custom-button04-url": "false", "custom-button04-text": "Custom Button 04"
    };

    const numberAttributes = { position: getV3FromStrv2, rotation: getV3FromStrv2, scale: getV3FromStrv2, "button-color": getV4FromStr, "backdrop-color": getV4FromStr, "volup-color": getV4FromStr, "voldown-color": getV4FromStr, "mute-color": getV4FromStr };
    // Function to get or convert attribute
    const getParam = (key) => { const attr = script.getAttribute(key);
      const value = attr !== null ? attr : defaultParams[key];
      return numberAttributes[key] ? numberAttributes[key](value) : value; };

    const params = {}; Object.keys(defaultParams).forEach(key => { params[key] = getParam(key); });
    const {
      position, rotation, scale, volumelevel, mipmaps, pixelsperunit, backdrop, website, "button-color": buttonColor, announce, "announce-420": announce420, "backdrop-color": backdropColor, "icon-mute-url": iconMuteUrl, "icon-volup-url": iconVolUpUrl, "icon-voldown-url": iconVolDownUrl, "icon-direction-url": iconDirectionUrl, "volup-color": volUpColor, "voldown-color": volDownColor, "mute-color": muteColor, "disable-interaction": disableInteraction, "disable-rotation": disableRotation, "button-position": buttonPosition, "hand-controls": handControls, width, height, "announce-events": announceEvents, "custom-button01-url": customButton01Url, "custom-button01-text": customButton01Text, "custom-button02-url": customButton02Url, "custom-button02-text": customButton02Text, "custom-button03-url": customButton03Url, "custom-button03-text": customButton03Text, "custom-button04-url": customButton04Url, "custom-button04-text": customButton04Text
    } = params;

    const pURL = `url: ${website}; mipMaps: ${mipmaps}; pixelsPerUnit: ${pixelsperunit}; pageWidth: ${width}; pageHeight: ${height}; mode: local;`;

    sdk2tests(position, rotation, scale, volumelevel, mipmaps, pixelsperunit, backdrop, website, buttonColor, announce, announce420,
      backdropColor, iconMuteUrl, iconVolUpUrl, iconVolDownUrl, iconDirectionUrl, volUpColor, volDownColor, muteColor,
      disableInteraction, disableRotation, buttonPosition, handControls, width, height, announceEvents, customButton01Url, customButton01Text,
      customButton02Url, customButton02Text, customButton03Url, customButton03Text, customButton04Url, customButton04Text);
  });
};

async function sdk2tests(p_pos, p_rot, p_sca, p_volume, p_mipmaps, p_pixelsperunit, p_backdrop, p_website, p_buttoncolor, p_announce, p_announce420, p_backdropcolor, p_iconmuteurl, p_iconvolupurl, p_iconvoldownurl, p_icondirectionurl, p_volupcolor, p_voldowncolor, p_mutecolor, p_disableinteraction, p_disableRotation, p_buttonpos, p_handbuttons, p_width, p_height, p_announceevents, p_custombuttonurl01, p_custombutton01text, p_custombuttonurl02, p_custombutton02text, p_custombuttonurl03, p_custombutton03text, p_custombuttonurl04, p_custombutton04text) {
  // create a reference to the banter scene
  const firescenev2 = BS.BanterScene.GetInstance();
  the_announce = p_announce;
  the_announce420 = p_announce420;
  the_announceevents = p_announceevents;
  firevolume = p_volume;
  fireScreen2On = true;
  thebuttonscolor = p_buttoncolor;
  let keyboardstate = false;
  let playerislockedv2 = false;
  let browsermuted = false;
  let announcerfirstrunv2 = true;
  let customButtonObjects = [];
  const screenObject = await new BS.GameObject(`MyBrowser${theNumberofBrowsers}`);
  console.log(`FireScreen2: p_width:${p_width}, p_height:${p_height}`);
  let firebrowser = await screenObject.AddComponent(new BS.BanterBrowser(p_website, p_mipmaps, p_pixelsperunit, p_width, p_height, null));

  let isbillboarded;
  p_disableRotation ? isbillboarded = false : isbillboarded = true;
  if (p_disableinteraction === "false") { firebrowser.ToggleInteraction(true); }

  geometryObject = new BS.GameObject(`MainParentObject${theNumberofBrowsers}`);
  const geometry = await createGeometry(geometryObject, BS.GeometryType.PlaneGeometry, { thewidth: 1.09, theheight: 0.64 });
  // geometry Transform Stuff
  const geometrytransform = await geometryObject.AddComponent(new BS.Transform());
  geometrytransform.position = p_pos; geometrytransform.eulerAngles = p_rot;
  const size = new BS.Vector3(1.09,0.64,0.01);
  const boxCollider = await geometryObject.AddComponent(new BS.BoxCollider(false, new BS.Vector3(0,0,0), size));
  await geometryObject.SetLayer(20);
  const firerigidBody = await geometryObject.AddComponent(new BS.BanterRigidbody(1, 10, 10, true, false, new BS.Vector3(0,0,0), "Discrete", false, false, false, false, false, false, new BS.Vector3(0,0,0), new BS.Vector3(0,0,0)));

  if (p_backdrop !== "true") { p_backdropcolor = new BS.Vector4(0,0,0,0); }; // If Backdrop is disabled, Hide it
  const material = await createMaterial(geometryObject, { color: p_backdropcolor });
  // firebrowser Transform Stuff
  const browsertransform = await screenObject.AddComponent(new BS.Transform());
  browsertransform.position = new BS.Vector3(0,0,-0.02);
  browsertransform.localScale = new BS.Vector3(1,1,1);
  await screenObject.SetParent(geometryObject, false); // Make the screen a child of the Main Geometry Object
  const dynamicFriction = 100; const staticFriction = 100;  // ADD FRICTION
  const physicMaterial = await geometryObject.AddComponent(new BS.BanterPhysicMaterial(dynamicFriction, staticFriction));

  let TButPos = 0.38; let LButPos = -0.6; let RButPos = 0.6;
  if (Number(p_height) === 720) {TButPos += 0.07; LButPos += -0.14; RButPos += 0.14;} else if (Number(p_height) === 1080) {TButPos += 0.23; LButPos += -0.45; RButPos += 0.45;};

  let BUTTON_CONFIGS = { home: { icon: "https://firer.at/files/Home.png", position: new BS.Vector3(-0.2,TButPos,0), color: thebuttonscolor,
      clickHandler: () => { console.log("Home Clicked!"); firebrowser.url = p_website;
      updateButtonColor(uiButtons.home, thebuttonscolor); }
    }, info: { icon: "https://firer.at/files/Info.png", position: new BS.Vector3(LButPos,0.28,0), color: thebuttonscolor,
      clickHandler: () => { console.log("Info Clicked!"); firebrowser.url = "https://firer.at/pages/Info.html";
      updateButtonColor(uiButtons.info, thebuttonscolor); }
    }, google: { icon: "https://firer.at/files/Google.png", position: new BS.Vector3(LButPos,0.16,0), color: whiteColour,
      clickHandler: () => { console.log("Google Clicked!"); firebrowser.url = "https://google.com/";
      updateButtonColor(uiButtons.google, whiteColour); }
    }, keyboard: { icon: "https://firer.at/files/Keyboard.png", position: new BS.Vector3(LButPos,-0.15,0), color: whiteColour,
      clickHandler: () => { console.log("Keyboard Clicked!"); keyboardstate = !keyboardstate; firebrowser.ToggleKeyboard(keyboardstate ? 1 : 0);
        uiButtons.keyboard.GetComponent(BS.ComponentType.BanterMaterial).color = keyboardstate ? thebuttonscolor : whiteColour; }
    }, mute: { icon: p_iconmuteurl, position: new BS.Vector3(0.167,TButPos,0), color: p_mutecolor,
      clickHandler: () => { console.log("Mute Clicked!"); browsermuted = !browsermuted;
      runBrowserActions(firebrowser, `document.querySelectorAll('video, audio').forEach((elem) => elem.muted=${browsermuted});`);
      uiButtons.mute.GetComponent(BS.ComponentType.BanterMaterial).color = browsermuted ? new BS.Vector4(1,0,0,1) : (p_mutecolor ? p_mutecolor : thebuttonscolor); }
    }, volDown: { icon: p_iconvoldownurl, position: new BS.Vector3(0.334,TButPos,0), color: p_voldowncolor,
      clickHandler: () => { console.log("Volume Down Clicked!"); adjustVolume(firebrowser, -1);
      updateButtonColor(uiButtons.volDown, p_voldowncolor ? p_voldowncolor : thebuttonscolor); }
    }, pageBack: { icon: p_icondirectionurl, position: new BS.Vector3(-0.5,TButPos,0), color: thebuttonscolor,
      clickHandler: () => { console.log("Back Clicked!"); firebrowser.RunActions(JSON.stringify({"actions":[{"actionType": "goback"}]}));
      updateButtonColor(uiButtons.pageBack, thebuttonscolor); }
    }, sizeGrow: { icon: "https://firer.at/files/expand.png", position: new BS.Vector3(RButPos,0.06,0), color: thebuttonscolor,
      clickHandler: () => { console.log("Grow Clicked!"); adjustScale(geometrytransform, "grow");
      updateButtonColor(uiButtons.sizeGrow, thebuttonscolor); }
    }, sizeShrink: { icon: "https://firer.at/files/shrink.png", position: new BS.Vector3(RButPos,-0.06,0), color: thebuttonscolor,
      clickHandler: () => { console.log("Shrink Clicked!"); adjustScale(geometrytransform, "shrink");
      updateButtonColor(uiButtons.sizeShrink, thebuttonscolor); }
    }, pageForward: { icon: p_icondirectionurl, position: new BS.Vector3(-0.38,TButPos,0), color: thebuttonscolor,
      clickHandler: () => { console.log("Forward Clicked!"); firebrowser.RunActions(JSON.stringify({"actions":[{"actionType": "goforward"}]}));
      updateButtonColor(uiButtons.pageForward, thebuttonscolor); }, rotation: new BS.Vector3(0,0,180)
    }, volUp: { icon: p_iconvolupurl, position: new BS.Vector3(0.495,TButPos,0), color: p_volupcolor,
      clickHandler: () => { console.log("Volume Up Clicked!"); adjustVolume(firebrowser, 1);
      updateButtonColor(uiButtons.volUp, p_volupcolor ? p_volupcolor : thebuttonscolor); }
    }, billboard: { icon: "https://firer.at/files/Rot.png", position: new BS.Vector3(LButPos,-0.3,0), color: isbillboarded ? thebuttonscolor : whiteColour,
      clickHandler: () => {isbillboarded = !isbillboarded; console.log("Billboard Clicked!");
        firesbillBoard.enableXAxis = isbillboarded; firesbillBoard.enableYAxis = isbillboarded;
        uiButtons.billboard.GetComponent(BS.ComponentType.BanterMaterial).color = isbillboarded ? thebuttonscolor : whiteColour; }
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
  let uiButtons = await createUIButtons(screenObject);

  let buttonsvisible = true;
  const hideShowObject = await createUIButton("FireButton_hideShow", "https://firer.at/files/Eye.png", new BS.Vector3(LButPos,0,0), thebuttonscolor, screenObject);
  createButtonAction(hideShowObject, () => { console.log("HideShow Clicked!");buttonsvisible = !buttonsvisible; toggleButtonVisibility(Object.values(uiButtons), customButtonObjects, buttonsvisible ? 1 : 0)
    hideShowObject.GetComponent(BS.ComponentType.BanterMaterial).color = buttonsvisible ? thebuttonscolor : new BS.Vector4(1, 1, 1, 0.5);
  });
  
  let RCButPos = 0.68; let RCTexPos = 1.59;
  if (Number(p_height) === 720) {RCButPos += 0.14; RCTexPos += 0.14;} else if (Number(p_height) === 1080) {RCButPos += 0.4; RCTexPos += 0.4;};

  if (p_custombuttonurl01 !== "false") {  console.log("p_custombuttonurl01 is true");
    await createCustomButton("CustomButton01", firebrowser, screenObject, customButtonObjects, new BS.Vector3(RCButPos,0.3,0), p_custombutton01text, new BS.Vector3(RCTexPos,-0.188,-0.005), p_custombuttonurl01, () => {});
    console.log(p_custombuttonurl01); };
  if (p_custombuttonurl02 !== "false") { console.log("p_custombuttonurl02 is true");
    await createCustomButton("CustomButton02", firebrowser, screenObject, customButtonObjects, new BS.Vector3(RCButPos,0.25,0), p_custombutton02text, new BS.Vector3(RCTexPos,-0.237,-0.005), p_custombuttonurl02, () => {});
    console.log(p_custombuttonurl02); };
  if (p_custombuttonurl03 !== "false") { console.log("p_custombuttonurl03 is true");
    await createCustomButton("CustomButton03", firebrowser, screenObject, customButtonObjects, new BS.Vector3(RCButPos,0.20,0), p_custombutton03text, new BS.Vector3(RCTexPos,-0.287,-0.005), p_custombuttonurl03, () => {});
    console.log(p_custombuttonurl03); };
  if (p_custombuttonurl04 !== "false") { console.log("p_custombuttonurl04 is true");
    await createCustomButton("CustomButton04", firebrowser, screenObject, customButtonObjects, new BS.Vector3(RCButPos,0.15,0), p_custombutton04text, new BS.Vector3(RCTexPos,-0.336,-0.005), p_custombuttonurl04, () => {});
    console.log(p_custombuttonurl04); };

  const firesbillBoard = await geometryObject.AddComponent(new BS.BanterBillboard(0, isbillboarded, isbillboarded, true));  // Bill Board the geometryObject
  geometrytransform.localScale = p_sca; // SET THE SCALE FOR THE SCREEN
  firerigidBody.gameObject.On('grab', () => {console.log("GRABBED!"); firerigidBody.isKinematic = false; });  // When user Grabs the Browser, Make it moveable
  firerigidBody.gameObject.On('drop', () => {console.log("DROPPED!"); firerigidBody.isKinematic = true; }); // When user Drops the Browser, Lock it in place

  firescenev2.On("one-shot", e => { console.log(e)
    const data = JSON.parse(e.detail.data);
    if (e.detail.fromAdmin) { console.log("Current Shot From Admin Is True");
      if (data.fireurl) firebrowser.url = data.fireurl;
      if (data.firevolume) {
        const thisfirevolume = Number(parseFloat(data.firevolume).toFixed(2));
        const firepercent = (thisfirevolume * 100).toFixed(0);
        runBrowserActions(`document.querySelectorAll('video, audio').forEach((elem) => elem.volume = ${thisfirevolume});
          document.querySelector('.html5-video-player')?.setVolume(${firepercent});`);};
    } else { console.log("Current Shot From Admin Is False");
      console.log(e.detail.fromId);
    };
  });

  firescenev2.On("user-joined", e => {
    if (e.detail.isLocal) { // Setup Hand Controls only on the first run if enabled
      if (p_handbuttons === "true" && firstrunhandcontrolsv2) {
        firstrunhandcontrolsv2 = false; playersuseridv2 = e.detail.uid;
        console.log("FIRESCREEN2: Enabling Hand Controls"); setupHandControls();
      };
      console.log("FIRESCREEN2: user-joined");
    };
  });

  async function setupHandControls() {
    // THE CONTAINER FOR THE HAND BUTTONS
    console.log("FIRESCREEN2: Hand Control Stuff");
    const plane20Object = new BS.GameObject("handContainer");
    const plane20geometry = await createGeometry(plane20Object, BS.GeometryType.PlaneGeometry);
    const plane20Collider = await plane20Object.AddComponent(new BS.BoxCollider(true, new BS.Vector3(0, 0, 0), new BS.Vector3(1,1,1)));
    const plane20material = await createMaterial(plane20Object, { shaderName: defaulTransparent, color: new BS.Vector4(0,0,0,0), side: 1 });
    const plane20transform = await plane20Object.AddComponent(new BS.Transform());
    firescenev2.LegacyAttachObject(plane20Object, playersuseridv2, BS.LegacyAttachmentPosition.LEFT_HAND)
    plane20transform.localPosition = new BS.Vector3(-0.01,-0.006,0.020);
    plane20transform.localScale = new BS.Vector3(0.1,0.1,0.1);
    plane20transform.localEulerAngles = new BS.Vector3(5,-95,0);
    // Hand Volume Up Button
    const hvolUpButton = await createUIButton("hVolumeUpButton", p_iconvolupurl, new BS.Vector3(0.4,0.4,0.3), p_volupcolor, plane20Object, () => { adjustVolume(firebrowser, 1);
      updateButtonColor(hvolUpButton, p_volupcolor); }, new BS.Vector3(180,0,0),1,1, defaulTransparent, new BS.Vector3(0.4,0.4,0.4));
    // Hand Volume Down Button
    const hvolDownButton = await createUIButton("hVolumeDownButton", p_iconvoldownurl, new BS.Vector3(0.0,0.4,0.3), p_voldowncolor, plane20Object, () => { adjustVolume(firebrowser, -1);
      updateButtonColor(hvolDownButton, p_voldowncolor); }, new BS.Vector3(180,0,0),1,1, defaulTransparent, new BS.Vector3(0.4,0.4,0.4));
    // Hand Mute Button
    const hmuteButton = await createUIButton("hMuteButton", p_iconmuteurl, new BS.Vector3(-0.4,0.4,0.3), p_mutecolor, plane20Object, () => {
      browsermuted = !browsermuted;
      runBrowserActions(firebrowser, `document.querySelectorAll('video, audio').forEach((elem) => elem.muted=${browsermuted});`);
      let muteMaterial = hmuteButton.GetComponent(BS.ComponentType.BanterMaterial);
      muteMaterial.color = browsermuted ? new BS.Vector4(1, 0, 0, 1) : p_mutecolor; }, new BS.Vector3(180,0,0),1,1,defaulTransparent, new BS.Vector3(0.4,0.4,0.4));
    // Hand Lock Button
    const hlockButton = await createUIButton("hLockButton", 'https://firer.at/files/lock.png', new BS.Vector3(0,-0.1,0.3), new BS.Vector4(1, 1, 1, 0.7), plane20Object, () => {
      playerislockedv2 = !playerislockedv2; playerislockedv2 ? lockPlayer() : unlockPlayer();
      let plane24material = hlockButton.GetComponent(BS.ComponentType.BanterMaterial);
      plane24material.color = playerislockedv2 ? new BS.Vector4(1,0,0,1) : new BS.Vector4(1, 1, 1, 0.7); }, new BS.Vector3(180,0,0),1,1, defaulTransparent, new BS.Vector3(0.4,0.4,0.4));
    // Hand Home Button
    const hhomeButton = await createUIButton("hHomeButton", "https://firer.at/files/Home.png", new BS.Vector3(0.4,-0.1,0.3), thebuttonscolor, plane20Object, () => { firebrowser.url = p_website;
      updateButtonColor(hhomeButton, thebuttonscolor); }, new BS.Vector3(180,0,0),1,1, defaulTransparent, new BS.Vector3(0.4,0.4,0.4));
    console.log("FIRESCREEN2: Hand Setup Stuff END");
  };

  let waitingforunity = true;
  var screeninterval;
  if (theNumberofBrowsers < 1) {theNumberofBrowsers++}; 
  if (waitingforunity) { screeninterval = setInterval(function() {
    if (firescenev2.unityLoaded) { waitingforunity = false; clearInterval(screeninterval);
      if (announcerfirstrunv2) { console.log("FIRESCREEN2: announcerfirstrunv2 true"); announcerfirstrunv2 = false; announcerstufffunc(); }; };
  }, theNumberofBrowsers * 1000); };
  // browser-message - Fired when a message is received from a browser in the space.  
  firebrowser.On("browser-message", e => { console.log(e) });
  firescenev2.On("browser-message", e => { console.log(e) });
  firebrowser.On("menu-browser-message", e => { console.log(e) });
  firescenev2.On("menu-browser-message", e => { console.log(e) });

  var soundlevel2firstrun = true;
  function keepsoundlevel2() { var volinterval2;
    if (fireScreen2On && soundlevel2firstrun) {
    console.log("FIRESCREEN2: keepsoundlevel loop");
    soundlevel2firstrun = false;
    // Loop to keep sound level set, runs every set second(s)
      volinterval2 = setInterval(function() {
        let firepercent = (firevolume * 100).toFixed(0);
        runBrowserActions(firebrowser, `document.querySelectorAll('video, audio').forEach((elem) => elem.volume=${firevolume});`);
        runBrowserActions(firebrowser, `document.querySelector('.html5-video-player').setVolume(${firepercent});`);
      }, 5000); } else if (fireScreen2On) { } else { clearInterval(volinterval2); }
  };

  function announcerstufffunc() {
    console.log("FIRESCREEN2: Announcer Script Called");
    // Setup the Announcer only on the first run if enabled
    setTimeout(() => { 
      if (typeof announcerscene === 'undefined') { announcerfirstrunv2 = false;
        console.log("FIRESCREEN2: announcerscene is not defined, Adding the Announcer Script");
        const announcerscript = document.createElement("script");
        announcerscript.id = "fires-announcer";
        announcerscript.setAttribute("src", announcerscripturlv2);
        announcerscript.setAttribute("announce", the_announce);
        announcerscript.setAttribute("announce-420", the_announce420);
        if (the_announceevents === "undefined" && the_announce === "true") {
          announcerscript.setAttribute("announce-events", "true");
        } else if (the_announceevents === "undefined") {
          announcerscript.setAttribute("announce-events", "false");
        } else {
          announcerscript.setAttribute("announce-events", the_announceevents);
        };
        document.querySelector("body").appendChild(announcerscript);
      } else { console.log('FIRESCREEN2: announcerscene is defined, Moving on'); };
    }, 1000);
    setTimeout(() => { if (announcerfirstrunv2 === false) {  timenow = Date.now(); }; }, 1000);
  };
  keepsoundlevel2()
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

if (!window.fireScreenScriptInitialized) { window.fireScreenScriptInitialized = true;
  console.log("FIRESCREEN2: Initializing the script");
  setupfirescreen2();
} else {
  console.log("FIRESCREEN2: Script already enabled/loading, skipping...");
};

// screenboxCollider = await firescenev2.Find("MyBrowser");

// await firescenev2.OneShot(data: any, allInstances = true);
// await firescenev2.OneShot({videovolume: "0.5"});
// await firescenev2.OneShot(JSON.stringify({firevolume: "0.5"}));
// await firescenev2.OneShot(JSON.stringify({fireurl: "https://firer.at/"}));

// oneShot({fireurl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4"});
// oneShot({firevolume: "0.5"});
// oneShot({firevolume: "0"});