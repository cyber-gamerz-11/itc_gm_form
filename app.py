import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from supabase import create_client

# Explicitly load .env with UTF-8 encoding
env_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path, encoding='utf-8-sig', override=True)
else:
    load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='templates')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'gm_registration_secret_key_2026')

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    return response

@app.route('/api/register', methods=['OPTIONS'])
def options_register():
    return '', 204

def get_db():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        print("Warning: SUPABASE_URL or SUPABASE_KEY missing in environment.")
        return None
    try:
        return create_client(url.strip(), key.strip())
    except Exception as e:
        print(f"Supabase Client Init Error: {e}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json() or {}
        name = (data.get('name') or data.get('full_name') or '').strip()
        email = data.get('email', '').strip()
        whatsapp = (data.get('whatsapp') or data.get('whatsapp_number') or '').strip()
        class_name = data.get('class_name', '').strip()
        section = data.get('section', '').strip()
        previous_club = (data.get('previous_club') or data.get('previous_it_club') or '').strip()

        if not all([name, email, whatsapp, class_name, section, previous_club]):
            return jsonify({"error": "All fields marked with * are required."}), 400

        db = get_db()
        if not db:
            return jsonify({
                "error": "Database not connected. Please ensure SUPABASE_URL and SUPABASE_KEY in .env are valid."
            }), 500

        # Check duplicate email
        try:
            existing = db.table('gm_registrations').select('id').eq('email', email).execute()
            if existing and existing.data:
                return jsonify({"error": "This email address has already been registered."}), 409
        except Exception as check_err:
            print(f"Duplicate check note: {check_err}")

        # Insert record
        result = db.table('gm_registrations').insert({
            "name": name,
            "email": email,
            "whatsapp": whatsapp,
            "class_name": class_name,
            "section": section,
            "previous_club": previous_club
        }).execute()

        if result and result.data:
            return jsonify({"success": True, "message": "Registration completed successfully!"}), 201
        else:
            return jsonify({"error": "Failed to save registration to Supabase."}), 500

    except Exception as e:
        print(f"Registration exception: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/health')
def health():
    db = get_db()
    db_status = "connected" if db else "disconnected"
    return jsonify({
        "status": "online",
        "database": db_status,
        "message": "GM Registration server is active"
    }), 200

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5001))
    print(f"Starting GM Registration server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
