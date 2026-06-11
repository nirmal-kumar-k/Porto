import type { VercelRequest, VercelResponse } from "@vercel/node"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

/** Very simple server-side validation mirroring the client */
function validate(body: Record<string, unknown>) {
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const errors: string[] = []
  if (!body.name || typeof body.name !== "string" || !body.name.trim())
    errors.push("name is required")
  if (!body.email || typeof body.email !== "string" || !emailRe.test(body.email))
    errors.push("valid email is required")
  if (
    !body.message ||
    typeof body.message !== "string" ||
    body.message.trim().length < 10
  )
    errors.push("message must be at least 10 characters")
  return errors
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const body = req.body as Record<string, unknown>
  const errors = validate(body)
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(", ") })
  }

  const toEmail = process.env.CONTACT_TO_EMAIL
  if (!toEmail || !process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY or CONTACT_TO_EMAIL env vars")
    return res.status(500).json({ error: "Server misconfiguration" })
  }

  const name = (body.name as string).trim()
  const email = (body.email as string).trim()
  const message = (body.message as string).trim()

  try {
    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [toEmail],
      replyTo: email,
      subject: `[Portfolio] New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#d7b56d;border-bottom:1px solid #333;padding-bottom:12px">
            New contact form submission
          </h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
          <p style="white-space:pre-wrap">${message}</p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return res.status(500).json({ error: "Failed to send message" })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error("Unexpected error:", err)
    return res.status(500).json({ error: "Failed to send message" })
  }
}
