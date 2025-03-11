import { cookies } from "next/headers";

export default async function getToken() {
  const token = (await cookies()).get("CASHTRACKR_TOKEN")?.value;

  return token;
}
