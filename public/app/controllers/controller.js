angular.module("Controller", ["Auth-Service", "Service"])

.controller("IndexController", ['$rootScope', '$scope', '$filter', '$state', 'LightUp', 'QuickTeller', function($rootScope, $scope, $filter, $state, LightUp, QuickTeller) {
    $scope.billers = []
    QuickTeller.get_billers().then((response) => {
        if (response.billers) {
            let b
            for (b = 105; b <= 122; b++) {
                if (response.billers[b].categoryid === "1") {
                    $scope.billers.push($response.billers[b])
                }
            }
        }
    })

    if (!$rootScope.lightup_token) {
        LightUp.get_access_token($rootScope.lightup).then((response) => {
            console.log(response)
        })
    } else {
        console.log($rootScope.lightup_token)
    }

}])

.controller("AuthController", ['$rootScope', '$scope', '$filter', '$window', '$state', 'Auth', 'Facebook', function($rootScope, $scope, $filter, $window, $state, Auth, Facebook) {
    const access = this

    access.new_account = {}

    access.show_fb = false

    $window.fbAsyncInit = () => {
        FB.init({
            appId: $rootScope.appID,
            xfbml: false,
            version: $rootScope.version
        })

        Facebook.checkLogin().then((response) => {
            console.log(response)
            access.show_fb = response.show_button
        })
    }

    access.facebookAuth = () => {
        let nonce = ""
        let i
        const range = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        for (i = 0; i < 10; i++) {
            nonce += range.charAt(Math.floor(Math.random() * range.length))
        }

        FB.login((response) => {
            const token = response.authResponse.accessToken
            const uid = response.authResponse.userID
            if (response.authResponse) {
                Facebook.facebookAuth(token).then((response) => {
                    access.new_account = {
                        fullname: response.name,
                        email_address: response.email,
                        password: nonce,
                        verify_password: nonce
                    }

                    access.processing_fb = true
                    access.createAccount()
                })
            }
        }, {
            scope: 'public_profile,email'
        })
    }

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
            access.processing_fb = false
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
            access.processing_fb = false
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
            access.processing_fb = false

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

.controller("MainController", ['$rootScope', '$scope', '$filter', '$state', 'Auth', function($rootScope, $scope, $filter, $state, Auth) {
    const main = this

    main.destroySession = () => {
        Auth.destroySession()
        $rootScope.logged_in = Auth.isLoggedIn()
        if (!$rootScope.logged_in) {
            $state.go("index", null, { reload: true })
        }
    }
}])

.controller("DashboardController", ['$rootScope', '$scope', '$filter', '$state', 'Dashboard', 'Auth', function($rootScope, $scope, $filter, $state, Dashboard, Auth) {
    const dashboard = this

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