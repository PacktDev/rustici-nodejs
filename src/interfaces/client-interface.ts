export default interface IClient {
  /**
   * The base URL against which to resolve every API call's (relative) path.
   * @type {String}
   */
  basePath: string;

  /**
   * The authentication methods to be included for all API calls.
   * @type {Object}
   */
  authTypes: string[];

  /**
   * The authorised username to get authenticated.
   * @type {String}
   */
  username: string;

  /**
   * The authorised password to get authenticated.
   * @type {String}
   */
  password: string;

  /**
   * The authorised secret key for authenticated API calls.
   * @type {String}
   */
  apiKey: string;

  /**
   * The bearer token for authenticated API calls.
   * @type {String}
   */
  accessToken: string;

  /**
   * The HTTP headers to be included for all API calls.
   * @type {Object}
   * @default {}
   */
  headerParams: object;

  /**
   * The default HTTP timeout for all API calls.
   * @type {Number}
   * @default 60000
   */
  timeout: number;

  /**
   * The path params for all API calls.
   * @default {}
   */
  pathParams: object;

  /**
   * The query params for all API calls.
   * @default {}
   */
  queryParams: object;

  /**
   * The form data for multipart/form-data | application/x-www-form-urlencoded content-type
   * @type {Object}
   */
  formParams: object;

  /**
   * The response type for the API calls
   * @type {string}
   */
  responseType: string;

  /**
   * The MIME type for the API calls
   * @type {string}
   */
  contentType: string;
}
