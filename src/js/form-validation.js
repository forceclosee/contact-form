const form = document.querySelector(".contact-form");
const successAlert = document.querySelector(".success-alert");

export function validateInput(inputElement) {
  // 2. Cari tempat pesan error secara dinamis
  // Khusus untuk radio button, gunakan 'name' (karena dalam satu grup). Selain itu gunakan 'id'.
  const identifier =
    inputElement.type === "radio" ? inputElement.name : inputElement.id;
  const errorElement = document.querySelector(`#error-${identifier}`);

  // Jika input tidak punya tempat error (misal tombol atau checkbox tertentu), lewati
  if (!errorElement) return true;

  // 3. Evaluasi menggunakan Constraint Validation API
  if (!inputElement.validity.valid) {
    // 4. Tentukan pesan error mana yang muncul berdasarkan jenis kesalahannya
    if (inputElement.validity.valueMissing) {
      errorElement.textContent = inputElement.dataset.errorValue;
    } // Validation khusus email
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
    errorElement.textContent = "";
    return true;
  }
}

// ==========================================
// EVENT LISTENERS UMUM UNTUK SEMUA FORM
// ==========================================

// Validasi saat pengguna mengetik secara live (hanya jika sebelumnya sudah disentuh/blur)
form.addEventListener("input", (e) => {
  if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
    validateInput(e.target);
  }
});

// Validasi saat klik submit (hanya loop yang error)
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Validasi form keseluruhan menggunakan C++ bawaan browser
  if (!form.checkValidity()) {
    const errorInputs = form.querySelectorAll(":invalid");

    errorInputs.forEach((input) => {
      validateInput(input); // Tampilkan pesan errornya
    });

    // UX: Auto-focus ke input pertama yang error
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
