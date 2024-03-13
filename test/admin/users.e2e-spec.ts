import request from 'supertest';

import { RoleEnum } from '../../src/roles/roles.enum';
import { StatusEnum } from '../../src/statuses/statuses.enum';
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_URL } from '../utils/constants';

describe('Users Module', () => {
  const app = APP_URL;
  let authCookie;
  let newUserFirst;

  beforeAll(async () => {
    await request(app)
      .post('/api/v1/auth/email/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .then(({ headers }) => {
        authCookie = headers['set-cookie'][0];
      });
  });

  describe('Update', () => {
    const newUserEmail = `user-first.${Date.now()}@example.com`;
    const newUserPassword = `secret`;
    const newUserChangedPassword = `new-secret`;

    beforeAll(async () => {
      await request(app)
        .post('/api/v1/auth/email/register')
        .send({
          email: newUserEmail,
          password: newUserPassword,
          firstName: `First${Date.now()}`,
          lastName: 'E2E',
        })
        .then(({ body }) => {
          newUserFirst = body.response;
        });
      await request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword });
    });

    describe('User with "Admin" role', () => {
      it('should change password for existing user: /api/v1/users/:id (PATCH)', () => {
        return request(app)
          .patch(`/api/v1/users/${newUserFirst.id}`)
          .set('Cookie', authCookie)
          .send({ password: newUserChangedPassword })
          .expect(200);
      });

      describe('Guest', () => {
        it('should login with changed password: /api/v1/auth/email/login (POST)', () => {
          return request(app)
            .post('/api/v1/auth/email/login')
            .send({
              email: newUserEmail,
              password: newUserChangedPassword,
            })
            .expect(204)
            .expect(({ headers }) => {
              expect(headers['set-cookie'].length).toEqual(3);
            });
        });
      });
    });
  });

  describe('Create', () => {
    const newUserByAdminEmail = `user-created-by-admin.${Date.now()}@example.com`;
    const newUserByAdminPassword = `secret`;

    describe('User with "Admin" role', () => {
      it('should fail to create new user with invalid email: /api/v1/users (POST)', () => {
        return request(app)
          .post(`/api/v1/users`)
          .set('Cookie', authCookie)
          .send({ email: 'fail-data' })
          .expect(422);
      });

      it('should successfully create new user: /api/v1/users (POST)', () => {
        return request(app)
          .post(`/api/v1/users`)
          .set('Cookie', authCookie)
          .send({
            email: newUserByAdminEmail,
            password: newUserByAdminPassword,
            firstName: `UserByAdmin${Date.now()}`,
            lastName: 'E2E',
            role: {
              id: RoleEnum.user,
            },
            status: {
              id: StatusEnum.active,
            },
          })
          .expect(201);
      });

      describe('Guest', () => {
        it('should successfully login via created by admin user: /api/v1/auth/email/login (GET)', () => {
          return request(app)
            .post('/api/v1/auth/email/login')
            .send({
              email: newUserByAdminEmail,
              password: newUserByAdminPassword,
            })
            .expect(204)
            .expect(({ headers }) => {
              expect(headers['set-cookie'].length).toEqual(3);
            });
        });
      });
    });
  });

  describe('Get many', () => {
    describe('User with "Admin" role', () => {
      it('should get list of users: /api/v1/users (GET)', () => {
        return request(app)
          .get(`/api/v1/users`)
          .set('Cookie', authCookie)
          .send()
          .expect(200)
          .expect(({ body }) => {
            expect(body.response.data[0].provider).toBeDefined();
            expect(body.response.data[0].email).toBeDefined();
            expect(body.response.data[0].hash).not.toBeDefined();
            expect(body.response.data[0].password).not.toBeDefined();
            expect(body.response.data[0].previousPassword).not.toBeDefined();
          });
      });
    });
  });
});
