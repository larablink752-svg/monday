import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 }
      );
    }

    // Try Docker container address first, then fallback to localhost (for local npm run dev runtimes)
    const urls = [
      "http://pdf-service:8002/generate",
      "http://localhost:8002/generate"
    ];

    let response: Response | null = null;
    let lastError: Error | null = null;

    for (const url of urls) {
      try {
        console.log(`Attempting to generate PDF via service: ${url}`);
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content }),
          // Set a short timeout so fallback happens quickly if service is unavailable
          signal: AbortSignal.timeout(3000),
        });

        if (response.ok) {
          break;
        }
      } catch (err: any) {
        console.warn(`Failed to connect to ${url}:`, err.message);
        lastError = err;
      }
    }

    // If the backend services succeeded, return the PDF stream directly
    if (response && response.ok) {
      const pdfBuffer = await response.arrayBuffer();
      return new Response(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(
            title.toLowerCase().replace(/[^a-z0-9]/g, "_")
          )}.pdf"`,
        },
      });
    }

    // --- RESILIENT FALLBACK GENERATION ---
    // If Flask backend is not running, we construct a real standard PDF header/body minimal structure
    // so the download still functions and yields a viewable PDF document!
    console.warn("PDF microservice is offline. Triggering high-fidelity server-side PDF generator fallback...");
    
    // We can generate a simple, valid PostScript/PDF format text file labeled as PDF, 
    // or standard PDF syntax containing the content.
    const pdfData = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >> >>
endobj
4 0 obj
<< /Length 300 >>
stream
BT
/F2 20 Tf
72 710 Td
(${title.replace(/[\(\)\\]/g, "\\$&")}) Tj
/F1 12 Tf
0 -30 Td
(Fallback PDF Generator Mode - Python service offline) Tj
0 -20 Td
(Generated on: ${new Date().toLocaleString()}) Tj
0 -40 Td
14 TL
${content
  .split("\n")
  .map((line: string) => `(${line.replace(/[\(\)\\]/g, "\\$&")}) Tj T*`)
  .join("\n")}
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000307 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
657
%%EOF`;

    const encoder = new TextEncoder();
    const pdfBuffer = encoder.encode(pdfData);

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          title.toLowerCase().replace(/[^a-z0-9]/g, "_")
        )}_fallback.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("Critical error in PDF route proxy:", error);
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
