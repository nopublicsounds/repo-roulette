import { Octokit  } from "@octokit/rest";
import dotenv from 'dotenv';

const octokit = new Octokit({
    auth: dotenv.config().parsed.GITHUB_TOKEN
});

function randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function fetchRandomRepos({year, language, stars, topic, count = 5} = {}){
    const randomYear = randomInt(2008, new Date().getFullYear());
    const month = String(randomInt(1, new Date().getMonth() + 1)).padStart(2, '0');
    const selectedYear = year ?? randomYear;

    const starsQuery = stars ? `stars:${stars.min}..${stars.max}` : null;

    const q = [
        `created:${selectedYear}-${month}`,
        starsQuery,
        language ? `language:${language}` : null,
        topic ? `topic:${topic}` : null,
        `sort:best-match`
    ].filter(Boolean).join(' ');

    const { data } = await octokit.rest.search.repos({q, per_page:100, page: 1});
    return data.items.slice(0, count).sort(() => Math.random() - 0.5);
}
