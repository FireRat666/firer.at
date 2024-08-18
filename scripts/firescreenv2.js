// create a reference to the banter scene
const firescenev2 = BS.BanterScene.getInstance();

let firescreenurlv2 = "https://firer.at/scripts/firescreenv2.js";
let announcerscripturlv2 = "https://firer.at/scripts/announcer.js";
let fireScreen2On = false;
let firstrunhandcontrolsv2 = true;
let screenObject = null;
let browser = null;
let geometryObject = null;
let geometry = null;
let geometrytransform = null;
let boxCollider = null;
let firerigidBody = null;
let material = null;
let browsertransform = null;
let detailpoint = null;
let detailnormal = null;
let keyboardstate = false;
let buttonsvisible = true;
let isbillboarded = true;
let firevolume = 1;
let browsermuted = false;
let plane11material = null;
let thebuttonscolor = null;
let announcerfirstrunv2 = true;
let plane16Object = null;
let plane17Object = null;
let plane18Object = null;
let plane19Object = null;
let plane20Object = null;
let plane21Object = null;
let plane22Object = null;
let plane23Object = null;
let plane24Object = null;
let plane16material = null;
let plane17material = null;
let plane18material = null;
let plane19material = null;
let plane20material = null;
let plane21material = null;
let plane22material = null;
let plane23material = null;
let plane24material = null;
let plane16color = null;
let plane17color = null;
let plane18color = null;
let plane19color = null;
let plane20color = null;
let plane21color = null;
let plane22color = null;
let plane23color = null;
let plane24color = null;
let textgameObject01 = null;
let textgameObject02 = null;
let textgameObject03 = null;
let textgameObject04 = null;
let playersuseridv2 = null;
let playerislockedv2 = false;

function setupfirescreen2() {
  console.log("FIRESCREEN2: Setting up");
  
  const allscripts = document.getElementsByTagName("script");
  for (let i = 0; i < allscripts.length; i++) {
    if (getAttrOrDef(allscripts[i], "src", "") === firescreenurlv2) { 
      console.log("FIRESCREEN2: Loading");
      const pPos = getV3FromStr(getAttrOrDef(allscripts[i], "position", "0 2 0"));
      const pRot = getV3FromStr(getAttrOrDef(allscripts[i], "rotation", "0 0 0"));
      const pSca = getV3FromStr(getAttrOrDef(allscripts[i], "scale", "1 1 1"));
      const pVolume = getAttrOrDef(allscripts[i], "volumelevel", "0.25");
      const pWebsite = getAttrOrDef(allscripts[i], "website", "https://firer.at/pages/games.html");
      const pMipmaps = getAttrOrDef(allscripts[i], "mipmaps", "1");
      const pPixelsperunit = getAttrOrDef(allscripts[i], "pixelsperunit", "1200");
      const pWidth = getAttrOrDef(allscripts[i], "width", "1024");
      const pHeight = getAttrOrDef(allscripts[i], "height", "576");
      const pBackdrop = getAttrOrDef(allscripts[i], "backdrop", "true");
      const pHandButtons = getAttrOrDef(allscripts[i], "hand-controls", "false");
      const pDisableInteraction = getAttrOrDef(allscripts[i], "disable-interaction", "false");
      const pAnnouncer = getAttrOrDef(allscripts[i], "announcer", "false");
      const pAnnounce = getAttrOrDef(allscripts[i], "announce", "false");
	    const pAnnounce420 = getAttrOrDef(allscripts[i], "announce-420", "false");
	    const pAnnounceEvents = getAttrOrDef(allscripts[i], "announce-events", "true");
	    const pAnnounceEvents2 = getAttrOrDef(allscripts[i], "announce-events", "notset");
      const pButtonColor = getV4FromStr(getAttrOrDef(allscripts[i], "button-color", "0 1 0 1"));
      const pBackDropColor = getV4FromStr(getAttrOrDef(allscripts[i], "backdrop-color", "0 0 0 0.9"));
      const pVolUpColor = getV4FromStr(getAttrOrDef(allscripts[i], "volup-color", "false"));
      const pVolDownColor = getV4FromStr(getAttrOrDef(allscripts[i], "voldown-color", "false"));
      const pMuteColor = getV4FromStr(getAttrOrDef(allscripts[i], "mute-color", "false"));
      const pButtonPos = getAttrOrDef(allscripts[i], "button-position", "0 0 0");
      const pIconMuteUrl = getAttrOrDef(allscripts[i], "icon-mute-url", "https://firer.at/files/VolumeMute.png");
      const pIconVolUpUrl = getAttrOrDef(allscripts[i], "icon-volup-url", "https://firer.at/files/VolumeHigh.png");
      const pIconVolDownUrl = getAttrOrDef(allscripts[i], "icon-voldown-url", "https://firer.at/files/VolumeLow.png");
      const pIconDirectionUrl = getAttrOrDef(allscripts[i], "icon-direction-url", "https://firer.at/files/Arrow.png");
      const pCustomButton01Url = getAttrOrDef(allscripts[i], "custom-button01-url", "false");
      const pCustomButton01Text = getAttrOrDef(allscripts[i], "custom-button01-text", "Custom Button 01");
      const pCustomButton02Url = getAttrOrDef(allscripts[i], "custom-button02-url", "false");
      const pCustomButton02Text = getAttrOrDef(allscripts[i], "custom-button02-text", "Custom Button 02");
      const pCustomButton03Url = getAttrOrDef(allscripts[i], "custom-button03-url", "false");
      const pCustomButton03Text = getAttrOrDef(allscripts[i], "custom-button03-text", "Custom Button 03");
      const pCustomButton04Url = getAttrOrDef(allscripts[i], "custom-button04-url", "false");
      const pCustomButton04Text = getAttrOrDef(allscripts[i], "custom-button04-text", "Custom Button 04");
      const pURL = "url: " + pWebsite + "; mipMaps: " + pMipmaps + "; pixelsPerUnit: " + pPixelsperunit + "; pageWidth: " + pWidth + "; pageHeight: " + pHeight + "; mode: local;";
      sdk2tests(pPos, pRot, pSca, pVolume, pMipmaps, pPixelsperunit, pBackdrop, pWebsite, pButtonColor, pAnnouncer, pAnnounce, pAnnounce420,
      pBackDropColor, pIconMuteUrl, pIconVolUpUrl, pIconVolDownUrl, pIconDirectionUrl, pVolUpColor, pVolDownColor, pMuteColor,
      pDisableInteraction, pButtonPos, pHandButtons, pWidth, pHeight, pCustomButton01Url, pCustomButton01Text, pAnnounceEvents, pAnnounceEvents2,
      pCustomButton02Url, pCustomButton02Text, pCustomButton03Url, pCustomButton03Text, pCustomButton04Url, pCustomButton04Text);
    };
  };

}

