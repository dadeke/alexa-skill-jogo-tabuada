const Alexa = require('ask-sdk-core');

const SetPlayerIntentHandler = require('../../lambda/handlers/SetPlayerIntentHandler');
const Util = require('../../lambda/util');
const { speaks, b200ms, cardLineBreak } = require('../../lambda/speakStrings');

// Define a quantidade total de questões. Deve ser sempre um número par.
process.env.QTY_CALCULATIONS = 20;

describe('Sequence 03. Test scenario: SetPlayer', () => {
  const getPersistentAttributes = jest.fn();
  const setPersistentAttributes = jest.fn();
  const savePersistentAttributes = jest.fn();
  const mockGetNumberRand = jest.fn();
  Util.getNumberRand = mockGetNumberRand;

  const handlerInput = {
    attributesManager: {
      getSessionAttributes: () => ({}),
      setSessionAttributes: () => ({}),
      getPersistentAttributes,
      setPersistentAttributes,
      savePersistentAttributes,
    },
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'SetPlayer',
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
    handlerInput.requestEnvelope.request.intent.name = 'SetPlayer';
    handlerInput.requestEnvelope.request.intent.slots = undefined;
  });

  it('should be able can not handle SetPlayer if intent name is diferent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AnotherIntent';

    expect(SetPlayerIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able can return response with one answer number', async () => {
    handlerInput.requestEnvelope.request.intent.slots = {
      answer: {
        value: 24,
      },
    };

    const outputSpeech = testResponseBuilder
      .speak(speaks.INSTRUCTIONS.format(calculations))
      .withSimpleCard(
        speaks.SKILL_NAME,
        speaks.INSTRUCTIONS_CARD.format(calculations),
      )
      .reprompt(speaks.ASK_START)
      .getResponse();

    const response = await SetPlayerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response with name first player without StartGame', async () => {
    handlerInput.requestEnvelope.request.intent.slots = {
      player_name: {
        value: 'John',
      },
    };

    const outputSpeech = testResponseBuilder
      .speak(speaks.INSTRUCTIONS.format(calculations))
      .withSimpleCard(
        speaks.SKILL_NAME,
        speaks.INSTRUCTIONS_CARD.format(calculations),
      )
      .reprompt(speaks.ASK_START)
      .getResponse();

    const response = await SetPlayerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response with game running and player name', async () => {
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
    handlerInput.requestEnvelope.request.intent.slots = {
      player_name: {
        value: 'Mark',
      },
    };

    const speakOutput =
      speaks.SORRY_NOT_UNDERSTAND +
      speaks.REPEAT_PLEASE +
      b200ms +
      speaks.ASK_MULTIPLICATION.format(currentPlayer, multiplicand, multiplier);

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withSimpleCard(
        speaks.SKILL_NAME,
        `${
          speaks.SORRY_NOT_UNDERSTAND +
          speaks.REPEAT_PLEASE +
          cardLineBreak +
          speaks.SECOND_PLAYER +
          speaks.ASK_MULTIPLICATION_CARD
        }${multiplicand} * ${multiplier} = ?`,
      )
      .reprompt(speakOutput)
      .getResponse();

    const response = await SetPlayerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  //
  // Início - Testes da solução temporária
  //
  it('should be able can return response with game running and player name "synco"', async () => {
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
      player_name: {
        value: 'synco',
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

    const response = await SetPlayerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response with game running and player name "sem"', async () => {
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
      player_name: {
        value: 'sem',
      },
    };

    const newMultiplicand = 8;
    const newMultiplier = 8;
    mockGetNumberRand.mockReturnValue(8);

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

    const response = await SetPlayerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });
  //
  // Fim - Testes da solução temporária
  //

  it('should be able can return response with name first player', async () => {
    handlerInput.attributesManager.getSessionAttributes = () => ({
      last_intent: 'StartGame',
      question_count: false,
    });
    handlerInput.requestEnvelope.request.intent.slots = {
      player_name: {
        value: 'John',
      },
    };

    const outputSpeech = testResponseBuilder
      .speak(speaks.ASK_PLAYER_NAME2)
      .withSimpleCard(speaks.SKILL_NAME, speaks.ASK_PLAYER_NAME2)
      .reprompt(
        speaks.SORRY_NOT_UNDERSTAND +
          speaks.REPEAT_PLEASE +
          speaks.ASK_PLAYER_NAME2,
      )
      .getResponse();

    const response = await SetPlayerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response', async () => {
    const firstPlayer = 'John';
    const secondPlayer = 'Mark';
    handlerInput.attributesManager.getSessionAttributes = () => ({
      last_intent: 'StartGame',
      question_count: false,
      first_player: firstPlayer,
    });
    handlerInput.requestEnvelope.request.intent.slots = {
      player_name: {
        value: secondPlayer,
      },
    };

    const multiplicand = 4;
    const multiplier = 4;
    mockGetNumberRand.mockReturnValue(4);

    const speakMultiplication =
      b200ms +
      speaks.ASK_MULTIPLICATION.format(firstPlayer, multiplicand, multiplier);

    const outputSpeech = testResponseBuilder
      .speak(
        speaks.INTRODUCE_START.format(firstPlayer, secondPlayer) +
          speakMultiplication,
      )
      .withSimpleCard(
        speaks.SKILL_NAME,
        `${
          speaks.FIRST_PLAYER + speaks.ASK_MULTIPLICATION_CARD
        }${multiplicand} * ${multiplier} = ?`,
      )
      .reprompt(
        speaks.SORRY_NOT_UNDERSTAND +
          speaks.REPEAT_PLEASE +
          speakMultiplication,
      )
      .getResponse();

    const response = await SetPlayerIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });
});
