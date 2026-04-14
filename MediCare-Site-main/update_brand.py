from pathlib import Path
files = ['index.html','school_about.html','school_admission.html','school_news.html','server.js']
replacements = [
    ('G.S St Kizito Nyamateke', 'Liquidnet Family High School'),
    ('G.S NYAMATEKE', 'Liquidnet Family High School'),
    ('G.S Nyamateke', 'Liquidnet Family High School'),
    ('G.S NYAMTEKE', 'Liquidnet Family High School'),
    ('G.S <span>NYAMATEKE</span>', 'Liquidnet Family High School'),
    ('G.S<span>NYAMATEKE</span>', 'Liquidnet Family High School'),
    ('G.S NYAMATEKE Admissions', 'Liquidnet Family High School Admissions'),
    ('G.S Nyamateke News Portal', 'Liquidnet Family High School News Portal'),
    ('G.S NYAMATEKE School', 'Liquidnet Family High School'),
    ('G.S NYAMATEKE Campus', 'Liquidnet Family High School U.S. Office'),
    ('Nyarubuye Sector, Rwanda', '234 5th Avenue, 5th Floor, Suite 508, New York, NY 10001'),
    ('Nyamteke Road, Education Zone', '234 5th Avenue, 5th Floor, Suite 508'),
    ('123 Education Avenue, Nyamateke District', '234 5th Avenue, 5th Floor, Suite 508, New York, NY 10001'),
    ('City, Country', 'New York, NY 10001'),
    ('+250 788 123 456', '631-317-1763'),
    ('+250 789 987 654', '631-317-1763'),
    ('+250 123 456 789', '631-317-1763'),
    ('(250) 788-123-456', '631-317-1763'),
    ('info@stkizitonyamateke.rw', 'info@liquidnetfamilyhighschool.org'),
    ('admissions@stkizitonyamateke.rw', 'admissions@liquidnetfamilyhighschool.org'),
    ('info@gsnyamateke.edu.rw', 'info@liquidnetfamilyhighschool.org'),
    ('admissions@gsnyamteke.edu', 'admissions@liquidnetfamilyhighschool.org'),
    ('admissions@gsnyamateke.edu', 'admissions@liquidnetfamilyhighschool.org'),
    ('info@gsnyamteke.edu', 'info@liquidnetfamilyhighschool.org'),
    ('Nyamateke District', 'New York, NY 10001'),
    ('Rwanda', 'New York, NY 10001'),
    ('Nyarubuye Sector', 'New York, NY 10001'),
    ('<title>About G.S NYAMATEKE | Our Story, Values & Community</title>', '<title>About Liquidnet Family High School | Our Story, Values & Community</title>'),
    ('<title>G.S NYAMATEKE | Admissions</title>', '<title>Admissions | Liquidnet Family High School</title>'),
    ('<title>G.S Nyamateke - School News Portal</title>', '<title>Liquidnet Family High School News Portal</title>'),
    ('<title>G.S St Kizito Nyamateke - Excellence in Education</title>', '<title>Liquidnet Family High School | Excellence in Education</title>'),
    ('<h1>Welcome to G.S St Kizito Nyamateke</h1>', '<h1>Welcome to Liquidnet Family High School</h1>'),
    ('<h1>Welcome to G.S NYAMATEKE Admissions</h1>', '<h1>Welcome to Liquidnet Family High School Admissions</h1>'),
    ('<h2>Welcome to G.S Nyamateke News Portal</h2>', '<h2>Welcome to Liquidnet Family High School News Portal</h2>'),
    ('<h3>G.S St Kizito Nyamateke</h3>', '<h3>Liquidnet Family High School</h3>'),
    ('<h1>G.S NYAMATEKE</h1>', '<h1>Liquidnet Family High School</h1>'),
    ('<h1>G.S Nyamateke</h1>', '<h1>Liquidnet Family High School</h1>'),
    ('<div class="logo-text">\n                    <h1>G.S <span>NYAMATEKE</span></h1>', '<div class="logo-text">\n                    <h1>Liquidnet Family High School</h1>'),
]
map_old = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.886544299877!2d30.67124587491052!3d-2.197898337828438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19d7bb23d94a737d%3A0x77c3e2b1d2a1b0b9!2sNyamateke%2C%20Rwanda!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s'
map_new = 'https://maps.google.com/maps?q=234+5th+Avenue,+New+York,+NY+10001&output=embed'
for path_str in files:
    p = Path(path_str)
    if not p.exists():
        print(f'SKIP missing {path_str}')
        continue
    text = p.read_text(encoding='utf-8')
    for old, new in replacements:
        if old in text:
            text = text.replace(old, new)
    if map_old in text:
        text = text.replace(map_old, map_new)
    if p.name == 'server.js':
        text = text.replace("process.env.SCHOOL_EMAIL || 'jmukunzi2009@gmail.com'","process.env.SCHOOL_EMAIL || 'info@liquidnetfamilyhighschool.org'")
    p.write_text(text, encoding='utf-8')
    print(f'Updated {path_str}')
