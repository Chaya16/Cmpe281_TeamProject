/**
 * Created by jnirg on 4/2/2017.
 */
// create the module and name it scotchApp
var StarbucksApp = angular.module('StarbucksApp', ['ngRoute', 'ngTable'/*, 'smart-table'*/]);

// configure our routes
StarbucksApp.config(function($routeProvider,$locationProvider) {

    var link = 'http://54.183.83.252:8000/Starbucks2';

    console.log("route provider");
    
    $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
    });
    $routeProvider
    // route for the home page
        .when('/', {
            templateUrl : 'templates/index.html',
            controller  : 'mainController'
        })

        // route for the about page
        .when('/about', {
            templateUrl : 'templates/about.html',
            controller  : 'aboutController'
        })

        // route for the contact page
        .when('/home', {
            templateUrl : 'templates/index.html',
            controller  : 'mainController'
        })


        .when('/placeorder', {
            templateUrl : 'templates/placeorder.html',
            controller  : 'placeorderController'
        })

        .when('/checkstatus', {
            templateUrl : 'templates/checkstatus.html',
            controller  : 'checkstatusController'
        })

        .when('/updateorder', {
            templateUrl : 'templates/updateorder.html',
            controller  : 'updateorderController'
        })

        .when('/cancelorder', {
            templateUrl : 'templates/cancelorder.html',
            controller  : 'cancelorderController'
        })

        .when('/payorder', {
            templateUrl : 'templates/payorder.html',
            controller  : 'payorderController'
        })

        /*  .when('/listOrders',{
         templateUrl : 'templates/orderList.html',
         controller  : 'paginationCtrl'
         })*/

        .otherwise({redirectTo: '/'});
});

// create the controller and inject Angular's $scope
StarbucksApp.controller('mainController', function($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
});

StarbucksApp.controller('aboutController', function($scope) {
    $scope.message = 'Look! I am an about page.';
});

StarbucksApp.controller('orderlistController', function($scope) {
    $scope.message = 'view all orders';
});

//--------------------------------- place order controller-------------------------------------------
StarbucksApp.controller("placeorderController", function ($scope, $http, $route, $rootScope,
                                                          $interval) {
    $scope.msg = 'Placing an order';
    console.log("Heyo!!!!");

    $scope.placeOrder = function () {

        console.log("in the place order function");

        console.log("placeorder called");

        console.log("inside placeordeCtrl");

        var storeLocation = '';
        switch ($scope.location)
        {
            case "Starbucks :  Santana Row":
                storeLocation = 'Starbucks1';
                break;
            case "Starbucks :  San Jose Market Center":
                storeLocation = 'Starbucks2';
                break;
            case "Starbucks :  Westfield Valley Fair":
                storeLocation = 'Starbucks3';
                break;
        }
        //http://:8000/Starbucks1/orders
        var link = 'http://54.193.9.204:8000/'+storeLocation+'/order';

        var order = {
            "location": "store-1",
            "items": [
                {
                    "qty": $scope.qty,
                    "name": $scope.drink,
                    "milk": $scope.milk,
                    "size": $scope.size
                }
            ]
        };

        var order_str = JSON.stringify(order); // json gets the string "2016-08-26 etc..."
        var order_json = JSON.parse(order_str);
        console.log(order_json);

        $http({
            method: 'POST',

            url: link, //'http://starbucks-python-mongo-backend-dev.us-west-1.elasticbeanstalk.com/v1/starbucks/store2/order',//link + '/store1/starbucks/order',
            data: order_json,
            headers:  {'Content-Type': 'application/x-www-form-urlencoded'}

        }).success(function (data) {
            console.log(data);
            $scope.msg = "Order placed with order-id :" + data.id;
            //message should be displayed that your order has been placed
            //manage this flag in UI
            $scope.msg_flag = false;
            //$route.reload();
        }).error(function(error, status) {
            $scope.msg = error.message;
            //$scope.msg_flag = true;
        });

    }
});



