// Thank you Everyone who helped make this possible, HBR, Vanquish3r, DedZed, Sebek, Skizot, Shane and FireRat, And thank you to everyone who helped test it
// FireScreen Tablet for Screen Casts with volume controls or for a portable browser
// VERSION: 1.0 Beta 4.1
var thisscriptsurl = "https://" + location.hostname + "/scripts/firescreen.js"; // CHANGE THIS URL IF MAKING A COPY OF THIS SCRIPT AND THE 2 BELOW
var handcontrolscripturl = "https://" + location.hostname + "/scripts/handcontrols.js"; // CHANGE THIS URL
var announcerscripturl = "https://" + location.hostname + "/scripts/announcer.js"; // CHANGE THIS URL
var fireScreenOn = false;
var thebuttoncolor = "";
var volupcolor = "";
var voldowncolor = "";
var IconVolUpUrl = "";
var IconVolDownUrl = "";
var IconMuteUrl = "";
var numberofbrowsers = 0;
var announcerfirstrun = true;
var firstrunhandcontrols = true;
var handcontrolsdisabled = true;

function enableFireScreen() {
  console.log("FIRESCREEN: Enabling Screen(s)");
  // window.enableControllerExtras(); // CAN REMOVE THIS LINE
  const scripts = document.getElementsByTagName("script");
  for (let i = 0; i < scripts.length; i++) {
    if (getAttrOrDef(scripts[i], "src", "") === thisscriptsurl ) {
      const pPos = getV3FromStr(getAttrOrDef(scripts[i], "position", "1 2 -1"));
      const pRot = getV3FromStr(getAttrOrDef(scripts[i], "rotation", "0 0 0"));
      const pSca = getV3FromStr(getAttrOrDef(scripts[i], "scale", "1 1 1"));
      const pVolume = getAttrOrDef(scripts[i], "volumelevel", "0.25");
      const pWebsite = getAttrOrDef(scripts[i], "website", "https://firer.at/pages/games.html");
      const pMipmaps = getAttrOrDef(scripts[i], "mipmaps", "1");
      const pPixelsperunit = getAttrOrDef(scripts[i], "pixelsperunit", "1200");
      const pWidth = getAttrOrDef(scripts[i], "width", "1024");
      const pHeight = getAttrOrDef(scripts[i], "height", "576");
      const pBackdrop = getAttrOrDef(scripts[i], "backdrop", "true");
      const pCastMode = getAttrOrDef(scripts[i], "castmode", "false");
      const pHandButtons = getAttrOrDef(scripts[i], "hand-controls", "false");
      const pDisableInteraction = getAttrOrDef(scripts[i], "disable-interaction", "false");
      const pAnnouncer = getAttrOrDef(scripts[i], "announcer", "false");
      const pAnnounce = getAttrOrDef(scripts[i], "announce", "false");
	  const pAnnounce420 = getAttrOrDef(scripts[i], "announce-420", "false");
	  const pAnnounceEvents = getAttrOrDef(scripts[i], "announce-events", "true");
      const pButtonColor = getAttrOrDef(scripts[i], "button-color", "#00FF00");
      const pBackDropColor = getAttrOrDef(scripts[i], "backdrop-color", "#000000");
      const pVolUpColor = getAttrOrDef(scripts[i], "volup-color", "null");
      const pVolDownColor = getAttrOrDef(scripts[i], "voldown-color", "null");
      const pMuteColor = getAttrOrDef(scripts[i], "mute-color", "#FFFFFF");
      const pButtonPos = getAttrOrDef(scripts[i], "button-position", "0 0 0");
      const pIconMuteUrl = getAttrOrDef(scripts[i], "icon-mute-url", "https://firer.at/files/VolumeMute.png");
      const pIconVolUpUrl = getAttrOrDef(scripts[i], "icon-volup-url", "https://firer.at/files/VolumeHigh.png");
      const pIconVolDownUrl = getAttrOrDef(scripts[i], "icon-voldown-url", "https://firer.at/files/VolumeLow.png");
      const pIconDirectionUrl = getAttrOrDef(scripts[i], "icon-direction-url", "https://firer.at/files/Arrow.png");
      const pCustomButton01Url = getAttrOrDef(scripts[i], "custom-button01-url", "false");
      const pCustomButton01Text = getAttrOrDef(scripts[i], "custom-button01-text", "Custom Button 01");
      const pCustomButton02Url = getAttrOrDef(scripts[i], "custom-button02-url", "false");
      const pCustomButton02Text = getAttrOrDef(scripts[i], "custom-button02-text", "Custom Button 02");
      const pCustomButton03Url = getAttrOrDef(scripts[i], "custom-button03-url", "false");
      const pCustomButton03Text = getAttrOrDef(scripts[i], "custom-button03-text", "Custom Button 03");
      const pURL = "url: " + pWebsite + "; mipMaps: " + pMipmaps + "; pixelsPerUnit: " + pPixelsperunit + "; pageWidth: " + pWidth + "; pageHeight: " + pHeight + "; mode: local;";
      createFireScreen(pPos, pRot, pSca, pVolume, pURL, pBackdrop, pCastMode, pWebsite, pButtonColor, pAnnouncer, pAnnounce, pAnnounce420, pAnnounceEvents,
		pBackDropColor, pIconMuteUrl, pIconVolUpUrl, pIconVolDownUrl, pIconDirectionUrl, pVolUpColor, pVolDownColor, pMuteColor,
		pDisableInteraction, pButtonPos, pHandButtons, pWidth, pHeight, pCustomButton01Url, pCustomButton01Text, 
		pCustomButton02Url, pCustomButton02Text, pCustomButton03Url, pCustomButton03Text);
    }
  };
}

function disableFireScreen() {
	let thisloopnumber = 0;
	while (thisloopnumber < numberofbrowsers) {
		thisloopnumber++
		let firescreen = document.getElementById("fires-browser" + thisloopnumber);
		if (firescreen) {
			// Browser is on, remove it
			firescreen.parentElement.removeChild(firescreen);
			console.log("FIRESCREEN: Fire screen Disabled"); 
		}
	}
	fireScreenOn = false;
	keepsoundlevel();
};

