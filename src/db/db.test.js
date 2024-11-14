import {
  addPath,
  getAllPaths,
  addWord,
  getWordsForPath,
  deleteWord,
  deletePath,
  resetDB,
  getPathById,
  editPathName,
} from './db';

if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

describe('IndexedDB Operations', () => {
  // Clear databases before each test
  beforeEach(async () => {
    await resetDB();
  });

  // Test adding a new path
  it('should add a new path to the database', async () => {
    const pathId = await addPath('Test Path');
    const path = await getPathById(pathId);
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
    const pathId = await addPath('Path with Words');
    const path = await getPathById(pathId);

    await addWord('Test Word', path.id, {
      src: 'test-image-url',
      author: 'Unknown',
    });
    const words = await getWordsForPath(path.id);
    expect(words.length).toBe(1);
    expect(words[0].word).toBe('Test Word');
    expect(words[0].imageData.src).toBe('test-image-url');
    expect(words[0].imageData.author).toBe('Unknown');
  });

  // Test that adding a word without an image throws an error
  it('should throw an error if no image is provided when adding a word', async () => {
    const pathId = await addPath('No Image Path');
    const path = await getPathById(pathId);
    await expect(addWord('Word without Image', path.id)).rejects.toThrow(
      'Image data is required.'
    );
  });

  // Test deleting a word by ID
  it('should delete a word by ID', async () => {
    const pathId = await addPath('Delete Word Path');
    const path = await getPathById(pathId);

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
  const pathId = await addPath('Path with Associated Words');
  const path = await getPathById(pathId);

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
  const pathId = await addPath('Path without Words');
  const path = await getPathById(pathId);

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
    'Path and its words deleted successfully'
  );
});

// Test editing the name of a path
it('should update the path name in the database', async () => {
  const originalPathId = await addPath('Original Path');

  // Edit the path name
  await editPathName(originalPathId, 'Updated Path');

  // Retrieve the updated path
  const updatedPath = await getPathById(originalPathId);
  expect(updatedPath.name).toBe('Updated Path');
});

// Test rejecting when editing a path that does not exist
it('should reject when attempting to edit a non-existent path', async () => {
  const nonExistentPathId = 9999;

  await expect(
    editPathName(nonExistentPathId, 'New Path Name')
  ).rejects.toEqual('Error retrieving the path');
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
    const pathId = await addPath('Path for words reset');
    const path = await getPathById(pathId);

    await addWord('Word to be reset 1', path.id, 'img-url-1');
    await addWord('Word to be reset 2', path.id, 'img-url-2');

    await resetDB();

    const words = await getWordsForPath(path.id);
    const wordNames = words.map((word) => word.word);

    expect(wordNames).not.toContain('Word to be reset 1');
    expect(wordNames).not.toContain('Word to be reset 2');
  });
});
