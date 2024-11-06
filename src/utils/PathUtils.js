import { getPathByName, getWordsForPath, addPath, addWord } from '../db/db';

export async function importPath(path) {
  console.log('Importing path', path);
  const pathName = path.name;
  const words = path.words;
  await addPath(pathName);
  const pathInDB = await getPathByName(pathName);
  await Promise.all(
    words.map(async (wordAndImage) => {
      const word = wordAndImage.word;
      const image = wordAndImage.img;
      await addWord(word, pathInDB.id, image);
    })
  );
  return pathInDB;
}

export async function exportPath(pathName) {
  const path = await getPathByName(pathName);
  if (!path) {
    console.warn('Path not found', pathName);
  }
  const words = await getWordsToExport(path.id);
  return { name: pathName, words: words };
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
