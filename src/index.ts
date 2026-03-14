import dotenv from 'dotenv';
import { Client, GatewayIntentBits, Collection, Events, ChatInputCommandInteraction } from 'discord.js';
dotenv.config();
import * as ping from './commands/ping';
import * as explore from './commands/explore';

interface Command{
    data: {
        name: string; toJson(): unknown;
    };
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});
client.commands = new Collection<string, Command>();
client.commands.set(ping.data.name, ping as unknown as Command);
client.commands.set(explore.data.name, explore as unknown as Command);

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()){
        return;
    }
    
    const command = client.commands.get(interaction.commandName);
    if(!command){
        return;
    }

    try{
        await command.execute(interaction);
    }
    catch(error){
        console.log(error);
    }
});

client.login(process.env.DISCORD_TOKEN);