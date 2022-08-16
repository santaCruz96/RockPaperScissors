const backURL = 'https://skypro-rock-scissors-paper.herokuapp.com/';
const app = document.querySelector('.app');

function createNode(tag, content, classes) {
    const element = document.createElement(tag);

    element.textContent = content;
    element.classList.add(...[].concat(classes).filter(Boolean));

    return element;
}

window.application.screens['startGame-screen'] = renderStartGameScreen;
window.application.screens['login-screen'] = renderLoginScreen;
window.application.screens['lobby-screen'] = renderLobbyScreen;
window.application.screens['win-screen'] = renderWinScreen;
window.application.screens['fail-screen'] = renderFailScreen;
window.application.screens['turn'] = renderTurnScreen;
window.application.screens['double-turn'] = renderDoubleTurnScreen;
window.application.screens['waiting-enemy-screen'] = renderWaitingTurnScreen;
window.application.screens['waiting-game-screen'] = renderWaitingGameScreen;
window.application.screens['vs-screen'] = renderVsScreen;

window.application.blocks['startGame-block'] = renderStartGameBlock;
window.application.blocks['login-block'] = renderLoginBlock;
window.application.blocks['win-block'] = renderWinBlock;
window.application.blocks['fail-block'] = renderFailBlock;
window.application.blocks['lobby-block'] = renderLobbyBlock;
window.application.blocks['turn-block'] = renderTurnBlock;
window.application.blocks['double-turn-block'] = renderDoubleTurnBlock;
window.application.blocks['waiting-game-block'] = renderWaitingGameBlock;
window.application.blocks['waiting-turn-block'] = renderWaitingTurnBlock;
window.application.blocks['vs-block'] = renderVsBlock;

window.application.blocks['login-button'] = renderLoginButton;
window.application.blocks['lobby-button'] = renderLobbyButton;
window.application.blocks['play-button'] = renderPlayButton;
window.application.blocks['back-button'] = renderBackButton;
window.application.blocks['rock-button'] = renderRockButton;
window.application.blocks['scissors-button'] = renderScissorsButton;
window.application.blocks['paper-button'] = renderPaperButton;

window.application.renderScreen('startGame-screen');

function renderStartGameBlock(container) {
    const startGameTitle = createNode('h1', 'КАМЕНЬ - НОЖНИЦЫ - БУМАГА', 'startGame-title');
    const loading = createNode('div', 'Загрузка', 'loading');

    container.appendChild(startGameTitle);
    container.appendChild(loading);
}

function renderStartGameScreen() {
    app.textContent = '';
  
    const startGameScreen = createNode('div', null, ['startGame-screen', 'screen']);
  
    app.appendChild(startGameScreen);
  
    window.application.renderBlock('startGame-block', startGameScreen);

    setTimeout(() => {
        window.application.renderScreen('login-screen');
    }, 5000);
}

function renderLoginBlock(container) {
    const loginText = createNode('h1', 'ВВЕДИТЕ ВАШ НИКНЕЙМ, ЧТОБЫ ВОЙТИ', 'login-title');
  
    container.appendChild(loginText);
}

