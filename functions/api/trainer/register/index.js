document.getElementById("student-enroll-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile-number").value;
    const trainerCode = document.getElementById("trainer-code").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validate password match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Check if mobile number is valid (example format: 09XXXXXXXXX)
    const mobilePattern = /09\d{9}/;
    if (!mobilePattern.test(mobile)) {
        alert("Invalid mobile number format!");
        return;
    }

    // Proceed with form submission (you can send this data to your backend here)
    alert("Student registered successfully!");

    // Only reset after success message (2 seconds delay)
    setTimeout(function() {
        document.getElementById("student-enroll-form").reset();
    }, 2000); // wait 2 seconds before resetting
});
