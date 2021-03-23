const Alexa = require('ask-sdk-core');

const HelpIntentHandler = require('../../lambda/handlers/HelpIntentHandler');
const { speaks, b200ms, cardLineBreak } = require('../../lambda/speakStrings');

// Define a quantidade total de questões. Deve ser sempre um número par.
process.env.QTY_CALCULATIONS = 20;

describe('Sequence 05. Test scenario: AMAZON.HelpIntent', () => {
  const handlerInput = {
    attributesManager: {
      getSessionAttributes: () => ({}),
      setSessionAttributes: () => ({}),
    },
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'AMAZON.HelpIntent',
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
    handlerInput.requestEnvelope.request.intent.name = 'AMAZON.HelpIntent';
  });

  it('should be able can not handle AMAZON.HelpIntent if intent name is diferent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AnotherIntent';

    expect(HelpIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able can return response with reply of a player name', async () => {
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

    const response = await HelpIntentHandler.handle(handlerInput);

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

    const response = await HelpIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response', async () => {
    handlerInput.attributesManager.getSessionAttributes = () => ({
      last_intent: false,
    });

    const outputSpeech = testResponseBuilder
      .speak(speaks.INSTRUCTIONS.format(calculations))
      .withSimpleCard(
        speaks.SKILL_NAME,
        speaks.INSTRUCTIONS_CARD.format(calculations),
      )
      .reprompt(speaks.ASK_START)
      .getResponse();

    const response = await HelpIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });
});
