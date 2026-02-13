import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check if the bot is working');

export async function execute(interaction) {
  await interaction.reply(`Pong! 🏓 Hello ${interaction.user.username}`);
}
