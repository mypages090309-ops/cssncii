const form = document.getElementById("trainerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    mobile: document.getElementById("mobile").value,
    centerName: document.getElementById("centerName").value,
    tesdaNo: document.getElementById("tesdaNo").value,
    password: document.getElementById("password").value
  };

  try {
    const res = await fetch(
      "https://cssncii-api.nextwavehub01.workers.dev/api/trainer/register",
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
      alert("Registration successful! Trainer Code: " + result.trainerCode);
      form.reset();
    } else {
      alert(result.error || "Registration failed.");
    }

  } catch (err) {
    alert("Server error.");
    console.error(err);
  }
});