//--------------------------------- check status controller-------------------------------------------
StarbucksApp.controller("checkstatusController", function ($scope, $http, $route, $rootScope,
                                                           $interval) {

    console.log('check status controller');
    console.log($scope.orderId);


    $scope.checkStatus = function () {
        var storeLocation = '';
        switch ($scope.location)
        {
            case "Starbucks :  Santana Row":
                storeLocation = 'Starbucks1';
                break;
            case "Starbucks :  San Jose Market Center":
                storeLocation = 'Starbucks2';
                break;
            case "Starbucks :  Westfield Valley Fair":
                storeLocation = 'Starbucks3';
                break;
        }
        var link = 'http://54.193.9.204:8000/'+storeLocation+'/order/'+$scope.orderId;
        //var urlLink = 'http://localhost:3005/starbucks/store1/order/';
        //'http://starbucks-python-mongo-backend-dev.us-west-1.elasticbeanstalk.com/v1/starbucks/store2/order/'+$scope.orderId;
        //link + '/store1/starbucks/order/' +$scope.orderId;

        $http({
            method: 'GET',
            url: link,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data) {
            console.log(data);
            $scope.status = data.status;
            $scope.msg = data.message;
            //$route.reload();
        }).error(function(error, status) {
            console.log(error);
            $scope.msg = error.message;
            //$scope.msg_flag = true;
            // $route.reload();
        });



    }//end of checkstatus
});



//--------------------------------- update order controller-------------------------------------------
StarbucksApp.controller("updateorderController", function ($scope, $http, $route, $rootScope, $interval) {

    console.log('update order controller with isUpdateAllowed false');
    $scope.isUpdateDisabled = true;

    console.log($scope.orderId);


    $scope.getOrder = function () {
        var urlLink = 'http://starbucks-python-mongo-backend-dev.us-west-1.elasticbeanstalk.com/v1/starbucks/store2/order/'+$scope.orderId;
        //link + '/store1/starbucks/order/' + $scope.orderid;

        $http({
            method: 'GET',
            url: urlLink,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data) {
            console.log(data);
            // var newDataJSON = JSON.parse(data)
            // console.log(newDataJSON);
            $scope.orderstatus = data.status;
            $scope.drink = data.items.name;
            $scope.size = data.items.size;
            $scope.milk = data.items.milk;
            $scope.qty = data.items.qty;
            $scope.location = data.location;
            $scope.msg = data.message;
            if($scope.orderstatus == "PLACED")
            {
                $scope.isUpdateDisabled = false;
            }
            //$route.reload();
        }).error(function (error, status) {
            $scope.msg = error.message;
            //$scope.msg_flag = true;
            //$route.reload();
        });
    }



    $scope.updateOrder = function(){

        var storeLocation = '';
        switch ($scope.location)
        {
            case "Starbucks :  Santana Row":
                storeLocation = 'http://starbucks-python-mongo-backend-dev.us-west-1.elasticbeanstalk.com/v1/starbucks/store2/order/'+$scope.orderId;
                break;
            case "Starbucks :  San Jose Market Center":
                storeLocation = 'https://shielded-forest-84936.herokuapp.com/starbucks/store1/order/'+$scope.orderId;
                break;
            case "Starbucks :  Westfield Valley Fair":
                storeLocation = 'http://starbucksapp.herokuapp.com/v1/starbucks/store3/order/'+$scope.orderId;
                break;
        }

        var link = ''
        link = 'http://54.193.9.204:8000/'+storeLocation+'/order/'+$scope.orderId;
        //var urlLink = 'http://localhost:3005/starbucks/store1/order/'+$scope.orderId;;
        //'http://starbucks-python-mongo-backend-dev.us-west-1.elasticbeanstalk.com/v1/starbucks/store2/order/'+$scope.orderId;
        //link + '/store1/starbucks/order/' + $scope.orderid;
        var order = {
            "location": $scope.location,
            "items": [{
                "qty": $scope.qty,
                "name": $scope.drink,
                "milk": $scope.milk,
                "size": $scope.size
            }]
        }

        var order_str = JSON.stringify(order); // json gets the string "2016-08-26 etc..."
        var order_json = JSON.parse(order_str);
        console.log(order_json);

        $http({
            method: 'PUT',
            url: storeLocation,
            headers: {'Content-Type': 'application/json'},
            data: order_json

        }).success(function (data) {
            $scope.msg = data.message;
            console.log(data);
            //message should be displayed that your order has been placed
            //manage this flag in UI

            //$route.reload();
        }).error(function(error, status) {
            $scope.msg = error.message;
            //$scope.msg_flag = true;
            //$route.reload();
        });

    }

});



