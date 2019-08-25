/* tslint disable:no-string-literal: 0 */

import { expect } from 'chai';
import * as Nock from 'nock';
import SuperAgentClient from '../../src/clients/superAgentClient';
import fs = require('fs');

const config = { username: 'Chandler Bing', password: 'Trasnponster', apiKey: 'qWeRty', accessToken: 'token', authTypes: ['basic'], pathParams: {}, queryParams: {}, headerParams: {}, formParams: {}, responseType: 'application/json', basePath: 'https://fake.url.com', timeout: 60000, contentType: 'application/json' };

describe('SuperAgent client', () => {
  describe('Constructor', () => {
    it('Should instantiate the SuperAgent object', () => {
      const implementation = new SuperAgentClient(config);
      expect(implementation).to.be.instanceof(SuperAgentClient);
    });
  });

  describe('Test post request', () => {
    const body = { name: 'Joey Tribbiani', age: '30' };
    const expectedResult = { name: 'Joey Tribbiani', age: '30', message: 'ok' };
    const path = '/login';

    Nock(config.basePath)
      .post(path, body)
      .times(2)
      .reply(200, expectedResult);

    it('Valid post request with basic auth', (done) => {
      const implementation = new SuperAgentClient(config);
      implementation.postRequest<any>(path, body)
        .then((response) => {
          expect(response).to.have.ownProperty('status');
          expect(response).to.have.ownProperty('data');
          expect(response.status).to.be.eql(200);
          expect(response.data.name).to.be.eql('Joey Tribbiani');
          expect(response.data.message).to.be.eql('ok');
          done();
        })
        .catch((error) => done(error));
    });
    it('Valid post request with bearer auth', (done) => {
      config.authTypes = ['bearer'];
      const implementation = new SuperAgentClient(config);
      implementation.postRequest<any>(path, body)
        .then((response) => {
          expect(response).to.have.ownProperty('status');
          expect(response).to.have.ownProperty('data');
          expect(response.status).to.be.eql(200);
          expect(response.data.name).to.be.eql('Joey Tribbiani');
          expect(response.data.message).to.be.eql('ok');
          done();
        })
        .catch((error) => done(error));
    });
  });

  describe('Test get request', () => {
    const expectedResult = { name: 'Joey Tribbiani', age: '30', message: 'ok' };
    const path = '/user';

    Nock(config.basePath)
      .get(path)
      .times(2)
      .reply(200, expectedResult);

    it('Valid get request with basic auth', (done) => {
      const implementation = new SuperAgentClient(config);
      implementation.getRequest<any>(path)
        .then((response) => {
          expect(response).to.have.ownProperty('status');
          expect(response).to.have.ownProperty('data');
          expect(response.status).to.be.eql(200);
          expect(response.data.name).to.be.eql('Joey Tribbiani');
          expect(response.data.message).to.be.eql('ok');
          done();
        })
        .catch((error) => done(error));
    });
    it('Valid get request with bearer auth', (done) => {
      config.authTypes = ['bearer'];
      const implementation = new SuperAgentClient(config);
      implementation.getRequest<any>(path)
        .then((response) => {
          expect(response).to.have.ownProperty('status');
          expect(response).to.have.ownProperty('data');
          expect(response.status).to.be.eql(200);
          expect(response.data.name).to.be.eql('Joey Tribbiani');
          expect(response.data.message).to.be.eql('ok');
          done();
        })
        .catch((error) => done(error));
    });
  });

  describe('Test put request', () => {
    const body = { name: 'Joey Tribbiani', age: '30' };
    const expectedResult = { name: 'Joey Tribbiani', age: '30', message: 'ok' };
    const path = '/login';

    Nock(config.basePath)
      .put(path, body)
      .times(2)
      .reply(200, expectedResult);

    it('Valid post request with basic auth', (done) => {
      const implementation = new SuperAgentClient(config);
      implementation.putRequest<any>(path, body)
        .then((response) => {
          expect(response).to.have.ownProperty('status');
          expect(response).to.have.ownProperty('data');
          expect(response.status).to.be.eql(200);
          expect(response.data.name).to.be.eql('Joey Tribbiani');
          expect(response.data.message).to.be.eql('ok');
          done();
        })
        .catch((error) => done(error));
    });
    it('Valid post request with apiKey', (done) => {
      config.authTypes = ['apiKey'];
      const implementation = new SuperAgentClient(config);
      implementation.putRequest<any>(path, body)
        .then((response) => {
          expect(response).to.have.ownProperty('status');
          expect(response).to.have.ownProperty('data');
          expect(response.status).to.be.eql(200);
          expect(response.data.name).to.be.eql('Joey Tribbiani');
          expect(response.data.message).to.be.eql('ok');
          done();
        })
        .catch((error) => done(error));
    });
  });

  describe('Test delete request', () => {
    const expectedResult = { name: 'Joey Tribbiani', age: '30', message: 'ok' };
    const path = '/user';

    Nock(config.basePath)
      .delete(path)
      .times(2)
      .reply(200, expectedResult);

    it('Valid get request with basic auth', (done) => {
      const implementation = new SuperAgentClient(config);
      implementation.deleteRequest<any>(path)
        .then((response) => {
          expect(response).to.have.ownProperty('status');
          expect(response).to.have.ownProperty('data');
          expect(response.status).to.be.eql(200);
          expect(response.data.name).to.be.eql('Joey Tribbiani');
          expect(response.data.message).to.be.eql('ok');
          done();
        })
        .catch((error) => done(error));
    });
    it('Valid get request with bearer auth', (done) => {
      config.authTypes = ['bearer'];
      const implementation = new SuperAgentClient(config);
      implementation.deleteRequest<any>(path)
        .then((response) => {
          expect(response).to.have.ownProperty('status');
          expect(response).to.have.ownProperty('data');
          expect(response.status).to.be.eql(200);
          expect(response.data.name).to.be.eql('Joey Tribbiani');
          expect(response.data.message).to.be.eql('ok');
          done();
        })
        .catch((error) => done(error));
    });
  });

  describe('Test superagent request for authentication', () => {
    const path = '/login';
    const method = 'get';

    it('Should create a proper superagent request with basic auth', () => {
      config.authTypes = ['basic'];
      const implementation = new SuperAgentClient(config);
      const request = Object.assign({}, implementation.createRequest(method, path, undefined)) as any;
      expect(request.method).to.be.eql(method);
      expect(request.url).to.be.eql(`${config.basePath}${path}`);
      expect(request.header).to.be.a('object');
      expect(request.header).to.have.ownProperty('Authorization');
      expect(request.header.Authorization).to.have.a('string');

      const splitAuth = request.header.Authorization.split(' ');
      expect(splitAuth).to.have.length(2);
      expect(splitAuth[0]).to.be.eql('Basic');

      const buff = new Buffer(splitAuth[1], 'base64');
      const text = buff.toString('ascii');
      expect(text).to.be.eql(`${config.username}:${config.password}`);
    });
    it('Should create a proper superagent request with no empty basic auth', () => {
      config.username = '';
      config.password = '';
      const implementation = new SuperAgentClient(config);
      const request = Object.assign({}, implementation.createRequest(method, path, undefined)) as any;
      expect(request.method).to.be.eql(method);
      expect(request.url).to.be.eql(`${config.basePath}${path}`);
      expect(request.header).to.be.a('object');
      expect(request.header).to.not.have.ownProperty('Authorization');
    });
    it('Should create a proper superagent request with bearer', () => {
      config.authTypes = ['bearer'];
      const implementation = new SuperAgentClient(config);
      const request = Object.assign({}, implementation.createRequest(method, path, undefined)) as any;
      expect(request.method).to.be.eql(method);
      expect(request.url).to.be.eql(`${config.basePath}${path}`);
      expect(request.header).to.be.a('object');
      expect(request.header).to.have.ownProperty('Authorization');
      expect(request.header.Authorization).to.be.eql(`Bearer ${config.accessToken}`);
    });
    it('Should create a proper superagent request with x-api-key', () => {
      config.authTypes = ['apiKey'];
      const implementation = new SuperAgentClient(config);
      const request = Object.assign({}, implementation.createRequest(method, path, undefined)) as any;
      expect(request.method).to.be.eql(method);
      expect(request.url).to.be.eql(`${config.basePath}${path}`);
      expect(request.header).to.be.a('object');
      expect(request.header).to.have.ownProperty('x-api-key');
      expect(request.header['x-api-key']).to.be.eql('qWeRty');
    });
    it('Should create a proper superagent request with x-api-key in query param', () => {
      config.authTypes = ['apiKeyQuery'];
      const implementation = new SuperAgentClient(config);
      const request = Object.assign({}, implementation.createRequest(method, path, undefined)) as any;
      expect(request.method).to.be.eql(method);
      expect(request.url).to.be.eql(`${config.basePath}${path}`);
      expect(request.qs).to.be.a('object');
      expect(request.qs).to.have.ownProperty('x-api-key');
      expect(request.qs['x-api-key']).to.be.eql('qWeRty');
    });
  });

  describe('Test superagent request for content type', () => {
    const path = '/login';
    const method = 'post';
    const filename = __dirname + '/../../src/index.ts';

    it('Should create a proper superagent request with contentType[application/x-www-form-urlencoded]', () => {
      const body = { userId: 'dSsdFfg3213s' };

      config.authTypes = ['basic'];
      config.contentType = 'application/x-www-form-urlencoded';
      config.formParams = body;
      const implementation = new SuperAgentClient(config);
      const request = Object.assign({}, implementation.createRequest(method, path, undefined)) as any;
      expect(request.method).to.be.eql(method);
      expect(request.url).to.be.eql(`${config.basePath}${path}`);
      expect(request.header).to.be.a('object');
      expect(request.header).to.have.ownProperty('Content-Type');
      expect(request.header['Content-Type']).to.be.eql('application/x-www-form-urlencoded');

      expect(request['_data']).to.be.a('string');
      expect(request['_data']).to.be.eql(`${Object.keys(body)[0]}=${body.userId}`);
    });
    it('Should create a proper superagent request with contentType[multipart/form-data]', () => {
      const body = { userId: 'dSsdFfg3213s', file: fs.createReadStream(filename) };

      config.authTypes = ['basic'];
      config.contentType = 'multipart/form-data';
      config.formParams = body;
      const implementation = new SuperAgentClient(config);
      const request = Object.assign({}, implementation.createRequest(method, path, undefined)) as any;
      expect(request.method).to.be.eql(method);
      expect(request.url).to.be.eql(`${config.basePath}${path}`);
      expect(request).to.have.ownProperty('_formData');
      expect(request['_formData']).to.be.a('object');

      const formData = request['_formData'];
      expect(formData).to.have.ownProperty('_streams');
      expect(formData['_streams']).to.be.a('array');
      expect(formData['_streams']).to.have.length.least(5);
      expect(formData['_streams'][0]).to.have.string(Object.keys(body)[0]);
      expect(formData['_streams'][1]).to.have.string(body.userId);
      expect(formData['_streams'][3]).to.have.string('index.ts');
    });
    it('Should throw error', () => {
      config.authTypes = ['xyz'];
      const implementation = new SuperAgentClient(config);
      expect(() => implementation.createRequest(method, path, undefined)).to.throw(`Unknown authentication type: ${config.authTypes[0]}`);
    });
  });
});
