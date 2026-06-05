import { sendSingleEmail } from "@/lib/notification"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { name, email, message } = body

    console.log(body)

    const typeMessage = "New Contact Form Submission"

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">

          <div style="background: #111827; color: #ffffff; padding: 16px; font-size: 18px; font-weight: bold;">
            ${typeMessage}
          </div>

          <div style="padding: 20px; color: #111827;">
            <p style="margin-bottom: 12px;">You have received a new contact form submission from n0Render site:</p>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold;">Name:</td>
                <td style="padding: 8px;">${name}</td>
              </tr>

              <tr style="background: #f9fafb;">
                <td style="padding: 8px; font-weight: bold;">Email:</td>
                <td style="padding: 8px;">${email}</td>
              </tr>
            </table>

            <div style="margin-top: 20px;">
              <p style="font-weight: bold; margin-bottom: 6px;">Message:</p>
              <div style="padding: 12px; background: #f3f4f6; border-radius: 6px; line-height: 1.5;">
                ${message}
              </div>
            </div>
          </div>

          <div style="padding: 12px; font-size: 12px; text-align: center; color: #6b7280; border-top: 1px solid #e5e7eb;">
            n0Render Site • Auto-generated email
          </div>

        </div>
      </div>
    `

    await sendSingleEmail(htmlMessage, typeMessage, "tech@n0render.com")

    return NextResponse.json({
      success: true,
      message: "Form received successfully",
      htmlMessage,
    })
  } catch (error) {
    console.error("Form API Error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    )
  }
}