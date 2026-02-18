// student-enroll.js

// ✅ Palitan kung iba ang Worker domain mo
const API_BASE = "https://cssncii-api.nextwavehub01.workers.dev";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("studentEnrollForm");
  const msg = document.getElementById("formMsg");
  const btn = document.getElementById("btnSubmit");

  function setMsg(text, ok = false) {
    msg.textContent = text;
    msg.style.marginTop = "12px";
    msg.style.fontWeight = "600";
    msg.style.color = ok ? "#16a34a" : "#dc2626";
  }

  function normalizeMobile(m) {
    return (m || "").trim();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg("");

    const firstName = (document.getElementById("firstName").value || "").trim();
    const lastName = (document.getElementById("lastName").value || "").trim();
    const email = (document.getElementById("email").value || "").trim().toLowerCase();
    const mobile = normalizeMobile(document.getElementById("mobile").value);
    const trainerCode = (document.getElementById("trainerCode").value || "").trim().toUpperCase();

    if (!firstName || !lastName || !email || !mobile || !trainerCode) {
      setMsg("Pakikumpleto lahat ng fields.");
      return;
    }

    if (!email.includes("@")) {
      setMsg("Invalid email.");
      return;
    }

    // simple PH mobile check
    if (!/^09\d{9}$/.test(mobile)) {
      setMsg("Mobile format dapat 09XXXXXXXXX.");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Submitting...";

    try {
      const res = await fetch(`${API_BASE}/api/student/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, mobile, trainerCode }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data.error || "Enrollment failed.");
        return;
      }

      // ✅ adjust ito depende sa response ng backend mo
      // example: { success:true, studentId:"ST-...", trainerCode:"TR-..." }
      const info = data.studentId ? ` Student ID: ${data.studentId}` : "";
      setMsg(`Enrollment successful!${info}`, true);

      // optional reset
      form.reset();
    } catch (err) {
      setMsg("Network error. Subukan ulit.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Enroll Student";
    }
  });
});
