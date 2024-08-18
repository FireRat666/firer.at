// This script was taken from https://vidya.sdq.st/say-names.js and https://best-v-player.glitch.me/say-names.js
let scriptsource = "https://firer.at/scripts/announcer.js";
let theusersname = "";
let timevariable = 0;
let theusersid = "";
let announcefirstrun = true;
let announce = "true";
let announceevents = "true";
let announce420 = "false";
let readytospeak = true;

// // Main Speak Function, Thank you Elin and everyone
// async function speak(text) {
//   if (readytospeak) {
//     readytospeak = false

//     const volume = 0;
//     const pitch = 0.5;
//     const mute = false;
//     const sloop = false;
//     const bypassEffects = true;
//     const bypassListenerEffects = true;
//     const bypassReverbZones = true;
//     const playOnAwake = false;

//     const audioObject = new BS.GameObject("MyAudioSource"); 
//     const audioSource = await audioObject.AddComponent(new BS.BanterAudioSource(volume, pitch, mute, sloop, bypassEffects, bypassListenerEffects, bypassReverbZones, playOnAwake));

//     audioSource.volume = 0.01; // I didn't expect this to work and it's not working
    
//     console.log("ANNOUNCER: saying:", text);
//     audioSource.PlayOneShotFromUrl('https://speak.firer.at/?text=' + text + "&.mp3");

//     setTimeout(() => { readytospeak = true; }, 4000);
//   } else {
//     console.log("ANNOUNCER: Not Ready to Speak:", text);
//   };

// };


