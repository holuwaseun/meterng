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
}])