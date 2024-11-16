/**
 * Fetches photos from the Papunet API based on the search term.
 * @param {string} searchTerm - The term to search for photos.
 * @param {string[]} filters - An array of selected image types.
 * @returns {Promise<Object[]>} A promise that resolves to an array of photo objects.
 */
async function fetchPhotos(searchTerm, filters = []) {
  if (!searchTerm) {
    return [];
  }

  const proxy = 'https://corsproxy.io/?';
  const apiBase = 'https://kuha.papunet.net/api/search/';

  // If type filters are provided, join them with "-" to form the slug part
  const filterSlug = filters.length > 0 ? filters.join('-') : 'all';
  const fullUrl = `${proxy}${apiBase}${filterSlug}/${searchTerm}?lang=fi`;

  const response = await fetch(fullUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch photos');
  }

  const data = await response.json();
  return parsePhotos(data.images);
}

/**
 * Parses the photo data from the API response.
 * @param {Object[]} images - The array of image objects from the API response.
 * @returns {Object[]} An array of parsed photo objects.
 */
function parsePhotos(images) {
  return images.map((image) => ({
    author: image.author,
    height: image.height,
    keywords: image.keywords,
    name: image.name,
    thumb: image.thumb,
    thumb_large: image.thumb_large,
    type: image.type,
    uid: image.uid,
    url: image.url,
    width: image.width,
    score: image.score,
  }));
}

export { fetchPhotos };
