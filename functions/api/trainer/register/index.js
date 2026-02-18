document.getElementById("studentEnrollForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const trainerCode = document.getElementById("trainerCode").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validate password match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Check if mobile number is valid
    const mobilePattern = /09\d{9}/;
    if (!mobilePattern.test(mobile)) {
        alert("Invalid mobile number format!");
        return;
    }

    // Proceed with form submission (you can send this data to your backend here)
    alert("Student registered successfully!");

    // Reset form after successful submission
    document.getElementById("studentEnrollForm").reset();
});
