(function (angular, buildfire) {
    'use strict';
    //created mediaCenterWidget module
    angular
        .module('placesWidget', [
            'placesEnums',
            'placesWidgetServices',
            'placesWidgetFilters',
            'ngAnimate',
            'ngRoute',
            'ui.bootstrap',
            'infinite-scroll'
        ])
        //injected ngRoute for routing
        //injected ui.bootstrap for angular bootstrap component
        //injected ui.sortable for manual ordering of list
        //ngClipboard to provide copytoclipboard feature
        .config(['$routeProvider', function ($routeProvider) {

            /**
             * Disable the pull down refresh
             */
                //buildfire.datastore.disableRefresh();

            $routeProvider
                .when('/', {
                    templateUrl: 'templates/home.html',
                    controllerAs: 'WidgetSections',
                    controller: 'WidgetSectionsCtrl',
                    resolve: {
                        PlaceInfo: ['$q', 'DB', 'COLLECTIONS', 'Orders', 'Location',
                            function ($q, DB, COLLECTIONS, Orders, Location) {
                                var deferred = $q.defer();
                                var PlaceInfo = new DB(COLLECTIONS.PlaceInfo);
                                var _bootstrap = function () {
                                    PlaceInfo.save({
                                        content: {
                                            sortBy: '',
                                            rankOfLastItem: ''
                                        },
                                        design: {
                                            secListLayout: 'sectionlist1',
                                            mapLayout: 'maplayout1',
                                            itemListLayout: 'itemlist1',
                                            itemDetailsLayout: 'itemdetails1',
                                            secListBGImage: ''
                                        },
                                        settings: {
                                            defaultView: '',
                                            showDistanceIn: ''
                                        }
                                    }).then(function success() {
                                        Location.goToHome();
                                    }, function fail(error) {
                                        throw (error);
                                    })
                                }
                                PlaceInfo.get().then(function success(result) {
                                        if (result && result.data && result.id) {
                                            deferred.resolve(result);
                                        }
                                        else {
                                            //error in bootstrapping
                                            _bootstrap(); //bootstrap again  _bootstrap();
                                        }
                                    },
                                    function fail(error) {
                                        throw (error);
                                    }
                                );
                                return deferred.promise;
                            }]
                    }
                })

                .otherwise('/');
        }])


})(window.angular, window.buildfire);
