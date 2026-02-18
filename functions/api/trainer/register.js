export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();

    const firstName = (body.firstName || "").trim();
    const lastName = (body.lastName || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const mobile = (body.mobile || "").trim();
    const centerName = (body.centerName || "").trim();
    const tesdaNo = (body.tesdaNo || "").trim();
    const password = body.password || "";

    if (!firstName || !lastName || !email || !mobile || !centerName || !tesdaNo || !password) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!email.includes("@")) {
      return Response.json({ error: "Invalid email." }, { status: 400 });
    }

    // check duplicate email
    const existing = await env.DB
      .prepare("SELECT id FROM trainers WHERE email = ? LIMIT 1")
      .bind(email)
      .first();

    if (existing) {
      return Response.json({ error: "Email already registered." }, { status: 409 });
    }

    // generate unique trainer code
    let trainerCode = "";
    for (let i = 0; i < 5; i++) {
      trainerCode = "TR-" + crypto.randomUUID().slice(0, 6).toUpperCase();

      const codeExists = await env.DB
        .prepare("SELECT id FROM trainers WHERE trainer_code = ? LIMIT 1")
        .bind(trainerCode)
        .first();

      if (!codeExists) break;

      if (i === 4) {
        return Response.json({ error: "Failed to generate unique trainer code." }, { status: 500 });
      }
    }

    const passwordHash = await sha256Hex(password);

    await env.DB.prepare(`
      INSERT INTO trainers (
        trainer_code, first_name, last_name, email, mobile, center_name, tesda_no, password_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(trainerCode, firstName, lastName, email, mobile, centerName, tesdaNo, passwordHash)
      .run();

    return Response.json({ success: true, trainerCode });
  } catch (err) {
    return Response.json(
      { error: "Registration failed.", details: String(err) },
      { status: 500 }
    );
  }
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