function renderLoginButton(container) {
    const loginInput = createNode('input', null, 'login-input' );
    const loginButton = createNode('button', 'ВОЙТИ', ['login-button', 'button']);

    loginButton.addEventListener('click', () =>
    request({
        url: `${backURL}login`,
        params: {
            login: loginInput.value,
        },
        onSuccess: (data) => {
            if (isStatusOk(data)) {
                window.application.player.token = data.token;
                request({
                    url: `${backURL}player-status`,
                    params: {
                        token: window.application.player.token,
                    },
                    onSuccess: (data) => {
                        if (isPlayerStatusLobby(data)) {
                            window.application.renderScreen('lobby-screen');
                        }
                        if (isPlayerStatusGame(data) && isPlayerIdNotEmpty(data)) {
                            window.application.player.gameId = data['player-status'].game.id;
                            request({
                                url: `${backURL}game-status`,
                                params: {
                                    token: window.application.player.token,
                                    id: window.application.player.gameId,
                                },
                                onSuccess: (data) => {
                                    if (isGameStatusWaitingForStart(data)) {
                                        window.application.renderScreen('waiting-game-screen');  
                                    }
                                    if (isGameStatusWaitingYourMove(data)) {
                                        window.application.renderScreen('turn'); 
                                    }
                                    if (isGameStatusWaitingForEnemyMove(data)) {
                                        window.application.renderScreen('waiting-enemy-screen'); 
                                    }
                                    if (isGameStatusLose(data)) {
                                        window.application.renderScreen('fail-screen');
                                    }
                                    if (isGameStatusWin(data)) {
                                        window.application.renderScreen('win-screen'); 
                                    }
                                },
                            });
                        } else {
                            window.application.renderScreen('lobby-screen');
                        }
                    }
                });
            }
        }
    })
    )
    container.appendChild(loginInput);
    container.appendChild(loginButton);
}

function renderLoginScreen() {
    app.textContent = '';
  
    const loginScreen = createNode('div', null, ['login-screen', 'screen']);
    app.appendChild(loginScreen);
  
    const authBlock = createNode('div', null, 'authorization-block');
    loginScreen.appendChild(authBlock);
  
    window.application.renderBlock('login-block', authBlock);
    window.application.renderBlock('login-button', authBlock);
    document.querySelector('.login-input').focus()
}

function renderLobbyBlock(container) {
    const lobbyTittle = createNode('h1', 'ЛОББИ', 'lobby-tittle');
    const lobbyText = createNode('h2', null, 'lobby-text');
    const lobbyTextInfo = createNode('p', 'Игроки в сети:', 'list-players');
    let lobbyBlockText = createNode('p', null, 'lobby-block-text');


    function refreshLobby() {
        request({
            url: `${backURL}player-list`,
            params: {
                token: window.application.player.token
            },
            onSuccess: (data) => {
                console.log(data);
                if (isStatusOk(data)) {
                    lobbyBlockText.textContent = '';
                    lobbyText.textContent = '';
                    data.list.forEach(item => {
                        lobbyBlockText.textContent += item.login + ' ';

                        if (item.you) {
                            lobbyText.textContent = item.login;
                        }
                    });
                }
            }
        });
        lobbyText.classList.add('win-title');
        lobbyBlockText.classList.add('lobby-list');

        container.appendChild(lobbyTittle)
        container.appendChild(lobbyText);
        container.appendChild(lobbyTextInfo);
        container.appendChild(lobbyBlockText);
    }
    window.application.timers.push(setInterval(refreshLobby, 1000));
}

function renderLobbyScreen() {
    app.textContent = '';
    const lobbyScreen = createNode('div', null, ['lobby-screen', 'screen']);
    const lobbyArea = document.createElement('div');
  
    app.appendChild(lobbyScreen);
    lobbyScreen.appendChild(lobbyArea);
  
    window.application.renderBlock('lobby-block', lobbyArea);
    window.application.renderBlock('play-button', lobbyScreen);
    window.application.renderBlock('back-button', lobbyScreen);
  
    const replayButton = document.querySelector('.play-button');
    replayButton.textContent = 'ИГРАТЬ';
}

function renderWinBlock(container) {
    const winText = createNode('h1', 'ТЫ ПОБЕДИЛ!', 'result-title-win');
  
    container.appendChild(winText);
}

function renderFailBlock(container) {
    const failText = createNode('h1', 'ТЫ ПРОИГРАЛ!', 'result-title-fail');
  
    container.appendChild(failText);
}

function renderLobbyButton(container) {
    const lobbyButton = createNode('button', 'ПЕРЕЙТИ В ЛОББИ', ['lobby-button', 'button']);
  
    lobbyButton.addEventListener('click', () => {
      disableAllButtons(container, true);
  
      window.application.renderScreen('lobby-screen');
    });
  
    container.appendChild(lobbyButton);
}

