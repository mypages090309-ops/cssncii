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

    // Check duplicate email
    const existing = await env.DB
      .prepare("SELECT id FROM trainers WHERE email = ?")
      .bind(email)
      .first();

    if (existing) {
      return Response.json({ error: "Email already registered." }, { status: 400 });
    }

    // Insert trainer
    await env.DB
      .prepare(`
        INSERT INTO trainers 
        (first_name, last_name, email, mobile, center_name, tesda_no, password)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(firstName, lastName, email, mobile, centerName, tesdaNo, password)
      .run();

    return Response.json({ success: true });

  } catch (err) {
    return Response.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
