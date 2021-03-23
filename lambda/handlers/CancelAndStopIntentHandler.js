const Alexa = require('ask-sdk-core');

const { speaks } = require('../speakStrings');

const StartGameIntentHandler = require('./StartGameIntentHandler');

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        'AMAZON.CancelIntent' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          'AMAZON.StopIntent')
    );
  },
  async handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes() || {};

    const lastIntent = Object.prototype.hasOwnProperty.call(
      sessionAttributes,
      'last_intent',
    )
      ? sessionAttributes.last_intent
      : false;

    // Define para criar uma nova partida.
    if (lastIntent === 'LaunchRequest') {
      attributesManager.setSessionAttributes({
        last_intent: 'AMAZON.StopIntent',
        question_count: false,
      });

      const response = await StartGameIntentHandler.handle(handlerInput);
      return response;
    }

    return handlerInput.responseBuilder
      .speak(speaks.ALL_RIGHT)
      .withSimpleCard(speaks.SKILL_NAME, speaks.ALL_RIGHT)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = CancelAndStopIntentHandler;
