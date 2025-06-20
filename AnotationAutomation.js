let hasFilledOnTrigger = false;
let triggerListenerSetupDone = false;
let triggerCount = 0; // Track number of backtick presses
let lastTargetInput = null; // Store reference to the text box for later use
let checkBoxMode = false; // Track if we are in checkbox mode
let radioMode = false; // Track if we are in radio mode
let intensityMode = false; // Track if we are in intensity mode
let allSlidersMode = false; // NEW: Consolidated slider mode
let sliderInputCount = 0; // NEW: Track which slider is next
let additionalInfoMode = false; // Track if we are in the final checkbox mode
let currentlyHighlightedContainer = null; // Keep track of the highlighted element

// NEW: Function to clear any active highlight
function clearHighlight() {
    if (currentlyHighlightedContainer) {
        currentlyHighlightedContainer.style.boxShadow = 'none';
        currentlyHighlightedContainer = null;
    }
}

// MODIFIED: To set a persistent highlight
function highlightElementParent(element) {
    // First, clear the previous highlight
    clearHighlight();

    if (!element) {
        return; // No element to highlight
    }

    const containerToHighlight = element.closest('.component-wrapper');

    if (containerToHighlight) {
        // Apply the highlight
        containerToHighlight.style.transition = 'box-shadow 0.2s ease-in-out';
        containerToHighlight.style.boxShadow = '0 0 0 2px blue';
        // Store the reference
        currentlyHighlightedContainer = containerToHighlight;
    } else {
        // Fallback if no container is found
        console.log("Could not find a '.component-wrapper' container for highlighting. Highlighting the element directly as a fallback.", element);
        element.style.transition = 'box-shadow 0.2s ease-in-out';
        element.style.boxShadow = '0 0 0 2px blue';
        currentlyHighlightedContainer = element; // Store fallback element
    }
}

// NEW HELPER FUNCTION to update text inputs and notify the framework
function updateTextboxValue(inputElement, newValue) {
    if (!inputElement) return;

    const iframe = document.getElementById('frm1');
    if (!iframe || !iframe.contentWindow) {
        console.error("Cannot update textbox, iframe not ready.");
        return;
    }

    try {
        // Determine the correct prototype based on the element type (input vs textarea)
        const prototype = inputElement.tagName === 'TEXTAREA'
            ? iframe.contentWindow.HTMLTextAreaElement.prototype
            : iframe.contentWindow.HTMLInputElement.prototype;

        // Use the native value setter to bypass React's tracking
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
        nativeInputValueSetter.call(inputElement, newValue);

        // Dispatch 'input' and 'change' events to notify the framework
        const inputEvent = new iframe.contentWindow.Event('input', { bubbles: true });
        const changeEvent = new iframe.contentWindow.Event('change', { bubbles: true });
        
        inputElement.dispatchEvent(inputEvent);
        inputElement.dispatchEvent(changeEvent);

        console.log(`Programmatically set textbox value and dispatched events.`);
    } catch(e) {
        console.error(`Failed to programmatically set value or dispatch event for textbox.`, e);
    }
}

// Script to detect the first text box in an iframe and type into it on trigger key press.

function findAndFillFirstTextBox() {
    const iframe = document.getElementById('frm1');
    if (!iframe) {
        console.error('Iframe with id "frm1" not found when trying to fill.');
        return false;
    }

    let doc;
    try {
        doc = iframe.contentDocument || iframe.contentWindow.document;
    } catch (e) {
        console.error('Error accessing iframe content. This might be due to cross-origin restrictions.', e);
        return false;
    }

    if (!doc) {
        console.error('Could not get document from iframe.');
        return false;
    }

    let inputs = doc.querySelectorAll('input[type="text"], textarea');
    let targetInput = null;

    if (inputs.length > 0) {
        targetInput = inputs[0];
        lastTargetInput = targetInput; // Save for later use
        console.log(`Strategy 1: Found ${inputs.length} text input(s)/textarea(s). Targeting the first one.`);
    } else {
        console.log('Strategy 1: No input[type="text"] or textarea found.');
    }

    if (targetInput) {
        console.log('Found text box:', targetInput);
        highlightElementParent(targetInput); // Use the blue highlight
        targetInput.focus();
        updateTextboxValue(targetInput, "The speaker's tone is "); // MODIFIED
        console.log('Typed "The speaker\'s tone is " into the first text box.');

        // The highlight function has its own timeout, so the old border logic is removed.
        return true;
    } else {
        console.error('No suitable text box found in the iframe.');
        return false;
    }
}

