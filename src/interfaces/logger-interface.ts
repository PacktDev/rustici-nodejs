import debug from 'debug';

export default interface ILogger {
  /**
   * Info logger
   */
  info: debug.Debugger;

  /**
   * Error logger
   */
  error: debug.Debugger;
}
