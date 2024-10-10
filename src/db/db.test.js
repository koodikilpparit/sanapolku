/* eslint-env node */ //This allows using global

import { openDB, addPath, getAllPaths, getPathByName, addWord, getWordsForPath, deleteWord } from './db';

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
        await expect(addPath('Duplicate Path')).rejects.toThrow('Path with this name already exists');
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
        await expect(addWord('Word without Image', path.id)).rejects.toThrow('Image (img) is required.');
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