angular.module("App-Routes", ["ui.router"])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state("index", {
            url: "/index",
            templateUrl: "app/views/pages/page.index.html",
            access: { restricted: false },
            controller: "IndexController",
            controllerAs: "index",
            onEnter: ($rootScope, $state) => {
                $rootScope.title = `Instant Purchase`
                $rootScope.current_path = 'index'
            }
        })
        .state("payment", {
            url: "/payment",
            templateUrl: "app/views/pages/page.payment.html",
            access: { restricted: false },
            controller: "PaymentController",
            controllerAs: "payment",
            onEnter: ($rootScope, $state) => {
                $rootScope.title = `Make Payment`
                $rootScope.current_path = 'index'
            }
        })
        .state("purchase_complete", {
            url: "/purchase/success",
            templateUrl: "app/views/pages/page.purchase_complelte.html",
            access: { restricted: false },
            controller: "PurchaseController",
            controllerAs: "purchase",
            onEnter: ($rootScope, $state) => {
                $rootScope.title = `Purchase Complete`
                $rootScope.current_path = 'index'
            }
        })
        .state("purchase_error", {
            url: "/purchase/error",
            templateUrl: "app/views/pages/page.purchase_error.html",
            access: { restricted: false },
            controller: "PurchaseController",
            controllerAs: "purchase",
            onEnter: ($rootScope, $state) => {
                $rootScope.title = `Purchase Failed`
                $rootScope.current_path = 'index'
            }
        })
        .state("login", {
            url: "/login",
            templateUrl: "app/views/pages/page.login.html",
            access: { restricted: false },
            controller: "AuthController",
            controllerAs: "access",
            onEnter: ($rootScope, $state) => {
                $rootScope.title = `Sign In`
                $rootScope.current_path = 'access'
            }
        })
        .state("signup", {
            url: "/signup",
            templateUrl: "app/views/pages/page.signup.html",
            access: { restricted: false },
            controller: "AuthController",
            controllerAs: "access",
            onEnter: ($rootScope, $state) => {
                $rootScope.title = `Sign Up`
                $rootScope.current_path = 'access'
            }
        })
        .state("main", {
            templateUrl: "app/views/pages/page.main.html"
        })
        .state("main.dashboard", {
            url: "/main/dashboard",
            templateUrl: "app/views/pages/page.dashboard.html",
            controller: "DashboardController",
            controllerAs: "dashboard",
            onEnter: ($rootScope, $state) => {
                if (!$rootScope.logged_in) {
                    $state.go("login", null, { reload: true })
                }
                $rootScope.title = `MeterNG - Dashboard`
            }
        })
        .state("main.report", {
            url: "/main/report",
            templateUrl: "app/views/pages/page.report.html",
            access: { restricted: true },
            controller: "ReportController",
            controllerAs: "report",
            onEnter: ($rootScope, $state) => {
                if (!$rootScope.logged_in) {
                    $state.go("login", null, { reload: true })
                }
                $rootScope.title = `MeterNG - Reports`
            }
        })
        .state("main.members", {
            url: "/main/members",
            templateUrl: "app/views/pages/page.members.html",
            access: { restricted: true },
            controller: "DashboardController",
            controllerAs: "dashboard",
            onEnter: ($rootScope, $state) => {
                if (!$rootScope.logged_in) {
                    $state.go("login", null, { reload: true })
                }
                $rootScope.title = `MeterNG - Registered Users`
            }
        })
        .state("recover_password", {
            url: "/recover_password",
            templateUrl: "app/views/pages/page.recover_password.html",
            access: { restricted: false },
            controller: "PasswordController",
            controllerAs: "password",
            onEnter: ($rootScope, $state) => {
                $rootScope.title = `Recover Password`
            }
        })
        .state("contact_us", {
            url: "/contact_us",
            templateUrl: "app/views/pages/page.contact_us.html",
            access: { restricted: false },
            controller: "ContactController",
            controllerAs: "contact",
            onEnter: ($rootScope, $state) => {
                $rootScope.title = `Contact Us`
                $rootScope.current_path = 'contact'
            }
        })
        .state("error", {
            templateUrl: "app/views/pages/page.error.html"
        })
        .state("error.404", {
            url: "/error/404",
            templateUrl: "app/views/pages/page.404.html",
            onEnter: ($rootScope, $state) => {
                $rootScope.title = `VLS - Error`
            }
        })
        .state("error.500", {
            url: "/error/500",
            templateUrl: "app/views/pages/page.500.html",
            onEnter: ($rootScope, $state) => {
                $rootScope.title = `VLS - Error`
            }
        })

    $urlRouterProvider.otherwise('/index')
}])