import ClientFactory from "../clients/clientFactory";
import IResponse from "../interfaces/response-interface";
import ICourseList from "../interfaces/rustici-course-list-interface";

export default class Courses {
  private client: ClientFactory;

  constructor(clientFactory: ClientFactory) {
    this.client = clientFactory;
  }

  /**
   * Returns a list of all courses
   * @returns {Promise<IResponse<ICourseList>>} course details
   */
  public async get(): Promise<IResponse<ICourseList>> {
    return this.client.getRequest<ICourseList>('/courses');
  }
}
