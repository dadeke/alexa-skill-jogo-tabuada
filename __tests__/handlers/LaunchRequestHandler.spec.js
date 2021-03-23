const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = require('../../lambda/handlers/LaunchRequestHandler.js');
const { speaks } = require('../../lambda/speakStrings');

// Define a quantidade total de questões. Deve ser sempre um número par.
process.env.QTY_CALCULATIONS = 20;

describe('Sequence 01. Test scenario: launch request. no further interaction.', () => {
  const getSessionAttributes = jest.fn();
  const setSessionAttributes = jest.fn();
  const getPersistentAttributes = jest.fn();

  const handlerInput = {
    attributesManager: {
      getPersistentAttributes,
      getSessionAttributes,
      setSessionAttributes,
    },
    requestEnvelope: {
      request: {
        type: 'LaunchRequest',
      },
      context: {
        System: {},
      },
    },
    responseBuilder: Alexa.ResponseFactory.init(),
  };
  const testResponseBuilder = Alexa.ResponseFactory.init();

  beforeEach(() => {
    handlerInput.requestEnvelope.request.type = 'LaunchRequest';
  });

  it('should be able can not handle LaunchRequest if type is diferent', () => {
    handlerInput.requestEnvelope.request.type = 'AnotherRequest';

    expect(LaunchRequestHandler.canHandle(handlerInput)).toEqual(false);
  });

  it('should be able can return response with resume game', async () => {
    getPersistentAttributes.mockReturnValueOnce({
      question_count: 2,
    });

    const speakOutput = speaks.WELCOME_BACK + speaks.ASK_RESUME_GAME;

    const outputSpeech = testResponseBuilder
      .speak(speakOutput)
      .withSimpleCard(speaks.SKILL_NAME, speakOutput)
      .reprompt(speaks.ASK_RESUME_GAME)
      .getResponse();

    const response = await LaunchRequestHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });

  it('should be able can return response', async () => {
    const outputSpeech = testResponseBuilder
      .speak(speaks.WELCOME)
      .withSimpleCard(speaks.SKILL_NAME, speaks.WELCOME_CARD)
      .reprompt(speaks.WELCOME)
      .getResponse();

    const response = await LaunchRequestHandler.handle(handlerInput);

    expect(response).toEqual(outputSpeech);
  });
});
