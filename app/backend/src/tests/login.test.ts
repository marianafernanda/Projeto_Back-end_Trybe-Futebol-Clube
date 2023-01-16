import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';

import { Response } from 'superagent';
import { incorrectEmail, invalidEmail, invalidPassword, user, userRole, validePayload, token, Decode } from './mocks/login.mocks';
import UserModel from '../database/models/UserModel';
import * as jwt from 'jsonwebtoken';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('Testando a rota login', () => {
  describe('Testando POST /login', () => {
    describe('Quando a rota recebe um payload válido', () => {
      before(() => {
        sinon.stub(UserModel, 'findOne').resolves(user as UserModel)
      })
      after(() => {
        (UserModel.findOne as sinon.SinonStub).restore()
      })
      it('retorna um token', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send(validePayload);
        expect(response.status).to.be.equal(200)
        expect(response.body).to.have.property('token')
      })
    })

    describe('Quando não recebe e-mail', () => {
      it('retorna um erro', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send(invalidEmail);
        expect(response.status).to.be.equal(400)
        expect(response.body.message).to.be.equal('All fields must be filled')
      })
    })

    describe('Quando não recebe password', () => {
      it('retorna um erro', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send(invalidPassword);
        expect(response.status).to.be.equal(400)
        expect(response.body.message).to.be.equal('All fields must be filled')
      })
    })

    describe('Quando a rota recebe um e-mail incorreto', () => {
      before(() => {
        sinon.stub(UserModel, 'findOne').resolves(user as UserModel)
      })
      after(() => {
        (UserModel.findOne as sinon.SinonStub).restore()
      })
      it('retorna um erro', async () => {
        const response = await chai
          .request(app)
          .post('/login')
          .send(incorrectEmail);
        expect(response.status).to.be.equal(401)
        expect(response.body.message).to.be.equal('Incorrect email or password')
      })
    })
  })

  describe('Testando GET /login/validate', () => {
    // describe('Quando a rota recebe um token válido', () => {
    //   before(() => {
    //     sinon.stub(UserModel, 'findOne').resolves(user as UserModel)
    //     sinon.stub(jwt, 'verify').returns(Decode as unknown)
    //   })
    //   after(() => {
    //     (UserModel.findOne as sinon.SinonStub).restore()
    //   })
    //   it('retorna a role do user', async () => {
    //     const response = await chai
    //       .request(app)
    //       .get('/login/validate')
    //       .set({ Authorization: token })
    //     expect(response.status).to.be.equal(200)
    //     expect(response.body).to.have.property('role')
    //   })
    // })

    describe('Quando a rota recebe um token inválido', () => {
      before(() => {
        sinon.stub(UserModel, 'findOne').resolves(user as UserModel)
      })
      after(() => {
        (UserModel.findOne as sinon.SinonStub).restore()
      })
      it('retorna um erro', async () => {
        const response = await chai
          .request(app)
          .get('/login/validate')
          .set({ Authorization: token })
        expect(response.status).to.be.equal(401)
        expect(response.body.message).to.be.equal('Token must be a valid token')
      })
    })

    describe('Quando a rota não recebe um token', () => {
      before(() => {
        sinon.stub(UserModel, 'findOne').resolves(user as UserModel)
      })
      after(() => {
        (UserModel.findOne as sinon.SinonStub).restore()
      })
      it('retorna um erro', async () => {
        const response = await chai
          .request(app)
          .get('/login/validate')
          .set({ Authorization: '' });
        expect(response.status).to.be.equal(401)
        expect(response.body.message).to.be.equal('Token not found')
      })
    })
  })
});
