export default {
    state() {
        return {
            //processNames: ["UNLOADING", "COLLECTION","STORAGE","CONTROL","LOADING","DONE"],
            investment_options: [0, 100, 250, 400, 550],
            overtimeChoices: [0, 1, 2, 3],
            compensation_quota: 0.3,
            halftime_compensation: 0.6,
            new_employee_cost_indefinite: 500,
            new_employee_cost_temporary: 200,
            qualification_offset: [1, 2, 4],
            qualification_cost: [2300, 1700, 2250],
            qualification_duration: [2, 1, 2]
        }
    },
    getters: {
        compensationQuota(state) {
            return state.compensation_quota;
        },
        halfTimeCompensation(state) {
            return state.halftime_compensation;
        },
        fullTimeHireCost(state) {
            return state.new_employee_cost_indefinite;
        },
        halfTimeHireCost(state) {
            return state.new_employee_cost_temporary;
        },
        qualificationOffset(state) {
            return state.qualification_offset;
        },
        qualificationCost(state) {
            return state.qualification_cost;
        },
        qualificationDuration(state) {
            return state.qualification_duration;
        },
        investment_options(state) {
            return state.investment_options
        },
        overtimeChoices(state) {
            return state.overtimeChoices
        },
        employeeDynamics(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.employeeDynamics;
        },
        employeeStore(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.employeeStore;
        },
        workloadEmployees(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.roundValues.workload_employee;
        },
        overtimeProcess(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.roundValues.overtime_process;
        },
        previousOvertimeProcess(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.previousState.roundValues.overtime_process;
        },
        previousEmployeeDynamics(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.previousState.employeeDynamics;
        },
        employeeCountProcesses(state, getter, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.roundValues.emp_count_processes;
        },
        workload_employee_storage_in(state, getter, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.roundValues.workload_employee_storage_in;
        },
        workload_employee_storage_out(state, getter, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.roundValues.workload_employee_storage_out;
        },
    }
}