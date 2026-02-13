import { supabase } from './client.js';
import { handleDatabaseError, ERROR_CODES } from './errors.js';

export class UserRepository {
  static async create(userData) {
    const { discordId, username, discriminator, guildId, trialStart, trialEnd } = userData;

    if (!discordId || !username) {
      throw new Error('discordId and username are required for creating a user');
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            discordId: discordId,
            username: username,
            discriminator: discriminator || null,
            guildId: guildId || null,
            trialStart: trialStart || null,
            trialEnd: trialEnd || null,
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.code === ERROR_CODES.UNIQUE_VIOLATION) {
          return { success: false, error: 'User already exists', data: null };
        }
        throw error;
      }

      return { success: true, data, error: null };
    } catch (error) {
      return handleDatabaseError(error, 'creating user');
    }
  }

  static async findByDiscordId(discordId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('discordId', discordId)
        .single();

      if (error) {
        if (error.code === ERROR_CODES.NOT_FOUND) {
          return { success: false, data: null, error: null };
        }
        throw error;
      }

      return { success: true, data, error: null };
    } catch (error) {
      return handleDatabaseError(error, 'getting user');
    }
  }

  static async upsert(userData) {
    const { discordId, username, discriminator, guildId, trialStart, trialEnd } = userData;

    if (!discordId || !username) {
      throw new Error('discordId and username are required');
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .upsert(
          {
            discordId: discordId,
            username: username,
            discriminator: discriminator || null,
            guildId: guildId || null,
            trialStart: trialStart || null,
            trialEnd: trialEnd || null,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'discordId',
          }
        )
        .select()
        .single();

      if (error) throw error;

      return { success: true, data, error: null };
    } catch (error) {
      return handleDatabaseError(error, 'updating user');
    }
  }

  static async update(discordId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('discordId', discordId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data, error: null };
    } catch (error) {
      return handleDatabaseError(error, 'updating user');
    }
  }

  static async delete(discordId) {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('discordId', discordId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      return handleDatabaseError(error, 'deleting user');
    }
  }
}
