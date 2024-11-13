import { getWordsForPath, addPathWithWords, getPathById } from '../db/db';

/**
 * Loads a path with words and images into DB
 * @param {Object} path Path object. Format {name: string, words: [{word: string, imageData: object}] }
 * @returns {Object} {id: number, name: string}
 */
export async function importPath(path) {
  console.log('Importing path', path);
  const pathName = path.name;
  const words = path.words;
  const importedPath = await addPathWithWords(pathName, words);
  return importedPath;
}

/**
 * Exports a path from DB into object
 * @param {number} pathId
 * @returns {Object} exported path object. Same format as import
 */
export async function exportPath(pathId) {
  const path = await getPathById(pathId);
  if (!path) {
    console.warn('Path not found', pathId);
  }
  const words = await getWordsToExport(pathId);
  return { name: path.name, words: words };
}

async function getWordsToExport(pathId) {
  const words = await getWordsForPath(pathId);

  if (words.length < 1) {
    throw new Error('Path does not have words');
  }
  return words.map((word) => {
    return { word: word.word, imageData: word.imageData };
  });
}
