
const ALLOWED_DOMAIN = "hbplus.fit";

export const isAllowedDomain = (email: string): boolean => {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();

  const emailParts = normalizedEmail.split("@");

  return (
    emailParts.length === 2 &&
    emailParts[0].length > 0 &&
    emailParts[1] === ALLOWED_DOMAIN &&
    !/\s/.test(normalizedEmail)
  );
};

export const DOMAIN_ERROR =
  "Access restricted. Please login using your official domain email.";
