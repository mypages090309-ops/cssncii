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
    loginBtn.disabled = true;  // Disable the login button while the request is processing

    const email = loginForm.querySelector("input[type=email]").value;
    const password = loginForm.querySelector("input[type=password]").value;

    // Send login request to Cloudflare Worker API endpoint
    try {
      const response = await fetch("https://cssncii-api.nextwavehub01.workers.dev/api/login", {  // Palitan ito ng tamang URL ng iyong Cloudflare Worker API
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
    } catch (error) {
      // Handle any errors that occur during the fetch request
      console.error("Login request failed:", error);
      loginError.textContent = "There was an error connecting to the server. Please try again.";
      loginError.style.display = "block";
    }

    loginBtn.querySelector(".spinner").style.display = "none";
    loginBtn.disabled = false;  // Re-enable the login button after request
  });
});
