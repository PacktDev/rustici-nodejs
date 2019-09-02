import Superagent from 'superagent';
import { AxiosInstance } from 'axios';
import Client from '../interfaces/client-interface';
import Response from '../interfaces/response-interface';

export default abstract class ClientFactory {
  public username: string;
  public password: string;
  public apiKey: string;
  public accessToken: string;
  public authTypes: string[];
  public basePath: string;
  public headerParams: object;
  public timeout: number;
  public pathParams: object;
  public queryParams: object;
  public contentType: string;
  public formParams: object;
  public responseType: string;

  /**
   * Instantiate class
   * @param {Object} config
   */
  constructor(config: Client) {
    this.username = config.username || '';
    this.password = config.password || '';
    this.apiKey = config.apiKey || '';
    this.accessToken = config.accessToken || '';
    this.authTypes = config.authTypes;
    this.basePath = config.basePath;
    this.pathParams = config.pathParams;
    this.queryParams = config.queryParams;
    this.headerParams = config.headerParams;
    this.formParams = config.formParams;
    this.timeout = config.timeout || 60000;
    this.contentType = config.contentType || 'application/json';
    this.responseType = config.responseType || 'application/json';
  }

  /**
   * Post request.
   * @param {String} path
   * @param {Object} body
   * @returns {Promise<Object>}
   */
  public abstract postRequest<T>(path: string, body: object): Promise<Response<T>>;

  /**
   * Get request.
   * @param {String} path
   * @returns {Promise<Object>}
   */
  public abstract getRequest<T>(path: string): Promise<Response<T>>;

  /**
   * Put request.
   * @param {String} path
   * @param {Object} body
   * @returns {Promise<Object>}
   */
  public abstract putRequest<T>(path: string, body: object): Promise<Response<T>>;

  /**
   * Delete request.
   * @param {String} path
   * @returns {Promise<Object>}
   */
  public abstract deleteRequest<T>(path: string): Promise<Response<T>>;

  /**
   * Creates the request.
   * @param {String} httpMethod
   * @param {String} path
   * @param {Object} body
   * @returns {Promise<Superagent.SuperAgentRequest | AxiosInstance>}
   */
  public abstract createRequest(httpMethod: string, path: string, body: any): Superagent.SuperAgentRequest | AxiosInstance;

  /**
   * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
   * NOTE: query parameters are not handled here.
   * @param {String} path The path to append to the base URL.
   * @param {Object} pathParams The parameter values to append.
   * @param {String} apiBasePath Base path defined in the path, operation level to override the default one
   * @returns {String} The encoded path with parameter values substituted.
   */
  public buildUrl(path: string, pathParams: any, apiBasePath: string) {
    if (!path.match(/^\//)) {
      path = '/' + path;
    }

    let url = this.basePath + path;

    // use API (operation, path) base path if defined
    /* istanbul ignore if */
    if (apiBasePath !== null && apiBasePath !== undefined && apiBasePath !== '') {
      url = apiBasePath + path;
    }

    url = url.replace(/\{([\w-]+)\}/g, (fullMatch, key) => {
      let value;
      if (pathParams.hasOwnProperty(key)) {
        value = this.paramToString(pathParams[key]);
      } else {
        value = pathParams;
      }

      return encodeURIComponent(value);
    });

    return url;
  }

  /**
   * Returns a string representation for an actual parameter.
   * @param param The actual parameter.
   * @returns {String} The string representation of <code>param</code>.
   */
  public paramToString(param: any) {
    if (!param) {
      return '';
    }
    if (param instanceof Date) {
      return param.toJSON();
    }

    return param.toString();
  }

  /**
   * Normalizes parameter values:
   * <ul>
   * <li>remove nils</li>
   * <li>keep files and arrays</li>
   * <li>format to string with `paramToString` for other cases</li>
   * </ul>
   * @param {Object.<String, Object>} params The parameters as object properties.
   * @returns {Object.<String, Object>} normalized parameters.
   */
  public normalizeParams(params: any) {
    const newParams: any = {};
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== null) {
        const value = params[key];
        if (this.isFileParam(value) || Array.isArray(value)) {
          newParams[key] = value;
        } else {
          newParams[key] = this.paramToString(value);
        }
      }
    }

    return newParams;
  }

  /**
   * Checks whether the given parameter value represents file-like content.
   * @param param The parameter to check.
   * @returns {Boolean} <code>true</code> if <code>param</code> represents a file.
   */
  public isFileParam(param: any) {
    // fs.ReadStream in Node.js and Electron (but not in runtime like browserify)
    if (typeof require === 'function') {
      let fs;
      try {
        fs = require('fs');
      } catch (err) {
        /* istanbul ignore next */
        return false;
      }

      if (fs && fs.ReadStream && param instanceof fs.ReadStream) {
        return true;
      }
    }

    // Buffer in Node.js
    if (typeof Buffer === 'function' && param instanceof Buffer) {
      return true;
    }

    return false;
  }

  /**
   * Deserializes an HTTP response body into a value of the specified type.
   * @param {Object} response A SuperAgent response object.
   * @param {(String|Array.<String>|Object.<String, Object>)} returnType The type to return. Pass a string for simple types
   * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
   * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
   * all properties on <code>data<code> will be converted to this type.
   * @returns {Object} Status field & deserialize body
   */
  public deserialize<T>(response: Superagent.Response, returnType: string) {
    if (response === null || returnType === null || response.status === 204) {
      return {} as Response<T>;
    }

    // Rely on SuperAgent for parsing response body.
    // See http://visionmedia.github.io/superagent/#parsing-response-bodies
    let data = response.body;
    if (data === null || (typeof data === 'object' && typeof data.length === 'undefined' && !Object.keys(data).length)) {
      // SuperAgent does not always produce a body; use the unparsed response as a fallback
      data = response.text;
    }

    if (returnType === 'application/json' && data instanceof Buffer) {
      data = JSON.parse(data.toString('utf8'));
    }

    return {
      status: response.status,
      data,
    } as Response<T>;
  }
}
