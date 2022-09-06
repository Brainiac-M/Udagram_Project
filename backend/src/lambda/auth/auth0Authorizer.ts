import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify} from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth');


// Todo
const jwksUrl = 'https://foxcoder508.us.auth0.com/.well-known/jwks.json';


export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {

  logger.info('Authorizing this user', event.authorizationToken)

  try {

    const jwtToken = await verifyToken(event.authorizationToken)

    logger.info('Authorization granted to user', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (err) {

    logger.error('Authorization NOT granted to user', { error: err.message })
    //display if user does not authorized
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  try {

    const token = getToken(authHeader) //uses what is returned as "Token" from the getToken function
    const res = await Axios.get(jwksUrl);

    // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
    const pemData = res['data']['keys'][0]['x5c'][0]
    const cert = `-----BEGIN CERTIFICATE-----\n${pemData}\n-----END CERTIFICATE-----`

    return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
  } catch(error){
    logger.error('Fail to authenticate user', error)
  }
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header provided')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header provided')

  const separateauthHeader = authHeader.split(' ')
  const token = separateauthHeader[1]  //fetch only the second item in the array

  return token
}

