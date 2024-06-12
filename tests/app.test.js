const { parseMarkdownToHTML, parseMarkdownToANSI } = require('../src/app');

// Simple assert function
const assert = (condition, message) => {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
};

// Function to clean up extra tags for testing purposes
const cleanHTML = (html) => {
    return html.replace(/<\/?p>/g, '').trim();
};

// Test for HTML conversion
const testHTMLConversion = () => {
    const input = '**bold**';
    const expectedOutput = '<b>bold</b>';
    const output = cleanHTML(parseMarkdownToHTML(input));
    assert(output === expectedOutput, `Expected "${expectedOutput}", but got "${output}"`);
    console.log("HTML bold conversion test passed.");
};

const testItalicConversion = () => {
    const input = '_italic_';
    const expectedOutput = '<i>italic</i>';
    const output = cleanHTML(parseMarkdownToHTML(input));
    assert(output === expectedOutput, `Expected "${expectedOutput}", but got "${output}"`);
    console.log("HTML italic conversion test passed.");
};

const testPreformattedConversion = () => {
    const input = '```\npreformatted\n```';
    const expectedOutput = '<pre>preformatted\n</pre>';
    const output = cleanHTML(parseMarkdownToHTML(input));
    assert(output === expectedOutput, `Expected "${expectedOutput}", but got "${output}"`);
    console.log("HTML preformatted conversion test passed.");
};

const testMixedFormattingConversion = () => {
    const input = '**bold** and _italic_';
    const expectedOutput = '<b>bold</b> and <i>italic</i>';
    const output = cleanHTML(parseMarkdownToHTML(input));
    assert(output === expectedOutput, `Expected "${expectedOutput}", but got "${output}"`);
    console.log("HTML mixed formatting test passed.");
};

const testNewLineConversion = () => {
    const input = 'First line\n\nSecond line';
    const expectedOutput = '<p>First line </p><br><p>Second line </p>';
    const output = parseMarkdownToHTML(input).replace(/<p>\s*<\/p>/g, '');
    assert(output === expectedOutput, `Expected "${expectedOutput}", but got "${output}"`);
    console.log("HTML new line conversion test passed.");
};

// Test for ANSI conversion
const testANSIConversion = () => {
    const input = '**bold**';
    const expectedOutput = '\x1b[1mbold\x1b[0m';
    const output = parseMarkdownToANSI(input);
    assert(output === expectedOutput, `Expected "${expectedOutput}", but got "${output}"`);
    console.log("ANSI bold conversion test passed.");
};

const testItalicANSIConversion = () => {
    const input = '_italic_';
    const expectedOutput = '\x1b[3mitalic\x1b[0m';
    const output = parseMarkdownToANSI(input);
    assert(output === expectedOutput, `Expected "${expectedOutput}", but got "${output}"`);
    console.log("ANSI italic conversion test passed.");
};

const testPreformattedANSIConversion = () => {
    const input = '```\npreformatted\n```';
    const expectedOutput = '\x1b[7mpreformatted\n\x1b[0m';
    const output = parseMarkdownToANSI(input);
    assert(output === expectedOutput, `Expected "${expectedOutput}", but got "${output}"`);
    console.log("ANSI preformatted conversion test passed.");
};

const testMixedFormattingANSIConversion = () => {
    const input = '**bold** and _italic_';
    const expectedOutput = '\x1b[1mbold\x1b[0m and \x1b[3mitalic\x1b[0m';
    const output = parseMarkdownToANSI(input);
    assert(output === expectedOutput, `Expected "${expectedOutput}", but got "${output}"`);
    console.log("ANSI mixed formatting test passed.");
};

const testNewLineANSIConversion = () => {
    const input = 'First line\n\nSecond line';
    const expectedOutput = 'First line \n\nSecond line ';
    const output = parseMarkdownToANSI(input);
    assert(output === expectedOutput, `Expected "${expectedOutput}", but got "${output}"`);
    console.log("ANSI new line conversion test passed.");
};

// Run tests
try {
    testHTMLConversion();
    testItalicConversion();
    testPreformattedConversion();
    testMixedFormattingConversion();
    testNewLineConversion();
    testANSIConversion();
    testItalicANSIConversion();
    testPreformattedANSIConversion();
    testMixedFormattingANSIConversion();
    testNewLineANSIConversion();
    console.log("All tests passed.");
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
