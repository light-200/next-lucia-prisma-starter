import { Google } from "arctic";

export const google = new Google(
  process.env.Google_CLIENT_ID!,
  process.env.Google_CLIENT_SECRET!,
  process.env.NEXT_PUBLIC_BASE_URL + "/api/oauth/google/callback",
);
