import { expect } from 'chai';
import 'mocha';
import * as Nock from 'nock';
import RusticiSdk from '../src/index';
import SuperAgentClient from '../src/clients/superAgentClient';

const config = { username: 'Chandler Bing', password: 'Trasnponster', apiKey: 'qWeRty', accessToken: 'token', authTypes: ['basic'], pathParams: {}, queryParams: {}, headerParams: {}, formParams: {}, responseType: 'application/json', basePath: 'https://fake.url.com', timeout: 60000, contentType: 'application/json' };

describe('Index', () => {
  it('Should instantiate the SuperAgent object when empty client not passed', () => {
    const client = new RusticiSdk(undefined, config);
    expect(client).to.be.a('object');
    expect(client).to.have.ownProperty('clientImpl');
    expect(client.clientImpl).to.instanceof(SuperAgentClient);
  });
  it('Should instantiate the SuperAgent object', () => {
    const client = new RusticiSdk('superagent', config);
    expect(client).to.be.a('object');
    expect(client).to.have.ownProperty('clientImpl');
    expect(client.clientImpl).to.instanceof(SuperAgentClient);
  });
  it('Should instantiate the empty ClientFactory object', () => {
    const client = new RusticiSdk('Axios', config);
    expect(client).to.be.a('object');
    expect(client).to.have.ownProperty('clientImpl');
    expect(client.clientImpl).to.be.a('object');
    expect(Object.keys(client.clientImpl).length).to.be.eql(0);
  });

  describe('Actual calls', () => {
    it('getCourses', async () => {
      const expectedResult = { courses: [{ title: 'Joey Tribbiani', id: '30', webPath: 'ok' }] };
      const path = '/courses';
      const client = new RusticiSdk(undefined, config);

      Nock(config.basePath)
        .get(path)
        .reply(200, expectedResult);

      await client.courses.get()
        .then((response) => {
          expect(response).to.have.ownProperty('status');
          expect(response).to.have.ownProperty('data');
          expect(response.status).to.be.eql(200);
          expect(response.data.courses[0].title).to.be.eql('Joey Tribbiani');
          expect(response.data.courses[0].webPath).to.be.eql('ok');
        });
    });

    it('registerUser', async () => {
      const request = { courseId: '123', learner: { id: '456', firstName: 'Joey', lastName: 'Tribiani' }, registrationId: '987' };
      const path = '/registrations';
      const client = new RusticiSdk(undefined, config);

      const nock = Nock(config.basePath)
        .post(path)
        .reply(204);

      await client.registrations.registerUser(request)
        .then(() => {
          expect(nock.isDone());
        });
    });

    it('getLaunchLink', async () => {
      const request = { expiry: 10, redirectOnExitUrl: 'https:goiogle.com' };
      const expectedResult = { launchLink: 'https://launch.url' };
      const path = '/registrations/987/launchLink';
      const client = new RusticiSdk(undefined, config);

      Nock(config.basePath)
        .post(path)
        .reply(200, expectedResult);

      await client.registrations.getLaunchLink('987', request)
        .then((response) => {
          expect(response).to.have.ownProperty('status');
          expect(response).to.have.ownProperty('data');
          expect(response.status).to.be.eql(200);
          expect(response.data.launchLink).to.be.eql('https://launch.url');
        });
    });

    it('add webhook configuration', async () => {
      const path = '/registrations/987/configuration'
      const client = new RusticiSdk(undefined, config);
      const configuration = {
        settings: [{
          settingId: 'ApiRollupRegistrationPostBackUrl',
          value: 'http://post-back-url.com/bringitback',
        }],
      };

      const nock = Nock(config.basePath)
        .post(path)
        .reply(204);

        await client.registrations.addWebhookSettings('987', configuration)
        .then(() => expect(nock.isDone()));
    });
  });
})
