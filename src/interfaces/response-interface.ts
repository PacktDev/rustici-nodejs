export default interface IResponse<T> {
  /**
   * Response status
   */
  status: number;

  /**
   * Response body
   */
  data: T;
}
