// This script was taken from https://vidya.sdq.st/say-names.js and https://best-v-player.glitch.me/say-names.js
var scriptsource = "https://firer.at/scripts/announcer.js";
var theusersname = "";
var timevariable = 0;
var theusersid = "";
var announcefirstrun = true;
var announce = "true";
var announceevents = "true";
var announce420 = "false";
var readytospeak = true;

var announceraudiovolume = 0.08;
var announcerAudioObject = new BS.GameObject("MyAudioSource"); 
var announcerAudioSource = null;
var AmeliaLink = `https://audiofiles.firer.at/mp3/11-Amelia/`;

// // Main Speak Function, Thank you Elin and everyone
async function TTSVoice(text) {
  if (readytospeak) {
    readytospeak = false

    announcerAudioSource.volume = announceraudiovolume;
    console.log("ANNOUNCER: saying:", text);
    // let theaudio = new Audio(`https://ttsthing.netlify.app/?text=${text}`); theaudio.autoplay = true; theaudio.volume = 0.1; theaudio.play()
    // announcerAudioSource.PlayOneShotFromUrl(`https://ttsthing.netlify.app/.netlify/functions/generateTTS?text=${text}&#.wav`);
    announcerAudioSource.PlayOneShotFromUrl('https://speak.firer.at/?text=' + text + "#.mp3");

    setTimeout(() => { readytospeak = true; }, 5000);
  } else {
    console.log("ANNOUNCER: Not Ready to Speak:", text);
  };

};

let currentAudioSource = null; // Holds the reference to the current audio source

async function combineAudioFiles(urls, volume = 0.1) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // If audio is already playing, skip this call
  if (currentAudioSource) { console.log(`Skipping Message (Already Speaking)`); return; }
  console.log(`Speaking:`); console.log(urls);
  // Load and decode each audio file
  const buffers = await Promise.all(
    urls.map(async (url) => {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return await audioContext.decodeAudioData(arrayBuffer);
    })
  );

  // Calculate total length and create a new buffer
  const totalLength = buffers.reduce((sum, buffer) => sum + buffer.length, 0);
  const outputBuffer = audioContext.createBuffer(
    buffers[0].numberOfChannels,
    totalLength,
    audioContext.sampleRate
  );

  // Copy each buffer into the output buffer
  let offset = 0;
  for (const buffer of buffers) {
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      outputBuffer.copyToChannel(buffer.getChannelData(i), i, offset);
    }
    offset += buffer.length;
  }

  // Create a source and gain node for volume control
  const source = audioContext.createBufferSource();
  source.buffer = outputBuffer;
  const gainNode = audioContext.createGain();
  gainNode.gain.value = volume; // Set the volume

  // Connect source -> gain -> destination
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Store the current source to indicate audio is playing
  currentAudioSource = source;

  // Reset currentAudioSource when playback ends
  source.onended = () => {
    currentAudioSource = null; // Clear the current source when playback ends
  };

  // Play the audio
  source.start();
}

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
  function PRNGF(seed, modulo) {
    str = `${(2**31-1&Math.imul(48271,seed))/2**31}`
    .split('')
    .slice(-10)
    .join('') % (modulo)
    return str
}

