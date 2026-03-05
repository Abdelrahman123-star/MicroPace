import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Path } from "@/models/Path";
import { Sprint } from "@/models/Sprint";

export async function GET() {
    try {
        await connectDB();

        // 1. Wipe existing data
        await Path.deleteMany({});
        await Sprint.deleteMany({});

        // 2. Create Testing Path 1: Frontend Basics
        const path1 = await Path.create({
            name: "Frontend Masterclass",
            slug: "frontend-masterclass",
            description: "Learn foundational frontend concepts with interactive elements.",
            icon: "🎨",
            category: "Web Development",
        });

        const sprints1 = [
            {
                pathId: path1._id,
                title: "Introduction to HTML",
                slug: "intro-html",
                lessonContent: "HTML tags define the structure of the web page. A tag usually consists of an opening tag, content, and a closing tag.",
                codeSnippet: `<div class="container">\n  <h1>Hello World</h1>\n  <p>This is a paragraph.</p>\n</div>`,
                codeLanguage: "html",
                xpReward: 15,
                order: 1,
                questions: [
                    {
                        type: "mcq",
                        question: "What does HTML stand for?",
                        options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
                        correctAnswerIndex: 0
                    },
                    {
                        type: "fill_in_blanks",
                        question: "The {{blank}} tag represents the largest heading, while the {{blank}} tag represents a paragraph.",
                        blanks: ["<h1>", "<p>"],
                        draggables: ["<h1>", "<p>", "<div>", "<a>"]
                    }
                ]
            },
            {
                pathId: path1._id,
                title: "CSS Styling Basics",
                slug: "css-basics",
                lessonContent: "CSS is used to style HTML elements. You can link a CSS file, use the `<style>` tag, or write inline styles.",
                codeSnippet: `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  background-color: #f0f0f0;\n}`,
                codeLanguage: "css",
                xpReward: 20,
                order: 2,
                questions: [
                    {
                        type: "ordering",
                        question: "Arrange the CSS rules in alphabetical order by property name:",
                        itemsToOrder: ["align-items: center;", "background-color: #f0f0f0;", "display: flex;", "justify-content: center;"]
                    }
                ]
            }
        ];

        await Sprint.insertMany(sprints1);


        // 3. Create Testing Path 2: Backend Node.js
        const path2 = await Path.create({
            name: "Backend with Node.js",
            slug: "backend-nodejs",
            description: "Master server-side programming, APIs, and databases.",
            icon: "⚙️",
            category: "Backend Development",
        });

        const sprints2 = [
            {
                pathId: path2._id,
                title: "Setting up Express",
                slug: "setup-express",
                lessonContent: "Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
                codeSnippet: `const express = require('express');\nconst app = express();\nconst port = 3000;\n\napp.get('/', (req, res) => {\n  res.send('Hello World!');\n});\n\napp.listen(port, () => {\n  console.log(\`Example app listening on port \${port}\`);\n});`,
                codeLanguage: "javascript",
                xpReward: 25,
                order: 1,
                questions: [
                    {
                        type: "fill_in_blanks",
                        question: "To start an express app, we first {{blank}} it, create an instance called {{blank}}, and then listen on a specific {{blank}}.",
                        blanks: ["require", "app", "port"],
                        draggables: ["require", "app", "port", "install", "server", "url"]
                    },
                    {
                        type: "mcq",
                        question: "Which HTTP method is typically used to retrieve data?",
                        options: ["POST", "GET", "PUT", "DELETE"],
                        correctAnswerIndex: 1
                    }
                ]
            },
            {
                pathId: path2._id,
                title: "Middleware Concepts",
                slug: "middleware-concepts",
                lessonContent: "Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle.",
                xpReward: 30,
                order: 2,
                questions: [
                    {
                        type: "ordering",
                        question: "Order the parameters of a standard Express middleware function:",
                        itemsToOrder: ["req", "res", "next"]
                    }
                ]
            }
        ];

        await Sprint.insertMany(sprints2);

        return NextResponse.json({ message: "Database wiped and seeded with 2 test paths successfully!" });

    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
    }
}
