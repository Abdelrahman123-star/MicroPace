import { connectDB } from "../lib/mongodb";
import { Path } from "../models/Path";
import { Sprint } from "../models/Sprint";

const seedData = async () => {
    try {
        await connectDB();

        // 1. Create a fresh path specifically for testing
        const testPath = await Path.findOneAndUpdate(
            { slug: "code-challenge-demo" },
            {
                name: "Code Challenge Demo",
                slug: "code-challenge-demo",
                description: "Test drive the new interactive code challenges!",
                category: "Testing",
                icon: "🚀"
            },
            { upsert: true, new: true }
        );

        console.log("Path created/updated:", testPath.slug);

        // 2. Create the code challenge sprint
        const challengeSprint = await Sprint.findOneAndUpdate(
            { slug: "flexbox-mastery-challenge", pathId: testPath._id },
            {
                pathId: testPath._id,
                title: "Flexbox Mastery Challenge",
                slug: "flexbox-mastery-challenge",
                xpReward: 100,
                order: 1,
                storyContext: "You're building the most advanced navigation bar yet. Master Flexbox to complete the mission.",
                lessonContent: "Use `display: flex` and `justify-content` to align your elements.",
                codeSnippet: "display: flex;",
                codeLanguage: "css",
                questions: [
                    {
                        type: "mcq",
                        question: "What does 'justify-content: space-between' do?",
                        options: ["Centers items", "Evenly distributes items with space between them", "Stacks items vertically"],
                        correctAnswerIndex: 1
                    }
                ],
                codeChallenge: {
                    initialHtml: "<html>\n<body>\n  <nav class='nav'>\n    <div>Logo</div>\n    <div>Links</div>\n  </nav>\n</body>\n</html>",
                    initialCss: ".nav { /* add flex/spacing here */ }",
                    solutionCss: ".nav { display: flex; justify-content: space-between; }",
                    hint: "Use display: flex and justify-content: space-between on the .nav class.",
                    testCases: [
                        {
                            name: "Check flexbox",
                            code: "const nav = document.querySelector('.nav');\nif (window.getComputedStyle(nav).display !== 'flex') throw new Error('Not flex');"
                        }
                    ]
                },
                completionStory: "Brilliant! The navigation is perfectly centered and responsive."
            },
            { upsert: true, new: true }
        );

        console.log("Sprint created/updated:", challengeSprint.slug);
        console.log("------------------------------------------");
        console.log("SEEDING COMPLETE");
        console.log(`View it at: /paths/code-challenge-demo/flexbox-mastery-challenge`);
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedData();