function focusFirstCheckbox() {
    const iframe = document.getElementById('frm1');
    if (!iframe) return null;
    let doc;
    try {
        doc = iframe.contentDocument || iframe.contentWindow.document;
    } catch (e) {
        return null;
    }
    // Find the first visible checkbox in the emotion section
    const checkboxes = doc.querySelectorAll('input[type="checkbox"]');
    if (checkboxes.length > 0) {
        checkboxes[0].focus();
        return checkboxes[0];
    }
    return null;
}

function checkEmotionCheckbox(emotion) {
    const iframe = document.getElementById('frm1');
    if (!iframe) return;
    let doc;
    try {
        doc = iframe.contentDocument || iframe.contentWindow.document;
    } catch (e) {
        return;
    }
    // Map emotion to label text
    const labelMap = {
        'q': 'Anger',
        'w': 'Contempt',
        'e': 'Disgust',
        'a': 'Fear',
        's': 'Sadness',
        'd': 'Surprise',
        'z': 'Happiness',
        'x': 'Tenderness',
        'c': 'Calm/Content'
    };
    const labelText = labelMap[emotion];
    if (!labelText) return;
    // Find the label containing the text and its associated checkbox
    const labels = Array.from(doc.querySelectorAll('label'));
    for (const label of labels) {
        if (label.textContent && label.textContent.trim().replace(/\s+/g, ' ').toLowerCase() === labelText.toLowerCase()) {
            const checkbox = label.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.click(); // Use click() instead of checked=true for React/Angular
                checkbox.focus();
                console.log('Clicked box for', labelText);
                break;
            }
        }
    }
}

function focusFirstRadio() {
    const iframe = document.getElementById('frm1');
    if (!iframe) return null;
    let doc;
    try {
        doc = iframe.contentDocument || iframe.contentWindow.document;
    } catch (e) {
        return null;
    }
    // Find the first visible radio in the emotion section
    const radios = doc.querySelectorAll('input[type="radio"]');
    if (radios.length > 0) {
        radios[0].focus();
        return radios[0];
    }
    return null;
}

function checkEmotionRadio(emotion) {
    const iframe = document.getElementById('frm1');
    if (!iframe) return;
    let doc;
    try {
        doc = iframe.contentDocument || iframe.contentWindow.document;
    } catch (e) {
        return;
    }
    // Map emotion to label text
    const labelMap = {
        'q': 'Anger',
        'w': 'Contempt',
        'e': 'Disgust',
        'a': 'Fear',
        's': 'Sadness',
        'd': 'Surprise',
        'z': 'Happiness',
        'x': 'Tenderness',
        'c': 'Calm/Content'
    };
    const labelText = labelMap[emotion];
    if (!labelText) return;
    // Find the label containing the text and its associated radio
    const labels = Array.from(doc.querySelectorAll('label'));
    for (const label of labels) {
        if (label.textContent && label.textContent.trim().replace(/\s+/g, ' ').toLowerCase() === labelText.toLowerCase()) {
            const radio = label.querySelector('input[type="radio"]');
            if (radio) {
                radio.click(); // Use click() for React/Angular
                radio.focus();
                console.log('Clicked radio for', labelText);
                break;
            }
        }
    }
}

function checkIntensityRadio(intensity) {
    const iframe = document.getElementById('frm1');
    if (!iframe) return;
    let doc;
    try {
        doc = iframe.contentDocument || iframe.contentWindow.document;
    } catch (e) {
        return;
    }
    // Map intensity to label text
    const labelMap = {
        'q': 'Low',
        'w': 'High'
    };
    const labelText = labelMap[intensity];
    if (!labelText) return;
    // Find the label containing the text and its associated radio
    const labels = Array.from(doc.querySelectorAll('label'));
    for (const label of labels) {
        if (label.textContent && label.textContent.trim().toLowerCase() === labelText.toLowerCase()) {
            const radio = label.querySelector('input[type="radio"]');
            if (radio) {
                radio.click(); // Use click() for React/Angular
                radio.focus();
                console.log('Clicked intensity radio for', labelText);
                break;
            }
        }
    }
}

