import { adultImageNames, kidImageNames } from './imageNames';

export function getAdultPath() {
  return new Promise((resolve, reject) => {
    let words = shuffle(adultImageNames);
    if (arguments.length === 1) {
      words = words.slice(0, arguments[0]);
    }
    const path = 'sanapolku/data/paths/adult/images';
    getWords(path, words)
      .then((parsedImages) => {
        resolve(parsedImages);
      })
      .catch((error) => reject(error));
  });
}

export function getKidPath() {
  return new Promise((resolve, reject) => {
    let words = shuffle(kidImageNames);
    if (arguments.length === 1) {
      words = words.slice(0, arguments[0]);
    }
    const path = 'sanapolku/data/paths/kid/images';
    getWords(path, words)
      .then((parsedImages) => {
        resolve(parsedImages);
      })
      .catch((error) => reject(error));
  });
}

function shuffle(array) {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getWords(path, imageNames) {
  return new Promise((resolve, reject) => {
    Promise.all(
      imageNames.map((fileName) => {
        const imagePath = `${path}/${fileName}`;
        return fetch(imagePath)
          .then((response) => {
            console.log(
              `Fetching ${imagePath}: ${response.status} ${response.statusText}`
            );
            if (!response.ok) {
              throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            return response.blob();
          })
          .then((blob) => {
            if (!blob.type.startsWith('image/')) {
              console.warn(
                `Skipped non-image file: ${fileName} (${blob.type})`
              );
              //   return null; // Skip non-image files
            }
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const parsed = parseName(fileName);
                resolve({
                  ...parsed,
                  img: reader.result,
                });
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          })
          .catch((error) => {
            console.error(`Error processing ${fileName}:`, error);
            return null; // Skip files that cause errors
          });
      })
    )
      .then((results) => {
        // Filter out null values (skipped non-image files)
        const parsedImages = results.filter((result) => result !== null);
        resolve(parsedImages);
      })
      .catch((error) => reject(error));
  });
}

function parseName(fileName) {
  // Remove the file extension
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
  // Split the string by underscores
  const parts = nameWithoutExtension.split('_');
  // Return the components
  return {
    word: parts[0],
    id: parts[1],
    maker: parts.slice(2).join(' '),
  };
}
