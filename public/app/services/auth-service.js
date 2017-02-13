angular.module("Auth-Service", [])

.factory("AuthToken", ['$window', function($window) {

    let authTokenFactory = {}

    authTokenFactory.setToken = function(token) {
        if (token) {
            $window.localStorage.setItem("token", token)
        } else {
            $window.localStorage.removeItem("token")
        }
    }

    authTokenFactory.getToken = function() {
        return $window.localStorage.getItem("token")
    }

    authTokenFactory.get_lightup_token = function() {
        return $window.localStorage.getItem("lightUpToken")
    }

    return authTokenFactory

}])

.factory("Auth", ['$http', '$q', 'AuthToken', function($http, $q, AuthToken) {

    let authFactory = {}

    authFactory.login = function(userObj) {
        return $http.post("http://localhost:2284/api/auth", userObj).then((response) => {
            if (response.data.token) {
                AuthToken.setToken(response.data.token)
            }
            return response.data
        })
    }

    authFactory.logout = function() {
        AuthToken.setToken()
    }

    authFactory.isLoggedIn = function() {
        if (AuthToken.getToken()) {
            return true
        } else {
            return false
        }
    }

    authFactory.getUser = function() {
        if (AuthToken.getToken()) {
            return $http.get("http://localhost:2284/api/me").then((response) => {
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

        let token = AuthToken.getToken()
        let lightup_token = AuthToken.get_lightup_token()
        config.headers['postman-token'] = "bf880533-ca06-fcbb-5408-ddce8e9ae173"

        if (token) {
            config.headers["x-access-token"] = token
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

/*
.factory("SocketIO", ['$rootScope', function($rootScope) {

    let socket = io.connect('http://localhost:2284')
    let disconnecting = false

    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                let args = arguments
                if (!disconnecting) {
                    $rootScope.$apply(function() {
                        callback.apply(socket, args)
                    })
                } else {
                    callback.apply(socket, args)
                }
            })
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                let args = arguments
                $rootScope.$apply(function() {
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
*/