const DB_NAME = 'sanapolkuDB';
const DB_VERSION = 1;

// Open database
async function openDB(name) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('paths')) {
        db.createObjectStore('paths', {
          keyPath: 'id',
          autoIncrement: true,
        }).createIndex('name', 'name', { unique: true });
      }

      if (!db.objectStoreNames.contains('words')) {
        const wordsStore = db.createObjectStore('words', {
          keyPath: 'id',
          autoIncrement: true,
        });
        wordsStore.createIndex('word', 'word', { unique: false });
        wordsStore.createIndex('pathId', 'pathId', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (_event) => {
      reject('Failed to open the database');
    };
  });
}

/**
 * Adds a new path
 * @param {string} pathName The name of the path to add
 * @returns {Promise<number>} ID
 */
export async function addPath(pathName) {
  return getPathByName(pathName).then(async (existingPath) => {
    if (existingPath) {
      return Promise.reject(new Error('Path with this name already exists'));
    } else {
      return openDB(DB_NAME).then(async (db) => {
        return new Promise((resolve, reject) => {
          const transaction = db.transaction('paths', 'readwrite');
          const store = transaction.objectStore('paths');
          const request = store.add({ name: pathName });
          request.onsuccess = (event) => {
            resolve(event.target.result || null);
          };
          request.onerror = (_event) => {
            reject('Failed to add path');
          };
        });
      });
    }
  });
}

/**
 * Get all paths
 * @returns {Promise<Object[]>} All paths
 */
export async function getAllPaths() {
  return openDB(DB_NAME).then(async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('paths', 'readonly');
      const store = transaction.objectStore('paths');
      const request = store.getAll();

      request.onsuccess = (event) => {
        resolve(event.target.result || []);
      };

      request.onerror = (_event) => {
        reject('Failed to retrieve paths');
      };
    });
  });
}

/**
 * Retrieve path by name
 * @param {string} name name of the path
 * @returns {Promise<Object>} path object
 */
async function getPathByName(name) {
  return openDB(DB_NAME).then(async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('paths', 'readonly');
      const store = transaction.objectStore('paths');
      const index = store.index('name');
      const request = index.get(name);

      request.onsuccess = (event) => {
        resolve(event.target.result || null);
      };

      request.onerror = (_event) => {
        reject('Error retrieving the path');
      };
    });
  });
}

/**
 * Retrieve path by ID
 * @param {number} id id of the path
 * @returns {Promise<Object>} path object
 */
export async function getPathById(id) {
  return openDB(DB_NAME).then(async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('paths', 'readonly');
      const store = transaction.objectStore('paths');
      const request = store.get(id);

      request.onsuccess = (event) => {
        resolve(event.target.result || null);
      };

      request.onerror = (_event) => {
        reject('Error retrieving the path');
      };
    });
  });
}

/**
 * Adds a word-image pair to a path
 * @param {string} word The word to add
 * @param {number} pathId ID of the path where word belongs to
 * @param {string} img URL or base64 of the image data
 * @returns {Promise<Object>} ID of the word added
 */
export async function addWord(word, pathId, img) {
  if (!img) {
    return Promise.reject(new Error('Image (img) is required.'));
  }

  return openDB(DB_NAME).then(async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('words', 'readwrite');
      const store = transaction.objectStore('words');

      const request = store.add({ word, pathId, img });

      request.onsuccess = (event) => {
        resolve(event.target.result || null);
      };

      request.onerror = (_event) => {
        reject('Error saving the word');
      };
    });
  });
}

/**
 * Get all words for a specific path
 * @param {number} pathId
 * @returns {Promise<Object[]>} List of word objects
 */
export async function getWordsForPath(pathId) {
  return openDB(DB_NAME).then((db) => {
    return new Promise((resolve, reject) => {
      if (typeof pathId === 'undefined' || pathId === null) {
        reject('Error: Invalid path ID');
        return;
      }
      const transaction = db.transaction('words', 'readonly');
      const store = transaction.objectStore('words');
      const index = store.index('pathId');
      const request = index.getAll(pathId);

      request.onsuccess = (event) => {
        resolve(event.target.result || []);
      };

      request.onerror = (_event) => {
        reject('Error retrieving words');
      };
    });
  });
}

