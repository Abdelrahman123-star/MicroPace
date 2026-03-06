/**
 * Data Analyst Course — Story-Driven Seed Data
 * Theme: "You are a data analyst at DataFlow Analytics, unlocking secrets in datasets."
 * Characters: Alex (Boss), Dr. Chen (Mentor), Jordan (Teammate)
 */

import { Types } from "mongoose";

interface SprintSeed {
  pathId: Types.ObjectId;
  title: string;
  slug: string;
  storyContext?: string;
  completionStory?: string;
  characters?: string[];
  lessonContent: string;
  codeSnippet?: string;
  codeLanguage?: string;
  xpReward: number;
  order: number;
  questions: Array<{
    type: "mcq" | "fill_in_blanks" | "ordering";
    question: string;
    options?: string[];
    correctAnswerIndex?: number;
    blanks?: string[];
    draggables?: string[];
    itemsToOrder?: string[];
    explanation?: string;
  }>;
}

export function getDataAnalystPaths() {
  return [
    {
      name: "Data Analyst: Beginner",
      slug: "data-analyst-beginner",
      description: "Start your journey at DataFlow Analytics. Master Python and data analysis fundamentals while solving your first case.",
      icon: "📊",
      category: "Data Science",
    },
    {
      name: "Data Analyst: Intermediate",
      slug: "data-analyst-intermediate",
      description: "Level up your skills. Clean messy data, merge datasets, visualize insights, and tackle real-world analytics challenges.",
      icon: "🔬",
      category: "Data Science",
    },
  ];
}

