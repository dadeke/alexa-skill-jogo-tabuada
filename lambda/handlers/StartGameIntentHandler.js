const Alexa = require('ask-sdk-core');

const { speaks, b200ms, cardLineBreak } = require('../speakStrings');

const SetAnswerIntentHandler = require('./SetAnswerIntentHandler');
const NoUnderstand = require('../responses/NoUnderstandResponse');

const StartGameIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'StartGame'
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
      const firstPlayer = Object.prototype.hasOwnProperty.call(
        sessionAttributes,
        'first_player',
      )
        ? sessionAttributes.first_player
        : false;

      // Continuar a partida anterior.
      if (lastIntent === 'LaunchRequest' && questionCount !== false) {
        sessionAttributes.last_intent = 'ResumeGame';
        attributesManager.setSessionAttributes(sessionAttributes);

        const response = await SetAnswerIntentHandler.handle(handlerInput);
        return response;
      }

      // Verifica se o jogo já está rodando.
      if (questionCount !== false) {
        throw new Error(
          'The game is already running. Do not enter here at this time.',
        );
      }

      attributesManager.setSessionAttributes({
        last_intent: 'StartGame',
        question_count: false,
      });

      // Criar uma nova partida.
      let speakOutput = speaks.ASK_PLAYER_NAME1;
      let speakOutputCard = speaks.ASK_PLAYER_NAME1;
      if (lastIntent === 'AMAZON.StopIntent') {
        // Limpar os dados da persistência.
        attributesManager.setPersistentAttributes({});
        await attributesManager.savePersistentAttributes();

        speakOutput = speaks.NEW_GAME + b200ms + speaks.ASK_PLAYER_NAME1;
        speakOutputCard =
          speaks.NEW_GAME + cardLineBreak + speaks.ASK_PLAYER_NAME1;
      }

      // Pergunta o nome do primeiro jogador.
      if (firstPlayer === false) {
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withSimpleCard(speaks.SKILL_NAME, speakOutputCard)
          .reprompt(
            speaks.SORRY_NOT_UNDERSTAND +
              speaks.REPEAT_PLEASE +
              speaks.ASK_PLAYER_NAME1,
          )
          .getResponse();
      }

      // Pergunta o nome do segundo jogador.
      return handlerInput.responseBuilder
        .speak(speaks.ASK_PLAYER_NAME2)
        .withSimpleCard(speaks.SKILL_NAME, speaks.ASK_PLAYER_NAME2)
        .reprompt(
          speaks.SORRY_NOT_UNDERSTAND +
            speaks.REPEAT_PLEASE +
            speaks.ASK_PLAYER_NAME2,
        )
        .getResponse();
    } catch (error) {
      const response = await NoUnderstand.getResponse(
        handlerInput,
        'StartGameIntentHandler',
        error,
      );

      return response;
    }
  },
};

module.exports = StartGameIntentHandler;
