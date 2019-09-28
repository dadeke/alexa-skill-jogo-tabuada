const Alexa = require('ask-sdk-core');
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');

// AINDA EXISTE O BUG DO CATORZE.

const b200ms = ' <break time= "200ms" /> ';

const messages = {
	NOME_SKILL: 'Jogo da Tabuada',
	BEM_VINDO: 'Bem vindo ao Jogo da Tabuada! Quer iniciar o jogo?' + b200ms + 'Ou quer que eu fale as instruções?',
	PERGUNTA_JOGADOR1: 'Qual é o nome do primeiro jogador?',
	PERGUNTA_JOGADOR2: 'Qual é o nome do segundo jogador?',
	APRESENTA_COMECA: 'O primeiro jogador é {0} e o segundo jogador é {1}. O primeiro jogador começa o jogo. Então vamos lá!',
	PERGUNTA_TABUADA: '{0} quanto é' + b200ms + '{1} vezes {2}?',
	CERTA_RESPOSTA: 'Certa resposta!',
	RESPOSTA_ERRADA: 'Resposta errada! {0} vezes {1} é igual a {2}',
	FIM_RESULTADO: 'O jogo terminou. O jogador {0} acertou {1} e errou {2}' + b200ms + 'o jogador {3} acertou {4} e errou {5}. ', 
	FIM_VENCEDOR: '{0} parabéns! Você ganhou! Até mais!',
	FIM_EMPATE_PARABENS: 'O jogo ficou empatado! Todos acertaram! Parabéns aos jogadores! Até mais!',
	FIM_EMPATE: 'O jogo ficou empatado! Até mais!',
	INSTRUCOES: 'O jogo da tabuada deve ser disputado por dois jogadores. Cada jogador deverá responder o resultado de {0} multiplicações. O jogador que acertar mais respostas, vence o jogo.' + b200ms + 'Quer iniciar o jogo agora?',
	PERGUNTA_INICIAR: 'Quer iniciar o jogo?',
	TUDO_BEM: 'Tudo bem.',
	NAO_ENTENDI: 'Desculpe, não consegui entender. Por favor, fale novamente.'
}

// Define a quantidade total de perguntas do jogo. Deve ser sempre um número par.
const QTD_PERGUNTA = 20;

/*
 * Formata string.
 * Equivalente ao "printf()" C/PHP ou ao "String.Format()" para programadores C#/Java.
 */
String.prototype.format = function() {
	var args = arguments;
	return this.replace(/\{(\d+)\}/g, function(text, key) {
		return args[key];
	});
}

/*
 * Salva as variáveis de sessão.
 */
function saveSessionAttribute(sessionAttributes, handlerInput, name, value) {
	sessionAttributes[name] = value;
	handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);
	handlerInput.attributesManager.savePersistentAttributes();
}

/*
 * Retorna um número randômico de 0 até 10.
 */
function getNumberRand() {
	return Math.floor(Math.random() * 11); 
}

const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
	},
	handle(handlerInput) {
		return handlerInput.responseBuilder
			.speak(messages.BEM_VINDO)
			.reprompt(messages.NAO_ENTENDI)
			.withSimpleCard(messages.NOME_SKILL)
			.getResponse();
	}
};

const IniciaJogoHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& handlerInput.requestEnvelope.request.intent.name === 'IniciaJogo';
	},
	handle(handlerInput) {
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		
		try {
			// Verifica se o jogo já está rodando.
			if(typeof(sessionAttributes.contador_perguntas) !== 'undefined') {
				throw new Error('O jogo já está rodando. Não entrar na intenção "IniciaJogo" nesse momento.');
			}
			
			return handlerInput.responseBuilder
				.speak(messages.PERGUNTA_JOGADOR1)
				.reprompt(messages.NAO_ENTENDI)
				.withSimpleCard(messages.NOME_SKILL, messages.PERGUNTA_JOGADOR1)
				.getResponse();
		}
		catch(e) {
			var TEXTO_FALA = messages.NAO_ENTENDI;

			// Verifica se o jogo já está rodando.
			if(typeof(sessionAttributes.contador_perguntas) !== 'undefined') {
				TEXTO_FALA += b200ms + messages.PERGUNTA_TABUADA.format(sessionAttributes.jogador_atual, sessionAttributes.multiplicando, sessionAttributes.multiplicador);
			}
			else {
				console.log(e);
				console.log(handlerInput);
			}
			
			return handlerInput.responseBuilder
				.speak(TEXTO_FALA)
				.reprompt(TEXTO_FALA)
				.getResponse();
		}
	}
};

const DefineJogadorUmHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& handlerInput.requestEnvelope.request.intent.name === 'DefineJogadorUm';
	},
	handle(handlerInput) {
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		
		try {
			// Verifica se o jogo já está rodando.
			if(typeof(sessionAttributes.contador_perguntas) !== 'undefined') {
				throw new Error('O jogo já está rodando. Não entrar na intenção "DefineJogadorUm" nesse momento.');
			}
			
			saveSessionAttribute(sessionAttributes, handlerInput, 'primeiro_jogador', handlerInput.requestEnvelope.request.intent.slots.primeiro_jogador.value);
			
			return handlerInput.responseBuilder
				.speak(messages.PERGUNTA_JOGADOR2)
				.reprompt(messages.NAO_ENTENDI)
				.withSimpleCard(messages.NOME_SKILL, messages.PERGUNTA_JOGADOR2)
				.getResponse();
		}
		catch(e) {
			var TEXTO_FALA = messages.NAO_ENTENDI;

			// Verifica se o jogo já está rodando.
			if(typeof(sessionAttributes.contador_perguntas) !== 'undefined') {
				TEXTO_FALA += b200ms + messages.PERGUNTA_TABUADA.format(sessionAttributes.jogador_atual, sessionAttributes.multiplicando, sessionAttributes.multiplicador);
			}
			else {
				console.log(e);
				console.log(handlerInput);
			}
			
			return handlerInput.responseBuilder
				.speak(TEXTO_FALA)
				.reprompt(TEXTO_FALA)
				.getResponse();
		}
	}
};

const DefineJogadorDoisHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& handlerInput.requestEnvelope.request.intent.name === 'DefineJogadorDois';
	},
	handle(handlerInput) {
		var multiplicando = getNumberRand();
		var multiplicador = getNumberRand();
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		
		try {
			// Verifica se o jogo já está rodando.
			if(typeof(sessionAttributes.contador_perguntas) !== 'undefined') {
				throw new Error('O jogo já está rodando. Não entrar na intenção "DefineJogadorDois" nesse momento.');
			}
			
			/*
			 * Caso o nome do primeiro jogador não esteja definido: define o nome do primeiro jogador e pergunta o nome do segundo jogador.
			 * Caso o nome do primeiro jogador já esteja definido: define o nome do segundo jogador.
			 */
			if(typeof(sessionAttributes.primeiro_jogador) === 'undefined') {
				saveSessionAttribute(sessionAttributes, handlerInput, 'primeiro_jogador', handlerInput.requestEnvelope.request.intent.slots.segundo_jogador.value);
				
				return handlerInput.responseBuilder
					.speak(messages.PERGUNTA_JOGADOR2)
					.reprompt(messages.NAO_ENTENDI)
					.withSimpleCard(messages.NOME_SKILL, messages.PERGUNTA_JOGADOR2)
					.getResponse();
			}
			else {
				saveSessionAttribute(sessionAttributes, handlerInput, 'segundo_jogador', handlerInput.requestEnvelope.request.intent.slots.segundo_jogador.value);
			}
			
			// Salva o nome do primeiro jogador como jogador atual.
			saveSessionAttribute(sessionAttributes, handlerInput, 'jogador_atual', sessionAttributes.primeiro_jogador);
			
			// Inicializa a tabela de resultados.
			saveSessionAttribute(sessionAttributes, handlerInput, 'primeiro_acertou', 0);
			saveSessionAttribute(sessionAttributes, handlerInput, 'primeiro_errou', 0);
			saveSessionAttribute(sessionAttributes, handlerInput, 'segundo_acertou', 0);
			saveSessionAttribute(sessionAttributes, handlerInput, 'segundo_errou', 0);
			
			// Salva o multiplicando e o multiplicador da pergunta atual.
			saveSessionAttribute(sessionAttributes, handlerInput, 'multiplicando', multiplicando);
			saveSessionAttribute(sessionAttributes, handlerInput, 'multiplicador', multiplicador);
			
			// Inicializa o contador de perguntas realizadas.
			saveSessionAttribute(sessionAttributes, handlerInput, 'contador_perguntas', 1);
		
			return handlerInput.responseBuilder
				.speak(messages.APRESENTA_COMECA.format(sessionAttributes.primeiro_jogador,
														sessionAttributes.segundo_jogador)
					+ b200ms + messages.PERGUNTA_TABUADA.format(sessionAttributes.primeiro_jogador,
														multiplicando,
														multiplicador))
				.reprompt(messages.NAO_ENTENDI)
				.getResponse();
		}
		catch(e) {
			var TEXTO_FALA = messages.NAO_ENTENDI;

			// Verifica se o jogo já está rodando.
			if(typeof(sessionAttributes.contador_perguntas) !== 'undefined') {
				TEXTO_FALA += b200ms + messages.PERGUNTA_TABUADA.format(sessionAttributes.jogador_atual, sessionAttributes.multiplicando, sessionAttributes.multiplicador);
			}
			else {
				console.log(e);
				console.log(handlerInput);
			}
			
			return handlerInput.responseBuilder
				.speak(TEXTO_FALA)
				.reprompt(TEXTO_FALA)
				.getResponse();
		}
	}
};

