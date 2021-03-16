const { speaks, b200ms } = require('../speakStrings');

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    // eslint-disable-next-line no-console
    console.log(`Erro do manipulador: ${error.message}`);

    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
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
    }

    return handlerInput.responseBuilder
      .speak(TEXTO_FALA)
      .reprompt(TEXTO_FALA)
      .getResponse();
  },
};

module.exports = ErrorHandler;
