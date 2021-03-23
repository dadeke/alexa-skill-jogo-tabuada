const Alexa = require('ask-sdk-core');

const { speaks, cardLineBreak, b200ms } = require('../speakStrings');
const Util = require('../util');

const HelpIntentHandler = require('./HelpIntentHandler');

const SetAnswerIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetAnswer'
    );
  },
  async handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

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

    // Verifica se o jogo não foi iniciado.
    if (questionCount === false) {
      const response = await HelpIntentHandler.handle(handlerInput);

      return response;
    }

    // Verifica se é continuação de um jogo anterior.
    if (lastIntent === 'ResumeGame') {
      sessionAttributes.last_intent = false;
      attributesManager.setSessionAttributes(sessionAttributes);

      const speakMultiplication =
        speaks.RESUME_GAME +
        b200ms +
        speaks.ASK_MULTIPLICATION.format(
          sessionAttributes.current_player,
          sessionAttributes.multiplicand,
          sessionAttributes.multiplier,
        );
      let speakOutputCard = speaks.RESUME_GAME + cardLineBreak;

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
        .speak(speakMultiplication)
        .withSimpleCard(speaks.SKILL_NAME, speakOutputCard)
        .reprompt(speakMultiplication)
        .getResponse();
    }

    let nextPlayer = null;
    let answer = null;
    let product = null;
    let speakResult = null;
    let speakOutputCard = null;

    const multiplicand = Util.getNumberRand();
    const multiplier = Util.getNumberRand();

    // Verifica se a resposta da pergunta anterior está correta.
    answer = Alexa.getSlotValue(handlerInput.requestEnvelope, 'answer');
    product = sessionAttributes.multiplicand * sessionAttributes.multiplier;
    if (parseInt(answer, 10) === product) {
      speakResult = speaks.RIGHT_ANSWER;
    } else {
      speakResult = speaks.WRONG_ANSWER.format(
        sessionAttributes.multiplicand,
        sessionAttributes.multiplier,
        product.toString(),
      );
    }

    // Salva o resultado do jogador anterior e verifica o próximo jogador.
    if (sessionAttributes.first_player === sessionAttributes.current_player) {
      if (speakResult === speaks.RIGHT_ANSWER) {
        sessionAttributes.player1_right_answers += 1;
      } else {
        sessionAttributes.player1_wrong_answers += 1;
      }

      nextPlayer = sessionAttributes.second_player;
      sessionAttributes.current_player = sessionAttributes.second_player;
      speakOutputCard = speaks.FIRST_PLAYER;
    } else {
      if (speakResult === speaks.RIGHT_ANSWER) {
        sessionAttributes.player2_right_answers += 1;
      } else {
        sessionAttributes.player2_wrong_answers += 1;
      }

      nextPlayer = sessionAttributes.first_player;
      sessionAttributes.current_player = sessionAttributes.first_player;
      speakOutputCard = speaks.SECOND_PLAYER;
    }

    // Completa o card.
    if (speakResult === speaks.RIGHT_ANSWER) {
      speakOutputCard += speaks.RIGHT_ANSWER + cardLineBreak;
    } else {
      speakOutputCard +=
        `${speaks.WRONG_ANSWER_CARD} ` +
        `${sessionAttributes.multiplicand} * ` +
        `${sessionAttributes.multiplier} = ${product} ${cardLineBreak}`;
    }

    if (sessionAttributes.question_count >= process.env.QTY_CALCULATIONS) {
      // Fala os resultados de cada jogador.
      let speakFinal = speaks.END_RESULT;
      let speakFinalCard = speaks.END_RESULT + cardLineBreak;
      if (sessionAttributes.player1_wrong_answers === 0) {
        speakFinal += speaks.END_RESULT_ALL_RIGHT.format(
          sessionAttributes.first_player,
        );
        speakFinalCard += speaks.END_RESULT_ALL_RIGHT_CARD.format(
          speaks.END_RESULT_FIRST_PLAYER,
        );
      } else {
        speakFinal += speaks.END_RESULT_WRONG.format(
          sessionAttributes.first_player,
          sessionAttributes.player1_right_answers,
          sessionAttributes.player1_wrong_answers,
        );
        speakFinalCard += speaks.END_RESULT_WRONG_CARD.format(
          speaks.END_RESULT_FIRST_PLAYER,
          sessionAttributes.player1_right_answers,
          sessionAttributes.player1_wrong_answers,
        );
      }

      speakFinal += b200ms;
      speakFinalCard += cardLineBreak;
      if (sessionAttributes.player2_wrong_answers === 0) {
        speakFinal += speaks.END_RESULT_ALL_RIGHT.format(
          sessionAttributes.second_player,
        );
        speakFinalCard += speaks.END_RESULT_ALL_RIGHT_CARD.format(
          speaks.END_RESULT_SECOND_PLAYER,
        );
      } else {
        speakFinal += speaks.END_RESULT_WRONG.format(
          sessionAttributes.second_player,
          sessionAttributes.player2_right_answers,
          sessionAttributes.player2_wrong_answers,
        );
        speakFinalCard += speaks.END_RESULT_WRONG_CARD.format(
          speaks.END_RESULT_SECOND_PLAYER,
          sessionAttributes.player2_right_answers,
          sessionAttributes.player2_wrong_answers,
        );
      }

      // Fala o resultado final para encerrar o jogo.
      speakFinalCard += cardLineBreak;
      if (
        sessionAttributes.player1_right_answers >
        sessionAttributes.player2_right_answers
      ) {
        speakFinal += speaks.END_WINNER.format(sessionAttributes.first_player);
        speakFinalCard += speaks.END_WINNER_CARD.format(
          speaks.END_RESULT_FIRST_PLAYER,
        );
      } else if (
        sessionAttributes.player1_right_answers <
        sessionAttributes.player2_right_answers
      ) {
        speakFinal += speaks.END_WINNER.format(sessionAttributes.second_player);
        speakFinalCard += speaks.END_WINNER_CARD.format(
          speaks.END_RESULT_SECOND_PLAYER,
        );
      } else if (
        sessionAttributes.player1_right_answers ===
          sessionAttributes.player2_right_answers &&
        parseInt(sessionAttributes.player1_right_answers, 10) ===
          process.env.QTY_CALCULATIONS / 2
      ) {
        speakFinal += speaks.END_DRAW_ALL_RIGHT;
        speakFinalCard += speaks.END_DRAW_ALL_RIGHT_CARD;
      } else {
        speakFinal += speaks.END_DRAW;
        speakFinalCard += speaks.END_DRAW_CARD;
      }

      attributesManager.setPersistentAttributes(sessionAttributes);
      await attributesManager.savePersistentAttributes();

      return handlerInput.responseBuilder
        .speak(speakResult + b200ms + speakFinal)
        .withSimpleCard(speaks.SKILL_NAME, speakFinalCard)
        .withShouldEndSession(true)
        .getResponse();
    }

    // Atualiza o contador de questões realizadas.
    sessionAttributes.question_count += 1;

    // Salva o multiplicando e o multiplicador da questão atual.
    sessionAttributes.multiplicand = multiplicand;
    sessionAttributes.multiplier = multiplier;

    attributesManager.setPersistentAttributes(sessionAttributes);
    await attributesManager.savePersistentAttributes();

    // Remover número de tentativas.
    sessionAttributes.number_attempts = undefined;
    attributesManager.setSessionAttributes(sessionAttributes);

    const speakMultiplication =
      b200ms +
      speaks.ASK_MULTIPLICATION.format(nextPlayer, multiplicand, multiplier);

    if (sessionAttributes.first_player === sessionAttributes.current_player) {
      speakOutputCard += speaks.FIRST_PLAYER;
    } else {
      speakOutputCard += speaks.SECOND_PLAYER;
    }
    speakOutputCard += speaks.ASK_MULTIPLICATION_CARD;
    speakOutputCard += `${multiplicand} * ${multiplier} = ?`;

    return handlerInput.responseBuilder
      .speak(speakResult + speakMultiplication)
      .withSimpleCard(speaks.SKILL_NAME, speakOutputCard)
      .reprompt(
        speaks.SORRY_NOT_UNDERSTAND +
          speaks.REPEAT_PLEASE +
          speakMultiplication,
      )
      .getResponse();
  },
};

module.exports = SetAnswerIntentHandler;
