// This new file encapsulates all logic for a single FireScreen instance.

const mediaControlScript = `
(function() {
    // --- Universal Media Control Function ---
    window.fireScreenMediaControl = function(options) {
        const { volume, mute } = options;
        function controlMedia(doc) {
            doc.querySelectorAll('video, audio').forEach(el => {
                try {
                    if (volume !== undefined && 'volume' in el && !el.muted) el.volume = volume;
                    if (mute !== undefined && 'muted' in el) el.muted = mute;
                } catch (e) { /* Suppress errors */ }
            });
            const ytPlayer = doc.querySelector('.html5-video-player');
            if (ytPlayer) {
                try {
                    if (volume !== undefined && typeof ytPlayer.setVolume === 'function') ytPlayer.setVolume(volume * 100);
                    if (mute !== undefined) {
                        if (mute && typeof ytPlayer.mute === 'function') ytPlayer.mute();
                        if (!mute && typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
                    }
                } catch(e) { /* Suppress errors */ }
            }
            doc.querySelectorAll('iframe').forEach(iframe => {
                try { if (iframe.contentDocument) controlMedia(iframe.contentDocument); } catch (e) { /* Suppress errors */ }
            });
        }
        controlMedia(window.document);
    };
})();
`;

// Makes the page fit the screen on Quest. There the browser is Android's WebView, which lays a
// page out in CSS pixels several device pixels wide, so sites look zoomed in, need panning, and
// clicks land away from the pointer. This sets the page's viewport to the screen's width at a
// scale of 1 / devicePixelRatio, so it lays out as it does on PC. On PC the viewport tag is
// ignored. It runs on every page the screen shows (sites can change their own tag, so it checks
// each second); a second run on the same page does nothing. `debug` shows the numbers on the page.
function pageFitScript(pageWidth, debug) {
    return `
(function() {
  if (window.__fireScreenFit) return;
  window.__fireScreenFit = true;
  var W = ${Number(pageWidth) || 1024}, DEBUG = ${debug ? 'true' : 'false'}, info = null;
  function fit() {
    var head = document.head || document.documentElement;
    if (!head) return;
    var dpr = window.devicePixelRatio > 0 ? window.devicePixelRatio : 1;
    var s = Math.round(1000 / dpr) / 1000;
    var want = 'width=' + W + ', initial-scale=' + s + ', minimum-scale=' + s + ', maximum-scale=' + s + ', user-scalable=no';
    var metas = document.querySelectorAll('meta[name="viewport"]');
    for (var i = 1; i < metas.length; i++) metas[i].remove();
    var m = metas[0];
    if (!m) { m = document.createElement('meta'); m.name = 'viewport'; head.appendChild(m); }
    if (m.getAttribute('content') !== want) m.setAttribute('content', want);
    if (DEBUG && document.body) {
      if (!info) {
        info = document.createElement('div');
        info.style.cssText = 'position:fixed;left:8px;bottom:8px;right:8px;z-index:2147483647;padding:6px 10px;white-space:pre-wrap;font:14px monospace;color:#fff;background:rgba(0,0,0,0.75);pointer-events:none';
      }
      if (!info.isConnected) document.body.appendChild(info);
      var vv = window.visualViewport;
      info.textContent = 'window ' + window.innerWidth + ' x ' + window.innerHeight + ', devicePixelRatio ' + dpr.toFixed(3) +
        (vv ? ', zoom ' + vv.scale.toFixed(3) + ', showing ' + vv.width.toFixed(1) + ' x ' + vv.height.toFixed(1) : '') +
        '\\npage ' + document.documentElement.scrollWidth + ' x ' + document.documentElement.scrollHeight + ', viewport tag: ' + want;
    }
  }
  fit();
  setInterval(fit, 1000);
  window.addEventListener('resize', fit);
})();
`;
}

// Clients on the current SDK ignore pixelsperunit and draw every page at this many pixels per metre.
const SDK_PIXELS_PER_M = 1300;

const CONSTANTS = {
    SHADERS: {
        CUSTOM_BUTTON: 'Unlit/Diffuse',
        DEFAULT_TRANSPARENT: 'Unlit/DiffuseTransparent',
    },
    COLORS: {
        WHITE: new BS.Vector4(1, 1, 1, 1),
        TEXT_PLANE: new BS.Vector4(0.1, 0.1, 0.1, 1),
        BUTTON_ACTIVE_FLASH: new BS.Vector4(1, 1, 1, 0.7),
        BUTTON_LOCKED: new BS.Vector4(1, 0, 0, 1),
        BUTTON_UNLOCKED: new BS.Vector4(1, 1, 1, 0.7),
        BUTTON_HIDDEN: new BS.Vector4(1, 1, 1, 0.5),
        CUSTOM_BUTTON_ACTIVE_FLASH: new BS.Vector4(0.3, 0.3, 0.3, 1),
    },
    LAYOUT: {
        PLANE: {
            WIDTH: 1.09,
            HEIGHT: 0.64,
            COLLIDER_DEPTH: 0.01
        },
        DEFAULT_BUTTON_COLLIDER_DEPTH: 0.01,
        CUSTOM_BUTTON_WIDTH: 0.2,
        CUSTOM_BUTTON_HEIGHT: 0.04,
        HAND_CONTROLS: {
            // The Fire-V-Player's hand-controls position and rotation, in the hand's own axes.
            WRAPPER_POS: new BS.Vector3(0, 0.046, 0.07),
            WRAPPER_ROT: new BS.Vector3(0, 90, 180),
            CONTAINER_SCALE: new BS.Vector3(0.1, 0.1, 0.1),
            BUTTON_SCALE: new BS.Vector3(0.4, 0.4, 0.4)
        }
    },
    ICONS: {
        HOME: "https://firer.at/files/Home.png",
        INFO: "https://firer.at/files/Info.png",
        GOOGLE: "https://firer.at/files/Google.png",
        KEYBOARD: "https://firer.at/files/Keyboard.png",
        EXPAND: "https://firer.at/files/expand.png",
        SHRINK: "https://firer.at/files/shrink.png",
        ROTATION: "https://firer.at/files/Rot.png",
        EYE: "https://firer.at/files/Eye.png",
        LOCK: 'https://firer.at/files/lock.png',
    }
};

