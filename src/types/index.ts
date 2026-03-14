import { Collection, ChatInputCommandInteraction } from 'discord.js';

interface Command{
    data: {
        name: string; toJson(): unknown;
    };
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

declare module 'discord.js'{
    interface Client{
        commands: Collection<string, Command>;
    }
}