function createFireScreen(p_pos, p_rot, p_sca, p_volume, p_url, p_backdrop, p_castmode, p_website, p_buttoncolor, p_announcer, p_announce, p_announce420, p_announceevents,
	p_backdropcolor, p_iconmuteurl, p_iconvolupurl, p_iconvoldownurl, p_icondirectionurl, p_volupcolor, p_voldowncolor, p_mutecolor,
	p_disableinteraction, p_buttonpos, p_handbuttons, p_width, p_height, p_custombutton01url, p_custombutton01text, 
	p_custombutton02url, p_custombutton02text, p_custombutton03url, p_custombutton03text) {
		// Setup Hand Controls only on the first run if enabled
        if (p_handbuttons == "true" && firstrunhandcontrols === true) {
            firstrunhandcontrols = false;
            console.log("FIRESCREEN: Enabling Hand Controls")
            const handcontrols = document.createElement("script");
            handcontrols.id = "fires-handcontrols";
            handcontrols.setAttribute("src", handcontrolscripturl);
            document.querySelector("a-scene").appendChild(handcontrols);
        };
		
		// Setup the Announcer only on the first run if enabled
		if (p_announcer === "true" && announcerfirstrun === true ) {
			announcerfirstrun = false;
			console.log("FIRESCREEN: Enabling the Announcer Script")
			const announcerscript = document.createElement("script");
			announcerscript.id = "fires-announcer";
			announcerscript.setAttribute("src", announcerscripturl);
			announcerscript.setAttribute("announce-420", p_announce420);
			announcerscript.setAttribute("announce-events", p_announceevents);
			document.querySelector("a-scene").appendChild(announcerscript);
		} else if (p_announce === "true" && announcerfirstrun === true ) {
			announcerfirstrun = false;
			console.log("FIRESCREEN: Enabling the Announcer Script")
			const announcerscript = document.createElement("script");
			announcerscript.id = "fires-announcer";
			announcerscript.setAttribute("src", announcerscripturl);
			announcerscript.setAttribute("announce-420", p_announce420);
			announcerscript.setAttribute("announce-events", p_announceevents);
			document.querySelector("a-scene").appendChild(announcerscript);
		};

	numberofbrowsers++    
	thebuttoncolor = p_buttoncolor;
	// volupcolor = p_volupcolor;
	// voldowncolor = p_voldowncolor;
    IconVolUpUrl = p_iconvolupurl;
    IconVolDownUrl = p_iconvoldownurl;
    IconMuteUrl = p_iconmuteurl;
	let firescreen = document.createElement("a-entity");
	firescreen.id = "fires-browser" + numberofbrowsers;
	firescreen.setAttribute("position", p_pos);
	firescreen.setAttribute("rotation", p_rot);
	firescreen.setAttribute("scale", p_sca);
	firescreen.setAttribute("pageWidth", p_width);
	firescreen.setAttribute("pageHeight", p_height);
	firescreen.setAttribute("volumelevel", p_volume);
	firescreen.setAttribute("button-color", p_buttoncolor);
	firescreen.setAttribute("mute-color", p_mutecolor);
	firescreen.setAttribute( "sq-browser", p_url);
	if (p_disableinteraction === "false") {
		firescreen.setAttribute("sq-browser-interaction");
		firescreen.setAttribute("enable-interaction");
	}
	firescreen.setAttribute("class", "firescreenc");
	firescreen.setAttribute("name", "firescreenc");
  
	if (p_castmode == "false") {
		firescreen.setAttribute( "sq-rigidbody", "useGravity: false; drag:10; angularDrag:10;");
	};
	fireScreenOn = true;
		
	// for the collider to allow it to be moved
	let firecollider = document.createElement("a-plane");
	firecollider.setAttribute("opacity", "0");
	firecollider.setAttribute("position", "0 0 -0.005");
	firecollider.setAttribute("scale", "1.0 0.55 0.05");
	firecollider.setAttribute("color", "#ff0000");
	firecollider.setAttribute("sq-boxcollider");
	firecollider.setAttribute("sq-grabbable");
	firecollider.setAttribute("visible", "false");
	firescreen.appendChild(firecollider);
	if (p_backdrop == "true") {
		// Backdrop for contrast
		let firebackdrop = document.createElement("a-box");
		firebackdrop.setAttribute("opacity", "0.9");
		firebackdrop.setAttribute("position", "0 0 -0.015");
		firebackdrop.setAttribute("depth", "0.01");
		firebackdrop.setAttribute("width", "1.09");
		firebackdrop.setAttribute("height", "0.64");
		firebackdrop.setAttribute("color", p_backdropcolor);
		firescreen.appendChild(firebackdrop);
	};

	if (p_castmode == "false") {
		// lock/unlock button to toggle the screen collider 
		let firelockbutton = document.createElement("a-plane");
		firelockbutton.setAttribute("position", "0 0.38 0");
		firelockbutton.setAttribute("width", "0.1");
		firelockbutton.setAttribute("height", "0.1");
		if (thebuttoncolor === "#00FF00") {
			firelockbutton.setAttribute("color", "#FFFF00");
		} else {
			firelockbutton.setAttribute("color", thebuttoncolor);
		}
		firelockbutton.setAttribute("material", "transparent: true");
		firelockbutton.setAttribute("sq-collider");
		firelockbutton.setAttribute("sq-interactable");
		firelockbutton.setAttribute("class", "buttons");
		firelockbutton.setAttribute("src", "https://firer.at/files/HG2.png");
		firelockbutton.setAttribute("lockbutton");
		firescreen.appendChild(firelockbutton);
		// Grow Button
		let firegrowbutton = document.createElement("a-plane");
		firegrowbutton.setAttribute("position", "0.6 0.06 0");
		firegrowbutton.setAttribute("width", "0.1");
		firegrowbutton.setAttribute("height", "0.1");
		firegrowbutton.setAttribute("color", thebuttoncolor);
		firegrowbutton.setAttribute("material", "transparent: true");
		firegrowbutton.setAttribute("sq-collider");
		firegrowbutton.setAttribute("sq-interactable");
		firegrowbutton.setAttribute("class", "buttons");
		firegrowbutton.setAttribute("src", "https://firer.at/files/expand.png");
		firegrowbutton.setAttribute("scale-screen", "size: shrink; avalue: 0.1");
		firescreen.appendChild(firegrowbutton);
		// Shrink Button
		let fireshrinkbutton = document.createElement("a-plane");
		fireshrinkbutton.setAttribute("position", "0.6 -0.06 0");
		fireshrinkbutton.setAttribute("width", "0.1");
		fireshrinkbutton.setAttribute("height", "0.1");
		fireshrinkbutton.setAttribute("color", thebuttoncolor);
		fireshrinkbutton.setAttribute("material", "transparent: true");
		fireshrinkbutton.setAttribute("sq-collider");
		fireshrinkbutton.setAttribute("sq-interactable");
		fireshrinkbutton.setAttribute("class", "buttons");
		fireshrinkbutton.setAttribute("src", "https://firer.at/files/shrink.png");
		fireshrinkbutton.setAttribute("scale-screen", "size: shrink; avalue: -0.1");
		firescreen.appendChild(fireshrinkbutton);
		// Rotate Left Button
		let firerotleft = document.createElement("a-plane");
		firerotleft.setAttribute("position", "-0.5 -0.37 0");
		firerotleft.setAttribute("width", "0.1");
		firerotleft.setAttribute("height", "0.1");
		firerotleft.setAttribute("color", thebuttoncolor);
		firerotleft.setAttribute("material", "transparent: true");
		firerotleft.setAttribute("sq-collider");
		firerotleft.setAttribute("sq-interactable");
		firerotleft.setAttribute("class", "tilt");
		firerotleft.setAttribute("src", "https://firer.at/files/RL.png");
		firerotleft.setAttribute("visible", "false");
		firerotleft.setAttribute("rotate", "axis: y; amount: 5");
		firescreen.appendChild(firerotleft);
		// Rotate Right Button
		let firerotright = document.createElement("a-plane");
		firerotright.setAttribute("position", "0.5 -0.37 0");
		firerotright.setAttribute("width", "0.1");
		firerotright.setAttribute("height", "0.1");
		firerotright.setAttribute("color", thebuttoncolor);
		firerotright.setAttribute("material", "transparent: true");
		firerotright.setAttribute("sq-collider");
		firerotright.setAttribute("sq-interactable");
		firerotright.setAttribute("class", "tilt");
		firerotright.setAttribute("src", "https://firer.at/files/RR.png");
		firerotright.setAttribute("visible", "false");
		firerotright.setAttribute("rotate", "axis: y; amount: -5");
		firescreen.appendChild(firerotright);
		// Tilt Forwards Button
		let firetiltforward = document.createElement("a-plane");
		firetiltforward.setAttribute("position", "-0.4 -0.37 0");
		firetiltforward.setAttribute("width", "0.1");
		firetiltforward.setAttribute("height", "0.1");
		firetiltforward.setAttribute("color", thebuttoncolor);
		firetiltforward.setAttribute("material", "transparent: true");
		firetiltforward.setAttribute("sq-collider");
		firetiltforward.setAttribute("sq-interactable");
		firetiltforward.setAttribute("class", "tilt");
		firetiltforward.setAttribute("src", "https://firer.at/files/TF.png");
		firetiltforward.setAttribute("visible", "false");
		firetiltforward.setAttribute("rotate", "axis: x; amount: 5");
		firescreen.appendChild(firetiltforward);
		// Tilt Backwards Button
		let firetiltbackward = document.createElement("a-plane");
		firetiltbackward.setAttribute("position", "0.4 -0.37 0");
		firetiltbackward.setAttribute("width", "0.1");
		firetiltbackward.setAttribute("height", "0.1");
		firetiltbackward.setAttribute("color", thebuttoncolor);
		firetiltbackward.setAttribute("material", "transparent: true");
		firetiltbackward.setAttribute("sq-collider");
		firetiltbackward.setAttribute("sq-interactable");
		firetiltbackward.setAttribute("class", "tilt");
		firetiltbackward.setAttribute("src", "https://firer.at/files/TB.png");
		firetiltbackward.setAttribute("visible", "false");
		firetiltbackward.setAttribute("rotate", "axis: x; amount: -5");
		firescreen.appendChild(firetiltbackward);

		// // Rotate Left Button test
		// let firerotlefttest = document.createElement("a-plane");
		// firerotlefttest.setAttribute("position", "-0.5 -0.47 0");
		// firerotlefttest.setAttribute("width", "0.1");
		// firerotlefttest.setAttribute("height", "0.1");
		// firerotlefttest.setAttribute("color", thebuttoncolor);
		// firerotlefttest.setAttribute("material", "transparent: true");
		// firerotlefttest.setAttribute("sq-collider");
		// firerotlefttest.setAttribute("sq-interactable");
		// firerotlefttest.setAttribute("class", "tilt");
		// firerotlefttest.setAttribute("src", "https://firer.at/files/icons/+Z.png");
		// firerotlefttest.setAttribute("visible", "false");
		// firerotlefttest.setAttribute("rotate", "axis: z; amount: 0.1");
		// firescreen.appendChild(firerotlefttest);
		// // Rotate Right Button test
		// let firerotrighttest = document.createElement("a-plane");
		// firerotrighttest.setAttribute("position", "0.5 -0.47 0");
		// firerotrighttest.setAttribute("width", "0.1");
		// firerotrighttest.setAttribute("height", "0.1");
		// firerotrighttest.setAttribute("color", thebuttoncolor);
		// firerotrighttest.setAttribute("material", "transparent: true");
		// firerotrighttest.setAttribute("sq-collider");
		// firerotrighttest.setAttribute("sq-interactable");
		// firerotrighttest.setAttribute("class", "tilt");
		// firerotrighttest.setAttribute("src", "https://firer.at/files/icons/-Z.png");
		// firerotrighttest.setAttribute("visible", "false");
		// firerotrighttest.setAttribute("rotate", "axis: z; amount: -0.1");
		// firescreen.appendChild(firerotrighttest);
		// // Tilt Forwards Button test
		// let firetiltforwardtest = document.createElement("a-plane");
		// firetiltforwardtest.setAttribute("position", "-0.4 -0.47 0");
		// firetiltforwardtest.setAttribute("width", "0.1");
		// firetiltforwardtest.setAttribute("height", "0.1");
		// firetiltforwardtest.setAttribute("color", thebuttoncolor);
		// firetiltforwardtest.setAttribute("material", "transparent: true");
		// firetiltforwardtest.setAttribute("sq-collider");
		// firetiltforwardtest.setAttribute("sq-interactable");
		// firetiltforwardtest.setAttribute("class", "tilt");
		// firetiltforwardtest.setAttribute("src", "https://firer.at/files/icons/+W.png");
		// firetiltforwardtest.setAttribute("visible", "false");
		// firetiltforwardtest.setAttribute("rotate", "axis: w; amount: 0.1");
		// firescreen.appendChild(firetiltforwardtest);
		// // Tilt Backwards Button test
		// let firetiltbackwardtest = document.createElement("a-plane");
		// firetiltbackwardtest.setAttribute("position", "0.4 -0.47 0");
		// firetiltbackwardtest.setAttribute("width", "0.1");
		// firetiltbackwardtest.setAttribute("height", "0.1");
		// firetiltbackwardtest.setAttribute("color", thebuttoncolor);
		// firetiltbackwardtest.setAttribute("material", "transparent: true");
		// firetiltbackwardtest.setAttribute("sq-collider");
		// firetiltbackwardtest.setAttribute("sq-interactable");
		// firetiltbackwardtest.setAttribute("class", "tilt");
		// firetiltbackwardtest.setAttribute("src", "https://firer.at/files/icons/-W.png");
		// firetiltbackwardtest.setAttribute("visible", "false");
		// firetiltbackwardtest.setAttribute("rotate", "axis: w; amount: -0.1");
		// firescreen.appendChild(firetiltbackwardtest);

		// Toggle Rotations Button
		let firetogglerots = document.createElement("a-plane");
		firetogglerots.setAttribute("position", "-0.6 -0.3 0");
		firetogglerots.setAttribute("width", "0.1");
		firetogglerots.setAttribute("height", "0.1");
		firetogglerots.setAttribute("color", "#FFFFFF");
		firetogglerots.setAttribute("material", "transparent: true");
		firetogglerots.setAttribute("sq-collider");
		firetogglerots.setAttribute("sq-interactable");
		firetogglerots.setAttribute("class", "buttons");
		firetogglerots.setAttribute("src", "https://firer.at/files/Rot.png");
		firetogglerots.setAttribute("enablerot", "false");
		firescreen.appendChild(firetogglerots);
		// Hide/Show Keyboard Button
		let firekeyboardtog = document.createElement("a-plane");
		firekeyboardtog.setAttribute("position", "-0.6 -0.15 0");
		firekeyboardtog.setAttribute("width", "0.1");
		firekeyboardtog.setAttribute("height", "0.1");
		firekeyboardtog.setAttribute("color", "#FFFFFF");
		firekeyboardtog.setAttribute("material", "transparent: true");
		firekeyboardtog.setAttribute("sq-collider");
		firekeyboardtog.setAttribute("sq-interactable");
		firekeyboardtog.setAttribute("class", "buttons");
		firekeyboardtog.setAttribute("src", "https://firer.at/files/Keyboard.png");
		firekeyboardtog.setAttribute("forcekeyboard", "false");
		firescreen.appendChild(firekeyboardtog);
		// Hide/Show Buttons Button
		let firevisibletog = document.createElement("a-plane");
		firevisibletog.setAttribute("position", "-0.6 0 0");
		firevisibletog.setAttribute("width", "0.1");
		firevisibletog.setAttribute("height", "0.1");
		firevisibletog.setAttribute("color", "#FFFFFF");
		firevisibletog.setAttribute("material", "transparent: true");
		firevisibletog.setAttribute("sq-collider");
		firevisibletog.setAttribute("sq-interactable");
		firevisibletog.setAttribute("src", "https://firer.at/files/Eye.png");
		firevisibletog.setAttribute("hidebuttons");
		firescreen.appendChild(firevisibletog);
		// Info Button
		let fireinfobut = document.createElement("a-plane");
		fireinfobut.setAttribute("position", "-0.6 0.28 0");
		fireinfobut.setAttribute("width", "0.1");
		fireinfobut.setAttribute("height", "0.1");
		fireinfobut.setAttribute("color", thebuttoncolor);
		fireinfobut.setAttribute("material", "transparent: true");
		fireinfobut.setAttribute("sq-collider");
		fireinfobut.setAttribute("sq-interactable");
		fireinfobut.setAttribute("class", "buttons");
		fireinfobut.setAttribute("src", "https://firer.at/files/Info.png");
		fireinfobut.setAttribute("click-url", "url: https://firer.at/pages/Info.html");
		firescreen.appendChild(fireinfobut);
		// Go Forwards Button
		let forwardbutpos = "-0.4 0.38 0"
		let fireforward = document.createElement("a-plane");
		const forwardArray = p_buttonpos.split(" ");
		const forwardposArray = forwardbutpos.split(" ");
		forwardbutpos = (Number(forwardArray[0]) + Number(forwardposArray[0])) + " " + (Number(forwardArray[1]) + Number(forwardposArray[1])) + " " + (Number(forwardArray[2]) + Number(forwardposArray[2]));
		fireforward.setAttribute("position", forwardbutpos);
		fireforward.setAttribute("width", "0.1");
		fireforward.setAttribute("height", "0.1");
		fireforward.setAttribute("color", thebuttoncolor);
		fireforward.setAttribute("material", "transparent: true");
		fireforward.setAttribute("sq-collider");
		fireforward.setAttribute("sq-interactable");
		fireforward.setAttribute("class", "buttons");
		fireforward.setAttribute("src", p_icondirectionurl);
		fireforward.setAttribute("navigate-browser", "action: goforward");
		fireforward.setAttribute("rotation", "0 0 180");
		firescreen.appendChild(fireforward);
		// Google Button
		let firegooglebut = document.createElement("a-plane");
		firegooglebut.setAttribute("position", "-0.6 0.16 0");
		firegooglebut.setAttribute("width", "0.1");
		firegooglebut.setAttribute("height", "0.1");
		firegooglebut.setAttribute("material", "transparent: true");
		firegooglebut.setAttribute("sq-collider");
		firegooglebut.setAttribute("sq-interactable");
		firegooglebut.setAttribute("class", "buttons");
		firegooglebut.setAttribute("src", "https://firer.at/files/Google.png");
		firegooglebut.setAttribute("click-url", "url:https://google.com/");
		firescreen.appendChild(firegooglebut);
	};

	// Home Button
	let homebutpos = "-0.27 0.38 0"
	let firehomebut = document.createElement("a-plane");
	const homeArray = p_buttonpos.split(" ");
	const homeposArray = homebutpos.split(" ");
	homebutpos = (Number(homeArray[0]) + Number(homeposArray[0])) + " " + (Number(homeArray[1]) + Number(homeposArray[1])) + " " + (Number(homeArray[2]) + Number(homeposArray[2]));
	firehomebut.setAttribute("position", homebutpos);
	firehomebut.setAttribute("width", "0.1");
	firehomebut.setAttribute("height", "0.1");
	if (thebuttoncolor === "#00FF00") {
		firehomebut.setAttribute("color", "#FF0000");
	} else {
		firehomebut.setAttribute("color", thebuttoncolor);
	}
	firehomebut.setAttribute("material", "transparent: true");
	firehomebut.setAttribute("sq-collider");
	firehomebut.setAttribute("sq-interactable");
	firehomebut.setAttribute("class", "buttons");
	firehomebut.setAttribute("src", "https://firer.at/files/Home.png");
	firehomebut.setAttribute("click-url", "url:" + p_website);
	firescreen.appendChild(firehomebut);

	// Go Back Button
	let backbutpos = "-0.5 0.38 0";
	let firebackward = document.createElement("a-plane");
	const backArray = p_buttonpos.split(" ");
	const backposArray = backbutpos.split(" ");
	backbutpos = (Number(backArray[0]) + Number(backposArray[0])) + " " + (Number(backArray[1]) + Number(backposArray[1])) + " " + (Number(backArray[2]) + Number(backposArray[2]));
	firebackward.setAttribute("position", backbutpos);
	firebackward.setAttribute("width", "0.1");
	firebackward.setAttribute("height", "0.1");
	firebackward.setAttribute("color", thebuttoncolor);
	firebackward.setAttribute("material", "transparent: true");
	firebackward.setAttribute("sq-collider");
	firebackward.setAttribute("sq-interactable");
	firebackward.setAttribute("class", "buttons");
	firebackward.setAttribute("src", p_icondirectionurl);
	firebackward.setAttribute("navigate-browser", "action: goback");
	firescreen.appendChild(firebackward); 
	// Mute/UnMute Button
	let mutebutpos = "0.2 0.38 0";
	let firemutebut = document.createElement("a-plane");
	const muteArray = p_buttonpos.split(" ");
	const muteposArray = mutebutpos.split(" ");
	mutebutpos = (Number(muteArray[0]) + Number(muteposArray[0])) + " " + (Number(muteArray[1]) + Number(muteposArray[1])) + " " + (Number(muteArray[2]) + Number(muteposArray[2]));
	firemutebut.setAttribute("position", mutebutpos);
	firemutebut.setAttribute("width", "0.1");
	firemutebut.setAttribute("height", "0.1");
	firemutebut.setAttribute("color", p_mutecolor);
	firemutebut.setAttribute("material", "transparent: true");
	firemutebut.setAttribute("sq-collider");
	firemutebut.setAttribute("sq-interactable");
	firemutebut.setAttribute("class", "buttons");
	firemutebut.setAttribute("src", p_iconmuteurl);
	firemutebut.setAttribute("toggle-mute");
	firemutebut.setAttribute("class", "firemutebutc buttons");
	firescreen.appendChild(firemutebut);
	// Volume Up Button
	let volupbutpos = "0.5 0.38 0";
	let firevolup = document.createElement("a-plane");
	const volupArray = p_buttonpos.split(" ");
	const volupposArray = volupbutpos.split(" ");
	volupbutpos = (Number(volupArray[0]) + Number(volupposArray[0])) + " " + (Number(volupArray[1]) + Number(volupposArray[1])) + " " + (Number(volupArray[2]) + Number(volupposArray[2]));
	firevolup.setAttribute("position", volupbutpos);
	firevolup.setAttribute("width", "0.1");
	firevolup.setAttribute("height", "0.1");
	if (p_volupcolor === "null") {
		firevolup.setAttribute("color", thebuttoncolor);
		volupcolor = "#00FF00";
	} else {
		firevolup.setAttribute("color", p_volupcolor);
		volupcolor = p_volupcolor;
	}
	firevolup.setAttribute("material", "transparent: true");
	firevolup.setAttribute("sq-collider");
	firevolup.setAttribute("sq-interactable");
	firevolup.setAttribute("class", "buttons");
	firevolup.setAttribute("src", p_iconvolupurl);
	firevolup.setAttribute("volume-level", "vvalue: 0.05");
	firescreen.appendChild(firevolup);
	// Volume Down Button
	let voldownbutpos = "0.35 0.38 0";
	let firevoldown = document.createElement("a-plane");
	let voldownArray = p_buttonpos.split(" ");
	let voldownposArray = voldownbutpos.split(" ");
	voldownbutpos = (Number(voldownArray[0]) + Number(voldownposArray[0])) + " " + (Number(voldownArray[1]) + Number(voldownposArray[1])) + " " + (Number(voldownArray[2]) + Number(voldownposArray[2]));
	firevoldown.setAttribute("position", voldownbutpos);
	firevoldown.setAttribute("width", "0.1");
	firevoldown.setAttribute("height", "0.1");
	if (p_voldowncolor === "null") {
		firevoldown.setAttribute("color", thebuttoncolor);
		voldowncolor = "#FFFF00";
	} else {
		firevoldown.setAttribute("color", p_voldowncolor);
		voldowncolor = p_voldowncolor;
	}
	firevoldown.setAttribute("material", "transparent: true");
	firevoldown.setAttribute("sq-collider");
	firevoldown.setAttribute("sq-interactable");
	firevoldown.setAttribute("class", "buttons");
	firevoldown.setAttribute("src", p_iconvoldownurl);
	firevoldown.setAttribute("volume-level", "vvalue: -0.05");
	firescreen.appendChild(firevoldown);


	
	if (p_custombutton01url != "false") {
		// Custom Button 01 Part 1
		let fireextra01 = document.createElement("a-plane");
		fireextra01.id = "extra-button-1";
		fireextra01.setAttribute("position", "0.68 0.3 0");
		fireextra01.setAttribute("width", "0.2");
		fireextra01.setAttribute("height", "0.04");
		fireextra01.setAttribute("material", "transparent: true");
		fireextra01.setAttribute("color", "#000000");
		fireextra01.setAttribute("sq-collider");
		fireextra01.setAttribute("sq-interactable");
		fireextra01.setAttribute("class", "buttons");
		fireextra01.setAttribute("click-url", "url:" + p_custombutton01url);
		firescreen.appendChild(fireextra01);
		// Custom Button 01 Part 2
		let fireextra01p2 = document.createElement("a-text");
		fireextra01p2.setAttribute("value", p_custombutton01text);
		fireextra01p2.setAttribute("position", "0 0 0.005");
		fireextra01p2.setAttribute("scale", "0.11 0.11 0.11");
		fireextra01p2.setAttribute("color", "#FFFFFF");
		fireextra01p2.setAttribute("align", "center");
		fireextra01.appendChild(fireextra01p2);

	};

	if (p_custombutton02url != "false") {
		// Extra Button 02 Part 1
		let fireextra02 = document.createElement("a-plane");
		fireextra02.id = "extra-button-2";
		fireextra02.setAttribute("position", "0.68 0.25 0");
		fireextra02.setAttribute("width", "0.2");
		fireextra02.setAttribute("height", "0.04");
		fireextra02.setAttribute("material", "transparent: true");
		fireextra02.setAttribute("color", "#000000");
		fireextra02.setAttribute("sq-collider");
		fireextra02.setAttribute("sq-interactable");
		fireextra02.setAttribute("class", "buttons");
		fireextra02.setAttribute("click-url", "url:" + p_custombutton02url);
		firescreen.appendChild(fireextra02);
		// Extra Button 02 Part 2
		let fireextra02p2 = document.createElement("a-text");
		fireextra02p2.setAttribute("value", p_custombutton02text);
		fireextra02p2.setAttribute("position", "0 0 0.005");
		fireextra02p2.setAttribute("scale", "0.11 0.11 0.11");
		fireextra02p2.setAttribute("color", "#FFFFFF");
		fireextra02p2.setAttribute("align", "center");
		fireextra02.appendChild(fireextra02p2);
	};
	if (p_custombutton03url != "false") {
		// Extra Button 03 Part 1
		let fireextra03 = document.createElement("a-plane");
		fireextra03.id = "extra-button-3";
		fireextra03.setAttribute("position", "0.68 -0.3 0");
		fireextra03.setAttribute("width", "0.2");
		fireextra03.setAttribute("height", "0.04");
		fireextra03.setAttribute("material", "transparent: true");
		fireextra03.setAttribute("color", "#000000");
		fireextra03.setAttribute("sq-collider");
		fireextra03.setAttribute("sq-interactable");
		fireextra03.setAttribute("class", "buttons");
		fireextra03.setAttribute("click-url", "url:" + p_custombutton03url);
		firescreen.appendChild(fireextra03);
		// Extra Button 03 Part 2
		let fireextra03p2 = document.createElement("a-text");
		fireextra03p2.setAttribute("value", p_custombutton03text);
		fireextra03p2.setAttribute("position", "0 0 0.005");
		fireextra03p2.setAttribute("scale", "0.11 0.11 0.11");
		fireextra03p2.setAttribute("color", "#FFFFFF");
		fireextra03p2.setAttribute("align", "center");
		fireextra03.appendChild(fireextra03p2);
	}; 
	document.querySelector("a-scene").appendChild(firescreen);
	setTimeout(() => { setBrowserWidths(); keepsoundlevel(); }, 1500);
	console.log("FIRESCREEN: " + numberofbrowsers + " screen(s) Enabled");
	
};


