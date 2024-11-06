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
 * @returns {number} ID
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

// Get all paths
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

// Get path by name
export async function getPathByName(name) {
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

// Add word to the database
export async function addWord(word, pathId, img) {
  if (!img) {
    return Promise.reject(new Error('Image (img) is required.'));
  }

  return openDB(DB_NAME).then(async (db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('words', 'readwrite');
      const store = transaction.objectStore('words');

      const request = store.add({ word, pathId, img });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (_event) => {
        reject('Error saving the word');
      };
    });
  });
}

// Get all words for a specific path
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

// Delete word by ID
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

// Delete path and it's words
export async function deletePath(pathId) {
  return openDB(DB_NAME).then((db) => {
    return new Promise((resolve, reject) => {
      const pathTransaction = db.transaction('paths', 'readwrite');
      const pathsStore = pathTransaction.objectStore('paths');
      const pathDeletionRequest = pathsStore.delete(pathId);

      pathDeletionRequest.onsuccess = async () => {
        // Attempt to delete associated words
        const wordsDeletedSuccessfully = await deletePathsWords(pathId);
        if (wordsDeletedSuccessfully) {
          resolve('Path and its words deleted successfully');
        } else {
          reject('Error while trying to delete words of the path');
        }
      };

      pathDeletionRequest.onerror = () => {
        reject('Error deleting the path');
      };

      pathTransaction.onerror = (error) => {
        reject('Error during path transaction: ' + error.message);
      };
    });
  });
}

// Delete path's words
async function deletePathsWords(pathId) {
  const db = await openDB(DB_NAME);
  return await new Promise((resolve, reject) => {
    const wordTransaction = db.transaction('words', 'readwrite');
    const wordsStore = wordTransaction.objectStore('words');
    const wordsIndex = wordsStore.index('pathId');
    const getWordsRequest = wordsIndex.getAllKeys(pathId);

    getWordsRequest.onsuccess = (event) => {
      const wordKeys = event.target.result;
      if (wordKeys.length > 0) {
        const deleteRequests = wordKeys.map((wordKey) =>
          wordsStore.delete(wordKey)
        );

        // Wait for all delete requests to complete
        Promise.all(deleteRequests)
          .then(() => {
            wordTransaction.oncomplete = () => {
              resolve(true);
            };
          })
          .catch(() => {
            // Reject if any delete request fails
            reject(false);
          });
      } else {
        // If no words found, resolve as successful deletion
        wordTransaction.oncomplete = () => {
          resolve(true);
        };

        wordTransaction.onerror = () => {
          reject(false);
        };
      }
    };

    getWordsRequest.onerror = () => {
      reject(false);
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
