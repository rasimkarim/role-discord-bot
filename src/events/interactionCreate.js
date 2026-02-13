import { getCommand } from '../commands/index.js';
import { logger } from '../utils/logger.js';

export async function execute(interaction) {
  if (!interaction.isCommand()) return;

  logger.info('Command context:', {
    user: interaction.user.tag,
    guild: interaction.guild ? interaction.guild.name : 'DM',
    command: interaction.commandName,
  });

  try {
    const command = getCommand(interaction.commandName);

    if (!command) {
      await interaction.reply({
        content: 'Command not found.',
        ephemeral: true,
      });
      return;
    }

    await command.execute(interaction);
  } catch (error) {
    logger.error('Error processing command:', { error: error.message });
    
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: 'An error occurred while executing the command.',
        ephemeral: true,
      }).catch(() => {});
    }
  }
}
