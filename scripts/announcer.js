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

if (!window.AnnouncerScriptInitialized) {
  window.AnnouncerScriptInitialized = true;
  loadAndExecuteAnnouncerScript(`https://firer.at/scripts/announcerscripts.js`);
  console.log(`Announcer Script FIRST Call, Should be Loading!!`);
} else { console.log(`Announcer Script Already Called, Should be Loading!!`); }