export class FireScreen {
    constructor(params, manager) {
        this.params = params;
        this.id = params.thisBrowserNumber;
        this.banterscene = BS.BanterScene.GetInstance();
        this.manager = manager;

        // Instance State
        this.gameObjects = [];
        this.listeners = [];
        this.handControlGameObjects = [];
        this.intervals = [];
        this.uiHandButtons = {};
        this.handControls = null;
        this.handAttachTimeout = null;
        this.browserComponent = null;
        this.scriptElement = params.scriptElement;

        this.keyboardstate = false;
        this.playerislockedv2 = false;
        this.customButtonObjects = [];
        this.isbillboarded = !params['disable-rotation'];
        this.buttonsvisible = true;

        // GameObject references
        this.uiButtons = {};
        this.geometryObject = null;
        this.screenObject = null;
        this.firerigidBody = null;
        this.firesbillBoard = null;
        this.geometrytransform = null;
    }

    async initialize() {
        const p = this.params;

        this.screenObject = await new BS.GameObject(`MyBrowser${this.id}`).Async();
        this.gameObjects.push(this.screenObject);

        console.log(`FIRESCREEN_INSTANCE[${this.id}]: Initializing with Width:${p.width}, Height:${p.height}, URL:${p.website}`);
        // As the Fire-V-Player does: the page is drawn at SDK_PIXELS_PER_M (clients on the SDK ignore
        // pixelsPerUnit and use that anyway; older ones honour it) and the screen object is scaled to
        // the size it should be in the world (see _computeLayout). The last argument is the startup
        // actions as JSON text; null made the client log a parse error.
        this.browserComponent = await this.screenObject.AddComponent(new BS.BanterBrowser(p.website, p.mipmaps, SDK_PIXELS_PER_M, p.width, p.height, JSON.stringify({ actions: [] })));
        this.browserComponent.homePage = p.website;
        this.browserComponent.volumeLevel = p.volumelevel;
        this.browserComponent.muteState = false;

        await this.screenObject.SetLayer(5);
        if (p['disable-interaction'] === "false") {
            this.browserComponent.ToggleInteraction(true);
        }
        if (p['fit-page'] !== "false") {
            // Each page needs it once, but links clicked inside the page load new pages without
            // telling the space, so check every couple of seconds (it does nothing on a page that has it).
            const fitScript = pageFitScript(p.width, p['screen-debug'] === "true");
            this.intervals.push(setInterval(() => this._runBrowserActions(fitScript), 2000));
        }

        const L = this.layout = this._computeLayout();
        this.geometryObject = await new BS.GameObject(`MainParentObject${this.id}`).Async();
        this.gameObjects.push(this.geometryObject);
        await this._createGeometry(this.geometryObject, BS.GeometryType.PlaneGeometry, { thewidth: L.backdropWidth, theheight: L.backdropHeight });

        this.geometrytransform = await this.geometryObject.AddComponent(new BS.Transform());
        this.geometrytransform.position = p.position;
        this.geometrytransform.eulerAngles = p.rotation;
        this.geometrytransform.localScale = p.scale;

        // The screen moves only by its handle, a pill just under it, made as the Fire-V-Player's
        // playlist panel makes its pill (see _addScreenHandle).
        this.grabbable = p['lock-position'] !== "true";
        if (this.grabbable) {
            let handle = null;
            try {
                handle = await this._addScreenHandle(L.handleY, p['handle-color']);
            } catch (e) {
                console.warn(`FIRESCREEN_INSTANCE[${this.id}]: Could not make the screen's handle grabbable:`, e);
            }
            if (handle) {
                this.gameObjects.push(handle);
            } else if (BS.BoxCollider) {
                // No pill on this client: grab the backdrop instead, the old way.
                await this.geometryObject.AddComponent(new BS.BoxCollider(false, new BS.Vector3(0, 0, 0), new BS.Vector3(L.backdropWidth, L.backdropHeight, CONSTANTS.LAYOUT.PLANE.COLLIDER_DEPTH)));
                await this.geometryObject.SetLayer(20);
            }
        }
        if (!this.firerigidBody) {
            // Locked in place (or the handle failed): a still Rigidbody, as before.
            this.firerigidBody = await this.geometryObject.AddComponent(new BS.BanterRigidbody(1, 10, 10, true, false, new BS.Vector3(0, 0, 0), 0, false, false, false, false, false, false, new BS.Vector3(0, 0, 0), new BS.Vector3(0, 0, 0)));
        }

        const backdropColor = p.backdrop !== "true" ? new BS.Vector4(0, 0, 0, 0) : p['backdrop-color'];
        await this._createMaterial(this.geometryObject, { color: backdropColor });

        const browsertransform = await this.screenObject.AddComponent(new BS.Transform());
        browsertransform.position = p['screen-position'];
        const s = p['screen-scale'];
        browsertransform.localScale = new BS.Vector3(s.x * L.pageScale, s.y * L.pageScale, s.z);
        browsertransform.eulerAngles = p['screen-rotation'];
        await this.screenObject.SetParent(this.geometryObject, false);

        await this.geometryObject.AddComponent(new BS.BanterPhysicMaterial(100, 100));

        this.firesbillBoard = await this.geometryObject.AddComponent(new BS.BanterBillboard(0, this.isbillboarded, this.isbillboarded, true));

        await this._createAllUI();
        this._setupEventListeners();

        // Trigger the volume sync once on initial load.
        setTimeout(() => this._triggerVolumeSync(), 3000);
    }

