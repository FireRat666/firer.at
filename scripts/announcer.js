// This script was taken from https://vidya.sdq.st/say-names.js and https://best-v-player.glitch.me/say-names.js
let username = "";
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
var now = Date.now();
// Welcome message for user entering the space
function announcerloadtest() {
  now = Date.now(); // Sets Now to after unity scene load is done
  announcerscene.On("user-joined", e => {
    if (e.detail.isLocal) {
      console.log("ANNOUNCER: Local-UID: " + e.detail.uid)

      username = e.detail.name;

      theusersid = e.detail.uid;
      if (theusersid === "2567af4ddce8000b887527097fd5bf8a") {username = "The Fishiest Overlord of them all"};

      const joinMessages = [
        username + ", What the hell, you broke everything, it was just working, what did you do? ",
        "Hello, Welcome to the space " + username,
        "What are you doing here " + username,
        "Welcome to [Space Name]! We're never letting you go. Quick, lock the doors!",
        "Welcome to [Space Name] Zoo! Please, don't feed the animals. ",
        "Welcome aboard! " + username + " We’re so excited to have you with us",
        "Welcome " + username + " we Hope you brought your sense of humor!",
        "Glad you could join us " + username + " now let’s have some fun!",
        "Fasten your seatbelt " + username + " it’s going to be a wild ride.",
        "Hi there! It’s great to meet you " + username + " , wait a sec I am not sentient",
        "Welcome " + username + " We’re a little weird, a little wacky, but we’re pretty sure you’ll fit right in.",
        "Welcome your Highness " + username,
        "Hello " + username + " " + username + " " + username + " " + username + " Failure detected, shutting down",
        "Enjoy your stay " + username
      ];
  
      let randommessage = joinMessages[Math.floor(Math.random() * joinMessages.length)];
      speak(randommessage);
    } else {
      if(Date.now() - now > 5000) {

        username = e.detail.name;

        theusersid = e.detail.uid;
  
        if (username === "Gravxton") {username = "Graviton Fucking Hell"};
        if (username === "Vanquish3r") {username = "Vanquisher"};
        if (theusersid === "2567af4ddce8000b887527097fd5bf8a") {username = "The Fishiest Overlord of them all"}; // Dedzed
        if (theusersid === "4c67af8ae899ea5b8dd6da25566ff3f3") {username = "Boob Works"}; // BobWorks 
        if (theusersid === "f14cd0a7c028d9e8f1756d76ff450c73") {username = "The Slayer"}; // Divine
  
        const welcomeMessages = [
          username + " welcome message blah blah!",
          username + " Joined your party",
          username + " has spawned into reality",
          username + " just showed up, Hold my Head Set",
          username + " just showed up, Don't let them leave",
          username + " just showed up, Quick call the police",
          username + " just showed up, Everyone act normal",
          username + ", What the hell, you broke everything, it was just working, what did you do?!",
          username + " has joined, what will they do now?",
          username + " might be an alien, watch them carefully",
          username + " just stumbled over their charger",
          username + " Arrived, Everyone go say hi",
          "Oh No! " + username + " has spawned into reality",
          "Oh No! " + username + " Left their toilet seat up",
          "Oh No! " + username + " is about to run out of battery",
          "Oh No! " + username + " Has forgotten their own name",
          "Oh No! " + username + " is running out of gas",
          "Oh No! " + username + " just farted into reality",
          "Knock Knock " + username + " is here",
          "Nobody tell " + username + " Their still in their pyjamas",
          "Oh No! Hide your sheep " + username + " has joined the space",
          "Oh No! " + username + " needs a recharge, grab the defib",
          "Your King " + username + " has joined the space.",
          "Your Queen " + username + " has joined the space.",
          "Your Magesty " + username + " has joined the space.",
          "About time " + username + " has joined the space.",
          "The rumours are true " + username + " has joined the space",
          "Bow to your King " + username,
          "Bow to your Queen " + username,
          "Here we go again, " + username + " has joined the space.",
          username + " Has Joined the space, And wants to know if you are hungry girl",
          username + " was pushed into a portal, quick call the police",
          username + ", be careful of DedZed the fish overlord"
          ];
        let psudorandomvar = GETPRNGF(welcomeMessages.length);
        let randommessage = welcomeMessages[psudorandomvar];
        const message = randommessage; 
        speak(message);
        console.log("USERNAME: " + e.detail.name + " USERID: " + theusersid + " PRVAR: " + psudorandomvar);
      };
    };
  });
}

announcerloadtest();