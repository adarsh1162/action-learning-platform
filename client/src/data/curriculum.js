/**
 * curriculum.js — Single source of truth for all learning content.
 * Updated automatically by buildCurriculum.js
 */

export const curriculum = {
  modules: [
    {
      id: 1,
      title: `Getting Started & Output`,
      icon: `⚡`,
      color: `#6C5CE7`,
      topics: [
        {
          id: `1-1`,
          title: `The Output: \`console.log()\`, \`console.error()\`, and \`console.warn()\``,
          microTags: [
            `#ConsoleOutput`,
            `#Debugging`
          ],
          theory: `Imagine you're playing a game.

You press a button.

Nothing happens.

No score changes.

No animation.

No message.

Now answer this:

Was the button broken?

Did the game crash?

Did your click even reach the game?

You have no idea.

---

Programming has the same problem.

When your code runs, JavaScript is constantly making decisions.

The problem is:

You can't see those decisions.

That's why developers use the console.

The console is not for users.

It's for you.

It's your window into what JavaScript is doing behind the scenes.

---

Look at this:

\`\`\`javascript
console.log("Payment received");
\`\`\`

You're basically telling JavaScript:

> "Show me this information."

---

<div class="predict-block">
  <div class="predict-header">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
    PREDICT FIRST
  </div>
  <p>Without running it, which message appears first?</p>
  
\`\`\`javascript
console.log("Starting");
console.error("Failed");
console.warn("Retrying");
\`\`\`

  <div class="predict-options">
    <div class="predict-option correct">A. Starting, then Failed, then Retrying (Top to Bottom)</div>
    <div class="predict-option">B. Failed appears first because errors have priority</div>
    <div class="predict-option">C. They all appear at the exact same time</div>
  </div>
</div>

---

If your answer was **A**:

Good.

Notice something important.

JavaScript executes code exactly in the order you write it.

Top to bottom.

Always.

<div class="memory-anchor">
  <div class="memory-anchor-title">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
    Remember This
  </div>
  <div class="memory-anchor-text">
    The console is your primary debugging tool. JavaScript executes your code from <strong>top to bottom</strong>, one line at a time.
  </div>
</div>

---

The three console tools you'll use most often are:

\`\`\`javascript
console.log()
\`\`\`

Normal information.

---

\`\`\`javascript
console.warn()
\`\`\`

Something looks suspicious.

The program still works.

---

\`\`\`javascript
console.error()
\`\`\`

Something has already gone wrong.

---

Now think about this code:

\`\`\`javascript
console.log("Status: " + console.error("Offline"));
\`\`\`

Predict the output before continuing.

Most beginners expect:

\`\`\`text
Status: Offline
\`\`\`

That's wrong.

The error prints:

\`\`\`text
Offline
\`\`\`

But \`console.error()\` itself returns:

\`\`\`text
undefined
\`\`\`

Which means the log becomes:

\`\`\`text
Status: undefined
\`\`\`

This feels weird.

Good.

Weird things are usually remembered.

---

### The Rule

The console is a debugging tool.

It shows you what JavaScript is doing.

It does not change what JavaScript is doing.

---`,
          trap: {
            code: `let userStatus = "Offline";
console.log("Status: " + console.error(userStatus));`,
            flaw: `<code>console.error()</code> prints "Offline" in red BUT its return value is <code>undefined</code>. So the outer <code>console.log</code> prints: <strong>"Status: undefined"</strong> — not "Status: Offline". Console methods don't return their argument.`
          },
          challenge: {
            description: `Print "System Start" as a log, "High CPU" as a warning, and "System Crash" as an error — in that exact order.`,
            buggyCode: `// Your mission: use the correct console method for each message
// console.log for normal info, .warn for alerts, .error for critical failures

console.log("System Start");
console.log("High CPU");    // Bug: should be a warning
console.log("System Crash"); // Bug: should be an error`,
            testCases: [
              {
                description: `Should call console.log with "System Start"`,
                assertion: `
assertEqual(__logs.some(l => !l.startsWith('[warn]') && !l.startsWith('[error]') && l.includes('System Start')), true, 'console.log("System Start") not found');
`
              },
              {
                description: `Should call console.warn with "High CPU"`,
                assertion: `
assertEqual(__logs.some(l => l.startsWith('[warn]') && l.includes('High CPU')), true, 'console.warn("High CPU") not found');
`
              },
              {
                description: `Should call console.error with "System Crash"`,
                assertion: `
assertEqual(__logs.some(l => l.startsWith('[error]') && l.includes('System Crash')), true, 'console.error("System Crash") not found');
`
              }
            ],
            rewardCoins: 10,
            missionType: `Warmup`
          }
        },
        {
          id: `1-2`,
          title: `Code Execution Order`,
          microTags: [
            `#ExecutionOrder`,
            `#TopToBottom`
          ],
          theory: `Let's kill a dangerous belief early.

Many beginners think:

> "The computer knows what I meant."

It doesn't.

Not even a little.

The computer only knows what you wrote.

---

Look at this:

\`\`\`javascript
let score = 10;

console.log(score);

score = score + 5;

console.log(score);
\`\`\`

Before reading further:

What gets printed?

---

Most people answer:

\`\`\`text
10
15
\`\`\`

Correct.

Now here's the important question:

Why?

---

Did JavaScript look ahead?

Did it notice the future value?

Did it plan the entire program?

No.

---

It simply read one line.

Finished it.

Moved to the next.

Finished it.

Moved again.

That's all.

---

Think about a recipe.

Imagine the first instruction says:

\`\`\`text
Add sugar
\`\`\`

and the second says:

\`\`\`text
Bake cake
\`\`\`

You can't bake before adding sugar.

The order matters.

Code works the same way.

---

Now predict:

\`\`\`javascript
let currentScore = 10;

console.log(currentScore);

currentScore = currentScore + 5;

console.log(CurrentScore);
\`\`\`

Will it print:

\`\`\`text
15
\`\`\`

or crash?

---

Many beginners focus on the math.

The real bug is elsewhere.

JavaScript is case-sensitive.

\`currentScore\` and \`CurrentScore\` are different names.

One exists.

One doesn't.

---

This exact mistake causes thousands of real-world bugs.

---

### The Rule

JavaScript generally executes code from top to bottom, one instruction at a time.

When debugging, ask:

> "What line is JavaScript reading right now?"

Not:

> "What was I trying to do?"

---`,
          trap: {
            code: `let currentScore = 10;
console.log("Score:", currentScore);
currentScore = currentScore + 5;
console.log("New score:", CurrentScore); // crash!`,
            flaw: `Line 4 crashes with a <strong>ReferenceError</strong>. <code>CurrentScore</code> (capital C) is a completely different variable from <code>currentScore</code>. JavaScript is case-sensitive — it treats them as two unrelated names and the second one was never defined.`
          },
          challenge: {
            description: `Declare a variable \`health\` at 100. Log it. Then reduce it to 50. Log the new value.`,
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
                description: `First log should print 100`,
                assertion: `
assertEqual(Number(__logs[0]), 100, 'First console.log must print 100 before reassignment');
`
              },
              {
                description: `Second log should print 50`,
                assertion: `
assertEqual(Number(__logs[1]), 50, 'Second console.log must print 50 after reassignment');
`
              }
            ],
            rewardCoins: 10,
            missionType: `Warmup`
          }
        },
        {
          id: `1-3`,
          title: `Understanding Code Comments`,
          microTags: [
            `#Comments`,
            `#CodeReadability`
          ],
          theory: `A question.

Who are comments written for?

JavaScript?

Or humans?

---

Most beginners say:

> Humans.

Correct.

But the important part is what happens next.

JavaScript completely ignores them.

---

Look at this:

\`\`\`javascript
// Temporary fix
\`\`\`

JavaScript skips it.

---

Look at this:

\`\`\`javascript
/*
Need to optimize later
*/
\`\`\`

JavaScript skips this too.

---

Now predict:

\`\`\`javascript
// console.log("Hello");

console.log("Welcome");
\`\`\`

What gets printed?

---

Only:

\`\`\`text
Welcome
\`\`\`

The first line is no longer code.

It's just a note.

---

Now here's a trap.

Predict this:

\`\`\`javascript
let message = "Hello // Welcome User";
\`\`\`

Is that a comment?

---

No.

Because it's inside a string.

JavaScript treats it as normal text.

---

This distinction becomes important when debugging.

Because JavaScript doesn't care what something looks like.

It cares where it appears.

---

Bad comment:

\`\`\`javascript
// Store age
let age = 18;
\`\`\`

The code already tells us that.

---

Good comment:

\`\`\`javascript
// Required by legal regulations
let minimumAge = 18;
\`\`\`

Now we know why.

---

### The Rule

Good comments explain decisions.

Not obvious code.

---`,
          trap: {
            code: `let greeting = \`Hello // Welcome User\`;
/* console.log(greeting); 
*/`,
            flaw: `Two traps. First, the <code>//</code> inside backticks is NOT a comment — it's literal text in the string. Second, the actual <code>console.log</code> is trapped inside a <code>/* */</code> block comment, so the engine ignores it completely. The code does absolutely nothing.`
          },
          challenge: {
            description: `Create a variable \`server = "Online"\`. Write a single-line comment ABOVE it and a multi-line comment BELOW it.`,
            buggyCode: `// TODO: Add your comments around this variable
let server = "Online";`,
            testCases: [
              {
                description: `server should equal "Online"`,
                assertion: `
assertEqual(server, "Online");
`
              },
              {
                description: `Code should contain a single-line comment (//) and a multi-line comment (/* */)`,
                assertion: `
const hasSingleLine = __rawCode__.includes('//');
const hasMultiLine = __rawCode__.includes('/*') && __rawCode__.includes('*/');
assertEqual(hasSingleLine, true, 'No single-line comment (//) found');
assertEqual(hasMultiLine, true, 'No multi-line comment (/* */) found');
`
              }
            ],
            rewardCoins: 10,
            missionType: `Warmup`
          }
        },
        {
          id: `1-4`,
          title: `Statements vs. Expressions`,
          microTags: [
            `#Expressions`,
            `#Statements`
          ],
          theory: `This topic sounds boring.

It's not.

In fact, this idea quietly powers almost everything you'll learn later.

Functions.

Conditions.

Loops.

React.

All of it.

---

Let's start simple.

What does this produce?

\`\`\`javascript
10 * 5
\`\`\`

Answer:

\`\`\`text
50
\`\`\`

---

That piece of code creates a value.

Anything that creates a value is called an expression.

---

Now look at this:

\`\`\`javascript
let result = 10 * 5;
\`\`\`

The multiplication is still creating a value.

But the entire line is doing something else too.

It's storing that value.

It's performing an action.

That's a statement.

---

A quick mental shortcut:

Expressions produce values.

Statements perform actions.

---

Now predict:

\`\`\`javascript
let accessGranted =
if (userAge > 18) {
    true;
}
\`\`\`

Valid or invalid?

---

Many beginners think:

> "The if returns true."

But that's not how JavaScript sees it.

\`if\` is a statement.

The \`=\` operator expects a value.

Those two expectations collide.

And the code breaks.

---

The goal isn't to memorize a definition.

The goal is to ask:

> "Does this piece of code create a value, or perform an action?"

That single question will become surprisingly useful later.

---`,
          trap: {
            code: `let userAge = 20;
let accessGranted = if (userAge > 18) { true } else { false };
console.log(accessGranted);`,
            flaw: `You cannot assign a statement to a variable. The <code>if/else</code> block is a statement — it performs an action. The <code>=</code> operator expects an expression (a value) on its right side. The correct fix is the ternary: <code>let accessGranted = userAge > 18 ? true : false;</code>`
          },
          challenge: {
            description: `Write an expression that multiplies 10 by 5, and store it in a variable named \`result\`.`,
            buggyCode: `// Bug: result is stored as a string, not a math expression
let result = "10 * 5"; // This is a string, not a calculation!`,
            testCases: [
              {
                description: `result should equal 50`,
                assertion: `
assertEqual(result, 50, 'result must equal 50 (10 * 5)');
`
              },
              {
                description: `result must be a number type, not a string`,
                assertion: `
assertEqual(typeof result, 'number', 'result must be typeof "number"');
`
              }
            ],
            rewardCoins: 10,
            missionType: `Warmup`
          }
        }
      ],
      mission: {
        title: `The FinTech Server Boot Sequence`,
        tier: 1,
        scenario: `You are the junior software engineer on-call at a major payment processing company. The main transaction server just crashed. The automated reboot script — written by a panicked intern — is completely broken. The security firewall requires a specific sequence of system logs to authorize the reboot. If the execution order is wrong, or a warning is logged as a standard message, the firewall locks permanently. You have 10 minutes before millions of transactions fail.`,
        objectives: [
          `Fix the execution order — power supply check must come BEFORE database connection`,
          `Use console.warn for power supply, console.error for database failure`,
          `Fix the broken expression (missing quotes on "System diagnostic complete")`,
          `Add one // comment above the warning and one /* */ comment at the bottom`
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
            description: `First output must be "Server reboot initiated." via console.log`,
            assertion: `
assertEqual(!__logs[0].startsWith('[warn]') && !__logs[0].startsWith('[error]'), true, 'First output should be a normal log');
assertEqual(__logs[0], 'Server reboot initiated.');
`
          },
          {
            description: `"Power supply unstable." must be console.warn (2nd output)`,
            assertion: `
assertEqual(__logs[1].startsWith('[warn]'), true, 'Second output should be a warning');
assertEqual(__logs[1].includes('Power supply unstable.'), true);
`
          },
          {
            description: `"Database connection failed." must be console.error`,
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
    {
      id: 2,
      title: `Variables & Memory Storage`,
      icon: `📦`,
      color: `#5DCAA5`,
      topics: [
        {
          id: `2-1`,
          title: `Variables`,
          microTags: [
            `#let`,
            `#const`,
            `#Mutability`
          ],
          theory: `Imagine you're building Uber.

A customer opens the app and requests a ride.

You now have information that must be remembered:

* Customer name
* Pickup location
* Destination
* Driver name
* Fare amount

Where should all that information go?

JavaScript needs memory.

Variables are how we reserve that memory.

---

Look at this:

\`\`\`javascript
let driverName = "Sarah";
\`\`\`

Read it like English:

> Create a piece of memory called \`driverName\` and store \`"Sarah"\` inside it.

---

Now predict:

\`\`\`javascript
let driverName = "Sarah";

console.log(driverName);
\`\`\`

What gets printed?

Don't run it.

Actually answer first.

---

You probably said:

\`\`\`text
Sarah
\`\`\`

Correct.

Because variables don't store questions.

They store values.

When JavaScript sees \`driverName\`, it goes to memory and fetches whatever is currently stored there.

---

Now try this:

\`\`\`javascript
let driverName = "Sarah";

driverName = "Alex";

console.log(driverName);
\`\`\`

What prints?

Most people say:

\`\`\`text
Alex
\`\`\`

Correct again.

But here's the important part.

JavaScript did not create a second variable.

The old value was replaced.

---

That's the first mental model you need:

> Variables are named locations in memory.
>
> The value inside them can change.

---

Quick prediction:

\`\`\`javascript
let passengerCount = 2;

passengerCount = 4;

passengerCount = 6;

console.log(passengerCount);
\`\`\`

What prints?

If your answer wasn't 6, read the section again.

---`,
          trap: {
            code: `const rideStatus = "Searching for Driver";
rideStatus = "Driver Arriving"; // CRASH!`,
            flaw: `You cannot reassign a <code>const</code> variable. The engine throws a <strong>TypeError</strong>. The fix: declare <code>rideStatus</code> using <code>let</code> if you need to change its value later.`
          },
          challenge: {
            description: `Declare a \`const\` named \`MAX_RETRIES\` set to 3. Declare a \`let\` named \`retryCount\` set to 0. Then increment retryCount to 1.`,
            buggyCode: `// Bug: using const for something that must change
const retryCount = 0;
const MAX_RETRIES = 3;
retryCount = 1; // This will crash!`,
            testCases: [
              {
                description: `MAX_RETRIES should equal 3 and be declared with const`,
                assertion: `
assertEqual(MAX_RETRIES, 3);
`
              },
              {
                description: `retryCount should equal 1 after reassignment`,
                assertion: `
assertEqual(retryCount, 1, 'retryCount must be 1 after increment');
`
              }
            ],
            rewardCoins: 10,
            missionType: `Concept`
          }
        },
        {
          id: `2-2`,
          title: `Variable Naming Rules`,
          microTags: [
            `#NamingConventions`,
            `#camelCase`
          ],
          theory: `Most beginners think variable names are just labels.

They aren't.

They're part of JavaScript's grammar.

Break the rules and the program won't even start.

---

Predict this:

\`\`\`javascript
let userAge = 25;
\`\`\`

Valid or invalid?

Easy.

Valid.

---

Now predict:

\`\`\`javascript
let 1userAge = 25;
\`\`\`

Valid or invalid?

---

Many beginners know it's wrong.

Very few know why.

---

Imagine reading this:

\`\`\`javascript
1userAge
\`\`\`

JavaScript sees:

\`\`\`text
1
\`\`\`

and immediately thinks:

> "I'm reading a number."

Then suddenly:

\`\`\`text
userAge
\`\`\`

appears.

Now the engine has no idea what it's looking at.

Number?

Variable?

Math expression?

Syntax error?

---

Instead of guessing, JavaScript stops.

Immediately.

---

Variable names can contain:

\`\`\`text
letters
numbers
$
_
\`\`\`

But they cannot start with a number.

---

Quick prediction:

\`\`\`javascript
let player1Score = 500;
\`\`\`

Valid or invalid?

---

What about:

\`\`\`javascript
let 1playerScore = 500;
\`\`\`

---

This seems like a tiny rule.

But one broken variable name can prevent an entire application from starting.

---`,
          trap: {
            code: `let 1stRiderPickup = "Central Station";
let drop_location = "Airport";
let default = "Standard";`,
            flaw: `Three bugs: <code>1stRiderPickup</code> starts with a digit (illegal). <code>drop_location</code> uses snake_case instead of camelCase. <code>default</code> is a reserved JavaScript keyword. All three cause immediate SyntaxErrors.`
          },
          challenge: {
            description: `Fix all 3 variable names: rename to valid camelCase names that follow JS conventions.`,
            buggyCode: `let 1stPickupPoint = "MG Road";      // starts with number!
let drop_location = "Airport";         // snake_case — not camelCase
let default = "Economy";               // reserved keyword!`,
            testCases: [
              {
                description: `Code must run without SyntaxError`,
                assertion: `
let ranWithoutError = true;
try {  } catch(e) { ranWithoutError = false; }
assertEqual(ranWithoutError, true, 'Code still has a SyntaxError');
`
              },
              {
                description: `No variable name should contain an underscore`,
                assertion: `
const hasUnderscore = __rawCode__.match(/let [a-zA-Z_$]*_[a-zA-Z_$]*/);
assertEqual(!!hasUnderscore, false, 'Remove underscores — use camelCase');
`
              }
            ],
            rewardCoins: 10,
            missionType: `Concept`
          }
        },
        {
          id: `2-3`,
          title: `Naming Conventions (camelCase)`,
          microTags: [
            `#undefined`,
            `#Memory`
          ],
          theory: `Let's be honest.

The computer doesn't care whether you write:

\`\`\`javascript
let username;
\`\`\`

or

\`\`\`javascript
let user_name;
\`\`\`

or

\`\`\`javascript
let USER_NAME;
\`\`\`

JavaScript can read all of them.

Humans are the problem.

---

Imagine opening a codebase with:

\`\`\`javascript
let x;
let abc;
let data;
let thing;
\`\`\`

Nobody knows what these mean.

Not even the person who wrote them six months ago.

---

Now compare:

\`\`\`javascript
let userName;
let rideDestination;
let accountBalance;
\`\`\`

Much easier.

---

Most JavaScript developers follow a convention called camelCase.

\`\`\`javascript
userName
rideDestination
accountBalance
\`\`\`

The first word starts lowercase.

Every new word starts with a capital letter.

---

Notice something:

\`\`\`javascript
rideDestination
\`\`\`

contains no spaces.

Yet your brain can read it instantly.

That's the whole point.

---

Quick prediction:

Which version would most professional JavaScript teams prefer?

\`\`\`javascript
drop_location
\`\`\`

or

\`\`\`javascript
dropLocation
\`\`\`

---

The second one.

Not because JavaScript requires it.

Because humans do.

And humans are the ones fixing bugs at 2 AM.

---`,
          trap: {
            code: `let assignedDriver;
console.log("Your driver is:", assignedDriver);`,
            flaw: `The output shows: <strong>"Your driver is: undefined"</strong>. The variable was declared but never given a value. The user's app shows a blank glitch. Always assign a value before using a variable in output.`
          },
          challenge: {
            description: `Declare \`passengerName\`, assign it "Priya", then log it. Verify it's not undefined.`,
            buggyCode: `// Bug: variable declared but never assigned
let passengerName;
console.log("Passenger:", passengerName); // shows "undefined"!`,
            testCases: [
              {
                description: `passengerName should not be undefined`,
                assertion: `
assertEqual(passengerName !== undefined, true, 'passengerName is still undefined — assign a value!');
`
              },
              {
                description: `passengerName should be a string`,
                assertion: `
assertEqual(typeof passengerName, 'string', 'passengerName must be a string');
`
              }
            ],
            rewardCoins: 10,
            missionType: `Concept`
          }
        },
        {
          id: `2-4`,
          title: `let vs const`,
          microTags: [
            `#Theory`,
            `#Concept`
          ],
          theory: `This topic causes more confusion than it should.

Let's start with a prediction.

---

What happens here?

\`\`\`javascript
const appName = "RideFast";

appName = "QuickRide";
\`\`\`

A)

Value changes

B)

Nothing happens

C)

Program crashes

---

Pick one before continuing.

---

The answer is:

\`\`\`text
C
\`\`\`

The program crashes.

---

Why?

Because \`const\` means:

> This variable may not be reassigned.

The value is locked.

The moment you try to replace it, JavaScript throws an error.

---

Now compare:

\`\`\`javascript
let rideStatus = "Searching";

rideStatus = "Driver Found";
\`\`\`

Perfectly fine.

---

Because \`let\` was created for values that change.

And many things change.

---

Examples:

\`\`\`javascript
let score = 0;
\`\`\`

Changes constantly.

---

\`\`\`javascript
let currentPage = 1;
\`\`\`

Changes constantly.

---

\`\`\`javascript
let rideStatus = "Searching";
\`\`\`

Changes constantly.

---

But this?

\`\`\`javascript
const companyName = "Uber";
\`\`\`

Probably shouldn't change while the application is running.

---

A useful question:

Before creating any variable, ask:

> Will I need to replace this value later?

If yes:

\`\`\`javascript
let
\`\`\`

If no:

\`\`\`javascript
const
\`\`\`

---

Now predict:

\`\`\`javascript
const maxPassengers = 4;

maxPassengers = 6;
\`\`\`

What happens?

And why?

---

Remember that question.

You're going to see this exact bug later.

---`,
          trap: {
            code: `// No trap defined yet`,
            flaw: `Understanding the theory deeply is the key here.`
          },
          challenge: {
            description: `Review the theory and experiment with these concepts.`,
            buggyCode: `// Experiment here`,
            testCases: [],
            rewardCoins: 5,
            missionType: `Warmup`
          }
        },
        {
          id: `2-5`,
          title: `undefined`,
          microTags: [
            `#Theory`,
            `#Concept`
          ],
          theory: `Imagine opening a ride-sharing app and seeing:

\`\`\`text
Driver Assigned:
undefined
\`\`\`

Looks broken, right?

---

Most beginners think \`undefined\` means:

> Error.

Not true.

---

Look at this:

\`\`\`javascript
let assignedDriver;
\`\`\`

What value is inside it?

---

Nothing was assigned.

So JavaScript says:

\`\`\`text
undefined
\`\`\`

---

The variable exists.

The data doesn't.

That's an important distinction.

---

Think of it like a hotel room.

The room exists.

Nobody has checked in yet.

---

Now predict:

\`\`\`javascript
let assignedDriver;

console.log(assignedDriver);
\`\`\`

What prints?

---

Answer:

\`\`\`text
undefined
\`\`\`

---

Now predict:

\`\`\`javascript
let assignedDriver;

assignedDriver = "Sarah";

console.log(assignedDriver);
\`\`\`

What prints?

---

Now the room is occupied.

JavaScript prints:

\`\`\`text
Sarah
\`\`\`

---

This tiny concept is responsible for an enormous number of real-world bugs.

Usually when you see:

\`\`\`text
undefined
\`\`\`

the question is not:

> "Why is JavaScript broken?"

The question is:

> "Why did I forget to put data here?"

---`,
          trap: {
            code: `// No trap defined yet`,
            flaw: `Understanding the theory deeply is the key here.`
          },
          challenge: {
            description: `Review the theory and experiment with these concepts.`,
            buggyCode: `// Experiment here`,
            testCases: [],
            rewardCoins: 5,
            missionType: `Warmup`
          }
        }
      ],
      mission: {
        title: `The Ride-Share Ghost Driver`,
        tier: 2,
        scenario: `You are a backend engineer at a major ride-sharing startup. The dispatch system is experiencing a critical failure. Customers' apps crash with "Syntax Error" and display drivers' names as "undefined". The code was written by an intern during a server outage — it's filled with illegal variable names, broken memory rules, and reserved keywords. Fix the memory allocation block before the company loses thousands of users.`,
        objectives: [
          `Rename 1stRiderPickup — starts with a digit (illegal)`,
          `Rename drop_location to camelCase (no underscores)`,
          `Rename default — it's a reserved JavaScript keyword`,
          `Change rideStatus from const to let so it can be updated`,
          `Assign a driver name string to assignedDriver before the console.log`
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
            description: `Code must execute without any SyntaxError or TypeError`,
            assertion: `
let success = true;
try {  } catch(e) { success = false; }
assertEqual(success, true, 'Code crashes: ' + (typeof e !== 'undefined' ? e.message : 'unknown error'));
`
          },
          {
            description: `No variable name should start with a digit`,
            assertion: `
const hasDigitStart = /let d/.test(__rawCode__);
assertEqual(hasDigitStart, false, 'A variable name still starts with a digit');
`
          },
          {
            description: `No underscore variable names (must use camelCase)`,
            assertion: `
const hasUnderscore = /let [a-zA-Z$][a-zA-Z0-9$]*_/.test(__rawCode__);
assertEqual(hasUnderscore, false, 'Still using snake_case — convert to camelCase');
`
          }
        ],
        rewardCoins: 20
      }
    },
    {
      id: 3,
      title: `Primitive Data Types`,
      icon: `🔢`,
      color: `#EF9F27`,
      topics: [
        {
          id: `3-1`,
          title: `Numbers (Integers, Floats, and the concept of NaN)`,
          microTags: [
            `#Numbers`,
            `#NaN`
          ],
          theory: `Let's start with a simple question.

How much money is in this bank account?

\`\`\`javascript
85000
\`\`\`

Easy.

Now what about this?

\`\`\`javascript
85000.75
\`\`\`

Still easy.

Most people think these are different kinds of numbers.

In many programming languages, they are.

In JavaScript, they aren't.

---

JavaScript has a surprisingly simple rule:

\`\`\`text
10
10.5
100000
0.99
\`\`\`

are all just numbers.

The engine doesn't care whether the value has a decimal point or not.

As far as JavaScript is concerned:

> "A number is a number."

---

Now let's look at something stranger.

Predict this:

\`\`\`javascript
console.log("Apple" * 5);
\`\`\`

What do you expect?

Take a guess before continuing.

---

Some beginners expect:

\`\`\`text
AppleAppleAppleAppleApple
\`\`\`

Others expect an error.

Neither is correct.

---

JavaScript prints:

\`\`\`text
NaN
\`\`\`

---

This is where many learners get confused.

\`NaN\` stands for:

\`\`\`text
Not-a-Number
\`\`\`

But here's the weird part.

Predict this:

\`\`\`javascript
typeof NaN
\`\`\`

What should it return?

---

Most people answer:

\`\`\`text
"nan"
\`\`\`

or

\`\`\`text
"undefined"
\`\`\`

or

\`\`\`text
"error"
\`\`\`

---

The actual answer is:

\`\`\`text
"number"
\`\`\`

Yes.

Seriously.

\`NaN\` is still considered a number by JavaScript.

One of the weirdest facts in the language.

---

Now another prediction:

\`\`\`javascript
console.log(NaN === NaN);
\`\`\`

True or false?

---

Most people say:

\`\`\`text
true
\`\`\`

Reasonable answer.

Still wrong.

---

The result is:

\`\`\`text
false
\`\`\`

Even \`NaN\` is not equal to itself.

That's why professional developers use:

\`\`\`javascript
Number.isNaN(value)
\`\`\`

instead of equality checks.

---

### The Rule

Numbers can be whole numbers or decimals.

JavaScript treats both as the same data type.

\`NaN\` means a mathematical operation failed.

And if you need to check for it:

\`\`\`javascript
Number.isNaN(...)
\`\`\`

not

\`\`\`javascript
=== NaN
\`\`\`

---`,
          trap: {
            code: `let cartTotal = "Apple" * 5;
if (cartTotal === NaN) {
    console.log("Error: Calculation failed.");
}`,
            flaw: `<code>cartTotal</code> correctly becomes <code>NaN</code>, but <strong>NaN is never equal to anything — not even itself.</strong> <code>NaN === NaN</code> always returns <code>false</code>. The <code>if</code> block never runs. Always use <code>Number.isNaN()</code> to detect NaN.`
          },
          challenge: {
            description: `Create a \`price\` (integer), a \`taxRate\` (decimal), and a \`badCalc\` that produces NaN. Verify NaN with Number.isNaN().`,
            buggyCode: `// Create 3 variables:
// price = any integer
// taxRate = any decimal like 0.08
// badCalc = something that produces NaN (e.g., "text" * 5)

let price = 100;
let taxRate = 0.08;
let badCalc = 0; // Bug: 0 is not NaN — make it a failed math op`,
            testCases: [
              {
                description: `price should be an integer (number)`,
                assertion: `\\nassertEqual(typeof price, 'number');
assertEqual(Number.isInteger(price), true, 'price must be a whole number');`
              },
              {
                description: `taxRate should be a decimal (float)`,
                assertion: `\\nassertEqual(typeof taxRate, 'number');
assertEqual(Number.isInteger(taxRate), false, 'taxRate must be a decimal');`
              },
              {
                description: `badCalc should be NaN`,
                assertion: `\\nassertEqual(Number.isNaN(badCalc), true, 'badCalc must produce NaN — try "text" * 5');`
              }
            ],
            rewardCoins: 15,
            missionType: `Concept`
          }
        },
        {
          id: `3-2`,
          title: `Strings (Single quotes and double quotes)`,
          microTags: [
            `#Strings`,
            `#TemplateLiterals`
          ],
          theory: `Imagine a banking app showing this:

\`\`\`text
Welcome Sarah
\`\`\`

That isn't a number.

It isn't a boolean.

It's text.

In JavaScript, text is called a string.

---

A string can use single quotes:

\`\`\`javascript
'Welcome Sarah'
\`\`\`

or double quotes:

\`\`\`javascript
"Welcome Sarah"
\`\`\`

For most situations:

JavaScript treats both exactly the same.

---

Now predict this:

\`\`\`javascript
let message = 'Hello';
\`\`\`

Valid or invalid?

---

Easy.

Valid.

---

Now predict this:

\`\`\`javascript
let message = "Hello";
\`\`\`

Valid or invalid?

---

Also valid.

---

Now let's look at a bug that crashes real applications.

Predict what happens here:

\`\`\`javascript
let customerName = 'Don't Leave';
\`\`\`

Will it work?

---

Most beginners think yes.

After all, it's just text.

---

But JavaScript sees something different.

It reads:

\`\`\`javascript
'Don'
\`\`\`

and thinks:

> "The string ended."

Then it suddenly finds:

\`\`\`javascript
t Leave
\`\`\`

sitting outside the string.

Now the engine has no idea what it's looking at.

And the program crashes.

---

The fix is simple:

\`\`\`javascript
let customerName = "Don't Leave";
\`\`\`

Now the apostrophe is safely inside the string.

---

This may feel like a tiny detail.

But a single misplaced quote can stop an entire application from running.

---

### The Rule

Strings are text.

Single quotes and double quotes both work.

But if your text contains an apostrophe:

\`\`\`text
don't
it's
customer's
\`\`\`

double quotes are often safer.

---`,
          trap: {
            code: `let itemsInCart = 12;
let msg = 'You have \${itemsInCart} items.';
console.log(msg);`,
            flaw: `The output is: <strong>"You have \${itemsInCart} items."</strong> — the variable name printed literally! The <code>\${}</code> syntax ONLY works inside backticks (<code>\`</code>). Single quotes treat <code>\${itemsInCart}</code> as plain text characters.`
          },
          challenge: {
            description: `Create \`userName\` and \`level\`. Build a \`welcomeMsg\` using a template literal that injects both.`,
            buggyCode: `let userName = "Arjun";
let level = 5;
// Bug: using + concatenation instead of template literals
let welcomeMsg = "Welcome " + userName + ", you're at level " + level;`,
            testCases: [
              {
                description: `welcomeMsg must use a template literal (backticks)`,
                assertion: `
const usesTemplateLiteral = __rawCode__.includes('\`');
assertEqual(usesTemplateLiteral, true, 'Must use backticks (\`) for template literal');
`
              },
              {
                description: `welcomeMsg must contain the userName value`,
                assertion: `\\nassertEqual(welcomeMsg.includes(userName), true, 'welcomeMsg must include the userName variable value');`
              }
            ],
            rewardCoins: 15,
            missionType: `Concept`
          }
        },
        {
          id: `3-3`,
          title: `String Concatenation (Joining strings using +)`,
          microTags: [
            `#Boolean`,
            `#null`,
            `#undefined`
          ],
          theory: `Imagine you're building a profile page.

You already have:

\`\`\`javascript
let firstName = "Sarah";
\`\`\`

and

\`\`\`javascript
let lastName = "Johnson";
\`\`\`

Now you need:

\`\`\`text
Sarah Johnson
\`\`\`

How do you combine them?

---

JavaScript allows strings to be joined using:

\`\`\`javascript
+
\`\`\`

This process is called concatenation.

---

Predict this:

\`\`\`javascript
let fullName = "Sarah" + "Johnson";

console.log(fullName);
\`\`\`

What gets printed?

---

Answer:

\`\`\`text
SarahJohnson
\`\`\`

Notice the problem?

The names got glued together.

---

JavaScript did exactly what you asked.

You never gave it a space.

---

The fix:

\`\`\`javascript
let fullName = "Sarah" + " " + "Johnson";
\`\`\`

Now the output becomes:

\`\`\`text
Sarah Johnson
\`\`\`

---

Now for the trap that appears constantly in interviews.

Predict this:

\`\`\`javascript
console.log("Total: " + 5 + 5);
\`\`\`

Take a real guess.

---

Most beginners answer:

\`\`\`text
Total: 10
\`\`\`

Seems logical.

Still wrong.

---

JavaScript evaluates from left to right.

First:

\`\`\`javascript
"Total: " + 5
\`\`\`

becomes:

\`\`\`text
"Total: 5"
\`\`\`

Now JavaScript sees:

\`\`\`javascript
"Total: 5" + 5
\`\`\`

and joins them again.

Result:

\`\`\`text
Total: 55
\`\`\`

---

No math happened.

The moment a string enters the expression, JavaScript starts treating the result as text.

---

This exact misunderstanding causes bugs in invoices, shopping carts, and dashboards.

---

### The Rule

The \`+\` operator can mean two completely different things:

\`\`\`javascript
5 + 5
\`\`\`

Math.

---

\`\`\`javascript
"5" + "5"
\`\`\`

Text joining.

---

Whenever strings are involved, stop and ask:

> "Am I adding numbers, or am I joining text?"

That question will save you from a surprising number of bugs.`,
          trap: {
            code: `let isAdmin = "false";
if (isAdmin) {
    console.log("Access Granted to Server.");
}`,
            flaw: `<strong>"Access Granted"</strong> logs even though the developer meant <code>false</code>. They wrapped it in quotes, making it a String. Any non-empty string — even <code>"false"</code> — is <strong>Truthy</strong> in JavaScript. The <code>if</code> block fires, granting admin access to everyone. Always use the boolean <code>false</code> without quotes.`
          },
          challenge: {
            description: `Declare \`hasPassedExam = true\` (boolean), \`submittedWork = null\` (intentional empty), and an unassigned \`futureScore\`.`,
            buggyCode: `// Bug: booleans are incorrectly stored as strings
let hasPassedExam = "true";     // Should be boolean true
let submittedWork = undefined;  // Should be null (intentional empty)
let futureScore = 0;            // Should be unassigned (undefined)`,
            testCases: [
              {
                description: `hasPassedExam must be boolean true (not string "true")`,
                assertion: `\\nassertEqual(typeof hasPassedExam, 'boolean', 'hasPassedExam must be typeof boolean');
assertEqual(hasPassedExam, true);`
              },
              {
                description: `submittedWork must be null`,
                assertion: `\\nassertEqual(submittedWork, null, 'submittedWork must be null, not undefined');`
              },
              {
                description: `futureScore must be undefined (unassigned)`,
                assertion: `\\nassertEqual(typeof futureScore, 'undefined', 'futureScore must be left unassigned');`
              }
            ],
            rewardCoins: 15,
            missionType: `Concept`
          }
        },
        {
          id: `3-4`,
          title: `Template Literals (Using backticks and \`\${}\`)`,
          microTags: [
            `#Theory`,
            `#Concept`
          ],
          theory: `Let's start with a problem.

Imagine you're building a banking app.

You have:

\`\`\`javascript
let userName = "Sarah";
let balance = 5000;
\`\`\`

Now you want to display:

\`\`\`text
Welcome Sarah. Your balance is 5000.
\`\`\`

A beginner might write:

\`\`\`javascript
let message =
"Welcome " +
userName +
". Your balance is " +
balance +
".";
\`\`\`

Will it work?

Yes.

Is it pleasant to read?

Not even slightly.

---

Now imagine the message becomes longer.

Then longer.

Then longer again.

Soon the code starts looking like a puzzle instead of a sentence.

That's why template literals exist.

---

Look at this:

\`\`\`javascript
let message =
\`Welcome \${userName}. Your balance is \${balance}.\`;
\`\`\`

Read it slowly.

Doesn't it feel more like normal English?

---

Now predict:

\`\`\`javascript
let itemsInCart = 12;

let message =
\`You have \${itemsInCart} items.\`;

console.log(message);
\`\`\`

What prints?

---

Most people correctly answer:

\`\`\`text
You have 12 items.
\`\`\`

Good.

Now here's the trap.

Predict this:

\`\`\`javascript
let itemsInCart = 12;

let message =
'You have \${itemsInCart} items.';

console.log(message);
\`\`\`

What prints?

---

Many beginners still expect:

\`\`\`text
You have 12 items.
\`\`\`

Wrong.

---

The output is:

\`\`\`text
You have \${itemsInCart} items.
\`\`\`

Literally.

Character for character.

---

Why?

Because \`\${}\` only works inside:

\`\`\`javascript
\`
\`
\`\`\`

backticks.

Not single quotes.

Not double quotes.

---

Now another benefit.

Predict this:

\`\`\`javascript
let invoice =
\`Item: Laptop
Price: 50000
Status: Paid\`;
\`\`\`

Valid or invalid?

---

Valid.

Template literals allow multi-line text without ugly workarounds.

---

### The Rule

Use template literals when:

* You need variables inside text.
* You need multi-line strings.
* You want code that humans can actually read.

And remember:

\`\`\`javascript
\${}
\`\`\`

only works inside backticks.

---`,
          trap: {
            code: `// No trap defined yet`,
            flaw: `Understanding the theory deeply is the key here.`
          },
          challenge: {
            description: `Review the theory and experiment with these concepts.`,
            buggyCode: `// Experiment here`,
            testCases: [],
            rewardCoins: 5,
            missionType: `Warmup`
          }
        },
        {
          id: `3-5`,
          title: `Booleans (true and false)`,
          microTags: [
            `#Theory`,
            `#Concept`
          ],
          theory: `Imagine a login system.

The user is either:

\`\`\`text
Logged In
\`\`\`

or

\`\`\`text
Logged Out
\`\`\`

Nothing in between.

---

Many real-world situations work like this.

* Payment successful or failed.
* User verified or not verified.
* Account active or inactive.

Whenever something has exactly two states, JavaScript uses a boolean.

---

A boolean can only be:

\`\`\`javascript
true
\`\`\`

or

\`\`\`javascript
false
\`\`\`

Nothing else.

---

Now predict:

\`\`\`javascript
let isVerified = true;
\`\`\`

What type is this?

---

Boolean.

Easy.

---

Now predict:

\`\`\`javascript
let isVerified = "true";
\`\`\`

Same thing?

---

Most beginners say yes.

This mistake causes countless bugs.

---

Look carefully:

\`\`\`javascript
true
\`\`\`

Boolean.

---

\`\`\`javascript
"true"
\`\`\`

String.

---

Completely different.

---

Now let's look at a dangerous bug.

Predict this:

\`\`\`javascript
let isAdmin = "false";

if (isAdmin) {
    console.log("Access Granted");
}
\`\`\`

Will access be granted?

---

Most beginners answer:

\`\`\`text
No
\`\`\`

Because they see the word:

\`\`\`text
false
\`\`\`

Makes sense.

Still wrong.

---

The output is:

\`\`\`text
Access Granted
\`\`\`

---

Why?

Because JavaScript isn't reading the word.

It's reading the type.

---

This:

\`\`\`javascript
"false"
\`\`\`

is not a boolean.

It's a string.

And non-empty strings are considered truthy.

---

JavaScript basically sees:

\`\`\`text
Some text exists.
\`\`\`

and treats it as true.

---

This exact bug has caused real authentication and security problems.

---

### The Rule

These are booleans:

\`\`\`javascript
true
false
\`\`\`

These are strings:

\`\`\`javascript
"true"
"false"
\`\`\`

Never confuse them.

JavaScript certainly won't.

---`,
          trap: {
            code: `// No trap defined yet`,
            flaw: `Understanding the theory deeply is the key here.`
          },
          challenge: {
            description: `Review the theory and experiment with these concepts.`,
            buggyCode: `// Experiment here`,
            testCases: [],
            rewardCoins: 5,
            missionType: `Warmup`
          }
        },
        {
          id: `3-6`,
          title: `null vs. undefined (Intentional empty vs. unassigned)`,
          microTags: [
            `#Theory`,
            `#Concept`
          ],
          theory: `This topic confuses almost everyone at first.

Let's make it simple.

---

Imagine a hotel.

Room 101 exists.

But nobody has checked in yet.

That room is:

\`\`\`javascript
undefined
\`\`\`

---

Now imagine Room 102 exists.

The manager intentionally marks it as:

\`\`\`text
No Guest Assigned
\`\`\`

That room is:

\`\`\`javascript
null
\`\`\`

---

They both look empty.

But they mean different things.

---

Look at this:

\`\`\`javascript
let driverName;
\`\`\`

Predict the value.

---

Answer:

\`\`\`javascript
undefined
\`\`\`

---

Because JavaScript created the variable.

But nobody put anything inside it.

---

Now look at this:

\`\`\`javascript
let driverName = null;
\`\`\`

Different meaning.

---

Now the developer is saying:

> This variable exists.
>
> I intentionally want it to contain nothing.

---

Now predict:

\`\`\`javascript
let searchResult = null;

let futureData;

console.log(searchResult === futureData);
\`\`\`

True or false?

---

Most beginners answer:

\`\`\`text
true
\`\`\`

Both look empty.

---

The actual answer is:

\`\`\`text
false
\`\`\`

---

Because JavaScript sees:

\`\`\`javascript
null
\`\`\`

and

\`\`\`javascript
undefined
\`\`\`

as different values.

---

This distinction becomes important in APIs, databases, and forms.

---

Think about it this way:

\`\`\`javascript
undefined
\`\`\`

means:

> Nobody assigned anything.

---

\`\`\`javascript
null
\`\`\`

means:

> Somebody intentionally assigned nothing.

---

### The Rule

Use:

\`\`\`javascript
undefined
\`\`\`

for data that hasn't been assigned yet.

Use:

\`\`\`javascript
null
\`\`\`

when you intentionally want "nothing" to be stored.

---`,
          trap: {
            code: `// No trap defined yet`,
            flaw: `Understanding the theory deeply is the key here.`
          },
          challenge: {
            description: `Review the theory and experiment with these concepts.`,
            buggyCode: `// Experiment here`,
            testCases: [],
            rewardCoins: 5,
            missionType: `Warmup`
          }
        },
        {
          id: `3-7`,
          title: `Using the typeof operator to check data types`,
          microTags: [
            `#Theory`,
            `#Concept`
          ],
          theory: `Imagine you're debugging a banking application.

A value looks wrong.

You don't know whether it's:

* a number
* a string
* a boolean

How do you check?

---

JavaScript gives you a tool:

\`\`\`javascript
typeof
\`\`\`

---

Predict:

\`\`\`javascript
typeof 10
\`\`\`

---

Answer:

\`\`\`text
number
\`\`\`

---

Predict:

\`\`\`javascript
typeof "10"
\`\`\`

---

Answer:

\`\`\`text
string
\`\`\`

---

Now predict:

\`\`\`javascript
typeof true
\`\`\`

---

Answer:

\`\`\`text
boolean
\`\`\`

---

Simple so far.

Now let's meet one of JavaScript's oldest bugs.

Predict this:

\`\`\`javascript
typeof null
\`\`\`

---

What should it return?

Most people answer:

\`\`\`text
null
\`\`\`

Reasonable answer.

Wrong answer.

---

The actual result is:

\`\`\`text
object
\`\`\`

---

Yes.

Really.

---

This isn't a typo.

It's a historical bug that became part of the language.

Millions of websites depend on it now.

So it can never be removed.

---

This creates a common trap:

\`\`\`javascript
let data = null;

if (typeof data === "null") {
    console.log("Empty");
}
\`\`\`

Will this run?

---

No.

Because:

\`\`\`javascript
typeof data
\`\`\`

returns:

\`\`\`text
object
\`\`\`

not

\`\`\`text
null
\`\`\`

---

Many developers encounter this bug years into their careers.

You're seeing it now.

---

### The Rule

\`typeof\` helps you discover data types.

Common results:

\`\`\`javascript
typeof 10
// "number"

typeof "hello"
// "string"

typeof true
// "boolean"
\`\`\`

But remember forever:

\`\`\`javascript
typeof null
\`\`\`

returns:

\`\`\`text
"object"
\`\`\`

even though it feels wrong.

---`,
          trap: {
            code: `// No trap defined yet`,
            flaw: `Understanding the theory deeply is the key here.`
          },
          challenge: {
            description: `Review the theory and experiment with these concepts.`,
            buggyCode: `// Experiment here`,
            testCases: [],
            rewardCoins: 5,
            missionType: `Warmup`
          }
        }
      ],
      mission: {
        title: `The FinTech KYC Pipeline Collapse`,
        tier: 3,
        scenario: `You are a security engineer at a global banking app. The KYC (Know Your Customer) data pipeline is critically failing. New users can't open accounts because the validation script corrupts their data — strings break the compiler, math produces NaN, booleans are faked as text. Fix the pipeline before the regulatory system flags the bank.`,
        objectives: [
          `Fix the string quotes on applicantName (mixed quote types = SyntaxError)`,
          `Change taxMultiplier from "Five" (string) to 5 (number) to fix the NaN`,
          `Change isIdentityVerified from "true" (string) to true (boolean)`,
          `Change uploadedDocuments from undefined to null (intentional empty)`,
          `Rewrite finalLog using a template literal — no + operators`
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
            description: `calculatedTax must be a valid number (not NaN)`,
            assertion: `\\nassertEqual(Number.isNaN(calculatedTax), false, 'calculatedTax is NaN — fix taxMultiplier to be a number');
assertEqual(calculatedTax, 17000, 'calculatedTax should be 85000 / 5 = 17000');`
          },
          {
            description: `isIdentityVerified must be boolean true`,
            assertion: `\\nassertEqual(typeof isIdentityVerified, 'boolean', 'isIdentityVerified must be a boolean, not a string');
assertEqual(isIdentityVerified, true);`
          },
          {
            description: `uploadedDocuments must be null`,
            assertion: `\\nassertEqual(uploadedDocuments, null, 'uploadedDocuments should be null, not undefined');`
          },
          {
            description: `finalLog must use template literals (no + for strings)`,
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
    {
      id: 4,
      title: `Basic Math & Operators`,
      icon: `➗`,
      color: `#E24B4A`,
      topics: [
        {
          id: `4-1`,
          title: `Basic Arithmetic Operators (\`+\`, \`-\`, \`*\`, \`/\`)`,
          microTags: [
            `#Arithmetic`,
            `#Operators`
          ],
          theory: `Let's start with something dangerous.

Not difficult.

Dangerous.

---

Predict this:

\`\`\`javascript
let result = 10 + 5;
\`\`\`

Easy.

Result:

\`\`\`text
15
\`\`\`

---

Now predict:

\`\`\`javascript
let result = 10 - 5;
\`\`\`

Result:

\`\`\`text
5
\`\`\`

---

Nothing surprising yet.

---

Now try this:

\`\`\`javascript
let result = "10" + 5;
\`\`\`

What should happen?

Take a guess before continuing.

---

Many beginners answer:

\`\`\`text
15
\`\`\`

Reasonable.

Wrong.

---

The result is:

\`\`\`text
105
\`\`\`

---

Why?

Because the moment JavaScript sees a string involved in a \`+\` operation, it becomes suspicious.

Instead of doing math, it starts joining text.

---

Now predict this:

\`\`\`javascript
let finalValue = "10" + 5 - 2;
\`\`\`

Don't run it.

Think.

---

Many learners answer:

\`\`\`text
13
\`\`\`

---

Actual result:

\`\`\`text
103
\`\`\`

---

Let's watch what JavaScript does.

Step 1:

\`\`\`javascript
"10" + 5
\`\`\`

becomes:

\`\`\`text
"105"
\`\`\`

---

Step 2:

\`\`\`javascript
"105" - 2
\`\`\`

Now subtraction can't join text.

So JavaScript forces:

\`\`\`text
"105"
\`\`\`

back into:

\`\`\`text
105
\`\`\`

and performs:

\`\`\`text
105 - 2
\`\`\`

Result:

\`\`\`text
103
\`\`\`

---

This is your first lesson about JavaScript:

> JavaScript tries very hard to help you.

Sometimes that help creates bugs.

---

### The Rule

\`\`\`javascript
+
\`\`\`

can mean:

* addition
* text joining

Always check the data types before trusting the result.

---`,
          trap: {
            code: `let finalValue = "10" + 5 - 2;`,
            flaw: `The answer is <strong>103</strong>, not 13. Left to right: <code>"10" + 5</code> → concatenation → <code>"105"</code>. Then <code>"105" - 2</code> → JavaScript converts the string back to a number → <code>103</code>. The <code>-</code> operator always forces numbers, but <code>+</code> with a string always concatenates first.`
          },
          challenge: {
            description: `Calculate: sum of 15+5, difference of 20-8, product of 4×6, quotient of 50÷10.`,
            buggyCode: `// Store each calculation in its own variable
let sum = "20";        // Bug: hardcoded string, not a calculation!
let difference = 12;   // needs to be calculated
let product = 24;      // needs to be calculated
let quotient = 5;      // needs to be calculated`,
            testCases: [
              {
                description: `sum must equal 20 (calculated)`,
                assertion: `\\nassertEqual(sum, 20);`
              },
              {
                description: `difference must equal 12 (calculated)`,
                assertion: `\\nassertEqual(difference, 12);`
              },
              {
                description: `product must equal 24 (calculated)`,
                assertion: `\\nassertEqual(product, 24);`
              },
              {
                description: `quotient must equal 5 (calculated)`,
                assertion: `\\nassertEqual(quotient, 5);`
              }
            ],
            rewardCoins: 10,
            missionType: `Concept`
          }
        },
        {
          id: `4-2`,
          title: `The Modulo Operator (\`%\`)`,
          microTags: [
            `#Modulo`,
            `#AssignmentOperators`
          ],
          theory: `Most beginners think \`%\` means:

> percentage

It doesn't.

---

The modulo operator answers one question:

> "What is left over after division?"

---

Predict:

\`\`\`javascript
10 % 3
\`\`\`

---

Think about division.

\`\`\`text
10 ÷ 3 = 3 remainder 1
\`\`\`

The modulo operator only cares about:

\`\`\`text
1
\`\`\`

---

So:

\`\`\`javascript
10 % 3
\`\`\`

becomes:

\`\`\`text
1
\`\`\`

---

Now predict:

\`\`\`javascript
20 % 5
\`\`\`

---

Answer:

\`\`\`text
0
\`\`\`

Because 20 divides perfectly.

Nothing is left over.

---

Now for the trap.

Predict:

\`\`\`javascript
3 % 10
\`\`\`

---

Many beginners answer:

\`\`\`text
0
\`\`\`

or

\`\`\`text
error
\`\`\`

---

Actual answer:

\`\`\`text
3
\`\`\`

---

Why?

Because 10 cannot fit into 3 even once.

Nothing gets divided.

The entire 3 remains.

---

This operator powers:

* even/odd checks
* server routing
* pagination
* game turns
* round-robin scheduling

Much more important than it looks.

---

### The Rule

Modulo doesn't return the answer.

It returns what's left over.

---`,
          trap: {
            code: `let playerHealth = 100;
playerHealth =- 20;`,
            flaw: `Health doesn't drop to 80 — it jumps to <strong>-20</strong>. The developer wrote <code>=-</code> instead of <code>-=</code>. JavaScript reads it as <code>playerHealth = (-20)</code> — a reassignment to negative twenty, not a subtraction. Operator order matters: always write <code>-=</code>.`
          },
          challenge: {
            description: `Start bankBalance at 1000. Using shortcuts only: add 500, subtract 200, multiply by 2.`,
            buggyCode: `let bankBalance = 1000;
// Bug: using long-form instead of shorthand operators
bankBalance = bankBalance + 500;
bankBalance = bankBalance - 200;
bankBalance = bankBalance * 2;`,
            testCases: [
              {
                description: `bankBalance must equal 2600`,
                assertion: `\\nassertEqual(bankBalance, 2600, 'Expected (1000+500-200)*2 = 2600');`
              },
              {
                description: `Code must use += operator`,
                assertion: `assertEqual(__rawCode__.includes('+='), true, 'Must use += shorthand');`
              },
              {
                description: `Code must use -= operator`,
                assertion: `assertEqual(__rawCode__.includes('-='), true, 'Must use -= shorthand');`
              },
              {
                description: `Code must use *= operator`,
                assertion: `assertEqual(__rawCode__.includes('*='), true, 'Must use *= shorthand');`
              }
            ],
            rewardCoins: 15,
            missionType: `Concept`
          }
        },
        {
          id: `4-3`,
          title: `Assignment Operators (\`=\`, \`+=\`, \`-=\`, \`*=\`, \`/=\`)`,
          microTags: [
            `#PEMDAS`,
            `#MathObject`
          ],
          theory: `Let's start with a common mistake.

Predict this:

\`\`\`javascript
let score = 100;

score += 20;
\`\`\`

What is score now?

---

Answer:

\`\`\`text
120
\`\`\`

---

Because:

\`\`\`javascript
score += 20;
\`\`\`

is just shorthand for:

\`\`\`javascript
score = score + 20;
\`\`\`

---

Now predict:

\`\`\`javascript
let score = 100;

score -= 20;
\`\`\`

---

Answer:

\`\`\`text
80
\`\`\`

---

Easy.

Now let's look at a real bug.

---

Predict:

\`\`\`javascript
let health = 100;

health =- 20;
\`\`\`

Most beginners think:

\`\`\`text
80
\`\`\`

---

Wrong.

---

The value becomes:

\`\`\`text
-20
\`\`\`

---

Notice the difference.

Correct:

\`\`\`javascript
health -= 20;
\`\`\`

---

Bug:

\`\`\`javascript
health =- 20;
\`\`\`

---

JavaScript reads it as:

\`\`\`javascript
health = (-20);
\`\`\`

It doesn't subtract.

It replaces.

---

One tiny character.

Completely different result.

---

### The Rule

Shorthand operators modify an existing value.

Watch the symbol order carefully.

---`,
          trap: {
            code: `let mappedValue = Math.floor(-2.5);`,
            flaw: `Beginners expect <code>-2</code> (just chop the decimal). But <code>Math.floor</code> goes to the <em>lowest</em> integer. On a number line, <code>-3</code> is lower than <code>-2.5</code>. So <code>Math.floor(-2.5)</code> returns <strong>-3</strong>.`
          },
          challenge: {
            description: `Calculate average of scores 80, 90, 100. Must use parentheses. Result should be 90.`,
            buggyCode: `// Bug: missing parentheses — wrong precedence!
let score1 = 80, score2 = 90, score3 = 100;
let average = score1 + score2 + score3 / 3; // BUG: only divides score3!`,
            testCases: [
              {
                description: `average must equal 90`,
                assertion: `\\nassertEqual(average, 90, 'Expected (80+90+100)/3 = 90 — use parentheses!');`
              },
              {
                description: `Code must use parentheses`,
                assertion: `assertEqual(__rawCode__.includes('('), true, 'Must use parentheses for correct order of operations');`
              }
            ],
            rewardCoins: 15,
            missionType: `Concept`
          }
        },
        {
          id: `4-4`,
          title: `Increment and Decrement Operators (\`++\`, \`--\`)`,
          microTags: [
            `#Theory`,
            `#Concept`
          ],
          theory: `This topic looks easy.

Then it destroys people in interviews.

---

Predict:

\`\`\`javascript
let count = 5;

count++;
\`\`\`

Value?

---

Answer:

\`\`\`text
6
\`\`\`

---

Now predict:

\`\`\`javascript
let count = 5;

count--;
\`\`\`

---

Answer:

\`\`\`text
4
\`\`\`

---

Simple.

Now comes the famous trap.

---

Predict:

\`\`\`javascript
let a = 5;

let b = a++;
\`\`\`

Final values?

---

Most learners answer:

\`\`\`text
a = 6
b = 6
\`\`\`

---

Wrong.

---

Actual result:

\`\`\`text
a = 6
b = 5
\`\`\`

---

Why?

Because:

\`\`\`javascript
a++
\`\`\`

means:

> "Use the current value first.
> Increase later."

---

JavaScript does this:

\`\`\`javascript
b = 5;
a = 6;
\`\`\`

---

Now predict:

\`\`\`javascript
let a = 5;

let b = ++a;
\`\`\`

---

Result:

\`\`\`text
a = 6
b = 6
\`\`\`

---

Because prefix increment happens first.

---

This tiny distinction causes bugs in loops and counters all the time.

---

### The Rule

Postfix:

\`\`\`javascript
a++
\`\`\`

Use first.

Increase later.

---

Prefix:

\`\`\`javascript
++a
\`\`\`

Increase first.

Use later.

---`,
          trap: {
            code: `// No trap defined yet`,
            flaw: `Understanding the theory deeply is the key here.`
          },
          challenge: {
            description: `Review the theory and experiment with these concepts.`,
            buggyCode: `// Experiment here`,
            testCases: [],
            rewardCoins: 5,
            missionType: `Warmup`
          }
        },
        {
          id: `4-5`,
          title: `Operator Precedence (BODMAS/PEMDAS in JavaScript)`,
          microTags: [
            `#Theory`,
            `#Concept`
          ],
          theory: `Let's play a game.

Predict:

\`\`\`javascript
10 - 2 * 3 + 4 / 2
\`\`\`

Don't calculate left-to-right.

Just predict.

---

Many beginners do:

\`\`\`text
10 - 2 = 8
8 * 3 = 24
24 + 4 = 28
28 / 2 = 14
\`\`\`

---

Wrong.

Because JavaScript doesn't read math like a sentence.

It follows rules.

---

First:

\`\`\`javascript
2 * 3
\`\`\`

becomes:

\`\`\`text
6
\`\`\`

---

Then:

\`\`\`javascript
4 / 2
\`\`\`

becomes:

\`\`\`text
2
\`\`\`

---

Now JavaScript sees:

\`\`\`javascript
10 - 6 + 2
\`\`\`

---

Left to right:

\`\`\`text
4 + 2
\`\`\`

---

Final answer:

\`\`\`text
6
\`\`\`

---

Now predict:

\`\`\`javascript
80 + 90 + 100 / 3
\`\`\`

---

Many learners expect:

\`\`\`text
90
\`\`\`

---

Actual result:

\`\`\`text
203.33...
\`\`\`

because division happens first.

---

The correct version:

\`\`\`javascript
(80 + 90 + 100) / 3
\`\`\`

---

Now JavaScript gets:

\`\`\`text
90
\`\`\`

---

### The Rule

When humans and JavaScript might disagree about order:

Use parentheses.

---`,
          trap: {
            code: `// No trap defined yet`,
            flaw: `Understanding the theory deeply is the key here.`
          },
          challenge: {
            description: `Review the theory and experiment with these concepts.`,
            buggyCode: `// Experiment here`,
            testCases: [],
            rewardCoins: 5,
            missionType: `Warmup`
          }
        },
        {
          id: `4-6`,
          title: `The \`Math\` Object basics (\`round\`, \`floor\`, \`ceil\`, \`random\`)`,
          microTags: [
            `#Theory`,
            `#Concept`
          ],
          theory: `JavaScript comes with a built-in toolbox.

That toolbox is called:

\`\`\`javascript
Math
\`\`\`

---

Predict:

\`\`\`javascript
Math.round(4.7)
\`\`\`

---

Answer:

\`\`\`text
5
\`\`\`

---

Nearest whole number.

---

Predict:

\`\`\`javascript
Math.floor(4.9)
\`\`\`

---

Answer:

\`\`\`text
4
\`\`\`

---

Floor always goes down.

---

Predict:

\`\`\`javascript
Math.ceil(4.1)
\`\`\`

---

Answer:

\`\`\`text
5
\`\`\`

---

Ceiling always goes up.

---

Now for the trap.

Predict:

\`\`\`javascript
Math.floor(-2.5)
\`\`\`

---

Most beginners answer:

\`\`\`text
-2
\`\`\`

---

Wrong.

---

Answer:

\`\`\`text
-3
\`\`\`

---

Why?

Because floor means:

> Go to the lower integer.

Not:

> Remove the decimal.

---

On a number line:

\`\`\`text
-3 < -2.5 < -2
\`\`\`

The lower number is:

\`\`\`text
-3
\`\`\`

---

Now one final tool:

\`\`\`javascript
Math.random()
\`\`\`

---

Predict:

Will it ever return:

\`\`\`text
1
\`\`\`

---

No.

---

It generates a number between:

\`\`\`text
0
\`\`\`

inclusive

and

\`\`\`text
1
\`\`\`

exclusive.

---

That's why:

\`\`\`javascript
Math.floor(Math.random() * 10)
\`\`\`

creates numbers:

\`\`\`text
0 to 9
\`\`\`

perfectly.

---

### The Rule

Use:

\`\`\`javascript
Math.round()
\`\`\`

nearest integer

\`\`\`javascript
Math.floor()
\`\`\`

always down

\`\`\`javascript
Math.ceil()
\`\`\`

always up

\`\`\`javascript
Math.random()
\`\`\`

random decimal between 0 and 1

---`,
          trap: {
            code: `// No trap defined yet`,
            flaw: `Understanding the theory deeply is the key here.`
          },
          challenge: {
            description: `Review the theory and experiment with these concepts.`,
            buggyCode: `// Experiment here`,
            testCases: [],
            rewardCoins: 5,
            missionType: `Warmup`
          }
        }
      ],
      mission: {
        title: `The AI Flashcard Token & Leaderboard Engine`,
        tier: 4,
        scenario: `You are the lead backend developer for a competitive AI study app. The nightly cron script that calculates student scores and deducts API tokens is critically broken. Top students get wrong scores due to precedence failures, token billing rounds incorrectly, and the server router uses division instead of remainders. Fix the math before the leaderboard updates.`,
        objectives: [
          `Add parentheses so (baseScore + streakBonus) is calculated BEFORE multiplying by multiplier`,
          `Change Math.round to Math.floor AND use -= for the token deduction`,
          `Replace loginDays + 1 with the ++ increment operator`,
          `Replace the / division with % modulo for server shard routing`,
          `Wrap Math.random() * 10 inside Math.floor() for a clean integer`
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
          {
            description: `finalScore must equal 780 (parentheses fix)`,
            assertion: `\\nassertEqual(finalScore, 780, 'Use (baseScore + streakBonus) * multiplier');`
          },
          {
            description: `userTokens must equal 955 (Math.floor(45.9) = 45)`,
            assertion: `\\nassertEqual(userTokens, 955, 'Math.floor(45.9)=45, 1000-45=955');`
          },
          {
            description: `serverShard must be 0 (780 % 3 = 0)`,
            assertion: `\\nassertEqual(serverShard, 0, '780 % 3 = 0');`
          },
          {
            description: `challengeId must be a whole integer`,
            assertion: `\\nassertEqual(challengeId % 1, 0, 'challengeId must be an integer (use Math.floor)');`
          }
        ],
        rewardCoins: 40
      }
    },
    {
      id: 5,
      title: `Type Conversion & Coercion`,
      icon: `🔄`,
      color: `#A89CFF`,
      topics: [
        {
          id: `5-1`,
          title: `Explicit Type Conversion (Using \`Number()\`, \`String()\`, \`Boolean()\`)`,
          microTags: [
            `#TypeConversion`,
            `#Explicit`
          ],
          theory: `Imagine you're building a checkout system.

A customer buys a laptop.

The server sends:

\`\`\`javascript
let price = "50000";
\`\`\`

Looks like a number.

Feels like a number.

But is it actually a number?

---

Let's find out.

Predict:

\`\`\`javascript
typeof "50000"
\`\`\`

What does JavaScript return?

---

Answer:

\`\`\`text
string
\`\`\`

Not number.

String.

---

This is where many real bugs start.

Humans see:

\`\`\`text
50000
\`\`\`

JavaScript sees:

\`\`\`text
"50000"
\`\`\`

Those are not the same thing.

---

Sometimes you don't want JavaScript guessing.

You want to tell it exactly what to do.

That's called explicit conversion.

---

Predict:

\`\`\`javascript
Number("500")
\`\`\`

---

Result:

\`\`\`text
500
\`\`\`

Now it's a real number.

---

Predict:

\`\`\`javascript
String(false)
\`\`\`

---

Result:

\`\`\`text
"false"
\`\`\`

Now it's text.

---

Predict:

\`\`\`javascript
Boolean(0)
\`\`\`

---

Result:

\`\`\`text
false
\`\`\`

---

Easy so far.

Now let's meet the first trap.

---

Predict:

\`\`\`javascript
Number("")
\`\`\`

What should happen?

---

Many learners answer:

\`\`\`text
NaN
\`\`\`

Makes sense.

The string is empty.

There is no number.

---

Actual result:

\`\`\`text
0
\`\`\`

---

JavaScript treats an empty string as zero.

Weird?

Maybe.

Important?

Absolutely.

---

Now another trap.

Predict:

\`\`\`javascript
Boolean("false")
\`\`\`

---

Many people answer:

\`\`\`text
false
\`\`\`

Because the word literally says:

\`\`\`text
false
\`\`\`

---

JavaScript disagrees.

Result:

\`\`\`text
true
\`\`\`

---

Why?

Because JavaScript isn't reading English.

It sees:

\`\`\`text
A string with characters inside.
\`\`\`

And non-empty strings become:

\`\`\`text
true
\`\`\`

---

This exact bug appears constantly in APIs.

---

### The Rule

Use:

\`\`\`javascript
Number()
\`\`\`

when you need math.

Use:

\`\`\`javascript
String()
\`\`\`

when you need text.

Use:

\`\`\`javascript
Boolean()
\`\`\`

when you need true/false.

And never assume JavaScript reads words the way humans do.

---`,
          trap: {
            code: `let productPrice = "120";
let shippingTax = "15";
let cartTotal = productPrice + shippingTax;
console.log(cartTotal);`,
            flaw: `Output is <strong>"12015"</strong> — not 135. The <code>+</code> operator sees two strings and concatenates instead of adding. You must explicitly convert before adding: <code>Number(productPrice) + Number(shippingTax)</code> → <code>135</code>.`
          },
          challenge: {
            description: `Convert \`"200"\` and \`"75"\` to numbers and add them. The result must be 275, not "20075".`,
            buggyCode: `let price = "200";
let bonus = "75";
// Bug: + concatenates strings instead of adding numbers
let total = price + bonus; // → "20075" ← WRONG!`,
            testCases: [
              {
                description: `total must equal 275 (not "20075")`,
                assertion: `\\nassertEqual(total, 275, 'Must use Number() to convert before adding');`
              },
              {
                description: `total must be typeof number`,
                assertion: `\\nassertEqual(typeof total, 'number', 'total must be a number, not a string');`
              }
            ],
            rewardCoins: 15,
            missionType: `Concept`
          }
        },
        {
          id: `5-2`,
          title: `Implicit Type Coercion (Behind the Scenes)`,
          microTags: [
            `#Truthy`,
            `#Falsy`,
            `#Coercion`
          ],
          theory: `Let's start with a question.

What should this be?

\`\`\`javascript
"50" + 5
\`\`\`

---

Most beginners know the answer now:

\`\`\`text
"505"
\`\`\`

---

Good.

Now the real question:

Why?

---

Because JavaScript wants the operation to succeed.

When it sees a string involved in a \`+\` operation, it thinks:

> "I'll convert everything into text."

---

So:

\`\`\`javascript
"50" + 5
\`\`\`

becomes:

\`\`\`javascript
"50" + "5"
\`\`\`

which becomes:

\`\`\`text
"505"
\`\`\`

---

Now predict:

\`\`\`javascript
"50" - 5
\`\`\`

---

Will JavaScript return:

\`\`\`text
"505"
\`\`\`

again?

---

No.

---

Result:

\`\`\`text
45
\`\`\`

---

Why did JavaScript suddenly change behavior?

---

Because subtraction doesn't know how to join text.

So JavaScript changes strategy.

It converts both values into numbers.

---

\`\`\`javascript
"50" - 5
\`\`\`

becomes:

\`\`\`javascript
50 - 5
\`\`\`

Result:

\`\`\`text
45
\`\`\`

---

Now for the famous trap.

Predict:

\`\`\`javascript
let batchId = "007";

let encryptedCode = batchId + 1;

let decodedKey = encryptedCode - 1;
\`\`\`

What is \`decodedKey\`?

---

Most beginners answer:

\`\`\`text
7
\`\`\`

Wrong.

---

Let's watch JavaScript think.

Step 1:

\`\`\`javascript
"007" + 1
\`\`\`

becomes:

\`\`\`text
"0071"
\`\`\`

---

Step 2:

\`\`\`javascript
"0071" - 1
\`\`\`

becomes:

\`\`\`javascript
71 - 1
\`\`\`

---

Final answer:

\`\`\`text
70
\`\`\`

---

JavaScript isn't random.

It simply follows different rules depending on the operator.

---

### The Rule

For:

\`\`\`javascript
+
\`\`\`

a string pulls everything into text.

For:

\`\`\`javascript
-
*
/
\`\`\`

JavaScript usually converts values into numbers.

---`,
          trap: {
            code: `let hasVoucher = "false";
if (hasVoucher) {
    console.log("Voucher Accepted. Deducting $20.");
}`,
            flaw: `<strong>"Voucher Accepted"</strong> logs even though the developer intended <code>false</code>. The string <code>"false"</code> is not the boolean <code>false</code> — it's a non-empty string, which is <strong>Truthy</strong>. The fix: reassign to the actual boolean <code>false</code> (no quotes).`
          },
          challenge: {
            description: `Fix the checkout: convert price strings to numbers, change "false" voucher to boolean false, and empty out the whitespace coupon.`,
            buggyCode: `let price = "120";
let shipping = "15";
let hasVoucher = "false"; // string, should be boolean
let coupon = " ";         // space = truthy, should be empty ""

// Bug: all these checks fire incorrectly
let cartTotal = price + shipping; // becomes "12015"
if (hasVoucher) console.log("Voucher accepted");
if (coupon) console.log("Coupon applied");`,
            testCases: [
              {
                description: `cartTotal must be 135 (number)`,
                assertion: `\\nassertEqual(cartTotal, 135);`
              },
              {
                description: `hasVoucher must be boolean false`,
                assertion: `\\nassertEqual(hasVoucher, false);
assertEqual(typeof hasVoucher, 'boolean');`
              },
              {
                description: `coupon must be empty string (falsy)`,
                assertion: `\\nassertEqual(coupon === '', true, 'coupon must be empty string ""');`
              }
            ],
            rewardCoins: 20,
            missionType: `Concept`
          }
        },
        {
          id: `5-3`,
          title: `Truthy and Falsy values`,
          microTags: [
            `#Theory`,
            `#Concept`
          ],
          theory: `This topic causes more bugs than entire frameworks.

Let's start with a prediction.

---

What happens here?

\`\`\`javascript
if ("hello") {
    console.log("Executed");
}
\`\`\`

---

Does it run?

---

Yes.

---

Now predict:

\`\`\`javascript
if ("0") {
    console.log("Executed");
}
\`\`\`

---

Many beginners hesitate.

After all:

\`\`\`text
0
\`\`\`

feels false.

---

But remember:

\`\`\`text
"0"
\`\`\`

is not zero.

It's text.

---

Result:

\`\`\`text
Executed
\`\`\`

---

Now predict:

\`\`\`javascript
if (" ") {
    console.log("Executed");
}
\`\`\`

---

Most people think:

> That's basically empty.

---

JavaScript disagrees.

The string contains one character:

\`\`\`text
space
\`\`\`

So it's truthy.

The code runs.

---

Now let's flip it.

Predict:

\`\`\`javascript
if ("") {
    console.log("Executed");
}
\`\`\`

---

This time nothing happens.

---

Because:

\`\`\`javascript
""
\`\`\`

is one of JavaScript's falsy values.

---

The biggest mistake beginners make is trying to memorize hundreds of truthy values.

Don't.

---

Memorize the falsy values.

Everything else becomes truthy.

---

The important falsy values are:

\`\`\`javascript
false
0
""
null
undefined
NaN
\`\`\`

---

Now predict:

\`\`\`javascript
let errorCount = "0";

if (errorCount) {
    console.log("Shutdown");
}
\`\`\`

Will it run?

---

Yes.

Because:

\`\`\`javascript
"0"
\`\`\`

is text.

Not zero.

---

This exact misunderstanding appears in authentication systems, checkout pages, and production APIs.

---

### The Rule

When debugging a condition, stop looking at the value.

Start looking at the type.

Most truthy/falsy bugs are actually type bugs.

---`,
          trap: {
            code: `// No trap defined yet`,
            flaw: `Understanding the theory deeply is the key here.`
          },
          challenge: {
            description: `Review the theory and experiment with these concepts.`,
            buggyCode: `// Experiment here`,
            testCases: [],
            rewardCoins: 5,
            missionType: `Warmup`
          }
        }
      ],
      mission: {
        title: `The Corrupted Checkout Payload`,
        tier: 5,
        scenario: `You are a full-stack developer at a major e-commerce platform. During a holiday sale, the frontend sends ALL data to your server as text strings. Because of implicit coercion, checkout math breaks. Customers are charged thousands because + concatenates strings, expired vouchers are accepted because "false" is truthy, and whitespace coupons slip through. Fix it before mass refunds are issued.`,
        objectives: [
          `Explicitly convert productPrice and shippingTax to numbers before adding`,
          `Convert userPoints to Number() — the string "0" is truthy, the number 0 is falsy`,
          `Reassign hasVoucher to the boolean false (no quotes)`,
          `Reassign couponInput to empty string "" to make it falsy`
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
          {
            description: `cartTotal must be 135`,
            assertion: `\\nassertEqual(cartTotal, 135, 'Convert strings to numbers before adding');`
          },
          {
            description: `"Voucher Accepted" must NOT log`,
            assertion: `assertEqual(__logs.some(l => l.includes('Voucher')), false, 'hasVoucher should be false');`
          },
          {
            description: `"Processing User Points" must NOT log`,
            assertion: `assertEqual(__logs.some(l => l.includes('Points')), false, 'userPoints should be falsy number 0');`
          }
        ],
        rewardCoins: 18
      }
    },
    {
      id: 6,
      title: `Logic & Conditionals`,
      icon: `🔀`,
      color: `#5DCAA5`,
      topics: [
        {
          id: `6-1`,
          title: `Comparison Operators (>, <, >=, <=)`,
          microTags: [
            `#Comparison`,
            `#Operators`
          ],
          theory: `Imagine you're building a competitive coding platform.

Two players finish a challenge.

Player A:

\`\`\`javascript
95
\`\`\`

Player B:

\`\`\`javascript
87
\`\`\`

Easy.

You instantly know who ranked higher.

---

Now let's make it weird.

Predict:

\`\`\`javascript
"10" > "2"
\`\`\`

True or false?

Don't run it.

Actually guess.

---

Most beginners answer:

\`\`\`text
true
\`\`\`

Because:

\`\`\`text
10 > 2
\`\`\`

is obviously true.

---

JavaScript disagrees.

The answer is:

\`\`\`text
false
\`\`\`

---

Why?

Because these aren't numbers.

They're strings.

---

JavaScript starts comparing character by character.

It looks at:

\`\`\`text
"1"
\`\`\`

and

\`\`\`text
"2"
\`\`\`

The very first comparison already decides the result.

Since:

\`\`\`text
"1" < "2"
\`\`\`

JavaScript immediately stops.

---

It never even looks at the zero.

---

Now predict:

\`\`\`javascript
"apple" > "banana"
\`\`\`

---

Answer:

\`\`\`text
false
\`\`\`

Because:

\`\`\`text
a < b
\`\`\`

alphabetically.

---

This is why leaderboards, rankings, and sorting systems break when numbers accidentally arrive as strings.

---

Now predict:

\`\`\`javascript
let passingScore = 50;
let studentScore = 50;

studentScore >= passingScore
\`\`\`

---

Result:

\`\`\`text
true
\`\`\`

---

Because:

\`\`\`text
greater than OR equal
\`\`\`

means both cases are allowed.

---

### The Rule

Comparison operators always return:

\`\`\`javascript
true
\`\`\`

or

\`\`\`javascript
false
\`\`\`

And before trusting a comparison, ask:

> "Am I comparing numbers or text?"

Because JavaScript treats them very differently.

---`,
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
            description: `Set \`passingScore = 50\` and \`studentScore = 50\`. Store \`studentScore >= passingScore\` in \`hasPassed\`.`,
            buggyCode: `let passingScore = 50;
let studentScore = 50;
// Bug: using > instead of >= (student at exactly 50 should pass)
let hasPassed = studentScore > passingScore;`,
            testCases: [
              {
                description: `hasPassed must be true when scores are equal`,
                assertion: `\\nassertEqual(hasPassed, true, 'studentScore >= passingScore should be true when equal');`
              },
              {
                description: `Code must use >= operator`,
                assertion: `assertEqual(__rawCode__.includes('>='), true, 'Must use >= not just >');`
              }
            ],
            rewardCoins: 10,
            missionType: `Concept`
          }
        },
        {
          id: `6-2`,
          title: `Loose Equality (== and !=)`,
          microTags: [
            `#StrictEquality`,
            `#LooseEquality`
          ],
          theory: `This is probably the most dangerous topic you've learned so far.

Let's start with a prediction.

---

What does this return?

\`\`\`javascript
0 == false
\`\`\`

---

Most beginners stare at it for a second.

Then answer:

\`\`\`text
false
\`\`\`

Different values.

Different types.

Makes sense.

---

Actual answer:

\`\`\`text
true
\`\`\`

---

Why?

Because loose equality has one goal:

> Make the comparison succeed if possible.

---

JavaScript secretly changes types behind the scenes.

It converts:

\`\`\`javascript
false
\`\`\`

into:

\`\`\`javascript
0
\`\`\`

Then compares:

\`\`\`javascript
0 == 0
\`\`\`

---

Now predict:

\`\`\`javascript
"" == false
\`\`\`

---

Result:

\`\`\`text
true
\`\`\`

---

Again.

JavaScript starts converting things.

---

Now predict this monster:

\`\`\`javascript
[] == 0
\`\`\`

---

Most people answer:

\`\`\`text
false
\`\`\`

---

Actual result:

\`\`\`text
true
\`\`\`

---

This is one of the most famous JavaScript traps.

The empty array becomes:

\`\`\`javascript
""
\`\`\`

Then:

\`\`\`javascript
0
\`\`\`

Then JavaScript compares:

\`\`\`javascript
0 == 0
\`\`\`

---

This is exactly why professionals avoid:

\`\`\`javascript
==
\`\`\`

whenever possible.

---

### The Rule

Loose equality is not checking:

> "Are these identical?"

It's checking:

> "Can I somehow make these match?"

That difference causes real bugs.

---`,
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
            description: `Compare integer \`pinCode = 1234\` and string \`userInput = "1234"\` using ===. Store in \`isMatch\`.`,
            buggyCode: `let pinCode = 1234;
let userInput = "1234";
// Bug: using == allows type coercion (unsafe!)
let isMatch = pinCode == userInput; // this would be true — wrong!`,
            testCases: [
              {
                description: `isMatch must be false (different types)`,
                assertion: `\\nassertEqual(isMatch, false, '1234 (number) !== "1234" (string) with strict equality');`
              },
              {
                description: `Code must use === not ==`,
                assertion: `assertEqual(__rawCode__.includes('==='), true, 'Must use === for strict equality');
assertEqual(__rawCode__.includes('==') && !__rawCode__.includes('==='), false, 'Remove == and use ===');`
              }
            ],
            rewardCoins: 10,
            missionType: `Concept`
          }
        },
        {
          id: `6-3`,
          title: `Strict Equality (=== and !==)`,
          microTags: [
            `#Conditionals`,
            `#IfElse`
          ],
          theory: `Now let's look at the operator professionals actually use.

---

Predict:

\`\`\`javascript
0 === false
\`\`\`

---

Answer:

\`\`\`text
false
\`\`\`

---

Why?

Because strict equality asks two questions:

---

Question 1:

\`\`\`text
Do the values match?
\`\`\`

---

Question 2:

\`\`\`text
Do the types match?
\`\`\`

---

If either answer is no:

\`\`\`javascript
false
\`\`\`

---

No coercion.

No guessing.

No hidden conversions.

---

Now predict:

\`\`\`javascript
1234 === "1234"
\`\`\`

---

Result:

\`\`\`text
false
\`\`\`

---

Same digits.

Different types.

---

Now for one of JavaScript's most famous traps.

Predict:

\`\`\`javascript
NaN === NaN
\`\`\`

---

Most beginners answer:

\`\`\`text
true
\`\`\`

---

Wrong.

---

The result is:

\`\`\`text
false
\`\`\`

---

Even though both sides are literally:

\`\`\`javascript
NaN
\`\`\`

---

This feels broken.

But it's intentional.

---

When JavaScript produces:

\`\`\`javascript
NaN
\`\`\`

it's saying:

> "The result of this calculation is invalid."

And invalid mathematical results are never considered equal.

---

So if you need to check for NaN:

Don't do this:

\`\`\`javascript
value === NaN
\`\`\`

---

Use:

\`\`\`javascript
Number.isNaN(value)
\`\`\`

---

### The Rule

Use:

\`\`\`javascript
===
\`\`\`

and

\`\`\`javascript
!==
\`\`\`

by default.

Treat:

\`\`\`javascript
==
\`\`\`

like a loaded weapon.

---`,
          trap: {
            code: `let isAdmin = false;
if (isAdmin === true); {
    console.log("Deleting Database...");
}`,
            flaw: `The database deletion code ALWAYS runs. A semicolon <code>;</code> after the <code>if</code> parenthesis ends the statement immediately. The <code>{}</code> block below is now treated as standalone code — a completely separate block that always executes, regardless of <code>isAdmin</code>.`
          },
          challenge: {
            description: `Write a speed checker: log "Speeding" if >80, "Normal" if >40, "Slow" otherwise.`,
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
              {
                description: `speed=90 must log "Speeding"`,
                assertion: `assertEqual(__logs[0], 'Speeding', 'speed=90 must log "Speeding"');`
              },
              {
                description: `Code must use if (speed > 80)`,
                assertion: `assertEqual(__rawCode__.includes('speed > 80') || __rawCode__.includes('speed >= 81'), true, 'Missing check for > 80');`
              },
              {
                description: `Code must use else if (speed > 40)`,
                assertion: `assertEqual(__rawCode__.includes('speed > 40') || __rawCode__.includes('speed >= 41'), true, 'Missing check for > 40');`
              }
            ],
            rewardCoins: 15,
            missionType: `Concept`
          }
        },
        {
          id: `6-4`,
          title: `The if statement block`,
          microTags: [
            `#LogicalOperators`,
            `#Ternary`,
            `#ShortCircuit`
          ],
          theory: `Everything in this module leads here.

Because comparisons alone don't make decisions.

They only produce:

\`\`\`javascript
true
\`\`\`

or

\`\`\`javascript
false
\`\`\`

---

The \`if\` statement is what acts on that result.

---

Imagine you're building Netflix.

A user clicks Play.

The system checks:

\`\`\`javascript
isSubscribed
\`\`\`

---

If true:

Play the movie.

---

If false:

Show payment screen.

---

That's exactly what an \`if\` statement does.

---

Predict:

\`\`\`javascript
let isSubscribed = true;

if (isSubscribed) {
    console.log("Playing Movie");
}
\`\`\`

---

What happens?

---

The message prints.

Easy.

---

Now predict:

\`\`\`javascript
let isSubscribed = false;

if (isSubscribed) {
    console.log("Playing Movie");
}
\`\`\`

---

Nothing happens.

---

Because the gate stayed closed.

---

Now for a bug that has destroyed countless hours.

Predict:

\`\`\`javascript
let isAdmin = false;

if (isAdmin === true); {
    console.log("Deleting Database");
}
\`\`\`

Will the message print?

---

Most beginners answer:

\`\`\`text
No
\`\`\`

Because:

\`\`\`javascript
false === true
\`\`\`

is false.

---

Logical answer.

Still wrong.

---

The message prints.

---

Why?

Because this:

\`\`\`javascript
if (isAdmin === true);
\`\`\`

already ended.

The semicolon terminated the instruction.

---

JavaScript sees:

\`\`\`javascript
{
   console.log("Deleting Database");
}
\`\`\`

as completely separate code.

---

The condition was ignored.

The block runs anyway.

---

This tiny semicolon has caused real production bugs.

---

### The Rule

An \`if\` statement is a gate.

If the condition is truthy, the gate opens.

If the condition is falsy, the gate stays closed.

And never place a semicolon directly after the condition.

---`,
          trap: {
            code: `let playerPoints = 150;
let rank;
playerPoints > 100 ? let rank = "Pro" : let rank = "Amateur";`,
            flaw: `Fatal SyntaxError. You cannot <code>let</code> declare variables inside ternary branches. The ternary must return a value that gets assigned. Correct: <code>let rank = playerPoints > 100 ? "Pro" : "Amateur";</code>`
          },
          challenge: {
            description: `Use a ternary to assign "Adult" or "Minor" based on age >= 18. No if/else allowed.`,
            buggyCode: `let age = 20;
// Bug: using if/else when ternary is required
let status;
if (age >= 18) {
    status = "Adult";
} else {
    status = "Minor";
}`,
            testCases: [
              {
                description: `status must equal "Adult" when age=20`,
                assertion: `\\nassertEqual(status, 'Adult');`
              },
              {
                description: `Code must use ternary operator (?) not if/else`,
                assertion: `assertEqual(__rawCode__.includes('?'), true, 'Must use ternary operator ?');
assertEqual(__rawCode__.includes('if'), false, 'Remove if/else — use ternary');`
              }
            ],
            rewardCoins: 15,
            missionType: `Concept`
          }
        },
        {
          id: `6-5`,
          title: `The else block`,
          microTags: [
            `#Theory`,
            `#Concept`
          ],
          theory: `Let's start with a simple question.

What should a system do when the main condition fails?

Imagine you're building Spotify.

A user clicks a premium-only song.

The system checks:

\`\`\`javascript
isPremium
\`\`\`

If true:

Play the song.

But what if it's false?

Should the application do nothing?

Should it crash?

Should it leave the user staring at the screen?

---

That's why \`else\` exists.

It provides a fallback plan.

---

Predict:

\`\`\`javascript
let isPremium = false;

if (isPremium) {
    console.log("Playing Song");
} else {
    console.log("Upgrade Required");
}
\`\`\`

What prints?

---

Answer:

\`\`\`text
Upgrade Required
\`\`\`

---

Because the first condition failed.

The fallback took over.

---

Now here's the important mental model.

An \`else\` does not ask a question.

It doesn't have a condition.

It simply says:

> "If everything above failed, do this."

---

Now let's look at a real bug.

Predict:

\`\`\`javascript
if (batteryLevel > 20) {
    console.log("Device Running");
}

console.log("Checking Diagnostics");

else {
    console.log("Charge Device");
}
\`\`\`

Will this run?

---

Many beginners focus on the condition.

The condition isn't the problem.

---

The problem is:

\`\`\`javascript
else
\`\`\`

must be attached directly to an \`if\`.

---

JavaScript reads:

\`\`\`javascript
console.log("Checking Diagnostics");
\`\`\`

and thinks:

> The if statement is finished.

Then it suddenly encounters:

\`\`\`javascript
else
\`\`\`

with nothing attached to it.

---

The program crashes before it even starts.

---

### The Rule

\`else\` is not independent.

It must be connected directly to an \`if\`.

Think of them as two halves of the same decision.

---`,
          trap: {
            code: `// No trap defined yet`,
            flaw: `Understanding the theory deeply is the key here.`
          },
          challenge: {
            description: `Review the theory and experiment with these concepts.`,
            buggyCode: `// Experiment here`,
            testCases: [],
            rewardCoins: 5,
            missionType: `Warmup`
          }
        },
        {
          id: `6-6`,
          title: `The else if block for multiple conditions`,
          microTags: [
            `#Theory`,
            `#Concept`
          ],
          theory: `Imagine you're building a grading system.

A student scores:

\`\`\`javascript
95
\`\`\`

What grade should they get?

---

One option is:

\`\`\`javascript
if (score > 90) {
}
if (score > 75) {
}
if (score > 50) {
}
\`\`\`

But now multiple blocks can run.

That's not what we want.

---

We want exactly one result.

That's where \`else if\` comes in.

---

Think of an \`else if\` chain like security checkpoints.

JavaScript checks them one by one.

The moment one passes:

> Stop searching.

---

Predict:

\`\`\`javascript
let score = 95;

if (score > 50) {
    console.log("C");
}
else if (score > 75) {
    console.log("B");
}
else if (score > 90) {
    console.log("A");
}
\`\`\`

What prints?

---

Most beginners answer:

\`\`\`text
A
\`\`\`

Makes sense.

95 deserves an A.

---

JavaScript disagrees.

---

The answer is:

\`\`\`text
C
\`\`\`

---

Why?

Because JavaScript doesn't search for the best answer.

It searches for the first true answer.

---

It sees:

\`\`\`javascript
95 > 50
\`\`\`

True.

---

Mission complete.

Stop searching.

Ignore everything else.

---

This is one of the most common business-logic bugs in programming.

---

Now fix it mentally.

Which condition should come first?

---

The most restrictive one:

\`\`\`javascript
score > 90
\`\`\`

Then:

\`\`\`javascript
score > 75
\`\`\`

Then:

\`\`\`javascript
score > 50
\`\`\`

---

Now the system works correctly.

---

### The Rule

In an \`else if\` chain:

JavaScript stops at the first true condition.

Always place the most specific conditions first.

---`,
          trap: {
            code: `// No trap defined yet`,
            flaw: `Understanding the theory deeply is the key here.`
          },
          challenge: {
            description: `Review the theory and experiment with these concepts.`,
            buggyCode: `// Experiment here`,
            testCases: [],
            rewardCoins: 5,
            missionType: `Warmup`
          }
        },
        {
          id: `6-7`,
          title: `Logical Operators (&& AND, || OR, ! NOT)`,
          microTags: [
            `#Theory`,
            `#Concept`
          ],
          theory: `This is where individual conditions become real decision systems.

---

Imagine you're organizing a concert.

A person can enter only if:

* they are an adult
* they have a ticket

Both conditions are required.

---

Predict:

\`\`\`javascript
let isAdult = true;
let hasTicket = true;

isAdult && hasTicket
\`\`\`

---

Answer:

\`\`\`text
true
\`\`\`

---

Now predict:

\`\`\`javascript
true && false
\`\`\`

---

Answer:

\`\`\`text
false
\`\`\`

---

Because AND is strict.

One failure ruins everything.

---

Think of it like two locks on a door.

Both must open.

---

Now let's look at OR.

Predict:

\`\`\`javascript
false || true
\`\`\`

---

Answer:

\`\`\`text
true
\`\`\`

---

OR is much more relaxed.

It only needs one success.

---

Think of it like having two keys.

Either key can open the door.

---

Now for the most misunderstood operator.

---

Predict:

\`\`\`javascript
!true
\`\`\`

---

Answer:

\`\`\`text
false
\`\`\`

---

Predict:

\`\`\`javascript
!false
\`\`\`

---

Answer:

\`\`\`text
true
\`\`\`

---

Easy.

Now let's combine everything.

---

Predict:

\`\`\`javascript
let inputPassword = "";

let overrideCode = "ADMIN_77";

if (!inputPassword || overrideCode) {
    console.log("Authorized");
}
\`\`\`

Will it run?

---

Most beginners start analyzing the password.

That's not where the bug is.

---

Look carefully.

First:

\`\`\`javascript
!inputPassword
\`\`\`

The password is:

\`\`\`javascript
""
\`\`\`

which is falsy.

---

NOT flips it:

\`\`\`javascript
true
\`\`\`

---

Now JavaScript sees:

\`\`\`javascript
true || overrideCode
\`\`\`

---

For OR, finding one true value is enough.

JavaScript immediately stops.

---

The block executes.

---

A blank password just got access.

---

This is the exact kind of bug that creates real security vulnerabilities.

---

### The Rule

\`\`\`javascript
&&
\`\`\`

requires everything.

---

\`\`\`javascript
||
\`\`\`

requires anything.

---

\`\`\`javascript
!
\`\`\`

flips the result.

---

And always read complex conditions one piece at a time.

---`,
          trap: {
            code: `// No trap defined yet`,
            flaw: `Understanding the theory deeply is the key here.`
          },
          challenge: {
            description: `Review the theory and experiment with these concepts.`,
            buggyCode: `// Experiment here`,
            testCases: [],
            rewardCoins: 5,
            missionType: `Warmup`
          }
        },
        {
          id: `6-8`,
          title: `The Ternary Operator (condition ? true : false)`,
          microTags: [
            `#Theory`,
            `#Concept`
          ],
          theory: `Let's start with a question.

What if all you need is a simple choice?

---

Example:

\`\`\`javascript
if (age >= 18) {
    status = "Adult";
} else {
    status = "Minor";
}
\`\`\`

Works perfectly.

But sometimes it feels excessive.

---

That's why JavaScript provides the ternary operator.

---

Predict:

\`\`\`javascript
let status =
age >= 18
? "Adult"
: "Minor";
\`\`\`

What does it do?

---

Exactly the same thing.

---

Think of a ternary as a mini if/else that returns a value.

---

This is the important part.

A ternary does not execute blocks.

A ternary produces a value.

---

Now let's look at the classic mistake.

Predict:

\`\`\`javascript
playerPoints > 100
? let rank = "Pro"
: let rank = "Amateur";
\`\`\`

Valid or invalid?

---

Many beginners think:

> Looks fine.

---

JavaScript crashes.

---

Why?

Because a ternary expects:

\`\`\`javascript
value
\`\`\`

or

\`\`\`javascript
value
\`\`\`

---

Instead it found:

\`\`\`javascript
let rank = ...
\`\`\`

which is a statement.

---

Remember Module 1?

Statements perform actions.

Expressions produce values.

---

A ternary requires values.

---

The correct version:

\`\`\`javascript
let rank =
playerPoints > 100
? "Pro"
: "Amateur";
\`\`\`

---

Now the ternary produces a value.

Then that value gets assigned.

---

### The Rule

Use a ternary when:

* the decision is simple
* you need a value

Avoid ternaries when the logic becomes large or difficult to read.

---`,
          trap: {
            code: `// No trap defined yet`,
            flaw: `Understanding the theory deeply is the key here.`
          },
          challenge: {
            description: `Review the theory and experiment with these concepts.`,
            buggyCode: `// Experiment here`,
            testCases: [],
            rewardCoins: 5,
            missionType: `Warmup`
          }
        }
      ],
      mission: {
        title: `The Anti-Cheat Leaderboard Engine`,
        tier: 6,
        scenario: `You are the lead security engineer for a high-stakes programming tournament. The grand finale is live but the anti-cheat engine is malfunctioning. Legitimate grandmasters are getting locked while actual cheaters slip through. Logic gates are broken due to loose equality, wrong logical operators, backwards if-else hierarchy, and invalid ternary syntax. Fix it in 10 minutes before the leaderboard becomes permanent.`,
        objectives: [
          `Change == to === in Security Gate (loose equality lets string '0' slip as false)`,
          `Change || to && in Manual Review (should lock ONLY IF both: high score AND no proctor)`,
          `Reorder the tier checks — Grandmaster (>=95) must come BEFORE Silver (>=75) and Bronze (>=50)`,
          `Fix the ternary: let fastTrack = completionTime < 30 ? 'Approved' : 'Denied'`
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
          {
            description: `userScore 98 must log "Tier: Grandmaster"`,
            assertion: `assertEqual(__logs.some(l=>l.includes('Grandmaster')), true, 'Fix the if-else order');`
          },
          {
            description: `"Account Locked" must log (both conditions true)`,
            assertion: `assertEqual(__logs.some(l=>l.includes('Locked')), true, 'Change || to && in Manual Review');`
          },
          {
            description: `fastTrack must equal "Approved"`,
            assertion: `\\nassertEqual(fastTrack, 'Approved', 'Fix ternary syntax: let fastTrack = condition ? val : val');`
          },
          {
            description: `Code must use === not == for cheatFlags`,
            assertion: `assertEqual(__rawCode__.includes('==='), true, 'Use === for strict equality on cheatFlags');`
          }
        ],
        rewardCoins: 25
      }
    }
  ]
};
