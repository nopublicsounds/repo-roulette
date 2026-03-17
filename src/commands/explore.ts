import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { fetchRandomRepos } from '../lib/github.js';
import { StarsRange, FetchRandomReposParams } from "../types/index.js";
import { EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('explore')
    .setDescription('Explore random GitHub repositories!🎲')
    .addStringOption(opt => opt.setName('language').setDescription('ex. C++, Javascript, Python').setRequired(false))
    .addStringOption(opt => opt.setName('topic').setDescription('ex. discord-api, nextjs, game').setRequired(false))
    .addStringOption(opt => opt.setName('stars_max').setDescription('Maximum stars').setRequired(false))
    .addStringOption(opt => opt.setName('stars_min').setDescription('Minimum stars').setRequired(false))
    .addStringOption(opt => opt.setName('year').setDescription('ex. 2021').setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction){
    await interaction.deferReply();
    
    const language = interaction.options.getString('language') ?? undefined;
    const topic = interaction.options.getString('topic') ?? undefined;
    const stars_min = interaction.options.getString('stars_min');
    const stars_max = interaction.options.getString('stars_max');
    const year = interaction.options.getString('year') ? parseInt(interaction.options.getString('year')!) : undefined;

    console.log(`[explore] user=${interaction.user.tag} language=${language} topic=${topic} stars=${stars_min}..${stars_max} year=${year}`);


    const stars: StarsRange | undefined = stars_min || stars_max ? {
        min: Number(stars_min) ?? 0, max: Number(stars_max) ?? 1000000
    }: undefined;

    const repos = await fetchRandomRepos({ language, topic, stars, year, count: 3 } as FetchRandomReposParams);
    if(!repos.length){
        await interaction.editReply('🚨No repositories found with the given filters. Give a retry or try different filters!');
        return;
    }

    const embed = new EmbedBuilder()
    .setTitle('🎲 Random GitHub Repositories')
    .setDescription('Here are your some random GitHub repos!')
    .setColor(0x7289DA)
    .addFields(
        repos.map(r => ({
            name: `${r.full_name} ⭐${r.stargazers_count}`,
            value: `${r.description ?? '*No description*'}\n🔗 ${r.html_url}`,
        }))
    )
    .setTimestamp()
    .setFooter({ text: 'Data fetched from GitHub' });

    await interaction.editReply({ embeds: [embed] });
}