function renderPlayButton(container) {
    const playButton = createNode('button', 'ИГРАТЬ!', ['play-button', 'button']);
 
    playButton.addEventListener('click', () => {
        disableAllButtons(container, true);

        request ({
            url: `${backURL}start`,
            params: {
                token: window.application.player.token,
            },
            onSuccess: (data) => {
                if (isStatusOk(data)) {
                    window.application.player.gameId = data['player-status'].game.id;
                    window.application.renderScreen('waiting-game-screen');
                }
                if (isStatusError(data)) {
                    alert(data.message);
            
                    disableAllButtons(container, false);
                }
            }
        });
    });

    container.appendChild(playButton);
}

function renderBackButton(container) {
    const backButton = createNode('button', 'ВЫЙТИ', 'button');

    backButton.addEventListener('click', () => {
        request({
            url: `${backURL}logout`,
            params: {
                token: window.application.player.token,
            },
            onSuccess: (data) => {
                disableAllButtons(container, true);

                window.application.renderScreen('login-screen');
            }
        });
    });
    container.appendChild(backButton);
}

function renderWinScreen() {
    app.textContent = '';
  
    const winScreen = createNode('div', null, ['win-screen', 'screen']);
  
    app.appendChild(winScreen);
  
    window.application.renderBlock('win-block', winScreen);
    window.application.renderBlock('lobby-button', winScreen);
    window.application.renderBlock('play-button', winScreen);
  
    const replayButton = document.querySelector('.play-button');
    replayButton.textContent = 'ИГРАТЬ ЕЩЕ!';
}

function renderFailScreen() {
    app.textContent = '';
  
    const failScreen = createNode('div', null, ['fail-screen', 'screen']);
  
    app.appendChild(failScreen);
  
    window.application.renderBlock('fail-block', failScreen);
    window.application.renderBlock('lobby-button', failScreen);
    window.application.renderBlock('play-button', failScreen);
  
    const replayButton = document.querySelector('.play-button');
    replayButton.textContent = 'ИГРАТЬ ЕЩЕ!';
}

function turnCheck() {
    request({
        url: `${backURL}game-status`,
        params: {
            token: window.application.player.token,
            id: window.application.player.gameId,
        },
        onSuccess: (data) => {
            if (isStatusError(data)) {
                console.log(data.status + data.messague);
              } else {
                if (isGameStatusWin(data)) {
                  window.application.renderScreen('win-screen');
                } else if (isGameStatusLose(data)) {
                  window.application.renderScreen('fail-screen');
                } else if (isGameStatusWaitingYourMove(data)) {
                  window.application.renderScreen('double-turn');
                }
            }   
        }
    });
}

function renderTurnBlock(container) {
    const turnText = createNode('h1', 'ХОДИ', 'turn-block');
    container.appendChild(turnText);

    const enemyLogin = document.createElement('h2');
    let reserve = JSON.parse(localStorage.getItem('myStorage'));
    if (window.application.player.gameId === '') {
        window.application.player.token = reserve.player.token;
        window.application.player.gameId = reserve.player.gameId;
    }

    request({
        url: `${backURL}game-status`,
        params: {
            token: window.application.player.token,
            id: window.application.player.gameId,
        },
        onSuccess: (data) => {
            if (isStatusNotError(data)) {
                let gameStatus = data['game-status'];
                let enemy = gameStatus.enemy.login;
          
                const enemyName = createNode('span', enemy, 'enemy-name-red');
          
                enemyLogin.append('ТВОЙ ПРОТИВНИК : ', enemyName);
            } else {
                alert('Ошибка сервера');
                window.application.renderScreen('login-screen');
            }
        }
    });

    enemyLogin.classList.add('turn-block');
    container.appendChild(enemyLogin);
}

function renderDoubleTurnBlock(container) {
    const doubleTurnBottomText = createNode('h2', 'НИЧЬЯ, ДАВАЙ ЕЩЕ РАЗОК', 'turn-block');
    container.appendChild(doubleTurnBottomText);
}

