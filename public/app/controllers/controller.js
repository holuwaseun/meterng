angular.module("Controller", ["Auth-Service", "Service"])

.controller("IndexController", ['$rootScope', '$scope', '$filter', '$state', 'LightUp', 'QuickTeller', function($rootScope, $scope, $filter, $state, LightUp, QuickTeller) {
    QuickTeller.get_billers().then((response) => {
        console.log(response)
    })

    if (!$rootScope.lightup_token) {
        LightUp.get_access_token($rootScope.lightup).then((response) => {
            console.log(response)
        })
    } else {
        console.log($rootScope.lightup_token)
    }

}])

.controller("AuthController", ['$rootScope', '$scope', '$filter', '$state', 'Auth', function($rootScope, $scope, $filter, $state, Auth) {

}])

.controller("PaymentController", ['$rootScope', '$scope', '$filter', '$state', function($rootScope, $scope, $filter, $state) {
    $scope.payment_detail = {
        meter_number: "04177511344",
        meter_name: "FCDA QTRS",
        meter_address: "Life Camp, AE",
        city: "Abuja",
        mobile_number: "08036550233",
        email_address: "olusisayo@gmail.com",
        total_amount: 3000,
        convenience_fee: 0
    }

    $scope.payment_detail.total_charge = (parseFloat($scope.payment_detail.total_amount) + parseFloat($scope.payment_detail.convenience_fee));
}])

.controller("PurchaseController", ['$rootScope', '$scope', '$filter', '$state', function($rootScope, $scope, $filter, $state) {

}])

.controller("DashboardController", ['$rootScope', '$scope', '$filter', '$state', function($rootScope, $scope, $filter, $state) {

}])

.controller("ReportController", ['$rootScope', '$scope', '$filter', '$state', function($rootScope, $scope, $filter, $state) {

}])

.controller("ContactController", ['$rootScope', '$scope', '$filter', '$state', function($rootScope, $scope, $filter, $state) {

}])

.controller("PasswordController", ['$rootScope', '$scope', '$filter', '$state', function($rootScope, $scope, $filter, $state) {

}])