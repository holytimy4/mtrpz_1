const fs = require('fs');

const parseMarkdownToHTML = (markdown) => {
    const lines = markdown.split('\n');
    let html = '';
    let preformatted = false;
    let stack = [];

    const error = (message) => {
        throw new Error(`Error: ${message}`);
    };

    const checkLine = (line, index) => {
        const boldMatches = (line.match(/\*\*/g) || []).length;
        const italicMatches = (line.match(/_/g) || []).length;

        if (boldMatches % 2 !== 0) {
            error(`Invalid bold formatting on line ${index + 1}`);
        }
        if (italicMatches % 2 !== 0) {
            error(`Invalid italic formatting on line ${index + 1}`);
        }
    };

    lines.forEach((line, index) => {
        checkLine(line, index);

        if (preformatted) {
            if (line.trim() === '```') {
                preformatted = false;
                html += '</pre>';
                stack.pop();
            } else {
                html += line + '\n';
            }
        } else if (line.trim() === '```') {
            preformatted = true;
            html += '<pre>';
            stack.push('```');
        } else if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
            html += `<b>${line.trim().slice(2, -2)}</b>`;
        } else if (line.trim().startsWith('_') && line.trim().endsWith('_')) {
            html += `<i>${line.trim().slice(1, -1)}</i>`;
        } else if (line.trim() === '') {
            html += '<br>';
        } else {
            if (index === 0 || lines[index - 1].trim() === '' || preformatted) {
                html += '<p>';
            }
            html += line + ' ';
            if (index === lines.length - 1 || lines[index + 1].trim() === '') {
                html += '</p>';
            }
        }
    });

    html = html.replace(/^<p>|<\/p>$/g, '');

    return html;
};

const parseMarkdownToANSI = (markdown) => {
    const lines = markdown.split('\n');
    let ansi = '';
    let preformatted = false;
    let stack = [];

    const error = (message) => {
        throw new Error(`Error: ${message}`);
    };

    const checkLine = (line, index) => {
        const boldMatches = (line.match(/\*\*/g) || []).length;
        const italicMatches = (line.match(/_/g) || []).length;

        if (boldMatches % 2 !== 0) {
            error(`Invalid bold formatting on line ${index + 1}`);
        }
        if (italicMatches % 2 !== 0) {
            error(`Invalid italic formatting on line ${index + 1}`);
        }
    };

    lines.forEach((line, index) => {
        checkLine(line, index);

        if (preformatted) {
            if (line.trim() === '```') {
                preformatted = false;
                ansi += '\x1b[0m'; // Reset ANSI
                stack.pop();
            } else {
                ansi += line + '\n';
            }
        } else if (line.trim() === '```') {
            preformatted = true;
            ansi += '\x1b[7m'; // Inverse/reverse mode ANSI
            stack.push('```');
        } else if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
            ansi += `\x1b[1m${line.trim().slice(2, -2)}\x1b[0m`; // Bold ANSI
        } else if (line.trim().startsWith('_') && line.trim().endsWith('_')) {
            ansi += `\x1b[3m${line.trim().slice(1, -1)}\x1b[0m`; // Italic ANSI
        } else if (line.trim() === '') {
            ansi += '\n\n';
        } else {
            ansi += line + ' ';
        }
    });

    if (stack.length > 0) {
        error("Unclosed preformatted block");
    }

    return ansi;
};

const main = () => {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error('Usage: node src/app.js <input-markdown-file> [--out <output-file>] [--format html|ansi]');
        process.exit(1);
    }

    const inputFile = args[0];
    const outputFile = args.includes('--out') ? args[args.indexOf('--out') + 1] : null;
    const format = args.includes('--format') ? args[args.indexOf('--format') + 1] : null;

    try {
        const markdown = fs.readFileSync(inputFile, 'utf8');
        let output;

        if (format === 'html' || (outputFile && !format)) {
            output = parseMarkdownToHTML(markdown);
        } else if (format === 'ansi' || (!outputFile && !format)) {
            output = parseMarkdownToANSI(markdown);
        } else {
            console.error('Invalid format specified. Use "html" or "ansi".');
            process.exit(1);
        }

        if (outputFile) {
            fs.writeFileSync(outputFile, output);
        } else {
            console.log(output);
        }
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = {
    parseMarkdownToHTML,
    parseMarkdownToANSI
};

if (require.main === module) {
    main();
}
