import io
from flask import Flask, request, jsonify, send_file
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"})

@app.route('/generate', methods=['POST'])
def generate_pdf():
    try:
        data = request.get_json() or {}
        title = data.get('title', 'Simple PDF Document')
        content = data.get('content', 'No content provided.')
        
        # Create an in-memory buffer for the PDF
        buffer = io.BytesIO()
        
        # SimpleDocTemplate to write to buffer
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        styles = getSampleStyleSheet()
        
        # Custom Title Style
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            leading=28,
            textColor=colors.HexColor('#1A365D'), # Premium dark blue color
            spaceAfter=15
        )
        
        # Custom Content Style
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['BodyText'],
            fontSize=11,
            leading=16,
            textColor=colors.HexColor('#2D3748'), # Elegant dark grey
            spaceAfter=10
        )
        
        story = []
        
        # Title paragraph
        story.append(Paragraph(title, title_style))
        story.append(Spacer(1, 10))
        
        # Content paragraph (splitting by newline for neat spacing)
        for line in content.split('\n'):
            if line.strip():
                story.append(Paragraph(line, body_style))
                story.append(Spacer(1, 6))
                
        # Build the PDF
        doc.build(story)
        
        # Reset the buffer pointer to the beginning
        buffer.seek(0)
        
        # Return as downloadable file attachment
        return send_file(
            buffer,
            as_attachment=True,
            download_name='document.pdf',
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Default to port 8002 as requested
    app.run(host='0.0.0.0', port=8002, debug=True)
