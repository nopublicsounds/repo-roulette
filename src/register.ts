import dotenv from 'dotenv';
dotenv.config();
import { REST, Routes } from 'discord.js';
import * as ping from './commands/ping.js';
import * as explore from './commands/explore.js';

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
    body: [
        ping.data.toJSON(),
        explore.data.toJSON()
    ]
});

console.log('Successfully registered application commands.');