// Sets the default sound level probably
var volinterval = null;
var soundlevelfirstrun = true;
function keepsoundlevel() {
  if (fireScreenOn && soundlevelfirstrun) {
	console.log("FIRESCREEN: keepsoundlevel loop");
	soundlevelfirstrun = false;
  // Loop to keep sound level set, runs every second
    volinterval = setInterval(function() {
		let thisloopnumber = 0;
		while (thisloopnumber < numberofbrowsers) {
			thisloopnumber++
			let theBrowser = document.getElementById("fires-browser" + thisloopnumber);
			let volume = parseFloat(theBrowser.getAttribute("volumelevel"));
			theBrowser.components["sq-browser"].runActions([ { actionType: "runscript", strparam1:
			"document.querySelectorAll('video, audio').forEach((elem) => elem.volume=" + volume + ");", }, ]);
			// document.querySelectorAll('.firescreenc')
			//   .forEach((firescreenc) => {
			// 	setTimeout(() => { 
			// 		let volume = parseFloat(firescreenc.getAttribute("volumelevel"));
			// 		firescreenc.components["sq-browser"].runActions([ { actionType: "runscript", strparam1:
			// 		"document.querySelectorAll('video, audio').forEach((elem) => elem.volume=" + volume + ");", }, ]);
			// 	}, 1000);
			//   });

		}
    }, 5000); } else if (fireScreenOn) { } else { clearInterval(volinterval); }
};

