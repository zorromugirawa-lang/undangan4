import re

head_html = '''
            <!-- HEAD DECORATION -->
            <div class="head-decoration-container">
                <img src="assets/head.png" alt="Head Decoration" class="head-item">
            </div>'''

for filename in ['c:/xampp/htdocs/undangan4/index.php', 'c:/xampp/htdocs/undangan4/index.html']:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    def replacer(match):
        # Add head_html immediately after the section tag opens
        return match.group(0) + head_html

    # We match <section ...> that doesn't already have HEAD DECORATION
    content = re.sub(r'<section\b[^>]*>(?!\s*<!-- HEAD DECORATION -->)', replacer, content)

    # update CSS version from ?v=4 to ?v=5
    content = content.replace('css/styles.css?v=4', 'css/styles.css?v=5')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Processed {filename}')