function findFirstIntensityRadio() {
    const iframe = document.getElementById('frm1');
    if (!iframe) return null;
    let doc;
    try {
        doc = iframe.contentDocument || iframe.contentWindow.document;
    } catch (e) {
        return null;
    }
    // Find the label containing "Low" or "High" and get its radio button
    const labels = Array.from(doc.querySelectorAll('label'));
    for (const label of labels) {
        if (label.textContent && (label.textContent.trim().toLowerCase() === 'low' || label.textContent.trim().toLowerCase() === 'high')) {
            const radio = label.querySelector('input[type="radio"]');
            if (radio) {
                return radio;
            }
        }
    }
    return null;
}

function setSliderValue(sliderIndex, value) {
    const iframe = document.getElementById('frm1');
    if (!iframe) {
        console.error("Iframe 'frm1' not found.");
        return;
    }
    let doc;
    try {
        doc = iframe.contentDocument || iframe.contentWindow.document;
    } catch (e) {
        console.error("Could not access iframe content document.", e);
        return;
    }

    const sliderContainers = doc.querySelectorAll('.slider__container');
    if (sliderContainers.length <= sliderIndex) {
        console.error(`Could not find slider container with index ${sliderIndex} in the iframe.`);
        return;
    }

    const container = sliderContainers[sliderIndex];
    const numericValue = parseInt(value, 10);
    const valueIndex = numericValue - 1; // convert 1-5 to 0-4

    const nativeInput = container.querySelector('.slider__native-input');
    if (!nativeInput) {
        console.error(`Could not find native input for slider ${sliderIndex}.`);
        return;
    }

    // By programmatically setting the value and dispatching an 'input' event,
    // we trigger the framework's (likely React) own event handlers.
    // This updates the application's internal state, which should then
    // cause the framework to re-render the slider with the correct visuals.
    // This is more robust than manually changing the DOM, which gets overwritten.
    try {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(iframe.contentWindow.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(nativeInput, valueIndex.toString());

        // Dispatch 'input' and 'change' events to notify the framework
        const inputEvent = new iframe.contentWindow.Event('input', { bubbles: true });
        const changeEvent = new iframe.contentWindow.Event('change', { bubbles: true });
        
        nativeInput.dispatchEvent(inputEvent);
        nativeInput.dispatchEvent(changeEvent);

        console.log(`Programmatically set slider ${sliderIndex} to value ${value} and dispatched events to sync state.`);
    } catch(e) {
        console.error(`Failed to programmatically set value or dispatch event for slider ${sliderIndex}`, e);
    }
}

function findFirstSlider() {
    const iframe = document.getElementById('frm1');
    if (!iframe) return null;
    let doc;
    try {
        doc = iframe.contentDocument || iframe.contentWindow.document;
    } catch (e) {
        return null;
    }
    const slider = doc.querySelector('.slider__container');
    return slider;
}

function checkAdditionalInfoCheckbox(key) {
    const iframe = document.getElementById('frm1');
    if (!iframe) return;
    let doc;
    try {
        doc = iframe.contentDocument || iframe.contentWindow.document;
    } catch (e) {
        return;
    }
    // Map key to label text
    const labelMap = {
        'q': 'Background Voices',
        'w': 'Conversation',
        'e': 'Crying',
        'a': 'Driving',
        's': 'Laughing',
        'd': 'Singing',
        'z': 'Whispering',
        'x': 'Incomprehensible Speech',
        'c': 'Interrupted Speech',
        'v': 'Identifiable Background Sounds',
        'b': 'Unidentifiable Background Sounds'
    };
    const labelText = labelMap[key];
    if (!labelText) return;
    // Find the label containing the text and its associated checkbox
    const labels = Array.from(doc.querySelectorAll('label'));
    for (const label of labels) {
        if (label.textContent && label.textContent.trim().replace(/\s+/g, ' ').toLowerCase() === labelText.toLowerCase()) {
            const checkbox = label.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.click(); // Use click() for React/Angular
                checkbox.focus();
                console.log('Clicked additional info checkbox for', labelText);
                break;
            }
        }
    }
}

