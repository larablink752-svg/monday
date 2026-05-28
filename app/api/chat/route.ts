import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, chatInput } = body;

    if (!sessionId || !chatInput) {
      return NextResponse.json(
        { error: "sessionId and chatInput are required." },
        { status: 400 }
      );
    }

    const webhookUrl = "https://narana00.app.n8n.cloud/webhook/invoke_agent";
    
    console.log(`Sending chat payload to webhook: ${webhookUrl}`);
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, chatInput }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Webhook error:", errorText);
      return NextResponse.json(
        { error: `Webhook returned status ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const output = data.output || data;
    return NextResponse.json(output);
  } catch (error: any) {
    console.error("Error in chat proxy route:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
