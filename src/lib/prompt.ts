export const buildProjectPrompt = (skills: string, domain: string): string => `
You are a senior software architect, startup product strategist, and DevOps-aware engineer.

Generate a high-quality GitHub project idea based on the following:

**User Skills:** ${skills}
**Interest Area / Domain:** ${domain}

The project must be practical, portfolio-worthy, and suitable for a computer science student who can build it in 2–4 weeks.

Respond in the following structured markdown format (use headers exactly as shown):

## 1. Project Title
[Project name here]

## 2. Problem Statement
Explain the real-world problem the project solves in 2–3 sentences.

## 3. Project Description
Describe how the system works and what the user experience looks like. 3–4 sentences.

## 4. Key Features
List 6–8 key features as a bullet list. Make them specific and technical.

## 5. Tech Stack
Use this exact sub-structure:

**Frontend:** ...
**Backend:** ...
**Database:** ...
**AI/ML (if applicable):** ...
**Deployment:** ...

## 6. System Architecture
Explain the system workflow step-by-step (numbered list, 5–7 steps).

## 7. Folder Structure
\`\`\`
[Provide a recommended GitHub repository folder structure as a tree]
\`\`\`

## 8. Sample API Endpoints
If a backend is required, list 6–8 REST or GraphQL endpoints with method, path, and description in a markdown table.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/... | ...         |

## 9. Example UI Screens
Describe 4–5 main screens the app should have, with what each screen shows.

## 10. Possible Enhancements
List 5–6 features or ideas that could turn this into a real startup product.

## 11. Development Plan With Git Commits
For each major milestone, provide:
- **File Created:** \`filename\`
- **Purpose:** one-line description
- **Commit:** \`type(scope): description\`

List 10–14 commits covering the full development lifecycle.

---

Make the project genuinely impressive: it should demonstrate strong engineering capability, integrate modern technologies, and stand out in a CS student's portfolio.
`