function findFirstAdditionalInfoCheckbox() {
    const iframe = document.getElementById('frm1');
    if (!iframe) return null;
    let doc;
    try {
        doc = iframe.contentDocument || iframe.contentWindow.document;
    } catch (e) {
        return null;
    }
    // This is a guess based on the key map in checkAdditionalInfoCheckbox
    const labelTextToFind = 'Background Voices'.toLowerCase();
    const labels = Array.from(doc.querySelectorAll('label'));
    for (const label of labels) {
        if (label.textContent && label.textContent.trim().replace(/\s+/g, ' ').toLowerCase() === labelTextToFind) {
            const checkbox = label.querySelector('input[type="checkbox"]');
            if (checkbox) {
                return checkbox;
            }
        }
    }
    return null;
}

function handleTriggerKeyPress(event) {
    // Press the submit button if Enter is pressed, regardless of the current mode
    if (event.key === '\n' || event.key === 'Enter') {
        const iframe = document.getElementById('frm1');
        if (iframe) {
            let doc;
            try {
                doc = iframe.contentDocument || iframe.contentWindow.document;
            } catch (e) {
                console.error('Error accessing iframe content for submit button.', e);
                return;
            }
            if (doc) {
                // Try to find the submit button by type or id or text
                let submitBtn = doc.querySelector('button[type="submit"], button#starshot_submit_button');
                if (!submitBtn) {
                    // Fallback: find button with text 'Submit'
                    submitBtn = Array.from(doc.querySelectorAll('button')).find(btn => btn.textContent.trim().toLowerCase() === 'submit');
                }
                if (submitBtn) {
                    submitBtn.click();
                    console.log('Submit button found and clicked.');
                    clearHighlight(); // Clear highlight on submit
                    // RESET automation state for new form
                    hasFilledOnTrigger = false;
                    triggerCount = 0;
                    lastTargetInput = null;
                    checkBoxMode = false;
                    radioMode = false;
                    intensityMode = false;
                    allSlidersMode = false;
                    sliderInputCount = 0;
                    additionalInfoMode = false;
                    console.log('Automation state reset after submit. Next ` will paste text as first trigger.');
                } else {
                    console.error('Submit button not found in iframe.');
                }
            }
        }
        event.preventDefault(); // Prevent default Enter key behavior
        return; // Stop further key processing
    }

    // ADDED: Click the play button if ' is pressed
    if (event.key === "'") {
        clickPlayButtonInIframe();
        event.preventDefault();
        return;
    }

    // NEW: Handle Shift + Backtick (~) to go back
    if (event.key === '~') {
        console.log('~ key pressed. Attempting to go back to the previous section.');

        if (additionalInfoMode) {
            additionalInfoMode = false;
            allSlidersMode = true;
            sliderInputCount = 0; // Reset to the start of sliders
            const firstSlider = findFirstSlider();
            if (firstSlider) highlightElementParent(firstSlider);
            console.log('Went back to slider mode.');
        } else if (allSlidersMode) {
            allSlidersMode = false;
            intensityMode = true;
            const firstIntensityRadio = findFirstIntensityRadio();
            if (firstIntensityRadio) highlightElementParent(firstIntensityRadio);
            console.log('Went back to intensity mode.');
        } else if (intensityMode) {
            intensityMode = false;
            radioMode = true;
            const firstRadio = focusFirstRadio();
            if (firstRadio) highlightElementParent(firstRadio);
            console.log('Went back to radio mode.');
        } else if (radioMode) {
            radioMode = false;
            checkBoxMode = true;
            const firstCheckbox = focusFirstCheckbox();
            if (firstCheckbox) highlightElementParent(firstCheckbox);
            console.log('Went back to checkbox mode.');
        } else if (checkBoxMode) {
            checkBoxMode = false;
            // Reset to the initial text box state
            const iframe = document.getElementById('frm1');
            if (iframe) {
                let doc = iframe.contentDocument || iframe.contentWindow.document;
                let inputs = doc.querySelectorAll('input[type="text"], textarea');
                if (inputs.length > 0) {
                    highlightElementParent(inputs[0]);
                    inputs[0].focus();
                }
            }
            console.log('Went back to text input mode.');
        }

        // Decrement trigger count to align with the state change
        if (triggerCount > 1) { // Only decrement if we are past the initial text fill state
            triggerCount -= 2; // Decrement to allow the next '`' to advance correctly
        }
        
        event.preventDefault();
        return;
    }

    console.log('[Iframe Listener] Key pressed:', event.key, 'Target:', event.target, 'checkBoxMode:', checkBoxMode, 'radioMode:', radioMode, 'intensityMode:', intensityMode, 'allSlidersMode:', allSlidersMode, 'sliderInputCount:', sliderInputCount, 'additionalInfoMode:', additionalInfoMode, 'triggerCount:', triggerCount, 'hasFilledOnTrigger:', hasFilledOnTrigger);
    if (event.key === '`') {
        triggerCount++;
        console.log('Backtick logic: checkBoxMode:', checkBoxMode, 'radioMode:', radioMode, 'intensityMode:', intensityMode, 'allSlidersMode:', allSlidersMode, 'additionalInfoMode:', additionalInfoMode, 'triggerCount:', triggerCount, 'hasFilledOnTrigger:', hasFilledOnTrigger);
        if (!checkBoxMode && !radioMode && !intensityMode && !allSlidersMode && !additionalInfoMode && (triggerCount === 2 || (hasFilledOnTrigger && triggerCount === 1))) {
            checkBoxMode = true;
            const firstCheckbox = focusFirstCheckbox();
            if (firstCheckbox) highlightElementParent(firstCheckbox);
            console.log('Entered checkbox mode. focusFirstCheckbox returned:', !!firstCheckbox, 'Press mapped keys to check emotions. Press ` again to continue.');
            event.preventDefault();
            return;
        } else if (checkBoxMode) {
            checkBoxMode = false;
            radioMode = true;
            const firstRadio = focusFirstRadio();
            if (firstRadio) highlightElementParent(firstRadio);
            console.log('Exited checkbox mode. Entered radio mode. focusFirstRadio returned:', !!firstRadio, 'Press mapped keys to check radios. Press ` again to continue.');
            event.preventDefault();
            return;
        } else if (radioMode) {
            radioMode = false;
            intensityMode = true;
            const firstIntensityRadio = findFirstIntensityRadio();
            if (firstIntensityRadio) highlightElementParent(firstIntensityRadio);
            console.log('Exited radio mode. Entered intensity mode. Press Q for Low, W for High. Press ` again to continue.');
            event.preventDefault();
            return;
        } else if (intensityMode) {
            intensityMode = false;
            allSlidersMode = true;
            sliderInputCount = 0;
            const firstSlider = findFirstSlider();
            if (firstSlider) highlightElementParent(firstSlider);
            console.log('Exited intensity mode. Entered slider mode. Press 1-5 for each of the three sliders. Press ` again to continue.');
            event.preventDefault();
            return;
        } else if (allSlidersMode) {
            allSlidersMode = false;
            additionalInfoMode = true;
            const firstAdditionalCheckbox = findFirstAdditionalInfoCheckbox();
            if (firstAdditionalCheckbox) highlightElementParent(firstAdditionalCheckbox);
            console.log('Exited slider mode. Entered additional info mode. Press mapped keys to check boxes. Press ` again to exit.');
            event.preventDefault();
            return;
        } else if (additionalInfoMode) {
            additionalInfoMode = false;
            triggerCount = 0;
            clearHighlight(); // Clear highlight when exiting all modes
            // Move focus away from any active element
            const iframe = document.getElementById('frm1');
            if (iframe && iframe.contentDocument && iframe.contentDocument.activeElement) {
                console.log('Blurring active element:', iframe.contentDocument.activeElement);
                iframe.contentDocument.activeElement.blur();
            }
            console.log('Exited arousal slider mode.');
            event.preventDefault();
            return;
        }
        // First backtick: fill the text box as before
        if (!hasFilledOnTrigger) {
            console.log('` key pressed. Attempting to fill text box.');
            if (findAndFillFirstTextBox()) {
                hasFilledOnTrigger = true;
                console.log('Text box filled. ` key will not fill again until F2 is pressed.');
                event.preventDefault();
            } else {
                console.log('Failed to fill text box on ` key press. Default behavior will occur.');
            }
        } else {
            console.log('` key pressed, but text box has already been filled for this session. Press F2 to re-arm. Default behavior will occur.');
        }
    } else if (checkBoxMode && 'qweasdzxc'.includes(event.key)) {
        console.log('Checkbox mode: key for emotion:', event.key);
        checkEmotionCheckbox(event.key);
        event.preventDefault();
        return;
    } else if (radioMode && 'qweasdzxc'.includes(event.key)) {
        console.log('Radio mode: key for emotion:', event.key);
        checkEmotionRadio(event.key);
        event.preventDefault();
        return;
    } else if (intensityMode && 'qw'.includes(event.key)) {
        console.log('Intensity mode: key for intensity:', event.key);
        checkIntensityRadio(event.key);
        event.preventDefault();
        return;
    } else if (allSlidersMode && '12345'.includes(event.key)) {
        if (sliderInputCount < 3) {
            console.log(`Slider mode: key for value: ${event.key} for slider ${sliderInputCount}`);
            setSliderValue(sliderInputCount, event.key);
            sliderInputCount++;
        }
        if (sliderInputCount >= 3) {
            console.log('All three sliders set. Press ` to continue to additional info mode.');
        }
        event.preventDefault();
        return;
    } else if (additionalInfoMode && 'qweasdzxcvb'.includes(event.key)) {
        console.log('Additional info mode: key for checkbox:', event.key);
        checkAdditionalInfoCheckbox(event.key);
        event.preventDefault();
        return;
    } else if (checkBoxMode) {
        console.log('Checkbox mode: unmapped key pressed:', event.key);
    } else if (radioMode) {
        console.log('Radio mode: unmapped key pressed:', event.key);
    } else if (intensityMode) {
        console.log('Intensity mode: unmapped key pressed:', event.key);
    } else if (allSlidersMode) {
        console.log('Slider mode: unmapped key pressed:', event.key);
    } else if (additionalInfoMode) {
        console.log('Additional info mode: unmapped key pressed:', event.key);
    } else if (event.key === '[') {
        // Paste ', pitch is low' at the end of the text box
        if (lastTargetInput) {
            updateTextboxValue(lastTargetInput, lastTargetInput.value + ', pitch is low.'); // MODIFIED
            console.log('Inserted ", pitch is low." into the text box.');
            event.preventDefault();
        }// Script is written by R.Roy
    } else if (event.key === ']') {
        // Paste ', pitch is moderate' at the end of the text box
        if (lastTargetInput) {
            updateTextboxValue(lastTargetInput, lastTargetInput.value + ', pitch is moderate.'); // MODIFIED
            console.log('Inserted ", pitch is moderate." into the text box.');
            event.preventDefault();
        }
    } else if (event.key === '\\') {
        // Paste ', pitch is high' at the end of the text box
        if (lastTargetInput) {
            updateTextboxValue(lastTargetInput, lastTargetInput.value + ', pitch is high.'); // MODIFIED
            console.log('Inserted ", pitch is high." into the text box.');
            event.preventDefault();
        }
    }
}

