/**
 * CODE EXECUTION WEB WORKER
 *
 * Why a Web Worker?
 *   User code runs in a completely separate thread. If the user writes an
 *   infinite loop or heavy computation, the main UI thread stays responsive.
 *
 * How tests work (THE CRITICAL FIX):
 *   We use `AsyncFunction` and concatenate the user's code + the test assertion
 *   into ONE single function body. This means:
 *     - The user's function declarations (e.g. `getInStockProducts`) are in
 *       the SAME scope as the test assertion that calls them.
 *     - This solves the "X is not defined" error that occurs when you run user
 *       code and test code in two separate `new Function()` calls.
 *     - Using AsyncFunction (instead of Function) also supports `await` in test
 *       assertions, enabling async challenge testing.
 */

// ── Assertion helper ─────────────────────────────────────────────────────────
const assertEqual = (actual, expected, message) => {
    // Deep equality for objects / arrays
    if (
        typeof actual   === 'object' && actual   !== null &&
        typeof expected === 'object' && expected !== null
    ) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(
                message || `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`
            );
        }
        return;
    }
    // Strict equality for primitives
    if (actual !== expected) {
        throw new Error(
            message || `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`
        );
    }
};

// AsyncFunction constructor — lets us `await` inside dynamically created code
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

// ── Message handler ───────────────────────────────────────────────────────────
self.addEventListener('message', async (e) => {
    const { code, tests, id } = e.data;

    // Global log accumulator for this execution run
    const logs = [];

    const testResults = [];
    let allPassed = true;

    try {
        // ── Run each test independently ─────────────────────────────────────
        for (const test of tests) {
            try {
                /**
                 * THE KEY: We build ONE combined function body:
                 *
                 *   [console shim]        <- captures console.log output
                 *   [user's code]         <- defines their functions/variables
                 *   [test assertion]      <- calls those functions and asserts
                 *
                 * Because everything lives in the same function scope, the
                 * user's declarations are visible to the assertion code.
                 *
                 * Parameters passed in: assertEqual (assertion helper),
                 *                       __logs      (shared log array reference)
                 */
                const combinedBody = `
                    // Console shim — redirect logs to the shared array
                    const console = {
                        log:   (...args) => { __logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')); },
                        warn:  (...args) => { __logs.push('[warn] ' + args.join(' ')); },
                        error: (...args) => { __logs.push('[error] ' + args.join(' ')); },
                    };

                    // ── USER CODE ──
                    ${code}

                    // ── TEST ASSERTION ──
                    ${test.assertion}
                `;

                const runTest = new AsyncFunction('assertEqual', '__logs', combinedBody);
                await runTest(assertEqual, logs);

                testResults.push({ description: test.description, passed: true });

            } catch (err) {
                allPassed = false;
                testResults.push({
                    description: test.description,
                    passed: false,
                    // Keep message clean — strip internal stack noise
                    error: err.message || err.toString()
                });
            }
        }

        self.postMessage({
            id,
            success: true,
            allPassed,
            testResults,
            logs
        });

    } catch (err) {
        // Top-level failure (shouldn't normally be reached, but safety net)
        self.postMessage({
            id,
            success: false,
            error: err.toString()
        });
    }
});
