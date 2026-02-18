export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();

    const firstName = (body.firstName || "").trim();
    const lastName = (body.lastName || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const mobile = (body.mobile || "").trim();
    const trainerCode = (body.trainerCode || "").trim();
    const password = body.password || "";

    if (!firstName || !lastName || !email || !mobile || !trainerCode || !password) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!email.includes("@")) {
      return Response.json({ error: "Invalid email." }, { status: 400 });
    }

    // 1) Hanapin kung existing ang trainer code
    // NOTE: Dapat sa trainers table may column na trainer_code
    const trainer = await env.DB
      .prepare("SELECT id, trainer_code FROM trainers WHERE trainer_code = ?")
      .bind(trainerCode)
      .first();

    if (!trainer) {
      return Response.json({ error: "Invalid trainer code." }, { status: 400 });
    }

    // 2) Prevent duplicate student email (optional pero recommended)
    const existingStudent = await env.DB
      .prepare("SELECT id FROM students WHERE email = ?")
      .bind(email)
      .first();

    if (existingStudent) {
      return Response.json({ error: "Email already registered." }, { status: 400 });
    }

    // 3) Insert student
    // NOTE: Dapat may students table
    const result = await env.DB
      .prepare(`
        INSERT INTO students (trainer_id, first_name, last_name, email, mobile, password)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind(trainer.id, firstName, lastName, email, mobile, password)
      .run();

    return Response.json({
      success: true,
      message: "Enrollment successful! Pwede ka na mag-login.",
      studentId: result?.meta?.last_row_id ?? null,
    });
  } catch (err) {
    return Response.json(
      { error: "Server error", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
