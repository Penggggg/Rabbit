var appController = angular.module('appController', [])

appController.controller('rooCtrl', ['$scope', function($scope){
	$scope.rootObj = {}

}])

appController.controller('headPopoverCtrl', ['$scope', '$ionicPopover', '$ionicModal', '$timeout', 'eventEmmiter', function($scope, $ionicPopover, $ionicModal, $timeout, eventEmmiter){
	//----------------------popover-------------------------
	$scope.popover = $ionicPopover.fromTemplateUrl('template/popover.html', {
        scope: $scope
    });
 	// .fromTemplateUrl() 方法
 	$ionicPopover.fromTemplateUrl('template/popover.html', {
 		scope: $scope
 	}).then(function(popover) {
 		$scope.popover = popover;
 	});
 	//open popover
 	$scope.openPopover = function($event) {
 		$scope.popover.show($event);
 	};
 	$scope.closePopover = function() {
 		$scope.popover.hide();
 	};
  $scope.enterReg = function(){
    eventEmmiter.toBroadcast('enterReg')
  }
  $scope.enterLog = function(){
    eventEmmiter.toBroadcast('enterLog')
  }


}])

appController.controller('registerCtrl', ['$scope', '$resource','$ionicLoading','eventEmmiter', '$timeout', '$location',function($scope, $resource, $ionicLoading, eventEmmiter, $timeout, $location){
  $scope.reg = {};
  var _scopeReg = $scope.reg
  _scopeReg.PSWAtext = "Password Again";
  _scopeReg.userText = "UserName";
  //用户注册
  _scopeReg.registe = function(){
    //弹出等待
    $ionicLoading.show({
      template:  '<ion-spinner icon="ios"></ion-spinner>',
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    //用户注册
    var User = $resource('http://www.hirabbit.cn/RabbitSoftware/users');
    User.save({}, {
      name:  _scopeReg.name,
      password:  _scopeReg.PSW
    }, function(data){
      //注册成功
      if(data.statusText == 'Registed!'){
        $timeout(function(){
          $ionicLoading.hide();
            $timeout(function(){
              // eventEmmiter.toBroadcast('registed')
              $location.path('/logIn');
            }, 100)
        }, 800)
        //弹出登录框
        
      }else if(data.statusText == 'user has already existed'){
        //意外：用户已存在
        console.log('用户已存在');
        $ionicLoading.hide();
        eventEmmiter.toBroadcast('UserExisted')
      }else{
        eventEmmiter.toBroadcast('ServerDown')
      }
    }, function(err){
        $ionicLoading.hide();
        eventEmmiter.toBroadcast('NetworkBreak')
    })
  }
  $scope.$on('enterReg', function(){
    _scopeReg.name = ''
    _scopeReg.PSW = ''
    _scopeReg.PSWA = ''
  })

}])

appController.controller('logInCtrl', ['$scope', '$resource', '$http', 'eventEmmiter','$ionicLoading','$timeout','$location', 'msgStorage', 'loginSocket',function($scope, $resource, $http, eventEmmiter,$ionicLoading,$timeout,$location,msgStorage,loginSocket){
  $scope.log = {}
  var _scopeLog = $scope.log;
  _scopeLog.userText = "UserName";
  _scopeLog.pswText = "Password";
  _scopeLog.logIn = function(){
          //弹出等待
    $ionicLoading.show({
            template:  '<ion-spinner icon="ios"></ion-spinner>',
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
          });
      var User = $resource('http://www.hirabbit.cn/RabbitSoftware/login', {
        name: '@name',
        password: '@password'
      }, {
        save: {
          method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }
      });
      User.save({}, {
        name:  _scopeLog.name,
        password:  _scopeLog.PSW
      }, function(data){
        //注册成功
        var msg = data.statusText;
        var user = data.user;
        if(msg == 'user not existed'){ eventEmmiter.toBroadcast('UserNotExisted') 
        }else if(msg == 'password not matched'){ eventEmmiter.toBroadcast('pswNotMatch') 
        }else if(msg == 'login'){
          console.log('密码验证成功');
          //广播登录成功事件
          eventEmmiter.toBroadcast('login')
          //本地保存登录数据
          msgStorage.setUserStorage(user)
          //登录socket
          loginSocket.login({
            user: msgStorage.getUserStorage().account
          })
          //关闭弹窗
          $timeout(function(){
            $ionicLoading.hide();
              $timeout(function(){                
                $location.path('/tabs/chats');
              }, 100)
          }, 800)
        }else{
          eventEmmiter.toBroadcast('ServerDown2')
        }

      }, function(err){
        console.log(err)
        eventEmmiter.toBroadcast('NetworkBreak2')
        $ionicLoading.hide();
      })

  }
  $scope.$on('enterLog', function(){
    _scopeLog.test = mySocket.isConnected();
    _scopeLog.name = ''
    _scopeLog.PSW = ''
  })

}])

appController.controller('findCtrl', ['$scope','$resource', function($scope, $resource){
  $scope.find = {};
  _scopeFind = $scope.find;
  _scopeFind.test = function(){
    
  }
}])

appController.controller('chatDetailCtrl', ['$scope', 'Chat','msgStorage', function($scope, Chat,msgStorage){
  $scope.chat = {}
  var _scopeChat = $scope.chat;
  _scopeChat.sendMsg = function(){
    Chat.sendMsg({
      from: msgStorage.getUserStorage().account,
      text: _scopeChat.text
    })
  }
  $scope.$on('getPublicMsg', function(eve,data){
  	console.log('Controller 接到' + data.text)
  })
}])

appController.controller('chatTogetherCtrl', ['$scope', 'Chat','msgStorage', function($scope, Chat,msgStorage){
  $scope.chat = {}
  var _scopeChat = $scope.chat;
  _scopeChat.chatData = [
  	{type: 'msg', left: true, right: false, from: 'HeZhuoPeng' ,text: 'hello, man. Im a shuaige.'},
  	{type: 'msg', left: false, right: true,from: 'Me' ,text: 'Back off, man. Im shuaige to.'},
  	{type: 'sys', left: true, right: false,from: '' ,text: 'somebody join!'}
  ]

  _scopeChat.sendMsg = function(){
    Chat.sendMsg({
      from: msgStorage.getUserStorage().account,
      text: _scopeChat.text
    })
  }
  $scope.$on('getPublicMsg', function(eve,data){
  	console.log('Controller 接到' + data.text)
  	data.type = 'msg';
  	data.left = true;
  	data.right = false;
  	_scopeChat.chatData.push(data);
  })

}])

appController.controller('tabsChatCtrl', ['$scope', '$location',function($scope,$location){
	$scope.tab = function(){
		$scope.test = '点击';
		$location.path('/tabs/chattogether');
	}
}])

