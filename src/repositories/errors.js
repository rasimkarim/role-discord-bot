export const ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
  NOT_FOUND: 'PGRST116',
};

export function handleDatabaseError(error, context) {
  console.error(`Error in ${context}:`, error);
  
  if (error.code === ERROR_CODES.UNIQUE_VIOLATION) {
    return {
      success: false,
      error: 'Record already exists',
      data: null,
    };
  }
  
  if (error.code === ERROR_CODES.NOT_FOUND) {
    return {
      success: false,
      data: null,
      error: null,
    };
  }
  
  return {
    success: false,
    error: error.message,
    data: null,
  };
}
