import { fetchPhotos } from './PapunetPhotoFetcher';

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  fetch.mockClear();
});

describe('fetchPhotos', () => {
  it('fetches and parses photos correctly', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            images: [
              {
                author: 'Author 1',
                height: 600,
                keywords: ['keyword1', 'keyword2'],
                name: 'Image 1',
                thumb: 'thumb1.jpg',
                thumb_large: 'thumb_large1.jpg',
                type: 'image/jpeg',
                uid: '1',
                url: 'url1.jpg',
                width: 800,
                score: 0.9,
              },
              {
                author: 'Author 2',
                height: 400,
                keywords: ['keyword3', 'keyword4'],
                name: 'Image 2',
                thumb: 'thumb2.jpg',
                thumb_large: 'thumb_large2.jpg',
                type: 'image/png',
                uid: '2',
                url: 'url2.jpg',
                width: 600,
                score: 0.8,
              },
            ],
          }),
      })
    );

    const searchTerm = 'test';
    const photos = await fetchPhotos(searchTerm);

    expect(photos).toEqual([
      {
        author: 'Author 1',
        height: 600,
        keywords: ['keyword1', 'keyword2'],
        name: 'Image 1',
        thumb: 'thumb1.jpg',
        thumb_large: 'thumb_large1.jpg',
        type: 'image/jpeg',
        uid: '1',
        url: 'url1.jpg',
        width: 800,
        score: 0.9,
      },
      {
        author: 'Author 2',
        height: 400,
        keywords: ['keyword3', 'keyword4'],
        name: 'Image 2',
        thumb: 'thumb2.jpg',
        thumb_large: 'thumb_large2.jpg',
        type: 'image/png',
        uid: '2',
        url: 'url2.jpg',
        width: 600,
        score: 0.8,
      },
    ]);
  });

  it('calls the correct API endpoint', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ images: [] }),
      })
    );

    const searchTerm = 'test';
    await fetchPhotos(searchTerm);

    expect(fetch).toHaveBeenCalledWith(
      'https://corsproxy.io/?https://kuha.papunet.net/api/search/all/test?lang=fi'
    );
  });

  it('handles empty array response', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ images: [] }),
      })
    );

    const searchTerm = 'empty';
    const photos = await fetchPhotos(searchTerm);

    expect(photos).toEqual([]);
  });

  it('handles fetch failure', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Fetch failed'))
    );

    const searchTerm = 'fail';
    await expect(fetchPhotos(searchTerm)).rejects.toThrow('Fetch failed');
  });
});
