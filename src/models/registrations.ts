import ClientFactory from "../clients/clientFactory";
import IRegistrationSchema from "../interfaces/rustici-registration-schema";
import IResponse from "../interfaces/response-interface";
import ILaunchLinkRequest from "../interfaces/rustici-launch-link-request-interface";
import ILaunchLink from "../interfaces/rustici-launch-link-interface";

export default class Registrations {
  private client: ClientFactory;

  constructor(clientFactory: ClientFactory) {
    this.client = clientFactory;
  }

  /**
   * Registers a user
   * @param registrationDetails registration details
   * @returns {Promise<IResponse<void>>} no response
   */
  public async registerUser(registrationDetails: IRegistrationSchema):
  Promise<IResponse<void>> {
    return this.client.postRequest('/registrations', registrationDetails);
  }

  /**
   * Get launch url from registration id
   * @param registrationId registration id
   * @param launchDetails launch details
   * @returns {Promise<IResponse<ILaunchLink>>} launch link
   */
  public async getLaunchLink(registrationId: string, launchDetails: ILaunchLinkRequest): Promise<IResponse<ILaunchLink>> {
    return this.client.postRequest(`/registrations/${registrationId}/launchLink`, launchDetails);
  }
}
