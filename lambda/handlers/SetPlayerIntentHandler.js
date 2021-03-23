const Alexa = require('ask-sdk-core');

const Util = require('../util');
const { speaks, b200ms } = require('../speakStrings');

const SetAnswerIntentHandler = require('./SetAnswerIntentHandler');
const HelpIntentHandler = require('./HelpIntentHandler');
const NoUnderstand = require('../responses/NoUnderstandResponse');

const SetPlayerIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetPlayer'
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

      // Verifica se o jogo já está rodando.
      if (lastIntent === false && questionCount !== false) {
        //
        // Início - Solução temporária
        //
        // Identifica o "synco" como sendo a resposta "5".
        const playerName = Alexa.getSlotValue(
          handlerInput.requestEnvelope,
          'player_name',
        );

        if (playerName === 'synco') {
          const customHandlerInput = handlerInput;
          customHandlerInput.requestEnvelope.request.intent.slots.answer = {
            value: '5',
          };

          const response = await SetAnswerIntentHandler.handle(
            customHandlerInput,
          );
          return response;
        }

        // Identifica o "sem" ou "shem" como sendo a resposta "100".
        if (playerName === 'sem' || playerName === 'shem') {
          const customHandlerInput = handlerInput;
          customHandlerInput.requestEnvelope.request.intent.slots.answer = {
            value: '100',
          };

          const response = await SetAnswerIntentHandler.handle(
            customHandlerInput,
          );
          return response;
        }
        //
        // Fim - Solução temporária
        //

        throw new Error(
          'The game is already running. Do not enter here at this time.',
        );
      }

      // Testar se passou pela intenção StartGame.
      // Caso negativo, redirecionar para as instruções.
      if (lastIntent !== 'StartGame') {
        const response = await HelpIntentHandler.handle(handlerInput);

        return response;
      }

      //
      // Caso o nome do primeiro jogador não esteja definido:
      // define o nome do primeiro jogador e pergunta o nome do segundo jogador.
      // Caso o nome do primeiro jogador já esteja definido:
      // define o nome do segundo jogador e inicia o jogo.
      //
      if (firstPlayer === false) {
        sessionAttributes.first_player = Alexa.getSlotValue(
          handlerInput.requestEnvelope,
          'player_name',
        );
        // Continuar no StartGame a fim de não entrar numa repetição.
        sessionAttributes.last_intent = 'StartGame';
        attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder
          .speak(speaks.ASK_PLAYER_NAME2)
          .withSimpleCard(speaks.SKILL_NAME, speaks.ASK_PLAYER_NAME2)
          .reprompt(
            speaks.SORRY_NOT_UNDERSTAND +
              speaks.REPEAT_PLEASE +
              speaks.ASK_PLAYER_NAME2,
          )
          .getResponse();
      }
      sessionAttributes.second_player = Alexa.getSlotValue(
        handlerInput.requestEnvelope,
        'player_name',
      );

      // Salva o nome do primeiro jogador como jogador atual.
      sessionAttributes.current_player = sessionAttributes.first_player;

      // Inicializa a tabela de resultados.
      sessionAttributes.player1_right_answers = 0;
      sessionAttributes.player1_wrong_answers = 0;
      sessionAttributes.player2_right_answers = 0;
      sessionAttributes.player2_wrong_answers = 0;

      const multiplicand = Util.getNumberRand();
      const multiplier = Util.getNumberRand();

      // Salva o multiplicando e o multiplicador da questão atual.
      sessionAttributes.multiplicand = multiplicand;
      sessionAttributes.multiplier = multiplier;

      // Inicializa o contador de questões realizadas.
      sessionAttributes.question_count = 1;

      // Inicializa o número de tentativas.
      sessionAttributes.number_attempts = 0;

      attributesManager.setPersistentAttributes(sessionAttributes);
      await attributesManager.savePersistentAttributes();

      sessionAttributes.last_intent = false;
      attributesManager.setSessionAttributes(sessionAttributes);

      const speakMultiplication =
        b200ms +
        speaks.ASK_MULTIPLICATION.format(
          sessionAttributes.first_player,
          multiplicand,
          multiplier,
        );

      let speakOutputCard =
        speaks.FIRST_PLAYER + speaks.ASK_MULTIPLICATION_CARD;
      speakOutputCard += `${multiplicand} * ${multiplier} = ?`;

      return handlerInput.responseBuilder
        .speak(
          speaks.INTRODUCE_START.format(
            sessionAttributes.first_player,
            sessionAttributes.second_player,
          ) + speakMultiplication,
        )
        .withSimpleCard(speaks.SKILL_NAME, speakOutputCard)
        .reprompt(
          speaks.SORRY_NOT_UNDERSTAND +
            speaks.REPEAT_PLEASE +
            speakMultiplication,
        )
        .getResponse();
    } catch (error) {
      const response = await NoUnderstand.getResponse(
        handlerInput,
        'SetPlayerIntentHandler',
        error,
      );

      return response;
    }
  },
};

module.exports = SetPlayerIntentHandler;
