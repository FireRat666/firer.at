// This script was taken from https://vidya.sdq.st/say-names.js and https://best-v-player.glitch.me/say-names.js
function checkForMatchingAnnouncerScripts() {
  const scripts = Array.from(document.getElementsByTagName('script'));
  const matchingScriptFound = scripts.some(script => script.src.startsWith('https://best-v-player.glitch.me/') || script.src.startsWith('https://fire-v-player.glitch.me/') || script.src.startsWith('https://vidya.sdq.st/') );
  return matchingScriptFound;
}

async function loadAndExecuteAnnouncerScript(src) {
  try { var delay;
    const response = await fetch(src);
    const scriptContent = await response.text();
    if (window.FireScriptLoaded) { delay = 0 } else { delay = checkForMatchingAnnouncerScripts() ? 10000 : 0; };
    setTimeout(() => { eval(scriptContent); }, delay);
    console.log(`Announcer Script executed successfully! YT Detected:${checkForMatchingAnnouncerScripts()}`);
  } catch (error) { console.error("Failed to load or execute the Announcer script:", error); }
}
function StartAnnouncer() {
  if (!window.AnnouncerScriptInitialized) {
    window.AnnouncerScriptInitialized = true;
    loadAndExecuteAnnouncerScript(`https://firer.at/scripts/announcerscripts.js`);
    console.log(`Announcer Script FIRST Call, Should be Loading!!`);
  } else { console.log(`Announcer Script Already Called, Should be Loading!!`); }
}

function checkForBS() {
  if (window.BS) {
    // BS is loaded, so we can now execute the script
    console.log(`Announcer Script BS is loaded, so we can now execute the script`);
    StartAnnouncer();
  } else {
    // BS not loaded yet, wait for it
    window.addEventListener("bs-loaded", () => {
      console.log(`Announcer Script BS not loaded yet, wait for it`);
      StartAnnouncer();
    })
  }
    console.log(`Announcer Script Checked for BS`);
}

checkForBS();