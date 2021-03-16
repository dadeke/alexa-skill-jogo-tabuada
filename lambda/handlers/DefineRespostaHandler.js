const Alexa = require('ask-sdk-core');

const { getNumberRand } = require('../util');
const { speaks, b200ms } = require('../speakStrings');

const DefineRespostaHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'DefineResposta'
    );
  },
  async handle(handlerInput) {
    let proximoJogador = null;
    let resposta = null;
    let produto = null;
    let RESULTADO = null;
    const multiplicando = getNumberRand();
    const multiplicador = getNumberRand();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    // Verifica se a resposta da pergunta anterior está correta.
    resposta = handlerInput.requestEnvelope.request.intent.slots.resposta.value;
    produto = sessionAttributes.multiplicando * sessionAttributes.multiplicador;
    if (parseInt(resposta, 10) === produto) {
      RESULTADO = speaks.CERTA_RESPOSTA;
    } else {
      RESULTADO = speaks.RESPOSTA_ERRADA.format(
        sessionAttributes.multiplicando,
        sessionAttributes.multiplicador,
        produto.toString(),
      );
    }

    // Salva o resultado do jogador anterior e verifica o próximo jogador.
    if (
      sessionAttributes.primeiro_jogador === sessionAttributes.jogador_atual
    ) {
      if (RESULTADO === speaks.CERTA_RESPOSTA) {
        sessionAttributes.primeiro_acertou += 1;
      } else {
        sessionAttributes.primeiro_errou += 1;
      }

      proximoJogador = sessionAttributes.segundo_jogador;
      sessionAttributes.jogador_atual = sessionAttributes.segundo_jogador;
    } else {
      if (RESULTADO === speaks.CERTA_RESPOSTA) {
        sessionAttributes.segundo_acertou += 1;
      } else {
        sessionAttributes.segundo_errou += 1;
      }

      proximoJogador = sessionAttributes.primeiro_jogador;
      sessionAttributes.jogador_atual = sessionAttributes.primeiro_jogador;
    }

    // Atualiza o contador de perguntas realizadas.
    if (sessionAttributes.contador_perguntas < process.env.QTD_PERGUNTA) {
      sessionAttributes.contador_perguntas += 1;
    } else if (
      sessionAttributes.contador_perguntas >= process.env.QTD_PERGUNTA
    ) {
      // Fala o resultado final e encerra o jogo.
      let FRASE_FINAL = speaks.FIM_RESULTADO.format(
        sessionAttributes.primeiro_jogador,
        sessionAttributes.primeiro_acertou,
        sessionAttributes.primeiro_errou,
        sessionAttributes.segundo_jogador,
        sessionAttributes.segundo_acertou,
        sessionAttributes.segundo_errou,
      );

      if (
        sessionAttributes.primeiro_acertou > sessionAttributes.segundo_acertou
      ) {
        FRASE_FINAL += speaks.FIM_VENCEDOR.format(
          sessionAttributes.primeiro_jogador,
        );
      } else if (
        sessionAttributes.primeiro_acertou < sessionAttributes.segundo_acertou
      ) {
        FRASE_FINAL += speaks.FIM_VENCEDOR.format(
          sessionAttributes.segundo_jogador,
        );
      } else if (
        sessionAttributes.primeiro_acertou ===
          sessionAttributes.segundo_acertou &&
        parseInt(sessionAttributes.primeiro_acertou, 10) ===
          process.env.QTD_PERGUNTA / 2
      ) {
        FRASE_FINAL += speaks.FIM_EMPATE_PARABENS;
      } else if (
        sessionAttributes.primeiro_acertou === sessionAttributes.segundo_acertou
      ) {
        FRASE_FINAL += speaks.FIM_EMPATE;
      }

      handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);
      await handlerInput.attributesManager.savePersistentAttributes();

      return handlerInput.responseBuilder
        .speak(RESULTADO + b200ms + FRASE_FINAL)
        .withShouldEndSession(true)
        .getResponse();
    }

    // Salva o multiplicando e o multiplicador da pergunta atual.
    sessionAttributes.multiplicando = multiplicando;
    sessionAttributes.multiplicador = multiplicador;

    handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);
    await handlerInput.attributesManager.savePersistentAttributes();

    return handlerInput.responseBuilder
      .speak(
        RESULTADO +
          b200ms +
          speaks.PERGUNTA_TABUADA.format(
            proximoJogador,
            multiplicando,
            multiplicador,
          ),
      )
      .reprompt(
        speaks.NAO_ENTENDI +
          b200ms +
          speaks.PERGUNTA_TABUADA.format(
            proximoJogador,
            multiplicando,
            multiplicador,
          ),
      )
      .getResponse();
  },
};

module.exports = DefineRespostaHandler;