    handleCommand(data) {
        const commands = {
            // Commands for THIS instance, called by the manager
            fireurl: (value) => this._setBrowserUrl(value),
            firevolume: (value) => {
                const fireVolume = Number(parseFloat(value).toFixed(2));
                this.browserComponent.volumeLevel = fireVolume;
                const scriptToRun = `${mediaControlScript} window.fireScreenMediaControl({ volume: ${fireVolume} });`;
                this._runBrowserActions(scriptToRun);
            },
            browseraction: (value) => this._runBrowserActions(value),
            goHome: () => this._setBrowserUrl(this.browserComponent.homePage),
            sethome: (value) => {
                this.browserComponent.homePage = value;
                this._setBrowserUrl(value);
            },
            adjustVolume: (change) => this._adjustVolume(change),
            toggleMute: () => {
                this.browserComponent.muteState = !this.browserComponent.muteState; // Toggle state
                const scriptToRun = `${mediaControlScript} window.fireScreenMediaControl({ mute: ${this.browserComponent.muteState} });`;
                this._runBrowserActions(scriptToRun); // Update the hand control button color if it exists on this instance.
                if (this.uiHandButtons.hMuteButton) {
                    const p = this.params;
                    this.uiHandButtons.hMuteButton.GetComponent(BS.ComponentType.BanterMaterial).color =
                        this.browserComponent.muteState ? CONSTANTS.COLORS.BUTTON_LOCKED : (p['mute-color'] || p['button-color']);
                }
            }
        };

        for (const command in commands) {
            if (data[command] !== undefined) {
                commands[command](data[command]);
            }
        }
    }

