const User = require('../src/models/User');

describe('User model', () => {
  test('does not serialize the stored password hash', () => {
    const user = new User({
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash: 'not-for-responses',
      role: 'ADMIN',
    });

    expect(user.toJSON()).not.toHaveProperty('passwordHash');
  });
});
