import http.server
import socketserver
import json
import os
import time

PORT = 5000
HOST = "0.0.0.0"

class TranslatorHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/translate':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                code = data.get('code', '')
                source_lang = data.get('sourceLang', '')
                target_lang = data.get('targetLang', '')
                
                # simulate processing delay
                time.sleep(1) 
                
                translated_code = self.mock_translate(code, source_lang, target_lang)
                
                response = {
                    "success": True,
                    "translatedCode": translated_code
                }
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        else:
            self.send_error(404)

    def mock_translate(self, code, source_lang, target_lang):
        """Mock translation logic moved to backend"""
        if not code.strip():
            return ""
            
        lines = code.split('\n')
        translated_lines = []
        
        header = f"// [BACKEND] Translated from {source_lang} to {target_lang}\n// Served by app.py on {HOST}:{PORT}\n\n"
        
        for line in lines:
            new_line = line
            # Simple replacements
            if source_lang == 'python':
                if target_lang == 'javascript':
                    new_line = new_line.replace('print(', 'console.log(')
                    new_line = new_line.replace('def ', 'function ')
                    new_line = new_line.replace(':', ' {')
                elif target_lang == 'java':
                    new_line = new_line.replace('print(', 'System.out.println(')
            
            translated_lines.append(new_line)
            
        return header + "\n".join(translated_lines)

print(f"Starting server at http://{HOST}:{PORT}")
print("Press Ctrl+C to stop.")

# Allow address reuse prevents 'Address already in use' errors on restart
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), TranslatorHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
