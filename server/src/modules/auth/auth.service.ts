import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import type { RegisterBody, LoginBody } from "./auth.validation";

const SALT_ROUNDS = 10;

const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
const JWT_EXPIRES_IN: string | undefined = process.env.JWT_EXPIRES_IN;
const REFRESH_TOKEN_SECRET: string | undefined =
  process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRES_IN: string | undefined =
  process.env.REFRESH_TOKEN_EXPIRES_IN;

const jwtExpiresIn = JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"];
const refreshTokenExpiresIn =
  REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"];

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

if (!JWT_EXPIRES_IN) {
  throw new Error("JWT_EXPIRES_IN environment variable is not set");
}

if (!REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET environment variable is not set");
}

if (!REFRESH_TOKEN_EXPIRES_IN) {
  throw new Error("REFRESH_TOKEN_EXPIRES_IN environment variable is not set");
}

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET as jwt.Secret, {
    expiresIn: jwtExpiresIn,
  });
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId, jti: randomBytes(16).toString("hex") },
    REFRESH_TOKEN_SECRET as jwt.Secret,
    {
      expiresIn: refreshTokenExpiresIn,
    },
  );
};

const getRefreshTokenExpiry = (): Date => {
  // 30 days from now
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
};

export const registerUser = async (input: RegisterBody) => {
  const { email, username, password, firstName, lastName } = input;

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) throw new Error("EMAIL_TAKEN");

  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) throw new Error("USERNAME_TAKEN");

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, username, password: hashedPassword, firstName, lastName },
  });

  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    accessToken: token,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      plan: user.plan,
    },
  };
};

export const loginUser = async (input: LoginBody) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) throw new Error("INVALID_CREDENTIALS");

  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    accessToken: token,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      plan: user.plan,
    },
  };
};

export const logoutUser = async (refreshToken: string) => {
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!tokenRecord) throw new Error("INVALID_REFRESH_TOKEN");
  if (tokenRecord.revokedAt) throw new Error("TOKEN_ALREADY_REVOKED");

  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { revokedAt: new Date() },
  });

  return { message: "Logged out successfully" };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!tokenRecord) throw new Error("INVALID_REFRESH_TOKEN");
  if (tokenRecord.revokedAt) throw new Error("TOKEN_REVOKED");
  if (new Date() > tokenRecord.expiresAt) throw new Error("TOKEN_EXPIRED");

  try {
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const newAccessToken = generateToken(tokenRecord.userId);
  const newRefreshToken = generateRefreshToken(tokenRecord.userId);

  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { revokedAt: new Date() },
  });

  await prisma.refreshToken.create({
    data: {
      userId: tokenRecord.userId,
      token: newRefreshToken,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: {
      id: tokenRecord.user.id,
      username: tokenRecord.user.username,
      email: tokenRecord.user.email,
      firstName: tokenRecord.user.firstName,
      lastName: tokenRecord.user.lastName,
      createdAt: tokenRecord.user.createdAt,
      plan: tokenRecord.user.plan,
    },
  };
};
