// 'use strict';
//
// angular.module('core').directive('map', [
// 	function() {
// 		return {
// 			template: '<div></div>',
// 			restrict: 'E',
// 			link: function postLink(scope, element, attrs) {
// 				angular.extend($scope, {
// 				    defaults: {
// 				        tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
// 				        maxZoom: 14,
// 				        path: {
// 				            weight: 10,
// 				            color: '#800000',
// 				            opacity: 1
// 				        }
// 				    }
// 				});
// 				angular.extend($scope, {
// 				    center: {
// 				        lat: 51.505,
// 				        lng: -0.09,
// 				        zoom: 8
// 				    }
// 				});
// 			}
// 		};
// 	}
// ]);



1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
/*
This directive allows us to pass a function in on an enter key to do what we want.
*/
angular.module('core')
  .directive('ngEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
          scope.$apply(function (){
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  });
