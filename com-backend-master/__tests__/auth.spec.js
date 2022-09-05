const rp = require('request-promise');
const nock = require('nock');

const {
  PORT,
} = process.env;

const ROLE_MAP = {
  client: 'user',
  provider: 'salon',
};

const TWILIO_VERIFY_HOST = 'https://verify.twilio.com';

describe('Auth', () => {

  const unauthorized = {
    statusCode: 401,
    error: 'Unauthorized',
  };

  const request = ({
    path,
    number,
    code,
    fields,
    status = 'pending',
  }) => {
    nock(TWILIO_VERIFY_HOST)
      .post(/VerificationCheck$/)
      .reply(200, { status });
    nock(TWILIO_VERIFY_HOST)
      .post(/Verifications$/)
      .reply(200, { status });

    return rp({
      uri: `http://127.0.0.1:${PORT}/api/auth/${path}`,
      method: 'POST',
      body: {
        phoneNumber: {
          formatted: `+${number}`,
          nonFormatted: number,
        },
        code,
        ...fields,
      },
      json: true,
    });
  };

  function registerFlow (role, number, fields = {}) {
    /* Order matters! */
    it('1. should request register SMS code', async () => {
      await expect(request({
        path: `${role}/register/request-sms`,
        number,
      })).resolves.toMatchObject({
        status: 'OK',
      });
      nock.cleanAll();
    });

    it('2. should fail confirm register SMS with no code', async () => {
      await expect(request({
        path: `${role}/register/confirm-sms`,
        number,
      })).rejects.toMatchObject({
        statusCode: 422,
        error: { message: '"Code" is required'},
      });
      nock.cleanAll();
    });

    it('3. should fail confirm register SMS if not approved', async () => {
      const opts = {
        path: `${role}/register/confirm-sms`,
        number,
        fields,
        code: '123123',
        status: 'timeout',
      };
      await expect(request(opts)).rejects.toMatchObject({
        statusCode: 422,
        error: { message: 'Verification failed'},
      });
      nock.cleanAll();
    });

    it('4. should confirm register SMS', async () => {
      await expect(request({
        path: `${role}/register/confirm-sms`,
        number,
        fields,
        code: '123123',
        status: 'approved',
      })).resolves.toMatchObject({
        token: expect.any(String),
        [ROLE_MAP[role]]: {
          id: expect.any(String),
          ...fields,
          phoneNumber: {
            formatted: `+${number}`,
            nonFormatted: number,
          },
        },
      });
      nock.cleanAll();
    });

    it('5. should fail request register SMS code for existing user', async () => {
      await expect(request({
        path: `${role}/register/request-sms`,
        number,
        code: '123123',
        fields,
      })).rejects.toMatchObject({
        statusCode: 401,
        error: { message: 'Phone number already in use' },
      });
      nock.cleanAll();
    });

    it('6. should fail confirm register SMS code for existing user', async () => {
      await expect(request({
        path: `${role}/register/confirm-sms`,
        number,
        code: '123123',
        fields,
      })).rejects.toMatchObject({
        statusCode: 401,
        error: { message: 'Phone number already in use' },
      });
      nock.cleanAll();
    });

  }

  function loginFlow (role, number, fields = {}) {
    it('1. should fail confirm login SMS with no code', async () => {
      await expect(request({
        path: `${role}/login/confirm-sms`,
        number,
      })).rejects.toMatchObject({
        statusCode: 422,
        error: { message: '"Code" is required'},
      });
      nock.cleanAll();
    });

    it('2. should fail confirm login SMS if not approved', async () => {
      await expect(request({
        path: `${role}/login/confirm-sms`,
        number,
        code: '123123',
        status: 'timeout',
      })).rejects.toMatchObject({
        statusCode: 422,
        error: { message: 'Verification failed'},
      });
      nock.cleanAll();
    });

    it('3. should confirm login SMS', async () => {
      await expect(request({
        path: `${role}/login/confirm-sms`,
        number,
        code: '123123',
        status: 'approved',
      })).resolves.toMatchObject({
        token: expect.any(String),
        [ROLE_MAP[role]]: {
          id: expect.any(String),
          ...fields,
          phoneNumber: {
            formatted: `+${number}`,
            nonFormatted: number,
          },
        },
      });
      nock.cleanAll();
    });

    it('4. should fail request SMS code for non existing user', async () => {
      await expect(request({
        path: `${role}/login/request-sms`,
        number: '6505551234',
      })).rejects.toMatchObject({
        statusCode: 401,
        error: { message: 'Phone number you entered does not exist' },
      });
      nock.cleanAll();
    });
  }

  describe('Client', () => {
    describe('Register', () => {
      registerFlow('client', '16502570295', {
        firstName: 'Mock',
        lastName: 'Test',
      });
    });
    describe('Login', () => {
      loginFlow('client', '16502570295', {
        firstName: 'Mock',
        lastName: 'Test',
      });
    });
  });

  describe('Provider', () => {

    describe('Register', () => {
      registerFlow('provider', '16507773333', {
        salonName: 'SalonTest',
        ownerInformation: {
          ownerName: {
            firstName: 'Owner',
            lastName: 'Test',
          },
          ownerPhoneNumber: {
            formatted: '+16507778888',
            nonFormatted: '6507778888',
          },
        },
      });
    });

    describe('Login', () => {
      loginFlow('provider', '16507773333', {
        salonName: 'SalonTest',
      });
    });

    it('0. should fail confirm register SMS code for existing Salon name', async () => {
      await expect(request({
        path: `provider/register/confirm-sms`,
        number: '16503337777', // other number
        code: '123123',
        salonName: 'SalonTest', // but same Salon name
      })).rejects.toMatchObject({
        statusCode: 422,
        error: { message: '"Salon Name" is required' },
      });
      nock.cleanAll();
    });

  });

  describe('Hack', () => {
    it('should fail request unknonw role', async () => {
      await expect(request({
        path: `toString/register/request-sms`,
      })).rejects.toMatchObject(unauthorized);
      nock.cleanAll();
    });
  });
});
