import bcrypt from "bcrypt";
export async function validateHash(givenStr: string, savedStr: string) {
  try {
    return await bcrypt.compare(givenStr, savedStr);
  } catch (e) {
    throw new Error(`Error comparing passwords: ${(e as Error).message}`)
  }
}
