// This script was taken from https://vidya.sdq.st/say-names.js and https://best-v-player.glitch.me/say-names.js
let username = "";
let timevariable = 0;

// Main Speak Function, Thank you Elin and everyone
async function speak(text) {
  console.log("saying:", text);
  let audio = new Audio('https://speak.firer.at/?text=' + text);
  audio.autoplay = true;
  audio.play();
  audio.volume = 0.08;
};

//// OLD Custom Speak Function
// async function speak(m) {
//   console.log("saying:" + m);
//   var msg = new SpeechSynthesisUtterance();
//   var voices = window.speechSynthesis.getVoices();
//   msg.voice = voices[2];
//   msg.voiceURI = "native";
//   msg.volume = 0.2;
//   msg.rate = 1;
//   msg.pitch = 0.8;
//   msg.text = m;
//   msg.lang = 'en-US';
//   speechSynthesis.speak(msg);
// }

//// OLD Original Speak Function
// async function speak(text) {
//   console.log("saying:", text);
//   const welcome = await fetch('https://speak-something.glitch.me/say/' + text);
//   const url = await welcome.text();
//   let audio = new Audio("data:audio/mpeg;base64," + url);
//   audio.autoplay = true;
//   audio.play();
//   audio.volume = 0.08;
// };

// This function upon a user joining will select a random welcome message and call the speak function to say it
if(window.isBanter) {
  const now = Date.now();
  window.userJoinedCallback = async user => {
    if(Date.now() - now > 20000) {
      username = (user.name ? user.name : user.id.substr(0, 6));
      const welcomeMessages = [
        username + " welcome message blah blah!",
        username + ", What the hell, you broke everything, it was just working, what did you do?!",
        username + " has joined, what will they do now?",
        "Your King " + username + " has joined the space.",
        "Your Queen " + username + " has joined the space.",
        "Bow to your King " + username,
        "Bow to your Queen " + username,
        username + " was pushed into a portal, quick call the police",
        username + ", be careful of DedZed the fish overlord"
        ];
      var now2 = new Date().getTime();
      var hours = Math.floor((now2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((now2 % (1000 * 60 * 60)) / (1000 * 60));
      var second = Math.floor((now2 % (1000 * 60)) / 10000);
      timevariable = hours + "" + minutes + "" + second;
      let psudorandomvar = PRNGF(timevariable, welcomeMessages.length);
      let randommessage = welcomeMessages[psudorandomvar];
      console.log("prnv:" + psudorandomvar)
      // let randommessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      const message = randommessage; 
      await speak(message);
      console.log("The Time Variable Currently is: " + timevariable);
    };
  }
};

  // Function which takes a seed and an upper value then returns a psuedo random number
  // THIS FUNCTION SEEMS UNLIKELY TO RETURN THE HIGHEST NUMBER IN THE ARRAY
  function PRNGF(seed, modulo) {
    str = `${(2**31-1&Math.imul(48271,seed))/2**31}`
    .split('')
    .slice(-10)
    .join('') % (modulo + 1) // Add one to the modulo to fix the issue
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

// Welcome message for user entering the space
function announcerloadtest() {
  const announcerscene = BS.BanterScene.getInstance();
  console.log("ANNOUNCER: waiting... for unity scene");
  announcerscene.On("unity-loaded", () => {
    setTimeout(() => { 

      username = (user.name ? user.name : user.id.substr(0, 6));

      const joinMessages = [
        username + ", What the hell, you broke everything, it was just working, what did you do? ",
        "Hello, Welcome to the space " + username,
        "What are you doing here " + username,
        "Welcome your Highness " + username,
        "Hello " + username + " " + username + " " + username + " " + username + " Failure detected, shutting down",
        "Enjoy your stay " + username
      ];
  
      let randommessage = joinMessages[Math.floor(Math.random() * joinMessages.length)];
      speak(randommessage);
    }, 8000);
    console.log("ANNOUNCER: This should run after unity scene load");
  })
};

announcerloadtest();

// TEST STUFF

  // // Update the count down every 1 second
  // var timerint = setInterval(function() {
  //   // Get today's date and time
  //   var now = new Date().getTime();
  //   // Time calculations for days, hours, minutes and seconds
  //   // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  //   var hours = Math.floor((now % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //   var minutes = Math.floor((now % (1000 * 60 * 60)) / (1000 * 60));
  //   var second = Math.floor((now % (1000 * 60)) / 10000);
  //   // var seconds = Math.floor((now % (1000 * 60)) / 1000);
  //   // timevariable = minutes + "" + hours + "" + minutes + "" + (minutes + second) + "" + second;
  //   // timevariable = minutes + (second * 2) + "" + hours + "" + minutes + (minutes + second) + "" + second + "" + second;
  //   timevariable = hours + "" + minutes + "" + second;
  //   let testuppervar = 13;
  //   let testuppervar2 = 14;
  //   // console.log("The Time Variable Currently is: " + timevariable);
  //   let psudorandomvar = PRNGF(timevariable, testuppervar);
  //   let psudorandomvar2 = PRNGF(timevariable, (testuppervar2));
  //   console.log("tprnv1:" + psudorandomvar);
  //   console.log("tprnv2:" + (psudorandomvar2));
  //   // if (something === false) {
  //   //   clearInterval(timerint);
  //   // };
  // }, 5000);