// Main Speak Function, Thank you Elin and everyone
async function speak(text) {
  if (readytospeak) {
    readytospeak = false
    console.log("ANNOUNCER: saying:", text);
    let audio = new Audio('https://speak.firer.at/?text=' + text);
    audio.autoplay = true;
    audio.play();
    audio.volume = 0.08;
    setTimeout(() => { readytospeak = true; }, 4000);
  } else {
    console.log("ANNOUNCER: Not Ready to Speak:", text);
  };

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
    if (announce) {

    }
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
    if (theusersid === "32c3e6ac83b78872be370cb10f0c9729") {theusersname = "Cast Casey Away"}; //  "caseycastaway"
    if (theusersid === "f8e9b8eed97623712f77f318fa35d7ce") {theusersname = "Pancake Man"}; //  "WaffleMan"
    if (theusersid === "3dbca1090fad5dff35543697ca007066") {theusersname = "Sebek"}; //  "Sebek"
    if (theusersid === "f3da86e3752aa16d8f574777cc5ed842") {theusersname = "Irish Jesus"}; //  "Scottish.Jesus"
    if (theusersid === "89c3abbe6d16e057035cc35ad7492cf7") {theusersname = "Static Threat"}; //  "staticthreat"
    if (theusersid === "shit") {theusersname = "anka"}; //  "anka"
    // if (theusersid === "452267f713cf815aab6f8e6a2548ff93") {theusersname = "Ben"}; //  "Ben"
    // if (theusersid === "d1bdc33ac0fcfc061728b2e11c740ac7") {theusersname = "Mika"}; //  "Mika"
    // if (theusersid === "2bf1e383ae55886d560f13e0bd040330") {theusersname = "Shane Harris"}; //  Shane Harris
    if (theusersid === "f90d43718f190161c2fa2d0879218686") {theusersname = "Captain Dan"}; //  CaptnDaN 
    if (theusersid === "3236ff6310bfe543efa2648346f59ea3") {theusersname = "Irish Guy"}; //  Irishking  
    if (theusersid === "9eefdbc0892b7f90f6c30723c00fcde5") {theusersname = "Shane"}; //  "Oh no, Shane"

    // "f90d43718f190161c2fa2d0879218686"   
    if (e.detail.isLocal && announce === "true") {
      announcefirstrun = false;
      timenow = Date.now(); // Sets Now to after first user has joined
      const joinMessages = [
        theusersname + ", What the hell, you broke everything, it was just working, what did you do? ",
        "Hello, Welcome to the space " + theusersname,
        "What are you doing here " + theusersname,
        "Welcome to [Space Name]! " + theusersname +  " We're never letting you go. Quick, lock the doors!",
        "Welcome to [Space Name] Zoo! " + theusersname +  " Please, don't feed the animals. ",
        "Welcome aboard! " + theusersname + " We're so excited to have you with us",
        "Welcome " + theusersname + " we Hope you brought your sense of humor!",
        "Glad you could join us " + theusersname + " now let's have some fun!",
        "Fasten your seatbelt " + theusersname + " it's going to be a wild ride.",
        "Hi there! It's great to meet you " + theusersname + ", wait a sec I am not sentient",
        "Welcome " + theusersname + " We're a little weird, a little wacky, but we're pretty sure you'll fit right in.",
        "Welcome your Highness " + theusersname,
        "Hello " + theusersname + " " + theusersname + " " + theusersname + " " + theusersname + " Failure detected, shutting down",
        "Howdy, partner! " + theusersname,
        "Well, if it ain't my favorite outlaw! " + theusersname,
        "Howdy, stranger! What brings you to these parts? " + theusersname,
        "Yeehaw! What's the good word? " + theusersname,
        "Hello there, cowpoke! " + theusersname,
        "Howdy, there! How's the range treating ya? " + theusersname,
        "Good day to ya, buckaroo! " + theusersname,
        "Well, I'll be! Ain't you a sight for sore eyes! " + theusersname,
        "G'day, trailblazer! " + theusersname,
        "Howdy, friend! Ready for a rootin-tootin' good time? " + theusersname,
        "Welcome to the wild frontier, partner! " + theusersname,
        "Howdy, " + theusersname + " How's the journey been? ",
        "Hey there, " + theusersname + " saddle up for some fun? ",
        "Evenin', outlaw. How's the trail? " + theusersname,
        theusersname + ", welcome to the Banter Science Enrichment Center! Please refrain from touching any mysterious glowing buttons.",
        theusersname + ", congratulations! You've been selected for our groundbreaking portal experimentation program.",
        "Hail, " + theusersname + "! You've crossed the Brandywine Bridge and entered our Shire of conversation.",
        "Hey there, " + theusersname + "! You've just rolled into our chat like a finely crafted joint. Spark up some conversation!",
        "High-five, " + theusersname + "! You've entered the space. Grab a virtual brownie and let's chat!",
        "Welcome aboard, " + theusersname + " ! Set phasers to 'friendly' and boldly go where no avatar has gone before.",
        "Beam in, " + theusersname + "! The holodeck is ready for your chat adventure. Engage!",
        "Swim upstream, " + theusersname + "! You've leaped into our chat like a salmon on a mission. Splash-tastic!",
        "Welcome aboard, " + theusersname + "! You've officially become a chatfish in our digital sea.",
        "High-five, " + theusersname + "! Your anchor dropped, and you’re officially docked in our harbor.",
        "Hold onto your seashells, " + theusersname + "! You've just emerged from the coral reefs and joined our crew.",
        "Wands at the ready, " + theusersname + "! Your presence adds a touch of wizardry.",
        "In this space, words are our incantations. Let the magic flow, " + theusersname + "!",
        "Welcome, seeker of wisdom. Here, thoughts flow like ancient rivers, " + theusersname + ".",
        "In this Socratic agora, dialogue is the elixir of understanding, " + theusersname + ".",
        "Life's canvas awaits your philosophical brushstrokes. Paint away, " + theusersname + "!",
        "Remember, every keystroke shapes your digital legacy, " + theusersname + ".",
        "Hail, Olympian! You've ascended to our celestial summit, " + theusersname + ".",
        "Poseidon's trident approves of your arrival. Dive into discourse, " + theusersname + "!",
        "Athena's owl welcomes you to our wisdom-filled agora, " + theusersname + ".",
        "Zeus himself nods—a thunderous welcome to our pantheon, " + theusersname + "!",
        "May Hermes guide your messages swiftly across the digital ether, " + theusersname + ".",
        "Kamehame-welcome, " + theusersname + "! Your power level just spiked in our space.",
        "Spirit Bomb of greetings, " + theusersname + "! Charge up and let's chat!",
        "Howdy, partner! Saddle up for some rodeo, " + theusersname + "!",
        "Top o' the mornin' to ya, " + theusersname + "! Grab a virtual cuppa and let's chat.",
        "Cheerio, old chap! Welcome to our banter, " + theusersname + ".",
        "G'day, mate! Throw another shrimp on the barbie and join the chat, " + theusersname + ".",
        "Howdy-do, " + theusersname + "! Y'all ready for some banter-style conversation?",
        "Get ready to go Super Saiyan in this space, " + theusersname + "!",
        "Welcome, Z Fighter " + theusersname + "! Let's dodge metaphors and unleash words!",
        "Channel your inner Goku, " + theusersname + ". Our chat is your Hyperbolic Time Chamber!",
        "G'day, " + theusersname + "! Grab your thongs (flip-flops) and join the chat!",
        "Welcome to the land Down Under, " + theusersname + "! Let's have a chinwag.",
        "Oi, " + theusersname + "! Fancy a yarn? Our chat's as big as the Outback.",
        "Good on ya, " + theusersname + "! Let's have a ripper of a conversation.",
        "Slip into our chat like a surfer catching a wave, " + theusersname + "!",
        "Top of the mornin' to ya, " + theusersname + "! Ready for some blarney?",
        "Ah, sure, you're very welcome, " + theusersname + "! Grab a pint and chat away.",
        "A hundred thousand welcomes, " + theusersname + "!",
        "Hiya, " + theusersname + "! Fancy a natter? Cuppa's on!",
        "Hey up, " + theusersname + "! Let's have a chinwag over a brew.",
        "Alright, mate? Welcome to our chat, " + theusersname + "!",
        "Yo, " + theusersname + "! Bob's your uncle—we're all friends here.",
        "Sup, " + theusersname + "? Let's chat like a proper Brit!",
        "Welcome to our whimsical chat, " + theusersname + "! It's like stepping into a giant peach.",
        "Golden ticket alert! You've entered our space factory, " + theusersname + ".",
        "BFG-approved greetings, " + theusersname + "! Let's dream big together.",
        "Fantastic space and where to find it? Right here, " + theusersname + "!",
        "Matilda would be proud, " + theusersname + ". Let the words dance!",
        "Oh, the places we'll chat, " + theusersname + "! Welcome to our Seussian world.",
        "Hop on the chat train, " + theusersname + "! Next stop: imagination station.",
        "One fish, two fish, red space, blue space, welcome, " + theusersname + "!",
        "Today you are you, that is truer than true. No one chats like you do, " + theusersname + "!",
        "Thing 1 and Thing 2 say hello, " + theusersname + "! Let's rhyme and reason.",
        "The Dragon Balls have granted your arrival, " + theusersname + ". What's your wish?",
        "Enjoy your stay " + theusersname
      ];
  
      let randommessage = joinMessages[Math.floor(Math.random() * joinMessages.length)];

      if (theusersid === "replace") {randommessage = "replace"} //  replace
      else if (theusersid === "replace") {randommessage = "replace"}; // replace

      speak(randommessage);
      console.log("ANNOUNCER: Local-UID: " + e.detail.uid)

    } else {
      if(Date.now() - timenow > 5000 && announce === "true") {
        const welcomeMessages = [
          theusersname + " welcome message blah blah!",
          theusersname + " just quantum-leaped into the chat!",
          "Hold onto your hats " + theusersname + " has materialized!",
          "Alert: " + theusersname + " has entered the interdimensional portal!",
          "Welcome, " + theusersname + "! Prepare for a wild ride!",
          theusersname + " slipped through a wormhole and landed here!",
          "Attention, fellow beings: " + theusersname + " is now among us!",
          theusersname + "'s presence detected—brace for impact!",
          "Did anyone order a side of " + theusersname + " ? It just arrived!",
          theusersname + " bypassed the time-space continuum to join us!",
          "Hold the phone! " + theusersname + " is in the house!",
          theusersname + " just stepped through the interdimensional gateway!",
          "Hold onto your reality anchors " + theusersname + " has arrived!",
          "Attention, fellow travelers: " + theusersname + " has crossed the threshold!",
          "Welcome, " + theusersname + "! The portal spat them out right here!",
          theusersname + " phased in from an alternate dimension—no biggie!",
          "Portal breach detected: " + theusersname + " is now part of our reality!",
          "Did anyone order a side of " + theusersname + "? It just materialized!",
          theusersname + " bypassed the cosmic veil to join us!",
          "Quantum fluctuations confirmed " + theusersname + " is here!",
          "Reality glitch: " + theusersname + " has glitched into existence!",
          theusersname + ", welcome to the Banter Science Enrichment Center! Please refrain from touching any mysterious glowing buttons.",
          "Attention, test subject " + theusersname + " The cake is a lie, but your presence is very real.",
          "Welcome, " + theusersname + " Remember, the Companion Cube is your best friend—unless it starts talking.",
          theusersname + ", prepare for science! Our teleportation technology may cause minor disorientation.",
          "Greetings, " + theusersname + "! Banter, Where portals are our passion, and safety is… optional.",
          "Welcome to Banter, " + theusersname + "! Please ignore any ominous AI voices—you’re in good hands.",
          "May the Force be with you, " + theusersname + "! Welcome to our galactic chat!",
          "Accio " + theusersname + "! They've just apparated into our conversation!",
          "Hold onto your lightsabers, " + theusersname + " has arrived!",
          "Attention, fellow rebels: " + theusersname + " is now part of our alliance!",
          "Welcome, " + theusersname + "! Prepare for an epic adventure across the stars!",
          theusersname + " slipped through a hyperspace wormhole and landed here!",
          "Alert: " + theusersname + " has entered the Jedi Council chamber!",
          "Did anyone order a side of " + theusersname + "? It just materialized from Tatooine!",
          "Hold the blasters! " + theusersname + " is in the Millennium Falcon!",
          theusersname + " just stepped through the interdimensional portal—lightspeed ahead!",
          "Hold onto your reality anchors, " + theusersname + " has arrived from a galaxy far, far away!",
          "Attention, fellow qitches and wizards: " + theusersname + " is now among us at Banter!",
          "Welcome, " + theusersname + "! The Sorting Hat has spoken!",
          "Portal breach detected: " + theusersname + " is now part of our magical reality!",
          "Did anyone order a side of " + theusersname + "? It just apparated into the Great Hall!",
          "Hold onto your hobbit feet, " + theusersname + " you're now part of our Fellowship!",
          "Attention, fellow travelers: " + theusersname + " has stepped out of the Shire and into our chat!",
          "Hey there, " + theusersname + "! has just rolled into our chat like a finely crafted joint. Spark up some conversation!",
          "High-five, " + theusersname + " has entered the space. Grab a virtual brownie and let's chat!",
          "Warning: " + theusersname + " has ingested a potent dose of curiosity. Side effects may include laughter and engaging conversations.",
          "Red alert! " + theusersname + " has materialized on the bridge. Shields up, witty banter activated!",
          "Ladies and gentlemen, put your hands together for the incomparable " + theusersname + "! They've just tuned in to our frequency.",
          "In a world of ones and zeros, " + theusersname + " emerges as a pixelated hero. Stay tuned for their chat-tastic adventures!",
          "Attention, aquatic enthusiasts: " + theusersname + " has surfaced! Let's dive deep into conversation.",
          "Cod almighty! " + theusersname + " just swam into our net. Reel 'em in for a chat-tastic time!",
          "The tides have shifted, and " + theusersname + " has washed ashore! Welcome to our aquatic realm!",
          "Attention, sailors! " + theusersname + " has charted a course to our chat. Prepare for a splash of conversation!",
          "Hold onto your seashells! " + theusersname + " just emerged from the coral reefs and joined our crew!",
          "Alert: " + theusersname + " has surfaced in our virtual ocean. Dive in and say hello!",
          "Did anyone order a side of " + theusersname + "? It just swam in from Atlantis!",
          "Welcome aboard, " + theusersname + "! You've officially become a chatfish in our digital sea.",
          "Attention, fellow merfolk: " + theusersname + " has traded fins for keyboard strokes. Say hello!",
          "Portal breach detected: " + theusersname + " has crossed the seafloor rift and entered our chat bubble!",
          "Hold onto your shipwreck treasures, " + theusersname + "! You're now part of our salty crew.",
          "Hey there, " + theusersname + "! You've just surfaced like a curious narwhal. Let's chat!",
          "Warning: " + theusersname + " has ingested a potent dose of chat-ocean vibes. Dive deep and explore!",
          "Red alert! " + theusersname + " has materialized on the crow's nest. Ready the parrots!",
          "Ladies and gentlemen, put your flippers together for the incomparable " + theusersname,
          "Welcome, " + theusersname + "! You've washed ashore in our virtual oasis. Explore and dive into conversations!",
          "Ahoy, " + theusersname + "! Chart a course through our chat waves and discover hidden treasures.",
          "Alert: " + theusersname + " has surfaced in our digital cove. Dive in and say hello!",
          "Step through the mystical portal, " + theusersname + ", and join our enchanting realm!",
          "Abracadabra! You've unlocked access to our magical chat circle, " + theusersname + ".",
          "Wands at the ready, " + theusersname + "! Your presence adds a touch of wizardry.",
          "Welcome, spellcaster " + theusersname + "! Brew your thoughts into potent conversations.",
          "In this space, words are our incantations. Let the magic flow, " + theusersname + "!",
          "Strap on your digital headset, " + theusersname + " our chat world awaits!",
          "Welcome to the matrix of ideas, " + theusersname + ". Let's explore alternate realities.",
          "In this virtual space, pixels become conversations. Ready to immerse, " + theusersname + "?",
          "You've logged in successfully, " + theusersname + ". Now navigate the bantaverse!",
          "Reality check: You're now part of our 3D virtual experience, " + theusersname + "!",
          "Enter the sands of our chat oasis, " + theusersname + ". Anubis approves!",
          "Pharaohs and scribes once roamed these digital corridors, " + theusersname + ". Welcome!",
          "May Ra's light guide your words as you explore our hieroglyphic space, " + theusersname + ".",
          "You've deciphered the secret code to our ancient chat scrolls, " + theusersname + ".",
          "Nefertiti would be proud—welcome to our pyramid of ideas, " + theusersname + "!",
          "The unexamined chat is not worth having, " + theusersname + ". Let's dive deep!",
          "Welcome, seeker of wisdom. Here, thoughts flow like ancient rivers, " + theusersname + ".",
          "In this Socratic agora, dialogue is the elixir of understanding, " + theusersname + ".",
          "Life's canvas awaits your philosophical brushstrokes. Paint away, " + theusersname + "!",
          "Remember, every keystroke shapes your digital legacy, " + theusersname + ".",
          "Hail, Olympian! You've ascended to our celestial summit, " + theusersname + ".",
          "Poseidon's trident approves of your arrival. Dive into discourse, " + theusersname + "!",
          "Athena's owl welcomes you to our wisdom-filled agora, " + theusersname + ".",
          "Zeus himself nods—a thunderous welcome to our pantheon, " + theusersname + "!",
          "May Hermes guide your messages swiftly across the digital ether, " + theusersname + ".",
          "Oh, the places we'll chat, " + theusersname + "! Welcome to our Seussian world.",
          "Hop on the chat train, " + theusersname + "! Next stop: imagination station.",
          "One fish, two fish, red space, blue space, welcome, " + theusersname + "!",
          "Today you are you, that is truer than true. No one chats like you do, " + theusersname + "!",
          "Thing 1 and Thing 2 say hello, " + theusersname + "! Let's rhyme and reason.",
          "Attention, interstellar travelers! " + theusersname + " has materialized in our chat constellation!",
          "Quantum entanglement confirmed: " + theusersname + " is now part of our cosmic crew!",
          "Reality glitch detected: " + theusersname + " has bypassed the cosmic veil to join us!",
          "Power levels rising! Welcome, " + theusersname + ", our newest Z Fighter!",
          "Kamehame-welcome, " + theusersname + "! Their energy signature is off the charts!",
          "G'day, mates! " + theusersname + " just dropped in from the Southern Hemisphere!",
          "Top o' the mornin', lads and lasses! " + theusersname + " joins the banter.",
          "Welcome, old bean! Jolly good to have you here, " + theusersname + ".",
          "Howdy, space cowboys! " + theusersname + " is orbiting our chat.",
          "Splendiferous greetings, cosmic wanderers! " + theusersname + " enters our whimsical world.",
          "Fantastic Mr. " + theusersname + ", your cosmic adventure begins now!",
          "Oh, the chats you'll have, fellow stardust! " + theusersname + " joins our Seussian realm.",
          "Hop on the Lorax Express, " + theusersname + ", and let's rhyme through the cosmos!",
          "Attention, cosmic jesters! " + theusersname + " just slipped through a wormhole of wit!",
          "Quantum quips detected: " + theusersname + " has joined our banter brigade!",
          "Reality glitch: " + theusersname + " bypassed the serious dimension to be here!",
          "Welcome, fellow pun enthusiasts! " + theusersname + ", prepare for wordplay wars!",
          "Banter, where comedy is our native tongue. Say hello to " + theusersname + "!",
          "Hold onto your punchlines—" + theusersname + " has entered the chat!",
          "Greetings, word wizards! " + theusersname + " brings a pocketful of puns.",
          "Attention, interplanetary comedians! " + theusersname + " is now on stage!",
          "Banter level: intergalactic. " + theusersname + ", you fit right in!",
          "Knock, knock! Who's there? " + theusersname + ", armed with quips!",
          "Attention, fellow stardust! " + theusersname + " has crash-landed in our puniverse.",
          "Quantum chuckles incoming: " + theusersname + " joins our witty warp drive!",
          "Reality just got a little funnier " + theusersname + " is here!",
          "Welcome, word acrobats! " + theusersname + ", prepare for linguistic gymnastics.",
          "Banter, where gravity is optional. Say hello to " + theusersname + "!",
          "Hold onto your punchlines " + theusersname + " has entered the chat!",
          "Greetings, cosmic comedians! " + theusersname + " brings a quasar of quips.",
          "Attention, interplanetary jesters! " + theusersname + " has graced us with their presence!",
          "Banter level: supernova. " + theusersname + ", you're our cosmic quipster.",
          "Knock, knock! Who's there? " + theusersname + ", armed with cosmic humor.",
          "Cosmic giggle waves detected: " + theusersname + " has joined the party!",
          "Welcome, fellow banteronauts! " + theusersname + ", your orbit just got punnier.",
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
          "Howdy, partners! Saddle up and give a warm welcome to " + theusersname + " as they ride into our midst!",
          "Hold onto your hats, folks! " + theusersname + " is making a grand entrance into our humble abode!",
          "Well, I'll be! " + theusersname + " is moseying in—let's give 'em a rootin-tootin' welcome!",
          "Get ready, cowpokes! " + theusersname + " is storming in like a wild stallion!",
          "Attention, all! " + theusersname + " has just arrived, so let's tip our hats and welcome 'em proper!",
          "Gather 'round, everyone! " + theusersname + " is here to stir up some excitement!",
          "Look lively, folks! " + theusersname + " is entering the room with all the flair of a gunslinger!",
          "Step aside, everyone " + theusersname + " is making an entrance as grand as a gold rush!",
          "Well, if it ain't " + theusersname + " strolling in like the hero of the day! Let's give 'em a rousing cheer!",
          "Yeehaw! " + theusersname + " is here to liven up the place—let's show 'em a rootin'-tootin' welcome!",
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

    console.log("ANNOUNCER: USER: " + e.detail.name + " LEFT UID: " + e.detail.uid);
    if (e.detail.isLocal) {

    };

  });

  const scripts = document.getElementsByTagName("script");
  for (let i = 0; i < scripts.length; i++) {
    if (getAttrOrDefAgain(thescripts[i], "src", "") === scriptsource ) { 
        // const pAnnounce420 = getAttrOrDef(thescripts[i], "announce-420", "false");
        announce = getAttrOrDefAgain(thescripts[i], "announce", "true");
        announceevents = getAttrOrDefAgain(thescripts[i], "announce-events", "true");
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