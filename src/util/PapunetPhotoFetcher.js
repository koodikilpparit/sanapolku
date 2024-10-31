class PapunetPhotoFetcher {
  static async fetchPhotos(searchTerm) {
    try {
      const apiBase = 'https://kuha.papunet.net/api/search/all/';
      const fullUrl = apiBase + searchTerm + '?lang=fi';
      const response = await fetch(fullUrl);
      const data = await response.json();
      return this.parsePhotos(data.images);
    } catch (error) {
      console.error('Error fetching photos:', error);
      return [];
    }
  }

  static parsePhotos(images) {
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
}

export default PapunetPhotoFetcher;