    async _createAllUI() {
        const p = this.params;
        // Around the backdrop, which is sized to the page (see _computeLayout).
        const TButPos = this.layout.top, LButPos = this.layout.left, RButPos = this.layout.right;

        const BUTTON_CONFIGS = {
            home: { icon: CONSTANTS.ICONS.HOME, position: new BS.Vector3(-0.2, TButPos, 0), color: p['button-color'], clickHandler: () => { this._setBrowserUrl(this.browserComponent.homePage); this._updateButtonColor(this.uiButtons.home, p['button-color']); this._dispatchButtonClickEvent("Home", `${this.browserComponent.homePage}`); } },
            info: { icon: CONSTANTS.ICONS.INFO, position: new BS.Vector3(LButPos, 0.28, 0), color: p['button-color'], clickHandler: () => { this._setBrowserUrl("https://firer.at/pages/Info.html"); this._updateButtonColor(this.uiButtons.info, p['button-color']); this._dispatchButtonClickEvent("Info", 'Info Clicked!'); } },
            google: { icon: CONSTANTS.ICONS.GOOGLE, position: new BS.Vector3(LButPos, 0.16, 0), color: CONSTANTS.COLORS.WHITE, clickHandler: () => { this._setBrowserUrl("https://google.com/"); this._updateButtonColor(this.uiButtons.google, CONSTANTS.COLORS.WHITE); this._dispatchButtonClickEvent("Google", 'Google Clicked!'); } },
            keyboard: { icon: CONSTANTS.ICONS.KEYBOARD, position: new BS.Vector3(LButPos, -0.15, 0), color: CONSTANTS.COLORS.WHITE, clickHandler: () => { this.keyboardstate = !this.keyboardstate; this.browserComponent.ToggleKeyboard(this.keyboardstate ? 1 : 0); this.uiButtons.keyboard.GetComponent(BS.ComponentType.BanterMaterial).color = this.keyboardstate ? p['button-color'] : CONSTANTS.COLORS.WHITE; this._dispatchButtonClickEvent("Keyboard", 'Keyboard Clicked!'); } },
            mute: { icon: p['icon-mute-url'], position: new BS.Vector3(0.167, TButPos, 0), color: p['mute-color'], clickHandler: () => { this.browserComponent.muteState = !this.browserComponent.muteState; this._runBrowserActions(`${mediaControlScript} window.fireScreenMediaControl({ mute: ${this.browserComponent.muteState} });`); this.uiButtons.mute.GetComponent(BS.ComponentType.BanterMaterial).color = this.browserComponent.muteState ? CONSTANTS.COLORS.BUTTON_LOCKED : (p['mute-color'] || p['button-color']); this._dispatchButtonClickEvent("Mute", 'Mute Clicked!'); } },
            volDown: { icon: p['icon-voldown-url'], position: new BS.Vector3(0.334, TButPos, 0), color: p['voldown-color'], clickHandler: () => { this._adjustVolume(-1); this._updateButtonColor(this.uiButtons.volDown, p['voldown-color'] || p['button-color']); this._dispatchButtonClickEvent("VolumeDown", 'Volume Down Clicked!'); } },
            pageBack: { icon: p['icon-direction-url'], position: new BS.Vector3(-0.5, TButPos, 0), color: p['button-color'], clickHandler: () => { this.browserComponent.RunActions(JSON.stringify({ "actions": [{ "actionType": "goback" }] })); this._updateButtonColor(this.uiButtons.pageBack, p['button-color']); this._dispatchButtonClickEvent("Back", 'Back Clicked!'); } },
            sizeGrow: { icon: CONSTANTS.ICONS.EXPAND, position: new BS.Vector3(RButPos, 0.06, 0), color: p['button-color'], clickHandler: () => { this._adjustScale("grow"); this._updateButtonColor(this.uiButtons.sizeGrow, p['button-color']); } },
            sizeShrink: { icon: CONSTANTS.ICONS.SHRINK, position: new BS.Vector3(RButPos, -0.06, 0), color: p['button-color'], clickHandler: () => { this._adjustScale("shrink"); this._updateButtonColor(this.uiButtons.sizeShrink, p['button-color']); } },
            pageForward: { icon: p['icon-direction-url'], position: new BS.Vector3(-0.38, TButPos, 0), color: p['button-color'], clickHandler: () => { this.browserComponent.RunActions(JSON.stringify({ "actions": [{ "actionType": "goforward" }] })); this._updateButtonColor(this.uiButtons.pageForward, p['button-color']); this._dispatchButtonClickEvent("Forward", 'Forward Clicked!'); }, rotation: new BS.Vector3(0, 0, 180) },
            volUp: { icon: p['icon-volup-url'], position: new BS.Vector3(0.495, TButPos, 0), color: p['volup-color'], clickHandler: () => { this._adjustVolume(1); this._updateButtonColor(this.uiButtons.volUp, p['volup-color'] || p['button-color']); this._dispatchButtonClickEvent("VolumeUp", 'Volume Up Clicked!'); } },
            billboard: { icon: CONSTANTS.ICONS.ROTATION, position: new BS.Vector3(LButPos, -0.3, 0), color: this.isbillboarded ? p['button-color'] : CONSTANTS.COLORS.WHITE, clickHandler: () => { this.isbillboarded = !this.isbillboarded; this.firesbillBoard.enableXAxis = this.isbillboarded; this.firesbillBoard.enableYAxis = this.isbillboarded; this.uiButtons.billboard.GetComponent(BS.ComponentType.BanterMaterial).color = this.isbillboarded ? p['button-color'] : CONSTANTS.COLORS.WHITE; } }
        };

        for (const [name, config] of Object.entries(BUTTON_CONFIGS)) {
            this.uiButtons[name] = await this._createUIButton(`FireButton_${name}`, config.icon, config.position, config.color, this.geometryObject, config.clickHandler, config.rotation);
        }

        const hideShowObject = await this._createUIButton("FireButton_hideShow", CONSTANTS.ICONS.EYE, new BS.Vector3(LButPos, 0, 0), p['button-color'], this.geometryObject);
        this._createButtonAction(hideShowObject, () => {
            this.buttonsvisible = !this.buttonsvisible;
            this._toggleButtonVisibility(Object.values(this.uiButtons), this.customButtonObjects, this.buttonsvisible, ["FireButton_hideShow"]);
            hideShowObject.GetComponent(BS.ComponentType.BanterMaterial).color = this.buttonsvisible ? p['button-color'] : CONSTANTS.COLORS.BUTTON_HIDDEN;
        });
        this.uiButtons.hideShow = hideShowObject;

        const RCButPos = this.layout.customX;

        const customButtonConfigs = [
            { name: 'CustomButton01', url: p['custom-button01-url'], text: p['custom-button01-text'], position: new BS.Vector3(RCButPos, 0.30, 0) },
            { name: 'CustomButton02', url: p['custom-button02-url'], text: p['custom-button02-text'], position: new BS.Vector3(RCButPos, 0.25, 0) },
            { name: 'CustomButton03', url: p['custom-button03-url'], text: p['custom-button03-text'], position: new BS.Vector3(RCButPos, 0.20, 0) },
            { name: 'CustomButton04', url: p['custom-button04-url'], text: p['custom-button04-text'], position: new BS.Vector3(RCButPos, 0.15, 0) },
            { name: 'CustomButton05', url: p['custom-button05-url'], text: p['custom-button05-text'], position: new BS.Vector3(RCButPos, -0.15, 0) }
        ];

        for (const config of customButtonConfigs) {
            if (config.url !== "false") {
                await this._createCustomButton(config);
            }
        }

        this.gameObjects.push(...Object.values(this.uiButtons), ...this.customButtonObjects);

        if (p.castmode === "true") {
            const alwaysVisibleButtons = ["FireButton_home", "FireButton_volUp", "FireButton_volDown", "FireButton_mute", "FireButton_pageBack", "FireButton_pageForward"];
            this._toggleButtonVisibility(Object.values(this.uiButtons), this.customButtonObjects, false, alwaysVisibleButtons);
            this.uiButtons.hideShow.SetActive(false);
        }

        if (p['space-sync'] === 'true') {
            const syncedurl = await this._getSpaceStateStuff('fireurl');
            if (syncedurl) this._setBrowserUrl(syncedurl);

            await this._createCustomButton({
                name: "SpaceSyncButton",
                text: "Synced Button",
                position: new BS.Vector3(RCButPos, 0.35, 0),
                clickHandler: async () => { var newSyncUrl = await this._getSpaceStateStuff('fireurl'); if (newSyncUrl) this._setBrowserUrl(newSyncUrl); }
            });
        }
    }

    _setupEventListeners() {
        // Free to move only while held (see _addScreenHandle); let go, it stops and stays put.
        const onGrab = () => {
            if (this.grabbable) this._holdStill(false);
        };
        const onDrop = () => {
            if (this.grabbable) this._holdStill(true);
        };

        this.geometryObject.On('grab', onGrab);
        this.geometryObject.On('drop', onDrop);
        this.listeners.push({ target: this.geometryObject, event: 'grab', handler: onGrab });
        this.listeners.push({ target: this.geometryObject, event: 'drop', handler: onDrop });
    }

