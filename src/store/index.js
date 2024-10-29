import {createStore} from 'vuex';
import createPersistedState from "vuex-persistedstate";
import Order from './modules/order.js';
import HumanResource from './modules/humanResource.js';
import Conveyor from './modules/conveyor.js';
import Information from './modules/information';
import moment from 'moment';
import {handleError, handleFetchError} from "@/middleware/errorHandler";
import {fetchDELETEHeader, fetchGETHeader, fetchPOST, fetchPOSTHeader} from "@/middleware/communication.handle";

const defaultState = () => {
    return {
        currentGame: undefined,
        gameIsLoading: false,
        currentUser: undefined,
        currentLobby: {
            id: 0,
            count: 0
        },
        isLoggedIn: false,
        error: {
            status: false,
            message: '',
            error: ''
        },
        playerId: (Math.random() + 1).toString(16)
    };
}

const state = defaultState();


export default createStore({
    plugins: [createPersistedState()],
    state,
    mutations: {
        setAuth(state, payload) {
            state.isLoggedIn = payload.isAuth;
        },
        setGame(state, payload) {
            state.currentGame = payload.game;
            state.gameIsLoading = false;
        },
        setState(state, payload) {
            state.currentGame.currentState = payload.state;
        },
        setServices(state, payload) {
            let newServices = payload.services;
            state.currentGame.currentState.roundValues.module_order_quantity = newServices.includes(0);
            state.currentGame.currentState.roundValues.module_reorder_level = newServices.includes(1);
            state.currentGame.currentState.roundValues.module_safety_stock = newServices.includes(2);
            state.currentGame.currentState.roundValues.module_status_report = newServices.includes(3);
            state.currentGame.currentState.roundValues.module_look_in_storage = newServices.includes(4);
        },
        setUser(state, payload) {
            state.currentUser = payload.user;
        },
        setError(state, payload) {
            state.error = payload.error;
        },
        resetState(state) {
            Object.assign(state, defaultState());
        },
        setLobbyId(state, payload) {
            let list = payload.playerId;
            state.currentLobby["id"] = list.indexOf(state.playerId);
        },
        setLobbyCount(state, payload) {
            state.currentLobby["count"] = payload.count;
        },
        setStorageFactor(state, payload) {
            state.currentGame.currentState.roundValues.storage_factor = payload.factor;
        },
        setGameIsLoading(state, payload) {
            state.gameIsLoading = payload.gameIsLoading;
        }
    },
    actions: {
        setGameIsLoading(context, payload) {
            context.commit("setGameIsLoading", payload);
        },
        removeCurrentGame(context) {
            context.commit("setGame", {game: undefined});
        },
        deleteAllGames(context) {
            fetchDELETEHeader("gameInfos", context.getters.currentUserToken)
                .catch(error => handleFetchError(context, error));
        },
        uploadGame(context, payload) {
            fetchPOSTHeader(`gameInfos/import`, payload, context.getters.currentUserToken)
                .then((data) => console.log(data.message))
                .catch(error => handleError(context, error));
        },
        createNewUser(context, payload) {
            fetchPOSTHeader(`users`, payload, context.getters.currentUserToken)
                .then(() => console.log('Created new User'))
                .catch(error => handleError(context, error));
        },
        resetStore(context) {
            context.commit("resetState");
        },
        updateError(context, payload) {
            context.commit("setError", {error: payload});
        },
        resetError(context) {
            context.commit("setError", {
                error: {status: false, message: '', error: ''}
            });
        },
        update(context, payload) {
            let updatedAt = payload.updatedAt;
            let type = payload.type;
            let gameId = payload.gameId;
            if (!context.state.currentGame)
                return;
            if (type === "game" && moment(context.state.currentGame.updatedAt) < moment(updatedAt) && gameId === context.state.currentGame.id) {
                console.log("Update game")
                context.dispatch("loadGame", {gameId: context.state.currentGame.id});
            } else if (type === "state" && moment(context.state.currentGame.currentState.updatedAt) < moment(updatedAt) && gameId === context.state.currentGame.id) {
                console.log("Update state")
                context.dispatch("loadState", {stateId: context.state.currentGame.currentState.id});
            } else if (type === "lobbyJoin" && gameId === context.state.currentGame.id) {
                context.commit("setLobbyCount", payload);
                context.commit("setLobbyId", payload);
            } else if (type === "calculation" && gameId === context.state.currentGame.id) {
                context.commit("setGameIsLoading", {gameIsLoading: true});
            }
        },
        async login(context, payload) {
            fetchPOST('users/login', payload)
                .then(data => {
                    if (data === null) {
                        context.commit('resetState');
                    } else {
                        context.commit('setAuth', {isAuth: true});
                        context.commit('setUser', {user: data});
                    }
                })
                .catch(error => handleError(context, error));
        },
        logout(context) {
            context.commit('resetState');
        },
        async newGame(context, payload) {
            let gameName = payload.gameName;
            fetchPOSTHeader(
                'gameInfos/',
                {
                    gameName: gameName,
                    playerId: context.state.currentUser._id,
                },
                context.getters.currentUserToken
            )
                .then(data => context.commit('setGame', {game: data}))
                .catch(error => handleError(context, error));
        },
        async nextRound(context, payload) {
            const gameId = payload.gameId;
            fetchGETHeader(`gameInfos/${gameId}/nextRound`, context.getters.currentUserToken)
                .then(data => context.commit('setGame', {game: data}))
                .catch(error => handleError(context, error));
        },
        async revertRound(context, payload) {
            const gameId = payload.gameId;
            fetchGETHeader(`gameInfos/${gameId}/previousRound`, context.getters.currentUserToken)
                .then(data => context.commit('setGame', {game: data}))
                .catch(error => handleError(context, error));
        },
        async loadGame(context, payload) {
            const gameId = payload.gameId;
            fetchGETHeader(`gameInfos/${gameId}`, context.getters.currentUserToken)
                .then(data => context.commit('setGame', {game: data}))
                .catch(error => handleError(context, error));
        },
        async loadState(context, payload) {
            const stateId = payload.stateId;
            fetchGETHeader(`gameState/${stateId}`, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async terminateEmployee(context, payload) {
            let stateId = payload.stateId;
            let employeeId = payload.employeeId;
            fetchGETHeader(`gameState/${stateId}/employees/terminate/${employeeId}`, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error)
                )
            ;
        },
        async cancelOrder(context, payload) {
            let stateId = payload.stateId;
            let orderId = payload.orderId;
            fetchGETHeader(`gameState/${stateId}/order/${orderId}`, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error)
                )
            ;
        },
        async order(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/order`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async hireEmployee(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/employees/`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async trainEmployee(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/employees/train`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async updateEmployeeProcess(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/employees/process`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async setOvertime(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/overtime`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async setClimateInvest(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/investment`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async updateConveyorProcess(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/conveyor/process`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async updateConveyorMaintenance(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/conveyor/maintenance`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async overhaulConveyor(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/conveyor/overhaul`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async sellConveyor(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/conveyor/sell`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async buyConveyor(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/conveyor/buy`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async changeLoadingEquipmentLevel(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/information/lelevel`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async updateServices(context, payload) {
            context.commit('setServices', {services: payload.services});
        },
        async changeServices(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/information/service`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async changeTechnology(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/information/technology`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async changeCapacityDistribution(context, payload) {
            context.commit('setStorageFactor', {factor: payload.distribution});
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/organisation/capacity`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async changeInboundControl(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/organisation/inbound`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async changeOutboundControl(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/organisation/outbound`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async changeUnitSecurityDevices(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/organisation/unitsecurity`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async changeIncomingStrategy(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/organisation/incstrategy`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));

        },
        async changeStorageStrategy(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/organisation/storstrategy`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async changeOutboundStrategy(context, payload) {
            let stateId = payload.stateId;
            fetchPOSTHeader(`gameState/${stateId}/organisation/outstrategy`, payload, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
        async initiateABCAnalysis(context, payload) {
            let stateId = payload.stateId;
            fetchGETHeader(`gameState/${stateId}/organisation/analysis`, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));

        },
        async initiateABCZoning(context, payload) {
            let stateId = payload.stateId;
            fetchGETHeader(`gameState/${stateId}/organisation/zoning`, context.getters.currentUserToken)
                .then(data => context.commit('setState', {state: data}))
                .catch(error => handleError(context, error));
        },
    },
    modules: {
        hr: HumanResource,
        order: Order,
        conveyor: Conveyor,
        info: Information
    },
    getters: {
        getPlayerId(state) {
          return state.playerId;
        },
        gameIsLoading(state) {
            return state.gameIsLoading;
        },
        error(state) {
            return state.error;
        },
        currentLobbyId(state) {
            return state.currentLobby["id"];
        },
        currentLobbyCount(state) {
            return state.currentLobby["count"];
        },
        currentStateId(state) {
            if (state.currentGame === undefined) return 0;
            return state.currentGame.currentState.id;
        },
        currentGameId(state) {
            if (state.currentGame === undefined) return 0;
            return state.currentGame.id;
        },
        currentUserId(state) {
            if (state.currentUser === undefined) return 0;
            return state.currentUser.id;
        },
        currentUserToken(state) {
            if (state.currentUser === undefined) return 0;
            return state.currentUser.accessToken;
        },
        currentState(state) {
            if (state.currentGame === undefined) return {};
            return state.currentGame.currentState;
        },
        currentRoundValues(state) {
            if (state.currentGame === undefined) return {};
            return state.currentGame.currentState.roundValues;
        },
        customerSatisfaction(state) {
            if (state.currentGame === undefined) return 0;
            return state.currentGame.currentState.roundValues.customer_satisfaction;
        },
        currentUser(state) {
            if (state.currentUser === undefined) return {};
            return state.currentUser;
        },
        isLoggedIn(state) {
            return state.isLoggedIn;
        },
        revertAllowed(state) {
            if (state.currentGame === undefined) return false;
            return state.currentGame.revertAllowed;
        },
    }
})
