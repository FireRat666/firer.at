(function () {
    let initialized = false;

    async function initGame() {
        if (initialized) return;
        initialized = true;

        const keyboardscene = BS.BanterScene.GetInstance();

        async function initializeKeyboard(keyBoardPosition = new BS.Vector3(0, 1.8, 4), keyBoardScale = new BS.Vector3(0.5, 0.5, 1)) {
            const lowerCaseButtonObjects = {};
            const upperCaseButtonObjects = {};
            const specialCharsButtonObjects = {};
            const specialButtonsObjects = {};

            const letterButtonSize = new BS.Vector3(1, 1, 1);
            const specialButtonSize = new BS.Vector3(0.7, 0.7, 1);
            const buttonColor = new BS.Vector4(0.1, 0.1, 0.1, 1);
            const textColor = new BS.Vector4(1, 1, 1, 1);
            const buttonShader = 'Unlit/Diffuse';
            const flashColor = new BS.Vector4(0.3, 0.3, 0.3, 0.5);
            let isShiftActive = false;
            let isCapsLockActive = false;
            let isSpecialCharActive = false;

            const keyboardParentObject = await new BS.GameObject("KeyboardParent").Async();
            const parentTransform = await keyboardParentObject.AddComponent(new BS.Transform());
            parentTransform.localPosition = keyBoardPosition;
            parentTransform.localScale = keyBoardScale;

            const textObject = await new BS.GameObject("InputText").Async();
            const inputText = await textObject.AddComponent(new BS.BanterText("", textColor));
            const textTransform = await textObject.AddComponent(new BS.Transform());
            textTransform.localPosition = new BS.Vector3(0, 1.5, 0);
            await textObject.SetParent(keyboardParentObject, false);

            function updateInputText(label) { inputText.text += label; }

            function backspaceInputText() { if (inputText.text.length > 0) { inputText.text = inputText.text.slice(0, -1); } }

            function toggleShift() { isShiftActive = !isShiftActive;
                if (isShiftActive) { toggleButtonGroup('uppercase'); } else { toggleButtonGroup('lowercase'); }
            }

            function toggleCapsLock() { isCapsLockActive = !isCapsLockActive;
                toggleButtonGroup(isCapsLockActive ? 'uppercase' : 'lowercase');
            }

            function toggleSpecialChars() { isSpecialCharActive = !isSpecialCharActive;
                toggleButtonGroup(isSpecialCharActive ? 'special' : 'lowercase');
            }

            function flashButton(buttonObject) {
                const material = buttonObject.GetComponent(BS.ComponentType.BanterMaterial);
                material.color = flashColor; setTimeout(() => { material.color = buttonColor; }, 100);
            }

            async function createButton(label, position, group, clickHandler = null, buttonSize = letterButtonSize, width = 0.3, height = 0.3) {
                const buttonObject = await new BS.GameObject(`Button_${label}`).Async();
                await buttonObject.AddComponent(new BS.BanterGeometry(BS.GeometryType.PlaneGeometry, 0, width, height));
                await buttonObject.AddComponent(new BS.BanterMaterial(buttonShader, "", buttonColor));
                const buttonTransform = await buttonObject.AddComponent(new BS.Transform());
                await buttonObject.AddComponent(new BS.MeshCollider(true));
                buttonObject.SetLayer(5);

                buttonTransform.position = position;
                buttonTransform.localScale = buttonSize;

                const textObject = await new BS.GameObject(`${label}_Text`).Async();
                // Set text alignment to center
                await textObject.AddComponent(new BS.BanterText(label, textColor, BS.HorizontalAlignment.Center, BS.VerticalAlignment.Center));
                const textTransform = await textObject.AddComponent(new BS.Transform());
                // Position text slightly in front of the button to prevent z-fighting
                textTransform.localPosition = new BS.Vector3(0, 0, -0.01);
                await textObject.SetParent(buttonObject, false);

                if (clickHandler) {
                    buttonObject.On('click', () => {
                        // Reset Buttons after using them
                        if (isShiftActive && label !== "Shift") { isShiftActive = false; } // Deactivate Shift
                        if (isCapsLockActive && label !== "Caps") { isCapsLockActive = false; } // Deactivate Caps
                        if (isSpecialCharActive && label !== "Special") { isSpecialCharActive = false; } // Deactivate Special
                        clickHandler();
                        flashButton(buttonObject);
                        console.log(`Special button clicked: ${label}`);
                    });
                } else {
                    buttonObject.On('click', () => {
                        if (isShiftActive) { // If Shift is active, add uppercase letter
                            updateInputText(label);
                            isShiftActive = false; // Deactivate Shift
                            toggleButtonGroup('lowercase'); // Switch back to lowercase buttons
                        } else { updateInputText(label); } // Normal lowercase input
                        flashButton(buttonObject);
                        console.log(`Button clicked: ${label}`);
                    });
                }

                await buttonObject.SetParent(keyboardParentObject, false);

                if (group === 'lowercase') { lowerCaseButtonObjects[label] = buttonObject;
                } else if (group === 'uppercase') {
                    upperCaseButtonObjects[label] = buttonObject; buttonObject.SetActive(false);
                } else if (group === 'special') {
                    specialCharsButtonObjects[label] = buttonObject; buttonObject.SetActive(false);
                } else if (group === 'specialButtons') {
                    specialButtonsObjects[label] = buttonObject; buttonObject.SetActive(true);
                }
            }

            async function createSpecialButton(label, position, clickHandler, width = 0.8) {
                await createButton(label, position, 'specialButtons', clickHandler, specialButtonSize, width, 0.37);
            }

            function toggleButtonGroup(showGroup) {
                Object.values(lowerCaseButtonObjects).forEach(button => button.SetActive(showGroup === 'lowercase'));
                Object.values(upperCaseButtonObjects).forEach(button => button.SetActive(showGroup === 'uppercase'));
                Object.values(specialCharsButtonObjects).forEach(button => button.SetActive(showGroup === 'special'));
            }

            async function createKeyboard() {
                const numbers = "1234567890";
                const lowercase = "qwertyuiopasdfghjklzxcvbnm";
                const uppercase = "QWERTYUIOPASDFGHJKLZXCVBNM";
                const specialChars = "`~!@#$%^&*()_-+=[]{};:'\",.<>/\\?";

                let startX = -1.8; let startY = 0.5;
                let xOffset = 0.4; let yOffset = -0.4;

                // Function to create buttons with specific positions based on layout
                async function createButtons(characters, group, positionLogic) {
                    for (let i = 0; i < characters.length; i++) {
                        const label = characters[i];
                        const position = positionLogic(i, label);
                        await createButton(label, position, group);
                    }
                }

                function numberPositionLogic(i) { return new BS.Vector3(startX + (i % 10) * xOffset, startY + 0.4, 0); }

                function letterPositionLogic(i) {
                    let position;
                    if (i < 10) { position = new BS.Vector3(startX + i * xOffset, startY, 0); // First row
                    } else if (i < 19) { position = new BS.Vector3(startX + 0.2 + (i - 10) * xOffset, startY + yOffset, 0); // Second row
                    } else { position = new BS.Vector3(startX + 0.4 + (i - 19) * xOffset, startY + 2 * yOffset, 0); } // Third row
                    return position;
                }

                function specialCharsPositionLogic(i) {
                    let position;
                    if (i < 10) { position = new BS.Vector3(startX + i * xOffset, startY, 0); // First row
                    } else if (i < 21) { position = new BS.Vector3(startX + (i - 10) * xOffset, startY + yOffset, 0); // Second row
                    } else { position = new BS.Vector3(startX + (i - 21) * xOffset, startY + 2 * yOffset, 0); } // Third row
                    return position;
                }

                // Create buttons using the defined logic
                await createButtons(numbers, 'number', numberPositionLogic);
                await createButtons(lowercase, 'lowercase', letterPositionLogic);
                await createButtons(uppercase, 'uppercase', letterPositionLogic);
                await createButtons(specialChars, 'special', specialCharsPositionLogic);

                // Create special buttons: Shift, Caps Lock, Special Characters, Backspace, and Space
                await createSpecialButton("Shift", new BS.Vector3(startX - 0.5, (startY) + 3 * yOffset, 0), toggleShift);
                await createSpecialButton("Caps", new BS.Vector3((startX - 0.9) + xOffset, (startY + 0.4) + 3 * yOffset, 0), toggleCapsLock);
                await createSpecialButton("Special", new BS.Vector3((startX - 0.2) + xOffset, startY + 3 * yOffset, 0), toggleSpecialChars, 0.8);
                await createSpecialButton("Backspace", new BS.Vector3(startX + 10.8 * xOffset, (startY + 0.4), 0), backspaceInputText, 1.2);
                await createSpecialButton("Submit", new BS.Vector3(startX + 10.8 * xOffset, startY, 0), () => { console.log(inputText.text);
                    keyboardscene.OneShot(JSON.stringify({messagething: keyboardscene.localUser.name + ": " + inputText.text}));
                    inputText.text = ""; }, 1.2);
                await createSpecialButton("Space", new BS.Vector3(startX + 1.5, startY + 3 * yOffset, 0), () => { updateInputText(" "); }, 1.2);

                // Default to showing lowercase letters
                toggleButtonGroup('lowercase');
            }

            await createKeyboard();
        }

        // Call the function to initialize the keyboard
        initializeKeyboard();
    }

    // --- Check for BS availability ---
    if (window.BS) {
        initGame();
    } else {
        window.addEventListener("unity-loaded", initGame);
        window.addEventListener("bs-loaded", initGame);
    }
})();