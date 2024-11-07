// eslint-disable-next-line no-unused-vars
import { getAdultPath, getKidPath } from './StockPathHelper';

jest.mock('./imageNames', () => ({
  adultImageNames: ['image1_adult.jpg', 'image2_adult.jpg'],
  kidImageNames: ['image1_kid.jpg', 'image2_kid.jpg'],
}));

jest.mock('./StockPathHelper', () => ({
  getAdultPath: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    blob: () =>
      Promise.resolve(new Blob(['image content'], { type: 'image/jpeg' })),
  })
);

describe('StockPathHelper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAdultPath', () => {
    it('should fetch and parse adult images', async () => {
      const mockResponse = [
        {
          word: 'example',
          id: '1',
          maker: 'maker1',
          img: 'data:image/jpeg;base64,example',
        },
      ];
      getAdultPath.mockResolvedValue(mockResponse);

      const result = await getAdultPath();
      expect(result).toHaveLength(mockResponse.length);
      result.forEach((image) => {
        expect(image.word).toBeDefined();
        expect(image.id).toBeDefined();
        expect(image.maker).toBeDefined();
        expect(image.img).toContain('data:image/jpeg;base64');
      });
    });

    it('should fetch and parse a limited number of adult images', async () => {
      const limit = 1;
      const mockResponse = [
        {
          word: 'example',
          id: '1',
          maker: 'maker1',
          img: 'data:image/jpeg;base64,example',
        },
      ];
      getAdultPath.mockResolvedValue(mockResponse.slice(0, limit));

      const result = await getAdultPath(limit);
      expect(result).toHaveLength(limit);
    });
  });
});
