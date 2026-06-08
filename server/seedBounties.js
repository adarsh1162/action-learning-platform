const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Bounty = require('./src/models/Bounty');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/action-learning');
        
        const mockBounties = [
            {
                title: "Fix Infinite Loop in Authentication Flow",
                company: "TechStartup Inc.",
                description: "Our login flow enters an infinite loop if the user's token expires. Fix the logic to properly return after redirecting to /login.",
                rewardType: "giftcard",
                rewardText: "₹500 Prize",
                rewardAmount: 500,
                difficulty: "Hard",
                tags: ["React", "Async", "Race Condition"],
                status: "open",
                postedDaysAgo: 2,
                buggyCode: `function handleAuth(token) {\n  if (!token) {\n    window.location.href = '/login';\n    // Bug: execution continues, causing loop\n  }\n  fetchUserData(token);\n}`,
                validationRegex: `window\\.location\\.href\\s*=\\s*['"]/login['"];\\s*return;`
            },
            {
                title: "Optimize Large List Rendering",
                company: "CodeCamp Core",
                description: "The dashboard crashes when loading 50,000 records. Implement basic memoization by wrapping the component in React.memo.",
                rewardType: "coins",
                rewardText: "2500 CodeCoins",
                rewardAmount: 2500,
                difficulty: "Intermediate",
                tags: ["Performance", "React"],
                status: "open",
                postedDaysAgo: 1,
                buggyCode: `const TransactionList = ({ transactions }) => {\n  return (\n    <ul>\n      {transactions.map(t => <li key={t.id}>{t.amount}</li>)}\n    </ul>\n  );\n};\nexport default TransactionList;`,
                validationRegex: `React\\.memo\\(TransactionList\\)`
            },
            {
                title: "Implement OAuth2 Social Login",
                company: "CloudNova",
                description: "We need GitHub OAuth integrated. Add the required 'scope' parameter with value 'user:email' to the GitHub login URL.",
                rewardType: "interview",
                rewardText: "Direct Interview Call",
                rewardAmount: 0,
                difficulty: "Pro",
                tags: ["OAuth", "Security"],
                status: "open",
                postedDaysAgo: 5,
                buggyCode: `const loginWithGithub = () => {\n  const clientId = '12345';\n  // Bug: Missing scope parameter\n  const url = \`https://github.com/login/oauth/authorize?client_id=\\${clientId}\`;\n  window.location.href = url;\n};`,
                validationRegex: `scope=user:email`
            },
            {
                title: "Fix Mobile Navigation Overflow",
                company: "DesignCo",
                description: "The menu overflows on mobile. Add 'overflow-x: hidden' to the main container.",
                rewardType: "swag",
                rewardText: "Company T-Shirt",
                rewardAmount: 0,
                difficulty: "Beginner",
                tags: ["CSS", "Responsive"],
                status: "open",
                postedDaysAgo: 10,
                buggyCode: `.main-container {\n  width: 100vw;\n  display: flex;\n  /* Bug: Need to hide horizontal overflow */\n}`,
                validationRegex: `overflow-x:\\s*hidden;`
            },
            {
                title: "Memory Leak in WebSockets",
                company: "Streamify",
                description: "Connections are not properly closed when a user leaves the room. Call 'socket.disconnect()' in the cleanup function.",
                rewardType: "cash",
                rewardText: "₹2000 Cash Prize",
                rewardAmount: 2000,
                difficulty: "Pro",
                tags: ["WebSockets", "Node.js", "Memory"],
                status: "open",
                postedDaysAgo: 0,
                buggyCode: `useEffect(() => {\n  const socket = io('http://localhost:3000');\n  socket.on('message', handleMessage);\n  \n  return () => {\n    // Bug: Not disconnecting socket\n    socket.off('message', handleMessage);\n  };\n}, []);`,
                validationRegex: `socket\\.disconnect\\(\\);`
            },
            {
                title: "Regex ReDoS Vulnerability",
                company: "CyberSec Corp",
                description: "Our email validation regex is vulnerable to ReDoS attacks (Catastrophic Backtracking). Fix it by removing the nested quantifiers.",
                rewardType: "giftcard",
                rewardText: "₹1000 Prize",
                rewardAmount: 1000,
                difficulty: "Pro",
                tags: ["Security", "Regex"],
                status: "open",
                postedDaysAgo: 1,
                buggyCode: `// Bug: Vulnerable regex (a+)+\nconst validateEmail = (email) => {\n  const vulnerableRegex = /^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$/;\n  return vulnerableRegex.test(email);\n};`,
                validationRegex: `^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`
            }
        ];
        await Bounty.deleteMany({});
        await Bounty.insertMany(mockBounties);
        console.log("Seeding successful");
        process.exit(0);
    } catch (err) {
        console.error("SEEDING ERROR:", err);
        process.exit(1);
    }
};

seed();
