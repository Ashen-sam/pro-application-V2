let clerkToken: string | null = null;

export const setClerkToken = (token: string | null) => {
  clerkToken = token;
};

export const getClerkToken = () => clerkToken;
