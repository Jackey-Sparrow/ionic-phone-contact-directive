/**
 * Created by lihaozhou on 2016/6/20.
 */
(function (angular) {
	'use strict';
	/**
	 * version 0.0.1
	 * todo: need refactor
	 */
	angular.module('lhz-contact', []).directive('lhzContact',
		['$timeout', '$ionicScrollDelegate', function ($timeout, $ionicScrollDelegate) {
			return {
				restrict: 'EA',
				scope: {
					dataSource: '='
				},
				templateUrl: 'dist/angular-contact.html',
				link: function ($scope) {

					var CURGROUPNAMEHEIGHT = 38,
						FLOATLEFTLETTERSMARGIN = 6;

					$scope.scrollToLetter = function (letter) {
						var doc = document.getElementById('group-' + letter);
						if (doc && doc.offsetTop && $scope.curGroupName !== letter) {
							$ionicScrollDelegate.scrollTo($ionicScrollDelegate.getScrollPosition().left, doc.offsetTop);
							$scope.curGroupName = letter;
						}
					};

					//todo: refactor
					$scope.onContactScroll = function (i) {
						$scope.contactGroups.forEach(function (group) {
							var position = $('#letter-' + group.name).position();
							if (position && position.top >= 0 && position.top <= CURGROUPNAMEHEIGHT) {
								$scope.curGroupName = group.name;
								$('.cur-header-title').text(group.name);
							}
						});
					};

					//todo: refactor
					function init() {

						$scope.letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G',
							'H', 'I', 'J', 'K', 'L', 'M', 'N',
							'O', 'P', 'Q', 'R', 'S', 'T', 'U',
							'V', 'W', 'X', 'Y', 'Z'];

						$scope.contactGroups = sortGroups(buildGroups($scope.dataSource));
						$scope.curGroupName = $scope.contactGroups[0].name;
					}

					function buildGroups(dataSource) {
						var target = [];
						dataSource.forEach(function (item) {
							var groupName = makePy(item.name)[0].toUpperCase()[0];
							var hasGroup = false;
							target.forEach(function (group) {
								if (group.name === groupName) {
									hasGroup = true;
									group.children.push(item);
								}
							});
							if (!hasGroup) {
								target.push({
									name: groupName,
									children: [item]
								});
							}
						});
						return target;
					}

					function getGroupByName(letter, groups) {
						var result, i = 0, len = groups.length;
						for (; i < len; i++) {
							if (groups[i].name === letter) {
								result = groups[i];
								break;
							}
						}
						return result;
					}

					function sortGroups(groups) {
						var result = [];
						$scope.letters.forEach(function (letter) {
							var group = getGroupByName(letter, groups);
							if (group) {
								result.push(group);
							}
						});
						return result;
					}

					function adjustUILayout() {
						var bodyHeight = parseInt($('.view-container').height()) - 88;//todo: hard code
						$('.floatLeftLetters').height(bodyHeight - FLOATLEFTLETTERSMARGIN);
						$('.contact-scroll').height(bodyHeight);
						$('.floatLeftLetters .letter').css({
							height: (bodyHeight - FLOATLEFTLETTERSMARGIN) / $scope.letters.length
						});
					}

					init();

					$timeout(function () {
						adjustUILayout();
					});
				}
			};
		}]);
})(angular);
