import SuperAgentClientImpl from './clients/superAgentClient';
import ClientFactory from './clients/clientFactory';
import IClient from './interfaces/client-interface';
import Courses from './models/courses';
import Registrations from './models/registrations';

export default class RusticiSdk {
  /**
   * Http client.
   * @type {ClientFactory}
   */
  public clientImpl: ClientFactory;
  public courses: Courses;
  public registrations: Registrations;

  /**
   * Instantiate class
   * @param {String} client
   * @param {Object} config
   */
  constructor(client: string = 'superagent', config: IClient) {
    if (client === 'superagent') {
      this.clientImpl = new SuperAgentClientImpl(config);
    } else {
      // for future use, if want to use other http client.
      this.clientImpl = {} as ClientFactory;
    }

    this.courses = new Courses(this.clientImpl);
    this.registrations = new Registrations(this.clientImpl);
  }
}
