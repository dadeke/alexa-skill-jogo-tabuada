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
module.exports.cardLineBreak = ' \n\u200b\n';

module.exports.speaks = {
  SKILL_NAME: 'Jogo da Tabuada',
  WELCOME:
    `Bem vindo ao Jogo da Tabuada! ` +
    `Quer iniciar o jogo?${module.exports.b200ms}` +
    `Ou quer que eu fale as instruções?`,
  WELCOME_CARD:
    `Bem vindo ao Jogo da Tabuada! ` +
    `Quer iniciar o jogo? ` +
    `Ou quer que eu fale as instruções?`,
  WELCOME_BACK: 'Bem vindo de volta ao Jogo da Tabuada! ',
  ASK_PLAYER_NAME1: 'Qual é o nome do primeiro jogador?',
  ASK_PLAYER_NAME2: 'Qual é o nome do segundo jogador?',
  INTRODUCE_START:
    'O primeiro jogador é {0} e o segundo jogador é {1}. ' +
    'O primeiro jogador começa o jogo. Então vamos lá!',
  ASK_MULTIPLICATION: `{0} quanto é${module.exports.b200ms}{1} vezes {2}?`,
  ASK_MULTIPLICATION_CARD: 'Quanto é ',
  FIRST_PLAYER: 'Primeiro jogador: ',
  SECOND_PLAYER: 'Segundo jogador: ',
  RIGHT_ANSWER: 'Certa resposta!',
  WRONG_ANSWER: 'Resposta errada! {0} vezes {1} é igual a {2}',
  WRONG_ANSWER_CARD: 'Resposta errada!',
  END_RESULT: 'O jogo terminou. ',
  END_RESULT_WRONG: 'O jogador {0} acertou {1} e errou {2}.',
  END_RESULT_ALL_RIGHT: 'O jogador {0} acertou todas.',
  END_WINNER: ' {0} parabéns! Você ganhou! Até a próxima!',
  END_DRAW_ALL_RIGHT:
    ' O jogo ficou empatado! Todos acertaram! ' +
    'Parabéns aos jogadores! Até a próxima!',
  END_DRAW: ' O jogo ficou empatado! Até a próxima!',
  END_RESULT_FIRST_PLAYER: 'primeiro jogador',
  END_RESULT_SECOND_PLAYER: 'segundo jogador',
  END_RESULT_WRONG_CARD: 'O {0} acertou {1} e errou {2}.',
  END_RESULT_ALL_RIGHT_CARD: 'O {0} acertou todas.',
  END_WINNER_CARD: 'Parabéns ao {0}! Você ganhou! Até a próxima!',
  END_DRAW_ALL_RIGHT_CARD:
    'O jogo ficou empatado! Todos acertaram! ' +
    'Parabéns aos jogadores! Até a próxima!',
  END_DRAW_CARD: 'O jogo ficou empatado! Até a próxima!',
  ASK_RESUME_GAME: 'A partida anterior não foi concluída. Deseja continuá-la?',
  NEW_GAME: 'Certo. Criando uma nova partida.',
  RESUME_GAME: 'Continuando a partida anterior.',
  INSTRUCTIONS:
    `O jogo da tabuada deve ser disputado por dois jogadores. ` +
    `Cada jogador deverá responder o resultado de {0} multiplicações. ` +
    `O jogador que acertar mais respostas, vence o jogo.` +
    `${module.exports.b200ms}Quer iniciar o jogo agora?`,
  INSTRUCTIONS_CARD:
    `O jogo da tabuada deve ser disputado por dois jogadores. ` +
    `Cada jogador deverá responder o resultado de {0} multiplicações. ` +
    `O jogador que acertar mais respostas, vence o jogo. ` +
    `Quer iniciar o jogo agora?`,
  ASK_START: 'Quer iniciar o jogo?',
  ALL_RIGHT: 'Tudo bem.',
  SORRY_NOT_UNDERSTAND: 'Desculpe, não entendi sua resposta. ',
  REPEAT_PLEASE: 'Por favor, poderia repetir? ',
  REPEAT_MORE_TIME: 'Por favor, poderia repetir pela última vez? ',
  CHANGE_MULTIPLICATION: 'Vou trocar a questão.',
  PROBLEM: 'Desculpe, tive problemas. Por favor, chame novamente essa skill.',
};
