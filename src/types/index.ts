import { Collection, ChatInputCommandInteraction } from 'discord.js';

export interface Command{
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

export type StarsRange = {
  min: number;
  max: number;
};

export type FetchRandomReposParams = {
  year?: number;
  language?: string;
  stars?: StarsRange;
  topic?: string;
  count?: number;
};