async function sdk2tests(p_pos, p_rot, p_sca, p_volume, p_mipmaps, p_pixelsperunit, p_backdrop, p_website, p_buttoncolor, p_announcer, p_announce, p_announce420,
	p_backdropcolor, p_iconmuteurl, p_iconvolupurl, p_iconvoldownurl, p_icondirectionurl, p_volupcolor, p_voldowncolor, p_mutecolor,
	p_disableinteraction, p_buttonpos, p_handbuttons, p_width, p_height, p_custombutton01url, p_custombutton01text, p_announceevents, p_announceevents2,
	p_custombutton02url, p_custombutton02text, p_custombutton03url, p_custombutton03text, p_custombutton04url, p_custombutton04text) {

    firevolume = p_volume;
    fireScreen2On = true;
	  thebuttonscolor = p_buttoncolor;


    const url = p_website;
    const mipMaps = p_mipmaps;
    const pixelsPerUnit = p_pixelsperunit;
    const pageWidth = p_width;
    const pageHeight = p_height;
    const actions = null;
    screenObject = await new BS.GameObject("MyBrowser"); 
    // const screenObject = await new BS.CreateGameObject("MyBrowser");
    browser = await screenObject.AddComponent(new BS.BanterBrowser(url, mipMaps, pixelsPerUnit, pageWidth, pageHeight, actions));

    if (p_disableinteraction === "false") {
    browser.ToggleInteraction(true);
    }

    // // Bill Board the browser
    // const smoothing = 0;
    // const enableXAxis = true;
    // const enableYAxis = true;
    // const enableZAxis = true;

    // const billBoard = await screenObject.AddComponent(new BS.BanterBillboard(smoothing, enableXAxis, enableYAxis, enableZAxis));

    // add Banter Geometry
    const geometryType = BS.GeometryType.PlaneGeometry;
    const parametricType = null;
    const width = 1.09;
    const height = 0.64;
    const depth = 1;
    const widthSegments = 1;
    const heightSegments = 1;
    const depthSegments = 1;
    const radius = 1;
    const segments = 24;
    const thetaStart = 0;
    const thetaLength = 6.283185;
    const phiStart = 0;
    const phiLength = 6.283185;
    const radialSegments = 8;
    const openEnded = false;
    const radiusTop = 1;
    const radiusBottom = 1;
    const innerRadius = 0.3;
    const outerRadius = 1;
    const thetaSegments = 24;
    const phiSegments = 8;
    const tube = 0.4;
    const tubularSegments = 16;
    const arc = 6.283185;
    const p = 2;
    const q = 3;
    const stacks = 5;
    const slices = 5;
    const detail = 0;
    const parametricPoints = "";
    geometryObject = new BS.GameObject("MyGeometry");
    geometry = await geometryObject.AddComponent(new BS.BanterGeometry(geometryType, parametricType, width, height, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));


  // await geometry.gameObject.SetParent(screenObject, false);

  // geometry Transform Stuff
  geometrytransform = await geometryObject.AddComponent(new BS.Transform());
  geometrytransform.position = p_pos;
  geometrytransform.rotation = p_rot;
  // geometrytransform.localPosition = new BS.Vector3(1,2,1);
  // geometrytransform.localScale = new BS.Vector3(1,1,1);

  // Add Box Collider
  const isTrigger = false;
  const center = new BS.Vector3(0,0,0);
  const size = new BS.Vector3(1.09,0.64,0.01);
  // const boxcolObject = new BS.GameObject("MyBoxCollider"); 
  boxCollider = await geometryObject.AddComponent(new BS.BoxCollider(isTrigger, center, size));
  // const boxGameObject = boxCollider.gameObject;

  // screenboxCollider.gameObject.parent = await firescenev2.Find("MyBrowser");

  await geometryObject.SetLayer(20);
  

  

  // Add Rigid Body
  const mass = 1;
  const drag = 10;
  const angularDrag = 10;
  const isKinematic = true;
  const useGravity = false;
  const centerOfMass = new BS.Vector3(0,0,0);
  const collisionDetectionMode = "Discrete";
  const freezePositionX = false;
  const freezePositionY = false;
  const freezePositionZ = false;
  const freezeRotationX = false;
  const freezeRotationY = false;
  const freezeRotationZ = false;
  const velocity = new BS.Vector3(0,0,0);
  const angularVelocity = new BS.Vector3(0,0,0);
  // const gameObject = new BS.GameObject("MyRigidbody");
  // Add a Rigid Body to the geometry
  firerigidBody = await geometryObject.AddComponent(new BS.BanterRigidbody(mass, drag, angularDrag, isKinematic, useGravity, centerOfMass, collisionDetectionMode, freezePositionX, freezePositionY, freezePositionZ, freezeRotationX, freezeRotationY, freezeRotationZ, velocity, angularVelocity));

  // firerigidBody.freezePositionX = false;
  // firerigidBody.freezePositionY = false;
  // firerigidBody.Sleep();

  // Material Stuff  p_backdrop
  if (p_backdrop == "true") {
    p_backdropcolor = p_backdropcolor;
  } else {
    p_backdropcolor = new BS.Vector4(0,0,0,0);
  };
  let texture = null;
  const shaderName = "Sprites/Diffuse";
  const side = 0;
  const generateMipMaps = false;

  material = await geometryObject.AddComponent(new BS.BanterMaterial(shaderName, texture, p_backdropcolor, side, generateMipMaps));


  // Browser Transform Stuff
  browsertransform = await screenObject.AddComponent(new BS.Transform());
  browsertransform.position = new BS.Vector3(0,0,-0.01);
  // browsertransform.localPosition = new BS.Vector3(1,2,1);
  browsertransform.localScale = new BS.Vector3(1,1,1);

  // Make the screen a child of the Main Geometry Object
  await screenObject.SetParent(geometryObject, false);


// ADD FRICTION 
const dynamicFriction = 100;
const staticFriction = 100;
const physicMaterial = await geometryObject.AddComponent(new BS.BanterPhysicMaterial(dynamicFriction, staticFriction));

  // THE HOME BUTTON - CURRENTLY
  const plane02Object = new BS.GameObject("MyGeometry02");
  const plane02geometry = await plane02Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 0.1, 0.1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane02size = new BS.Vector3(0.1,0.1,0.01);
  const plane02color = thebuttonscolor;
  const plane02Collider = await plane02Object.AddComponent(new BS.BoxCollider(true, center, plane02size));
  const plane02material = await plane02Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", "https://firer.at/files/Home.png", plane02color, side, generateMipMaps));
  const plane02transform = await plane02Object.AddComponent(new BS.Transform());
  await plane02Object.SetLayer(5); // UI Layer
  plane02transform.position = new BS.Vector3(-0.2,0.38,0);
  await plane02Object.SetParent(screenObject, false);


  // THE INFO BUTTON - CURRENTLY
  const plane03Object = new BS.GameObject("MyGeometry03");
  const plane03geometry = await plane03Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 0.1, 0.1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane03size = new BS.Vector3(0.1,0.1,0.01);
  const plane03color = thebuttonscolor;
  const plane03Collider = await plane03Object.AddComponent(new BS.BoxCollider(true, center, plane03size));
  const plane03material = await plane03Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", "https://firer.at/files/Info.png", plane03color, side, generateMipMaps));
  const plane03transform = await plane03Object.AddComponent(new BS.Transform());
  await plane03Object.SetLayer(5); // UI Layer
  plane03transform.position = new BS.Vector3(-0.6,0.28,0);
  await plane03Object.SetParent(screenObject, false);


  // THE GOOGLE BUTTON - CURRENTLY
  const plane04Object = new BS.GameObject("MyGeometry04");
  const plane04geometry = await plane04Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 0.1, 0.1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane04size = new BS.Vector3(0.1,0.1,0.01);
  const plane04color = new BS.Vector4(1,1,1,1);
  const plane04Collider = await plane04Object.AddComponent(new BS.BoxCollider(true, center, plane04size));
  const plane04material = await plane04Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", "https://firer.at/files/Google.png", plane04color, side, generateMipMaps));
  const plane04transform = await plane04Object.AddComponent(new BS.Transform());
  await plane04Object.SetLayer(5); // UI Layer
  plane04transform.position = new BS.Vector3(-0.6,0.16,0);
  await plane04Object.SetParent(screenObject, false);


  // THE KEYBOARD BUTTON - CURRENTLY
  const plane05Object = new BS.GameObject("MyGeometry05");
  const plane05geometry = await plane05Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 0.1, 0.1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane05size = new BS.Vector3(0.1,0.1,0);
  const plane05color = new BS.Vector4(1,1,1,1);
  const plane05Collider = await plane05Object.AddComponent(new BS.BoxCollider(true, center, plane05size));
  const plane05material = await plane05Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", "https://firer.at/files/Keyboard.png", plane05color, side, generateMipMaps));
  const plane05transform = await plane05Object.AddComponent(new BS.Transform());
  await plane05Object.SetLayer(5); // UI Layer
  plane05transform.position = new BS.Vector3(-0.6,-0.15,0);
  await plane05Object.SetParent(screenObject, false);


  // THE BACK BUTTON - CURRENTLY
  const plane06Object = new BS.GameObject("MyGeometry06");
  const plane06geometry = await plane06Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 0.1, 0.1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane06size = new BS.Vector3(0.1,0.1,0);
  const plane06color = thebuttonscolor;
  const plane06Collider = await plane06Object.AddComponent(new BS.BoxCollider(true, center, plane06size));
  const plane06material = await plane06Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", p_icondirectionurl, plane06color, side, generateMipMaps));
  const plane06transform = await plane06Object.AddComponent(new BS.Transform());
  await plane06Object.SetLayer(5); // UI Layer
  plane06transform.position = new BS.Vector3(-0.5,0.38,0);
  await plane06Object.SetParent(screenObject, false);


  // THE GROW BUTTON - CURRENTLY
  const plane07Object = new BS.GameObject("MyGeometry07");
  const plane07geometry = await plane07Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 0.1, 0.1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane07size = new BS.Vector3(0.1,0.1,0);
  const plane07color = thebuttonscolor;
  const plane07Collider = await plane07Object.AddComponent(new BS.BoxCollider(true, center, plane07size));
  const plane07material = await plane07Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", "https://firer.at/files/expand.png", plane07color, side, generateMipMaps));
  const plane07transform = await plane07Object.AddComponent(new BS.Transform());
  await plane07Object.SetLayer(5); // UI Layer
  plane07transform.position = new BS.Vector3(0.6,0.06,0);
  await plane07Object.SetParent(screenObject, false);


  // THE SHRINK BUTTON - CURRENTLY
  const plane08Object = new BS.GameObject("MyGeometry08");
  const plane08geometry = await plane08Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 0.1, 0.1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane08size = new BS.Vector3(0.1,0.1,0);
  const plane08color = thebuttonscolor;
  const plane08Collider = await plane08Object.AddComponent(new BS.BoxCollider(true, center, plane08size));
  const plane08material = await plane08Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", "https://firer.at/files/shrink.png", plane08color, side, generateMipMaps));
  const plane08transform = await plane08Object.AddComponent(new BS.Transform());
  await plane08Object.SetLayer(5); // UI Layer
  plane08transform.position = new BS.Vector3(0.6,-0.06,0);
  await plane08Object.SetParent(screenObject, false);


  // THE FORWARD BUTTON - CURRENTLY
  const plane09Object = new BS.GameObject("MyGeometry09");
  const plane09geometry = await plane09Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 0.1, 0.1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane09size = new BS.Vector3(0.1,0.1,0);
  const plane09color = thebuttonscolor;
  const plane09Collider = await plane09Object.AddComponent(new BS.BoxCollider(true, center, plane09size));
  const plane09material = await plane09Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", p_icondirectionurl, plane09color, side, generateMipMaps));
  const plane09transform = await plane09Object.AddComponent(new BS.Transform());
  await plane09Object.SetLayer(5); // UI Layer
  plane09transform.position = new BS.Vector3(-0.38,0.38,0);
  plane09transform.localRotation = new BS.Vector4(0,0,100,1);
  await plane09Object.SetParent(screenObject, false);


  // THE HIDE/SHOW BUTTON - CURRENTLY
  const plane10Object = new BS.GameObject("MyGeometry10");
  const plane10geometry = await plane10Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 0.1, 0.1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane10size = new BS.Vector3(0.1,0.1,0);
  const plane10color = thebuttonscolor;
  const plane10Collider = await plane10Object.AddComponent(new BS.BoxCollider(true, center, plane10size));
  const plane10material = await plane10Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", "https://firer.at/files/Eye.png", plane10color, side, generateMipMaps));
  const plane10transform = await plane10Object.AddComponent(new BS.Transform());

  await plane10Object.SetLayer(5); // UI Layer
  plane10transform.position = new BS.Vector3(-0.6,0,0);
  await plane10Object.SetParent(screenObject, false);


  // A EMPTY BUTTON - CURRENTLY
  const plane11Object = new BS.GameObject("MyGeometry11");
  const plane11geometry = await plane11Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 0.1, 0.1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane11size = new BS.Vector3(0.1,0.1,0);
  const plane11color = thebuttonscolor;
  const plane11Collider = await plane11Object.AddComponent(new BS.BoxCollider(true, center, plane11size));
  plane11material = await plane11Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", "https://firer.at/files/HG2.png", plane11color, side, generateMipMaps));
  const plane11transform = await plane11Object.AddComponent(new BS.Transform());
  await plane11Object.SetLayer(5); // UI Layer
  plane11transform.position = new BS.Vector3(0,0.38,0);
  await plane11Object.SetParent(screenObject, false);
  plane11Object.SetActive(0);


  // THE MUTE BUTTON - CURRENTLY
  const plane12Object = new BS.GameObject("MyGeometry12");
  const plane12geometry = await plane12Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 0.1, 0.1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane12size = new BS.Vector3(0.1,0.1,0);
  let plane12color = null;
	if (p_mutecolor != "false") {
    console.log("p_mutecolor is : ");
    console.log(p_mutecolor);
		plane12color = p_mutecolor;
	} else {
		plane12color = thebuttonscolor;
	};
  const plane12Collider = await plane12Object.AddComponent(new BS.BoxCollider(true, center, plane12size));
  const plane12material = await plane12Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", p_iconmuteurl, plane12color, side, generateMipMaps));
  const plane12transform = await plane12Object.AddComponent(new BS.Transform());
  await plane12Object.SetLayer(5); // UI Layer
  plane12transform.position = new BS.Vector3(0.167,0.38,0);
  await plane12Object.SetParent(screenObject, false);


  // THE VOLDOWN BUTTON - CURRENTLY
  const plane13Object = new BS.GameObject("MyGeometry13");
  const plane13geometry = await plane13Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 0.1, 0.1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane13size = new BS.Vector3(0.1,0.1,0);
  let plane13color = null;
	if (p_voldowncolor != "false") {
    console.log("p_voldowncolor is : ");
    console.log(p_voldowncolor);
		plane13color = p_voldowncolor;
	} else {
		plane13color = thebuttonscolor;
	};
  const plane13Collider = await plane13Object.AddComponent(new BS.BoxCollider(true, center, plane13size));
  const plane13material = await plane13Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", p_iconvoldownurl, plane13color, side, generateMipMaps));
  const plane13transform = await plane13Object.AddComponent(new BS.Transform());
  await plane13Object.SetLayer(5); // UI Layer
  plane13transform.position = new BS.Vector3(0.334,0.38,0);
  await plane13Object.SetParent(screenObject, false);


  // THE VOLUP BUTTON - CURRENTLY
  const plane14Object = new BS.GameObject("MyGeometry14");
  const plane14geometry = await plane14Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 0.1, 0.1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane14size = new BS.Vector3(0.1,0.1,0);
  let plane14color = null;
	if (p_volupcolor != "false") {
    console.log("p_volupcolor is : ");
    console.log(p_volupcolor);
		plane14color = p_volupcolor;
	} else {
		plane14color = thebuttonscolor;
	};
  const plane14Collider = await plane14Object.AddComponent(new BS.BoxCollider(true, center, plane14size));
  const plane14material = await plane14Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", p_iconvolupurl, plane14color, side, generateMipMaps));
  const plane14transform = await plane14Object.AddComponent(new BS.Transform());
  await plane14Object.SetLayer(5); // UI Layer
  plane14transform.position = new BS.Vector3(0.495,0.38,0);
  await plane14Object.SetParent(screenObject, false);


  // THE BILLBOARD/ROTATION BUTTON - CURRENTLY
  const plane15Object = new BS.GameObject("MyGeometry15");
  const plane15geometry = await plane15Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 0.1, 0.1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane15size = new BS.Vector3(0.1,0.1,0);
  const plane15color = thebuttonscolor;
  const plane15Collider = await plane15Object.AddComponent(new BS.BoxCollider(true, center, plane15size));
  const plane15material = await plane15Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", "https://firer.at/files/Rot.png", plane15color, side, generateMipMaps));
  const plane15transform = await plane15Object.AddComponent(new BS.Transform());
  await plane15Object.SetLayer(5); // UI Layer
  plane15transform.position = new BS.Vector3(-0.6,-0.3,0);
  await plane15Object.SetParent(screenObject, false);

  
  const horizontalAlignment = "Center";
  const verticalAlignment = "Center";
  const fontSize = 0.20;
  const richText = true;
  const enableWordWrapping = true;
  const rectTransformSizeDelta = new BS.Vector2(2,1);
  if (p_custombutton01url != "false") {
  // THE EXTRA BUTTON 01 - CURRENTLY
  plane16Object = new BS.GameObject("MyGeometry16");
  const plane16geometry = await plane16Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 1, 1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane16size = new BS.Vector3(1,1,0);
  plane16color = new BS.Vector4(0.1,0.1,0.1,0.9);
  const plane16Collider = await plane16Object.AddComponent(new BS.BoxCollider(true, center, plane16size));
  plane16material = await plane16Object.AddComponent(new BS.BanterMaterial("Unlit/Diffuse", null, plane16color, side, generateMipMaps));
  const plane16transform = await plane16Object.AddComponent(new BS.Transform());
  await plane16Object.SetLayer(5); // UI Layer
  plane16transform.position = new BS.Vector3(0.68,0.3,0);
  plane16transform.localScale = new BS.Vector3(0.2,0.04,1);
  await plane16Object.SetParent(screenObject, false);
  // THE EXTRA TEXT - CURRENTLY
  const text01color = new BS.Vector4(1,1,1,1);
  textgameObject01 = new BS.GameObject("MyText01");
  const text01object = await textgameObject01.AddComponent(new BS.BanterText(p_custombutton01text, text01color, horizontalAlignment, verticalAlignment, fontSize, richText, enableWordWrapping, rectTransformSizeDelta));
  const text01transform = await textgameObject01.AddComponent(new BS.Transform());
  // await textgameObject01.SetLayer(5); // UI Layer
  // text01transform.position = new BS.Vector3(1.6,0.1,0.01);
  text01transform.localPosition = new BS.Vector3(1.59,-0.188,-0.005);
  await textgameObject01.SetParent(screenObject, false);
  };

  if (p_custombutton02url != "false") {
  // THE EXTRA BUTTON 02 - CURRENTLY
  plane17Object = new BS.GameObject("MyGeometry17");
  const plane17geometry = await plane17Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 1, 1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane17size = new BS.Vector3(1,1,0);
  plane17color = new BS.Vector4(0.1,0.1,0.1,0.1);
  const plane17Collider = await plane17Object.AddComponent(new BS.BoxCollider(true, center, plane17size));
  plane17material = await plane17Object.AddComponent(new BS.BanterMaterial("Unlit/Diffuse", null, plane17color, side, generateMipMaps));
  const plane17transform = await plane17Object.AddComponent(new BS.Transform());
  await plane17Object.SetLayer(5); // UI Layer
  plane17transform.position = new BS.Vector3(0.68,0.25,0);
  plane17transform.localScale = new BS.Vector3(0.2,0.04,1);
  await plane17Object.SetParent(screenObject, false);
  // THE EXTRA TEXT - CURRENTLY
  const text02color = new BS.Vector4(1,1,1,1);
  textgameObject02 = new BS.GameObject("MyText02");
  const text02object = await textgameObject02.AddComponent(new BS.BanterText(p_custombutton02text, text02color, horizontalAlignment, verticalAlignment, fontSize, richText, enableWordWrapping, rectTransformSizeDelta));
  const text02transform = await textgameObject02.AddComponent(new BS.Transform());
  // await textgameObject02.SetLayer(5); // UI Layer
  // text02transform.position = new BS.Vector3(1.6,0.1,0.02);
  text02transform.localPosition = new BS.Vector3(1.59,-0.237,-0.005);
  await textgameObject02.SetParent(screenObject, false);
};

if (p_custombutton03url != "false") {
  // THE EXTRA BUTTON 03 - CURRENTLY
  plane18Object = new BS.GameObject("MyGeometry18");
  const plane18geometry = await plane18Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 1, 1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane18size = new BS.Vector3(1,1,0);
  plane18color = new BS.Vector4(0.1,0.1,0.1,0.7);
  const plane18Collider = await plane18Object.AddComponent(new BS.BoxCollider(true, center, plane18size));
  plane18material = await plane18Object.AddComponent(new BS.BanterMaterial("Unlit/Diffuse", null, plane18color, side, generateMipMaps));
  const plane18transform = await plane18Object.AddComponent(new BS.Transform());
  await plane18Object.SetLayer(5); // UI Layer
  plane18transform.position = new BS.Vector3(0.68,0.20,0);
  plane18transform.localScale = new BS.Vector3(0.2,0.04,1);
  await plane18Object.SetParent(screenObject, false);
  // THE EXTRA TEXT - CURRENTLY
  const text03color = new BS.Vector4(1,1,1,1);
  textgameObject03 = new BS.GameObject("MyText03");
  const text03object = await textgameObject03.AddComponent(new BS.BanterText(p_custombutton03text, text03color, horizontalAlignment, verticalAlignment, fontSize, richText, enableWordWrapping, rectTransformSizeDelta));
  const text03transform = await textgameObject03.AddComponent(new BS.Transform());
  // await textgameObject03.SetLayer(5); // UI Layer
  // text03transform.position = new BS.Vector3(1.6,0.1,0.03);
  text03transform.localPosition = new BS.Vector3(1.59,-0.287,-0.005);
  await textgameObject03.SetLayer(6); // UI Layer
  await textgameObject03.SetParent(screenObject, false);
};

if (p_custombutton04url != "false") {
  // THE EXTRA BUTTON 04 - CURRENTLY
  plane19Object = new BS.GameObject("MyGeometry19");
  const plane19geometry = await plane19Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 1, 1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
  const plane19size = new BS.Vector3(1,1,0);
  plane19color = new BS.Vector4(0.1,0.1,0.1,0.7);
  const plane19Collider = await plane19Object.AddComponent(new BS.BoxCollider(true, center, plane19size));
  plane19material = await plane19Object.AddComponent(new BS.BanterMaterial("Unlit/Diffuse", null, plane19color, side, generateMipMaps));
  const plane19transform = await plane19Object.AddComponent(new BS.Transform());
  await plane19Object.SetLayer(5); // UI Layer
  plane19transform.position = new BS.Vector3(0.68,0.15,0);
  plane19transform.localScale = new BS.Vector3(0.2,0.04,1);
  await plane19Object.SetParent(screenObject, false);
  // THE EXTRA TEXT - CURRENTLY
  const text04color = new BS.Vector4(1,1,1,1);
  textgameObject04 = new BS.GameObject("MyText04");
  const text04object = await textgameObject04.AddComponent(new BS.BanterText(p_custombutton04text, text04color, horizontalAlignment, verticalAlignment, fontSize, richText, enableWordWrapping, rectTransformSizeDelta));
  const text04transform = await textgameObject04.AddComponent(new BS.Transform());
  // await textgameObject04.SetLayer(5); // UI Layer
  // text04transform.position = new BS.Vector3(1.6,0.1,0.04);
  text04transform.localPosition = new BS.Vector3(1.59,-0.336,-0.005);
  await textgameObject04.SetLayer(6); // UI Layer
  await textgameObject04.SetParent(screenObject, false);
};
  
  // Bill Board the geometryObject
  const smoothing = 0;
  const enableXAxis = true;
  const enableYAxis = true;
  const enableZAxis = true;

  const billBoard = await geometryObject.AddComponent(new BS.BanterBillboard(smoothing, enableXAxis, enableYAxis, enableZAxis));

  // SET THE SCALE FOR THE SCREEN
  geometrytransform.localScale = p_sca;

  // SET THE COLOUR FOR THE BACKDROP BECAUSE I NEED TO SET THIS AGAIN FOR SOME REASON
  // material.shaderName = "Sprites/Diffuse";
  // material.color = p_backdropcolor


  // When user Grabs the Browser, Make it moveable
  firerigidBody.gameObject.On('grab', () => {
    firerigidBody.isKinematic = false;
    console.log("GRABBED!");
  });

  // When user Drops the Browser, Lock it in place
  firerigidBody.gameObject.On('drop', () => {
    firerigidBody.isKinematic = true;
    console.log("DROPPED!");
  });

  // Home Button Thing
  plane02Object.On('click', () => {
    console.log("CLICKED02!");
    browser.url = url;
    plane02material.color = new BS.Vector4(1,1,1,0.8);
    setTimeout(() => { plane02material.color = plane02color }, 100);

  });

  // Info Button Thing - with extras
  plane03Object.On('click', e => {
    console.log("CLICKED03!");
    // Do something with e.detail.point and e.detail.normal.
    console.log("points: X:" + e.detail.point.x + " Y:" + e.detail.point.y + " Z:" + e.detail.point.z);
    console.log("normals: X:" + e.detail.normal.x + " Y:" + e.detail.normal.y + " Z:" + e.detail.normal.z);
    detailpoint = e.detail.point;
    detailnormal = e.detail.normal;
    browser.url = "https://firer.at/pages/Info.html";
    plane03material.color = new BS.Vector4(1,1,1,0.8);
    setTimeout(() => { plane03material.color = plane03color; }, 100);
  });

  // Google Button Thing
  plane04Object.On('click', () => {
    console.log("CLICKED04!");
    browser.url = "https://google.com/";
    plane04material.color = new BS.Vector4(1,1,1,0.7);
    setTimeout(() => { plane04material.color = plane04color; }, 100);
  });


  // Keyboard Button Thing
  plane05Object.On('click', () => {
    console.log("CLICKED05!");
		if (keyboardstate == true) {
      keyboardstate = false;
			browser.ToggleKeyboard(0);
      plane05material.color = plane05color;
		} else {
      keyboardstate = true;
      browser.ToggleKeyboard(1);
      plane05material.color = thebuttonscolor;
	  };
  });

  // Back Button Thing
  plane06Object.On('click', () => {
    console.log("CLICKED06!");
    browser.RunActions(JSON.stringify({"actions":[{"actionType": "goback"}]}));
    plane06material.color = new BS.Vector4(1,1,1,0.8);
    setTimeout(() => { plane06material.color = plane06color; }, 100);
  });


  // Grow Button Thing
  plane07Object.On('click', () => {
    console.log("CLICKED07!");
    let scaleX = Number(parseFloat(geometrytransform.localScale.x).toFixed(3));
    let scaleY = Number(parseFloat(geometrytransform.localScale.y).toFixed(3));
    if (scaleX < 0.5) {
      scaleX += Number(0.025);
      scaleY += Number(0.025);
    } else if (scaleX < 2) {
      scaleX += Number(0.05);
      scaleY += Number(0.05);
    } else if (scaleX < 5) {
      scaleX += Number(0.1);
      scaleY += Number(0.1);
    } else {
      scaleX += Number(0.5);
      scaleY += Number(0.5);
    };
    

    geometrytransform.localScale = new BS.Vector3(scaleX,scaleY,1);
    plane07material.color = new BS.Vector4(1,1,1,0.8);
    setTimeout(() => { plane07material.color = plane07color; }, 100);
  });

  // Shrink Button Thing
  plane08Object.On('click', () => {
    console.log("CLICKED08!");
    let scaleX = Number(parseFloat(geometrytransform.localScale.x).toFixed(3));
    let scaleY = Number(parseFloat(geometrytransform.localScale.y).toFixed(3));
    if (scaleX < 0.5) {
      scaleX += Number(-0.025);
      scaleY += Number(-0.025);
    } else if (scaleX < 2) {
      scaleX += Number(-0.05);
      scaleY += Number(-0.05);
    } else if (scaleX < 5) {
      scaleX += Number(-0.1);
      scaleY += Number(-0.1);
    } else {
      scaleX += Number(-0.5);
      scaleY += Number(-0.5);
    };
    if (scaleX <= 0) {scaleX = 0.025};
    if (scaleY <= 0) {scaleY = 0.025};
    geometrytransform.localScale = new BS.Vector3(scaleX,scaleY,1);
    plane08material.color = new BS.Vector4(1,1,1,0.8);
    setTimeout(() => { plane08material.color = plane08color; }, 100);
  });


  // Forward Button Thing
  plane09Object.On('click', () => {
    console.log("CLICKED09!");
    browser.RunActions(JSON.stringify({"actions":[{"actionType": "goforward"}]}));
    plane09material.color = new BS.Vector4(1,1,1,1);
    setTimeout(() => { plane09material.color = plane09color; }, 100);
  });


  // HIDE Button Thing
  plane10Object.On('click', () => {
    console.log("CLICKED10!");
    if (buttonsvisible) {
      buttonsvisible = false;
      console.log("WAS VISIBLE!");
      plane02Object.SetActive(0);
      plane03Object.SetActive(0);
      plane04Object.SetActive(0);
      plane05Object.SetActive(0);
      plane06Object.SetActive(0);
      plane07Object.SetActive(0);
      plane08Object.SetActive(0);
      plane09Object.SetActive(0);
      plane11Object.SetActive(0);
      plane12Object.SetActive(0);
      plane13Object.SetActive(0);
      plane14Object.SetActive(0);
      plane15Object.SetActive(0);
      if (p_custombutton01url != "false") {
        plane16Object.SetActive(0);
        textgameObject01.SetActive(0);
      };
      if (p_custombutton02url != "false") {
        plane17Object.SetActive(0);
        textgameObject02.SetActive(0);
      };
      if (p_custombutton03url != "false") {
        plane18Object.SetActive(0);
        textgameObject03.SetActive(0);
      };
      if (p_custombutton04url != "false") {
        plane19Object.SetActive(0);
        textgameObject04.SetActive(0);
      };
      plane10material.color = new BS.Vector4(1,1,1,0.5);
    } else {
      buttonsvisible = true;
      console.log("WAS HIDDEN!");
      plane02Object.SetActive(1);
      plane03Object.SetActive(1);
      plane04Object.SetActive(1);
      plane05Object.SetActive(1);
      plane06Object.SetActive(1);
      plane07Object.SetActive(1);
      plane08Object.SetActive(1);
      plane09Object.SetActive(1);
      plane11Object.SetActive(0);
      plane12Object.SetActive(1);
      plane13Object.SetActive(1);
      plane14Object.SetActive(1);
      plane15Object.SetActive(1);
      if (p_custombutton01url != "false") {
        plane16Object.SetActive(1);
        textgameObject01.SetActive(1);
      };
      if (p_custombutton02url != "false") {
        plane17Object.SetActive(1);
        textgameObject02.SetActive(1);
      };
      if (p_custombutton03url != "false") {
        plane18Object.SetActive(1);
        textgameObject03.SetActive(1);
      };
      if (p_custombutton04url != "false") {
        plane19Object.SetActive(1);
        textgameObject04.SetActive(1);
      };
      plane10material.color = thebuttonscolor;
    };
  });

  // HAND ICON Button Thing
  plane11Object.On('click', e => {
    console.log("CLICKED11!");
    // Do something with e.detail.point and e.detail.normal.
    console.log("points: X:" + e.detail.point.x + " Y:" + e.detail.point.y + " Z:" + e.detail.point.z);
    console.log("normals: X:" + e.detail.normal.x + " Y:" + e.detail.normal.y + " Z:" + e.detail.normal.z);
    detailpoint = e.detail.point;
    detailnormal = e.detail.normal;
    plane11material.color = new BS.Vector4(1,1,1,1);
    setTimeout(() => { plane11material.color = plane11color; }, 100);
  });

  
  // MUTE Button Thing
  plane12Object.On('click', () => {
    console.log("CLICKED12!");
    if (browsermuted) {
      browsermuted = false;
      browser.RunActions(JSON.stringify(
        {"actions":[{"actionType": "runscript","strparam1": "document.querySelectorAll('video, audio').forEach((elem) => elem.muted=false);"}]}));
        plane12material.color = plane12color;
    } else {
      browsermuted = true;
      browser.RunActions(JSON.stringify(
        {"actions":[{"actionType": "runscript","strparam1": "document.querySelectorAll('video, audio').forEach((elem) => elem.muted=true);"}]}));
        plane12material.color = new BS.Vector4(1,0,0,1);
    };

  });

  
  // VOLUME DOWN Button Thing
  plane13Object.On('click', () => {
    console.log("CLICKED13!");
    firevolume = Number(firevolume);
    if (firevolume < 0.1) {
      firevolume += Number(-0.01);
    } else if (firevolume < 0.5) {
      firevolume += Number(-0.03);
    } else {
      firevolume += Number(-0.05);
    };
		firevolume = parseFloat(firevolume).toFixed(2);
		if (firevolume < 0) {firevolume = 0};
    console.log("The Volume: " + firevolume);
    browser.RunActions(JSON.stringify(
      {"actions":[{"actionType": "runscript","strparam1": "document.querySelectorAll('video, audio').forEach((elem) => elem.volume=" + firevolume + ");"}]}));
    plane13material.color = new BS.Vector4(1,1,1,0.8);
    setTimeout(() => { plane13material.color = plane13color; }, 100);
    
  });

  
  // VOLUME UP Button Thing
  plane14Object.On('click', () => {
    console.log("CLICKED14!");
    firevolume = Number(firevolume);
    if (firevolume < 0.1) {
      firevolume += Number(0.01);
    } else if (firevolume < 0.5) {
      firevolume += Number(0.02);
    } else {
      firevolume += Number(0.05);
    };
		firevolume = parseFloat(firevolume).toFixed(2);
		if (firevolume > 1) {firevolume = 1};
    console.log("The Volume: " + firevolume);
    browser.RunActions(JSON.stringify(
      {"actions":[{"actionType": "runscript","strparam1": "document.querySelectorAll('video, audio').forEach((elem) => elem.volume=" + firevolume + ");"}]}));
      plane14material.color = new BS.Vector4(1,1,1,0.8);
      setTimeout(() => { plane14material.color = plane14color; }, 100);
  });

  // Billboard Button Thing
  plane15Object.On('click', () => {
    console.log("CLICKED15!");
    if (isbillboarded) {
      isbillboarded = false;
      billBoard.enableXAxis = false;
      billBoard.enableYAxis = false;
      // billBoard.enableZAxis = false;
      plane15material.color = new BS.Vector4(1,1,1,1);
    } else {
      isbillboarded = true;
      billBoard.enableXAxis = true;
      billBoard.enableYAxis = true;
      // billBoard.enableZAxis = true;
      plane15material.color = plane15color;
    };
  });


  // EXTRA Button Thing 01
  
  if (p_custombutton01url != "false") {
      plane16Object.On('click', () => {
      console.log("CLICKED01!");
      browser.url = p_custombutton01url;
      plane16material.color = new BS.Vector4(0.3,0.3,0.3,1);
      setTimeout(() => { plane16material.color = plane16color; }, 100);
    });
  };

  // EXTRA Button Thing 02
  if (p_custombutton02url != "false") {
    plane17Object.On('click', () => {
      console.log("CLICKED02!");
      browser.url = p_custombutton02url;
      plane17material.color = new BS.Vector4(0.3,0.3,0.3,1);
      setTimeout(() => { plane17material.color = plane17color; }, 100);
    });
  };

  // EXTRA Button Thing 03
  if (p_custombutton03url != "false") {
    plane18Object.On('click', () => {
      console.log("CLICKED03!");
      browser.url = p_custombutton03url;
      plane18material.color = new BS.Vector4(0.3,0.3,0.3,1);
      setTimeout(() => { plane18material.color = plane18color; }, 100);
    });
  };

  // EXTRA Button Thing 04
  if (p_custombutton04url != "false") {
    plane19Object.On('click', () => {
      console.log("CLICKED04!");
      browser.url = p_custombutton04url;
      plane19material.color = new BS.Vector4(0.3,0.3,0.3,1);
      setTimeout(() => { plane19material.color = plane19color; }, 100);
    });
  };

  // plane09Object.SetActive(0)
  // browser.RunActions({actionType: click2d,150,150});



// browser-message - Fired when a message is received from a browser in the space.  
  browser.On("browser-message", e => {
    // Do something with e.detail.
      console.log(e)
  });
    
  firescenev2.On("menu-browser-message", e => {
    // Do something with e.detail
    console.log(e)
  });

  firescenev2.On("one-shot", e => {
    // Do something with e.detail.fromId, e.detail.fromAdmin and e.detail.data which is the ID and admin status of the user who sent the one-shot message, and the message itself.
    console.log(e)
  });


  firescenev2.On("user-joined", e => {
    // When a user Joins the space, Check their UserID against the list
    if (e.detail.isLocal) { // e.detail.uid
  
      // Setup Hand Controls only on the first run if enabled
      if (p_handbuttons == "true" && firstrunhandcontrolsv2 === true) {
        firstrunhandcontrolsv2 = false;
        console.log("FIRESCREEN2: Enabling Hand Controls");

        playersuseridv2 = e.detail.uid;
        setupHandControls();


      };

      
      console.log("success");

    };
  });



  async function setupHandControls() { // handControlsContainer.setAttribute("position", "0.04 0.006 -0.010");
    // THE CONTAINER FOR THE HAND BUTTONS
    console.log("FIRESCREEN2: Hand Control Stuff");
    const geometryType = BS.GeometryType.PlaneGeometry;
    const parametricType = null;
    const depth = 1;
    const widthSegments = 1;
    const heightSegments = 1;
    const depthSegments = 1;
    const radius = 1;
    const segments = 24;
    const thetaStart = 0;
    const thetaLength = 6.283185;
    const phiStart = 0;
    const phiLength = 6.283185;
    const radialSegments = 8;
    const openEnded = false;
    const radiusTop = 1;
    const radiusBottom = 1;
    const innerRadius = 0.3;
    const outerRadius = 1;
    const thetaSegments = 24;
    const phiSegments = 8;
    const tube = 0.4;
    const tubularSegments = 16;
    const arc = 6.283185;
    const p = 2;
    const q = 3;
    const stacks = 5;
    const slices = 5;
    const detail = 0;
    const parametricPoints = "";
    plane20Object = new BS.GameObject("MyGeometry20");
    const plane20geometry = await plane20Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 1, 1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
    const plane20size = new BS.Vector3(1,1,1);
    plane20color = new BS.Vector4(0,0,0,0);
    const center = new BS.Vector3(0,0,0);
    const plane20Collider = await plane20Object.AddComponent(new BS.BoxCollider(true, center, plane20size));
    plane20material = await plane20Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", null, plane20color, 1, false));
    const plane20transform = await plane20Object.AddComponent(new BS.Transform());
    // await plane20Object.SetLayer(5); // UI Layer
    // firescenev2.localUser.Attach(plane20Object,BS.LegacyAttachmentPosition.LEFT_HAND);
    firescenev2.LegacyAttachObject(plane20Object, playersuseridv2, BS.LegacyAttachmentPosition.LEFT_HAND)
    // const plane20transform = plane20Object.GetComponent(BS.ComponentType.Transform)
    plane20transform.localPosition = new BS.Vector3(0,-0.006,0.010);
    plane20transform.localScale = new BS.Vector3(0.1,0.1,0.1);
    // plane20transform.localRotation = new BS.Vector3(0,1,0);
    // plane20transform.eulerAngles = new BS.Vector3(90,-90,90);
    plane20transform.localEulerAngles = new BS.Vector3(20,260,0);


    // HAND VOLUME UP BUTTON
    plane21Object = new BS.GameObject("MyGeometry21");
    const plane21geometry = await plane21Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 1, 1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
    const plane21size = new BS.Vector3(1,1,1);
    const plane21Collider = await plane21Object.AddComponent(new BS.BoxCollider(true, center, plane21size));
    plane21material = await plane21Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", p_iconvolupurl, plane14color, 1, false));
    const plane21transform = await plane21Object.AddComponent(new BS.Transform());
    await plane21Object.SetParent(plane20Object, false);
    plane21transform.localPosition = new BS.Vector3(0.4,0.4,0.3);
    plane21transform.localScale = new BS.Vector3(0.4,0.4,0.4);
    await plane21Object.SetLayer(5); // UI Layer
    // const plane21transform = plane21Object.GetComponent(BS.ComponentType.Transform)

    // HAND VOLUME DOWN BUTTON
    plane22Object = new BS.GameObject("MyGeometry22");
    const plane22geometry = await plane22Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 1, 1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
    const plane22size = new BS.Vector3(1,1,1);
    const plane22Collider = await plane22Object.AddComponent(new BS.BoxCollider(true, center, plane22size));
    plane22material = await plane22Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", p_iconvoldownurl, plane13color, 1, false));
    const plane22transform = await plane22Object.AddComponent(new BS.Transform());
    await plane22Object.SetParent(plane20Object, false);
    plane22transform.localPosition = new BS.Vector3(0.0,0.4,0.3);
    plane22transform.localScale = new BS.Vector3(0.4,0.4,0.4);
    await plane22Object.SetLayer(5); // UI Layer
    // const plane22transform = plane22Object.GetComponent(BS.ComponentType.Transform)

    // HAND MUTE BUTTON
    plane23Object = new BS.GameObject("MyGeometry23");
    const plane23geometry = await plane23Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 1, 1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
    const plane23size = new BS.Vector3(1,1,1);
    const plane23Collider = await plane23Object.AddComponent(new BS.BoxCollider(true, center, plane23size));
    plane23material = await plane23Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", p_iconmuteurl, plane12color, 1, false));
    const plane23transform = await plane23Object.AddComponent(new BS.Transform());
    await plane23Object.SetParent(plane20Object, false);
    plane23transform.localPosition = new BS.Vector3(-0.4,0.4,0.3);
    plane23transform.localScale = new BS.Vector3(0.4,0.4,0.4);
    await plane23Object.SetLayer(5); // UI Layer
    // const plane23transform = plane23Object.GetComponent(BS.ComponentType.Transform)

    // HAND LOCK BUTTON
    plane24Object = new BS.GameObject("MyGeometry24");
    const plane24geometry = await plane24Object.AddComponent(new BS.BanterGeometry(geometryType, parametricType, 1, 1, depth, widthSegments, heightSegments, depthSegments, radius, segments, thetaStart, thetaLength, phiStart, phiLength, radialSegments, openEnded, radiusTop, radiusBottom, innerRadius, outerRadius, thetaSegments, phiSegments, tube, tubularSegments, arc, p, q, stacks, slices, detail, parametricPoints));
    const plane24size = new BS.Vector3(1,1,1);
    const plane24color = new BS.Vector4(1,1,1,0.7);
    const plane24Collider = await plane24Object.AddComponent(new BS.BoxCollider(true, center, plane24size));
    plane24material = await plane24Object.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", "https://firer.at/files/lock.png", plane24color, 1, false));
    const plane24transform = await plane24Object.AddComponent(new BS.Transform());
    await plane24Object.SetParent(plane20Object, false);
    plane24transform.localPosition = new BS.Vector3(0,-0.1,0.3);
    plane24transform.localScale = new BS.Vector3(0.4,0.4,0.4);
    plane24transform.localEulerAngles = new BS.Vector3(0,0,180);
    await plane24Object.SetLayer(5); // UI Layer
    // const plane24transform = plane24Object.GetComponent(BS.ComponentType.Transform)




    console.log("FIRESCREEN2: Hand Control Stuff Setup");

    // HAND BUTTON VOLUME UP
    plane21Object.On('click', () => {
      console.log("CLICKED01!");
      firevolume = Number(firevolume);
      if (firevolume < 0.1) {
        firevolume += Number(0.01);
      } else if (firevolume < 0.5) {
        firevolume += Number(0.02);
      } else {
        firevolume += Number(0.05);
      };
      firevolume = parseFloat(firevolume).toFixed(2);
      if (firevolume > 1) {firevolume = 1};
      console.log("The Volume: " + firevolume);
      browser.RunActions(JSON.stringify(
        {"actions":[{"actionType": "runscript","strparam1": "document.querySelectorAll('video, audio').forEach((elem) => elem.volume=" + firevolume + ");"}]}));

      plane21material.color = new BS.Vector4(1,1,1,0.8);
      setTimeout(() => { plane21material.color = plane14color; }, 100);
    });

    // HAND BUTTON VOLUME DOWN
    plane22Object.On('click', () => {
      console.log("CLICKED02!");
      firevolume = Number(firevolume);
      if (firevolume < 0.1) {
        firevolume += Number(-0.01);
      } else if (firevolume < 0.5) {
        firevolume += Number(-0.03);
      } else {
        firevolume += Number(-0.05);
      };
      firevolume = parseFloat(firevolume).toFixed(2);
      if (firevolume < 0) {firevolume = 0};
      console.log("The Volume: " + firevolume);
      browser.RunActions(JSON.stringify(
        {"actions":[{"actionType": "runscript","strparam1": "document.querySelectorAll('video, audio').forEach((elem) => elem.volume=" + firevolume + ");"}]}));

      plane22material.color = new BS.Vector4(1,1,1,0.8);
      setTimeout(() => { plane22material.color = plane13color; }, 100);
    });

    // HAND BUTTON MUTE
    plane23Object.On('click', () => {
      console.log("CLICKED03!");

      if (browsermuted) {
        browsermuted = false;
        browser.RunActions(JSON.stringify(
          {"actions":[{"actionType": "runscript","strparam1": "document.querySelectorAll('video, audio').forEach((elem) => elem.muted=false);"}]}));
          plane12material.color = plane12color;
          plane23material.color = plane12color;
      } else {
        browsermuted = true;
        browser.RunActions(JSON.stringify(
          {"actions":[{"actionType": "runscript","strparam1": "document.querySelectorAll('video, audio').forEach((elem) => elem.muted=true);"}]}));
          plane12material.color = new BS.Vector4(1,0,0,1);
          plane23material.color = new BS.Vector4(1,0,0,1);
      };

    });

    // HAND BUTTON LOCK PLAYER
    plane24Object.On('click', () => {
      console.log("CLICKED04!");

      if (playerislockedv2) {
        playerislockedv2 = false;
        unlockPlayer();
        plane24material.color = plane24color;
      } else {
        playerislockedv2 = true;
        lockPlayer();
        plane24material.color = new BS.Vector4(1,0,0,1);
      };
    });
    console.log("FIRESCREEN2: Hand Click Stuff END");

  };


  firescenev2.On("unity-loaded", () => {
    console.log("FIRESCREEN2: unity-loaded");

    // Setup the Announcer only on the first run if enabled
    if (p_announcer === "true" && announcerfirstrunv2 === true ) {
      announcerfirstrunv2 = false;
      console.log("FIRESCREEN2: Enabling the Announcer Script");
      const announcerscript = document.createElement("script");
      announcerscript.id = "fires-announcer";
      announcerscript.setAttribute("src", announcerscripturlv2);
      announcerscript.setAttribute("announce", p_announcer);
      announcerscript.setAttribute("announce-420", p_announce420);
      announcerscript.setAttribute("announce-events", p_announceevents);
      document.querySelector("body").appendChild(announcerscript);
    } else if (p_announce === "true" && announcerfirstrunv2 === true ) {
      announcerfirstrunv2 = false;
      console.log("FIRESCREEN2: Enabling the Announcer Script");
      const announcerscript = document.createElement("script");
      announcerscript.id = "fires-announcer";
      announcerscript.setAttribute("src", announcerscripturlv2);
      announcerscript.setAttribute("announce", p_announce);
      announcerscript.setAttribute("announce-420", p_announce420);
      announcerscript.setAttribute("announce-events", p_announceevents);
      document.querySelector("body").appendChild(announcerscript);
    };
    if (p_announceevents2 === "true" && announcerfirstrunv2 === true && p_announcer === "false" && p_announce === "false" ) {
      announcerfirstrunv2 = false;
      console.log("FIRESCREEN2: Enabling the Announce-Events Script");
      const announcerscript = document.createElement("script");
      announcerscript.id = "fires-announcer";
      announcerscript.setAttribute("src", announcerscripturlv2);
      announcerscript.setAttribute("announce", p_announce);
      announcerscript.setAttribute("announce-420", p_announce420);
      announcerscript.setAttribute("announce-events", p_announceevents2);
      document.querySelector("body").appendChild(announcerscript);

    };

    setTimeout(() => { 
      if (announcerfirstrunv2 === false) {
        timenow = Date.now(); 
      }
      
    }, 1000);

  });

  // MATERIAL SHADER STUFF
  // "Legacy Shaders/Transparent/Diffuse" || "Unlit/Transparent Cutout" || "Unlit/Transparent" || "Mobile/Particles/Additive" || "Mobile/Particles/Alpha Blended" || "Sprites/Diffuse" || "Sprites/Default" || "Unlit/DiffuseTransparent" || "Unlit/Texture"

  
  // afterLoadActions: [ {&quot;actionType&quot;: &quot;click2d&quot;, &quot;numParam1&quot;: 150, &quot;numParam2&quot;: 150}]

  // browser.RunActions([{
  //   actionType: 'goback'
  // }]);
  
  // browser.RunActions([ { actionType: "runscript", strparam1:
  //   "document.querySelectorAll('video, audio').forEach((elem) => elem.volume=" + 0.1 + ");", }, ]);

  // const component = geometryObject.GetComponent(BS.ComponentType.BanterPhysicMaterial);

  // SendBrowserMessage - Send a post message to the browser in the menu. See Browser Communication for more info.
  // await firescenev2.SendBrowserMessage(id: string);

  // await firescenev2.OneShot(data: any, allInstances = true);

  // const gameObject = await firescenev2.Find("MyBrowser");
  
  // const newGameObject = await gameObject.Find("MyBrowser");

  // gameObject.Destroy();

	// setTimeout(() => { keepsoundlevel2(); }, 1000);

};


