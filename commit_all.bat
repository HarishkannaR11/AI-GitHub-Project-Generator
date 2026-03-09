@echo off
cd /d "H:\AI GitHub Project Generator\AI-GitHub-Project-Generator"

:: Configure git identity if not set
git config user.email "dev@ai-project-gen.com" 2>nul
git config user.name "AI Project Generator" 2>nul

echo.
echo === [1/16] Config files ===
git add package.json next.config.ts tsconfig.json postcss.config.mjs tailwind.config.ts .prettierrc next-env.d.ts
git commit -m "chore(config): initialize Next.js 15 project config, Tailwind, TypeScript, and Prettier"

echo.
echo === [2/16] Docs ^& env ===
git add README.md .env.example
git commit -m "docs(readme): add project documentation and environment variables template"

echo.
echo === [3/16] Prisma schema ===
git add prisma/schema.prisma
git commit -m "feat(db): define GeneratedProject model in Prisma schema"

echo.
echo === [4/16] Prisma client ===
git add src/lib/prisma.ts
git commit -m "feat(db): add singleton Prisma client to prevent hot-reload duplicates"

echo.
echo === [5/16] OpenAI client ===
git add src/lib/openai.ts
git commit -m "feat(ai): add OpenAI client singleton"

echo.
echo === [6/16] Utilities ===
git add src/lib/utils.ts
git commit -m "feat(lib): add cn helper, formatDate, skill suggestions, and domain options"

echo.
echo === [7/16] Prompt builder ===
git add src/lib/prompt.ts
git commit -m "feat(ai): add structured 11-section prompt builder for GPT-4o"

echo.
echo === [8/16] Types ===
git add src/types/index.ts
git commit -m "feat(types): add shared TypeScript interfaces for API and DB"

echo.
echo === [9/16] Generate API route ===
git add src/app/api/generate/route.ts
git commit -m "feat(api): add POST /api/generate with GPT-4o integration and DB persistence"

echo.
echo === [10/16] Projects list API ===
git add src/app/api/projects/route.ts
git commit -m "feat(api): add GET /api/projects with pagination and saved/domain filters"

echo.
echo === [11/16] Project by ID API ===
git add "src/app/api/projects/[id]/route.ts"
git commit -m "feat(api): add GET, PATCH, DELETE /api/projects/[id] with view tracking"

echo.
echo === [12/16] UI components ===
git add src/components/ui/button.tsx
git commit -m "feat(ui): add Button with gradient, outline, and ghost variants"

git add src/components/ui/card.tsx
git commit -m "feat(ui): add Card with glassmorphism styling"

git add src/components/ui/input.tsx
git commit -m "feat(ui): add Input for dark theme with violet focus ring"

git add src/components/ui/badge.tsx
git commit -m "feat(ui): add Badge with violet/indigo/success color variants"

git add src/components/ui/textarea.tsx
git commit -m "feat(ui): add Textarea component"

echo.
echo === [13/16] Global styles ^& layout ===
git add src/app/globals.css
git commit -m "feat(styles): add global CSS with ShadCN tokens, markdown prose, and glassmorphism utilities"

git add src/app/layout.tsx
git commit -m "feat(layout): add root layout with Inter font and styled Toaster"

echo.
echo === [14/16] Feature components ===
git add src/components/Navbar.tsx
git commit -m "feat(ui): add sticky Navbar with glassmorphism and GitHub link"

git add src/components/GeneratorForm.tsx
git commit -m "feat(ui): add GeneratorForm with tag-input skills, autocomplete, and domain select"

git add src/components/ProjectOutput.tsx
git commit -m "feat(ui): add ProjectOutput with markdown renderer, syntax highlighting, and save/copy/download actions"

git add src/components/HistoryPanel.tsx
git commit -m "feat(ui): add HistoryPanel sidebar with all/saved filter tabs and delete on hover"

echo.
echo === [15/16] Pages ===
git add src/app/page.tsx
git commit -m "feat(pages): add homepage with hero, rotating words, 2-col generator layout, and how-it-works section"

git add src/app/history/page.tsx
git commit -m "feat(pages): add history page with paginated project list, domain filter, and preview panel"

echo.
echo === [16/16] Batch script cleanup ===
git add commit_all.bat
git commit -m "chore(scripts): add batch commit script for initial project setup"

echo.
echo ==========================================
echo   All commits complete! Git log:
echo ==========================================
git log --oneline -25

pause
