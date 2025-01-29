import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

class ErrorNotification extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export async function handleResponse(response) {
    if (response.status === 200) {
        return response.json();
    } else if (response.status === 403) {
        throw new ErrorNotification(response.status, response.statusText);
    } else {
        const error = await response.json();
        throw new ErrorNotification(response.status, error.message);
    }
}

const server = process.env.NODE_ENV === 'development' ? "http://localhost:8000/api/v1" : "http://log-bg.mb.tu-dortmund.de/api/v1"; // "https://flw-businessgame.de/api/v1"; // "https://log-bg.mb.tu-dortmund.de/api/v1";
// const ws_server = process.env.NODE_ENV === 'development' ? "ws://localhost:8080" : "wss://flw-businessgame.de/wsapp/";
const ws_server = process.env.NODE_ENV === 'development' ? "http://localhost:8000/websocket" : "http://log-bg.mb.tu-dortmund.de/websocket/"; // "https://flw-businessgame.de/websocket/"; // "https://log-bg.mb.tu-dortmund.de/websocket/";
let websocket = undefined;


export function createWebSocket(store) {
    if (!store.getters.isLoggedIn) return;
    let unique_id = store.getters.getPlayerId;

    let currentGameId = store.getters.currentGameId;

    let socket = new SockJS(ws_server);
    socket.hasDebug = false;
    websocket = Stomp.over(socket);
    // eslint-disable-next-line no-unused-vars
    websocket.debug = function (str) {};
    websocket.connect(
        {},
        () => {
            websocket.subscribe("/topic/updateGame", tick => {
                store.dispatch("update", JSON.parse(tick.body));
            });
            websocket.send("/ws/joinGame", JSON.stringify({ gameId: currentGameId, playerId: unique_id}), {})
        },
        error => {
            console.error(error);
        }
    );

    // websocket = new WebSocket(`${ws_server}`);
    // websocket.onopen = () => websocket.send(JSON.stringify({_id: currentGameId}));
    // websocket.onmessage = (event) => store.dispatch("update", JSON.parse(event.data));
    // websocket.onclose = () => {
    //     if (!store.getters.isLoggedIn || !store.getters.currentGameId) return;
    //     console.log("Websocket closed. Trying to reconnect");
    //     createWebSocket(store);
    // };
}

export function closeWS() {
    // websocket.close();
    websocket.disconnect();
}

export function leaveGame(store) {
    let currentGameId = store.getters.currentGameId;
    websocket.send("/ws/leaveGame", JSON.stringify(currentGameId), {})
}

export function fetchPOST(url, payload) {
    return fetch(`${server}/${url}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
        .then(response => handleResponse(response))
}

export function fetchPOSTHeader(url, payload, token) {
    return fetch(`${server}/${url}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        })
        .then(response => handleResponse(response));
}

export function fetchGETHeader(url, token) {
    return fetch(`${server}/${url}`,
        {headers: {'Authorization': `Bearer ${token}`}})
        .then(response => handleResponse(response))
}

export function fetchDELETEHeader(url, token) {
    return fetch(`${server}/${url}`,
        {method: "DELETE", headers: {'Authorization': `Bearer ${token}`}}
    ).then((response) => handleResponse(response));
}