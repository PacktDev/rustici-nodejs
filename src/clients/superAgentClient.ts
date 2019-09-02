import * as Superagent from 'superagent';
import * as querystring from 'querystring';
import debug from 'debug';
import ClientFactory from './clientFactory';
import ILogger from '../interfaces/logger-interface';
import IClient from '../interfaces/client-interface';
import IResponse from '../interfaces/response-interface';

export default class SuperAgentClient extends ClientFactory {
  private logger: ILogger;

  /**
   * Instantiate class
   * @param {IClient} config
   */
  constructor(config: IClient) {
    super(config);

    const infoLogger = debug('rustici-sdk:info');
    const errorLogger = debug('rustici-sdk:error');
    this.logger = { info: infoLogger, error: errorLogger };
  }

  public postRequest<T>(path: string, body: object): Promise<IResponse<T>> {
    const request = this.createRequest('post', path, body);
    return request.then(response => this.deserialize(response, this.responseType));
  }

  public getRequest<T>(path: string): Promise<IResponse<T>> {
    const request = this.createRequest('get', path, undefined);
    return request.then(response => this.deserialize(response, this.responseType));
  }

  public putRequest<T>(path: string, body: object): Promise<IResponse<T>> {
    const request = this.createRequest('put', path, body);
    return request.then(response => this.deserialize(response, this.responseType));
  }

  public deleteRequest<T>(path: string): Promise<IResponse<T>> {
    const request = this.createRequest('delete', path, undefined);
    return request.then(response => this.deserialize(response, this.responseType));
  }

  public createRequest(httpMethod: string, path: string, body: any) {
    try {
      const url = this.buildUrl(path, this.pathParams, '');
      this.logger.info(url);

      let request = Superagent(httpMethod, url);
      request = this.applyAuthToRequest(request, this.authTypes);

      if (this.queryParams && Object.keys(this.queryParams).length) {
        request.query(this.normalizeParams(this.queryParams));
      }

      if (this.headerParams && Object.keys(this.headerParams).length) {
        request.set(this.normalizeParams(this.headerParams));
      }

      if (this.contentType === 'application/x-www-form-urlencoded') {
        request.send(querystring.stringify(this.normalizeParams(this.formParams)));
      } else if (this.contentType === 'multipart/form-data') {
        const normalizedformParams = this.normalizeParams(this.formParams);
        for (const key in normalizedformParams) {
          if (normalizedformParams.hasOwnProperty(key)) {
            if (this.isFileParam(normalizedformParams[key])) {
              // file field
              request.attach(key, normalizedformParams[key]);
            } else {
              request.field(key, normalizedformParams[key]);
            }
          }
        }
      } else if (body !== null && body !== undefined) {
        request.send(body);
      }

      if (this.responseType) {
        request.responseType(this.responseType);
      }

      return request;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  /**
   * Applies authentication headers to the request.
   * @param {Object} request The request object created by a <code>superagent()</code> call.
   * @param {Array.<String>} authNames An array of authentication method names.
   */
  public applyAuthToRequest(request: Superagent.SuperAgentRequest, authNames: string[]) {
    authNames.forEach((authName) => {
      switch (authName) {
        case 'basic':
          if (this.username || this.password) {
            request.auth(this.username, this.password);
          }

          break;
        case 'bearer':
          if (this.accessToken) {
            request.set({ 'Authorization': 'Bearer ' + this.accessToken });
          }

          break;
        case 'apiKey':
          if (this.apiKey) {
            request.set({ 'x-api-key': this.apiKey });
          }

          break;
        case 'apiKeyQuery':
          if (this.apiKey) {
            request.query({ 'x-api-key': this.apiKey });
          }

          break;
        default:
          throw new Error('Unknown authentication type: ' + authName);
      }
    });

    return request;
  }
}
