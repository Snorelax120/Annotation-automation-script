# Annotation Automation Script Manual

## 1. Goal

This script is designed to accelerate the annotation workflow for the given web form. It automates filling the form by using keyboard shortcuts to cycle through different input fields and select options, reducing the need for mouse interaction.

## 2. How to Use

1.  Open the /task webpage.
2.  Open the browser's developer console (usually by pressing `F12` or `Cmd+Option+I` on Mac or by right-clicking white space, clicking inspect and then console.).
3.  Copy the entire content of the script.
4.  Paste the script (you might need to type "allow pasting" into the console if it tells you to) into the console(select "console" from the top, next to "elements") and make sure it says "top" and not "frm1 Task-editor" and press `Enter`.

5.  Click inside the form to ensure it has focus. The script is now active.

## 3. The Annotation Workflow

The script uses a state machine controlled primarily by the backtick ( ` ) key. Each press of the backtick key moves you to the next stage of the form.

**Press `F2` at any time to reset the entire script and start over from Step 1.**

| Step | Action | Keys | Description |
| :--- | :--- | :--- | :--- |
| 1 | **Start & Fill Textbox** | `` ` `` (first press) | Automatically finds the main text box and types `"The speakers tone is "`. |
| 2 | **Add Pitch Info** | `[` `]` `\` | (Optional) At any time, you can add pitch information to the text box: `[` for low, `]` for moderate, and `\` for high. |
| 3 | **Select Emotions** | `` ` `` (second press) | Enters "Emotion Checkbox Mode". |
| | | `qweasdzxc` | Press the corresponding keys to check one or more emotions. |
| 4 | **Select Prominent Emotion** | `` ` `` (third press) | Enters "Prominent Emotion Radio Mode". |
| | | `qweasdzxc` | Press the corresponding key to select the single most prominent emotion. |
| 5 | **Select Intensity** | `` ` `` (fourth press) | Enters "Intensity Radio Mode". |
| | | `q` or `w` | Press `q` for "Low" intensity or `w` for "High" intensity. |
| 6 | **Set All Sliders** | `` ` `` (fifth press) | Enters "Slider Mode" for all three sliders (Confidence, Positivity, Arousal). |
| | | `1`-`5` (x3) | Press a number from 1 to 5 for the first slider, then again for the second, and a third time for the third. |
| 7 | **Select Additional Info** | `` ` `` (sixth press) | Enters "Additional Info Checkbox Mode". |
| | | `qweasdzxcvb` | Press the corresponding keys to check one or more boxes. |
| 8 | **Finish** | `` ` `` (seventh press) | Exits all modes. The script is now idle. |
| 9 | **Submit Form** | `Enter` | Clicks the "Submit" button and automatically resets the script for the next annotation task. |

## 4. Key Mappings Quick Reference

### Main Controls
| Key | Action |
| :--- | :--- |
| `` ` `` | Cycle through input modes (Textbox -> Emotions -> Sliders -> etc.). |
| `F2` | Reset the script state for a new annotation. |
| `Enter` | Submit the form and reset. |

### Mode-Specific Keys

| Mode | Keys | Action |
| :--- | :--- | :--- |
| **Pitch** | `[` | Add ", pitch is low." |
| | `]` | Add ", pitch is moderate." |
| | `\` | Add ", pitch is high." |
| **Emotions (Checkboxes & Radios)** | `q` | Anger |
| | `w` | Contempt |
| | `e` | Disgust |
| | `a` | Fear |
| | `s` | Sadness |
| | `d` | Surprise |
| | `z` | Happiness |
| | `x` | Tenderness |
| | `c` | Calm/Content |
| **Intensity (Radios)** | `q` | Low |
| | `w` | High |
| **Sliders (Confidence, Positivity, Arousal)** | `1`-`5` | Set slider value. |
| **Additional Info (Checkboxes)** | `q` | Background Voices |
| | `w` | Conversation |
| | `e` | Crying |
| | `a` | Driving |
| | `s` | Laughing |
| | `d` | Singing |
| | `z` | Whispering |
| | `x` | Incomprehensible Speech |
| | `c` | Interrupted Speech |
| | `v` | Identifiable Background Sounds |
| | `b` | Unidentifiable Background Sounds |
