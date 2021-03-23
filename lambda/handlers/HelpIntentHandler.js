const Alexa = require('ask-sdk-core');

const { speaks } = require('../speakStrings');

const NoUnderstand = require('../responses/NoUnderstandResponse');

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
    );
  },
  async handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    try {
      const lastIntent = Object.prototype.hasOwnProperty.call(
        sessionAttributes,
        'last_intent',
      )
        ? sessionAttributes.last_intent
        : false;
      const questionCount = Object.prototype.hasOwnProperty.call(
        sessionAttributes,
        'question_count',
      )
        ? sessionAttributes.question_count
        : false;

      // Verifica se o jogo já está rodando.
      if (lastIntent === false && questionCount !== false) {
        throw new Error(
          'The game is already running. Do not enter here at this time.',
        );
      }

      attributesManager.setSessionAttributes({
        last_intent: 'AMAZON.HelpIntent',
        question_count: false,
      });

      const calculations = process.env.QTY_CALCULATIONS / 2;

      return handlerInput.responseBuilder
        .speak(speaks.INSTRUCTIONS.format(calculations))
        .withSimpleCard(
          speaks.SKILL_NAME,
          speaks.INSTRUCTIONS_CARD.format(calculations),
        )
        .reprompt(speaks.ASK_START)
        .getResponse();
    } catch (error) {
      const response = await NoUnderstand.getResponse(
        handlerInput,
        'HelpIntentHandler',
        error,
      );

      return response;
    }
  },
};

module.exports = HelpIntentHandler;
