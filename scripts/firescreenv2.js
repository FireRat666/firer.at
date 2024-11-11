// SDK2 Based FireScreen, V0.69 Beta 4.1.0 -- Thank you Everyone who helped make this possible, HBR, Vanquish3r, DedZed, Sebek, Skizot, Shane and FireRat, And thank you to everyone who helped test it
// FireScreen Tablet for Screen Casts / live streams with volume controls or a portable browser for any website.
async function loadAndExecuteScript(src) {
  try {
    const response = await fetch(src);
    const scriptContent = await response.text();
    
    eval(scriptContent);
    console.log("Script executed successfully!");
  } catch (error) {
    console.error("Failed to load or execute the script:", error);
  }
}

setTimeout(() => { loadAndExecuteScript(`https://firer.at/scripts/firescreenscripts.js`); }, 1000);