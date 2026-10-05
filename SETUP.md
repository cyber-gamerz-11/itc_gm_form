# MPSC IT Club - General Member Registration

## Setup Guide

### 1. Supabase Database Table
Create this table in your Supabase dashboard:

```sql
CREATE TABLE gm_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    whatsapp TEXT NOT NULL,
    class_name TEXT NOT NULL,
    section TEXT NOT NULL,
    previous_club TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Environment Variables
Update the `.env` file with your Supabase credentials:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
SECRET_KEY=any-secret-string
```

### 3. Run Locally
```bash
pip install -r requirements.txt
python app.py
```
Visit: http://localhost:5001

### 4. Deploy to Render
1. Push to GitHub
2. Create a new Web Service on Render
3. Connect the GitHub repo
4. Set Build Command: `pip install -r requirements.txt`
5. Set Start Command: `gunicorn app:app`
6. Add environment variables (SUPABASE_URL, SUPABASE_KEY, SECRET_KEY)

### 5. Download Data as Excel
Go to your Supabase Dashboard > Table Editor > gm_registrations > Click "Export to CSV"
You can then open the CSV in Excel.
