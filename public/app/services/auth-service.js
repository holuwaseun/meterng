angular.module("Auth-Service", [])

.factory("AuthToken", ['$window', function($window) {

    let authTokenFactory = {}

    authTokenFactory.setToken = function(token, period) {
        if (token) {
            if (period === "Long") {
                $window.localStorage.setItem("meterNgToken", token)
            } else {
                $window.sessionStorage.setItem("meterNgToken", token)
            }
        } else {
            $window.localStorage.removeItem("meterNgToken")
            $window.sessionStorage.removeItem("meterNgToken")
        }
    }

    authTokenFactory.getToken = function() {
        return ($window.localStorage.getItem("meterNgToken") || $window.sessionStorage.getItem("meterNgToken"))
    }

    authTokenFactory.get_lightup_token = function() {
        return $window.localStorage.getItem("lightUpToken")
    }

    return authTokenFactory

}])

.factory("Auth", ['$http', '$q', 'AuthToken', function($http, $q, AuthToken) {

    let authFactory = {}

    authFactory.login = (userObj) => {
        return $http.post("/api/auth", userObj).then((response) => {
            if (response.data.token) {
                if (userObj.remember) {
                    AuthToken.setToken(response.data.token, "Long")
                } else {
                    AuthToken.setToken(response.data.token, "Short")
                }
            }
            return response.data
        })
    }

    authFactory.signup = (userObj) => {
        return $http.post("/api/register", userObj).then((response) => {
            if (response.data.token) {
                AuthToken.setToken(response.data.token, "Short")
            }
            return response.data
        })
    }

    authFactory.logout = () => {
        AuthToken.setToken()
    }

    authFactory.isLoggedIn = () => {
        if (AuthToken.getToken()) {
            return true
        } else {
            return false
        }
    }

    authFactory.getUser = () => {
        if (AuthToken.getToken()) {
            return $http.get("/api/me").then((response) => {
                if (response.status !== 403) {
                    return response
                }
            })
        } else {
            return $q.reject({ success: false, message: "User has no token" })
        }
    }

    return authFactory

}])

.factory("AuthInterceptor", ['$q', '$location', 'AuthToken', function($q, $location, AuthToken) {

    let authInterceptorFactory = {}

    authInterceptorFactory.request = function(config) {

        let meterNgToken = AuthToken.getToken()
        let lightup_token = AuthToken.get_lightup_token()
        config.headers['postman-token'] = "bf880533-ca06-fcbb-5408-ddce8e9ae173"

        if (meterNgToken) {
            config.headers["x-access-token"] = meterNgToken
        }

        if (lightup_token) {
            config.headers["Authorization"] = "Bearer ${lightup_token}"
        }

        return config
    }

    authInterceptorFactory.responseError = function(response) {
        if (response.status == "403") {
            $location.path("/")
        }

        return $q.reject(response)
    }

    return authInterceptorFactory

}])

.factory("SocketIO", ['$rootScope', function($rootScope) {

    let socket = io.connect()
    let disconnecting = false

    return {
        on: function(eventName, callback) {
            socket.on(eventName, () => {
                let args = arguments
                if (!disconnecting) {
                    $rootScope.$apply(() => {
                        callback.apply(socket, args)
                    })
                } else {
                    callback.apply(socket, args)
                }
            })
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, () => {
                let args = arguments
                $rootScope.$apply(() => {
                    if (callback) {
                        callback.apply(socket, args)
                    }
                })
            })
        },
        disconnect: function() {
            disconnecting = true
            socket.disconnect()
        },
        socket: socket
    }
}])