//--------------------------------- cancel order controller-------------------------------------------
StarbucksApp.controller("cancelorderController", function ($scope, $http, $route, $rootScope,
                                                           $interval) {

    console.log('cancel order controller');
    console.log($scope.orderId);


    $scope.cancelOrder = function () {

        var storeLocation = '';
        switch ($scope.location)
        {
            case "Starbucks :  Santana Row":
                storeLocation = 'http://starbucks-python-mongo-backend-dev.us-west-1.elasticbeanstalk.com/v1/starbucks/store2/order/'+$scope.orderId;
                break;
            case "Starbucks :  San Jose Market Center":
                storeLocation = 'https://shielded-forest-84936.herokuapp.com/starbucks/store1/order/'+$scope.orderId;
                break;
            case "Starbucks :  Westfield Valley Fair":
                storeLocation = 'http://starbucksapp.herokuapp.com/v1/starbucks/store3/order/'+$scope.orderId;
                break;
        }
        var link = 'http://54.193.9.204:8000/'+storeLocation+'/order/s'+$scope.orderId;
        //var urlLink = 'http://localhost:3005/starbucks/store1/order/'+$scope.orderId;
        //'http://starbucks-python-mongo-backend-dev.us-west-1.elasticbeanstalk.com/v1/starbucks/store2/order/'+$scope.orderId;
        //link + '/store1/starbucks/order/' + $scope.orderid;

        $http({

            headers: {'Content-Type': 'application/json'},
            method: 'DELETE',
            url: storeLocation
        }).success(function (data) {
            console.log("delete completed")
            $scope.orderstatus = data.status;
            $scope.msg = data.message;
            console.log(data);
            // setTimeout($route.reload(), 1000);
        }).error(function (error, status) {
            $scope.msg = error.message;
            //$scope.msg_flag = true;
            //$route.reload();
        });
    }

});


//--------------------------------- pay order controller-------------------------------------------
StarbucksApp.controller("payorderController", function ($scope, $http, $route, $rootScope,
                                                        $interval) {

    console.log('pay order controller');

    $scope.payOrder = function () {

        var storeLocation = '';
        switch ($scope.location)
        {
            case "Starbucks :  Santana Row":
                storeLocation = 'Starbucks1';
                break;
            case "Starbucks :  San Jose Market Center":
                storeLocation = 'Starbucks2';
                break;
            case "Starbucks :  Westfield Valley Fair":
                storeLocation = 'Starbucks3';
                break;
        }
        var link = 'http://54.193.9.204:8000/'+storeLocation+'/order/'+$scope.orderId +"/pay";
        //var urlLink ='http://localhost:3005/starbucks/store1/order/'+$scope.orderId;
        //'http://starbucks-python-mongo-backend-dev.us-west-1.elasticbeanstalk.com/v1/starbucks/store2/order/'+$scope.orderId +"/pay";
        //link + '/store1/starbucks/order/' + $scope.orderid + '/pay';

        $http({
            method: 'POST',
            url: link
        }).success(function (data) {
            console.log(data);
            $scope.orderstatus = data.status;
            $scope.msg = data.message;

            //setTimeout($route.reload(), 2000);
        }).error(function (error, status) {
            $scope.msg = error.message;
            //$scope.msg_flag = true;
            // $route.reload();
        });
    }

});

//-------------------- orde rlist----------------
StarbucksApp.controller('paginationCtrl', ['$scope', function (scope) {
    var
        nameList = ['Pierre', 'Pol', 'Jacques', 'Robert', 'Elisa'],
        familyName = ['Dupont', 'Germain', 'Delcourt', 'bjip', 'Menez'];

    function createRandomItem() {
        var
            firstName = nameList[Math.floor(Math.random() * 4)],
            lastName = familyName[Math.floor(Math.random() * 4)],
            age = Math.floor(Math.random() * 100),
            email = firstName + lastName + '@whatever.com',
            balance = Math.random() * 3000;

        return{
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            balance: balance
        };
    }

    scope.itemsByPage=15;

    scope.rowCollection = [];
    for (var j = 0; j < 200; j++) {
        scope.rowCollection.push(createRandomItem());
    }
}]);
