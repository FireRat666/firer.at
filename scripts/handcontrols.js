class handButtonCrap{
	constructor() {
	  console.log("Hand Button Constructor Loading.");
	  if(window.isBanter) { 
		setTimeout(() => { 
		  this.setupHandControls();
		}, 5000); 
	  };
	}

	mute() {
		if (handbuttonmutestate) {
		handbuttonmutestate = false;
		console.log("handbuttonmutestate Set to False");
		} else {
		handbuttonmutestate = true;
		console.log("handbuttonmutestate Set to True");
		};
		document.querySelectorAll('.firescreenc')
		.forEach((firescreenc) => {
			if(handbuttonmutestate) {
			firescreenc.components["sq-browser"].runActions([ { actionType: "runscript", strparam1:
			"document.querySelectorAll('video, audio').forEach((elem) => elem.muted=false); ", }, ]);
			console.log("Browser Muted Set to False")
			} else {
			firescreenc.components["sq-browser"].runActions([ { actionType: "runscript", strparam1:
			"document.querySelectorAll('video, audio').forEach((elem) => elem.muted=true); ", }, ]);
			console.log("Browser Muted Set to True")
			}
		});
		document.querySelectorAll('.firemutebutc')
		.forEach((firemutebutc) => {
			if(handbuttonmutestate) {
				firemutebutc.setAttribute("color","#FFFFFF");
			} else {
				firemutebutc.setAttribute("color","#FF0000");
			}
		});
	console.log("test mute button clicked")
	}

	volumecontrol(vvalue) {
		document.querySelectorAll('.firescreenc')
		.forEach((firescreenc) => {
			let volume = parseFloat(firescreenc.getAttribute("volumelevel"));
			volume += parseFloat(vvalue);
			volume = volume.toFixed(2);
			console.log("Volume is: " + volume)
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
			console.log("vvalue is > 0 Colour is: " + butcolour);
		} else {
			let firevolbut = document.getElementById("firevoldownbut");
			let butcolour = firevolbut.getAttribute("color");
			firevolbut.setAttribute("color", "#FFFFFF"); 
			setTimeout(() => {  firevolbut.setAttribute("color", butcolour); }, 100);
			console.log("vvalue is < 0 Colour is: " + butcolour)
		}

	console.log("testbut button clicked")
	}

	setupHandControls() {
		console.log("Setting up Hand Controls for the firescreen(s)")
		// This was a great innovation by HBR, who wanted Skizot to also get credit for the original idea. 
		const handControlsContainer = document.createElement("a-entity");
		handControlsContainer.setAttribute("scale", "0.1 0.1 0.1");
		handControlsContainer.setAttribute("position", "0.04 0.006 -0.010");
		handControlsContainer.setAttribute("sq-lefthand", "whoToShow: " + window.user.id);
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
