document.addEventListener("DOMContentLoaded", function() {
  const togglePasswordButton = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("passwordInput");

  // Toggle password visibility
  togglePasswordButton.addEventListener("click", function() {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    togglePasswordButton.textContent = type === "password" ? "👁️" : "🔒";
  });

  const loginForm = document.getElementById("loginForm");
  const loginBtn = document.getElementById("loginBtn");
  const loginError = document.getElementById("loginError");

  loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    loginBtn.querySelector(".spinner").style.display = "inline-block";

    const email = loginForm.querySelector("input[type=email]").value;
    const password = loginForm.querySelector("input[type=password]").value;

    // Send login request to Cloudflare Worker API endpoint
    const response = await fetch("https://cssncii-7et.pages.dev/api/login", { // Make sure this URL is correct
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
      // Redirect based on role (trainer or student)
      if (result.role === 'trainer') {
        window.location.href = "trainer-dashboard.html";  // Redirect to Trainer's Dashboard
      } else if (result.role === 'student') {
        window.location.href = "student-dashboard.html";  // Redirect to Student's Dashboard
      }
    } else {
      // On failed login, show error message
      loginError.textContent = result.error || "An error occurred";
      loginError.style.display = "block";
    }

    loginBtn.querySelector(".spinner").style.display = "none";
  });
});
