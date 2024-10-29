export default {
    state() {return {
        orderCancelCost : [0.25, 0.2, 0.1, 0.05, 0.01]
    }},
    getters: {
        orderCancelCost(state) {
            return state.orderCancelCost;
        },
        orders(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.orders;
        },
        customerJobs(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.customerJobs;
        },
        articleDynamic: (state, getters, rootState) => (id) => {
            if (rootState.currentGame === undefined) return {};
            return rootState.currentGame.currentState.articleDynamics.find(dynamic => dynamic.article.articleNumber === id);
        },
        articleDynamics(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.articleDynamics;
        },
        freeStocks(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.free_storage;
        },
        occStocks(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.occ_storage;
        },
        palletsTransportedProcess(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.roundValues.pallets_transported_process;
        },
        palletsNotTransportedProcess(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.roundValues.pallets_not_transported_process;
        },

    }
}