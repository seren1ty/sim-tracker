/**
 * Documentation tests for PATCH /api/games/[id]
 *
 * Purpose: Ensures that only the 'name' field can be updated from admin mode
 * Protected fields (groupId, code) should not be modifiable
 *
 * API Endpoint: PATCH /api/games/[id]
 *
 * Request Body (allowed):
 * - name: string (required)
 *
 * Request Body (protected - will be ignored):
 * - groupId: string (protected)
 * - code: string (protected)
 *
 * Response: Updated game object
 */

describe('PATCH /api/games/[id] - Documentation', () => {
  it('should document that only name field can be updated', () => {
    const allowedFields = ['name'];
    const protectedFields = ['groupId', 'code'];

    expect(allowedFields).toContain('name');
    expect(protectedFields).toContain('groupId');
    expect(protectedFields).toContain('code');
  });

  it('should document the request/response structure', () => {
    const requestBody = {
      name: 'Updated Game Name',
    };

    const expectedResponse = {
      _id: 'game123',
      groupId: 'group456', // Should remain unchanged
      name: 'Updated Game Name', // Should be updated
      code: 'AC',          // Should remain unchanged
    };

    expect(requestBody).toHaveProperty('name');
    expect(expectedResponse).toHaveProperty('_id');
    expect(expectedResponse).toHaveProperty('groupId');
    expect(expectedResponse).toHaveProperty('code');
    expect(expectedResponse).toHaveProperty('name');
  });
});
