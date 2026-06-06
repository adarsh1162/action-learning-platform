const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(__dirname);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // The current state is fetch(`${import.meta.env.VITE_API_URL || ''}/api/something',
    // We want to replace that trailing single quote with a backtick.
    const regex = /(fetch\(`\$\{import\.meta\.env\.VITE_API_URL \|\| ''\}\/api\/[^']+)'/g;
    const newContent = content.replace(regex, "$1`");
    
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Fixed ${file}`);
    }
});
