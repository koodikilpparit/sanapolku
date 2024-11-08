import { getAdultPath, getKidPath, parseName } from './StockPathHelper';
import { adultImageNames, kidImageNames } from './imageNames';

describe('StockPathHelper', () => {
  describe('getAdultPath', () => {
    it('should return an array of adult image paths', async () => {
      const adultPath = await getAdultPath();
      expect(adultPath.length).toBe(adultImageNames.length);
    });

    it('should return an array of adult image paths with a specified length', async () => {
      const adultPath = await getAdultPath(5);
      expect(adultPath.length).toBe(5);
    });

    it('should handle an error', async () => {
      try {
        await getAdultPath(-1);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('getKidPath', () => {
    it('should return an array of kid image paths', async () => {
      const kidPath = await getKidPath();
      expect(kidPath.length).toBe(kidImageNames.length);
    });
    // TODO Uncomment the following test after implementing getKidPath
    // it('should return an array of kid image paths with a specified length', async () => {
    //   const kidPath = await getKidPath(5);
    //   expect(kidPath.length).toBe(5);
    // });

    it('should handle an error', async () => {
      try {
        await getKidPath(-1);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('parseName', () => {
    it('should parse a simple name correctly', () => {
      const fileName = 'word_123_maker.png';
      const parsed = parseName(fileName);
      expect(parsed).toEqual({
        word: 'word',
        id: '123',
        maker: 'maker',
      });
    });

    it('should parse a name with multiple underscores correctly', () => {
      const fileName = 'word_123_maker_name.png';
      const parsed = parseName(fileName);
      expect(parsed).toEqual({
        word: 'word',
        id: '123',
        maker: 'maker name',
      });
    });

    it('should parse a name with no underscores correctly', () => {
      const fileName = 'word.png';
      const parsed = parseName(fileName);
      expect(parsed).toEqual({
        word: 'word',
        id: undefined,
        maker: '',
      });
    });

    it('should parse a name with no extension correctly', () => {
      const fileName = 'word_123_maker';
      const parsed = parseName(fileName);
      expect(parsed).toEqual({
        word: 'word',
        id: '123',
        maker: 'maker',
      });
    });

    it('should parse a name with multiple dots correctly', () => {
      const fileName = 'word_123_maker.name.png';
      const parsed = parseName(fileName);
      expect(parsed).toEqual({
        word: 'word',
        id: '123',
        maker: 'maker.name',
      });
    });
  });
});
