const NoUnderstand = require('../responses/NoUnderstandResponse');

const ErrorHandler = {
  canHandle() {
    return true;
  },
  async handle(handlerInput, error) {
    const response = await NoUnderstand.getResponse(
      handlerInput,
      'ErrorHandler',
      error,
    );

    return response;
  },
};

module.exports = ErrorHandler;