    // Sizes the screen, the backdrop and the button places. As in the Fire-V-Player, width and height
    // are the page's resolution and only make it sharper: the screen stays the same size in the
    // world. screen-width sets that size in metres (1 by default, as the Fire-V-Player's screen);
    // pixelsperunit no longer does. The height follows the page's shape.
    _computeLayout() {
        const p = this.params;
        const pagePxWide = Number(p.width) > 0 ? Number(p.width) : 1024;
        const pagePxHigh = Number(p.height) > 0 ? Number(p.height) : 576;
        const s = p['screen-scale'];
        // The page is screen-width metres wide (1 by default, as the Fire-V-Player's screen) at any
        // resolution; pixelsperunit no longer sets the size, as the SDK ignores it.
        const screenWidthM = Number(p['screen-width']) > 0 ? Number(p['screen-width']) : 1;
        const pageWidth = screenWidthM * s.x;
        const pageHeight = screenWidthM * pagePxHigh / pagePxWide * s.y;
        // A thin frame around the page.
        const backdropWidth = pageWidth + 0.06, backdropHeight = pageHeight + 0.06;
        return {
            // The page is drawn at SDK_PIXELS_PER_M; this scales it to screenWidthM.
            pageScale: screenWidthM * SDK_PIXELS_PER_M / pagePxWide,
            backdropWidth, backdropHeight,
            top: backdropHeight / 2 + 0.06,          // the top row of buttons
            left: -(backdropWidth / 2 + 0.055),      // the left column
            right: backdropWidth / 2 + 0.055,        // grow / shrink
            customX: backdropWidth / 2 + 0.135,      // the custom buttons
            handleY: -(backdropHeight / 2 + 0.06)    // the grab handle, just under the backdrop
        };
    }

    // The pill under the screen, copied from the Fire-V-Player's playlist panel (playlist-panel.js,
    // addGrabHandle): a capsule on its side, a collider, a Rigidbody, then Grababble (which adds the
    // grab handle, a WorldObject and HeldEvents, and puts it on the Grabbable layer), all on the
    // screen's own object so the whole screen comes along. The collider sits around the pill, below
    // the backdrop, so only the pill can be grabbed. One difference: the panel's Rigidbody is always
    // free to move, so a hand could nudge it; this one is held still (_holdStill) except while held.
    async _addScreenHandle(handleY, colour) {
        if (!BS.Rigidbody || !(BS.Grababble || BS.GrabHandle) || !BS.BoxCollider) {
            console.log(`FIRESCREEN_INSTANCE[${this.id}]: This client has no Rigidbody / Grababble, so the screen has no handle.`);
            return null;
        }
        const handle = this.geometryObject;
        // Looks like the pill under the playlist panel. A capsule stands along its Y axis, so it's
        // on a child turned on its side; the collider stays on the handle itself, sized to the pill.
        const length = 0.3, thick = 0.05;
        const pill = await new BS.GameObject({
            name: `FireScreenHandlePill${this.id}`,
            parent: handle,
            localPosition: new BS.Vector3(0, handleY, 0),
            localEulerAngles: new BS.Vector3(0, 0, 90)
        }).Async();
        if (BS.Capsule) await pill.AddComponent(new BS.Capsule({ radius: thick, height: length, radialSegments: 24, heightSegments: 8 }));
        else if (BS.Box) await pill.AddComponent(new BS.Box({ width: thick, height: length, depth: thick }));
        if (BS.Material) await pill.AddComponent(new BS.Material({ shaderName: 'Unlit/Diffuse', color: colour || new BS.Vector4(0.85, 0.87, 0.9, 1) }));
        await handle.AddComponent(new BS.BoxCollider({ isTrigger: false, center: new BS.Vector3(0, handleY, 0), size: new BS.Vector3(length, thick + 0.02, thick + 0.02) }));
        // No gravity, and it only turns around the vertical, so the screen stays upright. Starts
        // held still (all frozen) until someone grabs it.
        this.firerigidBody = await handle.AddComponent(new BS.Rigidbody({
            mass: 1, drag: 2, angularDrag: 10, useGravity: false, isKinematic: false,
            freezePositionX: true, freezePositionY: true, freezePositionZ: true,
            freezeRotationX: true, freezeRotationY: true, freezeRotationZ: true
        }));
        // Each player's screen is their own, so its network id is too: no one else's handle matches it.
        const user = this.banterscene.localUser;
        const uid = (user && user.uid) || (window.user && window.user.id) || Math.random().toString(36).slice(2);
        if (typeof handle.SetNetworkId === 'function') {
            try { await handle.SetNetworkId(`FireScreen_Handle${this.id}_${uid}`); } catch (e) { /* not on this client */ }
        }
        const soft = BS.BSGrabType && BS.BSGrabType.Soft !== undefined ? BS.BSGrabType.Soft : 3;
        if (BS.Grababble) {
            await handle.AddComponent(new BS.Grababble({ grabType: soft, grabRadius: 0.01 }));
        } else {
            if (typeof handle.SetLayer === 'function') await handle.SetLayer((BS.L && BS.L.Grabbable) || 20);
            await handle.AddComponent(new BS.GrabHandle({ grabType: soft, grabRadius: 0.01 }));
        }
        console.log(`FIRESCREEN_INSTANCE[${this.id}]: The pill under the screen can be grabbed to carry it.`);
        return pill;
    }

