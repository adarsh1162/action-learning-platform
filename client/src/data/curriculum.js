/**
 * curriculum.js — Single source of truth for all learning content.
 *
 * Structure per topic:
 *   theory    → crisp 2-3 sentence explanation
 *   example   → { code, output } — a working demonstration (NEW — was missing in modules/)
 *   trap      → { code, flaw } — the misconception trap
 *   challenge → { description, buggyCode, testCases, rewardCoins }
 *
 * Structure per module:
 *   mission   → Phase 3 Deep Work Boss Challenge
 */

export const curriculum = {
  modules: [
    // ════════════════════════════════════════════════════════════
    // MODULE 1: Getting Started & Output
    // ════════════════════════════════════════════════════════════
    {
      id: 1,
      title: "Getting Started & Output",
      icon: "⚡",
      color: "#6C5CE7",
      topics: [
        {
          id: "1-1",
          title: "console.log(), warn() & error()",
          microTags: ["#ConsoleOutput", "#Debugging"],
          theory: `The console is JavaScript's communication channel with developers. <code>console.log()</code> prints normal messages in white. <code>console.warn()</code> prints warnings in yellow — signalling something is off. <code>console.error()</code> prints critical errors in red. These tools are strictly for YOU as a developer; the end user never sees them.`,
          example: {
            code: `console.log("Server started on port 3000");
console.warn("Memory usage is at 85%");
console.error("Database connection failed!");`,
            output: `Server started on port 3000      ← white
⚠ Memory usage is at 85%        ← yellow
✖ Database connection failed!   ← red`
          },
          trap: {
            code: `let userStatus = "Offline";
console.log("Status: " + console.error(userStatus));`,
            flaw: `<code>console.error()</code> prints "Offline" in red BUT its return value is <code>undefined</code>. So the outer <code>console.log</code> prints: <strong>"Status: undefined"</strong> — not "Status: Offline". Console methods don't return their argument.`
          },
          challenge: {
            description: 'Print "System Start" as a log, "High CPU" as a warning, and "System Crash" as an error — in that exact order.',
            buggyCode: `// Your mission: use the correct console method for each message
// console.log for normal info, .warn for alerts, .error for critical failures

console.log("System Start");
console.log("High CPU");    // Bug: should be a warning
console.log("System Crash"); // Bug: should be an error`,
            testCases: [
              {
                description: 'Should call console.log with "System Start"',
                assertion: `
assertEqual(__logs.some(l => !l.startsWith('[warn]') && !l.startsWith('[error]') && l.includes('System Start')), true, 'console.log("System Start") not found');
`
              },
              {
                description: 'Should call console.warn with "High CPU"',
                assertion: `
assertEqual(__logs.some(l => l.startsWith('[warn]') && l.includes('High CPU')), true, 'console.warn("High CPU") not found');
`
              },
              {
                description: 'Should call console.error with "System Crash"',
                assertion: `
assertEqual(__logs.some(l => l.startsWith('[error]') && l.includes('System Crash')), true, 'console.error("System Crash") not found');
`
              }
            ],
            rewardCoins: 10,
            missionType: "Warmup"
          }
        },

        {
          id: "1-2",
          title: "Code Execution Order",
          microTags: ["#ExecutionOrder", "#TopToBottom"],
          theory: `JavaScript reads and runs code exactly like a book — top to bottom, line by line. Line 2 never executes until Line 1 is fully complete. The order you write your instructions is the exact order the program follows. JavaScript is also strictly case-sensitive: <code>myVar</code> and <code>MyVar</code> are two completely different things.`,
          example: {
            code: `let score = 0;
console.log(score); // prints 0
score = score + 10;
console.log(score); // prints 10`,
            output: `0
10`
          },
          trap: {
            code: `let currentScore = 10;
console.log("Score:", currentScore);
currentScore = currentScore + 5;
console.log("New score:", CurrentScore); // crash!`,
            flaw: `Line 4 crashes with a <strong>ReferenceError</strong>. <code>CurrentScore</code> (capital C) is a completely different variable from <code>currentScore</code>. JavaScript is case-sensitive — it treats them as two unrelated names and the second one was never defined.`
          },
          challenge: {
            description: 'Declare a variable `health` at 100. Log it. Then reduce it to 50. Log the new value.',
            buggyCode: `// Your mission: show execution order in action
// 1. Create health = 100
// 2. Log it (should print 100)
// 3. Change it to 50
// 4. Log it again (should print 50)

let health = 100;
health = 50;          // Bug: changed BEFORE first log
console.log(health);  // both logs will show 50
console.log(health);`,
            testCases: [
              {
                description: 'First log should print 100',
                assertion: `
assertEqual(Number(__logs[0]), 100, 'First console.log must print 100 before reassignment');
`
              },
              {
                description: 'Second log should print 50',
                assertion: `
assertEqual(Number(__logs[1]), 50, 'Second console.log must print 50 after reassignment');
`
              }
            ],
            rewardCoins: 10,
            missionType: "Warmup"
          }
        },

        {
          id: "1-3",
          title: "Code Comments",
          microTags: ["#Comments", "#CodeReadability"],
          theory: `Comments are notes written for humans — the JavaScript engine ignores them completely. Use <code>//</code> for a single line comment and <code>/* ... */</code> for a block spanning multiple lines. Great comments explain <em>why</em> a decision was made, not what the code does. The code itself should be readable enough to show the "what".`,
          example: {
            code: `// Calculate 10% discount for loyalty members
let price = 500;
let discount = price * 0.10; // 50

/* 
  TODO: Add tier-2 discount (15%) 
  for users with 100+ orders
*/
let finalPrice = price - discount;`,
            output: `(no output — comments are invisible to the engine)`
          },
          trap: {
            code: `let greeting = \`Hello // Welcome User\`;
/* console.log(greeting); 
*/`,
            flaw: `Two traps. First, the <code>//</code> inside backticks is NOT a comment — it's literal text in the string. Second, the actual <code>console.log</code> is trapped inside a <code>/* */</code> block comment, so the engine ignores it completely. The code does absolutely nothing.`
          },
          challenge: {
            description: 'Create a variable `server = "Online"`. Write a single-line comment ABOVE it and a multi-line comment BELOW it.',
            buggyCode: `// TODO: Add your comments around this variable
let server = "Online";`,
            testCases: [
              {
                description: 'server should equal "Online"',
                assertion: `
\
assertEqual(server, "Online");
`
              },
              {
                description: 'Code should contain a single-line comment (//) and a multi-line comment (/* */)',
                assertion: `
const hasSingleLine = __rawCode__.includes('//');
const hasMultiLine = __rawCode__.includes('/*') && __rawCode__.includes('*/');
assertEqual(hasSingleLine, true, 'No single-line comment (//) found');
assertEqual(hasMultiLine, true, 'No multi-line comment (/* */) found');
`
              }
            ],
            rewardCoins: 10,
            missionType: "Warmup"
          }
        },

        {
          id: "1-4",
          title: "Statements vs. Expressions",
          microTags: ["#Expressions", "#Statements"],
          theory: `An <strong>expression</strong> produces a value — like <code>5 + 5</code> or <code>"Hello"</code>. A <strong>statement</strong> performs an action — like <code>let x = 10;</code> or an <code>if/else</code> block. Think of expressions as individual words (nouns) and statements as complete sentences that tell the program to do something.`,
          example: {
            code: `// Expression → produces a value
5 + 10        // → 15
"Hello"       // → "Hello"
age >= 18     // → true or false

// Statement → performs an action
let result = 5 + 10;   // declares + stores the expression
if (result > 0) { ... } // controls program flow`,
            output: `(expressions produce values; statements take actions)`
          },
          trap: {
            code: `let userAge = 20;
let accessGranted = if (userAge > 18) { true } else { false };
console.log(accessGranted);`,
            flaw: `You cannot assign a statement to a variable. The <code>if/else</code> block is a statement — it performs an action. The <code>=</code> operator expects an expression (a value) on its right side. The correct fix is the ternary: <code>let accessGranted = userAge > 18 ? true : false;</code>`
          },
          challenge: {
            description: 'Write an expression that multiplies 10 by 5, and store it in a variable named `result`.',
            buggyCode: `// Bug: result is stored as a string, not a math expression
let result = "10 * 5"; // This is a string, not a calculation!`,
            testCases: [
              {
                description: 'result should equal 50',
                assertion: `
\
assertEqual(result, 50, 'result must equal 50 (10 * 5)');
`
              },
              {
                description: 'result must be a number type, not a string',
                assertion: `
\
assertEqual(typeof result, 'number', 'result must be typeof "number"');
`
              }
            ],
            rewardCoins: 10,
            missionType: "Warmup"
          }
        }
      ],

      mission: {
        title: "The FinTech Server Boot Sequence",
        tier: 1,
        scenario: `You are the junior software engineer on-call at a major payment processing company. The main transaction server just crashed. The automated reboot script — written by a panicked intern — is completely broken. The security firewall requires a specific sequence of system logs to authorize the reboot. If the execution order is wrong, or a warning is logged as a standard message, the firewall locks permanently. You have 10 minutes before millions of transactions fail.`,
        objectives: [
          "Fix the execution order — power supply check must come BEFORE database connection",
          "Use console.warn for power supply, console.error for database failure",
          'Fix the broken expression (missing quotes on "System diagnostic complete")',
          "Add one // comment above the warning and one /* */ comment at the bottom"
        ],
        buggyCode: `console.log("Server reboot initiated.");
/* Check power supply */
console.error("Connecting to main database...");
console.log(System diagnostic complete);

// The next line is a broken statement
console.log("Database connection failed. Retrying...");

console.warn("Power supply unstable.");`,
        testCases: [
          {
            description: 'First output must be "Server reboot initiated." via console.log',
                assertion: `
assertEqual(!__logs[0].startsWith('[warn]') && !__logs[0].startsWith('[error]'), true, 'First output should be a normal log');
assertEqual(__logs[0], 'Server reboot initiated.');
`
          },
          {
            description: '"Power supply unstable." must be console.warn (2nd output)',
                assertion: `
assertEqual(__logs[1].startsWith('[warn]'), true, 'Second output should be a warning');
assertEqual(__logs[1].includes('Power supply unstable.'), true);
`
          },
          {
            description: '"Database connection failed." must be console.error',
                assertion: `
const errorLine = __logs.find(o => o.startsWith('[error]'));
assertEqual(!!errorLine, true, 'No console.error found');
assertEqual(errorLine.includes('Database'), true, 'Error message should mention Database');
`
          }
        ],
        rewardCoins: 15
      }
    },

    // ════════════════════════════════════════════════════════════
    // MODULE 2: Variables & Memory Storage
    // ════════════════════════════════════════════════════════════
    {
      id: 2,
      title: "Variables & Memory Storage",
      icon: "📦",
      color: "#5DCAA5",
      topics: [
        {
          id: "2-1",
          title: "let vs const",
          microTags: ["#let", "#const", "#Mutability"],
          theory: `<code>let</code> declares a variable whose value <em>can be changed</em> later. <code>const</code> declares a variable that is <em>locked forever</em> once set. Use <code>const</code> by default — only switch to <code>let</code> when you know the value will need to change. This prevents accidental overwrites.`,
          example: {
            code: `const PI = 3.14159;       // never changes — use const
let userScore = 0;         // will increase — use let

userScore = 100;           // ✅ works fine
// PI = 3;                 // ❌ TypeError: Assignment to constant`,
            output: `(PI remains 3.14159 forever; userScore can be updated)`
          },
          trap: {
            code: `const rideStatus = "Searching for Driver";
rideStatus = "Driver Arriving"; // CRASH!`,
            flaw: `You cannot reassign a <code>const</code> variable. The engine throws a <strong>TypeError</strong>. The fix: declare <code>rideStatus</code> using <code>let</code> if you need to change its value later.`
          },
          challenge: {
            description: 'Declare a `const` named `MAX_RETRIES` set to 3. Declare a `let` named `retryCount` set to 0. Then increment retryCount to 1.',
            buggyCode: `// Bug: using const for something that must change
const retryCount = 0;
const MAX_RETRIES = 3;
retryCount = 1; // This will crash!`,
            testCases: [
              {
                description: 'MAX_RETRIES should equal 3 and be declared with const',
                assertion: `
\
assertEqual(MAX_RETRIES, 3);
`
              },
              {
                description: 'retryCount should equal 1 after reassignment',
                assertion: `
\
assertEqual(retryCount, 1, 'retryCount must be 1 after increment');
`
              }
            ],
            rewardCoins: 10,
            missionType: "Concept"
          }
        },

        {
          id: "2-2",
          title: "Variable Naming & camelCase",
          microTags: ["#NamingConventions", "#camelCase"],
          theory: `Variable names in JavaScript follow strict rules: they cannot start with a number, cannot contain spaces, and cannot be reserved keywords (<code>let</code>, <code>if</code>, <code>return</code>, etc.). The professional convention is <strong>camelCase</strong> — first word lowercase, each subsequent word capitalized. Example: <code>userFirstName</code>, not <code>user_first_name</code>.`,
          example: {
            code: `// ✅ Valid names
let userName = "Aryan";
let totalItemsInCart = 5;
let isPaymentSuccessful = true;

// ❌ Invalid names
// let 1stOrder = "abc";   → starts with number
// let user-name = "x";   → hyphens not allowed
// let default = "y";     → reserved keyword`,
            output: `(naming errors cause SyntaxError before code even runs)`
          },
          trap: {
            code: `let 1stRiderPickup = "Central Station";
let drop_location = "Airport";
let default = "Standard";`,
            flaw: `Three bugs: <code>1stRiderPickup</code> starts with a digit (illegal). <code>drop_location</code> uses snake_case instead of camelCase. <code>default</code> is a reserved JavaScript keyword. All three cause immediate SyntaxErrors.`
          },
          challenge: {
            description: 'Fix all 3 variable names: rename to valid camelCase names that follow JS conventions.',
            buggyCode: `let 1stPickupPoint = "MG Road";      // starts with number!
let drop_location = "Airport";         // snake_case — not camelCase
let default = "Economy";               // reserved keyword!`,
            testCases: [
              {
                description: 'Code must run without SyntaxError',
                assertion: `
let ranWithoutError = true;
try { \ } catch(e) { ranWithoutError = false; }
assertEqual(ranWithoutError, true, 'Code still has a SyntaxError');
`
              },
              {
                description: 'No variable name should contain an underscore',
                assertion: `
const hasUnderscore = __rawCode__.match(/let [a-zA-Z_$]*_[a-zA-Z_$]*/);
assertEqual(!!hasUnderscore, false, 'Remove underscores — use camelCase');
`
              }
            ],
            rewardCoins: 10,
            missionType: "Concept"
          }
        },

        {
          id: "2-3",
          title: "undefined — The Unassigned State",
          microTags: ["#undefined", "#Memory"],
          theory: `When you declare a variable with <code>let</code> but don't assign a value, JavaScript automatically gives it the value <code>undefined</code>. It literally means "this box in memory exists, but nothing has been put in it yet." You will encounter this in debug output frequently — it's not an error, it's a state.`,
          example: {
            code: `let driverName;         // declared, not assigned
console.log(driverName); // → undefined

driverName = "Ravi";    // now assigned
console.log(driverName); // → "Ravi"`,
            output: `undefined
Ravi`
          },
          trap: {
            code: `let assignedDriver;
console.log("Your driver is:", assignedDriver);`,
            flaw: `The output shows: <strong>"Your driver is: undefined"</strong>. The variable was declared but never given a value. The user's app shows a blank glitch. Always assign a value before using a variable in output.`
          },
          challenge: {
            description: 'Declare `passengerName`, assign it "Priya", then log it. Verify it\'s not undefined.',
            buggyCode: `// Bug: variable declared but never assigned
let passengerName;
console.log("Passenger:", passengerName); // shows "undefined"!`,
            testCases: [
              {
                description: 'passengerName should not be undefined',
                assertion: `
\
assertEqual(passengerName !== undefined, true, 'passengerName is still undefined — assign a value!');
`
              },
              {
                description: 'passengerName should be a string',
                assertion: `
\
assertEqual(typeof passengerName, 'string', 'passengerName must be a string');
`
              }
            ],
            rewardCoins: 10,
            missionType: "Concept"
          }
        }
      ],

      mission: {
        title: "The Ride-Share Ghost Driver",
        tier: 2,
        scenario: `You are a backend engineer at a major ride-sharing startup. The dispatch system is experiencing a critical failure. Customers' apps crash with "Syntax Error" and display drivers' names as "undefined". The code was written by an intern during a server outage — it's filled with illegal variable names, broken memory rules, and reserved keywords. Fix the memory allocation block before the company loses thousands of users.`,
        objectives: [
          "Rename 1stRiderPickup — starts with a digit (illegal)",
          "Rename drop_location to camelCase (no underscores)",
          "Rename default — it's a reserved JavaScript keyword",
          "Change rideStatus from const to let so it can be updated",
          "Assign a driver name string to assignedDriver before the console.log"
        ],
        buggyCode: `/* --- SYSTEM ALERT: DISPATCH ALLOCATION FAILING --- */

let 1stRiderPickup = "Central Station";
const maxPassengers = 4;
let drop_location = "International Airport";
let default = "Standard Ride";

const rideStatus = "Searching for Driver";
rideStatus = "Driver Arriving"; // TypeError!

let assignedDriver;
console.log("Your driver is:", assignedDriver);`,
        testCases: [
          {
            description: 'Code must execute without any SyntaxError or TypeError',
            assertion: `
let success = true;
try { \ } catch(e) { success = false; }
assertEqual(success, true, 'Code crashes: ' + (typeof e !== 'undefined' ? e.message : 'unknown error'));
`
          },
          {
            description: 'No variable name should start with a digit',
            assertion: `
const hasDigitStart = /let \d/.test(__rawCode__);
assertEqual(hasDigitStart, false, 'A variable name still starts with a digit');
`
          },
          {
            description: 'No underscore variable names (must use camelCase)',
            assertion: `
const hasUnderscore = /let [a-zA-Z$][a-zA-Z0-9$]*_/.test(__rawCode__);
assertEqual(hasUnderscore, false, 'Still using snake_case — convert to camelCase');
`
          }
        ],
        rewardCoins: 20
      }
    },

    // ════════════════════════════════════════════════════════════
    // MODULE 3: Primitive Data Types
    // ════════════════════════════════════════════════════════════
    {
      id: 3,
      title: "Primitive Data Types",
      icon: "🔢",
      color: "#EF9F27",
      topics: [
        {
          id: "3-1",
          title: "Numbers & NaN",
          microTags: ["#Numbers", "#NaN"],
          theory: `JavaScript has exactly ONE number type for both integers (<code>10</code>) and decimals (<code>10.5</code>). <code>NaN</code> (Not-a-Number) appears when a math operation fails — like dividing a word by a number. The bizarre truth: <code>typeof NaN === "number"</code> — it's technically classified as a number despite its name.`,
          example: {
            code: `let price = 499;          // integer
let discount = 0.15;      // float (decimal)
let broken = "abc" * 5;   // → NaN

console.log(typeof price);    // "number"
console.log(typeof broken);   // "number" ← still "number"!
console.log(Number.isNaN(broken)); // true ← correct way to check`,
            output: `"number"
"number"
true`
          },
          trap: {
            code: `let cartTotal = "Apple" * 5;
if (cartTotal === NaN) {
    console.log("Error: Calculation failed.");
}`,
            flaw: `<code>cartTotal</code> correctly becomes <code>NaN</code>, but <strong>NaN is never equal to anything — not even itself.</strong> <code>NaN === NaN</code> always returns <code>false</code>. The <code>if</code> block never runs. Always use <code>Number.isNaN()</code> to detect NaN.`
          },
          challenge: {
            description: 'Create a `price` (integer), a `taxRate` (decimal), and a `badCalc` that produces NaN. Verify NaN with Number.isNaN().',
            buggyCode: `// Create 3 variables:
// price = any integer
// taxRate = any decimal like 0.08
// badCalc = something that produces NaN (e.g., "text" * 5)

let price = 100;
let taxRate = 0.08;
let badCalc = 0; // Bug: 0 is not NaN — make it a failed math op`,
            testCases: [
              {
                description: 'price should be an integer (number)',
                assertion: `\\nassertEqual(typeof price, 'number');\nassertEqual(Number.isInteger(price), true, 'price must be a whole number');`
              },
              {
                description: 'taxRate should be a decimal (float)',
                assertion: `\\nassertEqual(typeof taxRate, 'number');\nassertEqual(Number.isInteger(taxRate), false, 'taxRate must be a decimal');`
              },
              {
                description: 'badCalc should be NaN',
                assertion: `\\nassertEqual(Number.isNaN(badCalc), true, 'badCalc must produce NaN — try "text" * 5');`
              }
            ],
            rewardCoins: 15,
            missionType: "Concept"
          }
        },

        {
          id: "3-2",
          title: "Strings & Template Literals",
          microTags: ["#Strings", "#TemplateLiterals"],
          theory: `Strings are text wrapped in single (<code>'</code>), double (<code>"</code>), or backtick (<code>\`</code>) quotes. Backticks (template literals) are the modern standard — they let you embed variables directly using <code>\${variableName}</code> without messy <code>+</code> concatenation. They also support multi-line text naturally.`,
          example: {
            code: `let user = "Priya";
let coins = 250;

// Old way (messy)
let msg1 = "Hello " + user + ", you have " + coins + " coins.";

// Modern way (template literal)
let msg2 = \`Hello \${user}, you have \${coins} coins.\`;

console.log(msg2);`,
            output: `Hello Priya, you have 250 coins.`
          },
          trap: {
            code: `let itemsInCart = 12;
let msg = 'You have \${itemsInCart} items.';
console.log(msg);`,
            flaw: `The output is: <strong>"You have \${itemsInCart} items."</strong> — the variable name printed literally! The <code>\${}</code> syntax ONLY works inside backticks (<code>\`</code>). Single quotes treat <code>\${itemsInCart}</code> as plain text characters.`
          },
          challenge: {
            description: 'Create `userName` and `level`. Build a `welcomeMsg` using a template literal that injects both.',
            buggyCode: `let userName = "Arjun";
let level = 5;
// Bug: using + concatenation instead of template literals
let welcomeMsg = "Welcome " + userName + ", you're at level " + level;`,
            testCases: [
              {
                description: 'welcomeMsg must use a template literal (backticks)',
                assertion: `
const usesTemplateLiteral = __rawCode__.includes('\`');
assertEqual(usesTemplateLiteral, true, 'Must use backticks (\`) for template literal');
`
              },
              {
                description: 'welcomeMsg must contain the userName value',
                assertion: `\\nassertEqual(welcomeMsg.includes(userName), true, 'welcomeMsg must include the userName variable value');`
              }
            ],
            rewardCoins: 15,
            missionType: "Concept"
          }
        },

        {
          id: "3-3",
          title: "Booleans, null & undefined",
          microTags: ["#Boolean", "#null", "#undefined"],
          theory: `A <strong>Boolean</strong> has two states: <code>true</code> or <code>false</code> (no quotes). <code>null</code> is a deliberate assignment meaning "intentionally empty." <code>undefined</code> is the system's default when a variable is declared but never assigned. These are three completely different states — confusing them causes security bugs.`,
          example: {
            code: `let isLoggedIn = true;          // boolean — a light switch
let uploadedFile = null;        // null — deliberately empty
let pendingData;                // undefined — not set yet

console.log(typeof isLoggedIn);   // "boolean"
console.log(typeof uploadedFile); // "object" ← JS quirk!
console.log(typeof pendingData);  // "undefined"`,
            output: `"boolean"
"object"
"undefined"`
          },
          trap: {
            code: `let isAdmin = "false";
if (isAdmin) {
    console.log("Access Granted to Server.");
}`,
            flaw: `<strong>"Access Granted"</strong> logs even though the developer meant <code>false</code>. They wrapped it in quotes, making it a String. Any non-empty string — even <code>"false"</code> — is <strong>Truthy</strong> in JavaScript. The <code>if</code> block fires, granting admin access to everyone. Always use the boolean <code>false</code> without quotes.`
          },
          challenge: {
            description: 'Declare `hasPassedExam = true` (boolean), `submittedWork = null` (intentional empty), and an unassigned `futureScore`.',
            buggyCode: `// Bug: booleans are incorrectly stored as strings
let hasPassedExam = "true";     // Should be boolean true
let submittedWork = undefined;  // Should be null (intentional empty)
let futureScore = 0;            // Should be unassigned (undefined)`,
            testCases: [
              {
                description: 'hasPassedExam must be boolean true (not string "true")',
                assertion: `\\nassertEqual(typeof hasPassedExam, 'boolean', 'hasPassedExam must be typeof boolean');\nassertEqual(hasPassedExam, true);`
              },
              {
                description: 'submittedWork must be null',
                assertion: `\\nassertEqual(submittedWork, null, 'submittedWork must be null, not undefined');`
              },
              {
                description: 'futureScore must be undefined (unassigned)',
                assertion: `\\nassertEqual(typeof futureScore, 'undefined', 'futureScore must be left unassigned');`
              }
            ],
            rewardCoins: 15,
            missionType: "Concept"
          }
        }
      ],

      mission: {
        title: "The FinTech KYC Pipeline Collapse",
        tier: 3,
        scenario: `You are a security engineer at a global banking app. The KYC (Know Your Customer) data pipeline is critically failing. New users can't open accounts because the validation script corrupts their data — strings break the compiler, math produces NaN, booleans are faked as text. Fix the pipeline before the regulatory system flags the bank.`,
        objectives: [
          "Fix the string quotes on applicantName (mixed quote types = SyntaxError)",
          "Change taxMultiplier from \"Five\" (string) to 5 (number) to fix the NaN",
          "Change isIdentityVerified from \"true\" (string) to true (boolean)",
          "Change uploadedDocuments from undefined to null (intentional empty)",
          "Rewrite finalLog using a template literal — no + operators"
        ],
        buggyCode: `/* --- SYSTEM ALERT: KYC DATA CORRUPTION --- */

let applicantName = 'Sarah O"Connor";
let annualIncome = 85000;
let taxMultiplier = "Five";
let calculatedTax = annualIncome / taxMultiplier;

let isIdentityVerified = "true";
let uploadedDocuments = undefined;

let finalLog = 'Applicant: \${applicantName} | Tax: ' + calculatedTax + ' | Verified: ' + isIdentityVerified;
console.log(finalLog);`,
        testCases: [
          {
            description: 'calculatedTax must be a valid number (not NaN)',
            assertion: `\\nassertEqual(Number.isNaN(calculatedTax), false, 'calculatedTax is NaN — fix taxMultiplier to be a number');\nassertEqual(calculatedTax, 17000, 'calculatedTax should be 85000 / 5 = 17000');`
          },
          {
            description: 'isIdentityVerified must be boolean true',
            assertion: `\\nassertEqual(typeof isIdentityVerified, 'boolean', 'isIdentityVerified must be a boolean, not a string');\nassertEqual(isIdentityVerified, true);`
          },
          {
            description: 'uploadedDocuments must be null',
            assertion: `\\nassertEqual(uploadedDocuments, null, 'uploadedDocuments should be null, not undefined');`
          },
          {
            description: 'finalLog must use template literals (no + for strings)',
            assertion: `
const usesPlusForStrings = /\`[^]+\`/.test(__rawCode__);
const usesTemplateLit = __rawCode__.includes('\`') && __rawCode__.includes('\${');
assertEqual(usesTemplateLit, true, 'finalLog must use a template literal with \${} syntax');
`
          }
        ],
        rewardCoins: 30
      }
    },

    // ════════════════════════════════════════════════════════════
    // MODULE 4: Basic Math & Operators (abbreviated for space)
    // ════════════════════════════════════════════════════════════
    {
      id: 4,
      title: "Basic Math & Operators",
      icon: "➗",
      color: "#E24B4A",
      topics: [
        {
          id: "4-1",
          title: "Arithmetic Operators + - * /",
          microTags: ["#Arithmetic", "#Operators"],
          theory: `JavaScript uses standard math symbols: <code>+</code> addition, <code>-</code> subtraction, <code>*</code> multiplication, <code>/</code> division. Critical trap: when <code>+</code> is used with a string, it switches from math to <em>text concatenation</em>, ignoring all math rules.`,
          example: {
            code: `let price = 500;
let tax = 50;
let total = price + tax;          // → 550 (math)

let label = "Total: " + 550;     // → "Total: 550" (concatenation)
let wrong = "100" + 50;           // → "10050" (NOT 150!)
let fixed = Number("100") + 50;   // → 150 ✅`,
            output: `550
"Total: 550"
"10050"
150`
          },
          trap: {
            code: `let finalValue = "10" + 5 - 2;`,
            flaw: `The answer is <strong>103</strong>, not 13. Left to right: <code>"10" + 5</code> → concatenation → <code>"105"</code>. Then <code>"105" - 2</code> → JavaScript converts the string back to a number → <code>103</code>. The <code>-</code> operator always forces numbers, but <code>+</code> with a string always concatenates first.`
          },
          challenge: {
            description: 'Calculate: sum of 15+5, difference of 20-8, product of 4×6, quotient of 50÷10.',
            buggyCode: `// Store each calculation in its own variable
let sum = "20";        // Bug: hardcoded string, not a calculation!
let difference = 12;   // needs to be calculated
let product = 24;      // needs to be calculated
let quotient = 5;      // needs to be calculated`,
            testCases: [
              { description: 'sum must equal 20 (calculated)', assertion: `\\nassertEqual(sum, 20);` },
              { description: 'difference must equal 12 (calculated)', assertion: `\\nassertEqual(difference, 12);` },
              { description: 'product must equal 24 (calculated)', assertion: `\\nassertEqual(product, 24);` },
              { description: 'quotient must equal 5 (calculated)', assertion: `\\nassertEqual(quotient, 5);` }
            ],
            rewardCoins: 10,
            missionType: "Concept"
          }
        },

        {
          id: "4-2",
          title: "Modulo % & Assignment Shortcuts",
          microTags: ["#Modulo", "#AssignmentOperators"],
          theory: `The <strong>modulo</strong> operator (<code>%</code>) returns the <em>remainder</em> after division — not the quotient. <code>10 % 3 = 1</code> (10 ÷ 3 = 3 remainder 1). Assignment shortcuts (<code>+=</code>, <code>-=</code>, <code>*=</code>) let you modify a variable in place. Instead of <code>x = x + 5</code>, write <code>x += 5</code>.`,
          example: {
            code: `// Modulo — check if even or odd
let num = 7;
console.log(num % 2);    // → 1 (odd: has a remainder)
console.log(8 % 2);      // → 0 (even: divides perfectly)

// Assignment shortcuts
let score = 100;
score += 50;   // score = 150
score -= 20;   // score = 130
score *= 2;    // score = 260`,
            output: `1
0
(score ends at 260)`
          },
          trap: {
            code: `let playerHealth = 100;
playerHealth =- 20;`,
            flaw: `Health doesn't drop to 80 — it jumps to <strong>-20</strong>. The developer wrote <code>=-</code> instead of <code>-=</code>. JavaScript reads it as <code>playerHealth = (-20)</code> — a reassignment to negative twenty, not a subtraction. Operator order matters: always write <code>-=</code>.`
          },
          challenge: {
            description: 'Start bankBalance at 1000. Using shortcuts only: add 500, subtract 200, multiply by 2.',
            buggyCode: `let bankBalance = 1000;
// Bug: using long-form instead of shorthand operators
bankBalance = bankBalance + 500;
bankBalance = bankBalance - 200;
bankBalance = bankBalance * 2;`,
            testCases: [
              { description: 'bankBalance must equal 2600', assertion: `\\nassertEqual(bankBalance, 2600, 'Expected (1000+500-200)*2 = 2600');` },
              { description: 'Code must use += operator', assertion: `assertEqual(__rawCode__.includes('+='), true, 'Must use += shorthand');` },
              { description: 'Code must use -= operator', assertion: `assertEqual(__rawCode__.includes('-='), true, 'Must use -= shorthand');` },
              { description: 'Code must use *= operator', assertion: `assertEqual(__rawCode__.includes('*='), true, 'Must use *= shorthand');` }
            ],
            rewardCoins: 15,
            missionType: "Concept"
          }
        },

        {
          id: "4-3",
          title: "Operator Precedence & Math Object",
          microTags: ["#PEMDAS", "#MathObject"],
          theory: `JavaScript follows PEMDAS: <code>()</code> first, then <code>*</code> and <code>/</code>, then <code>+</code> and <code>-</code>. Use parentheses to override. The built-in <code>Math</code> object gives you: <code>Math.round()</code> (nearest), <code>Math.floor()</code> (always down), <code>Math.ceil()</code> (always up), and <code>Math.random()</code> (0 to 0.9999...).`,
          example: {
            code: `// Precedence: * before +
let wrong = 10 + 2 * 5;       // → 20 (not 60!)
let right  = (10 + 2) * 5;    // → 60 ✅ parentheses first

// Math object
Math.round(4.6)   // → 5
Math.floor(4.9)   // → 4 (always goes down)
Math.ceil(4.1)    // → 5 (always goes up)
Math.floor(Math.random() * 10) // random integer 0-9`,
            output: `20
60
5, 4, 5
(random number 0-9)`
          },
          trap: {
            code: `let mappedValue = Math.floor(-2.5);`,
            flaw: `Beginners expect <code>-2</code> (just chop the decimal). But <code>Math.floor</code> goes to the <em>lowest</em> integer. On a number line, <code>-3</code> is lower than <code>-2.5</code>. So <code>Math.floor(-2.5)</code> returns <strong>-3</strong>.`
          },
          challenge: {
            description: 'Calculate average of scores 80, 90, 100. Must use parentheses. Result should be 90.',
            buggyCode: `// Bug: missing parentheses — wrong precedence!
let score1 = 80, score2 = 90, score3 = 100;
let average = score1 + score2 + score3 / 3; // BUG: only divides score3!`,
            testCases: [
              { description: 'average must equal 90', assertion: `\\nassertEqual(average, 90, 'Expected (80+90+100)/3 = 90 — use parentheses!');` },
              { description: 'Code must use parentheses', assertion: `assertEqual(__rawCode__.includes('('), true, 'Must use parentheses for correct order of operations');` }
            ],
            rewardCoins: 15,
            missionType: "Concept"
          }
        }
      ],

      mission: {
        title: "The AI Flashcard Token & Leaderboard Engine",
        tier: 4,
        scenario: `You are the lead backend developer for a competitive AI study app. The nightly cron script that calculates student scores and deducts API tokens is critically broken. Top students get wrong scores due to precedence failures, token billing rounds incorrectly, and the server router uses division instead of remainders. Fix the math before the leaderboard updates.`,
        objectives: [
          "Add parentheses so (baseScore + streakBonus) is calculated BEFORE multiplying by multiplier",
          "Change Math.round to Math.floor AND use -= for the token deduction",
          "Replace loginDays + 1 with the ++ increment operator",
          "Replace the / division with % modulo for server shard routing",
          "Wrap Math.random() * 10 inside Math.floor() for a clean integer"
        ],
        buggyCode: `let baseScore = 500;
let streakBonus = 20;
let multiplier = 1.5;
let finalScore = baseScore + streakBonus * multiplier; // precedence bug!

let userTokens = 1000;
let apiCost = 45.9;
userTokens = userTokens - Math.round(apiCost); // should be Math.floor + -=

let loginDays = 14;
let newLoginCount = loginDays + 1; // use ++ instead

let serverShard = finalScore / 3; // should be % for remainder

let challengeId = Math.random() * 10; // should be integer`,
        testCases: [
          { description: 'finalScore must equal 780 (parentheses fix)', assertion: `\\nassertEqual(finalScore, 780, 'Use (baseScore + streakBonus) * multiplier');` },
          { description: 'userTokens must equal 955 (Math.floor(45.9) = 45)', assertion: `\\nassertEqual(userTokens, 955, 'Math.floor(45.9)=45, 1000-45=955');` },
          { description: 'serverShard must be 0 (780 % 3 = 0)', assertion: `\\nassertEqual(serverShard, 0, '780 % 3 = 0');` },
          { description: 'challengeId must be a whole integer', assertion: `\\nassertEqual(challengeId % 1, 0, 'challengeId must be an integer (use Math.floor)');` }
        ],
        rewardCoins: 40
      }
    },

    // ════════════════════════════════════════════════════════════
    // MODULE 5: Type Conversion & Coercion
    // ════════════════════════════════════════════════════════════
    {
      id: 5,
      title: "Type Conversion & Coercion",
      icon: "🔄",
      color: "#A89CFF",
      topics: [
        {
          id: "5-1",
          title: "Explicit Conversion: Number(), String(), Boolean()",
          microTags: ["#TypeConversion", "#Explicit"],
          theory: `<strong>Explicit conversion</strong> is when YOU manually change a data type using built-in functions. <code>Number("42")</code> converts the string <code>"42"</code> to the number <code>42</code>. <code>String(100)</code> converts to <code>"100"</code>. <code>Boolean(0)</code> converts to <code>false</code>. This is the safe, predictable way to convert types.`,
          example: {
            code: `// String to Number
Number("99")      // → 99
Number("hello")   // → NaN (can't convert text to number)
Number("")        // → 0

// Number to String
String(500)       // → "500"

// To Boolean
Boolean(1)        // → true
Boolean(0)        // → false
Boolean("hi")     // → true
Boolean("")       // → false`,
            output: `99, NaN, 0
"500"
true, false, true, false`
          },
          trap: {
            code: `let productPrice = "120";
let shippingTax = "15";
let cartTotal = productPrice + shippingTax;
console.log(cartTotal);`,
            flaw: `Output is <strong>"12015"</strong> — not 135. The <code>+</code> operator sees two strings and concatenates instead of adding. You must explicitly convert before adding: <code>Number(productPrice) + Number(shippingTax)</code> → <code>135</code>.`
          },
          challenge: {
            description: 'Convert `"200"` and `"75"` to numbers and add them. The result must be 275, not "20075".',
            buggyCode: `let price = "200";
let bonus = "75";
// Bug: + concatenates strings instead of adding numbers
let total = price + bonus; // → "20075" ← WRONG!`,
            testCases: [
              { description: 'total must equal 275 (not "20075")', assertion: `\\nassertEqual(total, 275, 'Must use Number() to convert before adding');` },
              { description: 'total must be typeof number', assertion: `\\nassertEqual(typeof total, 'number', 'total must be a number, not a string');` }
            ],
            rewardCoins: 15,
            missionType: "Concept"
          }
        },

        {
          id: "5-2",
          title: "Truthy & Falsy Values",
          microTags: ["#Truthy", "#Falsy", "#Coercion"],
          theory: `Every value in JavaScript is either "truthy" (behaves like <code>true</code> in an <code>if</code> check) or "falsy" (behaves like <code>false</code>). There are exactly <strong>6 falsy values</strong>: <code>0</code>, <code>""</code> (empty string), <code>null</code>, <code>undefined</code>, <code>NaN</code>, and <code>false</code>. Everything else — including <code>"0"</code>, <code>"false"</code>, and <code>[]</code> — is truthy.`,
          example: {
            code: `// These all evaluate as FALSE in an if check
if (0)         { } // skipped
if ("")        { } // skipped
if (null)      { } // skipped
if (undefined) { } // skipped

// These all evaluate as TRUE (even though they look "empty")
if ("0")       { console.log("truthy!") } // ← runs!
if ("false")   { console.log("truthy!") } // ← runs!
if ([])        { console.log("truthy!") } // ← runs!`,
            output: `"truthy!"
"truthy!"
"truthy!"`
          },
          trap: {
            code: `let hasVoucher = "false";
if (hasVoucher) {
    console.log("Voucher Accepted. Deducting $20.");
}`,
            flaw: `<strong>"Voucher Accepted"</strong> logs even though the developer intended <code>false</code>. The string <code>"false"</code> is not the boolean <code>false</code> — it's a non-empty string, which is <strong>Truthy</strong>. The fix: reassign to the actual boolean <code>false</code> (no quotes).`
          },
          challenge: {
            description: 'Fix the checkout: convert price strings to numbers, change "false" voucher to boolean false, and empty out the whitespace coupon.',
            buggyCode: `let price = "120";
let shipping = "15";
let hasVoucher = "false"; // string, should be boolean
let coupon = " ";         // space = truthy, should be empty ""

// Bug: all these checks fire incorrectly
let cartTotal = price + shipping; // becomes "12015"
if (hasVoucher) console.log("Voucher accepted");
if (coupon) console.log("Coupon applied");`,
            testCases: [
              { description: 'cartTotal must be 135 (number)', assertion: `\\nassertEqual(cartTotal, 135);` },
              { description: 'hasVoucher must be boolean false', assertion: `\\nassertEqual(hasVoucher, false);\nassertEqual(typeof hasVoucher, 'boolean');` },
              { description: 'coupon must be empty string (falsy)', assertion: `\\nassertEqual(coupon === '', true, 'coupon must be empty string ""');` }
            ],
            rewardCoins: 20,
            missionType: "Concept"
          }
        }
      ],

      mission: {
        title: "The Corrupted Checkout Payload",
        tier: 5,
        scenario: `You are a full-stack developer at a major e-commerce platform. During a holiday sale, the frontend sends ALL data to your server as text strings. Because of implicit coercion, checkout math breaks. Customers are charged thousands because + concatenates strings, expired vouchers are accepted because "false" is truthy, and whitespace coupons slip through. Fix it before mass refunds are issued.`,
        objectives: [
          "Explicitly convert productPrice and shippingTax to numbers before adding",
          "Convert userPoints to Number() — the string \"0\" is truthy, the number 0 is falsy",
          "Reassign hasVoucher to the boolean false (no quotes)",
          "Reassign couponInput to empty string \"\" to make it falsy"
        ],
        buggyCode: `let productPrice = "120";
let shippingTax = "15";
let userPoints = "0";
let hasVoucher = "false";
let couponInput = " ";

let cartTotal = productPrice + shippingTax; // "12015" not 135!

if (hasVoucher) {
    console.log("Voucher Accepted. Deducting $20.");
    cartTotal = cartTotal - 20;
}
if (couponInput) { console.log("Applying Special Coupon."); }
if (userPoints)  { console.log("Processing User Points."); }`,
        testCases: [
          { description: 'cartTotal must be 135', assertion: `\\nassertEqual(cartTotal, 135, 'Convert strings to numbers before adding');` },
          { description: '"Voucher Accepted" must NOT log', assertion: `assertEqual(__logs.some(l => l.includes('Voucher')), false, 'hasVoucher should be false');` },
          { description: '"Processing User Points" must NOT log', assertion: `assertEqual(__logs.some(l => l.includes('Points')), false, 'userPoints should be falsy number 0');` }
        ],
        rewardCoins: 18
      }
    },

    // ════════════════════════════════════════════════════════════
    // MODULE 6: Logic & Conditionals
    // ════════════════════════════════════════════════════════════
    {
      id: 6,
      title: "Logic & Conditionals",
      icon: "🔀",
      color: "#5DCAA5",
      topics: [
        {
          id: "6-1",
          title: "Comparison Operators > < >= <=",
          microTags: ["#Comparison", "#Operators"],
          theory: `Comparison operators compare two values and always return a <strong>Boolean</strong> (<code>true</code> or <code>false</code>). Use <code>></code>, <code><</code>, <code>>=</code>, <code><=</code>. Critical rule: always compare numbers with numbers. If you compare strings, JavaScript compares them <em>alphabetically by character</em> — so <code>"10" > "2"</code> is <code>false</code> because "1" comes before "2" alphabetically.`,
          example: {
            code: `let score = 85;
console.log(score >= 75);  // → true (85 is at least 75)
console.log(score < 50);   // → false

// String comparison trap
console.log("10" > "2");   // → false ← alphabetical, not numeric!
console.log(10 > 2);       // → true  ← correct numeric comparison`,
            output: `true
false
false
true`
          },
          trap: {
            code: `let currentLevel = "10";
let nextLevel = "2";
if (currentLevel > nextLevel) {
    console.log("Proceeding to level 10.");
} else {
    console.log("Error: Level scaling failed.");
}`,
            flaw: `Logs <strong>"Error: Level scaling failed."</strong> even though 10 > 2. Since both are strings, JavaScript compares character by character. <code>"1"</code> vs <code>"2"</code>: alphabetically, "1" comes before "2", so <code>"10" > "2"</code> evaluates to <code>false</code>. Fix: convert to numbers first.`
          },
          challenge: {
            description: 'Set `passingScore = 50` and `studentScore = 50`. Store `studentScore >= passingScore` in `hasPassed`.',
            buggyCode: `let passingScore = 50;
let studentScore = 50;
// Bug: using > instead of >= (student at exactly 50 should pass)
let hasPassed = studentScore > passingScore;`,
            testCases: [
              { description: 'hasPassed must be true when scores are equal', assertion: `\\nassertEqual(hasPassed, true, 'studentScore >= passingScore should be true when equal');` },
              { description: 'Code must use >= operator', assertion: `assertEqual(__rawCode__.includes('>='), true, 'Must use >= not just >');` }
            ],
            rewardCoins: 10,
            missionType: "Concept"
          }
        },

        {
          id: "6-2",
          title: "Strict vs Loose Equality === vs ==",
          microTags: ["#StrictEquality", "#LooseEquality"],
          theory: `<code>===</code> (strict equality) checks <strong>both value AND type</strong> — no background magic. <code>==</code> (loose equality) allows JavaScript to secretly change types to force a match, causing unpredictable bugs. Professional rule: <strong>always use <code>===</code></strong>. Loose equality is explicitly banned in most codebases.`,
          example: {
            code: `// Strict === checks type too
0 === false    // → false (different types: number vs boolean)
"5" === 5      // → false (string vs number)
5 === 5        // → true ✅

// Loose == ignores type (dangerous!)
0 == false     // → true ← JS secretly converts types
"5" == 5       // → true ← coerces "5" to number
null == undefined // → true ← both "empty-ish"`,
            output: `false, false, true
true, true, true ← all surprises`
          },
          trap: {
            code: `let systemError = NaN;
if (systemError === NaN) {
    console.log("Critical Failure Detected.");
} else {
    console.log("System Stable.");
}`,
            flaw: `Logs <strong>"System Stable."</strong> despite an actual error. <code>NaN</code> is the only value in JavaScript that is <em>not equal to itself</em>. <code>NaN === NaN</code> always returns <code>false</code>. To detect NaN, always use <code>Number.isNaN(systemError)</code>.`
          },
          challenge: {
            description: 'Compare integer `pinCode = 1234` and string `userInput = "1234"` using ===. Store in `isMatch`.',
            buggyCode: `let pinCode = 1234;
let userInput = "1234";
// Bug: using == allows type coercion (unsafe!)
let isMatch = pinCode == userInput; // this would be true — wrong!`,
            testCases: [
              { description: 'isMatch must be false (different types)', assertion: `\\nassertEqual(isMatch, false, '1234 (number) !== "1234" (string) with strict equality');` },
              { description: 'Code must use === not ==', assertion: `assertEqual(__rawCode__.includes('==='), true, 'Must use === for strict equality');\nassertEqual(__rawCode__.includes('==') && !__rawCode__.includes('==='), false, 'Remove == and use ===');` }
            ],
            rewardCoins: 10,
            missionType: "Concept"
          }
        },

        {
          id: "6-3",
          title: "if / else if / else",
          microTags: ["#Conditionals", "#IfElse"],
          theory: `The <code>if</code> block runs its code when its condition is truthy. <code>else</code> is the guaranteed fallback — no condition, just runs when everything above fails. <code>else if</code> lets you chain multiple specific checks. The engine evaluates them <strong>top-to-bottom and stops at the first true condition</strong> — ordering is critical.`,
          example: {
            code: `let score = 95;

// WRONG order — "Bronze" always wins for 95!
if (score >= 50) { console.log("Bronze"); }
else if (score >= 75) { console.log("Silver"); }
else if (score >= 95) { console.log("Gold"); }

// CORRECT order — most restrictive first
if (score >= 95) { console.log("Gold"); }
else if (score >= 75) { console.log("Silver"); }
else if (score >= 50) { console.log("Bronze"); }
else { console.log("No rank"); }`,
            output: `"Bronze" ← BUG (wrong order)
"Gold"   ← CORRECT`
          },
          trap: {
            code: `let isAdmin = false;
if (isAdmin === true); {
    console.log("Deleting Database...");
}`,
            flaw: `The database deletion code ALWAYS runs. A semicolon <code>;</code> after the <code>if</code> parenthesis ends the statement immediately. The <code>{}</code> block below is now treated as standalone code — a completely separate block that always executes, regardless of <code>isAdmin</code>.`
          },
          challenge: {
            description: 'Write a speed checker: log "Speeding" if >80, "Normal" if >40, "Slow" otherwise.',
            buggyCode: `let speed = 90;
// Bug: wrong order — the first condition swallows everything!
if (speed > 40) {
    console.log("Normal"); // 90 hits this first and stops!
} else if (speed > 80) {
    console.log("Speeding"); // never reached for speed=90
} else {
    console.log("Slow");
}`,
            testCases: [
              { description: 'speed=90 must log "Speeding"', assertion: `assertEqual(__logs[0], 'Speeding', 'speed=90 must log "Speeding"');` },
              { description: 'Code must use if (speed > 80)', assertion: `assertEqual(__rawCode__.includes('speed > 80') || __rawCode__.includes('speed >= 81'), true, 'Missing check for > 80');` },
              { description: 'Code must use else if (speed > 40)', assertion: `assertEqual(__rawCode__.includes('speed > 40') || __rawCode__.includes('speed >= 41'), true, 'Missing check for > 40');` }
            ],
            rewardCoins: 15,
            missionType: "Concept"
          }
        },

        {
          id: "6-4",
          title: "Logical Operators && || ! and Ternary",
          microTags: ["#LogicalOperators", "#Ternary", "#ShortCircuit"],
          theory: `<code>&&</code> (AND) requires <em>all</em> conditions to be true. <code>||</code> (OR) needs <em>at least one</em> to be true. <code>!</code> (NOT) flips a boolean. The <strong>ternary operator</strong> is a one-line if/else: <code>condition ? valueIfTrue : valueIfFalse</code>. All of these short-circuit — they stop evaluating as soon as the result is determined.`,
          example: {
            code: `let isAdult = true;
let hasTicket = false;

// AND — both must be true
if (isAdult && hasTicket) { console.log("Enter"); }

// OR — at least one
if (isAdult || hasTicket) { console.log("Maybe"); }

// Ternary
let access = isAdult ? "Allowed" : "Denied";
console.log(access);`,
            output: `(AND block skipped — hasTicket is false)
"Maybe"
"Allowed"`
          },
          trap: {
            code: `let playerPoints = 150;
let rank;
playerPoints > 100 ? let rank = "Pro" : let rank = "Amateur";`,
            flaw: `Fatal SyntaxError. You cannot <code>let</code> declare variables inside ternary branches. The ternary must return a value that gets assigned. Correct: <code>let rank = playerPoints > 100 ? "Pro" : "Amateur";</code>`
          },
          challenge: {
            description: 'Use a ternary to assign "Adult" or "Minor" based on age >= 18. No if/else allowed.',
            buggyCode: `let age = 20;
// Bug: using if/else when ternary is required
let status;
if (age >= 18) {
    status = "Adult";
} else {
    status = "Minor";
}`,
            testCases: [
              { description: 'status must equal "Adult" when age=20', assertion: `\\nassertEqual(status, 'Adult');` },
              { description: 'Code must use ternary operator (?) not if/else', assertion: `assertEqual(__rawCode__.includes('?'), true, 'Must use ternary operator ?');\nassertEqual(__rawCode__.includes('if'), false, 'Remove if/else — use ternary');` }
            ],
            rewardCoins: 15,
            missionType: "Concept"
          }
        }
      ],

      mission: {
        title: "The Anti-Cheat Leaderboard Engine",
        tier: 6,
        scenario: `You are the lead security engineer for a high-stakes programming tournament. The grand finale is live but the anti-cheat engine is malfunctioning. Legitimate grandmasters are getting locked while actual cheaters slip through. Logic gates are broken due to loose equality, wrong logical operators, backwards if-else hierarchy, and invalid ternary syntax. Fix it in 10 minutes before the leaderboard becomes permanent.`,
        objectives: [
          "Change == to === in Security Gate (loose equality lets string '0' slip as false)",
          "Change || to && in Manual Review (should lock ONLY IF both: high score AND no proctor)",
          "Reorder the tier checks — Grandmaster (>=95) must come BEFORE Silver (>=75) and Bronze (>=50)",
          "Fix the ternary: let fastTrack = completionTime < 30 ? 'Approved' : 'Denied'"
        ],
        buggyCode: `let userScore = 98;
let cheatFlags = "0";
let isProctorActive = false;
let completionTime = 25;

// 1. Security Gate (loose equality bug)
if (cheatFlags == false) {
    console.log("Security Pass: Account cleared.");
}

// 2. Manual Review (wrong logical operator)
if (userScore > 90 || !isProctorActive) {
    console.log("Account Locked: Suspicious score.");
}

// 3. Leaderboard Tiers (wrong order)
if (userScore >= 50) {
    console.log("Tier: Bronze");
} else if (userScore >= 75) {
    console.log("Tier: Silver");
} else if (userScore >= 95) {
    console.log("Tier: Grandmaster");
}

// 4. Ternary Crash
completionTime < 30 ? let fastTrack = "Approved" : let fastTrack = "Denied";`,
        testCases: [
          { description: 'userScore 98 must log "Tier: Grandmaster"', assertion: `assertEqual(__logs.some(l=>l.includes('Grandmaster')), true, 'Fix the if-else order');` },
          { description: '"Account Locked" must log (both conditions true)', assertion: `assertEqual(__logs.some(l=>l.includes('Locked')), true, 'Change || to && in Manual Review');` },
          { description: 'fastTrack must equal "Approved"', assertion: `\\nassertEqual(fastTrack, 'Approved', 'Fix ternary syntax: let fastTrack = condition ? val : val');` },
          { description: 'Code must use === not == for cheatFlags', assertion: `assertEqual(__rawCode__.includes('==='), true, 'Use === for strict equality on cheatFlags');` }
        ],
        rewardCoins: 25
      }
    }
  ]
};

export default curriculum;
