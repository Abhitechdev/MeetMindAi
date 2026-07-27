import os
import re

def fix_canonical(filepath, path_suffix):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if "alternates: {" in content:
        return # already has alternates
        
    if "export const metadata: Metadata = {" in content:
        new_content = content.replace("export const metadata: Metadata = {", f"export const metadata: Metadata = {{\n  alternates: {{\n    canonical: '{path_suffix}',\n  }},")
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Added canonical to {filepath}")

# Server components that export metadata
pages = [
    ('frontend/app/pricing/page.tsx', '/pricing'),
    ('frontend/app/features/page.tsx', '/features'),
    ('frontend/app/faq/page.tsx', '/faq'),
    ('frontend/app/help-center/page.tsx', '/help-center'),
    ('frontend/app/integrations/page.tsx', '/integrations'),
    ('frontend/app/changelog/page.tsx', '/changelog'),
    ('frontend/app/security/page.tsx', '/security'),
    ('frontend/app/api-docs/page.tsx', '/api-docs'),
    ('frontend/app/legal/acceptable-use/page.tsx', '/legal/acceptable-use'),
    ('frontend/app/legal/ai-transparency/page.tsx', '/legal/ai-transparency'),
    ('frontend/app/legal/cookies-policy/page.tsx', '/legal/cookies-policy'),
    ('frontend/app/legal/privacy/page.tsx', '/legal/privacy'),
    ('frontend/app/legal/terms/page.tsx', '/legal/terms'),
    ('frontend/app/blog/page.tsx', '/blog'),
    ('frontend/app/page.tsx', '/')
]

for filepath, suffix in pages:
    if os.path.exists(filepath):
        fix_canonical(filepath, suffix)

# For client components, create layout.tsx
client_pages = [
    ('frontend/app/about', '/about'),
    ('frontend/app/how-it-works', '/how-it-works'),
    ('frontend/app/contact', '/contact')
]

for dirpath, suffix in client_pages:
    layout_path = f"{dirpath}/layout.tsx"
    if not os.path.exists(layout_path):
        with open(layout_path, 'w') as f:
            f.write(f"""import type {{ Metadata }} from 'next';

export const metadata: Metadata = {{
  alternates: {{
    canonical: '{suffix}',
  }},
}};

export default function Layout({{ children }}: {{ children: React.ReactNode }}) {{
  return children;
}}
""")
        print(f"Created {layout_path}")
