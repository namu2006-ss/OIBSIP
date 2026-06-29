/* =========================================================
   Temperature Converter — script.js
   Beginner-friendly, fully commented JavaScript.
   Handles: input validation, conversions, reset, UI updates.
========================================================= */

// ---------- Step 1: Grab all the elements we need from the page ----------
const tempInput      = document.getElementById("tempInput");
const conversionType  = document.getElementById("conversionType");
const convertBtn      = document.getElementById("convertBtn");
const resetBtn        = document.getElementById("resetBtn");
const messageBox      = document.getElementById("messageBox");
const resultValue     = document.getElementById("resultValue");

// ---------- Step 2: Helper function to show error messages ----------
function showError(text) {
  messageBox.textContent = text;
  messageBox.className = "message-box show-error"; // reset classes + add error style

  // Add a little shake animation to the input box to draw attention
  tempInput.classList.add("shake");
  setTimeout(() => tempInput.classList.remove("shake"), 400);
}

// ---------- Step 3: Helper function to show success messages ----------
function showSuccess(text) {
  messageBox.textContent = text;
  messageBox.className = "message-box show-success";
}

// ---------- Step 4: Helper function to clear any messages ----------
function clearMessage() {
  messageBox.textContent = "";
  messageBox.className = "message-box";
}

// ---------- Step 5: The actual temperature conversion formulas ----------
function convertTemperature(value, type) {
  // 'value' is a number, 'type' tells us which conversion to perform
  switch (type) {
    case "CtoF": // Celsius to Fahrenheit
      return (value * 9) / 5 + 32;

    case "FtoC": // Fahrenheit to Celsius
      return ((value - 32) * 5) / 9;

    case "CtoK": // Celsius to Kelvin
      return value + 273.15;

    case "KtoC": // Kelvin to Celsius
      return value - 273.15;

    case "FtoK": // Fahrenheit to Kelvin
      return ((value - 32) * 5) / 9 + 273.15;

    case "KtoF": // Kelvin to Fahrenheit
      return ((value - 273.15) * 9) / 5 + 32;

    default:
      return null; // should never happen, but just in case
  }
}

// ---------- Step 6: Helper to get the correct unit label for the result ----------
function getResultUnit(type) {
  // The unit of the OUTPUT depends on what we're converting TO
  if (type.endsWith("toF")) return "°F";
  if (type.endsWith("toC")) return "°C";
  if (type.endsWith("toK")) return "K";
  return "";
}

// ---------- Step 7: Helper to validate Kelvin can't go below absolute zero ----------
function isBelowAbsoluteZero(value, type) {
  // Absolute zero limits per scale (the INPUT scale)
  if (type.startsWith("K") && value < 0) return true;       // Kelvin can't be negative
  if (type.startsWith("C") && value < -273.15) return true; // Celsius limit
  if (type.startsWith("F") && value < -459.67) return true; // Fahrenheit limit
  return false;
}

// ---------- Step 8: Main function that runs when "Convert" is clicked ----------
function handleConvert() {
  clearMessage();

  const rawValue = tempInput.value.trim();
  const type = conversionType.value;

  // --- Validation 1: Check if the field is empty ---
  if (rawValue === "") {
    showError("⚠️ Please enter a temperature value.");
    resultValue.textContent = "--";
    return;
  }

  // --- Validation 2: Check if the value is a valid number ---
  const numericValue = Number(rawValue);
  if (Number.isNaN(numericValue)) {
    showError("⚠️ Please enter a valid number (e.g. 25 or -10.5).");
    resultValue.textContent = "--";
    return;
  }

  // --- Validation 3: Check for physically impossible temperatures ---
  if (isBelowAbsoluteZero(numericValue, type)) {
    showError("⚠️ That temperature is below absolute zero. Please re-check the value.");
    resultValue.textContent = "--";
    return;
  }

  // --- All validations passed: perform the conversion ---
  const converted = convertTemperature(numericValue, type);
  const roundedResult = converted.toFixed(2); // round to 2 decimal places
  const unit = getResultUnit(type);

  // --- Update the result display with a nice pop animation ---
  resultValue.textContent = `${roundedResult} ${unit}`;
  resultValue.classList.remove("animate-pop"); // reset animation
  // Tiny delay to re-trigger animation even on repeated conversions
  requestAnimationFrame(() => {
    resultValue.classList.add("animate-pop");
  });

  showSuccess("✅ Conversion successful!");
}

// ---------- Step 9: Function that runs when "Reset" is clicked ----------
function handleReset() {
  tempInput.value = "";
  conversionType.selectedIndex = 0;
  resultValue.textContent = "--";
  resultValue.classList.remove("animate-pop");
  clearMessage();
  tempInput.focus();
}

// ---------- Step 10: Attach event listeners ----------
convertBtn.addEventListener("click", handleConvert);
resetBtn.addEventListener("click", handleReset);

// Allow pressing "Enter" inside the input field to trigger conversion
tempInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    handleConvert();
  }
});

// Clear error messages as soon as the user starts typing again
tempInput.addEventListener("input", () => {
  if (messageBox.classList.contains("show-error")) {
    clearMessage();
  }
});
