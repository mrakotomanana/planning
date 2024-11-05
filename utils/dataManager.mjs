import { readFileSync, writeFileSync } from "fs";

const dataDirectory = "datas";

export function loadDataFile(filename) {
  const filePath = `${dataDirectory}/${filename}.json`;
  try {
    const data = readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Impossible de lire le fichier ${filename}.json :`, err);
  }
}

export function saveData(filename, data) {
  const filePath = `${dataDirectory}/${filename}.json`;
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error(
      `Impossible d'écrire dans le fichier ${filename}.json :`,
      err
    );
  }
}

export function validateData(data, requiredKeys) {
  const keys = Object.keys(data);
  if (keys.length !== requiredKeys.length) {
    return false;
  }
  for (const key of requiredKeys) {
    if (!data.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}
