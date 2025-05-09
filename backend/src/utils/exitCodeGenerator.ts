/**
 * Generates a random 3-digit exit code
 * @returns {string} A 3-digit exit code
 */
export const generateExitCode = (): string => {
  // Generate a random number between 100 and 999
  const code = Math.floor(Math.random() * 900) + 100;
  return code.toString();
}; 