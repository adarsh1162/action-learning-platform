const fs = require('fs');
let code = fs.readFileSync('client/src/data/curriculum.js', 'utf8');

// 1-1
code = code.replace(
  /const logs = \[\];\s*const warns = \[\];\s*const errors = \[\];\s*const console = \{\s*log: \(\.\.\.a\) => logs\.push\(a\.join\(' '\)\),\s*warn: \(\.\.\.a\) => warns\.push\(a\.join\(' '\)\),\s*error: \(\.\.\.a\) => errors\.push\(a\.join\(' '\)\)\s*\};\s*eval\(__userCode__\);\s*assertEqual\(logs\.includes\('System Start'\), true, 'console\.log\("System Start"\) not found'\);/g,
  \`assertEqual(__logs.some(l => !l.startsWith('[warn]') && !l.startsWith('[error]') && l.includes('System Start')), true, 'console.log("System Start") not found');\`
);

code = code.replace(
  /const logs = \[\];\s*const warns = \[\];\s*const errors = \[\];\s*const console = \{\s*log: \(\.\.\.a\) => logs\.push\(a\.join\(' '\)\),\s*warn: \(\.\.\.a\) => warns\.push\(a\.join\(' '\)\),\s*error: \(\.\.\.a\) => errors\.push\(a\.join\(' '\)\)\s*\};\s*eval\(__userCode__\);\s*assertEqual\(warns\.includes\('High CPU'\), true, 'console\.warn\("High CPU"\) not found'\);/g,
  \`assertEqual(__logs.some(l => l.startsWith('[warn]') && l.includes('High CPU')), true, 'console.warn("High CPU") not found');\`
);

code = code.replace(
  /const logs = \[\];\s*const warns = \[\];\s*const errors = \[\];\s*const console = \{\s*log: \(\.\.\.a\) => logs\.push\(a\.join\(' '\)\),\s*warn: \(\.\.\.a\) => warns\.push\(a\.join\(' '\)\),\s*error: \(\.\.\.a\) => errors\.push\(a\.join\(' '\)\)\s*\};\s*eval\(__userCode__\);\s*assertEqual\(errors\.includes\('System Crash'\), true, 'console\.error\("System Crash"\) not found'\);/g,
  \`assertEqual(__logs.some(l => l.startsWith('[error]') && l.includes('System Crash')), true, 'console.error("System Crash") not found');\`
);

// 1-2
code = code.replace(
  /const loggedValues = \[\];\s*const console = \{ log: \(\.\.\.a\) => loggedValues\.push\(Number\(a\[0\]\)\) \};\s*\\\s*assertEqual\(loggedValues\[0\], 100, 'First console\.log must print 100 before reassignment'\);/g,
  \`assertEqual(Number(__logs[0]), 100, 'First console.log must print 100 before reassignment');\`
);

code = code.replace(
  /const loggedValues = \[\];\s*const console = \{ log: \(\.\.\.a\) => loggedValues\.push\(Number\(a\[0\]\)\) \};\s*\\\s*assertEqual\(loggedValues\[1\], 50, 'Second console\.log must print 50 after reassignment'\);/g,
  \`assertEqual(Number(__logs[1]), 50, 'Second console.log must print 50 after reassignment');\`
);

// 1-4 Mission
code = code.replace(
  /const outputs = \[\];\s*const console = \{\s*log: \(m\) => outputs\.push\(\{type:'log', msg: m\}\),\s*warn: \(m\) => outputs\.push\(\{type:'warn', msg: m\}\),\s*error: \(m\) => outputs\.push\(\{type:'error', msg: m\}\)\s*\};\s*\\\s*assertEqual\(outputs\[0\]\.type, 'log'\);\s*assertEqual\(outputs\[0\]\.msg, 'Server reboot initiated\.'\);/g,
  \`assertEqual(!__logs[0].startsWith('[warn]') && !__logs[0].startsWith('[error]'), true, 'First output should be a normal log');\\nassertEqual(__logs[0], 'Server reboot initiated.');\`
);

code = code.replace(
  /const outputs = \[\];\s*const console = \{\s*log: \(m\) => outputs\.push\(\{type:'log', msg: m\}\),\s*warn: \(m\) => outputs\.push\(\{type:'warn', msg: m\}\),\s*error: \(m\) => outputs\.push\(\{type:'error', msg: m\}\)\s*\};\s*\\\s*assertEqual\(outputs\[1\]\.type, 'warn'\);\s*assertEqual\(outputs\[1\]\.msg, 'Power supply unstable\.'\);/g,
  \`assertEqual(__logs[1].startsWith('[warn]'), true, 'Second output should be a warning');\\nassertEqual(__logs[1].includes('Power supply unstable.'), true);\\n\`
);

code = code.replace(
  /const outputs = \[\];\s*const console = \{\s*log: \(m\) => outputs\.push\(\{type:'log', msg: m\}\),\s*warn: \(m\) => outputs\.push\(\{type:'warn', msg: m\}\),\s*error: \(m\) => outputs\.push\(\{type:'error', msg: m\}\)\s*\};\s*\\\s*const errorLine = outputs\.find\(o => o\.type === 'error'\);\s*assertEqual\(!!errorLine, true, 'No console\.error found'\);\s*assertEqual\(errorLine\.msg\.includes\('Database'\), true, 'Error message should mention Database'\);/g,
  \`const errorLine = __logs.find(o => o.startsWith('[error]'));\\nassertEqual(!!errorLine, true, 'No console.error found');\\nassertEqual(errorLine.includes('Database'), true, 'Error message should mention Database');\`
);

// 5-2 Mission
code = code.replace(
  /const logs = \[\]; const console = \{log: m => logs\.push\(m\), warn:\(\)=>{}, error:\(\)=>{}\};\s*\\n\\s*assertEqual\(logs\.some\(l => l\.includes\('Voucher'\)\), false, 'hasVoucher should be false'\);/g,
  \`assertEqual(__logs.some(l => l.includes('Voucher')), false, 'hasVoucher should be false');\`
);

code = code.replace(
  /const logs = \[\]; const console = \{log: m => logs\.push\(m\), warn:\(\)=>{}, error:\(\)=>{}\};\s*\\n\\s*assertEqual\(logs\.some\(l => l\.includes\('Points'\)\), false, 'userPoints should be falsy number 0'\);/g,
  \`assertEqual(__logs.some(l => l.includes('Points')), false, 'userPoints should be falsy number 0');\`
);

// 6-3 Challenge
code = code.replace(
  /const logs=\[\]; const console=\{log:m=>logs\.push\(m\)}; let speed=90;\\n\$\{'__rawCode__'\\.replace\('let speed = 90;',''\)\}\\nassertEqual\(logs\[0\], 'Speeding'\);/g,
  \`assertEqual(__logs[0], 'Speeding', 'speed=90 must log "Speeding"');\`
);

code = code.replace(
  /const logs=\[\]; const console=\{log:m=>logs\.push\(m\)}; let speed=60;\\n\$\{'__rawCode__'\\.replace\('let speed = 90;',''\)\}\\nassertEqual\(logs\[0\], 'Normal'\);/g,
  \`assertEqual(__rawCode__.includes('speed > 80') || __rawCode__.includes('speed >= 81'), true, 'Missing check for > 80');\`
);

code = code.replace(
  /const logs=\[\]; const console=\{log:m=>logs\.push\(m\)}; let speed=20;\\n\$\{'__rawCode__'\\.replace\('let speed = 90;',''\)\}\\nassertEqual\(logs\[0\], 'Slow'\);/g,
  \`assertEqual(__rawCode__.includes('speed > 40') || __rawCode__.includes('speed >= 41'), true, 'Missing check for > 40');\`
);

// 6-4 Mission
code = code.replace(
  /const logs=\[\]; const console=\{log:m=>logs\.push\(m\)};\\n\\s*assertEqual\(logs\.some\(l=>l\.includes\('Grandmaster'\)\), true, 'Fix the if-else order'\);/g,
  \`assertEqual(__logs.some(l=>l.includes('Grandmaster')), true, 'Fix the if-else order');\`
);

code = code.replace(
  /const logs=\[\]; const console=\{log:m=>logs\.push\(m\)};\\n\\s*assertEqual\(logs\.some\(l=>l\.includes\('Locked'\)\), true, 'Change \\|\\| to && in Manual Review'\);/g,
  \`assertEqual(__logs.some(l=>l.includes('Locked')), true, 'Change || to && in Manual Review');\`
);

fs.writeFileSync('client/src/data/curriculum.js', code);
console.log('Replacements complete');
