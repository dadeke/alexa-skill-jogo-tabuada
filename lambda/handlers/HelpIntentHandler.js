const Alexa = require('ask-sdk-core');

const { speaks, b200ms } = require('../speakStrings');

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    try {
      // Verifica se o jogo já está rodando.
      if (typeof sessionAttributes.contador_perguntas !== 'undefined') {
        throw new Error(
          'O jogo já está rodando. Não entrar na intenção "AMAZON.HelpIntent" nesse momento.',
        );
      }

      return handlerInput.responseBuilder
        .speak(speaks.INSTRUCOES.format(process.env.QTD_PERGUNTA / 2))
        .reprompt(speaks.PERGUNTA_INICIAR)
        .getResponse();
    } catch (e) {
      let TEXTO_FALA = speaks.NAO_ENTENDI;

      // Verifica se o jogo já está rodando.
      if (typeof sessionAttributes.contador_perguntas !== 'undefined') {
        TEXTO_FALA +=
          b200ms +
          speaks.PERGUNTA_TABUADA.format(
            sessionAttributes.jogador_atual,
            sessionAttributes.multiplicando,
            sessionAttributes.multiplicador,
          );
      } else {
        // eslint-disable-next-line no-console
        console.log(e);
        // eslint-disable-next-line no-console
        console.log(handlerInput);
      }

      return handlerInput.responseBuilder
        .speak(TEXTO_FALA)
        .reprompt(TEXTO_FALA)
        .getResponse();
    }
  },
};

module.exports = HelpIntentHandler;
