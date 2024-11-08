import { getAdultPath, getKidPath } from './StockPathHelper';
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
  });
});
