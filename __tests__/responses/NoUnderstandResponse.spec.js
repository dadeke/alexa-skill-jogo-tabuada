const Alexa = require('ask-sdk-core');

const NoUnderstandResponse = require('../../lambda/responses/NoUnderstandResponse');
const Util = require('../../lambda/util');
const { speaks, b200ms, cardLineBreak } = require('../../lambda/speakStrings');

describe('Test NoUnderstandResponse', () => {
  const setPersistentAttributes = jest.fn();
  const savePersistentAttributes = jest.fn();
  const mockGetNumberRand = jest.fn();
  // eslint-disable-next-line no-console
  console.error = jest.fn();
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

  it('should be able can return response without StartGame', async () => {
    const outputSpeech = testResponseBuilder
      .speak(speaks.PROBLEM)
      .withSimpleCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await NoUnderstandResponse.getResponse(
      handlerInput,
      'SetAnswerIntentHandler',
      new Error('Test Error'),
    );

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response when first player is current player', async () => {
    const currentPlayer = 'John';
    const multiplicand = 5;
    const multiplier = 3;
    const sessionAttributes = {
      question_count: 3,
      first_player: currentPlayer,
      second_player: 'Mark',
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

    const speakOutput =
      speaks.SORRY_NOT_UNDERSTAND +
      speaks.REPEAT_PLEASE +
      b200ms +
      speaks.ASK_MULTIPLICATION.format(currentPlayer, multiplicand, multiplier);

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withSimpleCard(
        speaks.SKILL_NAME,
        `${speaks.SORRY_NOT_UNDERSTAND + speaks.REPEAT_PLEASE}${cardLineBreak}${
          speaks.FIRST_PLAYER + speaks.ASK_MULTIPLICATION_CARD
        }${multiplicand} * ${multiplier} = ?`,
      )
      .reprompt(speakOutput)
      .getResponse();

    const response = await NoUnderstandResponse.getResponse(
      handlerInput,
      'SetAnswerIntentHandler',
      new Error('Test Error'),
    );

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response', async () => {
    const currentPlayer = 'Mark';
    const multiplicand = 5;
    const multiplier = 3;
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

    const speakOutput =
      speaks.SORRY_NOT_UNDERSTAND +
      speaks.REPEAT_PLEASE +
      b200ms +
      speaks.ASK_MULTIPLICATION.format(currentPlayer, multiplicand, multiplier);

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withSimpleCard(
        speaks.SKILL_NAME,
        `${speaks.SORRY_NOT_UNDERSTAND + speaks.REPEAT_PLEASE}${cardLineBreak}${
          speaks.SECOND_PLAYER + speaks.ASK_MULTIPLICATION_CARD
        }${multiplicand} * ${multiplier} = ?`,
      )
      .reprompt(speakOutput)
      .getResponse();

    const response = await NoUnderstandResponse.getResponse(
      handlerInput,
      'SetAnswerIntentHandler',
      new Error('Test Error'),
    );

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response with number attempts one', async () => {
    const currentPlayer = 'Mark';
    const multiplicand = 5;
    const multiplier = 3;
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
      number_attempts: 1,
    };

    handlerInput.attributesManager.getSessionAttributes = () =>
      sessionAttributes;

    const speakOutput =
      speaks.SORRY_NOT_UNDERSTAND +
      speaks.REPEAT_MORE_TIME +
      b200ms +
      speaks.ASK_MULTIPLICATION.format(currentPlayer, multiplicand, multiplier);

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withSimpleCard(
        speaks.SKILL_NAME,
        `${
          speaks.SORRY_NOT_UNDERSTAND + speaks.REPEAT_MORE_TIME
        }${cardLineBreak}${
          speaks.SECOND_PLAYER + speaks.ASK_MULTIPLICATION_CARD
        }${multiplicand} * ${multiplier} = ?`,
      )
      .reprompt(speakOutput)
      .getResponse();

    const response = await NoUnderstandResponse.getResponse(
      handlerInput,
      'SetAnswerIntentHandler',
      new Error('Test Error'),
    );

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response with number attempts two', async () => {
    const currentPlayer = 'Mark';
    const multiplicand = 5;
    const multiplier = 3;
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
      number_attempts: 2,
    };

    handlerInput.attributesManager.getSessionAttributes = () =>
      sessionAttributes;

    const newMultiplicand = 6;
    const newMultiplier = 6;
    mockGetNumberRand.mockReturnValue(6);

    const speakOutput =
      speaks.SORRY_NOT_UNDERSTAND +
      speaks.CHANGE_MULTIPLICATION +
      b200ms +
      speaks.ASK_MULTIPLICATION.format(
        currentPlayer,
        newMultiplicand,
        newMultiplier,
      );

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withSimpleCard(
        speaks.SKILL_NAME,
        `${
          speaks.SORRY_NOT_UNDERSTAND + speaks.CHANGE_MULTIPLICATION
        }${cardLineBreak}${
          speaks.SECOND_PLAYER + speaks.ASK_MULTIPLICATION_CARD
        }${newMultiplicand} * ${newMultiplier} = ?`,
      )
      .reprompt(speakOutput)
      .getResponse();

    const response = await NoUnderstandResponse.getResponse(
      handlerInput,
      'SetAnswerIntentHandler',
      new Error('Test Error'),
    );

    expect(response).toEqual(outputSpeech);
  });
});
