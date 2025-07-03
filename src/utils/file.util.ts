import fs from "fs/promises";

export const readJSON = async <T>(path: string): Promise<T[]> => {
  try {
    const data = await fs.readFile(path, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const writeJSON = async <T>(path: string, data: T[]): Promise<void> => {
  await fs.writeFile(path, JSON.stringify(data, null, 2));
};
