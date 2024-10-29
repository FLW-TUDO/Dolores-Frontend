export default {
    state() {return {}},
    getters: {
        conveyorDynamics(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.conveyorDynamics;
        },
        conveyorStore(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.conveyorStore;
        },
        workloadConveyor(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.roundValues.workload_conveyor;
        },
        previousConveyorDynamics(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.previousState.conveyorDynamics;
        },
        repairCost(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.costs_repair;
        },
        repairDuration(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.repair_duration;
        },
        maintenanceCost(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.costs_maintenance;
        },
        convCountProcess(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.roundValues.conv_count_processes;
        },
        prevConvCountProcess(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.previousState.roundValues.conv_count_processes;
        },
        workload_conveyor_storage_in(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.roundValues.workload_conveyor_storage_in;
        },
        workload_conveyor_storage_out(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.roundValues.workload_conveyor_storage_out;
        },
        crash_time(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.roundValues.crash_time_processes;
        },
    }
}