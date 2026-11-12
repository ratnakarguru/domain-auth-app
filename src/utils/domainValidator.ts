
const DEVELOPMENT_MODE = true;

const DEVELOPMENT_EMAIL = "ratnakarguru16@gmail.com";

const ALLOWED_DOMAIN = "hbplus.fit";

export const isAllowedDomain = (email: string): boolean => {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();

  if (DEVELOPMENT_MODE) {
    return normalizedEmail === DEVELOPMENT_EMAIL.toLowerCase();
  }

  const emailParts = normalizedEmail.split("@");

  return (
    emailParts.length === 2 &&
    emailParts[0].length > 0 &&
    emailParts[1] === ALLOWED_DOMAIN
  );
};

export const DOMAIN_ERROR =
  "Access restricted. Please login using your official domain email.";
