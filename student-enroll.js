(function () {
  const form = document.getElementById("studentEnrollForm");
  const statusEl = document.getElementById("status");
  const btn = document.getElementById("enrollBtn");

  function setStatus(msg, type = "info") {
    statusEl.textContent = msg || "";
    statusEl.className = "status " + type; // status info | ok | error
  }

  function normalizeMobile(mobile) {
    return (mobile || "").trim().replace(/\s+/g, "");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("");

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const mobile = normalizeMobile(document.getElementById("mobile").value);
    const trainerCode = document.getElementById("trainerCode").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validation checks
    if (!firstName || !lastName || !email || !mobile || !trainerCode || !password) {
      setStatus("Paki kumpletuhin lahat ng fields.", "error");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("Hindi magkapareho ang password at confirm password.", "error");
      return;
    }

    // PH mobile: 09 + 9 digits = 11 chars total
    if (!/^09\d{9}$/.test(mobile)) {
      setStatus("Invalid mobile format. Dapat 09XXXXXXXXX.", "error");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Enrolling...";
    setStatus("Nag-eenroll...");

    try {
      // IMPORTANT: Ensure the correct API URL
      const res = await fetch("https://cssncii-api.nextwavehub01.workers.dev/api/student/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          mobile,
          trainerCode,
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus(data?.error || "Enrollment failed.", "error");
        return;
      }

      // success
      const msg = data?.message || "Enrollment successful!";
      setStatus(msg, "ok");
      alert(msg);

      form.reset();
    } catch (err) {
      setStatus("Server error / network error. Pakisubukan ulit.", "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Enroll";
    }
  });
})();
