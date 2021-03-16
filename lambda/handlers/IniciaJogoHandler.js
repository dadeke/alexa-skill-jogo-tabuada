const Alexa = require('ask-sdk-core');

const { speaks, b200ms } = require('../speakStrings');

const IniciaJogoHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'IniciaJogo'
    );
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    try {
      // Verifica se o jogo já está rodando.
      if (typeof sessionAttributes.contador_perguntas !== 'undefined') {
        throw new Error(
          'O jogo já está rodando. Não entrar na intenção "IniciaJogo" nesse momento.',
        );
      }

      /**
       * Caso o nome do primeiro jogador já esteja definido: pergunte o nome do segundo jogador.
       */
      if (typeof sessionAttributes.primeiro_jogador === 'undefined') {
        return handlerInput.responseBuilder
          .speak(speaks.PERGUNTA_JOGADOR1)
          .reprompt(speaks.NAO_ENTENDI)
          .withSimpleCard(speaks.NOME_SKILL, speaks.PERGUNTA_JOGADOR1)
          .getResponse();
      }

      return handlerInput.responseBuilder
        .speak(speaks.PERGUNTA_JOGADOR2)
        .reprompt(speaks.NAO_ENTENDI)
        .withSimpleCard(speaks.NOME_SKILL, speaks.PERGUNTA_JOGADOR2)
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

module.exports = IniciaJogoHandler;
