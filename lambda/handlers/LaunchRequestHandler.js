const Alexa = require('ask-sdk-core');

const { speaks } = require('../speakStrings');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(speaks.BEM_VINDO)
      .reprompt(speaks.NAO_ENTENDI)
      .withSimpleCard(speaks.NOME_SKILL)
      .getResponse();
  },
};

module.exports = LaunchRequestHandler;
