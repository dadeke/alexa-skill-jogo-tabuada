const Alexa = require('ask-sdk-core');
const AWS = require('aws-sdk');
const DDBAdapter = require('ask-sdk-dynamodb-persistence-adapter');

// Define a quantidade total de perguntas do jogo. Deve ser sempre um número par.
process.env.QTD_PERGUNTA = 20;

const LaunchRequestHandler = require('./handlers/LaunchRequestHandler');
const IniciaJogoHandler = require('./handlers/IniciaJogoHandler');
const DefineJogadorHandler = require('./handlers/DefineJogadorHandler');
const DefineRespostaHandler = require('./handlers/DefineRespostaHandler');
const HelpIntentHandler = require('./handlers/HelpIntentHandler');
const CancelAndStopIntentHandler = require('./handlers/CancelAndStopIntentHandler');
const FallbackIntentHandler = require('./handlers/FallbackIntentHandler');
const SessionEndedRequestHandler = require('./handlers/SessionEndedRequestHandler');
// Apenas para testes.
// const IntentReflectorHandler = require('./handlers/IntentReflectorHandler');
const ErrorHandler = require('./handlers/ErrorHandler');

exports.handler = Alexa.SkillBuilders.custom()
  .withPersistenceAdapter(
    new DDBAdapter.DynamoDbPersistenceAdapter({
      tableName: process.env.DYNAMODB_PERSISTENCE_TABLE_NAME,
      createTable: false,
      dynamoDBClient: new AWS.DynamoDB({
        apiVersion: 'latest',
        region: process.env.DYNAMODB_PERSISTENCE_REGION,
      }),
    }),
  )
  .addRequestHandlers(
    LaunchRequestHandler,
    IniciaJogoHandler,
    DefineJogadorHandler,
    DefineRespostaHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    // Certifique-se de que IntentReflectorHandler seja o último para que não
    // substitua seus manipuladores de intent personalizados.
    // IntentReflectorHandler, // Apenas para testes em ambiente dev.
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
