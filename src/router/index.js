import {createRouter, createWebHistory} from 'vue-router';
import Menu from '../components/views/menu.vue';
import GameView from '../components/views/gameView.vue';
import Login from '../components/views/login.vue';
import LoadGame from '../components/views/loadGame.vue';
import Admin from '../components/views/admin.vue';
import InformationTechnology from "../components/company/informationTechnology.vue";
import OrderOverview from "../components/order_management/orderOverview.vue";
import ArticleOverview from "../components/order_management/articleOverview.vue";
import HumanResource from "../components/human_resource/humanResource.vue";
import JobMarket from "../components/human_resource/jobMarket.vue";
import Conveyor from "../components/conveyor/conveyor.vue";
import ConveyorMarket from "../components/conveyor/conveyorMarket.vue";
import OrganisationManagement from "../components/company/organisationMangement.vue";
import Finance from "../components/information/finance.vue";
import Information from "../components/information/dashboard.vue";
import Player from '../components/admin/player.vue';
import View from '../components/admin/viewGame.vue';
import store from '../store/index.js';
import KeyFigures from '../components/information/keyFigures.vue';
import AdminOverview from '../components/admin/adminOverview.vue';

const routes = [
    {name: 'main', path: '/', component: Menu},
    {name: 'loadGame', path: '/loadGame', component: LoadGame},
    {
        name: 'admin', path: '/admin', component: Admin, children: [
            {name: 'overview', path: 'overview', component: AdminOverview},
            {name: 'player', path: 'user', component: Player},
            {name: 'viewGame', path: 'viewGame/:userId', component: View, props: true},
        ]
    },
    {
        name: 'game', path: '/game', component: GameView, children: [
            {name: 'info', path: '', component: Information},
            {name: 'order', path: 'order', component: OrderOverview},
            {name: 'employee', path: 'employee', component: HumanResource},
            {name: 'job_market', path: 'job_market', component: JobMarket},

            {name: 'conveyor', path: 'conveyor', component: Conveyor},
            {name: 'conveyor_market', path: 'conveyor_market', component: ConveyorMarket},
            {name: 'technology', path: 'technology', component: InformationTechnology},
            {name: 'orga', path: 'orga', component: OrganisationManagement},

            {name: 'finance', path: 'finance', component: Finance},
            {name: 'keyfigures', path: 'keyfigures', component: KeyFigures},
            {
                name: 'article', path: 'article/:articleNumber', component: ArticleOverview, props: (route) => {
                    const articleNumber = Number.parseInt(route.params.articleNumber);
                    if (Number.isNaN(articleNumber)) return 100101;
                    else return {articleNumber: articleNumber};
                }
            },
        ]
    },
    {name: 'login', path: '/login', component: Login},
    {path: '/:notFound(.*)', redirect: '/'}
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})


router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && !store.getters.isLoggedIn) next({name: 'login'})
    else next()
})

export default router
