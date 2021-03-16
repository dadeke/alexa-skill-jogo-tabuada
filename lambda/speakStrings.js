/**
 * Formata string.
 * Equivalente ao "printf()" C/PHP ou ao "String.Format()"
 * para programadores C#/Java.
 */
// eslint-disable-next-line no-extend-native
String.prototype.format = function formatString() {
  // eslint-disable-next-line prefer-rest-params
  const args = arguments;
  return this.replace(/\{(\d+)\}/g, (text, key) => args[key]);
};

module.exports.b200ms = ' <break time= "200ms" /> ';

module.exports.speaks = {
  NOME_SKILL: 'Jogo da Tabuada',
  BEM_VINDO: `Bem vindo ao Jogo da Tabuada! Quer iniciar o jogo?${module.exports.b200ms}Ou quer que eu fale as instruções?`,
  PERGUNTA_JOGADOR1: 'Qual é o nome do primeiro jogador?',
  PERGUNTA_JOGADOR2: 'Qual é o nome do segundo jogador?',
  APRESENTA_COMECA:
    'O primeiro jogador é {0} e o segundo jogador é {1}. O primeiro jogador começa o jogo. ' +
    'Então vamos lá!',
  PERGUNTA_TABUADA: `{0} quanto é${module.exports.b200ms}{1} vezes {2}?`,
  CERTA_RESPOSTA: 'Certa resposta!',
  RESPOSTA_ERRADA: 'Resposta errada! {0} vezes {1} é igual a {2}',
  FIM_RESULTADO: `O jogo terminou. O jogador {0} acertou {1} e errou {2}${module.exports.b200ms}o jogador {3} acertou {4} e errou {5}. `,
  FIM_VENCEDOR: '{0} parabéns! Você ganhou! Até mais!',
  FIM_EMPATE_PARABENS:
    'O jogo ficou empatado! Todos acertaram! Parabéns aos jogadores! Até mais!',
  FIM_EMPATE: 'O jogo ficou empatado! Até mais!',
  INSTRUCOES: `${
    'O jogo da tabuada deve ser disputado por dois jogadores. ' +
    'Cada jogador deverá responder o resultado de {0} multiplicações. ' +
    'O jogador que acertar mais respostas, vence o jogo.'
  }${module.exports.b200ms}Quer iniciar o jogo agora?`,
  PERGUNTA_INICIAR: 'Quer iniciar o jogo?',
  TUDO_BEM: 'Tudo bem.',
  NAO_ENTENDI: 'Desculpe, não consegui entender. Por favor, fale novamente.',
};
