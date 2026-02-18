export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle login POST request
    if (url.pathname === "/api/login" && request.method === "POST") {
      try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
          console.log("Missing email or password.");
          return json({ error: "Email and password are required" }, 400);
        }

        // Simulating database query
        const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
        if (!user) {
          console.log("User not found.");
          return json({ error: "Invalid credentials" }, 401);
        }

        // Simulating password validation (you can use bcrypt here for actual password comparison)
        const isPasswordValid = password === user.password; // Replace with bcrypt comparison
        if (!isPasswordValid) {
          console.log("Invalid password.");
          return json({ error: "Invalid credentials" }, 401);
        }

        // Return success response
        return json({ success: true, role: user.role }, 200);
        
      } catch (error) {
        console.log("Error in login process:", error);
        return json({ error: "Internal Server Error", details: error.message }, 500);
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};

// Utility function to send JSON response
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
