const form = document.getElementById("enrollForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    mobile: document.getElementById("mobile").value,
    trainerCode: document.getElementById("trainerCode").value,
    password: document.getElementById("password").value
  };

  try {
    const res = await fetch(
      "https://cssncii-api.nextwavehub01.workers.dev/api/student/enroll", // Use the correct endpoint for enrollment
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );

    const result = await res.json();

    if (res.ok) {
      alert("Enrollment successful! Student Code: " + result.studentCode);
      form.reset(); // Reset the form after successful submission
    } else {
      alert(result.error || "Enrollment failed.");
    }

  } catch (err) {
    alert("Server error.");
    console.error(err);
  }
});
