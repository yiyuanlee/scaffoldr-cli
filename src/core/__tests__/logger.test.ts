import chalk from 'chalk';

const originalEnv = process.env;

describe('logger', () => {
  let logger: typeof import('../logger').logger;
  let consoleSpy: jest.SpyInstance;

  beforeAll(async () => {
    // Re-import to get fresh module
    logger = (await import('../logger')).logger;
  });

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.restoreAllMocks();
  });

  describe('debug', () => {
    it('does not print when DEBUG is not set', () => {
      delete process.env.DEBUG;
      logger.debug('test message');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('prints when DEBUG is set', () => {
      process.env.DEBUG = '1';
      logger.debug('debug message');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[debug]'), 'debug message');
      delete process.env.DEBUG;
    });
  });

  describe('info', () => {
    it('prints with ℹ prefix', () => {
      logger.info('hello');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ℹ'), 'hello');
    });
  });

  describe('success', () => {
    it('prints with ✓ prefix', () => {
      logger.success('done');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('✓'), 'done');
    });
  });

  describe('warn', () => {
    it('prints with ⚠ prefix', () => {
      logger.warn('careful');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('⚠'), 'careful');
    });
  });

  describe('error', () => {
    it('prints to stderr', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      logger.error('oops');
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('✗'), 'oops');
      errorSpy.mockRestore();
    });
  });

  describe('step', () => {
    it('prints with › prefix', () => {
      logger.step('next');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('›'), 'next');
    });
  });

  describe('bold', () => {
    it('prints bold text', () => {
      logger.bold('important');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('important'));
    });
  });
});
