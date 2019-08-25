import ClientFactory from "../clients/clientFactory";
import ICourse from "../interfaces/rustici-course-interface";
import IResponse from "../interfaces/response-interface";

export default class Courses {
  client: ClientFactory;

  constructor(clientFactory: ClientFactory) {
    this.client = clientFactory;
  }

  /**
   * Returns a list of all courses
   * @returns {Promise<IResponse<ICourse>>} course details
   */
  public async get(): Promise<IResponse<ICourse>> {
    return this.client.getRequest<ICourse>('/courses');
  }
}
