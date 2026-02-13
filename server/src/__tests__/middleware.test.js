const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn()
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Set JWT_SECRET for tests
    process.env.JWT_SECRET = 'test-secret-key';
  });

  it('should call next() with valid token', () => {
    const token = jwt.sign({ userId: '123' }, process.env.JWT_SECRET);
    req.header.mockReturnValue(`Bearer ${token}`);

    auth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toHaveProperty('userId', '123');
  });

  it('should return 401 when no token is provided', () => {
    req.header.mockReturnValue(undefined);

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'No authentication token provided'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 with invalid token', () => {
    req.header.mockReturnValue('Bearer invalid-token');

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid authentication token'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 500 when JWT_SECRET is not set', () => {
    delete process.env.JWT_SECRET;
    const token = jwt.sign({ userId: '123' }, 'any-secret');
    req.header.mockReturnValue(`Bearer ${token}`);

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Server configuration error'
    });
    expect(next).not.toHaveBeenCalled();

    // Restore for other tests
    process.env.JWT_SECRET = 'test-secret-key';
  });

  it('should handle expired token', () => {
    const token = jwt.sign({ userId: '123' }, process.env.JWT_SECRET, { expiresIn: '0s' });
    req.header.mockReturnValue(`Bearer ${token}`);

    // Wait a bit to ensure token expires
    setTimeout(() => {
      auth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid authentication token'
      });
      expect(next).not.toHaveBeenCalled();
    }, 100);
  });
});
