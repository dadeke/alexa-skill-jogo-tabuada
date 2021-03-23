const Alexa = require('ask-sdk-core');

const CancelAndStopIntentHandler = require('../../lambda/handlers/CancelAndStopIntentHandler');
const { speaks, b200ms, cardLineBreak } = require('../../lambda/speakStrings');

describe('Sequence 06. Test scenario: AMAZON.CancelIntent or AMAZON.StopIntent', () => {
  const setPersistentAttributes = jest.fn();
  const savePersistentAttributes = jest.fn();

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
          name: 'AMAZON.StopIntent',
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
    handlerInput.requestEnvelope.request.intent.name = 'AMAZON.StopIntent';
  });

  it('should be able can not handle CancelAndStopIntent if intent name is diferent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AnotherIntent';

    expect(CancelAndStopIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able can return response with create new game', async () => {
    handlerInput.attributesManager.getSessionAttributes = () => ({
      last_intent: 'LaunchRequest',
      question_count: false,
    });
    handlerInput.attributesManager.setSessionAttributes = attributes => {
      handlerInput.attributesManager.getSessionAttributes = () => attributes;
    };

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

    const response = await CancelAndStopIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response', async () => {
    handlerInput.attributesManager.getSessionAttributes = () => null;

    const outputSpeech = testResponseBuilder
      .speak(speaks.ALL_RIGHT)
      .withSimpleCard(speaks.SKILL_NAME, speaks.ALL_RIGHT)
      .withShouldEndSession(true)
      .getResponse();

    const response = await CancelAndStopIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });
});
