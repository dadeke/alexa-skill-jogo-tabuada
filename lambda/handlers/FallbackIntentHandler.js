const Alexa = require('ask-sdk-core');

const NoUnderstand = require('../responses/NoUnderstandResponse');

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
  async handle(handlerInput) {
    const response = await NoUnderstand.getResponse(
      handlerInput,
      'AMAZON.FallbackIntent',
      'Fallback',
    );

    return response;
  },
};

module.exports = FallbackIntentHandler;
