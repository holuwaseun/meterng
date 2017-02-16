angular.module("MeterNG", ["App-Routes", "Auth-Service", "Controller", "ngAnimate", "angular-loading-bar", "ngSanitize", "datatables"])

.config(['$httpProvider', function($httpProvider) {

    $httpProvider.interceptors.push("AuthInterceptor")

}])

.run(['$rootScope', '$filter', '$state', 'Auth', function($rootScope, $filter, $state, Auth) {

    $rootScope.lightup = {
        username: "general@demo.com",
        password: "G3n3ral@dem0.com",
        grant_type: "password"
    }

    $rootScope.lightup_token;

    $rootScope.logged_in = false
    $rootScope.user_data = []

    $rootScope.$on("$stateChangeStart", (event, toState, toParams, fromState, fromParams, options) => {
        $rootScope.logged_in = Auth.isLoggedIn()

        if ($rootScope.logged_in) {
            Auth.getUser().then((response) => {
                console.log(response)
                $rootScope.user_data = response.user_data
            })
        }
    })

    $rootScope.$on('$stateNotFound', (event, unfoundState, fromState, fromParams) => {
        $state.go("error.403", null, { reload: true })
    })
}])