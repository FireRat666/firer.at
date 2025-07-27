// SDK2 Based FireScreen, V0.99 Beta 1.0 -- Thank you Everyone who helped make this possible, HBR, Vanquish3r, DedZed, Sebek, Skizot, Shane and FireRat, And thank you to everyone who helped test it
// FireScreen Tablet for Screen Casts / live streams with volume controls or a portable browser for any website.
// This script is the main entry point for initializing FireScreens.
// It sets up a manager to handle all screen instances and uses a locking
// mechanism to prevent race conditions when multiple scripts are added at once.

if (typeof window.fireScreenV2Initialized === 'undefined' && window.isBanter) {
  window.fireScreenV2Initialized = true;
  console.log("FIRESCREEN_V2: Core system initialized.");

  // This flag is the lock to prevent multiple setup runs at the same time.
  window.fireScreenSetupRunning = false;

  // This function will be called by the loader logic below.
  // It ensures the manager exists and then tells it to process screens.
  window.setupFireScreenV2AndRun = async function() {
    // Dynamically import the manager to start the process.
    // The '.js' extension is important for ES modules in the browser.
    if (typeof window.fireScreenManager === 'undefined') {
      const { FireScreenManager } = await import('./FireScreenManager.js');
      try {
        window.fireScreenManager = new FireScreenManager();
        console.log("FIRESCREEN_V2: Manager created.");
        // Add the cleanup function to the window for backward compatibility
        window.cleanupFireScreenV2 = async function(instanceId) {
            console.log(`FIRESCREEN_V2: Global cleanup called for instance ${instanceId}.`);
            if (window.fireScreenManager) {
                await window.fireScreenManager.cleanup(instanceId);
            } else {
                console.error("FireScreenManager not found.");
            }
        };
      } catch (error) {
        console.error("FIRESCREEN_V2: Failed to load the FireScreenManager module.", error);
        throw error; // re-throw to stop the setup process
      }
    }

    // Tell the manager to set up any unprocessed screens.
    await window.fireScreenManager.setupScreens();
  };
}
// This IIFE runs for every <script> tag. It uses a locking mechanism
// to ensure that setup only runs once at a time, even if multiple
// scripts are injected simultaneously.
(async () => {
  if (!window.isBanter) return;
  // This function will attempt to acquire a lock and run the setup.
  // If the lock is already taken, it will wait and retry.
  async function attemptSetup() {
    if (window.fireScreenSetupRunning) {
      console.log("FIRESCREEN_V2: Setup in progress. Waiting to retry...");
      setTimeout(attemptSetup, 500); // Wait 500ms and try again
      return;
    }
    // Acquire lock
    window.fireScreenSetupRunning = true;
    console.log("FIRESCREEN_V2: Lock acquired, starting setup...");

    try {
      // This function is now async and processes all unprocessed scripts sequentially.
      await window.setupFireScreenV2AndRun();
    } finally {
      console.log("FIRESCREEN_V2: Setup finished, releasing lock.");
      window.fireScreenSetupRunning = false;
    }
  }

  // Function to check for conflicting scripts to ensure compatibility.
  function checkForMatchingFireScripts() {
    const scripts = Array.from(document.getElementsByTagName('script'));
    const matchingScriptFound = scripts.some(script =>
      script.src.startsWith('https://best-v-player.glitch.me/') ||
      script.src.startsWith('https://fire-v-player.glitch.me/') ||
      script.src.startsWith('https://vidya.sdq.st/')
    );
    return matchingScriptFound;
  }

  // Calculate delay and start initialization.
  const delay = checkForMatchingFireScripts() ? 10000 : 500;
  console.log(`FIRESCREEN_V2: Delaying setup attempt by ${delay}ms for compatibility.`);
  setTimeout(attemptSetup, delay);

})();