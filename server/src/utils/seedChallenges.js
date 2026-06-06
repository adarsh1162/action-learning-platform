/**
 * SEED SCRIPT — Run once to populate the DB with challenges.
 * Usage (from the /server directory):
 *   node src/utils/seedChallenges.js
 */

const mongoose = require('mongoose');
const dotenv   = require('dotenv');

// Load env vars so we can connect to the DB
dotenv.config();

const Challenge = require('../models/Challenge');

const challenges = [
    // ─── Challenge 1: #ArrayFilter ──────────────────────────────────────────────
    {
        title: 'Fix the Broken Product Filter',
        description:
            "An eCommerce store's product filter is broken. The function `getInStockProducts` is supposed to return an array of product **objects** that are in stock. Right now it's using `.map()` instead of `.filter()`, so it returns an array of booleans instead of objects. Fix the bug.",
        buggyCode:
`function getInStockProducts(products) {
  // Bug: map() transforms every element — filter() is what keeps matching ones.
  return products.map(p => p.inStock === true);
}`,
        solutionCode:
`function getInStockProducts(products) {
  return products.filter(p => p.inStock === true);
}`,
        testCases: [
            {
                description: 'Should return only items where inStock is true',
                assertion: `
const products = [{id: 1, name: 'Shoes', inStock: true}, {id: 2, name: 'Hat', inStock: false}];
const result = getInStockProducts(products);
assertEqual(result.length, 1);
assertEqual(result[0].id, 1);
`
            },
            {
                description: 'Should return an empty array if nothing is in stock',
                assertion: `
const products = [{id: 1, inStock: false}, {id: 2, inStock: false}];
const result = getInStockProducts(products);
assertEqual(Array.isArray(result), true);
assertEqual(result.length, 0);
`
            },
            {
                description: 'Should return all items when everything is in stock',
                assertion: `
const products = [{id: 1, inStock: true}, {id: 2, inStock: true}];
const result = getInStockProducts(products);
assertEqual(result.length, 2);
`
            }
        ],
        microTags: ['#ArrayFilter', '#ArrayMap', '#HigherOrderFunctions'],
        missionType: 'Concept',
        rewardCoins: 10
    },

    // ─── Challenge 2: #AsyncAwait #Promises ─────────────────────────────────────
    {
        title: 'Fix the Async Data Fetcher',
        description:
            "A food delivery app's order-status fetcher is broken. The function `getOrderStatus` is `async` but it's missing `await` before the simulated API call, so it always returns a Promise object instead of the resolved value. Add `await` in the right place to fix it.",
        buggyCode:
`// Simulated async API call — do not modify this.
function fakeApiCall(orderId) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ orderId, status: 'Delivered' }), 10);
  });
}

async function getOrderStatus(orderId) {
  // Bug: Missing await — returns a Promise, not the resolved value.
  const result = fakeApiCall(orderId);
  return result;
}`,
        solutionCode:
`function fakeApiCall(orderId) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ orderId, status: 'Delivered' }), 10);
  });
}

async function getOrderStatus(orderId) {
  const result = await fakeApiCall(orderId);
  return result;
}`,
        testCases: [
            {
                description: 'Should return an object, not a Promise',
                assertion: `
function fakeApiCall(orderId) {
  return new Promise(resolve => { setTimeout(() => resolve({ orderId, status: 'Delivered' }), 10); });
}
const resultPromise = getOrderStatus(42);
assertEqual(resultPromise instanceof Promise, true, 'getOrderStatus should return a Promise (it is async)');
`
            },
            {
                description: 'Should resolve with the correct orderId and status',
                assertion: `
function fakeApiCall(orderId) {
  return new Promise(resolve => { setTimeout(() => resolve({ orderId, status: 'Delivered' }), 10); });
}
const result = await getOrderStatus(99);
assertEqual(result.orderId, 99);
assertEqual(result.status, 'Delivered');
`
            }
        ],
        microTags: ['#AsyncAwait', '#Promises', '#AsynchronousJS'],
        missionType: 'Concept',
        rewardCoins: 15
    },

    // ─── Challenge 3: #Closures #Scope ──────────────────────────────────────────
    {
        title: 'Fix the Counter Factory',
        description:
            "A fintech dashboard uses a `makeCounter` function to create independent counters for different accounts. But right now all counters share the same variable — so incrementing one counter affects all of them. Fix the closure so each counter created by `makeCounter` keeps its own independent count.",
        buggyCode:
`// Bug: count is declared OUTSIDE makeCounter,
// so all counters share the same variable (broken closure).
let count = 0;

function makeCounter() {
  return {
    increment: () => { count++; },
    getCount:  () => count
  };
}`,
        solutionCode:
`function makeCounter() {
  let count = 0; // Each call to makeCounter gets its own 'count'
  return {
    increment: () => { count++; },
    getCount:  () => count
  };
}`,
        testCases: [
            {
                description: 'Counter should start at 0',
                assertion: `
const c = makeCounter();
assertEqual(c.getCount(), 0);
`
            },
            {
                description: 'Counter should increment correctly',
                assertion: `
const c = makeCounter();
c.increment();
c.increment();
assertEqual(c.getCount(), 2);
`
            },
            {
                description: 'Two counters should be fully independent',
                assertion: `
const c1 = makeCounter();
const c2 = makeCounter();
c1.increment();
c1.increment();
c1.increment();
c2.increment();
assertEqual(c1.getCount(), 3, 'c1 should be 3');
assertEqual(c2.getCount(), 1, 'c2 should be 1 (independent of c1)');
`
            }
        ],
        microTags: ['#Closures', '#Scope', '#FunctionFactory'],
        missionType: 'Concept',
        rewardCoins: 20
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing challenges before re-seeding
        await Challenge.deleteMany({});
        console.log('🗑️  Cleared existing challenges');

        const inserted = await Challenge.insertMany(challenges);
        console.log(`🌱 Seeded ${inserted.length} challenges successfully:`);
        inserted.forEach(c => console.log(`   - [${c._id}] ${c.title}`));

    } catch (error) {
        console.error('❌ Seed failed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        process.exit(0);
    }
};

seed();
