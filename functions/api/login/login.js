// login.js - Handle login for Student and Trainer

const bcrypt = require("bcryptjs"); // Use bcrypt for password hashing and comparison

module.exports = async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Try to find user in Trainer table
  let user = await findTrainerByEmail(email);

  // If not found, try Student table
  if (!user) {
    user = await findStudentByEmail(email);
  }

  // If no user found in either table, return error
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Compare password with stored hash
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Return the role of the user
  return res.status(200).json({ success: true, role: user.role });
};

// Function to find a trainer by email
async function findTrainerByEmail(email) {
  // Mocked DB lookup for trainer
  return await db.select("*").from("trainers").where("email", email).first();
}

// Function to find a student by email
async function findStudentByEmail(email) {
  // Mocked DB lookup for student
  return await db.select("*").from("students").where("email", email).first();
}
