const Alexa = require('ask-sdk-core');

const FallbackIntentHandler = require('../../lambda/handlers/FallbackIntentHandler');
const { speaks } = require('../../lambda/speakStrings');

describe('Sequence 07. Test scenario: AMAZON.FallbackIntent', () => {
  // eslint-disable-next-line no-console
  console.error = jest.fn();

  const handlerInput = {
    attributesManager: {
      getSessionAttributes: () => ({}),
      setSessionAttributes: () => ({}),
    },
    requestEnvelope: {
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'AMAZON.FallbackIntent',
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
    handlerInput.requestEnvelope.request.intent.name = 'AMAZON.FallbackIntent';
  });

  it('should be able can not handle AMAZON.FallbackIntent if intent name is diferent', () => {
    handlerInput.requestEnvelope.request.intent.name = 'AnotherIntent';

    expect(FallbackIntentHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able can return response', async () => {
    const outputSpeech = testResponseBuilder
      .speak(speaks.PROBLEM)
      .withSimpleCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await FallbackIntentHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });
});
