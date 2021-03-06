# Skill da Alexa: Jogo da Tabuada

[![Build Status](https://travis-ci.com/dadeke/alexa-skill-jogo-tabuada.svg?branch=master)](https://travis-ci.com/github/dadeke/alexa-skill-jogo-tabuada)
[![Coverage Status](https://codecov.io/gh/dadeke/alexa-skill-jogo-tabuada/branch/master/graph/badge.svg)](https://codecov.io/gh/dadeke/alexa-skill-jogo-tabuada)
[![ESLint](https://img.shields.io/badge/eslint-6.8.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![Airbnb Style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![Jest](https://img.shields.io/badge/jest-26.6.3-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Stargazers](https://img.shields.io/github/stars/dadeke/alexa-skill-jogo-tabuada?style=social)](https://github.com/dadeke/alexa-skill-jogo-tabuada/stargazers)

Repositório do código fonte da skill da Alexa: [Jogo da Tabuada](https://www.amazon.com.br/DD-Tecnologia-Jogo-da-Tabuada/dp/B07WC431Z8/).

Compatível com o "Import skill" do Alexa Developer Console.  
[![Compatível com o Import skill](https://i.imgur.com/65L4f3f.png)](https://developer.amazon.com/alexa/console/ask/create-new-skill)

[Changelog](#changelog)&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Licença](#licença)

### _Gostou desta skill? Considere fazer uma doação para ajudar a apoiar seu desenvolvimento. Muito obrigado!_

[<p align="center">![Doe com Pix!](https://i.imgur.com/u0VU2Uh.png)</p>](https://picpay.me/deividsondamasio)
<p align="center"><b>Chave aleatória do Pix:</b><br /><b>3a00764d-7467-4505-80a5-5434f1b5d895</b></p>

Repositório do código fonte da skill da Alexa: Jogo da Tabuada.

O Jogo da Tabuada deve ser disputado por dois jogadores. Cada jogador deverá responder o resultado de 10 multiplicações. Aquele que acertar mais respostas, vence o jogo.

Diga "Alexa, abre o Jogo da Tabuada". Ela fará uma breve apresentação.

Quando essa skill não entender sua resposta, tente novamente usando o verbo "é".  
Exemplos:  
"é 3"  
"é 5"  
"é 15"  
"é 100"  

----------------

Gostou da skill Jogo da Tabuada? Por favor, deixe uma avaliação! Muito obrigado!

Para dar feedback sobre esta skill, entre em contato através do e-mail: oi@dd.tec.br

----------------

Você pode visualizar o histórico de atualizações e contribuir para o código fonte desta skill aqui no GitHub.

## Changelog ##

### 1.3.0 - 22/03/2021 ###
- Adicionado cards para visualização em dispositivos com tela.
- Adicionado o "Vou trocar a questão" em caso de não reconhecimento da resposta.
- Adicionado a opção para continuar a partida anterior, caso a mesma não tenha sido concluída.
- Removido as questões envolvendo zero.
- Adicionados testes unitários utilizando o Jest.

### 1.2.0 - 08/02/2021 ###
- Adicionado EditorConfig, ESLint e Prettier.
- Refatoração da estrutura.
- Adicionado o "skill package" a fim de dar suporte ao "Import skill" no Alexa Developer Console.
- Alterado a persistência do S3 para o DynamoDB.
- Adicionados alguns ajustes no modelo de interação.

### 1.1.1 - 28/04/2020 ###
- Adicionados alguns ajustes no modelo de interação e nas intenções.

### 1.1.0 - 26/04/2020 ###
- Adicionado modificações para salvar a sessão usando "async" "await" a fim de evitar travamentos.

### 1.0.3 - 27/09/2019 ###
- Modificados alguns textos da fala.

### 1.0.1 - 19/08/2019 ###
- Publicada a primeira versão.

## Licença ##

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.txt) para mais detalhes.

----------------

"Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna." João 3:16
