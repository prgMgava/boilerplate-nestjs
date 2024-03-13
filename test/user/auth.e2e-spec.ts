import request from 'supertest';

import {
  APP_URL,
  MAIL_HOST,
  MAIL_PORT,
  TESTER_EMAIL,
  TESTER_PASSWORD,
} from '../utils/constants';

describe('Auth Module', () => {
  const app = APP_URL;
  const mail = `http://${MAIL_HOST}:${MAIL_PORT}`;
  const newUserFirstName = `Tester${Date.now()}`;
  const newUserLastName = `E2E`;
  const newUserEmail = `User.${Date.now()}@example.com`;
  const newUserPassword = `secret`;

  describe('Registration', () => {
    it('should fail with exists email: /api/v1/auth/email/register (POST)', () => {
      return request(app)
        .post('/api/v1/auth/email/register')
        .send({
          email: TESTER_EMAIL,
          password: TESTER_PASSWORD,
          firstName: 'Tester',
          lastName: 'E2E',
        })
        .expect(422)
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
        });
    });

    it('should successfully: /api/v1/auth/email/register (POST)', async () => {
      return request(app)
        .post('/api/v1/auth/email/register')
        .send({
          email: newUserEmail,
          password: newUserPassword,
          firstName: newUserFirstName,
          lastName: newUserLastName,
        })
        .expect(201);
    });

    describe('Login', () => {
      it('should successfully with unconfirmed email: /api/v1/auth/email/login (POST)', () => {
        return request(app)
          .post('/api/v1/auth/email/login')
          .send({ email: newUserEmail, password: newUserPassword })
          .expect(204)
          .expect(({ headers }) => {
            expect(headers['set-cookie'].length).toEqual(3);
          });
      });
    });

    describe('Confirm email', () => {
      it('should successfully: /api/v1/auth/email/confirm (POST)', async () => {
        const hash = await request(mail)
          .get('/email')
          .then(({ body }) => {
            return body
              .find(
                (letter) =>
                  letter.to[0].address.toLowerCase() ===
                    newUserEmail.toLowerCase() &&
                  /.*confirm\-email\?hash\=(\S+).*/g.test(letter.text),
              )
              ?.text.replace(/.*confirm\-email\?hash\=(\S+).*/g, '$1');
          });

        return request(app)
          .post('/api/v1/auth/email/confirm')
          .send({
            hash,
          })
          .expect(204);
      });

      it('should fail for already confirmed email: /api/v1/auth/email/confirm (POST)', async () => {
        const hash = await request(mail)
          .get('/email')
          .then(
            ({ body }) =>
              body
                .find(
                  (letter) =>
                    letter.to[0].address.toLowerCase() ===
                      newUserEmail.toLowerCase() &&
                    /.*confirm\-email\?hash\=(\S+).*/g.test(letter.text),
                )
                ?.text.replace(/.*confirm\-email\?hash\=(\S+).*/g, '$1'),
          );

        return request(app)
          .post('/api/v1/auth/email/confirm')
          .send({
            hash,
          })
          .expect(404);
      });
    });
  });

  describe('Login', () => {
    it('should successfully for user with confirmed email: /api/v1/auth/email/login (POST)', () => {
      return request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .expect(204)
        .expect(({ headers }) => {
          expect(headers['set-cookie'].length).toEqual(3);
        });
    });
  });

  describe('Logged in user', () => {
    let authCookie;
    let refreshCookie;

    beforeAll(async () => {
      await request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .expect(({ headers }) => {
          authCookie = headers['set-cookie'][0];
          refreshCookie = headers['set-cookie'][1];
        });
    });

    it('should retrieve your own profile: /api/v1/auth/me (GET)', async () => {
      await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', authCookie)
        .send()
        .expect(({ body }) => {
          expect(body.response.provider).toBeDefined();
          expect(body.response.email).toBeDefined();
          expect(body.response.hash).not.toBeDefined();
          expect(body.response.password).not.toBeDefined();
          expect(body.response.previousPassword).not.toBeDefined();
        });
    });

    it('should get new refresh token: /api/v1/auth/refresh (POST)', async () => {
      await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', refreshCookie)
        .send()
        .expect(({ headers }) => {
          expect(headers['set-cookie'].length).toEqual(3);
        });
    });

    it('should fail on the second attempt to refresh token with the same token: /api/v1/auth/refresh (POST)', async () => {
      await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', refreshCookie)
        .send();

      await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', refreshCookie)
        .send()
        .expect(400);
    });

    it('should update profile successfully: /api/v1/auth/me (PATCH)', async () => {
      const newUserNewName = Date.now();
      const newUserNewPassword = 'new-secret';
      const newUserApiToken = await request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .then(({ headers }) => headers['set-cookie'][0]);

      await request(app)
        .patch('/api/v1/auth/me')
        .set('Cookie', newUserApiToken)
        .send({
          firstName: newUserNewName,
          password: newUserNewPassword,
        })
        .expect(422);

      await request(app)
        .patch('/api/v1/auth/me')
        .set('Cookie', newUserApiToken)
        .send({
          firstName: newUserNewName,
          password: newUserNewPassword,
          oldPassword: newUserPassword,
        })
        .expect(200);

      await request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserNewPassword })
        .expect(204)
        .expect(({ headers }) => {
          expect(headers['set-cookie'].length).toEqual(3);
        });
      await request(app)
        .patch('/api/v1/auth/me')
        .set('Cookie', newUserApiToken)
        .send({ password: newUserPassword, oldPassword: newUserNewPassword })
        .expect(200);
    });

    it('should delete profile successfully: /api/v1/auth/me (DELETE)', async () => {
      const newUserApiToken = await request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .then(({ headers }) => headers['set-cookie'][0]);

      await request(app)
        .delete('/api/v1/auth/me')
        .set('Cookie', newUserApiToken);

      return request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .expect(404);
    });
  });
});
