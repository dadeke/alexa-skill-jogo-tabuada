const Alexa = require('ask-sdk-core');

const SetAnswerIntentHandler = require('../../lambda/handlers/SetAnswerIntentHandler');
const Util = require('../../lambda/util');
const { speaks, b200ms, cardLineBreak } = require('../../lambda/speakStrings');

// Define a quantidade total de questões. Deve ser sempre um número par.
process.env.QTY_CALCULATIONS = 20;

describe('Sequence 04. Test scenario: SetAnswer', () => {
  const setPersistentAttributes = jest.fn();
  const savePersistentAttributes = jest.fn();
  const mockGetNumberRand = jest.fn();
  Util.getNumberRand = mockGetNumberRand;

  const handlerInput = {
    attributesManager: {
      getSessionAttributes: () => ({}),
      setSessionAttributes: () => ({}),
      setPersistentAttributes,
      savePersistentAttributes,
    },
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'SetAnswer',
          slots: undefined,
        },
      },
      context: {
        System: {},
      },
    },
    responseBuilder: Alexa.ResponseFactory.init(),
  };
  const testResponseBuilder = Alexa.ResponseFactory.init();

  const calculations = process.env.QTY_CALCULATIONS / 2;

  beforeEach(() => {
    handlerInput.attributesManager.getSessionAttributes = () => ({});
    handlerInput.attributesManager.setSessionAttributes = () => ({});
    handlerInput.requestEnvelope.request.intent.name = 'SetAnswer';
    handlerInput.requestEnvelope.request.intent.slots = undefined;
  });

  it('should be able can not handle SetAnswer if intent name is diferent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AnotherIntent';

    expect(SetAnswerIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able can return response without StartGame', async () => {
    const outputSpeech = testResponseBuilder
      .speak(speaks.INSTRUCTIONS.format(calculations))
      .withSimpleCard(
        speaks.SKILL_NAME,
        speaks.INSTRUCTIONS_CARD.format(calculations),
      )
      .reprompt(speaks.ASK_START)
      .getResponse();

    const response = await SetAnswerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response coming from AMAZON.HelpIntent', async () => {
    handlerInput.attributesManager.getSessionAttributes = () => ({
      last_intent: 'AMAZON.HelpIntent',
      question_count: false,
    });

    const outputSpeech = testResponseBuilder
      .speak(speaks.INSTRUCTIONS.format(calculations))
      .withSimpleCard(
        speaks.SKILL_NAME,
        speaks.INSTRUCTIONS_CARD.format(calculations),
      )
      .reprompt(speaks.ASK_START)
      .getResponse();

    const response = await SetAnswerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response when first player is current player with resume game', async () => {
    const currentPlayer = 'John';
    const multiplicand = 5;
    const multiplier = 3;
    const sessionAttributes = {
      last_intent: 'ResumeGame',
      question_count: 4,
      first_player: currentPlayer,
      second_player: 'Mark',
      current_player: currentPlayer,
      player1_right_answers: 2,
      player1_wrong_answers: 0,
      player2_right_answers: 2,
      player2_wrong_answers: 0,
      multiplicand,
      multiplier,
    };

    handlerInput.attributesManager.getSessionAttributes = () =>
      sessionAttributes;

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.RESUME_GAME +
          b200ms +
          speaks.ASK_MULTIPLICATION.format(
            currentPlayer,
            multiplicand,
            multiplier,
          ),
      )
      .withSimpleCard(
        speaks.SKILL_NAME,
        `${
          speaks.RESUME_GAME +
          cardLineBreak +
          speaks.FIRST_PLAYER +
          speaks.ASK_MULTIPLICATION_CARD
        }${multiplicand} * ${multiplier} = ?`,
      )
      .reprompt(
        speaks.RESUME_GAME +
          b200ms +
          speaks.ASK_MULTIPLICATION.format(
            currentPlayer,
            multiplicand,
            multiplier,
          ),
      )
      .getResponse();

    const response = await SetAnswerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response with resume game', async () => {
    const currentPlayer = 'Mark';
    const multiplicand = 5;
    const multiplier = 3;
    const sessionAttributes = {
      last_intent: 'ResumeGame',
      question_count: 3,
      first_player: 'John',
      second_player: currentPlayer,
      current_player: currentPlayer,
      player1_right_answers: 2,
      player1_wrong_answers: 0,
      player2_right_answers: 1,
      player2_wrong_answers: 0,
      multiplicand,
      multiplier,
    };

    handlerInput.attributesManager.getSessionAttributes = () =>
      sessionAttributes;

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.RESUME_GAME +
          b200ms +
          speaks.ASK_MULTIPLICATION.format(
            currentPlayer,
            multiplicand,
            multiplier,
          ),
      )
      .withSimpleCard(
        speaks.SKILL_NAME,
        `${
          speaks.RESUME_GAME +
          cardLineBreak +
          speaks.SECOND_PLAYER +
          speaks.ASK_MULTIPLICATION_CARD
        }${multiplicand} * ${multiplier} = ?`,
      )
      .reprompt(
        speaks.RESUME_GAME +
          b200ms +
          speaks.ASK_MULTIPLICATION.format(
            currentPlayer,
            multiplicand,
            multiplier,
          ),
      )
      .getResponse();

    const response = await SetAnswerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response when first player is current player', async () => {
    const currentPlayer = 'John';
    const multiplicand = 5;
    const multiplier = 3;
    const product = 15;
    const sessionAttributes = {
      question_count: 4,
      first_player: currentPlayer,
      second_player: 'Mark',
      current_player: currentPlayer,
      player1_right_answers: 2,
      player1_wrong_answers: 0,
      player2_right_answers: 2,
      player2_wrong_answers: 0,
      multiplicand,
      multiplier,
    };

    handlerInput.attributesManager.getSessionAttributes = () =>
      sessionAttributes;
    handlerInput.requestEnvelope.request.intent.slots = {
      answer: {
        value: product,
      },
    };

    const newMultiplicand = 6;
    const newMultiplier = 6;
    mockGetNumberRand.mockReturnValue(6);

    const speakMultiplication =
      b200ms +
      speaks.ASK_MULTIPLICATION.format(
        sessionAttributes.second_player,
        newMultiplicand,
        newMultiplier,
      );

    const outputSpeech = testResponseBuilder
      .speak(speaks.RIGHT_ANSWER + speakMultiplication)
      .withSimpleCard(
        speaks.SKILL_NAME,
        `${speaks.FIRST_PLAYER + speaks.RIGHT_ANSWER}${cardLineBreak}${
          speaks.SECOND_PLAYER + speaks.ASK_MULTIPLICATION_CARD
        }${newMultiplicand} * ${newMultiplier} = ?`,
      )
      .reprompt(
        speaks.SORRY_NOT_UNDERSTAND +
          speaks.REPEAT_PLEASE +
          speakMultiplication,
      )
      .getResponse();

    const response = await SetAnswerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response when first player is current player with wrong answer', async () => {
    const currentPlayer = 'John';
    const multiplicand = 5;
    const multiplier = 3;
    const product = 15;
    const sessionAttributes = {
      question_count: 4,
      first_player: currentPlayer,
      second_player: 'Mark',
      current_player: currentPlayer,
      player1_right_answers: 2,
      player1_wrong_answers: 0,
      player2_right_answers: 2,
      player2_wrong_answers: 0,
      multiplicand,
      multiplier,
    };

    handlerInput.attributesManager.getSessionAttributes = () =>
      sessionAttributes;
    handlerInput.requestEnvelope.request.intent.slots = {
      answer: {
        value: 20,
      },
    };

    const newMultiplicand = 6;
    const newMultiplier = 6;
    mockGetNumberRand.mockReturnValue(6);

    const speakMultiplication =
      b200ms +
      speaks.ASK_MULTIPLICATION.format(
        sessionAttributes.second_player,
        newMultiplicand,
        newMultiplier,
      );

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.WRONG_ANSWER.format(multiplicand, multiplier, product) +
          speakMultiplication,
      )
      .withSimpleCard(
        speaks.SKILL_NAME,
        `${
          speaks.FIRST_PLAYER + speaks.WRONG_ANSWER_CARD
        } ${multiplicand} * ${multiplier} = ${product} ${cardLineBreak}${
          speaks.SECOND_PLAYER + speaks.ASK_MULTIPLICATION_CARD
        }${newMultiplicand} * ${newMultiplier} = ?`,
      )
      .reprompt(
        speaks.SORRY_NOT_UNDERSTAND +
          speaks.REPEAT_PLEASE +
          speakMultiplication,
      )
      .getResponse();

    const response = await SetAnswerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response with wrong answer', async () => {
    const currentPlayer = 'Mark';
    const multiplicand = 5;
    const multiplier = 3;
    const product = 15;
    const sessionAttributes = {
      question_count: 3,
      first_player: 'John',
      second_player: currentPlayer,
      current_player: currentPlayer,
      player1_right_answers: 2,
      player1_wrong_answers: 0,
      player2_right_answers: 1,
      player2_wrong_answers: 0,
      multiplicand,
      multiplier,
    };

    handlerInput.attributesManager.getSessionAttributes = () =>
      sessionAttributes;
    handlerInput.requestEnvelope.request.intent.slots = {
      answer: {
        value: 20,
      },
    };

    const newMultiplicand = 6;
    const newMultiplier = 6;
    mockGetNumberRand.mockReturnValue(6);

    const speakMultiplication =
      b200ms +
      speaks.ASK_MULTIPLICATION.format(
        sessionAttributes.first_player,
        newMultiplicand,
        newMultiplier,
      );

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.WRONG_ANSWER.format(multiplicand, multiplier, product) +
          speakMultiplication,
      )
      .withSimpleCard(
        speaks.SKILL_NAME,
        `${
          speaks.SECOND_PLAYER + speaks.WRONG_ANSWER_CARD
        } ${multiplicand} * ${multiplier} = ${product} ${cardLineBreak}${
          speaks.FIRST_PLAYER + speaks.ASK_MULTIPLICATION_CARD
        }${newMultiplicand} * ${newMultiplier} = ?`,
      )
      .reprompt(
        speaks.SORRY_NOT_UNDERSTAND +
          speaks.REPEAT_PLEASE +
          speakMultiplication,
      )
      .getResponse();

    const response = await SetAnswerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response when end game and first player wrong one', async () => {
    const currentPlayer = 'Mark';
    const multiplicand = 5;
    const multiplier = 3;
    const product = 15;
    const sessionAttributes = {
      question_count: 20,
      first_player: 'John',
      second_player: currentPlayer,
      current_player: currentPlayer,
      player1_right_answers: 9,
      player1_wrong_answers: 1,
      player2_right_answers: 10,
      player2_wrong_answers: 0,
      multiplicand,
      multiplier,
    };

    handlerInput.attributesManager.getSessionAttributes = () =>
      sessionAttributes;
    handlerInput.requestEnvelope.request.intent.slots = {
      answer: {
        value: product,
      },
    };

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.RIGHT_ANSWER +
          b200ms +
          speaks.END_RESULT +
          speaks.END_RESULT_WRONG.format(
            sessionAttributes.first_player,
            sessionAttributes.player1_right_answers,
            sessionAttributes.player1_wrong_answers,
          ) +
          b200ms +
          speaks.END_RESULT_ALL_RIGHT.format(sessionAttributes.second_player) +
          speaks.END_WINNER.format(sessionAttributes.second_player),
      )
      .withSimpleCard(
        speaks.SKILL_NAME,
        speaks.END_RESULT +
          cardLineBreak +
          speaks.END_RESULT_WRONG_CARD.format(
            speaks.END_RESULT_FIRST_PLAYER,
            sessionAttributes.player1_right_answers,
            sessionAttributes.player1_wrong_answers,
          ) +
          cardLineBreak +
          speaks.END_RESULT_ALL_RIGHT_CARD.format(
            speaks.END_RESULT_SECOND_PLAYER,
          ) +
          cardLineBreak +
          speaks.END_WINNER_CARD.format(speaks.END_RESULT_SECOND_PLAYER),
      )
      .withShouldEndSession(true)
      .getResponse();

    const response = await SetAnswerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response when end game and second player wrong one', async () => {
    const currentPlayer = 'Mark';
    const multiplicand = 5;
    const multiplier = 3;
    const product = 15;
    const sessionAttributes = {
      question_count: 20,
      first_player: 'John',
      second_player: currentPlayer,
      current_player: currentPlayer,
      player1_right_answers: 10,
      player1_wrong_answers: 0,
      player2_right_answers: 8,
      player2_wrong_answers: 1,
      multiplicand,
      multiplier,
    };

    handlerInput.attributesManager.getSessionAttributes = () =>
      sessionAttributes;
    handlerInput.requestEnvelope.request.intent.slots = {
      answer: {
        value: product,
      },
    };

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.RIGHT_ANSWER +
          b200ms +
          speaks.END_RESULT +
          speaks.END_RESULT_ALL_RIGHT.format(sessionAttributes.first_player) +
          b200ms +
          speaks.END_RESULT_WRONG.format(
            sessionAttributes.second_player,
            sessionAttributes.player2_right_answers + 1,
            sessionAttributes.player2_wrong_answers,
          ) +
          speaks.END_WINNER.format(sessionAttributes.first_player),
      )
      .withSimpleCard(
        speaks.SKILL_NAME,
        speaks.END_RESULT +
          cardLineBreak +
          speaks.END_RESULT_ALL_RIGHT_CARD.format(
            speaks.END_RESULT_FIRST_PLAYER,
          ) +
          cardLineBreak +
          speaks.END_RESULT_WRONG_CARD.format(
            speaks.END_RESULT_SECOND_PLAYER,
            sessionAttributes.player2_right_answers + 1,
            sessionAttributes.player2_wrong_answers,
          ) +
          cardLineBreak +
          speaks.END_WINNER_CARD.format(speaks.END_RESULT_FIRST_PLAYER),
      )
      .withShouldEndSession(true)
      .getResponse();

    const response = await SetAnswerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response when end game with wrong draw', async () => {
    const currentPlayer = 'Mark';
    const multiplicand = 5;
    const multiplier = 3;
    const product = 15;
    const sessionAttributes = {
      question_count: 20,
      first_player: 'John',
      second_player: currentPlayer,
      current_player: currentPlayer,
      player1_right_answers: 9,
      player1_wrong_answers: 1,
      player2_right_answers: 8,
      player2_wrong_answers: 1,
      multiplicand,
      multiplier,
    };

    handlerInput.attributesManager.getSessionAttributes = () =>
      sessionAttributes;
    handlerInput.requestEnvelope.request.intent.slots = {
      answer: {
        value: product,
      },
    };

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.RIGHT_ANSWER +
          b200ms +
          speaks.END_RESULT +
          speaks.END_RESULT_WRONG.format(
            sessionAttributes.first_player,
            sessionAttributes.player1_right_answers,
            sessionAttributes.player1_wrong_answers,
          ) +
          b200ms +
          speaks.END_RESULT_WRONG.format(
            sessionAttributes.second_player,
            sessionAttributes.player2_right_answers + 1,
            sessionAttributes.player2_wrong_answers,
          ) +
          speaks.END_DRAW,
      )
      .withSimpleCard(
        speaks.SKILL_NAME,
        speaks.END_RESULT +
          cardLineBreak +
          speaks.END_RESULT_WRONG_CARD.format(
            speaks.END_RESULT_FIRST_PLAYER,
            sessionAttributes.player1_right_answers,
            sessionAttributes.player1_wrong_answers,
          ) +
          cardLineBreak +
          speaks.END_RESULT_WRONG_CARD.format(
            speaks.END_RESULT_SECOND_PLAYER,
            sessionAttributes.player2_right_answers + 1,
            sessionAttributes.player2_wrong_answers,
          ) +
          cardLineBreak +
          speaks.END_DRAW_CARD,
      )
      .withShouldEndSession(true)
      .getResponse();

    const response = await SetAnswerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response when end game', async () => {
    const currentPlayer = 'Mark';
    const multiplicand = 5;
    const multiplier = 3;
    const product = 15;
    const sessionAttributes = {
      question_count: 20,
      first_player: 'John',
      second_player: currentPlayer,
      current_player: currentPlayer,
      player1_right_answers: 10,
      player1_wrong_answers: 0,
      player2_right_answers: 9,
      player2_wrong_answers: 0,
      multiplicand,
      multiplier,
    };

    handlerInput.attributesManager.getSessionAttributes = () =>
      sessionAttributes;
    handlerInput.requestEnvelope.request.intent.slots = {
      answer: {
        value: product,
      },
    };

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.RIGHT_ANSWER +
          b200ms +
          speaks.END_RESULT +
          speaks.END_RESULT_ALL_RIGHT.format(sessionAttributes.first_player) +
          b200ms +
          speaks.END_RESULT_ALL_RIGHT.format(sessionAttributes.second_player) +
          speaks.END_DRAW_ALL_RIGHT,
      )
      .withSimpleCard(
        speaks.SKILL_NAME,
        speaks.END_RESULT +
          cardLineBreak +
          speaks.END_RESULT_ALL_RIGHT_CARD.format(
            speaks.END_RESULT_FIRST_PLAYER,
          ) +
          cardLineBreak +
          speaks.END_RESULT_ALL_RIGHT_CARD.format(
            speaks.END_RESULT_SECOND_PLAYER,
          ) +
          cardLineBreak +
          speaks.END_DRAW_ALL_RIGHT_CARD,
      )
      .withShouldEndSession(true)
      .getResponse();

    const response = await SetAnswerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response', async () => {
    const currentPlayer = 'Mark';
    const multiplicand = 5;
    const multiplier = 3;
    const product = 15;
    const sessionAttributes = {
      question_count: 3,
      first_player: 'John',
      second_player: currentPlayer,
      current_player: currentPlayer,
      player1_right_answers: 2,
      player1_wrong_answers: 0,
      player2_right_answers: 1,
      player2_wrong_answers: 0,
      multiplicand,
      multiplier,
    };

    handlerInput.attributesManager.getSessionAttributes = () =>
      sessionAttributes;
    handlerInput.requestEnvelope.request.intent.slots = {
      answer: {
        value: product,
      },
    };

    const newMultiplicand = 6;
    const newMultiplier = 6;
    mockGetNumberRand.mockReturnValue(6);

    const speakMultiplication =
      b200ms +
      speaks.ASK_MULTIPLICATION.format(
        sessionAttributes.first_player,
        newMultiplicand,
        newMultiplier,
      );

    const outputSpeech = testResponseBuilder
      .speak(speaks.RIGHT_ANSWER + speakMultiplication)
      .withSimpleCard(
        speaks.SKILL_NAME,
        `${speaks.SECOND_PLAYER + speaks.RIGHT_ANSWER}${cardLineBreak}${
          speaks.FIRST_PLAYER + speaks.ASK_MULTIPLICATION_CARD
        }${newMultiplicand} * ${newMultiplier} = ?`,
      )
      .reprompt(
        speaks.SORRY_NOT_UNDERSTAND +
          speaks.REPEAT_PLEASE +
          speakMultiplication,
      )
      .getResponse();

    const response = await SetAnswerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });
});
