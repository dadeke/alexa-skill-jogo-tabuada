/**
 * Retorna um número aleatório entre 1 e 10.
 */
module.exports.getNumberRand = function getNumberRand() {
  return Math.floor(Math.random() * 10 + 1);
};
