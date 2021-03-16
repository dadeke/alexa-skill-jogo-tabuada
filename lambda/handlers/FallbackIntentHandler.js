const Alexa = require('ask-sdk-core');
const speaks = require('../speakStrings');

/* *
 * FallbackIntent é acionado quando um usuário diz algo que não foi mapeado
 * para quaisquer intenções em sua skill.
 * Também deve ser definido no modelo de idioma (se o local suportar)
 * Este manipulador pode ser adicionado com segurança, mas será ignorado
 * em localidades em que ainda não é suportado.
 * */
const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        'AMAZON.FallbackIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(speaks.FALLBACK + speaks.OPTIONS)
      .withStandardCard(
        speaks.SKILL_NAME,
        speaks.FALLBACK + speaks.OPTIONS_CARD,
      )
      .reprompt(speaks.OPTIONS)
      .getResponse();
  },
};

module.exports = FallbackIntentHandler;
