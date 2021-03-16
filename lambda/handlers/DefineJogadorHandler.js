const Alexa = require('ask-sdk-core');
const DefineRespostaHandler = require('./DefineRespostaHandler');

const { getNumberRand } = require('../util');
const { speaks, b200ms } = require('../speakStrings');

const DefineJogadorHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'DefineJogador'
    );
  },
  async handle(handlerInput) {
    const multiplicando = getNumberRand();
    const multiplicador = getNumberRand();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    try {
      // Verifica se o jogo já está rodando.
      if (typeof sessionAttributes.contador_perguntas !== 'undefined') {
        //
        // Início - Solução temporária
        // Identifica o "synco" como sendo a resposta "5".
        //
        if (
          handlerInput.requestEnvelope.request.intent.slots.nome_jogador
            .value === 'synco'
        ) {
          const customHandlerInput = handlerInput;
          customHandlerInput.requestEnvelope.request.intent.slots.resposta = {
            value: '5',
          };

          return DefineRespostaHandler.handle(customHandlerInput);
        }
        if (
          handlerInput.requestEnvelope.request.intent.slots.nome_jogador
            .value === 'sem' ||
          handlerInput.requestEnvelope.request.intent.slots.nome_jogador
            .value === 'shem'
        ) {
          const customHandlerInput = handlerInput;
          customHandlerInput.requestEnvelope.request.intent.slots.resposta = {
            value: '100',
          };

          return DefineRespostaHandler.handle(customHandlerInput);
        }
        //
        // Fim - Solução temporária
        //

        throw new Error(
          'O jogo já está rodando. Não entrar na intenção "DefineJogador" nesse momento.',
        );
      }

      /**
       * Caso o nome do primeiro jogador não esteja definido: define o nome do primeiro jogador
       * e pergunta o nome do segundo jogador.
       * Caso o nome do primeiro jogador já esteja definido: define o nome do segundo jogador.
       */
      if (typeof sessionAttributes.primeiro_jogador === 'undefined') {
        sessionAttributes.primeiro_jogador =
          handlerInput.requestEnvelope.request.intent.slots.nome_jogador.value;

        handlerInput.attributesManager.setPersistentAttributes(
          sessionAttributes,
        );
        await handlerInput.attributesManager.savePersistentAttributes();

        return handlerInput.responseBuilder
          .speak(speaks.PERGUNTA_JOGADOR2)
          .reprompt(speaks.NAO_ENTENDI)
          .withSimpleCard(speaks.NOME_SKILL, speaks.PERGUNTA_JOGADOR2)
          .getResponse();
      }

      sessionAttributes.segundo_jogador =
        handlerInput.requestEnvelope.request.intent.slots.nome_jogador.value;

      // Salva o nome do primeiro jogador como jogador atual.
      sessionAttributes.jogador_atual = sessionAttributes.primeiro_jogador;

      // Inicializa a tabela de resultados.
      sessionAttributes.primeiro_acertou = 0;
      sessionAttributes.primeiro_errou = 0;
      sessionAttributes.segundo_acertou = 0;
      sessionAttributes.segundo_errou = 0;

      // Salva o multiplicando e o multiplicador da pergunta atual.
      sessionAttributes.multiplicando = multiplicando;
      sessionAttributes.multiplicador = multiplicador;

      // Inicializa o contador de perguntas realizadas.
      sessionAttributes.contador_perguntas = 1;

      handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);
      await handlerInput.attributesManager.savePersistentAttributes();

      return handlerInput.responseBuilder
        .speak(
          speaks.APRESENTA_COMECA.format(
            sessionAttributes.primeiro_jogador,
            sessionAttributes.segundo_jogador,
          ) +
            b200ms +
            speaks.PERGUNTA_TABUADA.format(
              sessionAttributes.primeiro_jogador,
              multiplicando,
              multiplicador,
            ),
        )
        .reprompt(speaks.NAO_ENTENDI)
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

module.exports = DefineJogadorHandler;
