import re

with open('c:/xampp/htdocs/undangan4/index.php', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'<!-- Decorative Swaying Flowers -->\s*<div class="section-flower-container">\s*<div class="flower-wrapper reveal">.*?</div>\s*</div>\s*<!-- Decorative Swaying Flowers \(Right\) -->\s*<div class="section-flower-container-right">\s*<div class="flower-wrapper-right reveal">.*?</div>\s*</div>', re.DOTALL)

replacement = """<!-- Decorative Swaying Flowers (Left) -->
            <div class="section-flower-container left">
                <div class="flower-wrapper reveal">
                    <img src="assets/bunga3.png" class="flower-item flower-1" alt="Bunga 1">
                    <img src="assets/bunga4.png" class="flower-item flower-2" alt="Bunga 2">
                </div>
            </div>
            <!-- Decorative Swaying Flowers (Right) -->
            <div class="section-flower-container right">
                <div class="flower-wrapper-right reveal">
                    <img src="assets/bunga3.png" class="flower-item-right flower-1" alt="Bunga 1">
                    <img src="assets/bunga4.png" class="flower-item-right flower-2" alt="Bunga 2">
                </div>
            </div>"""

new_content = pattern.sub(replacement, content)

with open('c:/xampp/htdocs/undangan4/index.php', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f'Replaced {len(pattern.findall(content))} occurrences.')
