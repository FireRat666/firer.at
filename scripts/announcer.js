// This script was taken from https://vidya.sdq.st/say-names.js and https://best-v-player.glitch.me/say-names.js
let theusersname = "";
let timevariable = 0;
let theusersid = "";

// Main Speak Function, Thank you Elin and everyone
async function speak(text) {
  console.log("saying:", text);
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
let announceevents = true;
if(window.isBanter && announceevents === true) {
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

const announcerscene = BS.BanterScene.getInstance();
var timenow = 9999999999999; // Set Now to a Really Big Number, so if user-joined is called before unity-loaded, it wont spam user joined messages for users that were already in the space
// Welcome message for user entering the space
function announcerloadtest() {
  announcerscene.On("unity-loaded", () => {
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
    if (theusersid === "2cd40305e0a4b04bf0242ad0d9fa352d") {theusersname = "Zeph e e e e e"}; // Zephii
    if (theusersid === "f7d3e8a05224e3954bdc6f4b4ec47708") {theusersname = "Nisstyx"}; // Nystx
    if (theusersid === "f87c37aad5d82ac9faea3a2cae55934d") {theusersname = "Discordia Kitty"}; // Discord Kitty
    if (theusersid === "d20dc72cdbb562479089c6c5263815a8") {theusersname = "A Banter Ghost"}; // Ghost Droid
    if (theusersid === "2fa5290b268076d98aa078e1cc2ce3e2") {theusersname = "Kah Gey knee ko"}; // Kageneko
    if (theusersid === "f67ed8a5ca07764685a64c7fef073ab9") {theusersname = "Fire Rat"}; // FireRat

    if (e.detail.isLocal) {
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
      speak(randommessage);
      console.log("ANNOUNCER: Local-UID: " + e.detail.uid)

    } else {
      if(Date.now() - timenow > 5000) {
        const welcomeMessages = [
          theusersname + " welcome message blah blah!",
          theusersname + " Joined your party",
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
          "Oh No! " + theusersname + " has spawned into reality",
          "Oh No! " + theusersname + " Left their toilet seat up",
          "Oh No! " + theusersname + " is about to run out of battery",
          "Oh No! " + theusersname + " Has forgotten their own name",
          "Oh No! " + theusersname + " is running out of gas",
          "Oh No! " + theusersname + " just farted into reality",
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
        const message = welcomeMessages[GETPRNGF(welcomeMessages.length)]; 
        speak(message);
        console.log("USERNAME: " + e.detail.name + " USERID: " + theusersid + " PRVAR: " + psudorandomvar);
      };
    };
  });
}

announcerloadtest();
