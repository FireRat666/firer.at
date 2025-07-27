# FireScreen V2 Help & Documentation

Welcome! This guide explains how to install, configure, and interact with FireScreen V2 in your Banter space.

## Table of Contents
1. [Installation](#1-installation)
2. [Configuration Parameters](#2-configuration-parameters)
3. [Advanced Usage](#3-advanced-usage)
    - [Listening for Events](#listening-for-events)
    - [Hand Controls](#hand-controls)
    - [Remote Control (One-Shot Commands)](#remote-control-one-shot-commands)
    - [Space State Synchronization](#space-state-synchronization)
    - [Announcer Integration](#announcer-integration)
    - [Dynamic URL and Home Page Changes](#dynamic-url-and-home-page-changes)
    - [Cleanup and Disposal](#cleanup-and-disposal)
4. [Performance & Troubleshooting](#4-performance--troubleshooting)
5. [Community & Support](#5-community--support)

## Quick Start

1.  **Add the script tag** to your `index.html`:
    ```html
    <script src="https://firer.at/scripts/firescreenv2.js"></script>
    ```
2.  **Set the URL** you want to display:
    ```html
    <script src="https://firer.at/scripts/firescreenv2.js" website="https://google.com"></script>
    ```
3.  **Position the screen** in your world:
    ```html
    <script src="https://firer.at/scripts/firescreenv2.js" website="https://google.com" position="0 2 -5"></script>
    ```

## 1. Installation

To add a FireScreen to your space, simply add a `<script>` tag to your `index.html` file.

```html
<!-- Basic Example -->
<script src="https://firer.at/scripts/firescreenv2.js"
        website="https://firer.at/"
        position="2 1.5 6"
        scale="2.5 2.5 1"
        hand-controls="true">
</script>

<!-- Advanced Example with Custom Buttons and Colors -->
<script src="https://firer.at/scripts/firescreenv2.js"
        position="0 2 -5"
        rotation="0 20 0"
        width="1280"
        height="720"
        pixelsperunit="1400"
        button-color="0.1 0.8 0.1 1"
        custom-button01-url="https://google.com"
        custom-button01-text="Google"
        custom-button02-url="https://youtube.com"
        custom-button02-text="YouTube">
</script>
```

## 2. Configuration Parameters

You can customize each FireScreen instance using attributes on the `<script>` tag.

> **Note on Screen IDs:** The ID for each FireScreen (used for events and remote control) is determined by its order in the `index.html` file, starting from 1. The first FireScreen is ID 1, the second is ID 2, and so on.

#### Core Attributes
| Attribute | Default Value | Description |
| :--- | :--- | :--- |
| `website` | `https://firer.at/pages/games.html` | The initial URL the browser will load. |
| `position` | `0 2 0` | The world position of the screen (X Y Z). |
| `rotation` | `0 0 0` | The world rotation of the screen (X Y Z). |
| `scale` | `1 1 1` | The world scale of the screen (X Y Z). |

#### Display & Appearance
| Attribute | Default Value | Description |
| :--- | :--- | :--- |
| `width` | `1024` | The pixel width of the browser surface. |
| `height` | `576` | The pixel height of the browser surface. |
| `pixelsperunit` | `1200` | The resolution of the web surface. In Banter's Unity-based world, 1 world unit is equivalent to 1 meter, so this value is effectively pixels-per-meter. Higher values result in sharper text and images but can impact performance. |
| `mipmaps` | `1` | The number of mipmaps for the browser texture. |
| `backdrop` | `true` | If `true`, shows a dark backdrop behind the screen. |
| `backdrop-color` | `0 0 0 0.9` | The color and alpha of the backdrop (R G B A, 0-1). |
| `screen-position` | `0 0 -0.02` | The local position of the browser surface relative to the backdrop. |
| `screen-rotation` | `0 0 0` | The local rotation of the browser surface. |
| `screen-scale` | `1 1 1` | The local scale of the browser surface. |

#### Interaction & Controls
| Attribute | Default Value | Description |
| :--- | :--- | :--- |
| `hand-controls` | `false` | If `true`, attaches volume and home controls to the user's left hand. |
| `disable-interaction` | `false` | If `true`, users cannot click or interact with the browser surface. |
| `disable-rotation` | `false` | If `true`, the screen will not billboard (face) the user. |
| `lock-position` | `false` | If `true`, the screen cannot be grabbed and moved by users. |
| `volumelevel` | `0.25` | The initial volume level (0.0 to 1.0). |
| `castmode` | `false` | If `true`, simplifies the UI for casting/streaming use cases. Hides most buttons. |

#### UI Customization
| Attribute | Default Value | Description |
| :--- | :--- | :--- |
| `button-color` | `0 1 0 1` | The default color for UI buttons (R G B A, 0-1). |
| `volup-color` | `0 1 0 1` | The color for the volume up button. |
| `voldown-color` | `1 1 0 1` | The color for the volume down button. |
| `mute-color` | `1 1 1 1` | The color for the mute button. |
| `icon-mute-url` | `(url)` | URL for the mute icon. |
| `icon-volup-url` | `(url)` | URL for the volume up icon. |
| `icon-voldown-url` | `(url)` | URL for the volume down icon. |
| `icon-direction-url` | `(url)` | URL for the back/forward arrow icon. |
| `custom-button01-url` | `false` | Provide a URL to enable custom button 1. This button navigates to the specified URL and does not fire an event. |
| `custom-button01-text`| `Custom Button 1` | Text label for custom button 1. |
| `custom-button02-url` | `false` | URL for custom button 2. |
| `custom-button02-text`| `Custom Button 2` | Text label for custom button 2. |
| `...` | `...` | Custom buttons 3 through 5 follow the same pattern. |

#### Advanced Features
| Attribute | Default Value | Description |
| :--- | :--- | :--- |
| `space-sync` | `false` | If `true`, the screen will attempt to sync its URL from a space state property named `fireurl`. |
| `announce` | `false` | If `true`, enables spoken announcements when users join the space. |
| `announce-events` | `false` | If `true`, enables spoken announcements for upcoming SideQuest events. |
| `announce-420` | `false` | If `true`, enables special 4:20-themed spoken announcements. |

## 3. Advanced Usage

### Listening for Events

You can create custom logic that responds to button clicks on any FireScreen. When a UI or Hand Control button is clicked, a `CustomButtonClick` event is dispatched.

**Note:** This event system does not apply to the custom URL buttons, as they only navigate.
**Recommended Method (using the FireScreenManager):**

This is the safest and most robust way to listen for events. It avoids conflicts with other scripts in the space.

```javascript
// Wait for the manager to be available
const interval = setInterval(() => {
    if (window.fireScreenManager) {
        clearInterval(interval);

        // Add the event listener
        window.fireScreenManager.addEventListener('CustomButtonClick', (event) => {
            console.log('Button clicked on instance:', event.detail.instanceId);
            console.log('Button name:', event.detail.buttonName);
            console.log('Current URL:', event.detail.message);

            if (event.detail.buttonName === 'Home') {
                // Custom action for the home button
                console.log('The Home button was clicked!');
            }
        });
    }
}, 100);
```

**Legacy Method (for backward compatibility):**

This method attaches the listener to the global `document`. It still works but is less recommended for new projects.

```javascript
document.addEventListener('CustomButtonClick', (event) => {
    console.log('--- Detected a Button Click event! ---');
    console.log('Button Name:', event.detail.buttonName);
    console.log('Instance ID:', event.detail.instanceId);
    console.log('Current URL:', event.detail.message);
});
```
### Hand Controls

Setting `hand-controls="true"` attaches a control panel to your left hand for easy access to common functions. These controls are designed to affect **all FireScreens** in the space simultaneously.

| Button | Icon | Action | Event Dispatched |
| :--- | :--- | :--- | :--- |
| **Volume Up** | Volume High | Increases the volume on all FireScreens. | Yes (`VolumeUp`) |
| **Volume Down** | Volume Low | Decreases the volume on all FireScreens. | Yes (`VolumeDown`) |
| **Mute** | Volume Mute | Toggles the mute state on all FireScreens. | Yes (`Mute`) |
| **Home** | Home | Navigates all FireScreens to their home page. | Yes (`Home`) |
| **Lock Player** | Lock | Toggles the Banter "LegacyLockPlayer" state, which prevents you from moving. | No |

### Remote Control (One-Shot Commands)

Space admins can control FireScreens using Banter's `one-shot` system.

**To control a specific screen**, include a `target` property with the screen's ID.
```javascript
// Change URL of screen #2
BS.BanterScene.GetInstance().OneShot(JSON.stringify({
    target: 2,
    fireurl: "https://google.com"
}));
```

**To control all screens at once**, omit the `target` property.
```javascript
// Send all screens home
BS.BanterScene.GetInstance().OneShot(JSON.stringify({
    gohome: true
}));
```

**Available Commands:**

| Command | Value Type | Description |
| :--- | :--- | :--- |
| `fireurl` | `string` | Sets the browser URL. |
| `firevolume` | `number` | Sets the volume directly (0.0 to 1.0). |
| `browseraction`| `string` | Executes a JavaScript string inside the browser (e.g., `document.body.style.backgroundColor='red'`). **Security Note:** Use with caution, as this can execute any JavaScript. Sanitize any user-provided input. |
| `gohome` | `boolean` | Navigates the browser to its configured home page. |
| `sethome` | `string` | Sets a new home page URL for the browser. |
| `firevolumeup` | `boolean` | Increases the volume for all screens. |
| `firevolumedown`| `boolean` | Decreases the volume for all screens. |
| `firemutetoggle`| `boolean` | Toggles mute for all screens. |

### Space State Synchronization

If you set `space-sync="true"` on a FireScreen, it will automatically try to load its URL from a **public space state property** named `fireurl`.

You can set this property in your space settings or via a script:
```javascript
// Example of setting the synced URL
BS.BanterScene.GetInstance().SetPublicSpaceProps({'fireurl': 'https://bantervr.com/'});
```

This is great for having a primary screen in your world that always shows a specific, easily updatable page.


### Announcer Integration

The FireScreen script can provide in-world, spoken announcements for various activities. This feature works by dynamically loading an `announcer.js` script into your space. It is loaded only once, even if multiple screens have announcer flags enabled.

You can enable different types of announcements:

-   **`announce="true"`**: Enables welcome messages when users join the space. This is the primary announcer flag.
-   **`announce-events="true"`**: Enables announcements for upcoming events listed on SideQuest.
-   **`announce-420="true"`**: Enables special, 4:20-themed announcements for upcoming blaze times.

### Dynamic URL and Home Page Changes

You can programmatically change the URL or set a new home page for FireScreens at runtime from your own scripts. This is done by interacting with the global `fireScreenManager` object.

#### Changing the Current URL

You can target a specific screen by its ID or change all screens at once.

```javascript
// Example: Change the URL for the first FireScreen instance (ID 1)
if (typeof fireScreenManager !== 'undefined' && fireScreenManager.instances[1]) {
    fireScreenManager.instances[1].handleCommand({
        fireurl: "https://threejs.org"
    });
}

// Example: Change the URL for ALL FireScreens in the space
if (typeof fireScreenManager !== 'undefined') {
    fireScreenManager.broadcastCommand({
        fireurl: "https://bantervr.com"
    });
}
```

#### Setting a New Home Page

This updates the URL that the "Home" button navigates to.

```javascript
// Example: Set a new home page for the first FireScreen instance (ID 1)
if (typeof fireScreenManager !== 'undefined' && fireScreenManager.instances[1]) {
    fireScreenManager.instances[1].handleCommand({
        sethome: "https://sidequestvr.com"
    });
}
```

### Cleanup and Disposal

When a FireScreen is no longer needed at runtime, it's important to clean it up properly to free up resources and prevent potential performance issues. For compatibility with other scripts and systems, a global `cleanupFireScreenV2` function is available.

**Cleaning up a FireScreen**

This is the recommended way to remove a FireScreen instance. Since `cleanupFireScreenV2` is a global function, you can call it directly without the `window.` prefix.

```javascript
// Example: Clean up the first FireScreen instance
if (typeof cleanupFireScreenV2 === 'function') {
    // The cleanup function takes the instanceId of the screen to remove.
    cleanupFireScreenV2(1);
}
```

Calling this function will trigger the fireScreenManager to safely remove the screen's 3D objects from the scene, dispose of its geometries, materials, and textures to free GPU memory, and clean up any event listeners to prevent memory leaks.

## 4. Performance & Troubleshooting

### Performance Considerations

- **Resolution**: The `width`, `height`, and `pixelsperunit` attributes determine the resolution of the web surface. Higher values create a sharper image but require more memory and processing power, which can impact performance, especially on mobile VR headsets.
- **Multiple Screens**: Each FireScreen instance creates a new browser context. Using many screens in a single space can significantly affect performance.

### Common Issues

- **Screen is not visible**:
    - Check that the `position` and `scale` attributes are set to reasonable values for your space.
    - Ensure the URL in the `website` attribute is correct and accessible.
- **Cannot click on the screen**:
    - Make sure `disable-interaction` is not set to `true`.
- **Custom buttons or icons not appearing**:
    - Double-check that the URLs provided in the `custom-buttonXX-url` or `icon-XX-url` attributes are correct and publicly accessible.

## 5. Community & Support

Encountered a bug or have a feature request? Please open an issue on the official GitHub repository. Your feedback is valuable!

- **GitHub Repository**: https://github.com/FireRat666/51

---
This documentation is for FireScreen V2. For any issues or suggestions, please refer to the source repository.