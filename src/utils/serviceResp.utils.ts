import { v4 as uuidv4 } from 'uuid';

export const makeServiceSuccess = (requestId, name, payload) => {
  console.log(`${requestId} - ${name}: SUCCESSFUL`);
  return {
    result: 'success',
    payload,
  };
};

export const makeServiceFailure = (
  requestId,
  name,
  errorName,
  errorMessage,
) => {
  console.log(`${requestId} - ${name}: ERROR ${errorName} ${errorMessage}`);

  return {
    result: 'failure',
    payload: null,
    errorMessage,
  };
};

export function generateRequestId(): string {
  return uuidv4();
}
