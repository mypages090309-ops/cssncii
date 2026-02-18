(() => {
  const form = document.getElementById("studentEnrollForm");
  const statusEl = document.getElementById("status");
  const btn = document.getElementById("enrollBtn");

  function setStatus(msg) {
    statusEl.textContent = msg || "";
  }

  function normalizeMobile(mobile) {
    return (mobile || "").trim();
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

    // basic validation
    if (!firstName || !lastName || !email || !mobile || !trainerCode || !password || !confirmPassword) {
      setStatus("Pakicomplete lahat ng fields.");
      return;
    }

    if (!email.includes("@")) {
      setStatus("Invalid email.");
      return;
    }

    if (password.length < 6) {
      setStatus("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("Hindi magkapareho ang password at confirm password.");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Enrolling...";

    try {
      const res = await fetch("/api/student/enroll", {
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
        setStatus(data?.error || "Enrollment failed.");
        return;
      }

      // success
      const studentCode = data?.studentCode || "";
      alert(`Enrollment successful! Student Code: ${studentCode}`);
      setStatus(`Enrollment successful! Student Code: ${studentCode}`);

      // optional: redirect to login after success
      // window.location.href = "/login.html";

      form.reset();
    } catch (err) {
      setStatus("Server error. Pakitry ulit.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Enroll";
    }
  });
})();