// here lies a loop function
function aloopfunction(interval, callback) {
  let readyToTrigger;
  const _aloopfunction = () => {
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
  setInterval(_aloopfunction, 800);
  _aloopfunction();
};

// This function is for the events announcements
function loadevents() {
  if(window.isBanter && announceevents === "true") {
    console.log("ANNOUNCER: Event Announcer Enabled");
    let lastEventsId = 0;
    aloopfunction(20, async () => {
      let event = await (await fetch("https://api.sidequestvr.com/v2/events?limit=1")).json();
      if(event.length) {
        const difference = Math.abs(new Date(event[0].start_time) - new Date());
        if(difference < 60 * 1000 && lastEventsId !== event[0].events_v2_id) {
          lastEventsId = event[0].events_v2_id;
          // await TTSVoice("Oh Shit " + event[0].name + ", is starting now! Drop your shit and hussle");
          await combineAudioFiles([`${AmeliaLink}Oh%20Shit.mp3`,`https://speak.firer.at/?text=${encodeURIComponent(event[0].name)}#.mp3`,`${AmeliaLink}is%20starting%20now!%20Drop%20your%20shit%20and%20hussle.mp3`]);
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
        TTSVoice(msg.data);
        // combineAudioFiles(msg.data);
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


var thescripts = document.getElementsByTagName("script");
var announcerscene = BS.BanterScene.GetInstance();
var timenow = 9999999999999; // Set Now to a Really Big Number, so if user-joined is called before unity-loaded, it wont spam user joined messages for users that were already in the space
// Welcome message for user entering the space
function announcerloadtest() {
  

  announcerscene.On("unity-loaded", () => {
    announcefirstrun = false;
    timenow = Date.now(); // Sets Now to after unity scene load is done
  });
  announcerscene.On("user-joined", e => {
    theusersid = e.detail.uid;
    let tempusername = false;
    if (e.detail.name === "Gravxton") {tempusername = "Graviton"};
    if (theusersid === "c81d8333f83208a6124370282b992a45") {tempusername = "echo phase"}; // Echo Mental
    if (theusersid === "2fa5290b268076d98aa078e1cc2ce3e2") {tempusername = "Kah Gey knee ko"}; // Kageneko
    if (theusersid === "e9412ffa5ca2970f3b9de7b87258e712") {tempusername = "Aziz z z"}; // Aziz
    if (theusersid === "ada674dac0d26556244bf61c2b97184e") {tempusername = "Yunji verse"}; // Yunjiverse
    if (theusersid === "94acdf9d5887ce8fb4a5c9c605f906a5") {tempusername = "Fear Psycho"}; // "Psycho"
    if (theusersid === "19f104073c0da250138d67be9634d842") {tempusername = "Jaeger 7 4 5"}; // Jaeger_745
    // if (theusersid === "597c64d0037631df4ec9d73ad381f634 ") {tempusername = "Someone you don't know"}; // Gooch Monkey
    if (theusersid === "ee95ee1ae0cd0d67066a4519e665911e") {tempusername = "Zelrainer"}; //  Zelrainer
    // if (theusersid === "32c3e6ac83b78872be370cb10f0c9729") {tempusername = "Casey"}; //  "caseycastaway"
    if (theusersid === "f3da86e3752aa16d8f574777cc5ed842") {tempusername = "Irish Jesus"}; //  "Scottish.Jesus"
    // if (theusersid === "452267f713cf815aab6f8e6a2548ff93") {tempusername = "Ben"}; //  "Ben"
    // if (theusersid === "d1bdc33ac0fcfc061728b2e11c740ac7") {tempusername = "Mika"}; //  "Mika"
    // if (theusersid === "2bf1e383ae55886d560f13e0bd040330") {tempusername = "Shane Harris"}; //  Shane Harris
    if (theusersid === "3236ff6310bfe543efa2648346f59ea3") {tempusername = "Irish Guy"}; //  Irishking  
    if (theusersid === "9eefdbc0892b7f90f6c30723c00fcde5") {tempusername = "Shane"}; //  "Oh no, Shane"

    if (tempusername) {
      theusersname = `https://speak.firer.at/?text=${encodeURIComponent(tempusername)}#.mp3`;
    } else {
      theusersname = `https://speak.firer.at/?text=${encodeURIComponent(e.detail.name)}#.mp3`;
    }

    if (theusersid === "f67ed8a5ca07764685a64c7fef073ab9") {theusersname = `${AmeliaLink}FireRat.mp3`}; // FireRat
    if (theusersid === "7e778ab53e504bed1d995bf9148b98c2") {theusersname = `${AmeliaLink}Vanquisher.mp3`}; // Vanquisher
    if (theusersid === "2cd40305e0a4b04bf0242ad0d9fa352d") {theusersname = `${AmeliaLink}Zephii.mp3`}; // Zephii
    if (theusersid === "f7d3e8a05224e3954bdc6f4b4ec47708") {theusersname = `${AmeliaLink}Nystx.mp3`}; // Nystx
    if (theusersid === "2567af4ddce8000b887527097fd5bf8a") {theusersname = `${AmeliaLink}Dedzed.mp3`}; // Dedzed
    if (theusersid === "f14cd0a7c028d9e8f1756d76ff450c73") {theusersname = `${AmeliaLink}Divine%20Slayer.mp3`}; // Divine
    if (theusersid === "f87c37aad5d82ac9faea3a2cae55934d") {theusersname = `${AmeliaLink}Discordia%20Kitty.mp3`}; // Discord Kitty
    if (theusersid === "d20dc72cdbb562479089c6c5263815a8") {theusersname = `${AmeliaLink}Ghost%20Droid.mp3`}; // Ghost Droid
    if (theusersid === "2ea1396b49294e396113f4f1ca5d9a9e") {theusersname = `${AmeliaLink}Gemchick.mp3`}; // Gemchick
    if (theusersid === "a3de45107d96ec8ec9857f9111eca6e0") {theusersname = `${AmeliaLink}Fae.mp3`}; // Fae
    if (theusersid === "462b9ba6d7bff70e963f76c7b3ef978a") {theusersname = `${AmeliaLink}tokra.mp3`}; // Tokra
    if (theusersid === "e2ea44863eb547aecc1f9bc94f7b5c30") {theusersname = `${AmeliaLink}Chris.mp3`}; // Chris
    if (theusersid === "4c67af8ae899ea5b8dd6da25566ff3f3") {theusersname = `${AmeliaLink}BobWorks.mp3`}; // BobWorks 
    if (theusersid === "3682ea489f043657d09811dd042bfa83") {theusersname = `${AmeliaLink}ProxCyde.mp3`}; // ProxCyde
    if (theusersid === "220a4b971b3edb376cbc956f5539b8a5") {theusersname = `${AmeliaLink}Big%20John.mp3`}; // Big John
    if (theusersid === "3dbca1090fad5dff35543697ca007066") {theusersname = `${AmeliaLink}Sebek.mp3`}; //  "Sebek"
    if (theusersid === "f8e9b8eed97623712f77f318fa35d7ce") {theusersname = `${AmeliaLink}Waffle%20Man.mp3`}; //  "WaffleMan"
    if (theusersid === "4255792aebfae3cea1086f2963c33fdc") {theusersname = `${AmeliaLink}Rabbit.mp3`}; // Rabbit
    if (theusersid === "52ac3e6e222a72ade6cbde376c27a6c3") {theusersname = `${AmeliaLink}I.T.Trey.mp3`}; // I.T.Trey
    if (theusersid === "89c3abbe6d16e057035cc35ad7492cf7") {theusersname = `${AmeliaLink}Static%20Threat.mp3`}; //  "staticthreat"
    if (theusersid === "f90d43718f190161c2fa2d0879218686") {theusersname = `${AmeliaLink}Captain%20Dan.mp3`}; //  CaptnDaN 
    if (theusersid === "c0f4772ffcec1ee33f9f6e2230ac41bf") {theusersname = `${AmeliaLink}DraculusX.mp3`}; //  "DraculusX" 

    console.log("ANNOUNCER: JOINED USER: " + e.detail.name + " UID: " + theusersid);
 
    if (e.detail.isLocal && announce === "true") {
      announcefirstrun = false;
      timenow = Date.now(); // Sets Now to after first user has joined
      const joinMessages = [
        [`${theusersname}`, `${AmeliaLink}What%20the%20hell,%20you%20broke%20everything,%20it%20was%20just%20working,%20what%20did%20you%20do.mp3`],
        [`${AmeliaLink}Hello,%20Welcome%20to%20the%20space.mp3`, `${theusersname}`],
        [`${AmeliaLink}What%20are%20you%20doing%20here.mp3`, `${theusersname}`],        
        [`${AmeliaLink}Welcome%20to%20Banter!.mp3`, `${theusersname}`, `${AmeliaLink}We're%20never%20letting%20you%20go.%20Quick,%20lock%20the%20doors!.mp3`],
        [`${AmeliaLink}Welcome%20to%20the%20Zoo!.mp3`, `${theusersname}`, `${AmeliaLink}Please,%20don't%20feed%20the%20animals.mp3`],
        [`${AmeliaLink}Welcome%20aboard!.mp3`, `${theusersname}`, `${AmeliaLink}We're%20so%20excited%20to%20have%20you%20with%20us.mp3`],
        [`${AmeliaLink}Welcome.mp3`, `${theusersname}`, `${AmeliaLink}we%20Hope%20you%20brought%20your%20sense%20of%20humor!.mp3`],
        [`${AmeliaLink}Glad%20you%20could%20join%20us.mp3`, `${theusersname}`, `${AmeliaLink}now%20let's%20have%20some%20fun!.mp3`],
        [`${AmeliaLink}Fasten%20your%20seatbelt.mp3`, `${theusersname}`, `${AmeliaLink}it's%20going%20to%20be%20a%20wild%20ride..mp3`],
        [`${AmeliaLink}Hi%20there!%20It's%20great%20to%20meet%20you.mp3`, `${theusersname}`, `${AmeliaLink}wait%20a%20sec%20I%20am%20not%20sentient.mp3`],
        [`${AmeliaLink}Welcome.mp3`, `${theusersname}`, `${AmeliaLink}We're%20a%20little%20weird,%20a%20little%20wacky,%20but%20we're%20pretty%20sure%20you'll%20fit%20right%20in.mp3`],
        [`${AmeliaLink}Welcome%20your%20Highness.mp3`, `${theusersname}`],
        [`${AmeliaLink}Hello.mp3`, `${theusersname}`, `${theusersname}`, `${theusersname}`, `${theusersname}`, `${AmeliaLink}Failure%20detected.%20shutting%20down.mp3`],
        [`${AmeliaLink}Howdy,%20partner!.mp3`, `${theusersname}`],
        [`${AmeliaLink}Well,%20if%20it%20ain't%20my%20favorite%20outlaw!.mp3`, `${theusersname}`],
        [`${AmeliaLink}Howdy,%20stranger!%20What%20brings%20you%20to%20these%20parts.mp3`, `${theusersname}`],
        [`${AmeliaLink}Yeehaw!%20What's%20the%20good%20word.mp3`, `${theusersname}`],
        [`${AmeliaLink}Hello%20there,%20cowpoke!.mp3`, `${theusersname}`],
        [`${AmeliaLink}Howdy,%20there!%20How's%20the%20range%20treating%20ya.mp3`, `${theusersname}`],
        [`${AmeliaLink}Good%20day%20to%20ya,%20buckaroo!.mp3`, `${theusersname}`],
        [`${AmeliaLink}Well,%20I'll%20be!%20Ain't%20you%20a%20sight%20for%20sore%20eyes!.mp3`, `${theusersname}`],
        [`${AmeliaLink}G'day,%20trailblazer!.mp3`, `${theusersname}`],
        [`${AmeliaLink}Howdy,%20friend!%20Are%20ya%20Ready%20for%20a%20rootin-tootin'%20good%20time.mp3`, `${theusersname}`],
        [`${AmeliaLink}Welcome%20to%20the%20wild%20frontier,%20partner!.mp3`, `${theusersname}`],
        [`${AmeliaLink}Howdy,.mp3`, `${theusersname}`, `${AmeliaLink}How's%20the%20journey%20been.mp3`],
        [`${AmeliaLink}Hey%20there,.mp3`, `${theusersname}`, `${AmeliaLink}saddle%20up%20for%20some%20fun.mp3`],
        [`${AmeliaLink}Evenin',%20outlaw.%20How's%20the%20trail.mp3`, `${theusersname}`],
        [`${theusersname}`, `${AmeliaLink}welcome%20to%20the%20Banter%20Science%20Enrichment%20Center!%20Please%20refrain%20from%20touching%20any%20mysterious%20glowing%20buttons..mp3`],
        [`${theusersname}`, `${AmeliaLink}congratulations!%20You've%20been%20selected%20for%20our%20groundbreaking%20portal%20experimentation%20program..mp3`],
        [`${AmeliaLink}Hail.mp3`, `${theusersname}`, `${AmeliaLink}You've%20crossed%20the%20Brandywine%20Bridge%20and%20entered%20our%20Shire%20of%20conversation..mp3`],
        [`${AmeliaLink}Hey%20there,.mp3`, `${theusersname}`, `${AmeliaLink}You've%20just%20rolled%20into%20our%20chat%20like%20a%20finely%20crafted%20joint.%20Spark%20up%20some%20conversation.mp3`],
        [`${AmeliaLink}High-five.mp3`, `${theusersname}`, `${AmeliaLink}You've%20entered%20the%20space.%20Grab%20a%20virtual%20brownie%20and%20let's%20chat!.mp3`],
        [`${AmeliaLink}Welcome%20aboard!.mp3`, `${theusersname}`, `${AmeliaLink}Set%20phasers%20to%20'friendly'%20and%20boldly%20go%20where%20no%20avatar%20has%20gone%20before..mp3`],
        [`${AmeliaLink}Beam%20in,.mp3`, `${theusersname}`, `${AmeliaLink}The%20holodeck%20is%20ready%20for%20your%20chat%20adventure.%20Engage!.mp3`],
        [`${AmeliaLink}Swim%20upstream,.mp3`, `${theusersname}`, `${AmeliaLink}You've%20leaped%20into%20our%20chat%20like%20a%20salmon%20on%20a%20mission.%20Splash-tastic!.mp3`],
        [`${AmeliaLink}Welcome%20aboard!.mp3`, `${theusersname}`, `${AmeliaLink}You've%20officially%20become%20a%20chatfish%20in%20our%20digital%20sea..mp3`],
        [`${AmeliaLink}High-five.mp3`, `${theusersname}`, `${AmeliaLink}Your%20anchor%20dropped,%20and%20you%E2%80%99re%20officially%20docked%20in%20our%20harbor..mp3`],
        [`${AmeliaLink}Hold%20onto%20your%20seashells,.mp3`, `${theusersname}`, `${AmeliaLink}You've%20just%20emerged%20from%20the%20coral%20reefs%20and%20joined%20our%20crew..mp3`],
        [`${AmeliaLink}Wands%20at%20the%20ready,.mp3`, `${theusersname}`, `${AmeliaLink}Your%20presence%20adds%20a%20touch%20of%20wizardry..mp3`],
        [`${AmeliaLink}In%20this%20space,%20words%20are%20our%20incantations.%20Let%20the%20magic%20flow,.mp3`, `${theusersname}`],
        [`${AmeliaLink}Welcome,%20seeker%20of%20wisdom.%20Here,%20thoughts%20flow%20like%20ancient%20rivers,.mp3`, `${theusersname}`],
        [`${AmeliaLink}In%20this%20Socratic%20agora,%20dialogue%20is%20the%20elixir%20of%20understanding,.mp3`, `${theusersname}`],
        [`${AmeliaLink}Life's%20canvas%20awaits%20your%20philosophical%20brushstrokes.%20Paint%20away,.mp3`, `${theusersname}`],
        [`${AmeliaLink}Remember,%20every%20keystroke%20shapes%20your%20digital%20legacy,.mp3`, `${theusersname}`],
        [`${AmeliaLink}Hail,%20Olympian!%20You've%20ascended%20to%20our%20celestial%20summit,.mp3`, `${theusersname}`],
        [`${AmeliaLink}Poseidon's%20trident%20approves%20of%20your%20arrival.%20Dive%20into%20discourse,.mp3`, `${theusersname}`],
        [`${AmeliaLink}Athena's%20owl%20welcomes%20you%20to%20our%20wisdom-filled%20agora,.mp3`, `${theusersname}`],
        [`${AmeliaLink}Zeus%20himself%20nods%E2%80%94a%20thunderous%20welcome%20to%20our%20pantheon,.mp3`, `${theusersname}`],
        [`${AmeliaLink}May%20Hermes%20guide%20your%20messages%20swiftly%20across%20the%20digital%20ether,.mp3`, `${theusersname}`],
        [`${AmeliaLink}Kamehame-welcome,.mp3`, `${theusersname}`, `${AmeliaLink}Your%20power%20level%20just%20spiked%20in%20our%20space..mp3`],
        [`${AmeliaLink}Spirit%20Bomb%20of%20greetings,.mp3`, `${theusersname}`, `${AmeliaLink}Charge%20up%20and%20let's%20chat!.mp3`],
        [`${AmeliaLink}Howdy,%20partner!%20Saddle%20up%20for%20some%20rodeo,.mp3`, `${theusersname}`],
        [`${AmeliaLink}Top%20o'%20the%20mornin'%20to%20ya,.mp3`, `${theusersname}`, `${AmeliaLink}Grab%20a%20virtual%20cuppa%20and%20let's%20chat..mp3`],
        [`${AmeliaLink}Cheerio,%20old%20chap!%20Welcome%20to%20our%20banter,.mp3`, `${theusersname}`],
        [`${AmeliaLink}G'day,%20mate!%20Throw%20another%20shrimp%20on%20the%20barbie%20and%20join%20the%20chat,.mp3`, `${theusersname}`],
        [`${AmeliaLink}Howdy-do,.mp3`, `${theusersname}`, `${AmeliaLink}Y'all%20ready%20for%20some%20banter-style%20conversation.mp3`],
        [`${AmeliaLink}Get%20ready%20to%20go%20Super%20Saiyan%20in%20this%20space,.mp3`, `${theusersname}`],
        [`${AmeliaLink}Welcome,%20Z%20Fighter.mp3`, `${theusersname}`, `${AmeliaLink}Let's%20dodge%20metaphors%20and%20unleash%20words!.mp3`],
        [`${AmeliaLink}Channel%20your%20inner%20Goku,.mp3`, `${theusersname}`, `${AmeliaLink}Our%20chat%20is%20your%20Hyperbolic%20Time%20Chamber!.mp3`],
        [`${AmeliaLink}G'day,.mp3`, `${theusersname}`, `${AmeliaLink}Grab%20your%20thongs%20aka%20flip-flops%20and%20join%20the%20chat!.mp3`],
        [`${AmeliaLink}Welcome%20to%20the%20land%20Down%20Under,.mp3`, `${theusersname}`, `${AmeliaLink}Let's%20have%20a%20chinwag..mp3`],
        [`${AmeliaLink}Oi.mp3`, `${theusersname}`, `${AmeliaLink}Fancy%20a%20yarn%20Our%20chat's%20as%20big%20as%20the%20Outback.mp3`],
        [`${AmeliaLink}Good%20on%20ya,.mp3`, `${theusersname}`, `${AmeliaLink}Let's%20have%20a%20ripper%20of%20a%20conversation..mp3`],
        [`${AmeliaLink}Slip%20into%20our%20chat%20like%20a%20surfer%20catching%20a%20wave,.mp3`, `${theusersname}`],
        [`${AmeliaLink}Top%20o'%20the%20mornin'%20to%20ya,.mp3`, `${theusersname}`, `${AmeliaLink}Ready%20for%20some%20blarney.mp3`],
        [`${AmeliaLink}Welcome.mp3`, `${theusersname}`, `${AmeliaLink}Grab%20a%20pint%20and%20chat%20away..mp3`],
        [`${AmeliaLink}A%20hundred%20thousand%20welcomes,.mp3`, `${theusersname}`],
        [`${AmeliaLink}Hiya,.mp3`, `${theusersname}`, `${AmeliaLink}Fancy%20a%20natter%20Cuppa's%20on!.mp3`],
        [`${AmeliaLink}Hey%20there,.mp3`, `${theusersname}`, `${AmeliaLink}Let's%20have%20a%20chinwag%20over%20a%20brew..mp3`],
        [`${AmeliaLink}Alright,%20mate%20Welcome%20to%20our%20chat,.mp3`, `${theusersname}`],
        [`${AmeliaLink}Yo,.mp3`, `${theusersname}`, `${AmeliaLink}Bob's%20your%20uncle%E2%80%94we're%20all%20friends%20here..mp3`],
        [`${AmeliaLink}Sup,.mp3`, `${theusersname}`, `${AmeliaLink}Let's%20chat%20like%20a%20proper%20Brit!.mp3`],
        [`${AmeliaLink}Welcome%20to%20our%20whimsical%20chat,.mp3`, `${theusersname}`, `${AmeliaLink}It's%20like%20stepping%20into%20a%20giant%20peach..mp3`],
        [`${AmeliaLink}Golden%20ticket%20alert!%20You've%20entered%20our%20space%20factory,.mp3`, `${theusersname}`],
        [`${AmeliaLink}BFG-approved%20greetings,.mp3`, `${theusersname}`, `${AmeliaLink}Let's%20dream%20big%20together..mp3`],
        [`${AmeliaLink}Fantastic%20space%20and%20where%20to%20find%20it%20Right%20here,.mp3`, `${theusersname}`],
        [`${AmeliaLink}Matilda%20would%20be%20proud,.mp3`, `${theusersname}`, `${AmeliaLink}Let%20the%20words%20dance!.mp3`],
        [`${AmeliaLink}Oh,%20the%20places%20we'll%20chat,.mp3`, `${theusersname}`, `${AmeliaLink}Welcome%20to%20our%20Seussian%20world..mp3`],
        [`${AmeliaLink}Hop%20on%20the%20chat%20train,.mp3`, `${theusersname}`, `${AmeliaLink}Next%20stop%20imagination%20station..mp3`],
        [`${AmeliaLink}One%20fish,%20two%20fish,%20red%20space,%20blue%20space,%20welcome,.mp3`, `${theusersname}`],
        [`${AmeliaLink}Today%20you%20are%20you,%20that%20is%20truer%20than%20true.%20No%20one%20chats%20like%20you%20do,.mp3`, `${theusersname}`],
        [`${AmeliaLink}Thing%201%20and%20Thing%202%20say%20hello,.mp3`, `${theusersname}`, `${AmeliaLink}Let's%20rhyme%20and%20reason..mp3`],
        [`${AmeliaLink}The%20Dragon%20Balls%20have%20granted%20your%20arrival,.mp3`, `${theusersname}`, `${AmeliaLink}What's%20your%20wish.mp3`],
        [`${AmeliaLink}Enjoy%20your%20stay.mp3`, `${theusersname}`]
      ];
  
      let randommessage = joinMessages[Math.floor(Math.random() * joinMessages.length)];

      if (theusersid === "replace") {randommessage = "replace"} //  replace
      else if (theusersid === "replace") {randommessage = "replace"}; // replace

      combineAudioFiles(randommessage);
      console.log("ANNOUNCER: Local-UID: " + e.detail.uid)

    } else {
      if(Date.now() - timenow > 5000 && announce === "true") {
        const welcomeMessages = [
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20Chronicles%20of%20our%20chat%20just%20added%20a%20new%20chapter!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/By%20Merlin's%20beard!.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20joined%20our%20literary%20adventure!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20Fellowship%20is%20complete%E2%80%94.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20arrived%20in%20our%20epic%20saga!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20crossed%20the%20Narnia%20wardrobe%20into%20our%20world.%20Welcome!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20to%20our%20Wonderland,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20Mad%20Hatter%20is%20thrilled%20to%20meet%20you!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20just%20cracked%20open%20a%20new%20volume%20in%20our%20chat's%20book%20of%20stories!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Greetings,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Our%20chat%20just%20became%20a%20bit%20more%20magical,%20thanks%20to%20you!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20to%20the%20Batcave,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Gotham's%20newest%20ally%20has%20arrived!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/In%20a%20galaxy%20far,%20far%20away,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20just%20landed%20on%20our%20digital%20Death%20Star!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Lights,%20camera,%20action!.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20arrived%20on%20the%20set%20of%20our%20chat%20blockbuster!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/just%20flew%20in%20from%20the%20Marvel%20Universe.%20Welcome,%20Avenger!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Cue%20the%20theme%20music!.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20entered%20our%20chat%20like%20a%20true%20movie%20star!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20joined%20the%20ranks%20of%20our%20Fellowship%20of%20the%20Ring.%20Ready%20for%20a%20quest.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20Doctor%20just%20received%20a%20new%20companion%E2%80%94it's%20you!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Dunder%20Mifflin's%20newest%20employee,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20joined%20the%20office!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20just%20been%20beamed%20up%E2%80%94welcome%20to%20our%20Starship%20Enterprise!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/just%20arrived%20at%20the%20Central%20Perk%20caf%C3%A9.%20Time%20for%20some%20coffee%20and%20chats!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Breaking%20News.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20joined%20our%20chat.%20We're%20in%20for%20a%20wild%20ride!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Hit%20the%20high%20notes!.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20just%20joined%20our%20musical%20ensemble!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20to%20the%20stage,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Let's%20get%20this%20show%20on%20the%20road!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20rhythm%20section%20just%20got%20a%20new%20member%E2%80%94welcome,.mp3`, `${theusersname}`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20just%20dropped%20the%20bass%20in%20our%20chat.%20Let's%20get%20grooving!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20band%20is%20complete%E2%80%94.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20arrived%20and%20the%20crowd%20goes%20wild!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Hail.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/You've%20just%20entered%20the%20annals%20of%20our%20chat%20history!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20Renaissance%20has%20arrived%E2%80%94welcome,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/to%20our%20era%20of%20enlightenment!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Our%20digital%20Colosseum%20just%20got%20a%20new%20gladiator!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20Industrial%20Revolution%20of%20our%20chat%20begins%20with%20the%20arrival%20of.mp3`, `${theusersname}`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20to%20the%20Royal%20Court,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20kingdom's%20newest%20noble%20has%20arrived!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Greetings,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20Magic%20Portal%20has%20just%20granted%20you%20entry%20to%20our%20realm!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20enchanted%20forest%20of%20our%20chat%20now%20holds%20a%20new%20wanderer!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Your%20dragon%20has%20landed,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Time%20for%20some%20legendary%20conversations!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20just%20stepped%20into%20our%20mystical%20kingdom%E2%80%94let%20the%20adventure%20begin!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20magic%20wand%20waves%20welcome,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Our%20fairy-tale%20chat%20has%20a%20new%20character!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Prepare%20for%20warp%20speed!.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20just%20entered%20our%20space%20station!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20galaxy%20just%20gained%20a%20new%20starship%20crew%20member!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Quantum%20portal%20engaged.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20arrived%20from%20a%20distant%20dimension!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Activate%20thrusters%E2%80%94.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20just%20docked%20in%20our%20chat%20spaceport!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome,%20interstellar%20traveler.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Our%20digital%20universe%20just%20got%20a%20little%20larger!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20to%20Banter!.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20Sorting%20Hat%20has%20chosen%20you%20for%20a%20spellbinding%20adventure!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20just%20appeared%20in%20Diagon%20Alley.%20Wands%20at%20the%20ready!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Aslan%20welcomes%20you,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/You've%20stepped%20through%20the%20wardrobe%20into%20Banter!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20lamp-post%20has%20lit%20up%20for.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20to%20the%20magical%20land%20of%20Banter!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/A%20new%20member%20has%20joined%20the%20Fellowship.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20quest%20just%20got%20more%20exciting!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Middle-earth%20is%20richer%20with%20your%20presence!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/You've%20tumbled%20down%20the%20rabbit%20hole%20into%20our%20Wonderland!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20Cheshire%20Cat%20grins%20as.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/appears!%20Ready%20for%20a%20whimsical%20chat.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Gotham's%20latest%20hero%20has%20arrived%E2%80%94welcome,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20Bat-Signal%20shines%20for%20you!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20Batmobile%20just%20pulled%20up,%20and%20it's.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Banter%20is%20safer%20now!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20Force%20has%20guided.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/to%20our%20chat!%20Welcome%20to%20the%20Rebel%20Alliance!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20landed%20on%20Tatooine!%20May%20the%20Force%20be%20with%20you!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20dinosaurs%20have%20roared%20in%20approval%20of%20your%20arrival!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20park's%20gates%20are%20open%20for.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Beware%20of%20the%20T-Rex%20and%20enjoy%20your%20stay!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/You've%20just%20taken%20the%20red%20pill%20and%20entered%20the%20chat%20Matrix!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20just%20dodged%20a%20bullet%20and%20entered%20our%20digital%20world!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Allons-y!.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20just%20traveled%20through%20time%20and%20space%20to%20join%20us!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20TARDIS%20has%20landed%20and.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/is%20on%20board%20for%20another%20adventure!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20to%20the%20Scranton%20branch,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Let's%20get%20ready%20for%20some%20workplace%20hilarity!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20just%20clocked%20in%20at%20Dunder%20Mifflin.%20Time%20for%20some%20office%20shenanigans!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20aboard%20the%20Enterprise,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Engage%20in%20some%20stellar%20conversations!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20just%20beamed%20onto%20our%20starship!%20Set%20phasers%20to%20fun!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Central%20Perk%20just%20got%20a%20new%20guest%E2%80%94welcome,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Let's%20grab%20a%20coffee%20and%20chat!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20just%20joined%20our%20Friends%20group!%20Could%20this%20BE%20any%20more%20exciting.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20stage%20is%20set%20and%20the%20spotlight%20is%20on%20you!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Strum%20the%20guitar%20and%20crank%20up%20the%20volume%E2%80%94.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/is%20ready%20to%20rock!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Get%20ready%20to%20dance%20and%20sing%20along%20in%20our%20pop%20extravaganza!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20just%20hit%20the%20top%20of%20the%20charts%20in%20our%20chat%20room!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Let%20the%20smooth%20jazz%20tunes%20and%20cool%20conversations%20begin!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20joined%20the%20jazz%20ensemble!%20Time%20to%20improvise%20some%20great%20conversations!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Our%20chat%20just%20became%20a%20symphony%20of%20ideas%20with%20your%20presence!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20taken%20the%20stage%E2%80%94prepare%20for%20a%20classical%20conversation!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/You've%20just%20walked%20through%20the%20sands%20of%20time%20to%20our%20ancient%20chat!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20pyramids%20are%20beaming%20with%20your%20arrival,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20to%20our%20pharaonic%20realm!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Hail.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/You've%20just%20joined%20our%20Agora.%20Ready%20for%20some%20philosophical%20debates.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Zeus%20and%20the%20Olympians%20are%20thrilled%20to%20have%20you%20among%20us!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20to%20the%20court,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20king%20and%20queen%20are%20eager%20to%20meet%20their%20newest%20subject!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20entered%20the%20castle!%20The%20jousting%20matches%20and%20feasts%20await!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20drawing%20room%20is%20abuzz%20with%20excitement%20for%20your%20arrival!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20joined%20our%20Victorian%20society!%20Prepare%20for%20refined%20discussions%20and%20tea!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Greetings,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20magical%20realms%20welcome%20you%20with%20open%20arms!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20enchanted%20realm%20now%20holds%20a%20new%20hero%E2%80%94welcome,.mp3`, `${theusersname}`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20shadows%20and%20mysteries%20of%20our%20realm%20now%20embrace%20you!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20dark%20forest%20has%20a%20new%20wanderer%E2%80%94.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Beware%20of%20the%20mythical%20creatures!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20stepped%20into%20the%20city%20where%20magic%20and%20reality%20collide.%20Welcome%20to%20the%20neon%20nights!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20city's%20magical%20underbelly%20just%20got%20a%20bit%20more%20interesting!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20mythical%20creatures%20are%20rejoicing%E2%80%94welcome,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/You're%20now%20part%20of%20our%20legend!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20joined%20our%20mystical%20land%20of%20gods%20and%20heroes.%20Adventure%20awaits!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20to%20Hogwarts,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Grab%20your%20wand%20and%20get%20ready%20for%20some%20magical%20moments!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20Sorting%20Hat%20has%20spoken!.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/is%20officially%20part%20of%20our%20Hogwarts%20house!.mp3`],

          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Platform%209%20and%203%20quarters%20is%20open%20and%20ready%20for%20your%20arrival!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20just%20appeared%20in%20Banter!%20Let%20the%20magic%20begin!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Expecto%20Patronum!.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20just%20joined%20our%20magical%20chat!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20to%20the%20magical%20realm%20of%20Banter,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20Marauder's%20Map%20shows%20you're%20here!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20to%20Banter!.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/The%20wardrobe%20has%20opened%20to%20reveal%20your%20new%20adventure!.mp3`],
          [`${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/has%20stepped%20into%20the%20land%20of%20Banter!%20Aslan%20welcomes%20you%20warmly!.mp3`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/The%20White%20Witch%20has%20nothing%20on%20you,.mp3`, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20to%20our%20enchanted%20chat!.mp3`]
        ];

        const moreMessages = [
          [`Banter's magical creatures are excited to meet you,`, `${theusersname}`, `! The journey begins now!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The lamp-post shines bright for your arrival in Banter!`],
          [`Aslan himself is thrilled to see `, `${theusersname}`, ` in our Banter chat realm!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The Shire is ready to celebrate your arrival!`],
          [`${theusersname}`, ` has just joined the Fellowship! Middle-earth is richer for your presence!`],
          [`Gondor's gates are open for you,`, `${theusersname}`, `! Prepare for a legendary chat!`],
          [`The One Ring's power has nothing on you,`, `${theusersname}`, `! Welcome to our epic journey!`],
          [`${theusersname}`, ` has arrived in Rivendell! Let the tales of Middle-earth unfold!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The Elves of Lothlórien are ready to greet you!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The Queen of Hearts is thrilled you've tumbled into Wonderland!`],
          [`${theusersname}`, ` has fallen down the rabbit hole into our whimsical chat! Tea time awaits!`],
          [`The Mad Hatter is throwing a party, and you're invited,`, `${theusersname}`, `! Welcome to Wonderland!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The Cheshire Cat is grinning at your entrance into our magical realm!`],
          [`${theusersname}`, ` has arrived in Wonderland! Expect curious conversations and delightful madness!`],
          [`The White Rabbit has announced your arrival,`, `${theusersname}`, `! Welcome to our fantastical chat!`],
          [`Gotham's protector is here! Welcome,`, `${theusersname}`, `—the Bat-Signal shines for you!`],
          [`${theusersname}`, ` has arrived in Gotham! Time to fight crime and chat!`],
          [`Welcome to the Batcave,`, `${theusersname}`, `! The city's safest place just got safer!`],
          [`The Batmobile has delivered you,`, `${theusersname}`, `! Gotham is ready for your heroics!`],
          [`${theusersname}`, ` is now in Gotham's shadows! Prepare for a chat as intense as a night patrol!`],
          [`${theusersname}`, ` welcome message blah blah!`],
          [`${theusersname}`, ` just quantum-leaped into the chat!`],
          [`Hold onto your hats `, `${theusersname}`, ` has materialized!`],
          [`Alert: `, `${theusersname}`, ` has entered the interdimensional portal!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! Prepare for a wild ride!`],
          [`${theusersname}`, ` slipped through a wormhole and landed here!`],
          [`Attention, fellow beings: `, `${theusersname}`, ` is now among us!`],
          [`${theusersname}`, `'s presence detected—brace for impact!`],
          [`Did anyone order a side of `, `${theusersname}`, ` ? It just arrived!`],
          [`${theusersname}`, ` bypassed the time-space continuum to join us!`],
          [`Hold the phone! `, `${theusersname}`, ` is in the house!`],
          [`${theusersname}`, ` just stepped through the interdimensional gateway!`],
          [`Hold onto your reality anchors `, `${theusersname}`, ` has arrived!`],
          [`Attention, fellow travelers: `, `${theusersname}`, ` has crossed the threshold!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The portal spat them out right here!`],
          [`${theusersname}`, ` phased in from an alternate dimension—no biggie!`],
          [`Portal breach detected: `, `${theusersname}`, ` is now part of our reality!`],
          [`Did anyone order a side of `, `${theusersname}`, `? It just materialized!`],
          [`${theusersname}`, ` bypassed the cosmic veil to join us!`],
          [`Quantum fluctuations confirmed `, `${theusersname}`, ` is here!`],
          [`Reality glitch: `, `${theusersname}`, ` has glitched into existence!`],
          [`${theusersname}`, `, welcome to the Banter Science Enrichment Center! Please refrain from touching any mysterious glowing buttons.`],
          [`Attention, test subject `, `${theusersname}`, ` The cake is a lie, but your presence is very real.`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, ` Remember, the Companion Cube is your best friend—unless it starts talking.`],
          [`${theusersname}`, `, prepare for science! Our teleportation technology may cause minor disorientation.`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Greetings,.mp3`, `${theusersname}`, `! Banter, Where portals are our passion, and safety is… optional.`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20to%20Banter!.mp3`, `${theusersname}`, `! Please ignore any ominous AI voices—you’re in good hands.`],
          [`May the Force be with you,`, `${theusersname}`, `! Welcome to our galactic chat!`],
          [`Accio `, `${theusersname}`, `! They've just apparated into our conversation!`],
          [`Hold onto your lightsabers,`, `${theusersname}`, ` has arrived!`],
          [`Attention, fellow rebels: `, `${theusersname}`, ` is now part of our alliance!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! Prepare for an epic adventure across the stars!`],
          [`${theusersname}`, ` slipped through a hyperspace wormhole and landed here!`],
          [`Alert: `, `${theusersname}`, ` has entered the Jedi Council chamber!`],
          [`Did anyone order a side of `, `${theusersname}`, `? It just materialized from Tatooine!`],
          [`Hold the blasters! `, `${theusersname}`, ` is in the Millennium Falcon!`],
          [`${theusersname}`, ` just stepped through the interdimensional portal—lightspeed ahead!`],
          [`Hold onto your reality anchors,`, `${theusersname}`, ` has arrived from a galaxy far, far away!`],
          [`Attention, fellow qitches and wizards: `, `${theusersname}`, ` is now among us at Banter!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The Sorting Hat has spoken!`],
          [`Portal breach detected: `, `${theusersname}`, ` is now part of our magical reality!`],
          [`Did anyone order a side of `, `${theusersname}`, `? It just apparated into the Great Hall!`],
          [`Hold onto your hobbit feet,`, `${theusersname}`, ` you're now part of our Fellowship!`],
          [`Attention, fellow travelers: `, `${theusersname}`, ` has stepped out of the Shire and into our chat!`],
          [`Hey there,`, `${theusersname}`, `! has just rolled into our chat like a finely crafted joint. Spark up some conversation!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/High-five.mp3`, `${theusersname}`, ` has entered the space. Grab a virtual brownie and let's chat!`],
          [`Warning: `, `${theusersname}`, ` has ingested a potent dose of curiosity. Side effects may include laughter and engaging conversations.`],
          [`Red alert! `, `${theusersname}`, ` has materialized on the bridge. Shields up, witty banter activated!`],
          [`Ladies and gentlemen, put your hands together for the incomparable `, `${theusersname}`, `! They've just tuned in to our frequency.`],
          [`In a world of ones and zeros,`, `${theusersname}`, ` emerges as a pixelated hero. Stay tuned for their chat-tastic adventures!`],
          [`Attention, aquatic enthusiasts: `, `${theusersname}`, ` has surfaced! Let's dive deep into conversation.`],
          [`Cod almighty! `, `${theusersname}`, ` just swam into our net. Reel 'em in for a chat-tastic time!`],
          [`The tides have shifted, and `, `${theusersname}`, ` has washed ashore! Welcome to our aquatic realm!`],
          [`Attention, sailors! `, `${theusersname}`, ` has charted a course to our chat. Prepare for a splash of conversation!`],
          [`Hold onto your seashells! `, `${theusersname}`, ` just emerged from the coral reefs and joined our crew!`],
          [`Alert: `, `${theusersname}`, ` has surfaced in our virtual ocean. Dive in and say hello!`],
          [`Did anyone order a side of `, `${theusersname}`, `? It just swam in from Atlantis!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20aboard!.mp3`, `${theusersname}`, `! You've officially become a chatfish in our digital sea.`],
          [`Attention, fellow merfolk: `, `${theusersname}`, ` has traded fins for keyboard strokes. Say hello!`],
          [`Portal breach detected: `, `${theusersname}`, ` has crossed the seafloor rift and entered our chat bubble!`],
          [`Hold onto your shipwreck treasures,`, `${theusersname}`, `! You're now part of our salty crew.`],
          [`Hey there,`, `${theusersname}`, `! You've just surfaced like a curious narwhal. Let's chat!`],
          [`Warning: `, `${theusersname}`, ` has ingested a potent dose of chat-ocean vibes. Dive deep and explore!`],
          [`Red alert! `, `${theusersname}`, ` has materialized on the crow's nest. Ready the parrots!`],
          [`Ladies and gentlemen, put your flippers together for the incomparable `, `${theusersname}`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! You've washed ashore in our virtual oasis. Explore and dive into conversations!`],
          [`Ahoy,`, `${theusersname}`, `! Chart a course through our chat waves and discover hidden treasures.`],
          [`Alert: `, `${theusersname}`, ` has surfaced in our digital cove. Dive in and say hello!`],
          [`Step through the mystical portal,`, `${theusersname}`, `, and join our enchanting realm!`],
          [`Abracadabra! You've unlocked access to our magical chat circle,`, `${theusersname}`, `.`],
          [`Wands at the ready,`, `${theusersname}`, `! Your presence adds a touch of wizardry.`],
          [`Welcome, spellcaster `, `${theusersname}`, `! Brew your thoughts into potent conversations.`],
          [`In this space, words are our incantations. Let the magic flow,`, `${theusersname}`, `!`],
          [`Strap on your digital headset,`, `${theusersname}`, ` our chat world awaits!`],
          [`Welcome to the matrix of ideas,`, `${theusersname}`, `. Let's explore alternate realities.`],
          [`In this virtual space, pixels become conversations. Ready to immerse,`, `${theusersname}`, `?`],
          [`You've logged in successfully,`, `${theusersname}`, `. Now navigate the bantaverse!`],
          [`Reality check: You're now part of our 3D virtual experience,`, `${theusersname}`, `!`],
          [`Enter the sands of our chat oasis,`, `${theusersname}`, `. Anubis approves!`],
          [`Pharaohs and scribes once roamed these digital corridors,`, `${theusersname}`, `. Welcome!`],
          [`May Ra's light guide your words as you explore our hieroglyphic space,`, `${theusersname}`, `.`],
          [`You've deciphered the secret code to our ancient chat scrolls,`, `${theusersname}`, `.`],
          [`Nefertiti would be proud—welcome to our pyramid of ideas,`, `${theusersname}`, `!`],
          [`The unexamined chat is not worth having,`, `${theusersname}`, `. Let's dive deep!`],
          [`Welcome, seeker of wisdom. Here, thoughts flow like ancient rivers,`, `${theusersname}`, `.`],
          [`In this Socratic agora, dialogue is the elixir of understanding,`, `${theusersname}`, `.`],
          [`Life's canvas awaits your philosophical brushstrokes. Paint away,`, `${theusersname}`, `!`],
          [`Remember, every keystroke shapes your digital legacy,`, `${theusersname}`, `.`],
          [`Hail, Olympian! You've ascended to our celestial summit,`, `${theusersname}`, `.`],
          [`Poseidon's trident approves of your arrival. Dive into discourse,`, `${theusersname}`, `!`],
          [`Athena's owl welcomes you to our wisdom-filled agora,`, `${theusersname}`, `.`],
          [`Zeus himself nods—a thunderous welcome to our pantheon,`, `${theusersname}`, `!`],
          [`May Hermes guide your messages swiftly across the digital ether,`, `${theusersname}`, `.`],
          [`Oh, the places we'll chat,`, `${theusersname}`, `! Welcome to our Seussian world.`],
          [`Hop on the chat train,`, `${theusersname}`, `! Next stop: imagination station.`],
          [`One fish, two fish, red space, blue space, welcome,`, `${theusersname}`, `!`],
          [`Today you are you, that is truer than true. No one chats like you do,`, `${theusersname}`, `!`],
          [`Thing 1 and Thing 2 say hello,`, `${theusersname}`, `! Let's rhyme and reason.`],
          [`Attention, interstellar travelers! `, `${theusersname}`, ` has materialized in our chat constellation!`],
          [`Quantum entanglement confirmed: `, `${theusersname}`, ` is now part of our cosmic crew!`],
          [`Reality glitch detected: `, `${theusersname}`, ` has bypassed the cosmic veil to join us!`],
          [`Power levels rising! Welcome,`, `${theusersname}`, `, our newest Z Fighter!`],
          [`Kamehame-welcome,`, `${theusersname}`, `! Their energy signature is off the charts!`],
          [`G'day, mates! `, `${theusersname}`, ` just dropped in from the Southern Hemisphere!`],
          [`Top o' the mornin', lads and lasses! `, `${theusersname}`, ` joins the banter.`],
          [`Welcome, old bean! Jolly good to have you here,`, `${theusersname}`, `.`],
          [`Howdy, space cowboys! `, `${theusersname}`, ` is orbiting our chat.`],
          [`Splendiferous greetings, cosmic wanderers! `, `${theusersname}`, ` enters our whimsical world.`],
          [`Fantastic Mr. `, `${theusersname}`, `, your cosmic adventure begins now!`],
          [`Oh, the chats you'll have, fellow stardust! `, `${theusersname}`, ` joins our Seussian realm.`],
          [`Hop on the Lorax Express,`, `${theusersname}`, `, and let's rhyme through the cosmos!`],
          [`Attention, cosmic jesters! `, `${theusersname}`, ` just slipped through a wormhole of wit!`],
          [`Quantum quips detected: `, `${theusersname}`, ` has joined our banter brigade!`],
          [`Reality glitch: `, `${theusersname}`, ` bypassed the serious dimension to be here!`],
          [`Welcome, fellow pun enthusiasts! `, `${theusersname}`, `, prepare for wordplay wars!`],
          [`Banter, where comedy is our native tongue. Say hello to `, `${theusersname}`, `!`],
          [`Hold onto your punchlines—`, `${theusersname}`, ` has entered the chat!`],
          [`Greetings, word wizards! `, `${theusersname}`, ` brings a pocketful of puns.`],
          [`Attention, interplanetary comedians! `, `${theusersname}`, ` is now on stage!`],
          [`Banter level: intergalactic. `, `${theusersname}`, `, you fit right in!`],
          [`Knock, knock! Who's there? `, `${theusersname}`, `, armed with quips!`],
          [`Attention, fellow stardust! `, `${theusersname}`, ` has crash-landed in our puniverse.`],
          [`Quantum chuckles incoming: `, `${theusersname}`, ` joins our witty warp drive!`],
          [`Reality just got a little funnier `, `${theusersname}`, ` is here!`],
          [`Welcome, word acrobats! `, `${theusersname}`, `, prepare for linguistic gymnastics.`],
          [`Banter, where gravity is optional. Say hello to `, `${theusersname}`, `!`],
          [`Hold onto your punchlines `, `${theusersname}`, ` has entered the chat!`],
          [`Greetings, cosmic comedians! `, `${theusersname}`, ` brings a quasar of quips.`],
          [`Attention, interplanetary jesters! `, `${theusersname}`, ` has graced us with their presence!`],
          [`Banter level: supernova. `, `${theusersname}`, `, you're our cosmic quipster.`],
          [`Knock, knock! Who's there? `, `${theusersname}`, `, armed with cosmic humor.`],
          [`Cosmic giggle waves detected: `, `${theusersname}`, ` has joined the party!`],
          [`Welcome, fellow banteronauts! `, `${theusersname}`, `, your orbit just got punnier.`],
          [`${theusersname}`, ` Joined your party`],
          [`Oh No, the announcer is stoned, oh well,`, `${theusersname}`, ` Joined the space.&lang=en&pitch=0.7&speed=1.7`],
          [`${theusersname}`, ` has spawned into reality`],
          [`${theusersname}`, ` just showed up, Hold my Head Set`],
          [`${theusersname}`, ` just showed up, Don't let them leave`],
          [`${theusersname}`, ` just showed up, Quick call the police`],
          [`${theusersname}`, ` just showed up, Everyone act normal`],
          [`${theusersname}`, `, What the hell, you broke everything, it was just working, what did you do?!`],
          [`${theusersname}`, ` has joined, what will they do now?`],
          [`${theusersname}`, ` might be an alien, watch them carefully`],
          [`${theusersname}`, ` just stumbled over their charger`],
          [`${theusersname}`, ` Arrived, Everyone go say hi`],
          [`${theusersname}`, ` Just took a hit of laughing gas&lang=en&pitch=1.3&speed=1.1`],
          [`Oh No! `, `${theusersname}`, ` has spawned into reality`],
          [`Oh No! `, `${theusersname}`, ` Left their toilet seat up`],
          [`Oh No! `, `${theusersname}`, ` is about to run out of battery`],
          [`Oh No! `, `${theusersname}`, ` Has forgotten their own name`],
          [`Oh No! `, `${theusersname}`, ` is running out of gas`],
          [`Oh No! `, `${theusersname}`, ` just farted into reality`],
          [`Oh No! `, `${theusersname}`, ` Locked their keys in their car`],
          [`Knock Knock `, `${theusersname}`, ` is here`],
          [`Nobody tell `, `${theusersname}`, ` Their still in their pyjamas`],
          [`Oh No! Hide your sheep `, `${theusersname}`, ` has joined the space`],
          [`Oh No! `, `${theusersname}`, ` needs a recharge, grab the defib`],
          [`Your King `, `${theusersname}`, ` has joined the space.`],
          [`Your Queen `, `${theusersname}`, ` has joined the space.`],
          [`Your Magesty `, `${theusersname}`, ` has joined the space.`],
          [`About time `, `${theusersname}`, ` has joined the space.`],
          [`The rumours are true `, `${theusersname}`, ` has joined the space`],
          [`Bow to your King `, `${theusersname}`],
          [`Bow to your Queen `, `${theusersname}`],
          [`Here we go again,`, `${theusersname}`, ` has joined the space.`],
          [`${theusersname}`, ` Has Joined the space, And wants to know if you are hungry girl`],
          [`${theusersname}`, ` was pushed into a portal, quick call the police`],
          [`Howdy, partners! Saddle up and give a warm welcome to `, `${theusersname}`, ` as they ride into our midst!`],
          [`Hold onto your hats, folks! `, `${theusersname}`, ` is making a grand entrance into our humble abode!`],
          [`Well, I'll be! `, `${theusersname}`, ` is moseying in—let's give 'em a rootin-tootin' welcome!`],
          [`Get ready, cowpokes! `, `${theusersname}`, ` is storming in like a wild stallion!`],
          [`Attention, all! `, `${theusersname}`, ` has just arrived, so let's tip our hats and welcome 'em proper!`],
          [`Gather 'round, everyone! `, `${theusersname}`, ` is here to stir up some excitement!`],
          [`Look lively, folks! `, `${theusersname}`, ` is entering the room with all the flair of a gunslinger!`],
          [`Step aside, everyone `, `${theusersname}`, ` is making an entrance as grand as a gold rush!`],
          [`Well, if it ain't `, `${theusersname}`, ` strolling in like the hero of the day! Let's give 'em a rousing cheer!`],
          [`Yeehaw! `, `${theusersname}`, ` is here to liven up the place—let's show 'em a rootin'-tootin' welcome!`],
          [`The Dark Knight's newest ally has arrived—welcome,`, `${theusersname}`, `! The city needs you!`],
          [`The Force is strong with you,`, `${theusersname}`, `! Welcome to our galactic chat!`],
          [`${theusersname}`, ` has landed on Tatooine! May the Force guide your words!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The Millennium Falcon just made a hyperspace jump for your arrival!`],
          [`The Rebel Alliance welcomes `, `${theusersname}`, `! Prepare for epic conversations across the stars!`],
          [`${theusersname}`, ` has joined the Jedi Council! Time to discuss the galaxy's greatest mysteries!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20aboard!.mp3`, `${theusersname}`, `! The Death Star's defenses are no match for your presence!`],
          [`Welcome to Jurassic Park,`, `${theusersname}`, `! Avoid the T-Rex and enjoy the chat!`],
          [`${theusersname}`, ` has just stepped into the park! Dinosaurs and conversations await!`],
          [`The raptors are restless, but `, `${theusersname}`, ` is here to keep things exciting!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The gates of Banter have opened for your adventure!`],
          [`${theusersname}`, ` has joined the dino-themed chat! Prepare for some prehistoric fun!`],
          [`Welcome to the park,`, `${theusersname}`, `! Watch out for velociraptors and enjoy the conversation!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! You've just taken the red pill and entered our chat Matrix!`],
          [`${theusersname}`, ` has dodged the agents and joined our digital world!`],
          [`Welcome to the Matrix,`, `${theusersname}`, `! Let's bend the rules of reality together!`],
          [`The Oracle has foreseen your arrival,`, `${theusersname}`, `! Time to explore new realities!`],
          [`${theusersname}`, ` has entered the Matrix! Prepare for some mind-bending conversations!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! Neo has nothing on your ability to navigate our chat!`],
          [`Allons-y,`, `${theusersname}`, `! You've just traveled through time and space with the Doctor!`],
          [`Welcome to the TARDIS,`, `${theusersname}`, `! The Doctor's adventures are now your adventures!`],
          [`The Doctor's latest companion has arrived—welcome,`, `${theusersname}`, `! The universe awaits!`],
          [`${theusersname}`, ` has just materialized in the TARDIS! Get ready for a time-traveling chat!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The Doctor has just regenerated into our chat room!`],
          [`The sonic screwdriver is buzzing with excitement for `, `${theusersname}`, `https://audiofiles.firer.at/mp3/11-Amelia/Welcome%20aboard!.mp3`],
          [`Welcome to Banter Mifflin,`, `${theusersname}`, `! Get ready for some office hilarity!`],
          [`${theusersname}`, ` has joined the Scranton branch! Michael Scott's ready for your jokes!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The office just got a little bit more interesting!`],
          [`${theusersname}`, ` is here to spice up our workplace! Time for some classic office shenanigans!`],
          [`Banter Mifflin is buzzing with excitement for `, `${theusersname}`, `! Let's get to work… or not!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The conference room is ready for your contributions!`],
          [`Welcome aboard the Enterprise,`, `${theusersname}`, `! Set phasers to 'fun' and engage!`],
          [`${theusersname}`, ` has beamed aboard! Ready for some stellar conversations?`],
          [`The final frontier just got a new explorer—welcome,`, `${theusersname}`, `! Engage in dialogue!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! Captain Kirk and Spock are thrilled to have you on board!`],
          [`${theusersname}`, ` has just joined Starfleet! Prepare for warp-speed conversations!`],
          [`Welcome to the starship,`, `${theusersname}`, `! Let's boldly go where no chat has gone before!`],
          [`Welcome to Central Perk,`, `${theusersname}`, `! Let's grab a coffee and start chatting!`],
          [`${theusersname}`, ` has joined the gang at Central Perk! Prepare for laughs and friendship!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The Friends crew is ready to welcome you with open arms!`],
          [`${theusersname}`, ` has just entered our circle of friends! Coffee's on us!`],
          [`Welcome to the Friends' hangout,`, `${theusersname}`, `! Time for some classic NYC banter!`],
          [`${theusersname}`, ` has joined the coffeehouse crew! Let's have a good laugh together!`],
          [`Welcome to the rock stage,`, `${theusersname}`, `! Let's turn up the volume and rock out!`],
          [`${theusersname}`, ` has just taken the mic! Time for a rock 'n' roll chat!`],
          [`Get ready to headbang—`, `${theusersname}`, ` has arrived to rock the chat!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The guitar solo has started with your entrance!`],
          [`${theusersname}`, ` has just joined the rock 'n' roll party! Let's make some noise!`],
          [`The crowd's roaring for `, `${theusersname}`, `! Welcome to our rock 'n' roll chat!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The pop charts are excited to feature your presence!`],
          [`${theusersname}`, ` has just dropped the hottest track—welcome to the pop party!`],
          [`Get ready to dance,`, `${theusersname}`, `! The pop scene just got a little brighter!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! Our pop playlist just added a new star!`],
          [`${theusersname}`, ` is now on the pop charts of our chat! Time to hit the high notes!`],
          [`Welcome to the pop sensation,`, `${theusersname}`, `! Let's groove and chat!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The jazz club is alive with your smooth entrance!`],
          [`${theusersname}`, ` has just joined our jazz ensemble! Let's improvise some great conversations!`],
          [`Get ready for some smooth tunes,`, `${theusersname}`, `! Our jazz chat just got a new star!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The jazz band is ready to jam with you in our chat!`],
          [`${theusersname}`, ` has added a new rhythm to our jazz conversation! Let's swing!`],
          [`The jazz saxophone is playing a solo for `, `${theusersname}`, `! Welcome to our cool chat!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! Our chat is now a symphony of elegant conversations!`],
          [`${theusersname}`, ` has just joined our classical orchestra! Let the conversation harmonies begin!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The classical music of our chat just hit a new crescendo!`],
          [`${theusersname}`, ` has taken the conductor's baton in our chat! Prepare for a refined exchange!`],
          [`The classical composers are applauding for `, `${theusersname}`, `! Welcome to our majestic chat!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! Our chat is now a beautiful sonata with your arrival!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The pyramids and pharaohs are excited to see you!`],
          [`${theusersname}`, ` has just stepped into ancient Egypt! Prepare for a chat filled with history and mystery!`],
          [`Welcome to the land of the Nile,`, `${theusersname}`, `! The sphinx awaits your arrival!`],
          [`${theusersname}`, ` has arrived in the sands of time! Get ready to explore ancient wonders!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The gods and goddesses of Egypt are eager to greet you!`],
          [`${theusersname}`, ` has entered our ancient Egyptian realm! Let's unravel the secrets of the pyramids!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The Agora is buzzing with excitement for your arrival!`],
          [`${theusersname}`, ` has joined our Greek symposium! Get ready for some philosophical dialogue!`],
          [`Welcome to Athens,`, `${theusersname}`, `! The gods and philosophers are eager to converse with you!`],
          [`${theusersname}`, ` has arrived in ancient Greece! Let's debate and discuss like the Greeks!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The Parthenon stands proud to celebrate your presence!`],
          [`${theusersname}`, ` has entered the realm of myths and legends! Prepare for some epic conversations!`],
          [`Welcome to the court,`, `${theusersname}`, `! The knights and lords are excited to meet you!`],
          [`${theusersname}`, ` has arrived in our medieval castle! Prepare for grand tales and chivalric discussions!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The castle's great hall is ready for your royal presence!`],
          [`${theusersname}`, ` has joined our medieval kingdom! The jousting tournaments are about to begin!`],
          [`Welcome to the age of chivalry,`, `${theusersname}`, `! The banquet table is set for your arrival!`],
          [`${theusersname}`, ` has entered our medieval realm! Time for some noble quests and feasts!`],
          [`Welcome to the Victorian drawing room,`, `${theusersname}`, `! Prepare for refined conversations and tea!`],
          [`${theusersname}`, ` has just entered our elegant Victorian society! Time for some genteel discussion!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The gas lamps are lit and the parlor is ready for your company!`],
          [`${theusersname}`, ` has joined the ranks of Victorian society! Let's converse with class and sophistication!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The Queen's court is abuzz with excitement for your arrival!`],
          [`${theusersname}`, ` has arrived in our Victorian era! Time to engage in some cultured conversation!`],
          [`Welcome to the enchanted realms,`, `${theusersname}`, `! Prepare for a journey filled with magic and wonder!`],
          [`${theusersname}`, ` has arrived in our high fantasy world! Let's embark on a quest together!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The magical creatures and legendary heroes await your presence!`],
          [`${theusersname}`, ` has just entered our fantasy land! Time for epic adventures and enchanted tales!`],
          [`Welcome to the land of dragons and elves,`, `${theusersname}`, `! The magic is just beginning!`],
          [`${theusersname}`, ` has joined our high fantasy saga! Prepare for adventures beyond imagination!`],
          [`Welcome to the shadowy realms,`, `${theusersname}`, `! Embrace the dark and mystical side of our chat!`],
          [`${theusersname}`, ` has stepped into the dark fantasy world! Beware of creatures of the night!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The haunted forest and ancient curses are ready for your arrival!`],
          [`${theusersname}`, ` has arrived in our dark fantasy realm! Prepare for mysterious and thrilling tales!`],
          [`Welcome to the darkened land of sorcery,`, `${theusersname}`, `! The shadows have eagerly awaited your presence!`],
          [`${theusersname}`, ` has joined our dark fantasy adventure! Time to uncover the secrets of the night!`],
          [`Welcome to the magical cityscape,`, `${theusersname}`, `! The urban fantasy world is buzzing with excitement!`],
          [`${theusersname}`, ` has entered our city where magic and reality collide! Let the urban adventures begin!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The city's hidden magic is ready to be explored with you!`],
          [`${theusersname}`, ` has arrived in our urban fantasy realm! Prepare for a blend of magic and modernity!`],
          [`Welcome to the enchanted metropolis,`, `${theusersname}`, `! The city lights are gleaming with magic!`],
          [`${theusersname}`, ` has joined our urban fantasy world! Get ready for a magical cityscape full of surprises!`],
          [`Welcome to the land of myths and legends,`, `${theusersname}`, `! Prepare for a journey through epic tales and ancient lore!`],
          [`${theusersname}`, ` has arrived in our mythical realm! The gods and heroes are eager to meet you!`],
          [`https://audiofiles.firer.at/mp3/11-Amelia/Welcome.mp3`, `${theusersname}`, `! The mythical creatures and legendary beings are ready for your presence!`],
          [`${theusersname}`, ` has entered the world of ancient myths! Time for legendary quests and magical stories!`],
          [`Welcome to our mythical fantasy world,`, `${theusersname}`, `! The epic adventures and divine legends await!`],
          [`${theusersname}`, ` has joined the pantheon of myths! Prepare for an odyssey of epic proportions!`],
          [`${theusersname}`, `, be careful of DedZed the fish overlord`]
          ];

        // let psudorandomvar = GETPRNGF(welcomeMessages.length);
        let message = welcomeMessages[GETPRNGF(welcomeMessages.length)]; 

        if (theusersid === "3dbca1090fad5dff35543697ca007066") {message = ["https://audiofiles.firer.at/mp3/11-Amelia/Bow%20to%20your%20King%20Sebek%20the%20Mirror%20Creator.mp3"]}; //  "Sebek"
        // if (theusersid === "no-220a4b971b3edb376cbc956f5539b8a5") {message = "Big John is here everybody hide your snack packs"}; // Big John
        if (theusersid === "f8e9b8eed97623712f77f318fa35d7ce") {message = ["https://audiofiles.firer.at/mp3/11-Amelia/Don't%20Die%20it's%20bad%20for%20your%20health,%20Waffle%20Man%20is%20here.mp3"]}; // WaffleMan

        combineAudioFiles(message);
        // speak(message);
      } else if (announcefirstrun) {
        announcefirstrun = false;
        timenow = Date.now(); // Sets Now to after a user has joined if first run is still true
      };
    };
  });
  
  announcerscene.On("user-left", e => {

    console.log("ANNOUNCER: LEFT USER: " + e.detail.name + " UID: " + e.detail.uid);
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


  announcerscene.On("one-shot", e => {
    console.log(e.detail);
    currentshot = e.detail;
    currentshotdata = JSON.parse(e.detail.data);
  
    const shotMessage = (message, volume) => {
      if (message) {
        console.log("shot message");
        let currentVolume = announceraudiovolume;
        announceraudiovolume = volume;
        TTSVoice(message);
        setTimeout(() => { announceraudiovolume = currentVolume; }, 4000);
      }
    };
  
    const shotAudioFile = (audiofile, volume) => {
      if (audiofile) {
        console.log("shot audio file");
        let currentVolume = announceraudiovolume;
        announceraudiovolume = volume;
        playaudiofile(audiofile);
        setTimeout(() => { announceraudiovolume = currentVolume; }, 4000);
      }
    };
  
    const shotMute = () => {
      if (currentshotdata.muteaudio) {
        console.log("shot mute");
        muteaudiofile();
      }
    };
  
    const isAdminOrLocalUser = e.detail.fromAdmin || e.detail.fromId === announcerscene.localUser.uid;
  
    if (isAdminOrLocalUser) {
      console.log(isAdminOrLocalUser ? "Current Shot is from Admin" : "Current Shot is from Local User");
      shotMessage(currentshotdata.message, 0.15);
      shotAudioFile(currentshotdata.audiofile, 0.10);
      shotMute();
    } else if (e.detail.fromId === "f67ed8a5ca07764685a64c7fef073ab9") {
        shotMessage(currentshotdata.message, 0.15);
        shotAudioFile(currentshotdata.audiofile, 0.10);
        shotMute();
    };
  });
    
// await scene.OneShot(JSON.stringify({message: "Example"}));
// await announcerscene.OneShot(JSON.stringify({message: "Words go here"}));
// await announcerscene.OneShot(JSON.stringify({audiofile: "http://firer.at/files/audio/BigJohn.wav"}));
// await announcerscene.OneShot(JSON.stringify({muteaudio: true}));
// await announcerscene.OneShot(JSON.stringify({muteaudio: false}));

};

function getAttrOrDefAgain (pScript, pAttr, pDefault) {
  if (pScript.hasAttribute(pAttr)) {
    return pScript.getAttribute(pAttr);
  } else {
    return pDefault;
  }
};

async function announcerobjectthing() {
announcerAudioSource = await announcerAudioObject.AddComponent(new BS.BanterAudioSource(announceraudiovolume, 1, false, false, true, true, true, false));
};
announcerobjectthing();
announcerloadtest();


async function playaudiofile(text) {
  if (readytospeak) {
    readytospeak = false
    announcerobjectthing();

    console.log("ANNOUNCER: Playing:", text);
    announcerAudioSource.PlayOneShotFromUrl(text);

    setTimeout(() => { readytospeak = true; }, 5000);
  } else {
    console.log("ANNOUNCER: Not Ready to Play:", text);
  };

};

var audiofilemuted = false
async function muteaudiofile(text) {
  if (audiofilemuted) {
    console.log("ANNOUNCER: UN-MUTED");
    audiofilemuted = false
    announcerAudioSource.mute = false
  } else {
    console.log("ANNOUNCER: MUTED");
    audiofilemuted = true
    announcerAudioSource.mute = true
  };

};