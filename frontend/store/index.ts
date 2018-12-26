import Vue from 'vue';
import Vuex from 'vuex';
import * as user from './modules/user';
import * as root from './root';

Vue.use(Vuex);

interface ModulesStates {
    user: user.State;
}

export type RootState = root.State & ModulesStates;

export default () => new Vuex.Store({
    state: root.state() as any,
    getters: root.getters,
    mutations: root.mutations,
    actions: root.actions as any,
    modules: {
        [user.name]: user
    }
});