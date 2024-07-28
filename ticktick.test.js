// ticktick.test.js

import TickTick from './ticktick.js';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ access_token: 'mock_token', expires_in: 3600 }),
  })
);

describe('TickTick', () => {
  let ticktick;

  beforeEach(() => {
    ticktick = new TickTick();
    jest.clearAllMocks();
  });

  test('authenticate method should set token and expiry', async () => {
    await ticktick.authenticate();
    expect(ticktick.token).toBe('mock_token');
    expect(ticktick.tokenExpiry).toBeDefined();
  });

  test('addTask method should make a POST request', async () => {
    await ticktick.addTask('Test Task');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/task'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  // Add more tests for other methods...
});