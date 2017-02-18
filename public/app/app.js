angular.module("MeterNG", ["App-Routes", "Auth-Service", "Controller", "ngAnimate", "angular-loading-bar", "ng-morris-js", "ngSanitize", "datatables"])

.config(['$httpProvider', function($httpProvider) {

    $httpProvider.interceptors.push("AuthInterceptor")

}])

.run(['$rootScope', '$filter', '$state', 'Auth', function($rootScope, $filter, $state, Auth) {

    $rootScope.lightup = {
        username: "general@demo.com",
        password: "G3n3ral@dem0.com",
        grant_type: "password"
    }

    $rootScope.facebook = {
        appID: '255146761528048',
        version: 'v2.6'
    }

    $rootScope.current_date = new Date()

    $rootScope.lightup_token;

    $rootScope.logged_in = false
    $rootScope.user_data = []

    $rootScope.$on("$stateChangeStart", (event, toState, toParams, fromState, fromParams, options) => {
        $rootScope.logged_in = Auth.isLoggedIn()

        if ($rootScope.logged_in) {
            Auth.getUser().then((response) => {
                $rootScope.user_data = response.user_data
                console.log(response)
            })
        }
    })

    $rootScope.$on('$stateNotFound', (event, unfoundState, fromState, fromParams) => {
        $state.go("error.403", null, { reload: true })
    })
}])