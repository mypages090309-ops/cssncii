export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();

    const firstName = (body.firstName || "").trim();
    const lastName = (body.lastName || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const mobile = (body.mobile || "").trim();
    const trainerCode = (body.trainerCode || "").trim().toUpperCase();
    const password = body.password || "";

    if (!firstName || !lastName || !email || !mobile || !trainerCode || !password) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!email.includes("@")) {
      return Response.json({ error: "Invalid email." }, { status: 400 });
    }

    // check trainer exists
    const trainer = await env.DB
      .prepare("SELECT id FROM trainers WHERE trainer_code = ?")
      .bind(trainerCode)
      .first();

    if (!trainer) {
      return Response.json({ error: "Invalid Trainer Code." }, { status: 400 });
    }

    // check duplicate student email
    const existing = await env.DB
      .prepare("SELECT id FROM students WHERE email = ?")
      .bind(email)
      .first();

    if (existing) {
      return Response.json({ error: "Email already registered." }, { status: 400 });
    }

    // generate student code
    const studentCode = "ST-" + crypto.randomUUID().slice(0, 6).toUpperCase();

    // hash password
    const { hash, salt } = await hashPassword(password);

    // insert student
    await env.DB.prepare(`
      INSERT INTO students
      (first_name, last_name, email, mobile, student_code, trainer_id, password_hash, password_salt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(firstName, lastName, email, mobile, studentCode, trainer.id, hash, salt)
      .run();

    return Response.json({ success: true, studentCode });

  } catch (err) {
    return Response.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}

// ===== password hashing (PBKDF2) =====
async function hashPassword(password) {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const salt = btoa(String.fromCharCode(...saltBytes));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );

  const hashBytes = new Uint8Array(bits);
  const hash = btoa(String.fromCharCode(...hashBytes));

  return { hash, salt };
}
