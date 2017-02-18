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
    const access = this

    access.requestAuth = () => {
        access.processing = true
        Auth.login(access.new_login).then((response) => {
            access.processing = false
            if (response.status === 200 && response.success === true) {
                new PNotify({
                    title: 'Auth Passed',
                    text: response.message,
                    type: 'success',
                    delay: 3000,
                    styling: 'bootstrap3'
                })
                $state.go("main.dashboard", null, { reload: true })
            } else {
                new PNotify({
                    title: 'Auth Failed',
                    text: response.message,
                    type: 'error',
                    delay: 3000,
                    styling: 'bootstrap3'
                })
            }
        })
    }

    access.createAccount = () => {
        access.processing = true

        if (access.new_account.password.length < 6) {
            access.processing = false
            new PNotify({
                title: 'Input Error',
                text: "Password length should be greater than 6, please try again",
                type: 'error',
                delay: 3000,
                styling: 'bootstrap3'
            })
            return false
        }

        if (access.new_account.password !== access.new_account.verify_password) {
            access.processing = false
            new PNotify({
                title: 'Input Error',
                text: "Passwords do not match, please try again",
                type: 'error',
                delay: 3000,
                styling: 'bootstrap3'
            })
            return false
        }

        Auth.signup(access.new_account).then((response) => {
            access.processing = false

            if (response.status === 200 && response.success === true) {
                new PNotify({
                    title: 'Signup Complete',
                    text: response.message,
                    type: 'success',
                    delay: 3000,
                    styling: 'bootstrap3'
                })
                $state.go("main.dashboard", null, { reload: true })
            } else {
                new PNotify({
                    title: 'Signup Failed',
                    text: response.message,
                    type: 'error',
                    delay: 3000,
                    styling: 'bootstrap3'
                })
            }
        })
    }
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

.controller("DashboardController", ['$rootScope', '$scope', '$filter', '$state', 'Dashboard', 'Auth', function($rootScope, $scope, $filter, $state, Dashboard, Auth) {
    let dashboard = this

    dashboard.destroySession = () => {
        Auth.destroySession().then((response) => {
            $rootScope.logged_in = Auth.isLoggedIn()
            if (!$rootScope.logged_in) {
                $state.go("index", null, { reload: true })
            }
        })
    }

    if ($rootScope.user_data.account_type === 'User') {
        dashboard.latest_transaction = []

        Dashboard.latestTransaction().then((response) => {
            if (response.status === 200) {
                dashboard.latest_transaction = response.transaction_data
            } else {
                dashboard.latest_transaction = []
                new PNotify({
                    title: response.message,
                    text: response.error_message,
                    type: 'error',
                    delay: 3000,
                    styling: 'bootstrap3'
                })
            }
        })
    }
}])

.controller("ReportController", ['$rootScope', '$scope', '$filter', '$state', function($rootScope, $scope, $filter, $state) {

}])

.controller("ContactController", ['$rootScope', '$scope', '$filter', '$state', function($rootScope, $scope, $filter, $state) {

}])

.controller("PasswordController", ['$rootScope', '$scope', '$filter', '$state', function($rootScope, $scope, $filter, $state) {

}])