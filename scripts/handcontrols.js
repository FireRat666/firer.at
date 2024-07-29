const handscene = BS.BanterScene.getInstance();
var playerislocked = false;
var playersuserid = true;
class handButtonCrap{
	
	constructor() {
		console.log("HAND-CONTROLS: Delay Loading to avoid error");
		if(window.isBanter) { 
		setTimeout(() => { 
			if (handcontrolsdisabled) {
				handcontrolsdisabled = false;
				this.setupHandControls();
			}
		}, 15000); 
		};
	  
		handscene.On("user-joined", e => {
			if (e.detail.isLocal) {
				console.log("HAND-CONTROLS: Local User Joined");
				if (handcontrolsdisabled) {
					handcontrolsdisabled = false;
					playersuserid = e.detail.uid;
					this.setupHandControls();
				}
			}
		});
	}

	mute() {
		if (handbuttonmutestate) {
		handbuttonmutestate = false;
		} else {
		handbuttonmutestate = true;
		};
		document.querySelectorAll('.firescreenc')
		.forEach((firescreenc) => {
			if(handbuttonmutestate) {
			firescreenc.components["sq-browser"].runActions([ { actionType: "runscript", strparam1:
			"document.querySelectorAll('video, audio').forEach((elem) => elem.muted=false); ", }, ]);
			} else {
			firescreenc.components["sq-browser"].runActions([ { actionType: "runscript", strparam1:
			"document.querySelectorAll('video, audio').forEach((elem) => elem.muted=true); ", }, ]);
			}
		});
		document.querySelectorAll('.firemutebutc')
		.forEach((firemutebutc) => {                 
			const TheBrowser = firemutebutc.parentElement;
			let thisbuttoncolor = TheBrowser.getAttribute("mute-color");
			if(handbuttonmutestate) {
				if (thisbuttoncolor === null) {
					firemutebutc.setAttribute("color","#FFFFFF");
				} else {
					firemutebutc.setAttribute("color", thisbuttoncolor);
				};
			} else {
				if (thisbuttoncolor === "#FF0000") {
					firemutebutc.setAttribute("color","#FFFF00");
				} else { 
					firemutebutc.setAttribute("color","#FF0000");
				};
			}
		});
	}

	volumecontrol(vvalue) {
		let thisloopnumber = 0;
		document.querySelectorAll('.firescreenc')
		.forEach((firescreenc) => {
			thisloopnumber++
			let volume = parseFloat(firescreenc.getAttribute("volumelevel"));
			volume += parseFloat(vvalue);
			volume = volume.toFixed(2);
			console.log("HAND-CONTROLS: FireScreen " + thisloopnumber + "'s Volume is: " + volume)
			if (volume > 1) {volume = 1};
			if (volume < 0) {volume = 0};
			firescreenc.setAttribute("volumelevel", volume);
			firescreenc.components["sq-browser"].runActions([ { actionType: "runscript", strparam1:
			"document.querySelectorAll('video, audio').forEach((elem) => elem.volume=" + volume + ");", }, ]);
		});

		if (parseFloat(vvalue) > 0) {
			let firevolbut = document.getElementById("firevolupbut");
			let butcolour = firevolbut.getAttribute("color");
			firevolbut.setAttribute("color", "#FFFFFF"); 
			setTimeout(() => {  firevolbut.setAttribute("color", butcolour); }, 100);
		} else {
			let firevolbut = document.getElementById("firevoldownbut");
			let butcolour = firevolbut.getAttribute("color");
			firevolbut.setAttribute("color", "#FFFFFF"); 
			setTimeout(() => {  firevolbut.setAttribute("color", butcolour); }, 100);
		}

	}

	lockplayerfunc() {
		let firelockbut = document.getElementById("firelockpbut");
		if (playerislocked) {
			playerislocked = false;
			unlockPlayer();
			firelockbut.setAttribute("color", thebuttoncolor); 
		} else {
			playerislocked = true;
			lockPlayer();
			if (thebuttoncolor === "#FF0000") {
				firelockbut.setAttribute("color", "#FFFF00"); 
			} else {
			firelockbut.setAttribute("color", "#FF0000"); 
			}
		};
	};

	setupHandControls() {
		console.log("HAND-CONTROLS: Setting up Hand Controls")
		// This was a great innovation by HBR, who wanted Skizot to also get credit for the original idea. 
		const handControlsContainer = document.createElement("a-entity");
		handControlsContainer.setAttribute("scale", "0.1 0.1 0.1");
		handControlsContainer.setAttribute("position", "0.04 0.006 -0.010");
		if (playersuserid) {
			handControlsContainer.setAttribute("sq-lefthand", "whoToShow: " + window.user.id);
			
		} else {
			handControlsContainer.setAttribute("sq-lefthand", "whoToShow: " + playersuserid);
		};
		[
			{
			image: IconVolUpUrl,
			position: "-1 0.2 -0.4",
			colour: volupcolor, 
			class: "firevolbutc", 
			id: "firevolupbut", 
			callback: () => this.volumecontrol("0.05")
			},
			{
			image: IconVolDownUrl,
			position: "-1 0.2 0",
			colour: voldowncolor,
			class: "firevolbutc",
			id: "firevoldownbut", 
			callback: () => this.volumecontrol("-0.05")
			},
			{
			image: "https://firer.at/files/lock.png",
			position: "-1 -0.4 0",
			colour: thebuttoncolor,
			class: "firelockpbutc",
			id: "firelockpbut", 
			callback: () => this.lockplayerfunc()
			},
			{
			image: IconMuteUrl,
			position: "-1 0.2 0.4", 
			colour: "#FFFFFF", 
			class: "firemutebutc", 
			id: "firemutebut", 
			callback: () => this.mute()
			}
		].forEach(item => {
			const button = document.createElement("a-plane");
			button.setAttribute("sq-interactable", "");
			button.setAttribute("sq-collider", "");
			button.setAttribute("scale", "0.4 0.4 0.4");
			button.setAttribute("rotation", "0 -90 180");
			button.setAttribute("src", item.image);
			button.setAttribute("color", item.colour);
			button.setAttribute("transparent", true);
			button.setAttribute("position", item.position);
			button.setAttribute("class", item.class);
			button.setAttribute("id", item.id);
			button.addEventListener("click", () => item.callback());
			handControlsContainer.appendChild(button);
		})
		document.querySelector("a-scene").appendChild(handControlsContainer);
	}
};

let handbuttonmutestate = true;
const handbuttonstuff = new handButtonCrap();