export function getBeginnerSprints(pathId: Types.ObjectId): SprintSeed[] {
  return [
    {
      pathId,
      title: "Introduction to Data Analysis & Python",
      slug: "intro-data-analysis-python",
      storyContext:
        "Your first day at DataFlow Analytics! Alex, your boss, welcomes you: 'We need someone to unlock insights in our client datasets. Data analysis is the key—and Python is your toolkit.'",
      completionStory:
        "Alex nods approvingly. 'You're thinking like an analyst already. Tomorrow, Dr. Chen will show you why we chose Python.'",
      characters: ["Alex", "Boss"],
      lessonContent: `Data analysis is the process of inspecting, cleaning, transforming, and modeling data to discover useful information and support decision-making.

Companies use data analysis to:
• Understand customer behavior
• Identify trends and patterns
• Make data-driven business decisions
• Predict future outcomes

Python has become the go-to language for data analysis because it's versatile, has powerful libraries, and a huge community.`,
      xpReward: 15,
      order: 1,
      questions: [
        {
          type: "mcq",
          question: "What is the primary goal of data analysis?",
          options: [
            "To store data in databases",
            "To discover useful information and support decisions",
            "To delete unnecessary data",
          ],
          correctAnswerIndex: 1,
        },
        {
          type: "mcq",
          question: "Why do companies prefer Python for data analysis?",
          options: [
            "It's the oldest programming language",
            "It's versatile, has powerful libraries, and a large community",
            "It only works on Windows",
          ],
          correctAnswerIndex: 1,
        },
      ],
    },
    {
      pathId,
      title: "Why Python for Data Analysis",
      slug: "why-python-data-analysis",
      storyContext:
        "Dr. Chen, your mentor, pulls up a chair. 'Before we write code, understand the landscape. Python wasn't always the default for data—let me show you why it won.'",
      completionStory:
        "Dr. Chen smiles. 'Now you know why we bet on Python. Next: your development environment.'",
      characters: ["Dr. Chen", "Mentor"],
      lessonContent: `Python dominates data analysis for several reasons:

1. **Readability** — Python reads almost like English, making it easy to write and maintain.
2. **Libraries** — Pandas, NumPy, Matplotlib, and SciPy provide battle-tested tools.
3. **Community** — Massive support, tutorials, and Stack Overflow answers.
4. **Versatility** — From scripts to machine learning, Python handles it all.
5. **Industry adoption** — Google, Netflix, and thousands of startups use Python for data.`,
      xpReward: 15,
      order: 2,
      questions: [
        {
          type: "ordering",
          question: "Arrange these Python data libraries from foundational to advanced:",
          itemsToOrder: ["NumPy (numerical arrays)", "Pandas (dataframes)", "Matplotlib (plots)"],
        },
        {
          type: "mcq",
          question: "Which factor makes Python popular for data work?",
          options: ["It only runs on supercomputers", "Readability and a rich ecosystem of libraries", "It cannot handle large datasets"],
          correctAnswerIndex: 1,
        },
      ],
    },
    {
      pathId,
      title: "Setting Up Your Python Environment",
      slug: "setup-python-environment",
      storyContext:
        "Jordan, your teammate, shows you their screen. 'Here's how we all set up. You'll need Python, a code editor, and pip for packages. Let's get you ready.'",
      completionStory:
        "Jordan high-fives you. 'You're set! Tomorrow we start with variables—the building blocks of every analysis.'",
      characters: ["Jordan", "Teammate"],
      lessonContent: `To start analyzing data, you need:

1. **Python 3.x** — Install from python.org (3.8+ recommended)
2. **pip** — Python's package manager (comes with Python)
3. **Code editor** — VS Code, PyCharm, or Jupyter

Key commands:
• \`python --version\` — Check Python installation
• \`pip install pandas\` — Install the Pandas library
• \`pip list\` — See installed packages`,
      codeSnippet: `# Check your Python version
python --version

# Install essential data libraries
pip install pandas numpy matplotlib

# Verify installation
python -c "import pandas; print(pandas.__version__)"`,
      codeLanguage: "bash",
      xpReward: 15,
      order: 3,
      questions: [
        {
          type: "fill_in_blanks",
          question: "To install the Pandas library, you run {{blank}} in the terminal. To check your Python version, you use {{blank}}.",
          blanks: ["pip install pandas", "python --version"],
          draggables: ["pip install pandas", "python --version", "pip list", "import pandas"],
        },
        {
          type: "mcq",
          question: "What does pip do?",
          options: ["Edits Python code", "Installs and manages Python packages", "Runs Python scripts"],
          correctAnswerIndex: 1,
        },
      ],
    },
    {
      pathId,
      title: "Variables & Data Types",
      slug: "variables-data-types",
      storyContext:
        "Alex drops a CSV on your desk. 'Our first client dataset. Before we load it, you need to speak Python. Variables and types—that's where every analysis starts.'",
      completionStory:
        "'Solid foundation,' Alex says. 'Now let's do some math. Our reports need calculations.'",
      characters: ["Alex"],
      lessonContent: `Variables store data. Python infers the type automatically.

**Data types:**
• **int** — whole numbers (e.g., 42, -7)
• **float** — decimals (e.g., 3.14, -0.5)
• **str** — text in quotes (e.g., "revenue", 'Q1')
• **bool** — True or False

Naming: use lowercase, underscores for spaces. Avoid reserved words like \`if\`, \`for\`.`,
      codeSnippet: `# Variables and data types
revenue = 15000          # int
growth_rate = 0.12       # float
quarter = "Q1"           # str
is_profitable = True     # bool

print(type(revenue))     # <class 'int'>
print(type(quarter))     # <class 'str'>`,
      codeLanguage: "python",
      xpReward: 15,
      order: 4,
      questions: [
        {
          type: "mcq",
          question: "Which variable correctly stores a decimal number?",
          options: ["revenue = 15,000", "growth = 0.12", "growth = \"0.12\""],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "The type of True or False values in Python is {{blank}}. Text in quotes is type {{blank}}.",
          blanks: ["bool", "str"],
          draggables: ["bool", "str", "int", "float"],
        },
      ],
    },
    {
      pathId,
      title: "Arithmetic Operations",
      slug: "arithmetic-operations",
      storyContext:
        "Dr. Chen walks over. 'Client wants revenue growth numbers. You'll need arithmetic: add, subtract, multiply, divide. And watch out for order of operations.'",
      completionStory:
        "Dr. Chen checks your work. 'Perfect. Next we'll work with text—product names, categories, descriptions.'",
      characters: ["Dr. Chen"],
      lessonContent: `Python supports standard arithmetic:

• + Addition
• - Subtraction
• * Multiplication
• / Division (always returns float)
• // Floor division (rounds down)
• % Modulus (remainder)
• ** Exponentiation

Order: Parentheses → Exponentiation → * / // % → + -`,
      codeSnippet: `revenue_q1 = 50000
revenue_q2 = 65000

growth = (revenue_q2 - revenue_q1) / revenue_q1
print(f"Growth: {growth:.2%}")  # Growth: 30.00%

# Modulus: useful for cycles
day_of_week = 9 % 7   # 2 (Wednesday)`,
      codeLanguage: "python",
      xpReward: 15,
      order: 5,
      questions: [
        {
          type: "mcq",
          question: "What does 17 % 5 evaluate to?",
          options: ["3.4", "2", "3"],
          correctAnswerIndex: 2,
        },
        {
          type: "ordering",
          question: "Order of operations: which is evaluated first?",
          itemsToOrder: ["Parentheses", "Exponentiation (**)", "Multiplication (*)"],
        },
      ],
    },
    {
      pathId,
      title: "Strings & String Operations",
      slug: "strings-string-operations",
      storyContext:
        "Jordan shows you a column of messy product names. 'We need to clean these—uppercase, lowercase, replace typos. Strings are your friend.'",
      completionStory:
        "Jordan approves. 'Nice. Next up: lists. That's how we handle rows of data before we put them in a dataframe.'",
      characters: ["Jordan"],
      lessonContent: `Strings are sequences of characters. Common operations:

• \`len(s)\` — length
• \`s.upper()\` — all uppercase
• \`s.lower()\` — all lowercase
• \`s.replace(old, new)\` — replace substrings
• \`s.strip()\` — remove leading/trailing whitespace
• \`+ \` — concatenation`,
      codeSnippet: `product = "  DataFlow Pro  "
clean = product.strip().lower()
print(clean)  # "dataflow pro"

category = "Analytics"
full = category + " Tools"
print(full)  # "Analytics Tools"

# Replace typo
text = "DatA Analyst"
corrected = text.replace("DatA", "Data")`,
      codeLanguage: "python",
      xpReward: 15,
      order: 6,
      questions: [
        {
          type: "mcq",
          question: "What does 'hello'.upper() return?",
          options: ["'Hello'", "'HELLO'", "'hello'"],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "To get the number of characters in a string, use {{blank}}. To remove extra spaces at the start and end, use {{blank}}.",
          blanks: ["len()", "strip()"],
          draggables: ["len()", "strip()", "upper()", "replace()"],
        },
      ],
    },
    {
      pathId,
      title: "Lists & Basic Data Structures",
      slug: "lists-basic-data-structures",
      storyContext:
        "Alex hands you a printout. 'These are last month's top 5 products. In Python, we store sequences like this in lists. Master indexing and slicing.'",
      completionStory:
        "Alex nods. 'Lists are everywhere in data work. Soon you'll use tuples and sets for different cases.'",
      characters: ["Alex"],
      lessonContent: `Lists are ordered, mutable collections.

• Create: \`products = ["A", "B", "C"]\`
• Index: \`products[0]\` (first), \`products[-1]\` (last)
• Slice: \`products[1:3]\` (items 1 and 2)
• Append: \`products.append("D")\`
• Nested: \`[[1,2], [3,4]]\` — list of lists (like a table)`,
      codeSnippet: `sales = [1200, 980, 1500, 800, 2100]

# First and last
print(sales[0])    # 1200
print(sales[-1])   # 2100

# Slice: first 3
top_three = sales[:3]

# Add new month
sales.append(1900)

# Nested (rows of data)
rows = [[1, "Product A", 100], [2, "Product B", 200]]`,
      codeLanguage: "python",
      xpReward: 20,
      order: 7,
      questions: [
        {
          type: "mcq",
          question: "What does sales[-1] return for sales = [10, 20, 30]?",
          options: ["10", "20", "30"],
          correctAnswerIndex: 2,
        },
        {
          type: "ordering",
          question: "Order these list operations: create list, index first item, append new item",
          itemsToOrder: ["products = []", "products[0]", "products.append('x')"],
        },
      ],
    },
    {
      pathId,
      title: "Tuples & Sets",
      slug: "tuples-sets",
      storyContext:
        "Dr. Chen explains: 'Lists change. Sometimes you need something that doesn't—like (lat, lon) coordinates. And sets? Perfect for unique values, like unique customer IDs.'",
      completionStory:
        "Dr. Chen: 'Tuples and sets are specialized tools. Next: dictionaries—the real workhorse for structured data.'",
      characters: ["Dr. Chen"],
      lessonContent: `**Tuples** — immutable, ordered. Use for fixed data.
• \`coords = (40.7, -74.0)\`
• Cannot append or change

**Sets** — unique values only, unordered.
• \`unique_ids = {101, 102, 103}\`
• \`len(unique_ids)\` — count of unique items
• Add: \`unique_ids.add(104)\`
• Union, intersection for set math`,
      codeSnippet: `# Tuple: immutable
location = (40.7128, -74.0060)
# location[0] = 41  # Error!

# Set: unique values
customer_ids = {1001, 1002, 1001, 1003}
print(customer_ids)  # {1001, 1002, 1003}
print(len(customer_ids))  # 3

# Remove duplicates from list
list_with_dupes = [1, 2, 2, 3, 3, 3]
unique = set(list_with_dupes)`,
      codeLanguage: "python",
      xpReward: 15,
      order: 8,
      questions: [
        {
          type: "mcq",
          question: "What does set([1, 2, 2, 3, 3]) produce?",
          options: ["[1, 2, 3]", "{1, 2, 3}", "(1, 2, 3)"],
          correctAnswerIndex: 1,
        },
        {
          type: "mcq",
          question: "Why use a tuple instead of a list?",
          options: ["When you need to change values often", "When data should not change (immutable)", "When you need the longest data structure"],
          correctAnswerIndex: 1,
        },
      ],
    },
    {
      pathId,
      title: "Dictionaries",
      slug: "dictionaries",
      storyContext:
        "Jordan pulls up a JSON file. 'APIs and configs use key-value pairs. In Python, that's a dictionary. You'll use these every day.'",
      completionStory:
        "Jordan: 'Dictionaries are everywhere in real data. Next: conditionals. We need to filter and branch our logic.'",
      characters: ["Jordan"],
      lessonContent: `Dictionaries map keys to values.

• Create: \`data = {"name": "Alice", "age": 30}\`
• Access: \`data["name"]\` or \`data.get("name")\`
• Add/update: \`data["city"] = "NYC"\`
• Delete: \`del data["age"]\`
• Nested: \`{"user": {"name": "Alice", "score": 95}}\``,
      codeSnippet: `# Key-value pairs
employee = {
    "name": "Jordan",
    "role": "Analyst",
    "projects": 5
}

print(employee["role"])  # Analyst
employee["projects"] = 6  # Update

# Nested
client = {
    "id": 1,
    "contact": {"email": "a@b.com", "phone": "555-1234"}
}
print(client["contact"]["email"])`,
      codeLanguage: "python",
      xpReward: 20,
      order: 9,
      questions: [
        {
          type: "mcq",
          question: "How do you access the value for key 'age' in data = {'age': 25}?",
          options: ["data.age", "data['age']", "data(age)"],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "To safely get a value that might not exist, use {{blank}}. To add a new key-value pair, use {{blank}}.",
          blanks: [".get()", "data['key'] = value"],
          draggables: [".get()", "data['key'] = value", "del", "keys()"],
        },
      ],
    },
    {
      pathId,
      title: "Conditional Statements",
      slug: "conditional-statements",
      storyContext:
        "Alex points at a report. 'We flag orders above $500 and shipments that are late. That's conditional logic—if this, then that.'",
      completionStory:
        "Alex: 'Conditionals are the backbone of filtering. Combine them with loops next, and you're automating analysis.'",
      characters: ["Alex"],
      lessonContent: `Use if/elif/else to branch logic:

• \`if condition:\` — run if True
• \`elif condition:\` — else if
• \`else:\` — default

Logical operators: \`and\`, \`or\`, \`not\`
Comparison: \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\``,
      codeSnippet: `order_total = 600

if order_total >= 500:
    print("VIP discount applied")
elif order_total >= 200:
    print("Standard discount")
else:
    print("No discount")

# Logical operators
is_member = True
is_valid = order_total > 0
if is_member and is_valid:
    print("Eligible for rewards")`,
      codeLanguage: "python",
      xpReward: 15,
      order: 10,
      questions: [
        {
          type: "mcq",
          question: "Which operator checks if two values are equal?",
          options: ["=", "==", "eq"],
          correctAnswerIndex: 1,
        },
        {
          type: "ordering",
          question: "Order of conditional blocks:",
          itemsToOrder: ["if", "elif", "else"],
        },
      ],
    },
    {
      pathId,
      title: "Loops: for & while",
      slug: "loops-for-while",
      storyContext:
        "Dr. Chen: 'We have 10,000 rows. You're not writing 10,000 lines. Loops let you process each row once. for and while—master both.'",
      completionStory:
        "Dr. Chen: 'Loops automate the tedious work. Next: functions. We'll turn your repeated logic into reusable code.'",
      characters: ["Dr. Chen"],
      lessonContent: `**for** — iterate over a sequence (list, string, range)
\`for item in items:\`
\`for i in range(5):\`

**while** — repeat until condition is False

**break** — exit loop early
**continue** — skip to next iteration`,
      codeSnippet: `# Loop over list
totals = [100, 200, 150]
for t in totals:
    print(t * 1.1)  # Add 10%

# Loop with index
for i, name in enumerate(["A", "B", "C"]):
    print(f"{i}: {name}")

# break on condition
for x in [1, 2, 3, 4, 5]:
    if x == 4:
        break
    print(x)  # 1, 2, 3`,
      codeLanguage: "python",
      xpReward: 20,
      order: 11,
      questions: [
        {
          type: "mcq",
          question: "How many times does 'for i in range(3):' run the loop body?",
          options: ["2", "3", "4"],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "To exit a loop early, use {{blank}}. To skip to the next iteration, use {{blank}}.",
          blanks: ["break", "continue"],
          draggables: ["break", "continue", "exit", "pass"],
        },
      ],
    },
    {
      pathId,
      title: "Functions: Defining & Calling",
      slug: "functions-defining-calling",
      storyContext:
        "Jordan shows their script. 'I was copying the same block 10 times. Dr. Chen said: make it a function. Now one change updates everything.'",
      completionStory:
        "Jordan: 'Functions are reusable building blocks. Next: libraries. We'll import pandas and change how you see data.'",
      characters: ["Jordan", "Dr. Chen"],
      lessonContent: `Functions encapsulate logic for reuse.

def function_name(params):
    """Docstring"""
    return value

• Parameters can have defaults: \`def greet(name="World")\`
• \`return\` sends a value back
• Variables inside functions are local unless declared \`global\``,
      codeSnippet: `def calculate_growth(old_val, new_val):
    """Return growth rate as decimal."""
    return (new_val - old_val) / old_val

rate = calculate_growth(100, 120)  # 0.2

def summarize(sales_list):
    return {
        "total": sum(sales_list),
        "count": len(sales_list),
        "avg": sum(sales_list) / len(sales_list)
    }`,
      codeLanguage: "python",
      xpReward: 20,
      order: 12,
      questions: [
        {
          type: "mcq",
          question: "What keyword defines a function in Python?",
          options: ["func", "def", "function"],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "To send a value back from a function, use {{blank}}. Variables created inside a function are {{blank}} by default.",
          blanks: ["return", "local"],
          draggables: ["return", "local", "global", "yield"],
        },
      ],
    },
    {
      pathId,
      title: "Modules & Importing Libraries",
      slug: "modules-importing-libraries",
      storyContext:
        "Dr. Chen opens a Jupyter notebook. 'Nobody writes everything from scratch. We import math, random, and soon—pandas. Stand on the shoulders of giants.'",
      completionStory:
        "Dr. Chen: 'Libraries are your superpower. Next: reading files. Real data lives in CSVs.'",
      characters: ["Dr. Chen"],
      lessonContent: `Import built-in or installed libraries:

• \`import math\` — use \`math.sqrt(16)\`
• \`from math import sqrt\` — use \`sqrt(16)\` directly
• \`import pandas as pd\` — convention for Pandas

\`pip install package_name\` — install before importing`,
      codeSnippet: `# Built-in
import math
print(math.sqrt(49))  # 7.0

import random
print(random.randint(1, 10))

# External (install: pip install pandas)
import pandas as pd
# or: from pandas import DataFrame`,
      codeLanguage: "python",
      xpReward: 15,
      order: 13,
      questions: [
        {
          type: "mcq",
          question: "What is the conventional alias for importing pandas?",
          options: ["import pandas as p", "import pandas as pd", "import pandas as pan"],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "To install a package before importing, use {{blank}}. To import a specific function, use {{blank}}.",
          blanks: ["pip install", "from module import func"],
          draggables: ["pip install", "from module import func", "import", "require"],
        },
      ],
    },
    {
      pathId,
      title: "Basic File I/O & CSV",
      slug: "basic-file-io-csv",
      storyContext:
        "Alex drops another file. 'Client sent a CSV. Your job: read it, understand the structure, write back cleaned data. File I/O is non-negotiable.'",
      completionStory:
        "Alex: 'You can read and write files. Tomorrow we load that CSV into Pandas—game changer.'",
      characters: ["Alex"],
      lessonContent: `**Reading files:**
\`with open("file.txt") as f:\`
\`content = f.read()\`

**Writing:**
\`with open("out.txt", "w") as f:\`
\`f.write("data")\`

**CSV module** — \`import csv\`
• \`csv.reader()\` — read rows
• \`csv.writer()\` — write rows
• \`csv.DictReader()\` — rows as dictionaries`,
      codeSnippet: `import csv

# Read CSV
with open("sales.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["product"], row["revenue"])

# Write CSV
with open("summary.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["Product", "Total"])
    writer.writerow(["A", 1500])`,
      codeLanguage: "python",
      xpReward: 20,
      order: 14,
      questions: [
        {
          type: "mcq",
          question: "Why use 'with open(...) as f' instead of just open()?",
          options: ["It's faster", "It automatically closes the file", "It only works with CSV"],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "To read CSV rows as dictionaries, use {{blank}}. To write rows, use {{blank}}.",
          blanks: ["csv.DictReader()", "csv.writer()"],
          draggables: ["csv.DictReader()", "csv.writer()", "csv.reader()", "open()"],
        },
      ],
    },
    {
      pathId,
      title: "Introduction to Pandas",
      slug: "intro-pandas",
      storyContext:
        "Dr. Chen beams. 'Time for Pandas. This library turns messy CSVs into structured DataFrames. Inspect, slice, transform—everything changes now.'",
      completionStory:
        "Dr. Chen: 'You're thinking in DataFrames. Next: selecting rows and columns, filtering—the real analysis begins.'",
      characters: ["Dr. Chen"],
      lessonContent: `Pandas gives you DataFrames—tables with labeled rows and columns.

Create from CSV: \`df = pd.read_csv("data.csv")\`
Create from dict: \`pd.DataFrame({"A": [1,2], "B": [3,4]})\`

**Inspection:**
• \`df.head()\` — first 5 rows
• \`df.tail()\` — last 5 rows
• \`df.info()\` — types and non-null counts
• \`df.describe()\` — numeric stats`,
      codeSnippet: `import pandas as pd

# From CSV
df = pd.read_csv("sales.csv")

# From dictionary
df = pd.DataFrame({
    "product": ["A", "B", "C"],
    "revenue": [100, 200, 150]
})

print(df.head())
print(df.info())
print(df.describe())`,
      codeLanguage: "python",
      xpReward: 25,
      order: 15,
      questions: [
        {
          type: "mcq",
          question: "What does df.describe() return?",
          options: ["Column names only", "Summary statistics for numeric columns", "The first row"],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "To load a CSV into a DataFrame, use {{blank}}. To see column types and null counts, use {{blank}}.",
          blanks: ["pd.read_csv()", "df.info()"],
          draggables: ["pd.read_csv()", "df.info()", "df.head()", "df.shape"],
        },
      ],
    },
    {
      pathId,
      title: "Basic Data Operations in Pandas",
      slug: "basic-pandas-operations",
      storyContext:
        "Jordan: 'Client wants only Q1 data, only the revenue column. Selection and filtering—this is 80% of your daily Pandas work.'",
      completionStory:
        "Jordan: 'You can slice and filter. Next: visualization. A chart says more than a thousand numbers.'",
      characters: ["Jordan"],
      lessonContent: `**Select columns:** \`df["col"]\` or \`df[["col1","col2"]]\`
**Select rows:** \`df.iloc[0]\` (by position), \`df.loc[0]\` (by label)

**Filter rows:**
\`df[df["revenue"] > 1000]\`
\`df[df["region"].isin(["North","South"])]\`

**Indexing:** \`df.set_index("id")\` for row labels`,
      codeSnippet: `# Select column
revenue = df["revenue"]

# Select multiple columns
subset = df[["product", "revenue", "date"]]

# Filter: revenue > 500
high_value = df[df["revenue"] > 500]

# Filter: product in list
top = df[df["product"].isin(["A", "B", "C"])]

# First 10 rows
sample = df.head(10)`,
      codeLanguage: "python",
      xpReward: 25,
      order: 16,
      questions: [
        {
          type: "mcq",
          question: "How do you filter rows where revenue > 100?",
          options: ["df.filter(revenue > 100)", "df[df['revenue'] > 100]", "df.select(revenue > 100)"],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "To select multiple columns, use {{blank}}. To filter by a list of values, use {{blank}}.",
          blanks: ["df[['col1','col2']]", ".isin()"],
          draggables: ["df[['col1','col2']]", ".isin()", "df.iloc", "df.loc"],
        },
      ],
    },
    {
      pathId,
      title: "Simple Data Visualization with Matplotlib",
      slug: "simple-matplotlib",
      storyContext:
        "Alex: 'The client wants a chart in the deck. Matplotlib—line, bar, scatter. Add titles and labels. Make it presentable.'",
      completionStory:
        "Alex smiles. 'You've got the fundamentals. Dr. Chen has a bigger project for you—the Intermediate path. You're ready.'",
      characters: ["Alex", "Dr. Chen"],
      lessonContent: `Matplotlib creates static plots.

• \`plt.plot(x, y)\` — line chart
• \`plt.bar(categories, values)\` — bar chart
• \`plt.scatter(x, y)\` — scatter plot

Always add: \`plt.title()\`, \`plt.xlabel()\`, \`plt.ylabel()\`, \`plt.legend()\`, \`plt.show()\``,
      codeSnippet: `import matplotlib.pyplot as plt

# Line chart
months = ["Jan", "Feb", "Mar"]
sales = [100, 150, 120]
plt.plot(months, sales, marker="o")
plt.title("Monthly Sales")
plt.xlabel("Month")
plt.ylabel("Revenue ($)")
plt.show()

# Bar chart
plt.bar(months, sales)
plt.title("Sales by Month")
plt.show()`,
      codeLanguage: "python",
      xpReward: 25,
      order: 17,
      questions: [
        {
          type: "mcq",
          question: "Which function creates a scatter plot?",
          options: ["plt.plot()", "plt.scatter()", "plt.bar()"],
          correctAnswerIndex: 1,
        },
        {
          type: "ordering",
          question: "Typical order for a complete plot:",
          itemsToOrder: ["plt.plot() or plt.bar()", "plt.title() and plt.xlabel()", "plt.show()"],
        },
      ],
    },
  ];
}