function renderRockButton(container) {
    const rockButton = createNode('button', 'КАМЕНЬ', ['rock-button', 'button']);
    container.appendChild(rockButton);

    rockButton.addEventListener('click', () => {
        disableAllButtons(container, true);

        request({
            url: `${backURL}play`,
            params: {
                token: window.application.player.token,
                id: window.application.player.gameId,
                move: 'rock',
            },
            onSuccess: (data) => {
                if (isStatusNotError(data)) {
                    if (isGameStatusWaitingForEnemyMove(data)) {
                      window.application.renderScreen('waiting-enemy-screen');
                    } else if (isGameStatusWin(data)) {
                      window.application.renderScreen('win-screen');
                    } else if (isGameStatusLose(data)) {
                      window.application.renderScreen('fail-screen');
                    } else if (isGameStatusWaitingYourMove(data)) {
                      window.application.renderScreen('double-turn');
                    }
                } else {
                    console.log(data.status + ' ' + data.message);
                    request({
                        url: `${backURL}logout`,
                        params: {
                            token: window.application.player.token,
                        },
                        onSuccess: (data) => {
                            disableAllButtons(container, true);
                            alert('Ошибка сервера');
                            window.application.player.token = '';
                            window.application.player.gameId = '';
                            window.application.renderScreen('login-screen');
                        },
                    });
                }
            }
        });
    });
}

function renderScissorsButton(container) {
    const scissorsButton = createNode('button', 'НОЖНИЦЫ', ['scissors-button', 'button']);
    container.appendChild(scissorsButton);

    scissorsButton.addEventListener('click', () => {
        disableAllButtons(container, true);

        request({
            url: `${backURL}play`,
            params: {
                token: window.application.player.token,
                id: window.application.player.gameId,
                move: 'scissors',
            },
            onSuccess: (data) => {
                if (isStatusNotError(data)) {
                    if (isGameStatusWaitingForEnemyMove(data)) {
                      window.application.renderScreen('waiting-enemy-screen');
                    } else if (isGameStatusWin(data)) {
                      window.application.renderScreen('win-screen');
                    } else if (isGameStatusLose(data)) {
                      window.application.renderScreen('fail-screen');
                    } else if (isGameStatusWaitingYourMove(data)) {
                      window.application.renderScreen('double-turn');
                    }
                } else {
                    console.log(data.status + ' ' + data.message);
                    request({
                        url: `${backURL}logout`,
                        params: {
                            token: window.application.player.token,
                        },
                        onSuccess: (data) => {
                            disableAllButtons(container, true);
                            alert('Ошибка сервера');
                            window.application.player.token = '';
                            window.application.player.gameId = '';
                            window.application.renderScreen('login-screen');
                        }
                    });
                } 
            }
        });
    });
}

function renderPaperButton(container) {
    const paperButton = createNode('button', 'БУМАГА', ['paper-button', 'button']);
    container.appendChild(paperButton);

    paperButton.addEventListener('click', () => {
        disableAllButtons(container, true);

        request({
            url: `${backURL}play`,
            params: {
                token: window.application.player.token,
                id: window.application.player.gameId,
                move: 'paper',
            },
            onSuccess: (data) => {
                if (isStatusNotError(data)) {
                    if (isGameStatusWaitingForEnemyMove(data)) {
                      window.application.renderScreen('waiting-enemy-screen');
                    } else if (isGameStatusWin(data)) {
                      window.application.renderScreen('win-screen');
                    } else if (isGameStatusLose(data)) {
                      window.application.renderScreen('fail-screen');
                    } else if (isGameStatusWaitingYourMove(data)) {
                      window.application.renderScreen('double-turn');
                    }
                } else {
                    console.log(data.status + ' ' + data.message);
                    request({
                        url: `${backURL}logout`,
                        params: {
                            token: window.application.player.token,
                        },
                        onSuccess: (data) => {
                            disableAllButtons(container, true);
                            alert('Ошибка сервера');
                            window.application.player.token = '';
                            window.application.player.gameId = '';
                            window.application.renderScreen('login-screen');
                        }
                    });
                }
            }
        });
    });
}

