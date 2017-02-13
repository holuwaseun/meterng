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

.factory("Purchase", ['$http', '$q', function($http, $q) {

    let purchaseFactory = {}

    return purchaseFactory

}])

.factory("LightUp", ['$http', '$q', function($http, $q) {
    let lightUpFactory = {}

    lightUpFactory.get_access_token = (post_object) => {
        return $http.post("https://vendors.lightup.com.ng/AccessToken", post_object).then((response) => {
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