export function getIntermediateSprints(pathId: Types.ObjectId): SprintSeed[] {
  return [
    {
      pathId,
      title: "Advanced Pandas: Filtering, Grouping, Aggregation",
      slug: "advanced-pandas-groupby",
      storyContext:
        "Dr. Chen returns with a new dataset. 'You know the basics. Now: group sales by region, aggregate by category. groupby, agg, transform—this is where analysis gets powerful.'",
      completionStory:
        "Dr. Chen: 'You're summarizing like a pro. Next we'll combine multiple datasets—merges and joins.'",
      characters: ["Dr. Chen"],
      lessonContent: `**groupby** — split data by a column, apply a function, combine results.

df.groupby("region")["revenue"].sum()
df.groupby("category").agg({"revenue": "sum", "orders": "count"})

**agg** — multiple aggregations at once
**transform** — return same shape as input (e.g. group-normalized values)
**filter** — keep groups that satisfy a condition`,
      codeSnippet: `# Sum revenue by region
by_region = df.groupby("region")["revenue"].sum()

# Multiple aggregations
summary = df.groupby("category").agg({
    "revenue": ["sum", "mean"],
    "order_id": "count"
})

# Transform: subtract group mean
df["revenue_centered"] = df.groupby("region")["revenue"].transform(
    lambda x: x - x.mean()
)`,
      codeLanguage: "python",
      xpReward: 30,
      order: 1,
      questions: [
        {
          type: "mcq",
          question: "What does groupby('region')['revenue'].sum() do?",
          options: ["Sums all revenue", "Sums revenue within each region", "Counts regions"],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "To apply multiple aggregations (sum, mean, count) at once, use {{blank}}. To get values normalized by group, use {{blank}}.",
          blanks: ["agg()", "transform()"],
          draggables: ["agg()", "transform()", "groupby()", "filter()"],
        },
      ],
    },
    {
      pathId,
      title: "Merging & Joining DataFrames",
      slug: "merging-joining-dataframes",
      storyContext:
        "Jordan: 'We have orders in one file, customers in another. The client wants a combined view. Merge and join—like SQL, but in Pandas.'",
      completionStory:
        "Jordan: 'You can combine datasets. Real-world data is always in pieces. Next: cleaning—missing values, duplicates.'",
      characters: ["Jordan"],
      lessonContent: `**pd.merge(left, right, on="key")** — join on a column
• \`how="inner"\` — only matching rows
• \`how="left"\` — all from left, match from right
• \`how="outer"\` — all from both

**pd.concat([df1, df2])** — stack DataFrames (rows or columns)
**df1.join(df2)** — join on index`,
      codeSnippet: `# Merge on common column
combined = pd.merge(orders, customers, on="customer_id", how="left")

# Merge on different column names
combined = pd.merge(orders, products, left_on="product_id", right_on="id")

# Concatenate rows
all_data = pd.concat([df_q1, df_q2, df_q3], ignore_index=True)`,
      codeLanguage: "python",
      xpReward: 30,
      order: 2,
      questions: [
        {
          type: "mcq",
          question: "What does how='left' mean in pd.merge?",
          options: ["Keep only matching rows", "Keep all rows from left, add matches from right", "Keep all rows from both"],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "To stack DataFrames vertically, use {{blank}}. To join on different column names, use {{blank}}.",
          blanks: ["pd.concat()", "left_on / right_on"],
          draggables: ["pd.concat()", "left_on / right_on", "merge()", "join()"],
        },
      ],
    },
    {
      pathId,
      title: "Data Cleaning: Missing Values & Duplicates",
      slug: "data-cleaning-missing-duplicates",
      storyContext:
        "Alex: 'Client data is messy. Missing values, duplicate rows, wrong types. Clean it before you analyze—or your insights are garbage in, garbage out.'",
      completionStory:
        "Alex: 'Clean data is the foundation. Next: string operations and feature engineering. Create new columns from what you have.'",
      characters: ["Alex"],
      lessonContent: `**Missing values (NaN):**
• \`df.isna().sum()\` — count NaNs per column
• \`df.dropna()\` — drop rows with NaNs
• \`df.fillna(0)\` — fill with value
• \`df.fillna(df.mean())\` — fill with column mean

**Duplicates:**
• \`df.duplicated()\` — boolean mask
• \`df.drop_duplicates()\` — remove duplicates

**Types:** \`df.astype({"col": "int"})\``,
      codeSnippet: `# Check missing
print(df.isna().sum())

# Drop rows with any NaN
clean = df.dropna()

# Fill with mean
df["revenue"] = df["revenue"].fillna(df["revenue"].mean())

# Remove duplicates
df_unique = df.drop_duplicates(subset=["customer_id"])

# Convert type
df["order_id"] = df["order_id"].astype(int)`,
      codeLanguage: "python",
      xpReward: 30,
      order: 3,
      questions: [
        {
          type: "mcq",
          question: "What does df.dropna() do?",
          options: ["Fills NaN with 0", "Removes rows with missing values", "Counts NaN values"],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "To fill missing values with the column mean, use {{blank}}. To remove duplicate rows, use {{blank}}.",
          blanks: ["fillna(df['col'].mean())", "drop_duplicates()"],
          draggables: ["fillna(df['col'].mean())", "drop_duplicates()", "isna()", "dropna()"],
        },
      ],
    },
    {
      pathId,
      title: "String Operations & Feature Engineering",
      slug: "string-ops-feature-engineering",
      storyContext:
        "Dr. Chen: 'Product names, categories, dates—all strings. Use .str to clean and extract. Then engineer new features: price per unit, recency, segments.'",
      completionStory:
        "Dr. Chen: 'Feature engineering separates junior from senior analysts. Next: better visualizations with Seaborn.'",
      characters: ["Dr. Chen"],
      lessonContent: `**String methods (Pandas):**
• \`df["col"].str.lower()\`, \`.str.upper()\`
• \`df["col"].str.replace("old", "new")\`
• \`df["col"].str.extract(r"(pattern)")\`
• \`df["col"].str.split("-")\`

**Feature engineering:**
• New columns from existing: \`df["revenue_per_unit"] = df["revenue"] / df["quantity"]\`
• Binning: \`pd.cut(df["age"], bins=[0,18,35,99], labels=["young","adult","senior"])\``,
      codeSnippet: `# String operations
df["email_domain"] = df["email"].str.split("@").str[1]
df["category"] = df["product"].str.replace("OLD_", "").str.upper()

# Feature engineering
df["revenue_per_order"] = df["revenue"] / df["order_count"]
df["price_tier"] = pd.cut(df["price"], bins=[0, 10, 50, 999], labels=["low","mid","high"])`,
      codeLanguage: "python",
      xpReward: 30,
      order: 4,
      questions: [
        {
          type: "mcq",
          question: "How do you access string methods on a Pandas column?",
          options: ["df.col.string()", "df['col'].str.lower()", "df['col'].apply(str)"],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "To create bins/categories from numeric data, use {{blank}}. To split a string and take a part, use {{blank}}.",
          blanks: ["pd.cut()", ".str.split()"],
          draggables: ["pd.cut()", ".str.split()", "pd.qcut()", ".str.extract()"],
        },
      ],
    },
    {
      pathId,
      title: "Intermediate Data Visualization",
      slug: "intermediate-visualization",
      storyContext:
        "Jordan: 'Matplotlib is basic. Subplots, styling, and Seaborn—boxplots, heatmaps. The client wants a dashboard look.'",
      completionStory:
        "Jordan: 'Charts that tell a story. Next: statistics. Mean, median, correlation—the math behind your insights.'",
      characters: ["Jordan"],
      lessonContent: `**Matplotlib advanced:**
• Subplots: \`fig, axes = plt.subplots(2, 2)\`
• Styling: \`plt.style.use("seaborn-v0_8")\`

**Seaborn:**
• \`sns.barplot(data=df, x="cat", y="val")\`
• \`sns.boxplot(data=df, x="cat", y="val")\`
• \`sns.heatmap(df.corr(), annot=True)\`

Import: \`import seaborn as sns\``,
      codeSnippet: `import seaborn as sns
import matplotlib.pyplot as plt

# Subplots
fig, axes = plt.subplots(1, 2, figsize=(12, 5))
df.plot(kind="bar", ax=axes[0])
sns.boxplot(data=df, x="region", y="revenue", ax=axes[1])

# Heatmap of correlations
sns.heatmap(df.corr(), annot=True, cmap="coolwarm")
plt.title("Correlation Matrix")
plt.show()`,
      codeLanguage: "python",
      xpReward: 30,
      order: 5,
      questions: [
        {
          type: "mcq",
          question: "What does sns.heatmap(df.corr()) show?",
          options: ["Missing values", "Correlations between numeric columns", "Duplicate rows"],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "To create multiple plots in one figure, use {{blank}}. For boxplots by category, use {{blank}}.",
          blanks: ["plt.subplots()", "sns.boxplot()"],
          draggables: ["plt.subplots()", "sns.boxplot()", "sns.barplot()", "plt.figure()"],
        },
      ],
    },
    {
      pathId,
      title: "Basic Statistics for Analysis",
      slug: "basic-statistics",
      storyContext:
        "Dr. Chen: 'Before you present, know the numbers. Mean, median, standard deviation, correlation. Speak the language of statistics.'",
      completionStory:
        "Dr. Chen: 'You can justify your insights with stats. Next: write reusable functions—DRY your analysis.'",
      characters: ["Dr. Chen"],
      lessonContent: `**Central tendency:** mean, median, mode
**Spread:** std (standard deviation), variance, IQR

Pandas: \`df["col"].mean()\`, \`.median()\`, \`.std()\`

**Correlation:** \`df["A"].corr(df["B"])\` or \`df.corr()\`
**Covariance:** \`df["A"].cov(df["B"])\`

Interpret: |r| near 1 = strong relationship, near 0 = weak`,
      codeSnippet: `# Summary stats
print(df["revenue"].describe())
print("Median:", df["revenue"].median())
print("Std:", df["revenue"].std())

# Correlation
print(df["price"].corr(df["quantity"]))
print(df[["price", "quantity", "revenue"]].corr())`,
      codeLanguage: "python",
      xpReward: 25,
      order: 6,
      questions: [
        {
          type: "mcq",
          question: "A correlation of -0.9 means:",
          options: ["No relationship", "Strong negative relationship", "Strong positive relationship"],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "To measure spread around the mean, use {{blank}}. To measure how two variables move together, use {{blank}}.",
          blanks: ["standard deviation", "correlation"],
          draggables: ["standard deviation", "correlation", "median", "mean"],
        },
      ],
    },
    {
      pathId,
      title: "Functions for Data Analysis",
      slug: "functions-data-analysis",
      storyContext:
        "Jordan: 'I used to copy-paste the same cleaning steps. Now I have a function: load_and_clean(path). Parameterize, reuse, scale.'",
      completionStory:
        "Jordan: 'Reusable analysis = faster projects. Next: a real EDA project. Sales data, customer data—find the story.'",
      characters: ["Jordan"],
      lessonContent: `Write functions for repeated analysis:

def load_sales(path):
    df = pd.read_csv(path)
    df["date"] = pd.to_datetime(df["date"])
    return df

def summarize_by(df, group_col, value_col):
    return df.groupby(group_col)[value_col].agg(["sum", "mean", "count"])

Use default args, type hints, and docstrings for clarity.`,
      codeSnippet: `def load_and_clean(path):
    """Load CSV, parse dates, fill NaNs."""
    df = pd.read_csv(path)
    df["date"] = pd.to_datetime(df["date"])
    df = df.fillna({"region": "Unknown"})
    return df

def top_n(df, col, n=5):
    return df.nlargest(n, col)

# Reuse across projects
sales = load_and_clean("q1_sales.csv")
top = top_n(sales, "revenue", 10)`,
      codeLanguage: "python",
      xpReward: 25,
      order: 7,
      questions: [
        {
          type: "mcq",
          question: "Why use functions for data analysis?",
          options: ["They run faster", "To avoid repetition and improve maintainability", "Pandas requires them"],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "A {{blank}} describes what a function does. Default {{blank}} allow optional parameters.",
          blanks: ["docstring", "arguments"],
          draggables: ["docstring", "arguments", "return", "def"],
        },
      ],
    },
    {
      pathId,
      title: "Exploratory Data Analysis Project",
      slug: "eda-project",
      storyContext:
        "Alex: 'Real project. Sales dataset—12 months, 50K rows. Run EDA: distributions, trends, segments. Find 3 insights for the client meeting.'",
      completionStory:
        "Alex: 'Those insights will go in the deck. You're thinking like an analyst. Next: pull data from an API—live data.'",
      characters: ["Alex"],
      lessonContent: `EDA workflow:
1. Load and inspect (head, info, describe)
2. Check missing values and duplicates
3. Explore distributions (histograms, value_counts)
4. Find correlations and relationships
5. Segment and compare (groupby, pivot)
6. Visualize key findings

Ask: What's the story? What would the client care about?`,
      codeSnippet: `# EDA workflow
df = pd.read_csv("sales.csv")
print(df.info())
print(df.describe())

# Distributions
df["revenue"].hist(bins=30)
df["region"].value_counts().plot(kind="bar")

# Correlations
print(df.corr())
sns.heatmap(df.corr(), annot=True)

# Top segments
df.groupby("region")["revenue"].sum().sort_values(ascending=False)`,
      codeLanguage: "python",
      xpReward: 35,
      order: 8,
      questions: [
        {
          type: "mcq",
          question: "What is the main goal of EDA?",
          options: ["To build a model", "To explore and understand data, find patterns and insights", "To delete bad rows"],
          correctAnswerIndex: 1,
        },
        {
          type: "ordering",
          question: "Typical EDA workflow order:",
          itemsToOrder: ["Load and inspect", "Check missing/duplicates", "Visualize key findings"],
        },
      ],
    },
    {
      pathId,
      title: "Introduction to APIs & JSON Data",
      slug: "apis-json-data",
      storyContext:
        "Dr. Chen: 'The client's CRM has an API. Real-time data—no more manual CSV exports. requests + JSON parsing. Game changer.'",
      completionStory:
        "Dr. Chen: 'You can pull live data. One more step: simple predictive analysis. Linear regression to forecast.'",
      characters: ["Dr. Chen"],
      lessonContent: `**requests** — fetch data from URLs
\`resp = requests.get("https://api.example.com/data")\`
\`data = resp.json()\`

**JSON** — nested dicts and lists. Access with keys/index.

**Convert to DataFrame:**
\`pd.json_normalize(data["results"])\` for nested JSON
\`pd.DataFrame(data)\` for flat list of dicts`,
      codeSnippet: `import requests
import pandas as pd

# Fetch from API
url = "https://api.example.com/sales"
resp = requests.get(url)
data = resp.json()

# JSON is often nested
results = data["results"]
df = pd.DataFrame(results)

# Or for nested structure
df = pd.json_normalize(data, record_path="items")`,
      codeLanguage: "python",
      xpReward: 30,
      order: 9,
      questions: [
        {
          type: "mcq",
          question: "What does requests.get(url).json() return?",
          options: ["A string", "A Python dict/list (parsed JSON)", "A DataFrame"],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "To fetch data from a URL, use the {{blank}} library. For nested JSON to DataFrame, use {{blank}}.",
          blanks: ["requests", "pd.json_normalize()"],
          draggables: ["requests", "pd.json_normalize()", "urllib", "pd.read_json()"],
        },
      ],
    },
    {
      pathId,
      title: "Simple Linear Regression",
      slug: "simple-linear-regression",
      storyContext:
        "Alex: 'Last sprint. Predict next quarter's revenue from marketing spend. Scikit-learn, train/test split, LinearRegression. Your first model.'",
      completionStory:
        "Alex shakes your hand. 'You've gone from variables to predictions. Welcome to the team. Dr. Chen and Jordan are proud—and so am I.'",
      characters: ["Alex", "Dr. Chen", "Jordan"],
      lessonContent: `Linear regression: predict y from x. y = mx + b

**Workflow:**
1. Split: \`from sklearn.model_selection import train_test_split\`
2. Train: \`from sklearn.linear_model import LinearRegression\`
3. Fit: \`model.fit(X_train, y_train)\`
4. Predict: \`model.predict(X_test)\`
5. Evaluate: compare predictions to actuals`,
      codeSnippet: `from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# Prepare X (features) and y (target)
X = df[["marketing_spend"]]
y = df["revenue"]

# Split 80/20
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train and predict
model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)

# Coefficient
print(f"Slope: {model.coef_[0]:.2f}")`,
      codeLanguage: "python",
      xpReward: 35,
      order: 10,
      questions: [
        {
          type: "mcq",
          question: "Why do we use train_test_split?",
          options: ["To make training faster", "To evaluate the model on unseen data", "To reduce the dataset size"],
          correctAnswerIndex: 1,
        },
        {
          type: "fill_in_blanks",
          question: "The feature matrix is usually called {{blank}}. The target variable is {{blank}}.",
          blanks: ["X", "y"],
          draggables: ["X", "y", "model", "fit"],
        },
      ],
    },
  ];
}