function getV3FromStr(strVector3) {
  var aresult = strVector3.split(" ");
  let thisX = aresult[0]; let thisY = aresult[1]; let thisZ = aresult[2];
  return new BS.Vector3(thisX,thisY,thisZ);
};

function getV4FromStr(strVector4) {
  if (strVector4 == "false") {
    return strVector4;
  } else {
    var aresult = strVector4.split(" ");
    let thisX = aresult[0]; let thisY = aresult[1]; let thisZ = aresult[2]; let thisW= aresult[3];
    return new BS.Vector4(thisX,thisY,thisZ,thisW);
  };
};

function getAttrOrDef(pScript, pAttr, pDefault) {
  if (pScript.hasAttribute(pAttr)) {
    return pScript.getAttribute(pAttr);
  } else {
    return pDefault;
  };
};

var volinterval2 = null;
var soundlevel2firstrun = true;
function keepsoundlevel2() {
  if (fireScreen2On && soundlevel2firstrun) {
	console.log("FIRESCREEN2: keepsoundlevel loop");
	soundlevel2firstrun = false;
  // Loop to keep sound level set, runs every set second(s)
    volinterval2 = setInterval(function() {

    browser.RunActions(JSON.stringify(
      {"actions":[{"actionType": "runscript","strparam1": "document.querySelectorAll('video, audio').forEach((elem) => elem.volume=" + firevolume + ");"}]}));

    }, 3000); } else if (fireScreen2On) { } else { clearInterval(volinterval2); }
};





setupfirescreen2()

