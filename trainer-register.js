// trainer-register.js (FRONTEND) - calls Pages Function on same domain: /api/trainer/register

const form = document.getElementById("trainerForm");
const btn = document.getElementById("registerBtn");
const codeBox = document.getElementById("trainerCodeBox");
const codeEl = document.getElementById("trainerCode");

function el(id) {
  return document.getElementById(id);
}

function val(id) {
  const e = el(id);
  return e ? e.value.trim() : "";
}

function setDisabled(state) {
  form.querySelectorAll("input, button").forEach((x) => (x.disabled = state));
}

function validateEmail(email) {
  return typeof email === "string" && email.includes("@") && email.includes(".");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    firstName: val("firstName"),
    lastName: val("lastName"),
    email: val("email").toLowerCase(),
    mobile: val("mobile"),
    centerName: val("centerName"),
    tesdaNo: val("tesdaNo"),
    password: el("password") ? el("password").value : "",
    confirmPassword: el("confirmPassword") ? el("confirmPassword").value : "",
  };

  // validation
  if (
    !payload.firstName ||
    !payload.lastName ||
    !payload.email ||
    !payload.mobile ||
    !payload.centerName ||
    !payload.tesdaNo ||
    !payload.password ||
    !payload.confirmPassword
  ) {
    alert("Please complete all required fields.");
    return;
  }

  if (!validateEmail(payload.email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (payload.password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  if (payload.password !== payload.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // UI loading
  const oldBtnText = btn ? btn.textContent : "";
  if (btn) btn.textContent = "Registering...";
  setDisabled(true);

  try {
    // IMPORTANT: same-domain Pages Function (no workers.dev)
    const res = await fetch("/api/trainer/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        mobile: payload.mobile,
        centerName: payload.centerName,
        tesdaNo: payload.tesdaNo,
        password: payload.password,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setDisabled(false);
      if (btn) btn.textContent = oldBtnText || "Register Trainer";
      alert(data.error || "Registration failed.");
      return;
    }

    // success
    codeEl.textContent = data.trainerCode || "";
    codeBox.style.display = "block";

    if (btn) btn.textContent = "Registered";
    // keep disabled after success
  } catch (err) {
    setDisabled(false);
    if (btn) btn.textContent = oldBtnText || "Register Trainer";
    alert("Network error. Please try again.");
  }
});
