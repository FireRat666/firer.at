// SDK2 Based FireScreen, V0.9 Beta 1.0.0 -- Thank you Everyone who helped make this possible, HBR, Vanquish3r, DedZed, Sebek, Skizot, Shane and FireRat, And thank you to everyone who helped test it
// FireScreen Tablet for Screen Casts / live streams with volume controls or a portable browser for any website.
function checkForMatchingFireScripts() {
  const scripts = Array.from(document.getElementsByTagName('script'));
  const matchingScriptFound = scripts.some(script => script.src.startsWith('https://best-v-player.glitch.me/') || script.src.startsWith('https://fire-v-player.glitch.me/') || script.src.startsWith('https://vidya.sdq.st/') );
  return matchingScriptFound;
}

async function loadAndExecuteFireScript(src) {
  try {
    const response = await fetch(src);
    const scriptContent = await response.text();
    const delay = checkForMatchingFireScripts() ? 10000 : 0;
    setTimeout(() => { eval(scriptContent); }, delay);
    console.log(`FireScreen Script executed successfully! YT Detected:${checkForMatchingFireScripts()}`);
  } catch (error) { console.error("Failed to load or execute the FireScreen script:", error); }
}

function checkForBS() {
  if (window.BS) {
    // BS is loaded, so we can now execute the script
    console.log(`FireScreen Script BS is loaded, so we can now execute the script`);
    loadAndExecuteFireScript('https://firer.at/scripts/firescreenscripts.js');
  } else {
    // BS not loaded yet, wait for it
    window.addEventListener("bs-loaded", () => {
      console.log(`FireScreen Script BS not loaded yet, wait for it`);
      loadAndExecuteFireScript('https://firer.at/scripts/firescreenscripts.js');
    })
  }
    console.log(`FireScreen Script Checked for BS`);
}

checkForBS();