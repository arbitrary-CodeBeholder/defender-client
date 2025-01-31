// Adapted from https://gist.githubusercontent.com/efimk-lu/b48fa118bd29a35fc1767fe749fa3372/raw/0662fee3eb5c65172fdf85c4bdfcb96eabce5e21/authentication-example.js

// https://github.com/aws-amplify/amplify-js/issues/7098
// fix for amazon-cognito-identity
global.crypto = require('crypto');

import { AuthenticationDetails, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';

// https://github.com/node-fetch/node-fetch/issues/450#issuecomment-387045223
// in order to support:
// commonjs code without bundling i.e. node app.js
// commonjs code with webpack bundling
// eslint-disable-next-line @typescript-eslint/no-var-requires
global.fetch = require('node-fetch').default;

export type UserPass = { Username: string; Password: string };
export type PoolData = { UserPoolId: string; ClientId: string };

export async function authenticate(authenticationData: UserPass, poolData: PoolData): Promise<string> {
  const authenticationDetails = new AuthenticationDetails(authenticationData);
  const userPool = new CognitoUserPool(poolData);
  const userData = { Username: authenticationData.Username, Pool: userPool };
  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (session) {
        const token = session.getAccessToken().getJwtToken();
        resolve(token);
      },
      onFailure: function (err) {
        console.error(`Failed to get a token for the API key ${authenticationData.Username}`, err);
        reject(err);
      },
    });
  });
}
