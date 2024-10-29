export default {
    state() {
        return {
            leConditionsCosts: [0, 450, 800],
            technologyCost: [0, 850, 1300, 1600],
            revertDuration: [[0, 0, 0], [7, 0, 0], [7, 5, 0], [7, 5, 3]],
            cost_abc_analysis: 10000,
            cost_abc_zoning: 5000,

            palletControlFactor: [0.0, 0.1, 0.2, 0.5, 1],
        }
    },
    getters: {
        roundNumber(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundNumber;
        },
        balance(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.accountBalance;
        },
        oldBalance(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.previousState.roundValues.accountBalance;
        },
        technologyCost(state) {
            return state.technologyCost
        },
        revertDuration(state) {
            return state.revertDuration
        },
        abcAnalysisCost(state) {
            return state.cost_abc_analysis
        },
        abcZoningCost(state) {
            return state.cost_abc_zoning
        },
        messages(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.messages;
        },
        transportedPallets(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.roundValues.pallets_transported_process;
        },
        nottransportedPallets(state, getters, rootState) {
            if (rootState.currentGame === undefined) return [];
            return rootState.currentGame.currentState.roundValues.pallets_not_transported_process;
        },
        transportedPalletsLaIn(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.pallets_transported_la_in;
        },
        transportedPalletsLaOut(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.pallets_transported_la_out;
        },
        nottransportedPalletsLaIn(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.not_transported_pallets_la_in;
        },
        nottransportedPalletsLaOut(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.not_transported_pallets_la_out;
        },
        salesIncome(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.sales_income;
        },
        orderCosts(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.current_order_costs;
        },
        storageCost(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.storage_cost;
        },
        worktimeCost(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.workTimeCost;
        },
        costsQualificationMeasure(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.costs_qualification_measure;
        },
        costsNewEmployees(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.costs_new_employees;
        },
        incomeConveyorSale(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.income_conveyor_sale;
        },
        costsMaintenance(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.costs_maintenance;
        },
        costsOverhaul(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.costs_overhaul;
        },
        costsRepair(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.costs_repair;
        },
        costsNew(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.costs_new;
        },
        costsUSD(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.costs_usd;
        },
        costsABC(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.costs_abc;
        },
        debitInterestCost(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.debit_interest_cost;
        },
        creditInterestCost(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.credit_interest_income;
        },
        workClimateInvestment(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.work_climate_invest;
        },
        technologies(state) {
            return state.technologies;
        },
        services(state) {
            return state.services;
        },
        leConditionsCosts(state) {
            return state.leConditionsCosts;
        },
        loadingEquipmentLevel(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.loading_equipment_level;
        },
        orderQuantity(state, getters, rootState) {
            if (rootState.currentGame === undefined) return false;
            return rootState.currentGame.currentState.roundValues.module_order_quantity;
        },
        reorderLevel(state, getters, rootState) {
            if (rootState.currentGame === undefined) return false;
            return rootState.currentGame.currentState.roundValues.module_reorder_level;
        },
        safetyStock(state, getters, rootState) {
            if (rootState.currentGame === undefined) return false;
            return rootState.currentGame.currentState.roundValues.module_safety_stock;
        },
        statusReport(state, getters, rootState) {
            if (rootState.currentGame === undefined) return false;
            return rootState.currentGame.currentState.roundValues.module_status_report;
        },
        lookInStorage(state, getters, rootState) {
            if (rootState.currentGame === undefined) return false;
            return rootState.currentGame.currentState.roundValues.module_look_in_storage;
        },
        itcosts(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.itCosts;
        },
        backToBasic(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.back_to_basic_storage;
        },
        backToLVL1(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.back_to_it_level1;
        },
        backToLVL2(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.back_to_it_level2;
        },

        palletControlFactor(state) {
            return state.palletControlFactor;
        },
        capacityDistribution(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.storage_factor;
        },
        inboundPalletControl(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.pallet_we_factor;
        },
        outboundPalletControl(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.pallet_wa_factor;
        },
        unitSecurityDevicesUsed(state, getters, rootState) {
            if (rootState.currentGame === undefined) return false;
            return rootState.currentGame.currentState.roundValues.unit_security_devices_used;
        },
        incomingStrategy(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.strategy_incoming;
        },
        storageStrategy(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.strategy_storage;
        },
        outboundStrategy(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.strategy_outgoing;
        },
        abcAnalysisRound(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.abc_analysis_round;
        },
        abcZoningRound(state, getters, rootState) {
            if (rootState.currentGame === undefined) return 0;
            return rootState.currentGame.currentState.roundValues.abc_zoning_round;
        },
    }
}