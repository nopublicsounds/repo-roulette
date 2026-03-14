import { fetchRandomRepos } from "./src/index.js";
import chalk from 'chalk';

const tests = [
    { label: "No filters x3",          args: [{}, {}, {}] },
    { label: "Language only",           args: [{ language: "rust" }, { language: "go" }, { language: "python" }] },
    { label: "Stars range",             args: [{ stars: { min: 10, max: 100 } }, { stars: { min: 1000, max: 5000 } }, { stars: { min: 10000, max: 50000 } }] },
    { label: "Fixed year",              args: [{ year: 2015 }, { year: 2019 }, { year: 2023 }] },
    { label: "Topic",                   args: [{ topic: "cli" }, { topic: "game" }, { topic: "bot" }] },
    { label: "Language + stars",        args: [{ language: "go", stars: { min: 100, max: 1000 } }, { language: "rust", stars: { min: 500, max: 5000 } }] },
    { label: "Language + year",         args: [{ language: "typescript", year: 2020 }, { language: "python", year: 2017 }] },
    { label: "Language + topic",        args: [{ language: "javascript", topic: "cli" }, { language: "rust", topic: "game" }] },
    { label: "Stars + year",            args: [{ stars: { min: 100, max: 500 }, year: 2018 }, { stars: { min: 1000, max: 10000 }, year: 2021 }] },
    { label: "All filters combined",    args: [{ language: "go", stars: { min: 50, max: 500 }, topic: "cli", year: 2020 }] },
    { label: "Extreme stars (tiny)",    args: [{ stars: { min: 1, max: 5 } }] },
    { label: "Extreme stars (huge)",    args: [{ stars: { min: 50000, max: 200000 } }] },
    { label: "Very old year",           args: [{ year: 2008 }, { year: 2010 }] },
    { label: "Recent year",             args: [{ year: 2025 }, { year: 2026 }] },
];

for (const { label, args } of tests) {
    console.log(`\n${"=".repeat(50)}`);
    console.log(`📂 ${label}`);
    console.log("=".repeat(50));

    const results = await Promise.all(args.map(a => fetchRandomRepos({ ...a, count: 3 })));

    results.forEach((repos, i) => {
        console.log(`  [${JSON.stringify(args[i])}]`);
        if(!repos.length){
        console.log(chalk.yellow("  ⚠️  No results"));
        } 
        else{
            repos.forEach(r => {
            const left = `  - ${r.full_name} ⭐${r.stargazers_count} (${r.language ?? "unknown"})`;
            console.log(`${left.padEnd(60)}${chalk.blue(r.html_url)}`);
            });
        }
    });
}