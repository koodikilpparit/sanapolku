import { getPathByName, getWordsForPath } from '../db/db';

export async function exportPath(pathName) {
  return await getPathToExport(pathName);
}

export async function importPath(path) {
  console.log('Importing path', path);
}

async function getPathToExport(pathName) {
  const path = await getPathByName(pathName);
  if (!path) {
    console.warn('Path not found', pathName);
  }
  const words = await getWordsToExport(path.id);
  return { pathName: pathName, words: words };
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
