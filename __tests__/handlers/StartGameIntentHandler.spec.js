const Alexa = require('ask-sdk-core');

const StartGameIntentHandler = require('../../lambda/handlers/StartGameIntentHandler');
const { speaks, b200ms, cardLineBreak } = require('../../lambda/speakStrings');

describe('Sequence 02. Test scenario: StartGame', () => {
  const getPersistentAttributes = jest.fn();
  const setPersistentAttributes = jest.fn();
  const savePersistentAttributes = jest.fn();

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
          name: 'StartGame',
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

  beforeEach(() => {
    handlerInput.attributesManager.getSessionAttributes = () => ({});
    handlerInput.attributesManager.setSessionAttributes = () => ({});
    handlerInput.requestEnvelope.request.intent.name = 'StartGame';
    handlerInput.requestEnvelope.request.intent.slots = undefined;
  });

  it('should be able can not handle StartGame if intent name is diferent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AnotherIntent';

    expect(StartGameIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able can return response with resume game', async () => {
    const currentPlayer = 'Mark';
    const multiplicand = 5;
    const multiplier = 3;
    const sessionAttributes = {
      last_intent: 'LaunchRequest',
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

    getPersistentAttributes.mockReturnValueOnce(sessionAttributes);

    handlerInput.attributesManager.getSessionAttributes = () =>
      sessionAttributes;
    handlerInput.attributesManager.setSessionAttributes = attributes => {
      handlerInput.attributesManager.getSessionAttributes = () => attributes;
    };

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

    const response = await StartGameIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response with game running', async () => {
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

    const response = await StartGameIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response with create new game', async () => {
    handlerInput.attributesManager.getSessionAttributes = () => ({
      last_intent: 'AMAZON.StopIntent',
      question_count: false,
    });

    const outputSpeech = testResponseBuilder
      .speak(speaks.NEW_GAME + b200ms + speaks.ASK_PLAYER_NAME1)
      .withSimpleCard(
        speaks.SKILL_NAME,
        speaks.NEW_GAME + cardLineBreak + speaks.ASK_PLAYER_NAME1,
      )
      .reprompt(
        speaks.SORRY_NOT_UNDERSTAND +
          speaks.REPEAT_PLEASE +
          speaks.ASK_PLAYER_NAME1,
      )
      .getResponse();

    const response = await StartGameIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response with create new game ask second player name', async () => {
    handlerInput.attributesManager.getSessionAttributes = () => ({
      first_player: 'John',
    });

    const outputSpeech = testResponseBuilder
      .speak(speaks.ASK_PLAYER_NAME2)
      .withSimpleCard(speaks.SKILL_NAME, speaks.ASK_PLAYER_NAME2)
      .reprompt(
        speaks.SORRY_NOT_UNDERSTAND +
          speaks.REPEAT_PLEASE +
          speaks.ASK_PLAYER_NAME2,
      )
      .getResponse();

    const response = await StartGameIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response', async () => {
    const outputSpeech = testResponseBuilder
      .speak(speaks.ASK_PLAYER_NAME1)
      .withSimpleCard(speaks.SKILL_NAME, speaks.ASK_PLAYER_NAME1)
      .reprompt(
        speaks.SORRY_NOT_UNDERSTAND +
          speaks.REPEAT_PLEASE +
          speaks.ASK_PLAYER_NAME1,
      )
      .getResponse();

    const response = await StartGameIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });
});
