const STATUSES = {
    EMPTY: '',
    OK: 'ok',
    ERROR: 'error',
    LOBBY: 'lobby',
    GAME: 'game',
    WAITINGFORSTART: 'waiting-for-start',
    WAITINGYOURMOVE: 'waiting-your-move',
    WAITINGFORENEMYMOVE: 'waiting-for-enemy-move',
    LOSE: 'lose',
    WIN: 'win',
}


function isPlayerStatusLobby(data) {
    return data['player-status'].status === STATUSES.LOBBY
}

function isPlayerStatusGame(data) {
    return data['player-status'].status === STATUSES.GAME
}

function isPlayerIdNotEmpty(data) {
    return data['player-status'].game.id !== STATUSES.EMPTY
}

function isGameStatusWaitingForStart(data) {
    return data['game-status'].status === STATUSES.WAITINGFORSTART
}

function isGameStatusNotWaitingForStart(data) {
    return data['game-status'].status !== STATUSES.WAITINGFORSTART
}

function isGameStatusWaitingYourMove(data) {
    return data['game-status'].status === STATUSES.WAITINGYOURMOVE
}

function isGameStatusWaitingForEnemyMove(data) {
    return data['game-status'].status === STATUSES.WAITINGFORENEMYMOVE
}

function isGameStatusLose(data) {
    return data['game-status'].status === STATUSES.LOSE
}

function isGameStatusWin(data) {
    return data['game-status'].status === STATUSES.WIN
}

function isStatusOk(data) {
    return data.status === STATUSES.OK
}

function isStatusError(data) {
    return data.status === STATUSES.ERROR
}

function isStatusNotError(data) {
    return data.status !== STATUSES.ERROR
}