import request from 'supertest';

import { RoleEnum } from '@roles/roles.enum';
import { StatusEnum } from '@statuses/statuses.enum';

import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_URL } from '../utils/constants';

describe('Users admin (e2e)', () => {
  const app = APP_URL;
  let newUserFirst;
  const newUserEmailFirst = `user-first.${Date.now()}@example.com`;
  const newUserPasswordFirst = `secret`;
  const newUserChangedPasswordFirst = `new-secret`;
  const newUserByAdminEmailFirst = `user-created-by-admin.${Date.now()}@example.com`;
  const newUserByAdminPasswordFirst = `secret`;
  let apiToken;

  //TODO: renase tests to allow cookie-based session

  beforeAll(async () => {
    await request(app)
      .post('/api/v1/auth/email/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .then(({ body }) => {
        apiToken = body.token;
      });

    await request(app)
      .post('/api/v1/auth/email/register')
      .send({
        email: newUserEmailFirst,
        firstName: `First${Date.now()}`,
        lastName: 'E2E',
        password: newUserPasswordFirst,
      });

    await request(app)
      .post('/api/v1/auth/email/login')
      .send({ email: newUserEmailFirst, password: newUserPasswordFirst })
      .then(({ body }) => {
        newUserFirst = body.user;
      });
  });

  it('Change password for new user: /api/v1/users/:id (PATCH)', () => {
    return request(app)
      .patch(`/api/v1/users/${newUserFirst.id}`)
      .auth(apiToken, {
        type: 'bearer',
      })
      .send({ password: newUserChangedPasswordFirst })
      .expect(200);
  });

  it('Login via registered user: /api/v1/auth/email/login (POST)', () => {
    return request(app)
      .post('/api/v1/auth/email/login')
      .send({ email: newUserEmailFirst, password: newUserChangedPasswordFirst })
      .expect(200)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
      });
  });

  it('Fail create new user by admin: /api/v1/users (POST)', () => {
    return request(app)
      .post(`/api/v1/users`)
      .auth(apiToken, {
        type: 'bearer',
      })
      .send({ email: 'fail-data' })
      .expect(422);
  });

  it('Success create new user by admin: /api/v1/users (POST)', () => {
    return request(app)
      .post(`/api/v1/users`)
      .auth(apiToken, {
        type: 'bearer',
      })
      .send({
        email: newUserByAdminEmailFirst,
        firstName: `UserByAdmin${Date.now()}`,
        lastName: 'E2E',
        password: newUserByAdminPasswordFirst,
        role: {
          id: RoleEnum.user,
        },
        status: {
          id: StatusEnum.active,
        },
      })
      .expect(201);
  });

  it('Login via created by admin user: /api/v1/auth/email/login (GET)', () => {
    return request(app)
      .post('/api/v1/auth/email/login')
      .send({
        email: newUserByAdminEmailFirst,
        password: newUserByAdminPasswordFirst,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
      });
  });

  it('Get list of users by admin: /api/v1/users (GET)', () => {
    return request(app)
      .get(`/api/v1/users`)
      .auth(apiToken, {
        type: 'bearer',
      })
      .expect(200)
      .send()
      .expect(({ body }) => {
        expect(body.data[0].provider).toBeDefined();
        expect(body.data[0].email).toBeDefined();
        expect(body.data[0].hash).not.toBeDefined();
        expect(body.data[0].password).not.toBeDefined();
        expect(body.data[0].previousPassword).not.toBeDefined();
      });
  });
});