    // still: every position and rotation frozen, so hands and bodies can't push the screen.
    // Not still (while held): free to move, but only turning around the vertical, as the panel.
    _holdStill(still) {
        const b = this.firerigidBody;
        if (!b) return;
        try {
            if (still) {
                b.velocity = new BS.Vector3(0, 0, 0);
                b.angularVelocity = new BS.Vector3(0, 0, 0);
            }
            b.freezePositionX = still;
            b.freezePositionY = still;
            b.freezePositionZ = still;
            b.freezeRotationY = still;
        } catch (e) {
            console.warn(`FIRESCREEN_INSTANCE[${this.id}]: Could not change the screen's movement:`, e);
        }
    }

    // --- Helper Methods (previously global functions) ---

    async _createGeometry(thingy1, geomtype, options = {}) {
        const defaultOptions = { thewidth: 1, theheight: 1, depth: 1, radius: 1, segments: 24 };
        const config = { ...defaultOptions, ...options };
        return await thingy1.AddComponent(new BS.BanterGeometry(geomtype, 0, config.thewidth, config.theheight, config.depth, 1, 1, 1, config.radius, config.segments));
    }

    async _createMaterial(objectThing, options = {}) {
        const shaderName = options.shaderName || CONSTANTS.SHADERS.DEFAULT_TRANSPARENT;
        const texture = options.texture || null;
        const color = options.color || CONSTANTS.COLORS.WHITE;
        return objectThing.AddComponent(new BS.BanterMaterial(shaderName, texture, color, 0, true));
    }

    _updateButtonColor(buttonObject, revertColour) {
        let material = buttonObject.GetComponent(BS.ComponentType.BanterMaterial);
        material.color = CONSTANTS.COLORS.BUTTON_ACTIVE_FLASH;
        setTimeout(() => { material.color = revertColour; }, 100);
    }

    _adjustScale(direction) {
        let scaleX = Number(parseFloat(this.geometrytransform.localScale.x).toFixed(3));
        let scaleY = Number(parseFloat(this.geometrytransform.localScale.y).toFixed(3));
        let adjustment;
        if (scaleX < 0.5) { adjustment = 0.025; }
        else if (scaleX < 2) { adjustment = 0.05; }
        else if (scaleX < 5) { adjustment = 0.1; }
        else { adjustment = 0.5; }
        if (direction === "shrink") {
            adjustment = -adjustment;
            if (scaleX + adjustment <= 0) { scaleX = 0.025; scaleY = 0.025; }
        }
        scaleX += adjustment;
        scaleY += adjustment;
        this.geometrytransform.localScale = new BS.Vector3(scaleX, scaleY, 1);
    }

    async _createCustomButton(config) {
        const { name, url, text, position, clickHandler } = config;
        const buttonObject = await this._createUIButton(name, null, position, CONSTANTS.COLORS.TEXT_PLANE, this.geometryObject, null, null, CONSTANTS.LAYOUT.CUSTOM_BUTTON_WIDTH, CONSTANTS.LAYOUT.CUSTOM_BUTTON_HEIGHT, CONSTANTS.SHADERS.CUSTOM_BUTTON);
        this.customButtonObjects.push(buttonObject);
        const material = buttonObject.GetComponent(BS.ComponentType.BanterMaterial);

        const textObject = await new BS.GameObject(`${name}Text${this.id}`).Async();
        // The client reads each alignment as a whole number (the error it logged for the word
        // "Center" said so). Use the SDK's own value when it is a number; 1 is the middle one
        // (Left, Center, Right / Top, Center or Middle, Bottom). Centred, the text sits on its button.
        const num = (...values) => values.find(v => typeof v === 'number');
        const H = BS.HorizontalAlignment || {}, V = BS.VerticalAlignment || {};
        const hCenter = num(H.Center, 1), vCenter = num(V.Center, V.Middle, 1);
        await textObject.AddComponent(new BS.BanterText(text, CONSTANTS.COLORS.WHITE, hCenter, vCenter, 0.20, true, true, new BS.Vector2(2, 1)));
        const textTransform = await textObject.AddComponent(new BS.Transform());
        textTransform.localPosition = new BS.Vector3(position.x, position.y, position.z - 0.005);
        await textObject.SetParent(this.geometryObject, false);
        this.customButtonObjects.push(textObject);

        this._createButtonAction(buttonObject, () => {
            material.color = CONSTANTS.COLORS.CUSTOM_BUTTON_ACTIVE_FLASH;
            setTimeout(() => { material.color = CONSTANTS.COLORS.TEXT_PLANE; }, 100);
            if (clickHandler) {
                clickHandler();
            } else if (url) {
                this._setBrowserUrl(url);
            }
        });
    }

    async _createUIButton(name, texture, position, color, parent, clickHandler = null, rotation = null, width = 0.1, height = 0.1, shader = CONSTANTS.SHADERS.DEFAULT_TRANSPARENT, localScale = new BS.Vector3(1, 1, 1)) {
        const buttonObject = await new BS.GameObject(name).Async();
        await this._createGeometry(buttonObject, BS.GeometryType.PlaneGeometry, { thewidth: width, theheight: height });
        await buttonObject.AddComponent(new BS.BoxCollider(true, new BS.Vector3(0, 0, 0), new BS.Vector3(width, height, CONSTANTS.LAYOUT.DEFAULT_BUTTON_COLLIDER_DEPTH)));
        await this._createMaterial(buttonObject, { shaderName: shader, texture: texture, color: color });
        const buttonTransform = await buttonObject.AddComponent(new BS.Transform());
        buttonTransform.localScale = localScale;
        buttonTransform.position = position;
        if (rotation instanceof BS.Vector3) { buttonTransform.localEulerAngles = rotation; }
        buttonObject.SetLayer(5);
        await buttonObject.SetParent(parent, false);
        if (clickHandler) { this._createButtonAction(buttonObject, clickHandler); }
        return buttonObject;
    }

