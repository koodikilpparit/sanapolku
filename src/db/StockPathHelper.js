import { adultImageNames, kidImageNames } from './imageNames';

function adultImagesPath() {
  const domain = window.location.href;
  if (domain.includes('localhost:3000') || domain.includes('sanapolku')) {
    return 'sanapolku/data/paths/adult/images';
  }
  return 'public/data/paths/adult/images'; // Path for testing
}

function kidImagesPath() {
  const domain = window.location.href;
  if (domain.includes('localhost:3000') || domain.includes('sanapolku')) {
    return 'sanapolku/data/paths/kid/images';
  }
  return 'public/data/paths/kid/images'; // Path for testing
}

export function getAdultPath() {
  let words = shuffle(adultImageNames);
  if (arguments.length === 1) {
    words = words.slice(0, arguments[0]);
  }
  const path = adultImagesPath();
  return words.map((fileName) => {
    const imagePath = `${path}/${fileName}`;
    const parsed = parseName(fileName);
    return {
      ...parsed,
      img: imagePath,
    };
  });
}

export function getKidPath() {
  let words = shuffle(kidImageNames);
  if (arguments.length === 1) {
    words = words.slice(0, arguments[0]);
  }
  const path = kidImagesPath();
  return words.map((fileName) => {
    const imagePath = `${path}/${fileName}`;
    const parsed = parseName(fileName);
    return {
      ...parsed,
      img: imagePath,
    };
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

export function parseName(fileName) {
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
