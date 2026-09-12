import crypto from "crypto";

const generateResetToken = () => {
  const rawtoken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawtoken)
    .digest("hex");

  return { rawtoken, hashedToken };
};

export { generateResetToken };
