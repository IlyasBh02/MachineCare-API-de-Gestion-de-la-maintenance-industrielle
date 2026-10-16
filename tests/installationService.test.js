jest.mock('../src/utils/transaction', () => ({
  runInTransaction: jest.fn(),
}));
jest.mock('../src/repositories/installationRepository', () => ({
  find: jest.fn(),
  create: jest.fn(),
}));
jest.mock('../src/repositories/userRepository', () => ({
  create: jest.fn(),
}));
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

const bcrypt = require('bcryptjs');
const installationRepository = require('../src/repositories/installationRepository');
const userRepository = require('../src/repositories/userRepository');
const { runInTransaction } = require('../src/utils/transaction');
const installationService = require('../src/services/installationService');

describe('installationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('reports whether installation exists', async () => {
    installationRepository.find.mockResolvedValueOnce({ installed: true });
    await expect(installationService.getStatus()).resolves.toBe(true);

    installationRepository.find.mockResolvedValueOnce(null);
    await expect(installationService.getStatus()).resolves.toBe(false);
  });

  test('creates the first admin and installation state in a transaction', async () => {
    const input = { name: 'Admin', email: 'admin@example.com', password: 'Password123!' };
    const admin = { _id: 'user-id' };
    const session = { id: 'session-id' };

    installationRepository.find
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    bcrypt.hash.mockResolvedValue('password-hash');
    runInTransaction.mockImplementation((callback) => callback(session));
    userRepository.create.mockResolvedValue(admin);

    await expect(installationService.install(input)).resolves.toBe(admin);

    expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
    expect(userRepository.create).toHaveBeenCalledWith(
      {
        name: input.name,
        email: input.email,
        passwordHash: 'password-hash',
        role: 'ADMIN',
      },
      session
    );
    expect(installationRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ installed: true, admin: admin._id }),
      session
    );
  });

  test('rejects an installation when an admin already exists', async () => {
    installationRepository.find.mockResolvedValueOnce({ installed: true });

    await expect(
      installationService.install({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'Password123!',
      })
    ).rejects.toMatchObject({ statusCode: 409 });

    expect(runInTransaction).not.toHaveBeenCalled();
  });
});
