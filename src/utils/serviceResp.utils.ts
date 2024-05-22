const makeServiceSuccess = (requestId, name, payload) => {
  console.log(`${requestId} - ${name}: SUCCESSFUL`);
  return {
    result: 'success',
    payload,
  };
};

const makeServiceFailure = (requestId, name, errorName, errorMessage) => {
  console.log(`${requestId} - ${name}: ERROR ${errorName} ${errorMessage}`);

  return {
    result: 'failure',
    payload: null,
    errorMessage,
  };
};
