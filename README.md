# Hangerman

A sample hangman web application created using React!

## Node Dependencies

<pre>
├── @testing-library/jest-dom@5.15.1
├── @testing-library/react@11.2.7
├── @testing-library/user-event@12.8.3
├── antd@4.17.1
├── react@17.0.2
├── react-dom@17.0.2
└── react-scripts@4.0.3
</pre>

### Useful Regex Expressions

<pre>
-- Turn plain text list into JSON array --
^(.+)$
"$1",

-- Matches single letter lines --
^.\n

-- Matches lines of the form A-Z --
.-.\n

-- Remove Duplicates (after sorting) --
^(.*)(\r?\n\1)+$
$1
</pre>
