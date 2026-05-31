const formWrapper = document.querySelector(".form-wrapper");
const form = document.querySelector(".contact-form");
const successAlert = document.querySelector(".success-alert");

function validateInput(inputElement) {
  // 2. Find error message container dynamically
  // Specifically for radio buttons, use 'name' (because they are grouped). Otherwise, use 'id'.
  const identifier =
    inputElement.type === "radio" ? inputElement.name : inputElement.id;
  const errorElement = document.querySelector(`#error-${identifier}`);

  // If the input doesn't have an error container, skip it
  if (!errorElement) return true;

  // 3. Evaluate using Constraint Validation API
  if (!inputElement.validity.valid) {
    // 4. Determine which error message appears based on the type of error
    if (inputElement.validity.valueMissing) {
      errorElement.textContent = inputElement.dataset.errorValue;
    } // Specific email validation
    else if (
      inputElement.type === "email" &&
      inputElement.validity.typeMismatch &&
      !inputElement.value.includes("@")
    ) {
      errorElement.textContent = inputElement.dataset.errorType;
    } else if (
      inputElement.validity.typeMismatch ||
      inputElement.validity.patternMismatch
    ) {
      errorElement.textContent = inputElement.dataset.errorPattern;
    } else if (inputElement.validity.tooShort) {
      errorElement.textContent = inputElement.dataset.errorShort;
    }
    return false;
  } else {
    return true;
  }
}

// ==========================================
// GENERAL EVENT LISTENERS FOR ALL FORMS
// ==========================================

// Validate as the user types live
form.addEventListener("input", (e) => {
  if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
    validateInput(e.target);
  }
});

// Validate on submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Overall form validation using browser's built-in validation
  if (!form.checkValidity()) {
    const errorInputs = form.querySelectorAll(":invalid");

    errorInputs.forEach((input) => {
      validateInput(input); // Display the error message
    });

    // shake animations
    formWrapper.classList.add("animate-shake");
    setTimeout(() => {
      formWrapper.classList.remove("animate-shake");
    }, 500);

    // UX: Auto-focus on the first input with an error
    if (errorInputs.length > 0) {
      errorInputs[0].focus();
    }
  } else {
    form.reset();
    successAlert.setAttribute("aria-hidden", "false");
    setTimeout(() => {
      successAlert.setAttribute("aria-hidden", "true");
    }, 5000);
  }
});