// Set the width and height of the screen(s)
var widthalreadyset = false;
function setBrowserWidths() {
	if (widthalreadyset === false) {
		widthalreadyset = true;
		let thisloopnumber = 0;
		while (thisloopnumber < numberofbrowsers) {
			thisloopnumber++
			let theBrowser = document.getElementById("fires-browser" + thisloopnumber);
			let browserpageWidth = theBrowser.getAttribute("pageWidth");
			let browserpageHeight = theBrowser.getAttribute("pageHeight");
			theBrowser.browser.pageWidth=browserpageWidth;
			theBrowser.browser.pageHeight=browserpageHeight;
			
			theBrowser.transform.WatchProperties([BS.PropertyName.position, BS.PropertyName.eulerAngles]); // Test Watch Properties
			// console.log(`FIRESCREEN: Position: ${JSON.stringify(theBrowser.transform.position)} Rotation: ${JSON.stringify(theBrowser.transform.rotation)}`);

			let x = theBrowser.object3D.rotation.x;
			let y = theBrowser.object3D.rotation.y;
			let z = theBrowser.object3D.rotation.z;
			// theBrowser.transform.lerpRotation = true;
			theBrowser.transform.eulerAngles = new BS.Vector3(x, y, z); 

			console.log("FIRESCREEN: " + thisloopnumber + " Width is: " + browserpageWidth + " and Height: " + browserpageHeight);

			if (announcerfirstrun === false) {
			announcefirstrun = false;
			timenow = Date.now(); 
			}
		};
	};
}


