import { addPathWithWords, getPathById, getWordsForPath } from '../db/db';
import { importPath, exportPath } from './PathUtils';

jest.mock('../db/db');

describe('PathUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('importPath calls DB method with correct parameters', async () => {
    addPathWithWords.mockResolvedValueOnce('mockSuccess');
    const mockPathName = 'testName';
    const mockPathWords = [
      { word: 'mockWord', imageData: { field1: 'mockField1' } },
    ];
    const mockPath = { name: mockPathName, words: mockPathWords };

    const resolvedValue = await importPath(mockPath);

    expect(resolvedValue).toEqual('mockSuccess');
    expect(addPathWithWords).toHaveBeenCalledWith(mockPathName, mockPathWords);
  });

  test('importPath forwards error from DB method', async () => {
    addPathWithWords.mockRejectedValueOnce(new Error('mock error'));
    const mockPathName = 'testName';
    const mockPathWords = [
      { word: 'mockWord', imageData: { field1: 'mockField1' } },
    ];
    const mockPath = { name: mockPathName, words: mockPathWords };

    try {
      await importPath(mockPath);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(addPathWithWords).toHaveBeenCalledWith(
        mockPathName,
        mockPathWords
      );
    }
  });

  test('exportPath throws if path is not found', async () => {
    getPathById.mockResolvedValueOnce(null);

    const mockPathId = 'mockPathId';

    try {
      await exportPath(mockPathId);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(getPathById).toHaveBeenCalled();
      expect(getWordsForPath).not.toHaveBeenCalled();
    }
  });

  test('exportPath does not export if path has no words', async () => {
    const mockPathId = 'mockPathId';
    const mockPath = { name: 'mockPathName', id: mockPathId };
    getPathById.mockResolvedValueOnce(mockPath);
    getWordsForPath.mockResolvedValueOnce([]);

    try {
      await exportPath(mockPathId);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(getPathById).toHaveBeenCalledWith(mockPathId);
      expect(getWordsForPath).toHaveBeenCalledWith(mockPathId);
    }
  });

  test('exports found path', async () => {
    const mockPathId = 'mockPathId';
    const mockPath = { name: 'mockPathName', id: mockPathId };
    const mockWords = [
      { word: 'mockWord1', imageData: { src: 'mockSrc1' } },
      { word: 'mockWord2', imageData: { src: 'mockSrc2' } },
    ];
    getPathById.mockResolvedValueOnce(mockPath);
    getWordsForPath.mockResolvedValueOnce(mockWords);

    const expected = { name: 'mockPathName', words: mockWords };
    const exportedPath = await exportPath(mockPathId);
    expect(exportedPath).toStrictEqual(expected);
  });
});
