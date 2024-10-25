import {
  openDB,
  addPath,
  getAllPaths,
  getPathByName,
  addWord,
  getWordsForPath,
  deleteWord,
  deletePath,
  resetDB,
} from './db';

if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

describe('IndexedDB Operations', () => {
  // Function to clear all records from the databases
  const clearDatabases = async () => {
    const pathsDB = await openDB('pathsDB');
    const wordsDB = await openDB('wordsDB');

    const clearStore = async (db, storeName) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.clear();
      await tx.done;
    };

    await clearStore(pathsDB, 'paths');
    await clearStore(wordsDB, 'words');
  };

  // Clear databases before each test
  beforeEach(async () => {
    await clearDatabases();
  });

  // Test opening the database
  it('should open pathsDB successfully', async () => {
    const db = await openDB('pathsDB');
    expect(db.name).toBe('pathsDB');
  });

  it('should open wordsDB successfully', async () => {
    const db = await openDB('wordsDB');
    expect(db.name).toBe('wordsDB');
  });

  // Test adding a new path
  it('should add a new path to the database', async () => {
    await addPath('Test Path');
    const path = await getPathByName('Test Path');
    expect(path.name).toBe('Test Path');
  });

  // Test that adding the same path again throws an error
  it('should not allow adding a path with the same name', async () => {
    await addPath('Duplicate Path');
    await expect(addPath('Duplicate Path')).rejects.toThrow(
      'Path with this name already exists'
    );
  });

  // Test getting all paths
  it('should retrieve all paths from the database', async () => {
    await addPath('Path 1');
    await addPath('Path 2');
    const paths = await getAllPaths();
    expect(paths.length).toBe(2);
    expect(paths[0].name).toBe('Path 1');
    expect(paths[1].name).toBe('Path 2');
  });

  // Test adding a word with an image to a path
  it('should add a word with an image to the database', async () => {
    await addPath('Path with Words');
    const path = await getPathByName('Path with Words');

    await addWord('Test Word', path.id, 'test-image-url');
    const words = await getWordsForPath(path.id);
    expect(words.length).toBe(1);
    expect(words[0].word).toBe('Test Word');
    expect(words[0].img).toBe('test-image-url');
  });

  // Test that adding a word without an image throws an error
  it('should throw an error if no image is provided when adding a word', async () => {
    await addPath('No Image Path');
    const path = await getPathByName('No Image Path');
    await expect(addWord('Word without Image', path.id)).rejects.toThrow(
      'Image (img) is required.'
    );
  });

  // Test deleting a word by ID
  it('should delete a word by ID', async () => {
    await addPath('Delete Word Path');
    const path = await getPathByName('Delete Word Path');

    await addWord('Word to Delete', path.id, 'delete-image-url');
    const words = await getWordsForPath(path.id);
    expect(words.length).toBe(1);

    await deleteWord(words[0].id);
    const remainingWords = await getWordsForPath(path.id);
    expect(remainingWords.length).toBe(0);
  });
});

// Test deleting a path and it's words
it('should delete a path and its associated words', async () => {
  await addPath('Path with Associated Words');
  const path = await getPathByName('Path with Associated Words');

  // Add words associated with the path
  await addWord('Word 1', path.id, 'image-url-1');
  await addWord('Word 2', path.id, 'image-url-2');

  // Ensure words were added
  let words = await getWordsForPath(path.id);
  expect(words.length).toBe(2);

  // Delete the path (this should also delete the associated words)
  await deletePath(path.id);

  // Check if path is deleted
  const paths = await getAllPaths();
  expect(paths.find((p) => p.id === path.id)).toBeUndefined();

  // Check if associated words are also deleted
  words = await getWordsForPath(path.id);
  expect(words.length).toBe(0);
});

// Test deleting a path with no words
it('should delete a path with no associated words', async () => {
  await addPath('Path without Words');
  const path = await getPathByName('Path without Words');

  // Ensure no words exist for the path
  let words = await getWordsForPath(path.id);
  expect(words.length).toBe(0);

  // Delete the path
  await deletePath(path.id);

  // Check if path is deleted
  const paths = await getAllPaths();
  expect(paths.find((p) => p.id === path.id)).toBeUndefined();

  // Check if no words are present
  words = await getWordsForPath(path.id);
  expect(words.length).toBe(0);
});

// Test that deleting a non-existent path returns an error
it('should return an error when trying to delete a non-existent path', async () => {
  await expect(deletePath('nonExistentPathId')).resolves.toEqual(
    'Path deleted, no associated words found for pathId: nonExistentPathId'
  );
});

describe('resetDB Function', () => {
  // Test resetting the paths
  it('should reset the paths in database', async () => {
    await addPath('Path to be reset 1');
    await addPath('Path to be reset 2');

    await resetDB();

    const paths = await getAllPaths();
    const pathNames = paths.map((path) => path.name);

    expect(pathNames).not.toContain('Path to be reset 1');
    expect(pathNames).not.toContain('Path to be reset 2');
  });

  // Test resetting the words
  it('should reset the words in database', async () => {
    await addPath('Path for words reset');
    const path = await getPathByName('Path for words reset');

    await addWord('Word to be reset 1', path.id, 'img-url-1');
    await addWord('Word to be reset 2', path.id, 'img-url-2');

    await resetDB();

    const words = await getWordsForPath(path.id);
    const wordNames = words.map((word) => word.word);

    expect(wordNames).not.toContain('Word to be reset 1');
    expect(wordNames).not.toContain('Word to be reset 2');
  });
});
