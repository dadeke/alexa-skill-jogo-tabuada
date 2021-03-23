const Alexa = require('ask-sdk-core');

const { speaks } = require('../speakStrings');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
    );
  },
  async handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes() || {};
    const persistentAttributes =
      (await attributesManager.getPersistentAttributes()) || {};

    const questionCount = Object.prototype.hasOwnProperty.call(
      persistentAttributes,
      'question_count',
    )
      ? persistentAttributes.question_count
      : false;

    if (
      questionCount !== false &&
      questionCount < process.env.QTY_CALCULATIONS
    ) {
      sessionAttributes.last_intent = 'LaunchRequest';
      sessionAttributes.question_count = questionCount;
      sessionAttributes.first_player = persistentAttributes.first_player;
      sessionAttributes.second_player = persistentAttributes.second_player;
      sessionAttributes.current_player = persistentAttributes.current_player;
      sessionAttributes.player1_right_answers =
        persistentAttributes.player1_right_answers;
      sessionAttributes.player1_wrong_answers =
        persistentAttributes.player1_wrong_answers;
      sessionAttributes.player2_right_answers =
        persistentAttributes.player2_right_answers;
      sessionAttributes.player2_wrong_answers =
        persistentAttributes.player2_wrong_answers;
      sessionAttributes.multiplicand = persistentAttributes.multiplicand;
      sessionAttributes.multiplier = persistentAttributes.multiplier;
      attributesManager.setSessionAttributes(sessionAttributes);

      const speakOutput = speaks.WELCOME_BACK + speaks.ASK_RESUME_GAME;

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .withSimpleCard(speaks.SKILL_NAME, speakOutput)
        .reprompt(speaks.ASK_RESUME_GAME)
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak(speaks.WELCOME)
      .withSimpleCard(speaks.SKILL_NAME, speaks.WELCOME_CARD)
      .reprompt(speaks.WELCOME)
      .getResponse();
  },
};

module.exports = LaunchRequestHandler;
