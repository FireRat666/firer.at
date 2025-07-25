// This script can be loaded multiple times on the same page.
// To prevent functions from being redefined, we wrap the core logic
// in a check to ensure it only runs once.
if (typeof window.fireScreenScriptInitialized === 'undefined') {

  // SDK2 Based FireScreen, V0.9 Beta 2.0 -- Thank you Everyone who helped make this possible, HBR, Vanquish3r, DedZed, Sebek, Skizot, Shane and FireRat, And thank you to everyone who helped test it
  // FireScreen Tablet for Screen Casts / live streams with volume controls or a portable browser for any website.
  var thisScriptLocation = `https://firer.at/scripts/`; // CHANGE THIS URL IF MAKING A COPY OF THIS SCRIPT AND THE ONES BELOW
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
  if (typeof window.fireScreenInstances === 'undefined') { window.fireScreenInstances = {}; }
  window.fireScreenSetupRunning = false;


  (function() {
  const initialValues = {
    firstrunhandcontrols: true,
    notalreadyjoined: true,
    handControlsDisabled: true,
    fireScreenSpaceStateLogged: false
  };

  for (const [key, value] of Object.entries(initialValues)) {
    if (typeof window[key] === 'undefined') { window[key] = value; } // Initialize Variables only once 
  }
  })();

// This is the stateless script that will be injected into the browser on every action.
const mediaControlScript = `
(function() {
    // --- Universal Media Control Function ---
    // This function will be called from the Banter space to control media inside the browser.
    window.fireScreenMediaControl = function(options) {
        const { volume, mute } = options;

        function controlMedia(doc) {
            // 1. Find all standard HTML5 video and audio elements
            doc.querySelectorAll('video, audio').forEach(el => {
                try {
                    if (volume !== undefined && 'volume' in el && !el.muted) {
                        el.volume = volume;
                    }
                    if (mute !== undefined && 'muted' in el) {
                        el.muted = mute;
                    }
                } catch (e) { /* console.error('[FireScreen] Error controlling HTML5 media:', e); */ }
            });

            // 2. Attempt to control common third-party players (e.g., YouTube)
            const ytPlayer = doc.querySelector('.html5-video-player');
            if (ytPlayer) {
                try {
                    if (volume !== undefined && typeof ytPlayer.setVolume === 'function') {
                        ytPlayer.setVolume(volume * 100);
                    }
                    if (mute !== undefined) {
                        if (mute && typeof ytPlayer.mute === 'function') ytPlayer.mute();
                        if (!mute && typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
                    }
                } catch(e) { /* console.error('[FireScreen] Error controlling YouTube player:', e); */ }
            }

            // 3. Recursively search within iframes
            doc.querySelectorAll('iframe').forEach(iframe => {
                try {
                    if (iframe.contentDocument) controlMedia(iframe.contentDocument);
                } catch (e) { /* Cross-origin iFrames will throw errors, which is expected. */ }
            });
        }
        controlMedia(window.document);
    };
})();
`;

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

async function createCustomButton(config, firebrowser, parentObject, buttonObjects, browserNumber) {
  const { name, url, text, position, textposition, clickHandler } = config;
  const buttonObject = await createUIButton(name, null, position, textPlaneColour, parentObject, false, false, 1, 1, customButShader, customButtonSize);
  buttonObjects.push(buttonObject);
  const material = buttonObject.GetComponent(BS.ComponentType.BanterMaterial);

  const textObject = await new BS.GameObject(`${name}Text${browserNumber}`).Async();
  await textObject.AddComponent(new BS.BanterText(text, whiteColour, "Center", "Center", 0.20, true, true, new BS.Vector2(2,1)));
  const textTransform = await textObject.AddComponent(new BS.Transform());
  textTransform.localPosition = textposition;
  await textObject.SetParent(parentObject, false);
  buttonObjects.push(textObject);

  buttonObject.On('click', () => {
    console.log(`CLICKED: ${name}`);
    if (url) setBrowserUrl(firebrowser, url); material.color = new BS.Vector4(0.3,0.3,0.3,1);
    setTimeout(() => { material.color = textPlaneColour; }, 100);
    if (clickHandler) clickHandler();
  });
};

async function createUIButton(name, thetexture, position, thecolor, thisparent, clickHandler = false, rotation = false, width = 0.1, height = 0.1, theShader = defaulTransparent, localScale = new BS.Vector3(1, 1, 1)) {
  const buttonObject = await new BS.GameObject(name).Async();
  const buttonGeometry = await createGeometry(buttonObject, BS.GeometryType.PlaneGeometry, { thewidth: width, theheight: height });
  const buttonCollider = await buttonObject.AddComponent(new BS.BoxCollider(true, new BS.Vector3(0,0,0), new BS.Vector3(width, height, 0.01)));
  const buttonMaterial = await createMaterial(buttonObject, { shaderName: theShader, texture: thetexture, color: thecolor });
  const buttonTransform = await buttonObject.AddComponent(new BS.Transform());
  buttonTransform.position = position; buttonTransform.localScale = localScale;
  if (rotation instanceof BS.Vector3) { buttonTransform.localEulerAngles = rotation; } buttonObject.SetLayer(5); // UI Layer
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
  // firevolume = currentVolume + (change * adjustment);
  // firevolume = Math.max(0, Math.min(firevolume, 1)).toFixed(2);
  // let firepercent = (firevolume * 100).toFixed(0);
  // firebrowser.volumeLevel = firevolume;
  // let tempvolumeLevel = Math.max(0, Math.min(1, firevolume)).toFixed(1);
  // runBrowserActions(firebrowser, `
  //   (function() { document.querySelectorAll('video, audio').forEach(el => {
  //     if ('volume' in el) { try { el.volume = ${tempvolumeLevel}; console.log('[Banter Volume Injection] HTML5 volume set for element: ', el.id || el.src); }
  //         catch (e) {  console.error("[Banter Volume Injection] HTML5 volume error for element:", el.id || el.src, e.message, e.stack); }
  //   } }); })();
  // `);
  // runBrowserActions(firebrowser, `typeof player !== 'undefined' && player.setVolume(${firepercent});
  //   document.querySelectorAll('video, audio').forEach((elem) => elem.volume=${firevolume}); 
  //   document.querySelector('.html5-video-player') ? document.querySelector('.html5-video-player').setVolume(${firepercent}) : null;`);
  // console.log(`FIRESCREEN2: Volume is: ${firevolume}`);
  let newVolume = currentVolume + (change * adjustment);
  newVolume = Math.max(0, Math.min(newVolume, 1)).toFixed(2);
  firebrowser.volumeLevel = newVolume;

  console.log(`FIRESCREEN2: Setting volume to: ${newVolume}`);
  // Inject the control script and immediately execute the command.
  const scriptToRun = `${mediaControlScript} window.fireScreenMediaControl({ volume: ${newVolume} });`;
  runBrowserActions(firebrowser, scriptToRun);
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

function dispatchButtonClickEvent(buttonName, message) {
  const eventDetails = { buttonName: buttonName, message: message, timestamp: new Date() };
  const buttonClickEvent = new CustomEvent('CustomButtonClick', { detail: eventDetails, bubbles: true, composed: true });
  document.dispatchEvent(buttonClickEvent);
  // console.log(`ButtonClick for button: ${buttonName} with message: "${message}"`);
};

/**
 * Sets the browser URL and manually triggers volume synchronization.
 * This is a workaround for the unreliable 'property-changed' event for the URL.
 * @param {BS.BanterBrowser} firebrowser - The browser component instance.
 * @param {string} url - The new URL to set.
 */
function setBrowserUrl(firebrowser, url) {
  if (!firebrowser) {
    console.error("setBrowserUrl: firebrowser is null or undefined.");
    return;
  }
  console.log(`FIRESCREEN2: Setting URL for ${firebrowser.gameObject.name} to: ${url}`);
  firebrowser.url = url;
  triggerVolumeSync(firebrowser);
}

/**
 * Triggers a temporary, repeated synchronization of the browser's volume.
 * This is more efficient than a persistent interval, as it only runs when needed
 * (e.g., on page load) and then stops itself.
 * @param {BS.BanterBrowser} firebrowser - The browser component instance.
 */
function triggerVolumeSync(firebrowser) {
  // If there's an existing temporary sync interval for this browser, clear it first.
  if (firebrowser.volumeSyncInterval) {
    clearInterval(firebrowser.volumeSyncInterval);
  }

  let syncCount = 0;
  const maxSyncs = 4; // How many times to sync volume after a page load
  const syncIntervalTime = 2500; // e.g., 2.5 seconds between syncs

  firebrowser.volumeSyncInterval = setInterval(() => {
    if (syncCount >= maxSyncs) {
      clearInterval(firebrowser.volumeSyncInterval);
      firebrowser.volumeSyncInterval = null; // Clean up the reference
      return;
    }

    console.log(`FIRESCREEN2: Triggering volume sync #${syncCount + 1} for browser ${firebrowser.gameObject.name}`);
    adjustVolume(firebrowser, 0); // A change of 0 just re-applies the current volume
    syncCount++;
  }, syncIntervalTime);
}

function getNextFireScreenId() {
  let id = 1;
  // Keep incrementing the ID until we find one that is not in use
  while (window.fireScreenInstances[id]) {
    id++;
  }
  console.log("getNextFireScreenId = " + id);
  return id;
}

async function setupfirescreen2() {
  // const allScriptTags = document.getElementsByTagName('script');
  // console.log("FIRESCREEN2: All script tags:", Array.from(allScriptTags).map(s => s.src));
  const allscripts = document.querySelectorAll(`script[src^='${fireScriptName}']`);
  console.log(`FIRESCREEN2: Found ${allscripts.length} matching scripts`);
  for (const script of allscripts) {
    if (script.dataset.processed) { continue; }
    const thisBrowserNumber = getNextFireScreenId(); console.log(`FIRESCREEN2: Loading browser ${thisBrowserNumber}`); script.dataset.processed = 'true';
    const defaultParams = { position: "0 2 0", rotation: "0 0 0", scale: "1 1 1", castmode: "false", "lock-position": "false", "screen-position": "0 0 -0.02", "screen-rotation": "0 0 0", "screen-scale": "1 1 1", volumelevel: "0.25",
      website: "https://firer.at/pages/games.html", mipmaps: "1", pixelsperunit: "1200", width: "1024", height: "576",
      backdrop: "true", "hand-controls": "false", "disable-interaction": "false", "disable-rotation": false, announce: "false", "announce-420": "false", "announce-events": "undefined",
      "button-color": "0 1 0 1", "backdrop-color": "0 0 0 0.9", "volup-color": "0 1 0 1", "voldown-color": "1 1 0 1", "mute-color": "1 1 1 1", "space-sync": "false",
      "icon-mute-url": "https://firer.at/files/VolumeMute.png", "icon-volup-url": "https://firer.at/files/VolumeHigh.png",
      "icon-voldown-url": "https://firer.at/files/VolumeLow.png", "icon-direction-url": "https://firer.at/files/Arrow.png",
      "custom-button01-url": "false", "custom-button01-text": "Custom Button 01",
      "custom-button02-url": "false", "custom-button02-text": "Custom Button 02",
      "custom-button03-url": "false", "custom-button03-text": "Custom Button 03",
      "custom-button04-url": "false", "custom-button04-text": "Custom Button 04",
      "custom-button05-url": "false", "custom-button05-text": "Custom Button 05"
    };

    const numberAttributes = { position: getV3FromStrv2, rotation: getV3FromStrv2, scale: getV3FromStrv2, "screen-position": getV3FromStrv2, "screen-rotation": getV3FromStrv2, "screen-scale": getV3FromStrv2, "button-color": getV4FromStr, "backdrop-color": getV4FromStr, "volup-color": getV4FromStr, "voldown-color": getV4FromStr, "mute-color": getV4FromStr };
    // Function to get or convert attribute
    const getParam = (key) => { const attr = script.getAttribute(key);
      const value = attr !== null ? attr : defaultParams[key];
      return numberAttributes[key] ? numberAttributes[key](value) : value; };

    const params = {};
    Object.keys(defaultParams).forEach(key => { params[key] = getParam(key); });

    // Add script-specific properties to the params object
    params.thisBrowserNumber = thisBrowserNumber;
    params.scriptElement = script;

    await sdk2tests(params);
  }
};

async function sdk2tests(params) {
  const {
    position: p_pos, rotation: p_rot, scale: p_sca, castmode: p_castmode, 'lock-position': p_lockposition,
    'screen-position': p_screenposition, 'screen-rotation': p_screenrotation, 'screen-scale': p_screenscale,
    volumelevel: p_volume, mipmaps: p_mipmaps, pixelsperunit: p_pixelsperunit, backdrop: p_backdrop,
    website: p_website, 'button-color': p_buttoncolor, announce: p_announce, 'announce-420': p_announce420,
    'backdrop-color': p_backdropcolor, 'icon-mute-url': p_iconmuteurl, 'icon-volup-url': p_iconvolupurl,
    'icon-voldown-url': p_iconvoldownurl, 'icon-direction-url': p_icondirectionurl, 'volup-color': p_volupcolor,
    'voldown-color': p_voldowncolor, 'mute-color': p_mutecolor, 'disable-interaction': p_disableinteraction,
    'disable-rotation': p_disableRotation, 'space-sync': p_spacesync, 'hand-controls': p_handbuttons,
    width: p_width, height: p_height, 'announce-events': p_announceevents,
    'custom-button01-url': p_custombuttonurl01, 'custom-button01-text': p_custombutton01text,
    'custom-button02-url': p_custombuttonurl02, 'custom-button02-text': p_custombutton02text,
    'custom-button03-url': p_custombuttonurl03, 'custom-button03-text': p_custombutton03text,
    'custom-button04-url': p_custombuttonurl04, 'custom-button04-text': p_custombutton04text,
    'custom-button05-url': p_custombuttonurl05, 'custom-button05-text': p_custombutton05text,
    thisBrowserNumber: p_thisBrowserNumber, scriptElement: p_scriptElement
  } = params;
  fireScreen2On = true;
  let keyboardstate = false;
  let playerislockedv2 = false;
  let customButtonObjects = [];
  const screenObject = await new BS.GameObject(`MyBrowser${p_thisBrowserNumber}`).Async(); // The main browser object
  const instanceObjects = { gameObjects: [screenObject], browserComponent: null, handControls: null, intervals: [], listeners: [], scriptElement: p_scriptElement };
  console.log(`FIRESCREEN2: Width:${p_width}, Height:${p_height}, Number:${p_thisBrowserNumber}, URL:${p_website}`);
  let firebrowser = await screenObject.AddComponent(new BS.BanterBrowser(p_website, p_mipmaps, p_pixelsperunit, p_width, p_height, null));
  firebrowser.homePage = p_website; // Set variable for default Home Page for later use
  firebrowser.volumeLevel = p_volume; // Set variable for Volume Level for later use
  firebrowser.muteState = false; // Set variable for Mute State for later use
  let isbillboarded;
  await screenObject.SetLayer(5);
  p_disableRotation ? isbillboarded = false : isbillboarded = true;
  if (p_disableinteraction === "false") { firebrowser.ToggleInteraction(true); }

  const geometryObject = await new BS.GameObject(`MainParentObject${p_thisBrowserNumber}`).Async();
  instanceObjects.gameObjects.push(geometryObject);
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
    clickHandler: () => { console.log("Home Clicked!"); setBrowserUrl(firebrowser, firebrowser.homePage);
      updateButtonColor(uiButtons.home, p_buttoncolor); dispatchButtonClickEvent("Home", `${firebrowser.homePage}`); }
    }, info: { icon: "https://firer.at/files/Info.png", position: new BS.Vector3(LButPos,0.28,0), color: p_buttoncolor,
      clickHandler: () => { console.log("Info Clicked!"); setBrowserUrl(firebrowser, "https://firer.at/pages/Info.html");
      updateButtonColor(uiButtons.info, p_buttoncolor); dispatchButtonClickEvent("Info", 'Info Clicked!'); }
    }, google: { icon: "https://firer.at/files/Google.png", position: new BS.Vector3(LButPos,0.16,0), color: whiteColour,
      clickHandler: () => { console.log("Google Clicked!"); setBrowserUrl(firebrowser, "https://google.com/");
      updateButtonColor(uiButtons.google, whiteColour); dispatchButtonClickEvent("Google", 'Google Clicked!'); }
    }, keyboard: { icon: "https://firer.at/files/Keyboard.png", position: new BS.Vector3(LButPos,-0.15,0), color: whiteColour,
      clickHandler: () => { console.log("Keyboard Clicked!"); keyboardstate = !keyboardstate; firebrowser.ToggleKeyboard(keyboardstate ? 1 : 0);
        uiButtons.keyboard.GetComponent(BS.ComponentType.BanterMaterial).color = keyboardstate ? p_buttoncolor : whiteColour; dispatchButtonClickEvent("Keyboard", 'Keyboard Clicked!'); }
    }, mute: { icon: p_iconmuteurl, position: new BS.Vector3(0.167,TButPos,0), color: p_mutecolor,
      clickHandler: () => { console.log("Mute Clicked!"); firebrowser.muteState = !firebrowser.muteState; // Toggle mute state
      const scriptToRun = `${mediaControlScript} window.fireScreenMediaControl({ mute: ${firebrowser.muteState} });`;
      runBrowserActions(firebrowser, scriptToRun);
      uiButtons.mute.GetComponent(BS.ComponentType.BanterMaterial).color = firebrowser.muteState ? new BS.Vector4(1,0,0,1) : (p_mutecolor ? p_mutecolor : p_buttoncolor); dispatchButtonClickEvent("Mute", 'Mute Clicked!'); }
    }, volDown: { icon: p_iconvoldownurl, position: new BS.Vector3(0.334,TButPos,0), color: p_voldowncolor,
      clickHandler: () => { console.log("Volume Down Clicked!"); adjustVolume(firebrowser, -1);
      updateButtonColor(uiButtons.volDown, p_voldowncolor ? p_voldowncolor : p_buttoncolor); dispatchButtonClickEvent("VolumeDown", 'Volume Down Clicked!'); }
    }, pageBack: { icon: p_icondirectionurl, position: new BS.Vector3(-0.5,TButPos,0), color: p_buttoncolor,
      clickHandler: () => { console.log("Back Clicked!"); firebrowser.RunActions(JSON.stringify({"actions":[{"actionType": "goback"}]}));
      updateButtonColor(uiButtons.pageBack, p_buttoncolor); dispatchButtonClickEvent("Back", 'Back Clicked!'); }
    }, sizeGrow: { icon: "https://firer.at/files/expand.png", position: new BS.Vector3(RButPos,0.06,0), color: p_buttoncolor,
      clickHandler: () => { console.log("Grow Clicked!"); adjustScale(geometrytransform, "grow");
      updateButtonColor(uiButtons.sizeGrow, p_buttoncolor); }
    }, sizeShrink: { icon: "https://firer.at/files/shrink.png", position: new BS.Vector3(RButPos,-0.06,0), color: p_buttoncolor,
      clickHandler: () => { console.log("Shrink Clicked!"); adjustScale(geometrytransform, "shrink");
      updateButtonColor(uiButtons.sizeShrink, p_buttoncolor); }
    }, pageForward: { icon: p_icondirectionurl, position: new BS.Vector3(-0.38,TButPos,0), color: p_buttoncolor,
      clickHandler: () => { console.log("Forward Clicked!"); firebrowser.RunActions(JSON.stringify({"actions":[{"actionType": "goforward"}]}));
      updateButtonColor(uiButtons.pageForward, p_buttoncolor); dispatchButtonClickEvent("Forward", 'Forward Clicked!'); }, rotation: new BS.Vector3(0,0,180)
    }, volUp: { icon: p_iconvolupurl, position: new BS.Vector3(0.495,TButPos,0), color: p_volupcolor,
      clickHandler: () => { console.log("Volume Up Clicked!"); adjustVolume(firebrowser, 1);
      updateButtonColor(uiButtons.volUp, p_volupcolor ? p_volupcolor : p_buttoncolor); dispatchButtonClickEvent("VolumeUp", 'Volume Up Clicked!'); }
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
  const hideShowObject = await createUIButton("FireButton_hideShow", "https://firer.at/files/Eye.png", new BS.Vector3(LButPos, 0, 0), p_buttoncolor, geometryObject);
  createButtonAction(hideShowObject, () => { console.log("HideShow Clicked!"); buttonsvisible = !buttonsvisible; toggleButtonVisibility(Object.values(uiButtons), customButtonObjects, buttonsvisible ? 1 : 0, ["FireButton_hideShow"]);
    hideShowObject.GetComponent(BS.ComponentType.BanterMaterial).color = buttonsvisible ? p_buttoncolor : new BS.Vector4(1, 1, 1, 0.5);
  });
  uiButtons.hideShow = hideShowObject;
  
  let RCButPos = 0.68; let RCTexPos = 1.59;
  if (Number(p_height) === 720) {RCButPos += 0.14; RCTexPos += 0.14;} else if (Number(p_height) === 1080) {RCButPos += 0.4; RCTexPos += 0.4;};

  const customButtonConfigs = [
    { name: 'CustomButton01', url: p_custombuttonurl01, text: p_custombutton01text, position: new BS.Vector3(RCButPos, 0.30, 0), textposition: new BS.Vector3(RCTexPos, -0.188, -0.005) },
    { name: 'CustomButton02', url: p_custombuttonurl02, text: p_custombutton02text, position: new BS.Vector3(RCButPos, 0.25, 0), textposition: new BS.Vector3(RCTexPos, -0.237, -0.005) },
    { name: 'CustomButton03', url: p_custombuttonurl03, text: p_custombutton03text, position: new BS.Vector3(RCButPos, 0.20, 0), textposition: new BS.Vector3(RCTexPos, -0.287, -0.005) },
    { name: 'CustomButton04', url: p_custombuttonurl04, text: p_custombutton04text, position: new BS.Vector3(RCButPos, 0.15, 0), textposition: new BS.Vector3(RCTexPos, -0.336, -0.005) },
    { name: 'CustomButton05', url: p_custombuttonurl05, text: p_custombutton05text, position: new BS.Vector3(RCButPos, -0.15, 0), textposition: new BS.Vector3(RCTexPos, -0.635, -0.005) }
  ];

  for (const config of customButtonConfigs) {
    if (config.url !== "false") {
      console.log(`${config.text} : ${config.url}`);
      await createCustomButton(config, firebrowser, geometryObject, customButtonObjects, p_thisBrowserNumber);
    }
  }
  instanceObjects.gameObjects.push(...Object.values(uiButtons), ...customButtonObjects);

  if (p_castmode === "true") {
    const alwaysVisibleButtons = ["FireButton_home", "FireButton_volUp", "FireButton_volDown", "FireButton_mute", "FireButton_pageBack", "FireButton_pageForward"];
    toggleButtonVisibility(Object.values(uiButtons), customButtonObjects, 0, alwaysVisibleButtons); hideShowObject.SetActive(0);
  };

  const firesbillBoard = await geometryObject.AddComponent(new BS.BanterBillboard(0, isbillboarded, isbillboarded, true));  // Bill Board the geometryObject
  geometrytransform.localScale = p_sca; // SET THE SCALE FOR THE SCREEN
  
  // --- Event Listeners ---
  const onGrab = () => {console.log("GRABBED!"); if (p_lockposition !== "true") {console.log("Not locked!"); firerigidBody.isKinematic = false; }};
  const onDrop = () => {console.log("DROPPED!"); firerigidBody.isKinematic = true; };
  firerigidBody.gameObject.On('grab', onGrab); // When user Grabs the Browser, Make it moveable
  firerigidBody.gameObject.On('drop', onDrop); // When user Drops the Browser, Lock it in place
  instanceObjects.listeners.push({ target: firerigidBody.gameObject, event: 'grab', handler: onGrab });
  instanceObjects.listeners.push({ target: firerigidBody.gameObject, event: 'drop', handler: onDrop });

  const onOneShot = async e => { console.log(e.detail);
    const data = JSON.parse(e.detail.data); const isAdmin = e.detail.fromAdmin;
    const isAuthorized = isAdmin || e.detail.fromId === "f67ed8a5ca07764685a64c7fef073ab9";
    if (!isAuthorized) {
      console.log("FIRESCREEN2: One-shot received from unauthorized user:", e.detail.fromId);
      return;
    }
    // If a target is specified and it's not this browser, ignore the command.
    // This allows for both broadcast commands (no target) and specific commands.
    if (data.target !== undefined && data.target != p_thisBrowserNumber) {
      // console.log(`FIRESCREEN2: One-shot ignored. Target: ${data.target}, This Browser: ${p_thisBrowserNumber}`);
      return; // This command is for a different browser, so this instance will ignore it.
    }
    console.log(isAdmin ? "Current Shot is from Admin" : "Current Shot is from Target ID");
    const oneShotCommands = {
      fireurl: (value) => setBrowserUrl(firebrowser, value),
      firevolume: (value) => { // This command sets the volume directly, bypassing the +/- adjustment
        const fireVolume = Number(parseFloat(value).toFixed(2)); firebrowser.volumeLevel = fireVolume;
        const scriptToRun = `${mediaControlScript} window.fireScreenMediaControl({ volume: ${fireVolume} });`;
        runBrowserActions(firebrowser, scriptToRun);
      },
      browseraction: (value) => { runBrowserActions(firebrowser, value); console.log(value); },
      spaceaction: (value) => { console.log(value); new Function(value)(); },
      gohome: (value) => { console.log(value); setBrowserUrl(firebrowser, firebrowser.homePage); dispatchButtonClickEvent("Home", `${firebrowser.homePage}`); },
      sethome: (value) => { console.log(value); firebrowser.homePage = value; setBrowserUrl(firebrowser, value); dispatchButtonClickEvent("Home", `${firebrowser.homePage}`); },
      firevolumeup: (value) => { console.log(value); adjustForAll("adjustVolume", 1); youtubePlayerControl(1); },
      firevolumedown: (value) => { console.log(value); adjustForAll("adjustVolume", -1); youtubePlayerControl(0); },
      firemutetoggle: (value) => { console.log(value); adjustForAll("toggleMute"); youtubePlayerControl(null, "mute"); },
    };
    for (const command in oneShotCommands) {
      if (data[command] !== undefined) { oneShotCommands[command](data[command]); }
    }
  };
  firescenev2.On("one-shot", onOneShot);
  instanceObjects.listeners.push({ target: firescenev2, event: 'one-shot', handler: onOneShot });
  
  async function initializeV2() { await waitForUserIdv2(); if (window.handControlsDisabled && p_handbuttons === "true" && window.firstrunhandcontrols) { playersuseridv2 = firescenev2.localUser.uid; window.handControlsDisabled = false; setupHandControlsV2(p_thisBrowserNumber, BS.LegacyAttachmentPosition.LEFT_HAND, instanceObjects); } }

  async function waitForUserIdv2() { while (!firescenev2.localUser || firescenev2.localUser.uid === undefined) { await new Promise(resolve => setTimeout(resolve, 200)); } }
  
  initializeV2();
  const onUserJoined = e => {
    if (e.detail.isLocal) { // Setup Hand Controls only on the first run if enabled
      if (p_handbuttons === "true" && window.firstrunhandcontrols) {
        window.firstrunhandcontrols = false; playersuseridv2 = e.detail.uid; instanceObjects.intervals = [];
        console.log("FIRESCREEN2: Enabling Hand Controls"); setupHandControlsV2(p_thisBrowserNumber, BS.LegacyAttachmentPosition.LEFT_HAND, instanceObjects); // setupHandControlsV2(1, BS.LegacyAttachmentPosition.RIGHT_HAND );
      };
      // console.log("FIRESCREEN2: user-joined");
      // console.log(e.detail);
      console.log("FIRESCREEN2: user-joined", e.detail);
    };
  };
  firescenev2.On("user-joined", onUserJoined);
  instanceObjects.listeners.push({ target: firescenev2, event: 'user-joined', handler: onUserJoined });

  const onUserLeft = e => { if (e.detail.isLocal) { window.firstrunhandcontrols = true;
      console.log("FIRESCREEN2: Local User Left, Resetting firstrunhandcontrols variable"); };
  };
  firescenev2.On("user-left", onUserLeft);
  instanceObjects.listeners.push({ target: firescenev2, event: 'user-left', handler: onUserLeft });

  const originalWarn = console.warn;

  // This is a clever workaround for an SDK bug where 'user-joined' doesn't fire for the local user on world load.
  // It listens for a specific warning that indicates the user is already present and then fires a custom event.
  console.warn = function (...args) {
      if (typeof args[0] === "string" && args[0].includes("got user-joined event for user that already joined")) {
          const user = args[1];
          firescenev2.dispatchEvent(new CustomEvent("user-already-joined", {
              detail: user
          }));
      }

      originalWarn.apply(console, args);
  };

  const onUserAlreadyJoined = (e) => {
      console.log("User already joined:", e.detail);
      if (p_handbuttons === "true" && e.detail.isLocal && window.notalreadyjoined) { window.notalreadyjoined = false; window.firstrunhandcontrols = false; playersuseridv2 = e.detail.uid;
        console.log("FIRESCREEN2: Local User-already-joined, Enabling Hand Controls");
        console.log(`window.firstrunhandcontrols:${window.firstrunhandcontrols}`);
        setTimeout(async () => {  setupHandControlsV2(p_thisBrowserNumber, BS.LegacyAttachmentPosition.LEFT_HAND, instanceObjects); // setupHandControlsV2(1, BS.LegacyAttachmentPosition.RIGHT_HAND); 
          window.notalreadyjoined = true; }, 3000);
      };
  };
  firescenev2.addEventListener("user-already-joined", onUserAlreadyJoined);
  instanceObjects.listeners.push({ target: firescenev2, event: 'user-already-joined', handler: onUserAlreadyJoined, useRemoveListener: true });

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

  async function setupHandControlsV2(id, positionofcontrols, instanceObjects) {
    // THE CONTAINER FOR THE HAND BUTTONS
    const plane20Object = await new BS.GameObject(`handContainer${id}`).Async();
    instanceObjects.handControls = plane20Object;
    instanceObjects.gameObjects.push(plane20Object);
    const plane20geometry = await createGeometry(plane20Object, BS.GeometryType.PlaneGeometry);
    const plane20Collider = await plane20Object.AddComponent(new BS.BoxCollider(true, new BS.Vector3(0, 0, 0), new BS.Vector3(1,1,1)));
    const plane20material = await createMaterial(plane20Object, { shaderName: defaulTransparent, color: new BS.Vector4(0,0,0,0), side: 1 });
    const plane20transform = await plane20Object.AddComponent(new BS.Transform());
    plane20transform.localPosition = new BS.Vector3(0,0.046,0.030);
    plane20transform.localScale = new BS.Vector3(0.1,0.1,0.1);
    // plane20transform.eulerAngles = new BS.Vector3(5,-95,0);
    plane20transform.rotation = new BS.Vector4(0.25,0,0.8,1);
    setTimeout(async () => { await firescenev2.LegacyAttachObject(plane20Object, playersuseridv2, positionofcontrols); }, 1000);

    const handButtons = {};
    const handButtonConfigs = [
      { name: 'hVolumeUpButton', icon: p_iconvolupurl, pos: new BS.Vector3(0.4, 0.4, 0.3), color: p_volupcolor, clickHandler: (btn) => { adjustForAll("adjustVolume", 1); youtubePlayerControl(1); updateButtonColor(btn, p_volupcolor); } },
      { name: 'hVolumeDownButton', icon: p_iconvoldownurl, pos: new BS.Vector3(0.0, 0.4, 0.3), color: p_voldowncolor, clickHandler: (btn) => { adjustForAll("adjustVolume", -1); youtubePlayerControl(0); updateButtonColor(btn, p_voldowncolor); } },
      { name: 'hMuteButton', icon: p_iconmuteurl, pos: new BS.Vector3(-0.4, 0.4, 0.3), color: p_mutecolor, clickHandler: (btn) => {
          adjustForAll("toggleMute");
          youtubePlayerControl(null, "mute");
          const firstBrowser = window.fireScreenInstances[Object.keys(window.fireScreenInstances)[0]]?.browserComponent;
          if (firstBrowser) {
            const muteMaterial = btn.GetComponent(BS.ComponentType.BanterMaterial);
            muteMaterial.color = firstBrowser.muteState ? new BS.Vector4(1, 0, 0, 1) : p_mutecolor;
          }
        }
      },
      { name: 'hLockButton', icon: 'https://firer.at/files/lock.png', pos: new BS.Vector3(0, -0.1, 0.3), color: new BS.Vector4(1, 1, 1, 0.7), clickHandler: (btn) => {
          playerislockedv2 = !playerislockedv2;
          playerislockedv2 ? firescenev2.LegacyLockPlayer() : firescenev2.LegacyUnlockPlayer();
          const lockMaterial = btn.GetComponent(BS.ComponentType.BanterMaterial);
          lockMaterial.color = playerislockedv2 ? new BS.Vector4(1, 0, 0, 1) : new BS.Vector4(1, 1, 1, 0.7);
        }
      },
      { name: 'hHomeButton', icon: 'https://firer.at/files/Home.png', pos: new BS.Vector3(0.4, -0.1, 0.3), color: p_buttoncolor, clickHandler: (btn) => { adjustForAll("goHome"); youtubePlayerControl(null, "openPlaylist"); updateButtonColor(btn, p_buttoncolor); } }
    ];

    for (const config of handButtonConfigs) {
      const button = await createUIButton(config.name, config.icon, config.pos, config.color, plane20Object, () => config.clickHandler(button), new BS.Vector3(180, 0, 0), 1, 1, defaulTransparent, new BS.Vector3(0.4, 0.4, 0.4));
      handButtons[config.name] = button;
    }

    instanceObjects.gameObjects.push(...Object.values(handButtons));
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
  if (p_spacesync === 'true') { const syncedurl = await getSpaceStateStuff('fireurl');
    if (syncedurl) setBrowserUrl(firebrowser, syncedurl);
    await createCustomButton({ name: "SpaceSyncButton", text: "Synced Button",
      position: new BS.Vector3(RCButPos, 0.35, 0), textposition: new BS.Vector3(RCTexPos, -0.139, -0.005),
      clickHandler: async () => { const newUrl = await getSpaceStateStuff('fireurl'); if (newUrl) setBrowserUrl(firebrowser, newUrl); }
    }, firebrowser, geometryObject, customButtonObjects, p_thisBrowserNumber);
  };
 
  // Trigger the volume sync once on initial load.
  // Subsequent syncs are triggered by the setBrowserUrl helper function.
  setTimeout(() => triggerVolumeSync(firebrowser), 3000);
  instanceObjects.browserComponent = firebrowser;
  // Add the completed instance to the global registry
  window.fireScreenInstances[p_thisBrowserNumber] = instanceObjects;
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

async function cleanupFireScreenV2(instanceId) {
  const instance = window.fireScreenInstances[instanceId];
  if (!instance) {
    console.error(`FireScreenV2: Instance ${instanceId} not found for cleanup.`);
    return;
  }

  console.log(`FireScreenV2: Cleaning up instance ${instanceId}.`);

  // 1. Clear all intervals, including the temporary volume sync one
  instance.intervals.forEach(intervalId => clearInterval(intervalId));
  if (instance.browserComponent && instance.browserComponent.volumeSyncInterval) {
    clearInterval(instance.browserComponent.volumeSyncInterval);
    instance.browserComponent.volumeSyncInterval = null;
  }
  console.log(`FireScreenV2: Cleared ${instance.intervals.length} intervals.`);

  // 2. Remove all event listeners
  instance.listeners.forEach(({ target, event, handler, useRemoveListener }) => {
    if (target) {
      try {
        useRemoveListener ? target.removeEventListener(event, handler) : target.Off(event, handler);
      } catch (e) {
        console.warn(`FireScreenV2: Error removing listener for event '${event}':`, e);
      }
    }
  });
  console.log(`FireScreenV2: Removed ${instance.listeners.length} event listeners.`);

  // 3. Destroy all tracked GameObjects
  for (const gameObject of instance.gameObjects) {
    if (gameObject && !gameObject.destroyed) {
      try {
        await gameObject.Destroy();
      } catch (e) {
        console.warn(`FireScreenV2: Error destroying GameObject ${gameObject.name}:`, e);
      }
    }
  }
  console.log(`FireScreenV2: Destroyed ${instance.gameObjects.length} GameObjects.`);
  
  // 4. Remove the script tag from the DOM
  if (instance.scriptElement && instance.scriptElement.parentElement) {
    instance.scriptElement.parentElement.removeChild(instance.scriptElement);
    console.log(`FireScreenV2: Removed script tag for instance ${instanceId}.`);
  }

  // 5. Remove the instance from the registry
  delete window.fireScreenInstances[instanceId];
  console.log(`FireScreenV2: Instance ${instanceId} removed from registry.`);

  // 6. Optional: Check if any instances are left and perform global cleanup
  if (Object.keys(window.fireScreenInstances).length === 0) {
    console.log("FireScreenV2: All instances cleaned up.");
    fireScreen2On = false;
  }
}

window.cleanupFireScreenV2 = cleanupFireScreenV2;

window.setupfirescreen2 = setupfirescreen2;

function adjustForAll(action, change) {
  // Iterate over all registered FireScreen instances
  for (const instanceId in window.fireScreenInstances) {
    const instance = window.fireScreenInstances[instanceId];
    if (instance && instance.browserComponent) {
      const thebrowserpart = instance.browserComponent;

      switch (action) {
        case "adjustVolume":
          adjustVolume(thebrowserpart, change);
          break;
        case "goHome":
          setBrowserUrl(thebrowserpart, thebrowserpart.homePage);
          dispatchButtonClickEvent("Home", `${thebrowserpart.homePage}`);
          break;
        case "goURL":
          setBrowserUrl(thebrowserpart, change);
          break;
        case "toggleMute":
          thebrowserpart.muteState = !thebrowserpart.muteState;
          const scriptToRun = `${mediaControlScript} window.fireScreenMediaControl({ mute: ${thebrowserpart.muteState} });`;
          runBrowserActions(thebrowserpart, scriptToRun);
          break;
        case "browserAction":
          runBrowserActions(thebrowserpart, `${change}`);
          break;
      }
      console.log(`adjustForAll: Action '${action}' applied to instance ${instanceId}`);
    } else {
      console.warn(`adjustForAll: Could not find browser instance ${instanceId}. It might have been cleaned up or not initialized correctly.`);
    }
  }
}

async function getSpaceStateStuff(argument) {
  // Wait until the localUser is available before trying to access space state.
  while (!firescenev2.localUser || firescenev2.localUser.uid === undefined) {
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  // Once the user is available, get the state property.
  return spaceStateStuff(argument);
}

function spaceStateStuff(argument) {
  const spaceState = BS.BanterScene.GetInstance().spaceState;

  // Safely log all properties, but only do it once per session.
  if (!window.fireScreenSpaceStateLogged) {
    console.log("--- Logging All Space State Properties (once per session) ---");
    if (spaceState.public) {
      console.log("--- Public Space State ---");
      // Using Object.entries as it's proven to be safe with the spaceState object
      for (const [key, value] of Object.entries(spaceState.public)) {
        console.log(`  ${key}:`, value);
      }
    }
    if (spaceState.protected) {
      console.log("--- Protected Space State ---");
      for (const [key, value] of Object.entries(spaceState.protected)) {
        console.log(`  ${key}:`, value);
      }
    }
    window.fireScreenSpaceStateLogged = true;
  }
  // Find and return the requested value using the safe iteration method.
  // Prioritize protected properties.
  if (spaceState.protected) {
    for (const [key, value] of Object.entries(spaceState.protected)) {
      if (key === argument) return value;
    }
  }
  // Fallback to public properties.
  if (spaceState.public) {
    for (const [key, value] of Object.entries(spaceState.public)) {
      if (key === argument) return value;
    }
  }
  console.log(`Could not find space state key: '${argument}', returning null.`);
  return null;
};

  // Mark the script as initialized
  window.fireScreenScriptInitialized = true;
  console.log("FIRESCREEN2: Core script functions initialized.");

} // End of one-time initialization block

(async () => {
  // This function will attempt to acquire a lock and run the setup.
  // If the lock is already taken, it will wait and retry.
  async function attemptSetup() {
    if (window.fireScreenSetupRunning) {
      console.log("FIRESCREEN2: Setup in progress. Waiting to retry...");
      setTimeout(attemptSetup, 500); // Wait 500ms and try again
      return;
    }

    // Acquire lock
    window.fireScreenSetupRunning = true;
    console.log("FIRESCREEN2: Lock acquired, starting setup...");

    try {
      // This function is now async and processes all unprocessed scripts sequentially.
      await window.setupfirescreen2();
    } finally {
      console.log("FIRESCREEN2: Setup finished, releasing lock.");
      window.fireScreenSetupRunning = false;
    }
  }

  // Initial call to start the process for this script instance.
  attemptSetup();
})();

// setProtectedSpaceProp('fireurl', "https://firer.at/");
// await BS.BanterScene.GetInstance().OneShot(JSON.stringify({firevolume: "0.5"}));
// await BS.BanterScene.GetInstance().OneShot(JSON.stringify({fireurl: "https://firer.at/"}));
// oneShot({fireurl: "https://firer.at/"});
// oneShot({firevolume: "0.5"});
// oneShot({browseraction: "action"});
// oneShot({browseraction: `window.bantermessage(window.alert('test'));`});

// (await BS.BanterScene.GetInstance().Find(`MyBrowser1`)).GetComponent(BS.ComponentType.BanterBrowser).RunActions(JSON.stringify({"actions": [{ "actionType": "runscript","strparam1": 
//   `window.bantermessage(window.alert('test'))` 
// }]}));

// scene.SetPublicSpaceProps({'testing': 'test'});
// let thebrowserpart = (await BS.BanterScene.GetInstance().Find(`MyBrowser${1}`)).GetComponent(BS.ComponentType.BanterBrowser);
// thebrowserpart.RunActions(JSON.stringify({"actions": [{ "actionType": "click2d","numParam1": 0.5, "numParam2": 0.5 }]}));
// v = {}; v.id = "ApXoWvfEYVU"; v.link = "https://www.youtube.com/watch?v=ApXoWvfEYVU"; v.title = "This is Not the Right Title for This Video"; v.thumbnail = "https://daily.jstor.org/wp-content/uploads/2015/08/Fire.jpg"; 
// window.videoPlayerCore.sendMessage({path: Commands.ADD_TO_PLAYLIST, data: v });

// let browserthing = await BS.BanterScene.GetInstance().Find(`MyBrowser2`)
// let componenttest = browserthing.GetComponent(BS.ComponentType.BanterBrowser)
// componenttest.WatchProperties([BS.PropertyName.url])
// componenttest.url
// cleanupFireScreenV2(1)
// await BS.BanterScene.GetInstance().OneShot(JSON.stringify({ sethome: "https://google.com", target: 2 }));