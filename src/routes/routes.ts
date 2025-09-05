const routes = [
    {
        name: "Home",
        path: "/",
        hasHeader: true,
        hasFooter: true
    },
    {
        name: "Resume",
        path: "/resume",
        hasHeader: true,
        hasFooter: true
    },
    {
        name: "Projects",
        path: "/projects",
        hasHeader: true,
        hasFooter: true
    },
    {
        name: "Contactme",
        path: "/contactme",
        hasHeader: true,
        hasFooter: true
    },
    {
        name: "AdminLogin",
        path: "/admin/login",
        hasHeader: false,
        hasFooter: false
    },
    {
        name: "AIData",
        path: "/admin/panel/aidata",
        hasHeader: false,
        hasFooter: false
    },
]

export default routes;