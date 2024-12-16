import BoardCreatePage from "../pages/BoardCreatePage.vue";
import BoardListPage from "../pages/BoardListPage.vue";

const BoardRoutes = [
    {
        path: "/board/list",
        name: "BoardListPage",
        component: BoardListPage
    },
    {
        path: "/board/create",
        name: "BoardCreatePage",
        component: BoardCreatePage
    },
]

export default BoardRoutes