import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import config from '../../config/config';
import { AuthTokensResponse } from '../../types/response';

const generateToken = (
  userId: number,
  expires: Moment,
  secret = config.jwt.secret
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
  };

  return jwt.sign(payload, secret);
};

const generateAuthTokens = async (user: { id: number }): Promise<AuthTokensResponse> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    }
  };
};

export default {
  generateToken,
  generateAuthTokens
};
