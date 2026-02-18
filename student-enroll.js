// student-enroll.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("studentForm");
  const msg = document.getElementById("msg");

  if (!form) {
    console.error("Form not found: #studentForm");
    return;
  }

  const setMsg = (text) => {
    if (msg) msg.textContent = text || "";
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("");

    const payload = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim().toLowerCase(),
      mobile: document.getElementById("mobile").value.trim(),
      trainerCode: document.getElementById("trainerCode").value.trim().toUpperCase(),
      password: document.getElementById("password").value,
      confirmPassword: document.getElementById("confirmPassword").value,
    };

    // Basic required checks
    const required = ["firstName","lastName","email","mobile","trainerCode","password","confirmPassword"];
    for (const k of required) {
      if (!payload[k]) {
        alert("Pakilagyan lahat ng required fields.");
        return;
      }
    }

    if (payload.password !== payload.confirmPassword) {
      alert("Hindi magkapareho ang password at confirm password.");
      return;
    }

    // Optional: simple PH mobile check
    if (!/^09\d{9}$/.test(payload.mobile)) {
      alert("Invalid mobile number. Dapat 09XXXXXXXXX.");
      return;
    }

    try {
      setMsg("Nag-eenroll...");

      // NOTE: naka-route na kayo sa Worker via /api/*
      // kaya pwede na relative URL:
      const res = await fetch("/api/student/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        const txt = `Enrollment successful! Student Code: ${data.studentCode || data.studentId || ""}`.trim();
        setMsg(txt);
        alert(txt);
        form.reset();
      } else {
        const err = data.error || "Enrollment failed.";
        setMsg(err);
        alert(err);
      }
    } catch (error) {
      console.error(error);
      setMsg("Network/server error.");
      alert("Network/server error.");
    }
  });
});
