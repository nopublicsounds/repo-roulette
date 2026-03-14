import dotenv from 'dotenv';
import { Client, GatewayIntentBits, Collection, Events } from 'discord.js';
dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});


client.login(process.env.DISCORD_TOKEN);