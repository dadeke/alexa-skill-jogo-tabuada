const Util = require('../util');
const { speaks, b200ms, cardLineBreak } = require('../speakStrings');

const NoUnderstand = {
  async getResponse(handlerInput, handlerName, error) {
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    const questionCount = Object.prototype.hasOwnProperty.call(
      sessionAttributes,
      'question_count',
    )
      ? sessionAttributes.question_count
      : false;
    // For tests.
    // console.log('handlerName:', handlerName);
    // console.log('typeof questionCount:', typeof questionCount);
    // console.log('questionCount:', questionCount);

    // Verifica se o jogo já está rodando.
    if (questionCount !== false) {
      const numberAttempts = Object.prototype.hasOwnProperty.call(
        sessionAttributes,
        'number_attempts',
      )
        ? sessionAttributes.number_attempts
        : 0;

      sessionAttributes.number_attempts = numberAttempts + 1;
      attributesManager.setSessionAttributes(sessionAttributes);

      let speakRepeat = speaks.REPEAT_PLEASE;

      if (sessionAttributes.number_attempts === 2) {
        speakRepeat = speaks.REPEAT_MORE_TIME;
      } else if (sessionAttributes.number_attempts === 3) {
        // Trocar para um nova questão.
        sessionAttributes.number_attempts = 0;
        attributesManager.setSessionAttributes(sessionAttributes);

        speakRepeat = speaks.CHANGE_MULTIPLICATION;

        // Salva o multiplicando e o multiplicador da nova questão.
        sessionAttributes.multiplicand = Util.getNumberRand();
        sessionAttributes.multiplier = Util.getNumberRand();

        attributesManager.setPersistentAttributes(sessionAttributes);
        await attributesManager.savePersistentAttributes();
      }

      const speakOutput =
        speaks.SORRY_NOT_UNDERSTAND +
        speakRepeat +
        b200ms +
        speaks.ASK_MULTIPLICATION.format(
          sessionAttributes.current_player,
          sessionAttributes.multiplicand,
          sessionAttributes.multiplier,
        );

      let speakOutputCard =
        speaks.SORRY_NOT_UNDERSTAND + speakRepeat + cardLineBreak;
      if (sessionAttributes.first_player === sessionAttributes.current_player) {
        speakOutputCard += speaks.FIRST_PLAYER;
      } else {
        speakOutputCard += speaks.SECOND_PLAYER;
      }
      speakOutputCard += speaks.ASK_MULTIPLICATION_CARD;
      speakOutputCard +=
        `${sessionAttributes.multiplicand} * ` +
        `${sessionAttributes.multiplier} = ?`;

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .withSimpleCard(speaks.SKILL_NAME, speakOutputCard)
        .reprompt(speakOutput)
        .getResponse();
    }

    // eslint-disable-next-line no-console
    console.error('Error:', `${handlerName} - ${error}`);

    return handlerInput.responseBuilder
      .speak(speaks.PROBLEM)
      .withSimpleCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();
  },
};

module.exports = NoUnderstand;
