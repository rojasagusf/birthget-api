import * as realJWT from 'jsonwebtoken';
import mockery from 'mockery';
mockery.enable({warnOnUnregistered: false});
import jsonwebtokenMock from '../mocks/jsonwebtoken-mock';
const mockJWT = jsonwebtokenMock(realJWT);
mockery.registerMock('jsonwebtoken', mockJWT);
