import { Octokit  } from "@octokit/rest";
import { components } from "@octokit/openapi-types";

type Repo = components["schemas"]["repo-search-result-item"];

type StarsRange = {
  min: number;
  max: number;
};

type FetchRandomReposParams = {
  year?: number;
  language?: string;
  stars?: StarsRange;
  topic?: string;
  count?: number;
};

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

function randomInt(min: number, max: number){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function fetchRandomRepos(
    { year, language, stars, topic, count = 5 }: FetchRandomReposParams = {}
    ): Promise<Repo[]>{

    const randomYear = randomInt(2008, new Date().getFullYear());
    const month = String(randomInt(1, new Date().getMonth() + 1)).padStart(2, '0');
    const selectedYear = year ?? randomYear;

    const starsQuery = stars ? `stars:${stars.min}..${stars.max}` : null;

    const q = [
        `created:${selectedYear}-${month}`,
        starsQuery,
        language ? `language:${language}` : null,
        topic ? `topic:${topic}` : null,
    ].filter(Boolean).join(' ');

    const { data } = await octokit.rest.search.repos({q, per_page:100, page: 1});
    return data.items.slice(0, count).sort(() => Math.random() - 0.5);
}
