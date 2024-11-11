import { getWordsForPath, addPathWithWords, getPathById } from '../db/db';

/**
 * Loads a path with words and images into DB
 * @param {Object} path Path object. Format {pathName: string, words: [{word: string, img: string}] }
 */
export async function importPath(path) {
  console.log('Importing path', path);
  const pathName = path.pathName;
  const words = path.words;
  await addPathWithWords(pathName, words);
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
  return { pathName: path.name, words: words };
}

async function getWordsToExport(pathId) {
  const words = await getWordsForPath(pathId);

  if (words.length < 1) {
    throw new Error('Path does not have words');
  }
  return words.map((word) => {
    return { word: word.word, img: word.img };
  });
}