// MODIFIED: Now accepts targetWindow (iframe.contentWindow)
function setupTriggerEventListener(targetWindow) {
    if (triggerListenerSetupDone) {
        console.log('Trigger listener setup already done.');
        return;
    }
    if (!targetWindow) {
        console.error('Cannot setup trigger listener: targetWindow is null or undefined.');
        return;
    }

    console.log('Setting up backtick (`) key listener on IFRAME window for text box filling.');
    targetWindow.addEventListener('keydown', handleTriggerKeyPress);

    // ADDED: Additional direct listener for diagnostics on IFRAME window
    targetWindow.addEventListener('keydown', function(e) {
        console.log('[Direct Iframe Listener] Key down on iframe window:', e.key, 'Target:', e.target);
    });

    triggerListenerSetupDone = true;
    console.log('Script ready. Press backtick (`) IN THE IFRAME to fill the text box. Press F2 (on main page) to re-arm. Direct key logging also active.');
}

// ADDED: New function to click the play button, replacing the old automatic playback.
function clickPlayButtonInIframe() {
    const iframe = document.getElementById('frm1');
    if (!iframe || !iframe.contentWindow) return;
    try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        // This selector is a guess. It might need to be adjusted based on the actual HTML.
        const playButton = doc.querySelector('button[aria-label*="Play"], button[class*="play"], button:has(svg[class*="play"])');
        if (playButton) {
            playButton.click();
            console.log('Play button clicked via script.');
        } else {
            const audio = doc.querySelector('audio');
            if (audio) {
                audio.play().then(() => {
                    console.log('Audio playback started directly.');
                }).catch(error => {
                    console.error('Direct audio playback failed. This might be due to browser autoplay restrictions.', error);
                });
            } else {
                console.log('No play button or audio element found.');
            }
        }
    } catch (e) {
        console.error('Error trying to play audio.', e);
    }
}

