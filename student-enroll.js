// student-enroll.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("studentForm");
  const msg = document.getElementById("msg"); // optional message div

  if (!form) {
    console.error("Form not found: #studentForm");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim().toLowerCase(),
      mobile: document.getElementById("mobile").value.trim(),
      trainerCode: document.getElementById("trainerCode").value.trim().toUpperCase(),
      password: document.getElementById("password").value,
      confirmPassword: document.getElementById("confirmPassword").value,
    };

    // Check if passwords match
    if (payload.password !== payload.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Validation for required fields
    const requiredFields = ["firstName", "lastName", "email", "mobile", "trainerCode", "password"];
    for (let field of requiredFields) {
      if (!payload[field]) {
        alert(`Please fill out the ${field}.`);
        return;
      }
    }

    try {
      if (msg) msg.textContent = "Registering...";

      // Send data to the backend API
      const res = await fetch("https://cssncii-api.nextwavehub01.workers.dev/api/student/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // Handle response from the server
      if (res.ok && data.success) {
        const successMsg = `Student successfully enrolled! Student ID: ${data.studentId}`;
        if (msg) msg.textContent = successMsg;
        alert(successMsg);
        form.reset();
      } else {
        const errorMsg = data?.error || "Enrollment failed.";
        if (msg) msg.textContent = errorMsg;
        alert(errorMsg);
      }
    } catch (err) {
      console.error(err);
      if (msg) msg.textContent = "Network or server error.";
      alert("Network or server error.");
    }
  });
});
