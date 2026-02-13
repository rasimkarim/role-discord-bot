import { supabase } from './client.js';
import { handleDatabaseError } from './errors.js';

export class TrialRepository {
  static async findExpired() {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .not('trialEnd', 'is', null)
        .lt('trialEnd', now);

      if (error) throw error;

      return { success: true, data: data || [], error: null };
    } catch (error) {
      return handleDatabaseError(error, 'getting users with expired trials');
    }
  }

  static async findActive() {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .not('trialEnd', 'is', null)
        .gte('trialEnd', now);

      if (error) throw error;

      return { success: true, data: data || [], error: null };
    } catch (error) {
      return handleDatabaseError(error, 'getting users with active trials');
    }
  }

  static async updateTrial(discordId, trialStart, trialEnd) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          trialStart: trialStart || null,
          trialEnd: trialEnd || null,
          updated_at: new Date().toISOString(),
        })
        .eq('discordId', discordId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data, error: null };
    } catch (error) {
      return handleDatabaseError(error, 'updating trial');
    }
  }

  static async findByTrialDateRange(startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .not('trialEnd', 'is', null)
        .gte('trialEnd', startDate)
        .lte('trialEnd', endDate);

      if (error) throw error;

      return { success: true, data: data || [], error: null };
    } catch (error) {
      return handleDatabaseError(error, 'getting users by trial date range');
    }
  }
}
