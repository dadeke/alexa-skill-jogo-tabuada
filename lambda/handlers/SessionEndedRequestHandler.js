const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    // eslint-disable-next-line no-console
    console.log(
      `Sessão encerrada com essa reação: ${handlerInput.requestEnvelope.request.reason}`,
    );

    return handlerInput.responseBuilder.getResponse();
  },
};

module.exports = SessionEndedRequestHandler;