// Enables Interaction for all the browser windows by HBR

	AFRAME.registerComponent("enable-interaction", { init: async function() { await window.AframeInjection.waitFor(this.el, "browser");
		this.el.browser.ToggleInteraction(true) 			} });
			
// Listens for button clicks to open the urls on either Screen by HBR
  AFRAME.registerComponent("click-url", {
	schema: { url: { type: "string", default: "" }, },
	init: function () {
	  this.el.addEventListener("click", () => {                         
		const TheBrowser = this.el.parentElement;
		let thisbuttoncolor = this.el.getAttribute("color");
		if (thisbuttoncolor != null) {
			this.el.setAttribute("color", "#FFFFFF"); 
			setTimeout(() => {  this.el.setAttribute("color", thisbuttoncolor); }, 100);
		};
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
		if (ColliderScreen.getAttribute("visible")) {
			if (thisbuttoncolor === "#00FF00") {
				lockToggle.setAttribute("color","#FFFF00");
			} else { 
				lockToggle.setAttribute("color", thisbuttoncolor);
			};
			ColliderScreen.setAttribute("visible","false");
		} else {
			// if (thisbuttoncolor === "#00FF00") {
			// 	lockToggle.setAttribute("color","#FFFF00");
			// } else { 
				lockToggle.setAttribute("color","#00FF00");
			// };
			ColliderScreen.setAttribute("visible","true");
	  }		});  }, 	});

 // Toggle Button for Keyboard By Fire with help from HBR
 AFRAME.registerComponent("forcekeyboard", {
	init: function () {
	  this.el.addEventListener("click", () => {                         
    	const TheBrowser = this.el.parentElement;
		let keyboardstate = this.el.getAttribute("forcekeyboard");
		let thisbuttoncolor = TheBrowser.getAttribute("button-color");
		if (keyboardstate == "true") {
			TheBrowser.browser.ToggleKeyboard(0)
			this.el.setAttribute("forcekeyboard", "false");
			this.el.setAttribute("color","#FFFFFF");
		} else {
      TheBrowser.browser.ToggleKeyboard(1)
      this.el.setAttribute("forcekeyboard", "true");
      this.el.setAttribute("color", thisbuttoncolor);
	  }		});  }, 	});

