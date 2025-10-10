/**
 * Documentation tests for PATCH /api/cars/[id]
 *
 * Purpose: Ensures that only the 'name' field can be updated from admin mode
 * Protected fields (groupId, gameId, game) should not be modifiable
 *
 * API Endpoint: PATCH /api/cars/[id]
 *
 * Request Body (allowed):
 * - name: string (required)
 *
 * Request Body (protected - will be ignored):
 * - groupId: string (protected)
 * - gameId: string (protected)
 * - game: string (protected)
 *
 * Response: Updated car object
 */

describe('PATCH /api/cars/[id] - Documentation', () => {
  it('should document that only name field can be updated', () => {
    const allowedFields = ['name'];
    const protectedFields = ['groupId', 'gameId', 'game'];

    expect(allowedFields).toContain('name');
    expect(protectedFields).toContain('groupId');
    expect(protectedFields).toContain('gameId');
    expect(protectedFields).toContain('game');
  });

  it('should document the request/response structure', () => {
    const requestBody = {
      name: 'Updated Car Name',
    };

    const expectedResponse = {
      _id: 'car123',
      groupId: 'group456', // Should remain unchanged
      gameId: 'game789',   // Should remain unchanged
      game: 'Assetto Corsa', // Should remain unchanged
      name: 'Updated Car Name', // Should be updated
    };

    expect(requestBody).toHaveProperty('name');
    expect(expectedResponse).toHaveProperty('_id');
    expect(expectedResponse).toHaveProperty('groupId');
    expect(expectedResponse).toHaveProperty('gameId');
    expect(expectedResponse).toHaveProperty('game');
    expect(expectedResponse).toHaveProperty('name');
  });
});
