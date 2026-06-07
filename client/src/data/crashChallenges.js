export const crashChallenges = [
  {
    id: "crash-1",
    title: "The Missing Property",
    difficulty: "Beginner",
    category: "Type Errors",
    description: "Find an input that crashes the getSecret function.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function getSecret(user) {
    return user.secretKey.toUpperCase();
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = {
  // ???
};`,
    solution: `{}`,
    whyItBreaks: `The code assumes every object has a \`secretKey\` property. \`{}.secretKey\` returns \`undefined\`, and \`undefined.toUpperCase()\` throws a TypeError.`,
    secureFix: `function getSecret(user) {\n    return user.secretKey?.toUpperCase() ?? "No Key";\n}`
  },
  {
    id: "crash-2",
    title: "Empty Cart",
    difficulty: "Beginner",
    category: "Type Errors",
    description: "Find an input that crashes the checkout function.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function checkout(cart) {
    return cart[0].price * cart.length;
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = [
  // ???
];`,
    solution: `[]`,
    whyItBreaks: `If the array is empty, \`cart[0]\` becomes \`undefined\`, and \`undefined.price\` causes a crash.`,
    secureFix: `if(cart.length === 0) return 0;\nreturn cart[0].price * cart.length;`
  },
  {
    id: "crash-3",
    title: "The Number Pretender",
    difficulty: "Beginner",
    category: "Type Errors",
    description: "Break the double function.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function double(num) {
    return num.toFixed(2);
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = "hello"; // ???`,
    solution: `"hello"`,
    whyItBreaks: `Strings don't have \`toFixed()\`. \`"hello".toFixed()\` throws a TypeError.`,
    secureFix: `if(typeof num !== 'number') return "0.00";\nreturn num.toFixed(2);`
  },
  {
    id: "crash-4",
    title: "Divide By Trouble",
    difficulty: "Beginner",
    category: "Logic Flaws",
    description: "Produce an impossible result.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function average(sum, count) {
    // If you pass an impossible input, I'll crash... wait, will I?
    // Let's force an error if the result is invalid to simulate a crash
    const res = sum / count;
    if (!isFinite(res)) throw new Error("Invalid math result!");
    return res;
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
// How do you call average(100, 0) using myPayload?
// The system runs: average(myPayload.sum, myPayload.count)

const myPayload = {
  sum: 100,
  count: 0
};`,
    solution: `{ sum: 100, count: 0 }`,
    whyItBreaks: `Division by zero creates \`Infinity\`. In our simulation, we forced an error for \`!isFinite()\` to catch this edge case.`,
    secureFix: `if(count === 0) return 0;\nreturn sum / count;`
  },
  {
    id: "crash-5",
    title: "First Letter",
    difficulty: "Beginner",
    category: "Type Errors",
    description: "Crash it.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function getInitial(name) {
    return name[0].toUpperCase();
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = null; // ???`,
    solution: `null`,
    whyItBreaks: `The code tries to access \`null[0]\` which throws a TypeError.`,
    secureFix: `if(typeof name !== 'string' || name.length === 0) return "";\nreturn name[0].toUpperCase();`
  },
  {
    id: "crash-6",
    title: "Username Length",
    difficulty: "Beginner",
    category: "Type Errors",
    description: "Find an input that crashes it.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function isValid(username) {
    return username.length >= 5;
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = undefined; // ???`,
    solution: `undefined`,
    whyItBreaks: `\`undefined.length\` throws a TypeError.`,
    secureFix: `return typeof username === 'string' && username.length >= 5;`
  },
  {
    id: "crash-7",
    title: "Last Item Finder",
    difficulty: "Beginner",
    category: "Type Errors",
    description: "Crash it.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function getLast(arr) {
    return arr[arr.length - 1].name;
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = []; // ???`,
    solution: `[]`,
    whyItBreaks: `The last element becomes \`undefined\`, and \`.name\` access crashes.`,
    secureFix: `if(!arr || arr.length === 0) return null;\nreturn arr[arr.length - 1]?.name;`
  },
  {
    id: "crash-8",
    title: "Profile Viewer",
    difficulty: "Beginner",
    category: "Type Errors",
    description: "Break it.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function viewProfile(user) {
    return user.address.city;
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = {}; // ???`,
    solution: `{}`,
    whyItBreaks: `\`address\` doesn't exist, so \`undefined.city\` causes a TypeError.`,
    secureFix: `return user?.address?.city;`
  },
  {
    id: "crash-9",
    title: "Password Checker",
    difficulty: "Beginner",
    category: "Type Errors",
    description: "Crash it.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function check(password) {
    return password.includes("123");
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = null; // ???`,
    solution: `null`,
    whyItBreaks: `\`includes()\` cannot run on \`null\`.`,
    secureFix: `return typeof password === 'string' && password.includes("123");`
  },
  {
    id: "crash-10",
    title: "Total Score",
    difficulty: "Beginner",
    category: "Edge Cases",
    description: "Break it.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function calculate(scores) {
    return scores.reduce((a,b)=>a+b);
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = []; // ???`,
    solution: `[]`,
    whyItBreaks: `Calling \`reduce()\` on an empty array without an initial value throws a TypeError.`,
    secureFix: `return scores.reduce((a,b)=>a+b, 0); // added 0 as initial value`
  },
  {
    id: "crash-11",
    title: "Shopping Discount",
    difficulty: "Beginner",
    category: "Logic Flaws",
    description: "Produce an unexpected result.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function applyDiscount(price, discount) {
    const res = price - discount;
    if (isNaN(res)) throw new Error("Result is NaN!");
    return res;
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = { price: "apple", discount: 10 };`,
    solution: `{ price: "apple", discount: 10 }`,
    whyItBreaks: `Invalid arithmetic creates \`NaN\`. We simulate the crash by checking for \`isNaN\`.`,
    secureFix: `if(typeof price !== 'number' || typeof discount !== 'number') return 0;\nreturn price - discount;`
  },
  {
    id: "crash-12",
    title: "Capitalize Word",
    difficulty: "Beginner",
    category: "Type Errors",
    description: "Break it.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = 42; // ???`,
    solution: `42`,
    whyItBreaks: `Numbers don't have \`charAt()\`.`,
    secureFix: `if(typeof word !== 'string') return "";\nreturn word.charAt(0).toUpperCase() + word.slice(1);`
  },
  {
    id: "crash-13",
    title: "Infinite Coupon",
    difficulty: "Intermediate",
    category: "Logic Flaws",
    description: "Create an infinite loop. The system will timeout and crash.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function applyCoupons(price, coupons) {
    let i = 0;
    let iterations = 0;
    while(i < coupons.length) {
        if(iterations++ > 1000) throw new Error("Infinite loop detected!");
        
        price -= coupons[i].value;
        if(coupons[i].expired) continue;
        i++;
    }
    return price;
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = {
    price: 100,
    coupons: [
        { value: 10, expired: true }
    ]
};`,
    solution: `[{ value: 10, expired: true }]`,
    whyItBreaks: `\`continue\` skips \`i++\`. The loop stays forever at index 0.`,
    secureFix: `if(coupons[i].expired) { i++; continue; }`
  },
  {
    id: "crash-14",
    title: "Transaction Processor",
    difficulty: "Intermediate",
    category: "Logic Flaws",
    description: "Create an infinite loop.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function processTransactions(transactions) {
    let i = 0;
    let iterations = 0;
    while(i < transactions.length) {
        if(iterations++ > 1000) throw new Error("Infinite loop detected!");
        
        if(transactions[i].skip) continue;
        i++;
    }
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = [ { skip: true } ];`,
    solution: `[{ skip: true }]`,
    whyItBreaks: `Infinite loop because \`i++\` is skipped when \`skip\` is true.`,
    secureFix: `if(transactions[i].skip) { i++; continue; }`
  },
  {
    id: "crash-15",
    title: "Recursive Nightmare",
    difficulty: "Intermediate",
    category: "Edge Cases",
    description: "Trigger a Maximum Call Stack Size Exceeded error.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function countdown(n) {
    let iterations = 0;
    function recurse(num) {
        if(iterations++ > 1000) throw new Error("Maximum call stack size exceeded");
        if(num === 0) return;
        recurse(num - 1);
    }
    recurse(n);
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = Infinity;`,
    solution: `Infinity`,
    whyItBreaks: `\`Infinity - 1 === Infinity\`. The recursion never reaches zero. Eventually: Maximum call stack size exceeded.`,
    secureFix: `if(n < 0 || !isFinite(n)) return;\n// continue recursion`
  },
  {
    id: "crash-16",
    title: "Sort Scores",
    difficulty: "Intermediate",
    category: "Logic Flaws",
    description: "Produce the wrong top score. I will crash if the top score is not mathematically the largest.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function topScore(scores) {
    const top = scores.sort()[scores.length - 1];
    const max = Math.max(...scores);
    if(top !== max) throw new Error("Incorrect sort logic!");
    return top;
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = [1, 2, 10];`,
    solution: `[1, 2, 10]`,
    whyItBreaks: `Default sorting is lexicographical. So \`[1, 2, 10]\` becomes \`["1", "10", "2"]\`, making 2 the 'highest'.`,
    secureFix: `scores.sort((a,b) => a - b);`
  },
  {
    id: "crash-17",
    title: "Trusting Admin",
    difficulty: "Intermediate",
    category: "Edge Cases",
    description: "Crash it.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function isAdmin(user) {
    return user.role.toLowerCase() === "admin";
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = {};`,
    solution: `{}`,
    whyItBreaks: `\`role\` is undefined, so \`toLowerCase()\` crashes.`,
    secureFix: `return typeof user?.role === 'string' && user.role.toLowerCase() === "admin";`
  },
  {
    id: "crash-18",
    title: "Deep Object Explorer",
    difficulty: "Intermediate",
    category: "Edge Cases",
    description: "Crash it.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function getCountry(user) {
    return user.profile.location.country.name;
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = { profile: {} };`,
    solution: `{ profile: {} }`,
    whyItBreaks: `The chain becomes \`undefined.name\`.`,
    secureFix: `return user?.profile?.location?.country?.name;`
  },
  {
    id: "crash-19",
    title: "Self Referencing Loop",
    difficulty: "Pro",
    category: "Serialization",
    description: "Crash JSON.stringify.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function stringify(data) {
    return JSON.stringify(data);
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const obj = {};
obj.self = obj;
const myPayload = obj;`,
    solution: `const obj = {}; obj.self = obj;`,
    whyItBreaks: `The object contains a circular reference. \`JSON.stringify()\` cannot serialize circular structures.`,
    secureFix: `Use a library like flatted, or a custom replacer to handle circular references.`
  },
  {
    id: "crash-20",
    title: "Clone Disaster",
    difficulty: "Pro",
    category: "Serialization",
    description: "Crash it.",
    blueTeamCode: `// TARGET FUNCTION (Blue Team)
function clone(data) {
    return JSON.parse(
        JSON.stringify(data)
    );
}`,
    redTeamCode: `// YOUR EXPLOIT (Red Team)
const myPayload = { id: 10n };`,
    solution: `{ id: 10n }`,
    whyItBreaks: `\`JSON.stringify()\` cannot serialize BigInt values. Throws: TypeError: Do not know how to serialize a BigInt.`,
    secureFix: `Use \`structuredClone(data)\` which supports BigInt natively.`
  }
];
