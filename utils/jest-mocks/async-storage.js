jest.mock('@react-native-community/async-storage', () => {
  const mock = jest.requireActual(
    '@react-native-community/async-storage/jest/async-storage-mock'
  );

  // Fixes a bug with the mock when merging on a key that doesn't hold any value yet
  const { mergeItem } = mock;
  mock.mergeItem = jest.fn((key, value, callback) => {
    if (mock.__INTERNAL_MOCK_STORAGE__[key] === undefined) {
      mock.__INTERNAL_MOCK_STORAGE__[key] = '{}';
    }
    return mergeItem(key, value, callback);
  });

  return mock;
});