function renderTurnScreen() {
    app.textContent = '';
    const turnScreen = createNode('div', null, ['turn-screen', 'screen']);
    app.appendChild(turnScreen);
  
    window.application.renderBlock('turn-block', turnScreen);
    window.application.renderBlock('rock-button', turnScreen);
    window.application.renderBlock('scissors-button', turnScreen);
    window.application.renderBlock('paper-button', turnScreen);
}

function renderDoubleTurnScreen() {
    app.textContent = '';
    const doubleTurnScreen = createNode('div', null, ['turn-screen', 'screen']);
    app.appendChild(doubleTurnScreen);
  
    window.application.renderBlock('double-turn-block', doubleTurnScreen);
    window.application.renderBlock('rock-button', doubleTurnScreen);
    window.application.renderBlock('scissors-button', doubleTurnScreen);
    window.application.renderBlock('paper-button', doubleTurnScreen);
}

function renderWaitingTurnBlock(container) {
    const waitingGameText = createNode('h1', 'ОЖИДАНИЕ ПРОТИВНИКА..', 'waiting-game-block');
    container.appendChild(waitingGameText);
}

function renderWaitingTurnScreen() {
    app.textContent = '';
    const waitingTurnScreen = createNode('div', null, ['waiting-enemy-block','loader', 'screen']);
  
    app.appendChild(waitingTurnScreen);
  
    window.application.renderBlock('waiting-turn-block', waitingTurnScreen);
  
    window.application.timers.push(setInterval(turnCheck, 500));
  
    setTimeout(() => {
      window.application.renderBlock('back-button', waitingTurnScreen);
    }, 10000);
}

function waitingForStart() {
    request({
        url: `${backURL}game-status`,
        params: {
            token: window.application.player.token,
            id: window.application.player.gameId,
        },
        onSuccess: (data) => {
            if (isStatusError(data)) {
                console.log(data.status + ' ' + data.message);
            } else {
                if (isGameStatusNotWaitingForStart(data)) {
                  window.application.renderScreen('vs-screen');
                }
            }
        }
    });
}

function renderVsBlock(container) {
    const vsText1 = createNode('h1', null, 'enemy-name');
    const vsText2 = createNode('h1', null, 'enemy-name-red');
  
    container.appendChild(vsText1);
    container.appendChild(vsText2);
    request({
        url: `${backURL}game-status`,
        params: {
            token: window.application.player.token,
            id: window.application.player.gameId,
        },
        onSuccess: (data) => {
            vsText1.textContent = `ТВОЙ ПРОТИВНИК :`;
            vsText2.textContent = data['game-status'].enemy.login;
        }
    })
}

function renderVsScreen() {
    app.textContent = '';
    const vsScreen = createNode('div', null, 'screen');
  
    app.appendChild(vsScreen);
  
    window.application.renderBlock('vs-block', vsScreen);
  
    setTimeout(() => {
      window.application.renderScreen('turn');
    }, 3000);
}

function renderWaitingGameBlock(container) {
    const waitingGameText = createNode('h1', 'ИДЕТ ПОИСК ПРОТИВНИКА..', 'waiting-game-block');
    container.appendChild(waitingGameText);
    localStorage.setItem('myStorage', JSON.stringify(window.application))
}

function renderWaitingGameScreen() {
    app.textContent = '';
  
    const waitingGameScreen = createNode('div', null, ['waiting-game-screen', 'loader', 'screen']);
    app.appendChild(waitingGameScreen);
  
    window.application.renderBlock('waiting-game-block', waitingGameScreen);
    window.application.timers.push(setInterval(waitingForStart, 500));
    setTimeout(() => {
      window.application.renderBlock('back-button', waitingGameScreen);
    }, 10000);
}

function disableAllButtons(container, isTrue) {
    const allButtons = container.querySelectorAll('.button');
  
    for (let currentButton of allButtons) {
      currentButton.disabled = isTrue;
    }
}