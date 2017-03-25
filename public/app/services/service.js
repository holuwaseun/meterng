angular.module("Service", [])

.factory("LightUpToken", ['$window', function($window) {

    let lightUpTokenFactory = {}

    lightUpTokenFactory.setToken = function(token) {
        if (token) {
            $window.sessionStorage.setItem("lightUpToken", token)
        } else {
            $window.sessionStorage.removeItem("lightUpToken")
        }
    }

    lightUpTokenFactory.get_lightup_token = function() {
        return $window.localStorage.getItem("lightUpToken")
    }

    return lightUpTokenFactory

}])

.factory("Facebook", ['$http', '$q', '$document', function($http, $q, $document) {
    const facebookFactory = {}

    facebookFactory.attachScript = function() {
        let js, id = 'facebook-jssdk',
            ref = angular.element(document).find('script')[0]

        /*
        if ($document.getElementById(id)) {
            return
        }
        */

        js = $document.createElement('script')
        js.id = id
        js.async = true
        js.src = "//connect.facebook.net/en_US/sdk.js"

        ref.parentNode.insertBefore(js, ref)
    }

    facebookFactory.checkLogin = function() {
        return FB.getLoginStatus((response) => {
            console.log(response)
            return response.status
        })
    }

    facebookFactory.facebookAuth = function() {
        let deferred = $q.defer()
        FB.api('/me', { fields: 'id,name,email' }, (response) => {
            if (!response || response.error) {
                deferred.reject('Error occured')
            } else {
                deferred.resolve(response)
            }
        })
        return deferred.promise
    }

    return facebookFactory
}])

.factory("Purchase", ['$http', '$q', function($http, $q) {

    let purchaseFactory = {}

    return purchaseFactory

}])

.factory("LightUp", ['$http', '$httpParamSerializer', '$q', function($http, $httpParamSerializer, $q) {
    let lightUpFactory = {}

    lightUpFactory.get_access_token = (post_object) => {
        return $http({
            url: "https://vendors.lightup.com.ng/AccessToken",
            method: "POST",
            data: $httpParamSerializer(post_object),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            return response
        })
    }

    lightUpFactory.check_meter = (meter_object) => {
        return $http.get("https://vendors.lightup.com.ng/api/energydemo/MeterDetails", { params: meter_object }).then((response) => {
            return response
        })
    }

    lightUpFactory.check_transaction = (transaction_object) => {
        return $http.get("https://vendors.lightup.com.ng/api/energydemo/Transaction/Meter", { params: transaction_object }).then((response) => {
            return response
        })
    }

    return lightUpFactory
}])

.factory("QuickTeller", ['$http', '$q', function($http, $q) {
    let quickTellerFactory = {}

    quickTellerFactory.get_billers = () => {
        return $http.get("http://croberts-001-site2.ftempurl.com/randglobal/apis/interswitch/billers").then((response) => {
            return response.data
        })
    }

    return quickTellerFactory
}])

.factory("Dashboard", ['$http', '$q', function($http, $q) {
    let dashboardFactory = {}

    dashboardFactory.latestTransaction = () => {
        return $http.get("/api/transaction/latest").then((response) => {
            return response.data
        })
    }

    return dashboardFactory
}])