/**
 * Delete word by ID
 * @param {number} wordId ID of the word to be deleted
 * @returns {Promise<void>} Resolve if deleted successfully
 */
export async function deleteWord(wordId) {
  return openDB(DB_NAME).then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('words', 'readwrite');
      const store = transaction.objectStore('words');
      const request = store.delete(wordId);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (_event) => {
        reject('Error deleting the word');
      };
    });
  });
}

/**
 * Delete path and all its associated words
 * @param {number} pathId ID of the path to be deleted
 * @returns {Promise<void>} Resolve if deleted path and its associated words successfully
 */
export async function deletePath(pathId) {
  return openDB(DB_NAME).then(async (db) => {
    const transaction = db.transaction(['paths', 'words'], 'readwrite');
    await deleteFromPathStore(transaction, pathId);
    await deletePathFromWordsStore(transaction, pathId);
    return 'Path and its words deleted successfully';
  });
}

/**
 * Delete path from 'paths' store
 * @param {object} transaction Transaction object, must include 'paths' store
 * @param {number} pathId ID of the path to delete
 * @returns {Promise<void>} Resolve if deleted successfully
 */
async function deleteFromPathStore(transaction, pathId) {
  const pathsStore = transaction.objectStore('paths');
  await pathsStore.delete(pathId);
}

/**
 * Delete path from 'words' store
 * @param {object} transaction Transaction object, must include 'words' store
 * @param {number} pathId ID of the path to delete
 * @returns {Promise<void>} Resolve if deleted successfully
 */
async function deletePathFromWordsStore(transaction, pathId) {
  const wordsStore = transaction.objectStore('words');
  const wordsIndex = wordsStore.index('pathId');
  const cursorWordsRequest = wordsIndex.openCursor(IDBKeyRange.only(pathId));

  return new Promise((resolve, reject) => {
    cursorWordsRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const deleteWordRequest = cursor.delete();
        deleteWordRequest.onerror = () => {
          reject('Failed to delete word that belongs to the path');
        };
        cursor.continue();
      } else {
        // No more words to delete
        resolve();
      }
    };
    cursorWordsRequest.onerror = () => {
      reject('Failed to open cursor for words store with pathId index');
    };
  });
}

// Reset the database to its initial state
export async function resetDB() {
  return openDB(DB_NAME).then(async (db) => {
    const transaction = db.transaction(['paths', 'words'], 'readwrite');
    await transaction.objectStore('paths').clear();
    await transaction.objectStore('words').clear();
  });
}

/**
 * Adds a new path with list of word-image pairs in a single transaction
 * @param {string} pathName name of the path to add
 * @param {Object[]} wordAndImageList List of words and their images to add. Expected format: [{word: string, img: string}]
 */
export async function addPathWithWords(pathName, wordAndImageList) {
  return openDB(DB_NAME).then(async (db) => {
    const transaction = db.transaction(['paths', 'words'], 'readwrite');
    const pathsStore = transaction.objectStore('paths');
    const wordsStore = transaction.objectStore('words');

    const pathId = await new Promise((resolve, reject) => {
      const request = pathsStore.add({ name: pathName });
      request.onsuccess = (event) => {
        resolve(event.target.result || null);
      };
      request.onerror = (_event) => {
        reject('Failed to add path');
      };
    });

    await Promise.all(
      wordAndImageList.map((wordAndImage) => {
        const word = wordAndImage.word;
        const image = wordAndImage.img;
        return wordsStore.add({ word: word, pathId: pathId, img: image });
      })
    );

    return new Promise((resolve, reject) => {
      transaction.complete = () => {
        resolve(pathId);
      };
      transaction.onerror = () => {
        reject('Transaction failed');
      };
    });
  });
}
