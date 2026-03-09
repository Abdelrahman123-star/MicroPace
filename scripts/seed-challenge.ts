import { connectDB } from "@/lib/mongodb"
import { Sprint } from "@/models/Sprint";

const seedSprint = {
    title: "Mastering Flexbox Layouts",
    slug: "mastering-flexbox-layouts",
    pathId: "65e9f8e4b1a2c3d4e5f67890", // Placeholder Path ID
    xpReward: 150,
    lessonContent: "Flexbox is a powerful layout model that allows you to design flexible and responsive layout structures without using float or positioning. \n\nKey properties include:\n- `display: flex;` - Activates flexbox on a container.\n- `justify-content` - Aligns items along the main axis.\n- `align-items` - Aligns items along the cross axis.\n\nTry building a simple navigation bar using flexbox!",
    codeSnippet: ".container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}",
    codeLanguage: "css",
    questions: [
        {
            type: "mcq",
            question: "Which property is used to align items horizontally in a flex container with `flex-direction: row`?",
            options: ["align-items", "justify-content", "flex-wrap", "display"],
            correctAnswerIndex: 1
        },
        {
            type: "fill_in_blanks",
            question: "To make an element a flex container, you set its display property to {{blank}}.",
            blanks: ["flex"],
            draggables: ["flex", "block", "inline", "grid"]
        }
    ],
    codeChallenge: {
        initialHtml: "<html>\n  <style>\n    .nav {\n      background: #333;\n      padding: 1rem;\n      color: white;\n    }\n  </style>\n  <body>\n    <nav class=\"nav\">\n      <div class=\"logo\">MyLogo</div>\n      <ul class=\"links\">\n        <li>Home</li>\n        <li>About</li>\n        <li>Contact</li>\n      </ul>\n    </nav>\n  </body>\n</html>",
        initialCss: ".nav {\n  /* Add Flexbox here */\n}\n\n.links {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  /* Add Flexbox here */\n}",
        initialJs: "// No JS needed for this challenge",
        solutionHtml: "<html>\n  <style>\n    .nav {\n      background: #333;\n      padding: 1rem;\n      color: white;\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n    }\n    .links {\n      list-style: none;\n      margin: 0;\n      padding: 0;\n      display: flex;\n      gap: 1rem;\n    }\n  </style>\n  <body>\n    <nav class=\"nav\">\n      <div class=\"logo\">MyLogo</div>\n      <ul class=\"links\">\n        <li>Home</li>\n        <li>About</li>\n        <li>Contact</li>\n      </ul>\n    </nav>\n  </body>\n</html>",
        solutionCss: ".nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.links {\n  display: flex;\n  gap: 1rem;\n}",
        solutionJs: "",
        hint: "Use 'display: flex' on both the .nav and .links elements. For the .nav, use 'justify-content: space-between' to separate the logo and the links.",
        testCases: [
            {
                name: "Check if .nav is display: flex",
                code: "const nav = document.querySelector('.nav');\nconst style = window.getComputedStyle(nav);\nif (style.display !== 'flex') throw new Error('navbar should use flexbox');"
            }
        ]
    },
    storyContext: "You are building a landing page for a new futuristic startup. The first step is to create a sleek, responsive navigation bar.",
    completionStory: "Amazing! Your navigation bar looks professional and adapts perfectly to different screen sizes. The startup is impressed!",
    order: 1
};

async function seed() {
    await connectDB();
    await Sprint.deleteMany({ slug: seedSprint.slug });
    const sprint = await Sprint.create(seedSprint);
    console.log("Seed sprint created:", sprint._id);
    process.exit(0);
}

seed();
