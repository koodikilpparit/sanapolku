const DB_NAME_POLUT = "polutDB";
const DB_NAME_SANAT = "sanatDB";
const DB_VERSION = 1;

// Avaa tietokanta
export function openDB(name) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(name, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (name === DB_NAME_POLUT && !db.objectStoreNames.contains("polut")) {
                db.createObjectStore("polut", { keyPath: "id", autoIncrement: true })
                  .createIndex("name", "name", { unique: true });
            }

            if (name === DB_NAME_SANAT && !db.objectStoreNames.contains("sanat")) {
                const sanatStore = db.createObjectStore("sanat", { keyPath: "id", autoIncrement: true });
                sanatStore.createIndex("word", "word", { unique: false });
                sanatStore.createIndex("pathId", "pathId", { unique: false });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject("Tietokannan avaaminen epäonnistui");
        };
    });
}

// Lisää polku
export function addPolku(polkuName) {
    return getPolkuByName(polkuName).then((existingPolku) => {
        if (existingPolku) {
            return Promise.reject(new Error('Polku tällä nimellä on jo olemassa'));
        } else {
            return openDB(DB_NAME_POLUT).then((db) => {
                const transaction = db.transaction("polut", "readwrite");
                const store = transaction.objectStore("polut");
                return store.add({ name: polkuName });
            });
        }
    });
}

// Hae kaikki polut
export function getAllPolut() {
    return openDB(DB_NAME_POLUT).then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("polut", "readonly");
            const store = transaction.objectStore("polut");
            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result || []);
            };

            request.onerror = (event) => {
                reject("Polkujen haku epäonnistui");
            };
        });
    });
}

// Hae polku nimen perusteella
export function getPolkuByName(name) {
    return openDB(DB_NAME_POLUT).then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("polut", "readonly");
            const store = transaction.objectStore("polut");
            const index = store.index("name");
            const request = index.get(name);

            request.onsuccess = (event) => {
                resolve(event.target.result || null);
            };

            request.onerror = (event) => {
                reject('Virhe polun hakemisessa');
            };
        });
    });
}

// Lisää sana polkuun
export function addSana(word, pathId, img) {
    // Check if img is provided
    if (!img) {
        return Promise.reject(new Error("Kuva (img) on pakollinen."));
    }

    return openDB(DB_NAME_SANAT).then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("sanat", "readwrite");
            const store = transaction.objectStore("sanat");
            
            // Add the word, pathId, and img into the object store
            const request = store.add({ word, pathId, img });

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                reject("Virhe sanan tallentamisessa");
            };
        });
    });
}

// Hae kaikki sanat tietylle polulle
export function getSanatForPolku(pathId) {
    return openDB(DB_NAME_SANAT).then((db) => {
        return new Promise((resolve, reject) => {
            if (typeof pathId === 'undefined' || pathId === null) {
                reject("Virhe: Polun ID on kelvoton");
                return;
            }
            const transaction = db.transaction("sanat", "readonly");
            const store = transaction.objectStore("sanat");
            const index = store.index("pathId");
            const request = index.getAll(pathId);

            request.onsuccess = (event) => {
                resolve(event.target.result || []);
            };

            request.onerror = (event) => {
                reject("Virhe sanojen haussa");
            };
        });
    });
}

// Poista sana tietokannasta ID:n perusteella
export function deleteSana(wordId) {
    return openDB(DB_NAME_SANAT).then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("sanat", "readwrite");
            const store = transaction.objectStore("sanat");
            const request = store.delete(wordId); // Delete the word with the given ID

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                reject("Virhe sanan poistamisessa");
            };
        });
    });
}