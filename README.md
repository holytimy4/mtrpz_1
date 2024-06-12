# Markdown to HTML and ANSI Converter

## Description
This is a simple console application that converts a subset of Markdown to HTML or ANSI formatted text. It supports bold, italic, and preformatted text, as well as paragraph separation.

## Build and Run
1. Clone the repository.
2. Ensure Node.js is installed.
3. Run the application:
    - To output to stdout:
      ```sh
      node src/app.js /path/to/markdown/file.md [--format html|ansi]
      ```
    - To output to a file:
      ```sh
      node src/app.js /path/to/markdown/file.md --out /path/to/output/file.html [--format html|ansi]
      ```

## Usage
- The application reads a Markdown file and converts it to either HTML or ANSI formatted text.
- If the Markdown is invalid, an error is printed to stderr.

## Running Tests
1. Run the tests:
   ```sh
   node tests/app.test.js