function onIframeLoad() {
    const iframe = document.getElementById('frm1');
    if (!iframe) return;

    console.log('Iframe "frm1" has loaded its content. Setting up listeners.');
    if (iframe.contentWindow) {
        setupTriggerEventListener(iframe.contentWindow);
    } else {
        console.error('Iframe loaded, but contentWindow is not accessible.');
    }
}

function robustSetupIframeAndTriggerListener() {
    console.log('Attempting to find iframe "frm1" for listener and audio setup.');
    const iframe = document.getElementById('frm1');

    if (!iframe) {
        console.error('Iframe with id "frm1" not found. Setup cannot continue.');
        return;
    }

    console.log('Iframe "frm1" element found. Setting up load handler.');
    try {
        // This handler will run every time the iframe (re)loads.
        iframe.onload = onIframeLoad;
        iframe.onerror = () => {
            console.error('Iframe "frm1" failed to load its content.');
        };

        // If the iframe is already loaded, the 'onload' event won't fire for the current content,
        // so we need to run the setup function manually.
        if (iframe.contentWindow && iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
            console.log('Iframe "frm1" content already loaded. Running on-load logic now.');
            onIframeLoad();
        } else {
            console.log('Iframe "frm1" content not yet fully loaded. Waiting for onload event to fire.');
        }
    } catch (e) {
        console.error('Error accessing iframe "frm1" properties during setup, likely cross-origin.', e);
        console.log('If this is a cross-origin issue, the script may need to be injected differently (e.g., as a browser extension).');
    }
}

