const Alexa = require('ask-sdk-core');

const ErrorHandler = require('../../lambda/handlers/ErrorHandler');
const { speaks } = require('../../lambda/speakStrings');

describe('Sequence 09. Test: ErrorHandler', () => {
  // eslint-disable-next-line no-console
  console.error = jest.fn();

  const handlerInput = {
    attributesManager: {
      getSessionAttributes: () => ({}),
      setSessionAttributes: () => ({}),
    },
    responseBuilder: Alexa.ResponseFactory.init(),
  };
  const testResponseBuilder = Alexa.ResponseFactory.init();

  it('should be able can handle', () => {
    expect(ErrorHandler.canHandle()).toEqual(true);
  });

  it('should be able can return response', async () => {
    const error = new Error('Test ErrorHandler');

    const outputSpeech = testResponseBuilder
      .speak(speaks.PROBLEM)
      .withSimpleCard(speaks.SKILL_NAME, speaks.PROBLEM)
      .withShouldEndSession(true)
      .getResponse();

    const response = await ErrorHandler.handle(handlerInput, error);

    expect(response).toEqual(outputSpeech);
  });
});
