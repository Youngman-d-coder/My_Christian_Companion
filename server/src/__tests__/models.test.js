const User = require('../models/User');

describe('User Model', () => {
  describe('Schema validation', () => {
    it('should create a valid user', () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedpassword123',
        name: 'Test User',
        denomination: 'catholic'
      };

      const user = new User(userData);
      const validationError = user.validateSync();

      expect(validationError).toBeUndefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.denomination).toBe(userData.denomination);
    });

    it('should require email', () => {
      const user = new User({
        password: 'hashedpassword123',
        name: 'Test User'
      });

      const validationError = user.validateSync();
      expect(validationError.errors.email).toBeDefined();
    });

    it('should require password', () => {
      const user = new User({
        email: 'test@example.com',
        name: 'Test User'
      });

      const validationError = user.validateSync();
      expect(validationError.errors.password).toBeDefined();
    });

    it('should require name', () => {
      const user = new User({
        email: 'test@example.com',
        password: 'hashedpassword123'
      });

      const validationError = user.validateSync();
      expect(validationError.errors.name).toBeDefined();
    });

    it('should have default preferences', () => {
      const user = new User({
        email: 'test@example.com',
        password: 'hashedpassword123',
        name: 'Test User'
      });

      expect(user.preferences.theme).toBe('auto');
      expect(user.preferences.bibleTranslation).toBe('KJV');
      expect(user.preferences.notificationsEnabled).toBe(true);
    });

    it('should accept valid denomination values', () => {
      const validDenominations = ['catholic', 'protestant', 'orthodox', 'anglican', 'other'];
      
      validDenominations.forEach(denomination => {
        const user = new User({
          email: 'test@example.com',
          password: 'hashedpassword123',
          name: 'Test User',
          denomination
        });

        const validationError = user.validateSync();
        expect(validationError).toBeUndefined();
        expect(user.denomination).toBe(denomination);
      });
    });

    it('should convert email to lowercase', () => {
      const user = new User({
        email: 'TEST@EXAMPLE.COM',
        password: 'hashedpassword123',
        name: 'Test User'
      });

      expect(user.email).toBe('test@example.com');
    });
  });
});