    _adjustVolume(change) {
        let currentVolume = Number(this.browserComponent.volumeLevel);
        let adjustment;
        if (currentVolume < 0.1) { adjustment = 0.01; }
        else if (currentVolume < 0.5) { adjustment = 0.03; }
        else { adjustment = 0.05; }

        let newVolume = currentVolume + (change * adjustment);
        newVolume = Math.max(0, Math.min(newVolume, 1)).toFixed(2);
        this.browserComponent.volumeLevel = newVolume;

        console.log(`FIRESCREEN_INSTANCE[${this.id}]: Setting volume to: ${newVolume}`);
        const scriptToRun = `${mediaControlScript} window.fireScreenMediaControl({ volume: ${newVolume} });`;
        this._runBrowserActions(scriptToRun);
    }

    _toggleButtonVisibility(defaultobjects, customButtonObjects, visible, exceptions = []) {
        defaultobjects.forEach(button => { if (!exceptions.includes(button.name)) { button.SetActive(visible); } });
        customButtonObjects.forEach(button => { if (button && !exceptions.includes(button.name)) { button.SetActive(visible); } });
    }

    _runBrowserActions(script) {
        this.browserComponent.RunActions(JSON.stringify({ "actions": [{ "actionType": "runscript", "strparam1": script }] }));
    }

    _createButtonAction(buttonObject, clickHandler) {
        buttonObject.On('click', (e) => { clickHandler(e); });
        this.listeners.push({ target: buttonObject, event: 'click', handler: clickHandler });
    }

    _dispatchButtonClickEvent(buttonName, message) {
        const eventDetails = { buttonName: buttonName, message: message, timestamp: new Date(), instanceId: this.id };
        const eventName = 'CustomButtonClick'; // Standardized event name based on usage in index.html.

        // New, preferred event system through the manager.
        // This keeps events self-contained and makes the system more modular.
        this.manager.dispatchEvent({ type: eventName, detail: eventDetails });

        // --- Backward Compatibility ---
        // Dispatch the old global DOM event for any legacy scripts that might be listening.
        const legacyEvent = new CustomEvent(eventName, { detail: eventDetails, bubbles: true, composed: true });
        document.dispatchEvent(legacyEvent);
    }

    _setBrowserUrl(url) {
        if (!this.browserComponent) return;
        this.browserComponent.url = url;
        this._triggerVolumeSync();
    }

    _triggerVolumeSync() {
        if (this.browserComponent.volumeSyncInterval) {
            clearInterval(this.browserComponent.volumeSyncInterval);
        }

        let syncCount = 0;
        const maxSyncs = 4;
        const syncIntervalTime = 2500;

        const intervalId = setInterval(() => {
            if (syncCount >= maxSyncs) {
                clearInterval(intervalId);
                const index = this.intervals.indexOf(intervalId);
                if (index > -1) this.intervals.splice(index, 1);
                this.browserComponent.volumeSyncInterval = null;
                return;
            }
            console.log(`FIRESCREEN_INSTANCE[${this.id}]: Triggering volume sync #${syncCount + 1} for browser ${this.browserComponent.gameObject.name}`);
            this._adjustVolume(0);
            syncCount++;
        }, syncIntervalTime);

        this.browserComponent.volumeSyncInterval = intervalId;
        this.intervals.push(intervalId);
    }

    async _setupHandControls(userId) {
        if (this.handControls) return; // Already setup

        const p = this.params;
        this.handControls = await new BS.GameObject(`handContainer${this.id}`).Async();
        this.gameObjects.push(this.handControls);

        // Laid out as the Fire-V-Player's hand controls (core.js, setupHandControls): a bare root
        // attached to the hand, and under it a holder that lays the buttons flat on the back of the
        // wrist, facing out of it, so they face you when you look at your wrist.
        const handWrapper = await new BS.GameObject(`handWrapper${this.id}`).Async();
        const wrapperTransform = await handWrapper.AddComponent(new BS.Transform());
        wrapperTransform.localPosition = CONSTANTS.LAYOUT.HAND_CONTROLS.WRAPPER_POS;
        wrapperTransform.localEulerAngles = CONSTANTS.LAYOUT.HAND_CONTROLS.WRAPPER_ROT;
        wrapperTransform.localScale = CONSTANTS.LAYOUT.HAND_CONTROLS.CONTAINER_SCALE;
        await handWrapper.SetParent(this.handControls, false);

        this.handAttachTimeout = setTimeout(async () => {
            this.handAttachTimeout = null;
            // Removed in the meantime: nothing to attach.
            if (!this.handControls || this.handControls.destroyed) return;
            await this.banterscene.LegacyAttachObject(this.handControls, userId, BS.LegacyAttachmentPosition.LEFT_HAND);
        }, 1000);
		
        this.uiHandButtons = {};
        const handButtonConfigs = [
            { name: 'hVolumeUpButton', icon: p['icon-volup-url'], pos: new BS.Vector3(0.4, 0.4, -0.3), color: p['volup-color'], clickHandler: (btn) => { this._adjustForAll("adjustVolume", 1); this._updateButtonColor(btn, p['volup-color']); this._dispatchButtonClickEvent("VolumeUp", 'Hand Volume Up Clicked!'); } },
            { name: 'hVolumeDownButton', icon: p['icon-voldown-url'], pos: new BS.Vector3(0.0, 0.4, -0.3), color: p['voldown-color'], clickHandler: (btn) => { this._adjustForAll("adjustVolume", -1); this._updateButtonColor(btn, p['voldown-color']); this._dispatchButtonClickEvent("VolumeDown", 'Hand Volume Down Clicked!'); } },
            { name: 'hMuteButton', icon: p['icon-mute-url'], pos: new BS.Vector3(-0.4, 0.4, -0.3), color: p['mute-color'], clickHandler: () => {
                this._adjustForAll("toggleMute", true); // Pass true to ensure the command is recognized
                this._dispatchButtonClickEvent("Mute", 'Hand Mute Clicked!');
            }},
            { name: 'hLockButton', icon: CONSTANTS.ICONS.LOCK, pos: new BS.Vector3(0, -0.1, -0.3), color: CONSTANTS.COLORS.BUTTON_UNLOCKED, clickHandler: (btn) => { this.playerislockedv2 = !this.playerislockedv2; this.playerislockedv2 ? this.banterscene.LegacyLockPlayer() : this.banterscene.LegacyUnlockPlayer(); btn.GetComponent(BS.ComponentType.BanterMaterial).color = this.playerislockedv2 ? CONSTANTS.COLORS.BUTTON_LOCKED : CONSTANTS.COLORS.BUTTON_UNLOCKED; } },
            { name: 'hHomeButton', icon: CONSTANTS.ICONS.HOME, pos: new BS.Vector3(0.4, -0.1, -0.3), color: p['button-color'], clickHandler: (btn) => { this._adjustForAll("goHome", true); this._updateButtonColor(btn, p['button-color']); this._dispatchButtonClickEvent("Home", 'Hand Home Clicked!'); } }
        ];

        for (const config of handButtonConfigs) {
            const button = await this._createUIButton(config.name, config.icon, config.pos, config.color, handWrapper, () => config.clickHandler(button), null, 1, 1, CONSTANTS.SHADERS.DEFAULT_TRANSPARENT, CONSTANTS.LAYOUT.HAND_CONTROLS.BUTTON_SCALE);
            this.uiHandButtons[config.name] = button;
        }

        // Track all created hand control objects so they can be cleaned up properly.
        this.handControlGameObjects = [this.handControls, handWrapper, ...Object.values(this.uiHandButtons)];
        this.gameObjects.push(...this.handControlGameObjects);
    }

