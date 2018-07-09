/**
 * It should be noted that the existence of this script is far from ideal.
 * The goal here is to prevent any new TypeScript errors from being committed
 * to the code base, while giving the PageBuilder team the opportunity
 * to incrementally address existing compiler errors.
 *
 * A snapshot (in `ts-errors.json`) has been taken of all compiler errors
 * (and their respective metadata) to be checked against prior to any new
 * merges.
 *
 * Whenever this whole project passes a run of `tsc` without errors,
 * this script should be removed, and the CI process for PageBuilder
 * should be updated to fail the build on *any* TypeScript error.
 */

const chalk = require('chalk');
const stripANSI = require('strip-ansi');
const priorStats = require('./ts-errors.json');

let chunks = [];

process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) chunks.push(chunk);
});

process.stdin.on('end', () => {
    // strip coloring and other decorations
    const tsOutput = stripANSI(chunks.join('')).trim();
    // each unique error is delimited by two line breaks
    const lines = tsOutput.split('\n\n');
    const compilerErrors = {};

    while (lines.length) {
        const [rawError, rawSnippet] = lines.splice(0, 2);
        const [
            ,
            file,
            line,
            column,
            errorCode,
            message
        ] = rawError.match(/(.+)\((\d+),(\d+)\): error (TS\d+): (.+)/);

        const fileErrors = compilerErrors[file] = compilerErrors[file] || [];

        fileErrors.push({
            file,
            line,
            column,
            errorCode,
            message,
            rawError,
            rawSnippet
        });
    }

    const newErrors = [];
    const resolvedErrors = [];
    // Walk each file to do an error comparison
    for (const [file, errors] of Object.entries(compilerErrors)) {
        let newErrs = errors;
        let resolved = [];
        // Walk each file to do an error comparison
        const oldFileErrors = priorStats[file];
        if (oldFileErrors && oldFileErrors.length > 0) {
            // Walk over all the tsc-reported errors in this file
            newErrs = errors.filter(e => {
                // Check if the error from this current iteration matches a previous
                // error from the states file on disk
                return !oldFileErrors.some(err => err.message === e.message);
            });
            resolved = oldFileErrors.filter(e => {
                return !errors.some(err => err.message === e.message);
            });
        }
        // Collect any newly-reported errors
        newErrors.push(...newErrs);
        resolvedErrors.push(...resolved);
    }

    if (newErrors.length > 0) {
        console.log(
            chalk.red(`${newErrors.length} new TypeScript error(s) were introduced to the code base with your changes. \n`) +
            chalk.black.bgRed('You must resolve all new TypeScript errors before merging a PR.')
        );

        newErrors.forEach(err => {
            console.log(chalk.red(err.rawError + "\n"));
            err.rawSnippet.split("\n").forEach(raw => {
                console.log("        " + raw);
            });
        });

        console.log(
            "\n" +
            chalk.red(`${newErrors.length} new TypeScript error(s) were introduced to the code base with your changes. \n`) +
            chalk.black.bgRed('You must resolve all new TypeScript errors before merging a PR.')
        );
    }

    if (resolvedErrors.length > 0) {
        console.log(
            chalk.black.bgGreen(`Looks like you've fixed ~${resolvedErrors.length} of our existing error(s)! Here's a cookie to celebrate 🍪`)
        );
    }

    if (!newErrors.length) {
        process.exit(0);
    }
});