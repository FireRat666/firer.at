// This script was taken from https://vidya.sdq.st/say-names.js and https://best-v-player.glitch.me/say-names.js
let scriptsource = "https://" + location.hostname + "/scripts/announcer.js";
let theusersname = "";
let timevariable = 0;
let theusersid = "";
let announcefirstrun = true;
let announceevents = "true";
let announce420 = "false";

// Main Speak Function, Thank you Elin and everyone
async function speak(text) {
  console.log("ANNOUNCER: saying:", text);
  let audio = new Audio('https://speak.firer.at/?text=' + text);
  audio.autoplay = true;
  audio.play();
  audio.volume = 0.08;
};

// This function uses the current time as an input for the psuedo random number generator
function GETPRNGF(modulo) {
  var now2 = new Date().getTime();
  var hours = Math.floor((now2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((now2 % (1000 * 60 * 60)) / (1000 * 60));
  var second = Math.floor((now2 % (1000 * 60)) / 10000);
  timevariable = hours + "" + minutes + "" + second;
  let psudorandomvar = PRNGF(timevariable, modulo);
  return psudorandomvar
}
  // Function which takes a seed and an upper value then returns a psuedo random number
  // THIS FUNCTION SEEMS TO HARDLY EVER RETURN THE HIGHEST NUMBER IN THE ARRAY
  function PRNGF(seed, modulo) {
    str = `${(2**31-1&Math.imul(48271,seed))/2**31}`
    .split('')
    .slice(-10)
    .join('') % (modulo)
    return str
}

// here lies a loop function
function loop(interval, callback) {
  let readyToTrigger;
  const _loop = () => {
    let nowInMs = new Date().getTime();
    let timeSinceLast = nowInMs / 1000 - Math.floor( nowInMs / (interval * 1000)) * interval;
    if(timeSinceLast > interval - 1 && !readyToTrigger) {
        readyToTrigger = true;
    };
    if(timeSinceLast < 1 && readyToTrigger) {
        readyToTrigger = false;
        callback();
    };
  };
  setInterval(_loop, 800);
  _loop();
};

// This function is for the events announcements
function loadevents() {
  if(window.isBanter && announceevents === "true") {
    console.log("ANNOUNCER: Event Announcer Enabled");
    let lastEventsId = 0;
    loop(20, async () => {
      let event = await (await fetch("https://api.sidequestvr.com/v2/events?limit=1")).json();
      if(event.length) {
        const difference = Math.abs(new Date(event[0].start_time) - new Date());
        if(difference < 60 * 1000 && lastEventsId !== event[0].events_v2_id) {
          lastEventsId = event[0].events_v2_id;
          await speak("Oh Shit " + event[0].name + ", is starting now! Drop your shit and hussle");
        };
      };
    })
  };
};


// This function is for the 420 events announcements
function load420() {
  if(window.isBanter && announce420 === "true") {
    let keepAlive;
    function connect() {
      const ws = new WebSocket('wss://calicocut.glitch.me');
      ws.onmessage = (msg) => {
        speak(msg.data);
      };
      ws.onopen = (msg) => {
        console.log("ANNOUNCER: connected to 420 announcer.");
      };
      ws.onerror = (msg) => {
        console.log("ANNOUNCER: error", msg);
      };
      ws.onclose = (e) => {
        console.log('ANNOUNCER: Disconnected 420!');
        clearInterval(keepAlive);
        setTimeout(()=>connect(), 3000);
      };
      keepAlive = setInterval(()=>{ws.send("keep-alive")}, 120000)
    }
    connect();
  };
};


const thescripts = document.getElementsByTagName("script");
const announcerscene = BS.BanterScene.getInstance();
var timenow = 9999999999999; // Set Now to a Really Big Number, so if user-joined is called before unity-loaded, it wont spam user joined messages for users that were already in the space
// Welcome message for user entering the space
function announcerloadtest() {

  announcerscene.On("unity-loaded", () => {
    announcefirstrun = false;
    timenow = Date.now(); // Sets Now to after unity scene load is done
  });
  announcerscene.On("user-joined", e => {
    theusersname = e.detail.name;
    theusersid = e.detail.uid;

    if (theusersname === "Gravxton") {theusersname = "Graviton What The Hell"};
    if (theusersid === "7e778ab53e504bed1d995bf9148b98c2") {theusersname = "Vanquisher"}; // Vanquisher
    if (theusersid === "2567af4ddce8000b887527097fd5bf8a") {theusersname = "The Fishiest Overlord of them all"}; // Dedzed
    if (theusersid === "4c67af8ae899ea5b8dd6da25566ff3f3") {theusersname = "Boob Works"}; // BobWorks 
    if (theusersid === "f14cd0a7c028d9e8f1756d76ff450c73") {theusersname = "The Slayer"}; // Divine
    if (theusersid === "c81d8333f83208a6124370282b992a45") {theusersname = "echo phase"}; // Echo Mental
    if (theusersid === "2cd40305e0a4b04bf0242ad0d9fa352d") {theusersname = "Zephii"}; // Zephii
    if (theusersid === "f7d3e8a05224e3954bdc6f4b4ec47708") {theusersname = "Nisstyx"}; // Nystx
    if (theusersid === "f87c37aad5d82ac9faea3a2cae55934d") {theusersname = "Discordia Kitty"}; // Discord Kitty
    // if (theusersid === "d20dc72cdbb562479089c6c5263815a8") {theusersname = "A Banter Ghost"}; // Ghost Droid
    if (theusersid === "2fa5290b268076d98aa078e1cc2ce3e2") {theusersname = "Kah Gey knee ko"}; // Kageneko
    if (theusersid === "f67ed8a5ca07764685a64c7fef073ab9") {theusersname = "Fire Rat"}; // FireRat
    if (theusersid === "2ea1396b49294e396113f4f1ca5d9a9e") {theusersname = "Chicky Chicky Gem Gem"}; // Gemchick
    if (theusersid === "a3de45107d96ec8ec9857f9111eca6e0") {theusersname = "Fay Fay"}; // Fae
    if (theusersid === "462b9ba6d7bff70e963f76c7b3ef978a") {theusersname = "tokra ah ah ah"}; // Tokra
    if (theusersid === "e2ea44863eb547aecc1f9bc94f7b5c30") {theusersname = "Older Chris, Not Young Chris"}; // Chris
    if (theusersid === "e9412ffa5ca2970f3b9de7b87258e712") {theusersname = "Aziz z z"}; // Aziz
    if (theusersid === "ada674dac0d26556244bf61c2b97184e") {theusersname = "Yunji verse"}; // Yunjiverse
    if (theusersid === "220a4b971b3edb376cbc956f5539b8a5") {theusersname = "Big John"}; // Big John
    if (theusersid === "94acdf9d5887ce8fb4a5c9c605f906a5") {theusersname = "Fear Psycho"}; // "Psycho"
    if (theusersid === "3682ea489f043657d09811dd042bfa83") {theusersname = "ProcksCyde"}; // ProxCyde
    if (theusersid === "52ac3e6e222a72ade6cbde376c27a6c3") {theusersname = "I.T.Trey"}; // I.T.Trey
    if (theusersid === "19f104073c0da250138d67be9634d842") {theusersname = "Jaeger 7 4 5"}; // Jaeger_745
    // if (theusersid === "597c64d0037631df4ec9d73ad381f634 ") {theusersname = "Someone you don't know"}; // Gooch Monkey
    if (theusersid === "4255792aebfae3cea1086f2963c33fdc") {theusersname = "Rabbit"}; // Rabbit
    if (theusersid === "ee95ee1ae0cd0d67066a4519e665911e") {theusersname = "Zelrainer"}; //  Zelrainer
    if (theusersid === "f90d43718f190161c2fa2d0879218686") {theusersname = "CaptnDaN"}; //  "CaptnDaN"
    if (theusersid === "32c3e6ac83b78872be370cb10f0c9729") {theusersname = "Cast Casey Away"}; //  "caseycastaway"
    if (theusersid === "f8e9b8eed97623712f77f318fa35d7ce") {theusersname = "Pancake Man"}; //  "WaffleMan"
    if (theusersid === "3dbca1090fad5dff35543697ca007066") {theusersname = "Sebek"}; //  "Sebek"
    if (theusersid === "f3da86e3752aa16d8f574777cc5ed842") {theusersname = "Irish Jesus"}; //  "Scottish.Jesus"
    if (theusersid === "89c3abbe6d16e057035cc35ad7492cf7") {theusersname = "Static Threat"}; //  "staticthreat"
    if (theusersid === "89c3abbe6d16e057035cc35ad7492cf7") {theusersname = "anka"}; //  "anka"
    // if (theusersid === "452267f713cf815aab6f8e6a2548ff93") {theusersname = "Ben"}; //  "Ben"
    // if (theusersid === "d1bdc33ac0fcfc061728b2e11c740ac7") {theusersname = "Mika"}; //  "Mika"
    // if (theusersid === "2bf1e383ae55886d560f13e0bd040330") {theusersname = "Shane Harris"}; //  Shane Harris
    if (theusersid === "f90d43718f190161c2fa2d0879218686") {theusersname = "Captain Dan"}; //  CaptnDaN 

    // "f90d43718f190161c2fa2d0879218686"   
    if (e.detail.isLocal) {
      announcefirstrun = false;
      timenow = Date.now(); // Sets Now to after first user has joined
      const joinMessages = [
        theusersname + ", What the hell, you broke everything, it was just working, what did you do? ",
        "Hello, Welcome to the space " + theusersname,
        "What are you doing here " + theusersname,
        "Welcome to [Space Name]! " + theusersname +  " We're never letting you go. Quick, lock the doors!",
        "Welcome to [Space Name] Zoo! " + theusersname +  " Please, don't feed the animals. ",
        "Welcome aboard! " + theusersname + " We’re so excited to have you with us",
        "Welcome " + theusersname + " we Hope you brought your sense of humor!",
        "Glad you could join us " + theusersname + " now let’s have some fun!",
        "Fasten your seatbelt " + theusersname + " it’s going to be a wild ride.",
        "Hi there! It’s great to meet you " + theusersname + ", wait a sec I am not sentient",
        "Welcome " + theusersname + " We’re a little weird, a little wacky, but we’re pretty sure you’ll fit right in.",
        "Welcome your Highness " + theusersname,
        "Hello " + theusersname + " " + theusersname + " " + theusersname + " " + theusersname + " Failure detected, shutting down",
        "Enjoy your stay " + theusersname
      ];
  
      let randommessage = joinMessages[Math.floor(Math.random() * joinMessages.length)];

      if (theusersid === "3dbca1090fad5dff35543697ca007066") {randommessage = "Welcome, King Seb eck, the Mirror Creator"} //  "Sebek"
      else if (theusersid === "220a4b971b3edb376cbc956f5539b8a5") {randommessage = "Big John, Big John. More like Tiny John, ag le we re ae ze te pe qu al er fa Fuck."}; // Big John

      speak(randommessage);
      console.log("ANNOUNCER: Local-UID: " + e.detail.uid)

    } else {
      if(Date.now() - timenow > 5000) {
        const welcomeMessages = [
          theusersname + " welcome message blah blah!",
          theusersname + " Joined your party",
          "Oh No, the announcer is stoned, oh well, " + theusersname + " Joined the space.&lang=en&pitch=0.7&speed=1.7",
          theusersname + " has spawned into reality",
          theusersname + " just showed up, Hold my Head Set",
          theusersname + " just showed up, Don't let them leave",
          theusersname + " just showed up, Quick call the police",
          theusersname + " just showed up, Everyone act normal",
          theusersname + ", What the hell, you broke everything, it was just working, what did you do?!",
          theusersname + " has joined, what will they do now?",
          theusersname + " might be an alien, watch them carefully",
          theusersname + " just stumbled over their charger",
          theusersname + " Arrived, Everyone go say hi",
          theusersname + " Just took a hit of laughing gas&lang=en&pitch=1.3&speed=1.1",
          "Oh No! " + theusersname + " has spawned into reality",
          "Oh No! " + theusersname + " Left their toilet seat up",
          "Oh No! " + theusersname + " is about to run out of battery",
          "Oh No! " + theusersname + " Has forgotten their own name",
          "Oh No! " + theusersname + " is running out of gas",
          "Oh No! " + theusersname + " just farted into reality",
          "Oh No! " + theusersname + " Locked their keys in their car",
          "Knock Knock " + theusersname + " is here",
          "Nobody tell " + theusersname + " Their still in their pyjamas",
          "Oh No! Hide your sheep " + theusersname + " has joined the space",
          "Oh No! " + theusersname + " needs a recharge, grab the defib",
          "Your King " + theusersname + " has joined the space.",
          "Your Queen " + theusersname + " has joined the space.",
          "Your Magesty " + theusersname + " has joined the space.",
          "About time " + theusersname + " has joined the space.",
          "The rumours are true " + theusersname + " has joined the space",
          "Bow to your King " + theusersname,
          "Bow to your Queen " + theusersname,
          "Here we go again, " + theusersname + " has joined the space.",
          theusersname + " Has Joined the space, And wants to know if you are hungry girl",
          theusersname + " was pushed into a portal, quick call the police",
          theusersname + ", be careful of DedZed the fish overlord"
          ];

        let psudorandomvar = GETPRNGF(welcomeMessages.length);
        let message = welcomeMessages[GETPRNGF(welcomeMessages.length)]; 

        if (theusersid === "3dbca1090fad5dff35543697ca007066") {message = "Bow to your King Seb eck the Mirror Creator"} //  "Sebek"
        else if (theusersid === "220a4b971b3edb376cbc956f5539b8a5") {message = "Big John is here everybody hide your snack packs"}; // Big John

        speak(message);
        console.log("ANNOUNCER: USER: " + e.detail.name + " UID: " + theusersid + " PRVAR: " + psudorandomvar);
      } else if (announcefirstrun) {
        announcefirstrun = false;
        timenow = Date.now(); // Sets Now to after a user has joined if first run is still true
      };
    };
  });
  
  announcerscene.On("user-left", e => {
    theusersname = e.detail.name;
    theusersid = e.detail.uid;
    console.log("ANNOUNCER: USER: " + e.detail.name + " LEFT UID: " + theusersid);
    if (e.detail.isLocal) {

    };

  });

  const scripts = document.getElementsByTagName("script");
  for (let i = 0; i < scripts.length; i++) {
    if (getAttrOrDefAgain(thescripts[i], "src", "") === scriptsource ) { 
        // const pAnnounce420 = getAttrOrDef(thescripts[i], "announce-420", "false");
        const pAnnounceEvents = getAttrOrDefAgain(thescripts[i], "announce-events", "true");
        announceevents = pAnnounceEvents;
        announce420 = getAttrOrDefAgain(thescripts[i], "announce-420", "false");
      };
    };
    loadevents();
    setTimeout(() => { load420(); }, 20000);

};

function getAttrOrDefAgain (pScript, pAttr, pDefault) {
  if (pScript.hasAttribute(pAttr)) {
    return pScript.getAttribute(pAttr);
  } else {
    return pDefault;
  }
};

announcerloadtest();