    async _cleanupHandControls() {
        clearTimeout(this.handAttachTimeout);
        this.handAttachTimeout = null;
        if (this.handControls && !this.handControls.destroyed) {
            console.log(`FIRESCREEN_INSTANCE[${this.id}]: Cleaning up hand controls...`);
            await this.handControls.Destroy(); // This will destroy the container and all children
        }

        // Filter out the (now destroyed) hand control game objects from the main list
        this.gameObjects = this.gameObjects.filter(go => !this.handControlGameObjects.includes(go));

        // Reset state to allow for re-creation
        this.handControls = null;
        this.handControlGameObjects = [];
    }

    _adjustForAll(action, change) {
        // This instance requests the manager to broadcast a command to all instances.
        // The command object is dynamically created, e.g., { adjustVolume: 1 }
        const commandData = { [action]: change };
        this.manager.broadcastCommand(commandData);
    }

    async _getSpaceStateStuff(argument) {
        // Wait until the localUser is available before trying to access space state.
        while (!this.banterscene.localUser || this.banterscene.localUser.uid === undefined) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        const spaceState = this.banterscene.spaceState;

        // Safely log all properties, but only do it once per session.
        if (!this.manager.spaceStateLogged) {
            console.log("--- Logging All Space State Properties (once per session) ---");
            if (spaceState && spaceState.public) {
                console.log("--- Public Space State ---");
                // Using Object.entries as it's proven to be safe with the spaceState object
                for (const [key, value] of Object.entries(spaceState.public)) {
                    console.log(`  ${key}:`, value);
                }
            }
            if (spaceState && spaceState.protected) {
                console.log("--- Protected Space State ---");
                for (const [key, value] of Object.entries(spaceState.protected)) {
                    console.log(`  ${key}:`, value);
                }
            }
            this.manager.spaceStateLogged = true;
        }

        // Find and return the requested value. Prioritize protected properties.
        if (spaceState) {
            const storesToSearch = [spaceState.protected, spaceState.public];
            for (const store of storesToSearch) {
                if (store) {
                    for (const [key, value] of Object.entries(store)) {
                        if (key === argument) return value;
                    }
                }
            }
        }

        console.log(`Could not find space state key: '${argument}', returning null.`);
        return null;
    }

    async destroy() {
        console.log(`FIRESCREEN_INSTANCE[${this.id}]: Destroying...`);

        this.intervals.forEach(intervalId => clearInterval(intervalId));
        clearTimeout(this.handAttachTimeout);
        this.handAttachTimeout = null;
        if (this.browserComponent && this.browserComponent.volumeSyncInterval) {
            clearInterval(this.browserComponent.volumeSyncInterval);
        }

        this.listeners.forEach(({ target, event, handler, useRemoveListener }) => {
            if (target) {
                try {
                    useRemoveListener ? target.removeEventListener(event, handler) : target.Off(event, handler);
                } catch (e) {
                    console.warn(`FIRESCREEN_INSTANCE[${this.id}]: Error removing listener for event '${event}':`, e);
                }
            }
        });

        for (const gameObject of this.gameObjects) {
            if (gameObject && !gameObject.destroyed) {
                try { await gameObject.Destroy(); }
                catch (e) { console.warn(`FIRESCREEN_INSTANCE[${this.id}]: Error destroying GameObject ${gameObject.name}:`, e); }
            }
        }

        if (this.scriptElement && this.scriptElement.parentElement) {
            this.scriptElement.parentElement.removeChild(this.scriptElement);
        }

        console.log(`FIRESCREEN_INSTANCE[${this.id}]: Destroyed.`);
    }
}