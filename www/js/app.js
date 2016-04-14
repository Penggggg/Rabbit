
var app = angular.module('rabbitApp', [
		'ionic',
    'btford.socket-io', 
    'ngCordova',
		'appController',
		'appDirective',
		'appFilter',
		'appServer',
		'ngAnimate',
    'ngResource'
	])

app.config(['$ionicConfigProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', function($ionicConfigProvider,$stateProvider,$urlRouterProvider,$httpProvider){
  $ionicConfigProvider.tabs.style('striped');
  $ionicConfigProvider.tabs.position('top ');
  $ionicConfigProvider.form.checkbox('circle');
  $ionicConfigProvider.form.toggle('large')

  $urlRouterProvider.otherwise('/tabs/funs');
  $stateProvider
    .state('tabs', {
      url: '/tabs',
      views: {
        'middle':{
          templateUrl: function(){return 'template/tabs.html'}
        }
      }   
    })
    .state('tabs.funs', {
      url: '/funs',
      views: {
        'fun':{
          templateUrl: function(){return 'template/tabFuns.html'}
        }
      }   
    })
    .state('tabs.chats', {
      url: '/chats',
      views: {
        'chats' :{
          templateUrl: function(){return 'template/tabChats.html'}
        }
      }
    })
    .state('tabs.find', {
      url: '/find',
      views: {
        'find':{
          templateUrl: function(){return 'template/tabFind.html'}
        }
      }
    })
    .state('tabs.detail', {
      url: '/detail',
      views: {
        'chats' :{
          templateUrl: function(){return 'template/ChatDetail.html'}
        }
      }
    })
    .state('tabs.chattogether', {
      url: '/chattogether',
      views: {
        'chats' :{
          templateUrl: function(){return 'template/ChatTOgether.html'}
        }
      }
    })
    .state('register', {
      url: '/register',
      views: {
        'middle':{
          templateUrl: function(){return 'template/registerModel.html'}
        }
      }   
    })
    .state('logIn', {
      url: '/logIn',
      views: {
        'middle':{
          templateUrl: function(){return 'template/logInModel.html'}
        }
      }   
    })

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

}])



app.run(['$ionicPlatform', '$ionicPopup', '$ionicHistory', '$location', '$cordovaKeyboard','msgStorage','loginSocket','Chat','eventEmmiter','$q','$timeout','$rootScope','pubicChatStore',function($ionicPlatform, $ionicPopup, $ionicHistory, $location, $cordovaKeyboard,msgStorage,loginSocket,Chat,eventEmmiter, $q, $timeout,$rootScope,pubicChatStore) {
  //---------ionic----------------
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    $ionicPlatform.registerBackButtonAction(function (e) {
        e.preventDefault();
        function showConfirm() {
            var confirmPopup = $ionicPopup.confirm({
                title: '<strong>退出应用?</strong>',
                template: '你确定要退出应用吗?',
                okText: '退出',
                cancelText: '取消'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    ionic.Platform.exitApp();
                } else {

                }
            });
        }
        if ($location.path() == '/tabs/funs') {
            showConfirm();
        }else if ($cordovaKeyboard.isVisible()) {
            //处理input
            $cordovaKeyboard.close();                      
        } else if ($ionicHistory.backView()) {
            $ionicHistory.goBack();
        } else {
            showConfirm();
        }
    }, 101)

  });
  //--------ng---------

  // // //接受服务信息
  Chat.socketInstance.on('publicMsg', function(data){
    console.log('全局环境app接受到信息：' + data);
    pubicChatStore.initStore.push(pubicChatStore.decorateData(data))

  })

  
}])