// Toggle Sound for browser screen By Fire with help from HBR
	AFRAME.registerComponent("toggle-mute", {
	init: function () {
		this.el.addEventListener("click", () => {
		const TheBrowser = this.el.parentElement;
		const MuteButton = this.el;
		let thisbuttoncolor = TheBrowser.getAttribute("mute-color");
		if(TheBrowser.getAttribute("datamuted")=="true") {
			MuteButton.setAttribute("color", thisbuttoncolor);
			TheBrowser.setAttribute("datamuted", "false");
			TheBrowser.components["sq-browser"].runActions([ { actionType: "runscript", strparam1:
				"document.querySelectorAll('video, audio').forEach((elem) => elem.muted=false);", }, ]);
		} else {
			if (thisbuttoncolor === "#FF0000") {
				MuteButton.setAttribute("color", "#FFFF00");
			} else {
				MuteButton.setAttribute("color", "#FF0000");
			}
			TheBrowser.setAttribute("datamuted", "true")
			TheBrowser.components["sq-browser"].runActions([ { actionType: "runscript", strparam1:
				  "document.querySelectorAll('video, audio').forEach((elem) => elem.muted=true);",
			  },			]);		  }		});	  },	});
		  
// Changes Scale of either Screen when button clicked with help from HBR
  AFRAME.registerComponent("scale-screen", {
	schema: {
	  size: { type: "string" },
	  avalue: { type: "number" },
	},
	init: function () {
	  this.el.addEventListener("click", () => {  
		var screenScale = this.el.parentElement;
		let thisbuttoncolor = this.el.getAttribute("color");
		let scaleX = screenScale.object3D.scale.x;
		let scaleY = screenScale.object3D.scale.y;
		switch (this.data.size) {
		  case "grow":
			scaleX += this.data.avalue;
			scaleY += this.data.avalue;
			break;
		  case "shrink":
			scaleX += this.data.avalue;
			scaleY += this.data.avalue;
			break;
		}
		  scaleX = scaleX.toFixed(2);
		  scaleY = scaleY.toFixed(2);
      if (scaleX <= 0) {scaleX = 0.05};
      if (scaleY <= 0) {scaleY = 0.05};
		this.el.setAttribute("color","#AAAAAA");
		screenScale.setAttribute("scale", scaleX + " " + scaleY + " 1");
		setTimeout(() => {  this.el.setAttribute("color", thisbuttoncolor); }, 100);
		});		},		});
		
  // Rotate either screen when buttons clicked by HBR
  AFRAME.registerComponent("rotate", {
	schema: {
	  axis: { type: "string" },
	  amount: { type: "number" },
	},
	init: function () {
	  this.el.addEventListener("click", () => {
		let browserRotation = this.el.parentElement;
		let thisbuttoncolor = browserRotation.getAttribute("button-color");
		// let x = browserRotation.object3D.rotation.x;
		// let y = browserRotation.object3D.rotation.y;
		// let z = browserRotation.object3D.rotation.z;
		// let w = browserRotation.transform.rotation.w;
		let x = browserRotation.transform.eulerAngles.x;
		let y = browserRotation.transform.eulerAngles.y;
		let z = browserRotation.transform.eulerAngles.z;
		// console.log("X:" + x + " Y:" + y + " Z:" + z);
		switch (this.data.axis) {
			case "x":
				x += this.data.amount;
			break;
			case "y":
				y += this.data.amount;
			break;
			case "z":
				z += this.data.amount;
			break;
			case "w":
				w += this.data.amount;
			break;
		}
		this.el.setAttribute("color","#AAAAAA");
		// browserRotation.setAttribute("rotation", x + " " + y + " " + z); 
		// browserRotation.transform.rotation = new BS.Vector3(x, y, z); 
		// browserRotation.transform.rotation = new BS.Quaternion(x, y, z, w); 
		browserRotation.transform.eulerAngles = new BS.Vector3(x, y, 0); 
		// console.log("SET X:" + x + " Y:" + y + " Z:" + z);
		setTimeout(() => {  this.el.setAttribute("color", thisbuttoncolor); }, 100); 
		});        },      });

	// Toggle for hiding and showing the rotation buttons By Fire with help from HBR
  AFRAME.registerComponent("enablerot", {
	init: function () {
	  this.el.addEventListener("click", () => {
		const rotats = this.el;
		let thisbuttoncolor = this.el.parentElement.getAttribute("button-color");
		const rotatebutton = rotats.parentElement.children[6];
		var els = document.getElementsByClassName("tilt");
		if (rotatebutton.getAttribute("visible")) {
			  rotats.setAttribute("color","#FFFFFF");
			[].forEach.call(els, function (el) {
				el.setAttribute("visible","false");
			});
		} else {
			  rotats.setAttribute("color", thisbuttoncolor);
			[].forEach.call(els, function (el) {
				el.setAttribute("visible","true");
			});
		}		});  }, 	});
		
	
	// Toggle for hiding and showing buttons By Fire with help from HBR
  AFRAME.registerComponent("hidebuttons", {
	init: function () {
	  this.el.addEventListener("click", () => {
		const hidebut = this.el;
		let thisbuttoncolor = this.el.parentElement.getAttribute("button-color");
		const somebutton = hidebut.parentElement.children[2];
		var buttons = document.getElementsByClassName("buttons");
		if (somebutton.getAttribute("visible")) {
			  hidebut.setAttribute("color", thisbuttoncolor);
			[].forEach.call(buttons, function (el) {
				el.setAttribute("visible","false");
			});
		} else {
			  hidebut.setAttribute("color","#FFFFFF");
			[].forEach.call(buttons, function (el) {
				el.setAttribute("visible","true");
			});
		}		});  }, 	});
		
