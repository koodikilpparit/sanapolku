import PapunetPhotoFetcher from './PapunetPhotoFetcher';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        images: [
          {
            author: 'Author1',
            height: 600,
            keywords: ['keyword1', 'keyword2'],
            name: 'Image1',
            thumb: 'thumb1.jpg',
            thumb_large: 'thumb_large1.jpg',
            type: 'image/jpeg',
            uid: 'uid1',
            url: 'url1.jpg',
            width: 800,
            score: 10,
          },
          {
            author: 'Author2',
            height: 400,
            keywords: ['keyword3', 'keyword4'],
            name: 'Image2',
            thumb: 'thumb2.jpg',
            thumb_large: 'thumb_large2.jpg',
            type: 'image/png',
            uid: 'uid2',
            url: 'url2.jpg',
            width: 600,
            score: 8,
          },
        ],
      }),
  })
);

describe('PapunetPhotoFetcher', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('returns an empty array if the fetch operation fails', async () => {
    fetch.mockImplementationOnce(() => Promise.reject('API is down'));

    const searchTerm = 'test';
    const photos = await PapunetPhotoFetcher.fetchPhotos(searchTerm);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      'https://kuha.papunet.net/api/search/all/test?lang=fi'
    );
    expect(photos).toEqual([]);
  });
});
