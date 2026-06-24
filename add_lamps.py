import re

lamp_html = '''
            <!-- HANGING LAMP DECORATION -->
            <div class="lamp-container left">
                <img src="assets/lamp.png" alt="Lamp Decoration" class="lamp-item">
            </div>
            <div class="lamp-container right">
                <img src="assets/lamp.png" alt="Lamp Decoration" class="lamp-item">
            </div>'''

for filename in ['c:/xampp/htdocs/undangan4/index.php', 'c:/xampp/htdocs/undangan4/index.html']:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove existing global lamp at the bottom
    global_lamp_pattern = re.compile(r'\s*<!-- HANGING LAMP DECORATION -->\s*<div class="lamp-container left">.*?</div>\s*<div class="lamp-container right">.*?</div>', re.DOTALL)
    content = global_lamp_pattern.sub('', content)

    # 2. Add lamp to each section
    def replacer(match):
        section_tag = match.group(0)
        return section_tag + lamp_html

    # Only replace if not followed by the lamp comment
    content = re.sub(r'<section\b[^>]*>(?!\s*<!-- HANGING LAMP DECORATION -->)', replacer, content)

    # update CSS version from ?v=2 to ?v=3
    content = content.replace('css/styles.css?v=2', 'css/styles.css?v=3')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Processed {filename}')