function initializeScript() {
    console.log('Initializing script for backtick (`) key-based text box filling...');
    if (document.readyState === 'loading') {
        console.log('Document is still loading. Waiting for DOMContentLoaded to setup iframe and trigger key listeners.');
        document.addEventListener('DOMContentLoaded', robustSetupIframeAndTriggerListener); // MODIFIED: Call renamed function
    } else {
        console.log('Document already loaded/interactive. Proceeding with iframe and trigger key listener setup.');
        robustSetupIframeAndTriggerListener(); // MODIFIED: Call renamed function
    }
}

document.addEventListener('keydown', function(event) {
    // Note: The F2 listener is separate from handleTriggerKeyPress
    if (event.key === 'F2') {
        console.log('F2 pressed. Backtick (`) key to fill is re-armed.');
        clearHighlight(); // Clear highlight on reset
        hasFilledOnTrigger = false;
        triggerCount = 0;
        checkBoxMode = false;
        radioMode = false;
        intensityMode = false;
        allSlidersMode = false;
        sliderInputCount = 0;
        additionalInfoMode = false;
        lastTargetInput = null;
        if (!triggerListenerSetupDone) {
            console.log('Trigger key listener was not active, attempting to set it up now.');
            robustSetupIframeAndTriggerListener(); // MODIFIED: Call renamed function
        }
        console.log('Backtick (`) key functionality re-armed. Press ` to attempt to fill the text box.');
    }
});

// Start the process
initializeScript();