// Changes Volume of the Screen when button clicked By Fire with help from HBR
  AFRAME.registerComponent("volume-level", {
	schema: {
	  vvalue: { type: "number" },
	},
	init: function () {
	  this.el.addEventListener("click", () => {  
		var screenVolume = this.el.parentElement;
		let thisbuttoncolor = this.el.getAttribute("color");
		let volume = parseFloat(screenVolume.getAttribute("volumelevel"));
		volume += this.data.vvalue;
		volume = volume.toFixed(2);
		if (volume > 1) {volume = 1};
		if (volume < 0) {volume = 0};
		screenVolume.components["sq-browser"].runActions([ { actionType: "runscript", strparam1:
	"document.querySelectorAll('video, audio').forEach((elem) => elem.volume=" + volume + ");", }, ]);
		this.el.setAttribute("color","#AAAAAA");
		screenVolume.setAttribute("volumelevel", volume);
		setTimeout(() => {  this.el.setAttribute("color", thisbuttoncolor); }, 100);
		});		},		});
		
	
	// Navigates browser page Backwards/Forward
  AFRAME.registerComponent("navigate-browser", {
  schema: {
    action: { type: "string", default: "goback" }  // Default action is "goback"
  },
  init: function () {
    const browserElement = this.el.parentElement;
	let thisbuttoncolor = this.el.getAttribute("color");
    this.el.addEventListener("click", () => {
      const actionType = this.data.action;
      this.el.setAttribute("color", "#AAAAAA");
      browserElement.components['sq-browser'].runActions([{
        actionType: actionType
      }]);
      setTimeout(() => {
        this.el.setAttribute("color", thisbuttoncolor);
      }, 100);
    });
  },
});

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



// Create screen After Unity load 
var firstbrowserrun = true;
function firescreenloadstuff() {
	console.log("FIRESCREEN: Waiting");
	const firescene = BS.BanterScene.getInstance();
	firescene.On("unity-loaded", () => {
		console.log("FIRESCREEN: unity-loaded");
		setTimeout(() => { 
			if (firstbrowserrun) {
				firstbrowserrun = false;
				enableFireScreen();
			} else {
				console.log("FIRESCREEN: Should already be enabled/loading");
			};
		}, 1000);
	});
	
	// firescene.On("loaded", () => {
	// 	console.log("FIRESCREEN: scene loaded");
	// 	})
}

firescreenloadstuff()