const DefineResposta = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& handlerInput.requestEnvelope.request.intent.name === 'DefineResposta';
	},
	handle(handlerInput) {
		var proximo_jogador = null;
		var resposta = null;
		var produto = null;
		var RESULTADO = null;
		var multiplicando = getNumberRand();
		var multiplicador = getNumberRand();
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		
		// Verifica se a resposta da pergunta anterior está correta.
		resposta = handlerInput.requestEnvelope.request.intent.slots.resposta.value;
		produto = sessionAttributes.multiplicando * sessionAttributes.multiplicador;
		if(parseInt(resposta) === produto) {
			RESULTADO = messages.CERTA_RESPOSTA;
		}
		else{
			RESULTADO = messages.RESPOSTA_ERRADA.format(sessionAttributes.multiplicando, sessionAttributes.multiplicador, produto.toString());
		}
		
		// Salva o resultado do jogador anterior e verifica o próximo jogador.
		if(sessionAttributes.primeiro_jogador === sessionAttributes.jogador_atual) {
			if(RESULTADO === messages.CERTA_RESPOSTA) {
				saveSessionAttribute(sessionAttributes, handlerInput, 'primeiro_acertou', sessionAttributes.primeiro_acertou + 1);
			}
			else {
				saveSessionAttribute(sessionAttributes, handlerInput, 'primeiro_errou', sessionAttributes.primeiro_errou + 1);
			}
			
			proximo_jogador = sessionAttributes.segundo_jogador;
			saveSessionAttribute(sessionAttributes, handlerInput, 'jogador_atual', sessionAttributes.segundo_jogador);
		}
		else {
			if(RESULTADO === messages.CERTA_RESPOSTA) {
				saveSessionAttribute(sessionAttributes, handlerInput, 'segundo_acertou', sessionAttributes.segundo_acertou + 1);
			}
			else {
				saveSessionAttribute(sessionAttributes, handlerInput, 'segundo_errou', sessionAttributes.segundo_errou + 1);
			}
			
			proximo_jogador = sessionAttributes.primeiro_jogador;
			saveSessionAttribute(sessionAttributes, handlerInput, 'jogador_atual', sessionAttributes.primeiro_jogador);
		}
		
		// Atualiza o contador de perguntas realizadas.
		if(sessionAttributes.contador_perguntas < QTD_PERGUNTA) {
			saveSessionAttribute(sessionAttributes, handlerInput, 'contador_perguntas', sessionAttributes.contador_perguntas + 1);
		}
		else if(sessionAttributes.contador_perguntas >= QTD_PERGUNTA) { // Fala o resultado final e encerra o jogo.
			var FRASE_FINAL = messages.FIM_RESULTADO.format(sessionAttributes.primeiro_jogador,
															sessionAttributes.primeiro_acertou,
															sessionAttributes.primeiro_errou,
															sessionAttributes.segundo_jogador,
															sessionAttributes.segundo_acertou,
															sessionAttributes.segundo_errou);
			if(sessionAttributes.primeiro_acertou > sessionAttributes.segundo_acertou) {
				FRASE_FINAL += messages.FIM_VENCEDOR.format(sessionAttributes.primeiro_jogador);
			}
			else if(sessionAttributes.primeiro_acertou < sessionAttributes.segundo_acertou) {
				FRASE_FINAL +=messages.FIM_VENCEDOR.format(sessionAttributes.segundo_jogador);
			}
			else if((sessionAttributes.primeiro_acertou === sessionAttributes.segundo_acertou)
				&& (parseInt(sessionAttributes.primeiro_acertou) === (QTD_PERGUNTA / 2))) {
				FRASE_FINAL += messages.FIM_EMPATE_PARABENS;
			}
			else if(sessionAttributes.primeiro_acertou === sessionAttributes.segundo_acertou) {
				FRASE_FINAL += messages.FIM_EMPATE;
			}
			
			return handlerInput.responseBuilder
				.speak(RESULTADO + b200ms + FRASE_FINAL)
				.withShouldEndSession(true)
				.getResponse();
		}
		
		// Salva o multiplicando e o multiplicador da pergunta atual.
		saveSessionAttribute(sessionAttributes, handlerInput, 'multiplicando', multiplicando);
		saveSessionAttribute(sessionAttributes, handlerInput, 'multiplicador', multiplicador);
		
		return handlerInput.responseBuilder
			.speak(RESULTADO + b200ms + messages.PERGUNTA_TABUADA.format(proximo_jogador, multiplicando, multiplicador))
			.reprompt(messages.NAO_ENTENDI + b200ms + messages.PERGUNTA_TABUADA.format(proximo_jogador, multiplicando, multiplicador))
			.getResponse();
	}
};

const HelpIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
	},
	handle(handlerInput) {
		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		
		try {
			// Verifica se o jogo já está rodando.
			if(typeof(sessionAttributes.contador_perguntas) !== 'undefined') {
				throw new Error('O jogo já está rodando. Não entrar na intenção "AMAZON.HelpIntent" nesse momento.');
			}
	
			return handlerInput.responseBuilder
				.speak(messages.INSTRUCOES.format(QTD_PERGUNTA / 2))
				.reprompt(messages.PERGUNTA_INICIAR)
				.getResponse();
		}
		catch(e) {
			var TEXTO_FALA = messages.NAO_ENTENDI;

			// Verifica se o jogo já está rodando.
			if(typeof(sessionAttributes.contador_perguntas) !== 'undefined') {
				TEXTO_FALA += b200ms + messages.PERGUNTA_TABUADA.format(sessionAttributes.jogador_atual, sessionAttributes.multiplicando, sessionAttributes.multiplicador);
			}
			else {
				console.log(e);
				console.log(handlerInput);
			}
			
			return handlerInput.responseBuilder
				.speak(TEXTO_FALA)
				.reprompt(TEXTO_FALA)
				.getResponse();
		}
	}
};

const CancelAndStopIntentHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'IntentRequest'
			&& (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
				|| handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
	},
	handle(handlerInput) {
		return handlerInput.responseBuilder
			.speak(messages.TUDO_BEM)
			.withSimpleCard(messages.NOME_SKILL, messages.TUDO_BEM)
			.withShouldEndSession(true)
			.getResponse();
	}
};

const SessionEndedRequestHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
	},
	handle(handlerInput) {
		console.log(`Sessão encerrada com essa reação: ${handlerInput.requestEnvelope.request.reason}`);
		
		return handlerInput.responseBuilder.getResponse();
	},
};

const ErrorHandler = {
	canHandle() {
		return true;
	},
	handle(handlerInput, error) {
		console.log(`Erro do manipulador: ${error.message}`);

		const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
		var TEXTO_FALA = messages.NAO_ENTENDI;

		// Verifica se o jogo já está rodando.
		if(typeof(sessionAttributes.contador_perguntas) !== 'undefined') {
			TEXTO_FALA += b200ms + messages.PERGUNTA_TABUADA.format(sessionAttributes.jogador_atual, sessionAttributes.multiplicando, sessionAttributes.multiplicador);
		}

		return handlerInput.responseBuilder
			.speak(TEXTO_FALA)
			.reprompt(TEXTO_FALA)
			.getResponse();
	},
};

exports.handler = Alexa.SkillBuilders.custom()
	.withPersistenceAdapter(
		new persistenceAdapter.S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET}))
	.addRequestHandlers(
		LaunchRequestHandler,
		IniciaJogoHandler,
		DefineJogadorUmHandler,
		DefineJogadorDoisHandler,
		DefineResposta,
		HelpIntentHandler,
		CancelAndStopIntentHandler,
		SessionEndedRequestHandler)
	.addErrorHandlers(
		ErrorHandler)
	.lambda();
