// Validate twitter usernames
export const isTwitterUsernameValid = (username: string | undefined) => (
  username && /^[a-zA-Z0-9_]{1,15}$/.test(username)
);