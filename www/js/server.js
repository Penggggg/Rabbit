var appServer = angular.module('appServer', [])

appServer.factory('eventEmmiter', ['$rootScope','$timeout', function($rootScope, $timeout){
	var toBroadcast = function(eventType, args){
		$timeout(function(){
			console.log('$rootScope发射事件中...')		
			$rootScope.$broadcast(eventType, args);
		}, 100)
	}
	return {
		toBroadcast: function(eventType, args){
			return toBroadcast(eventType, args)
		}
	}
}])


appServer.factory('msgStorage', ['$window', function($window){
	var isSupportLocalStorage = function (){
		if($window.localStorage == 'undefined'){
			return "false";
		}else{
			return "true"
		}
	}
	var hasUserStorage = function(){
		if($window.localStorage["user"]){
			return "true"
		}else{
			return "false"
		}
	}
	var setUserStorage = function(data){
		$window.localStorage["user"] = JSON.stringify(data);
		console.log('保存到本地');
	}
	var clearUserStorage = function(){
		console.log('清空user')
		return $window.localStorage.removeItem('user');
	}
	var getUserStorage = function(){
		return JSON.parse($window.localStorage['user'])
	}
	return {
		isSupportLocalStorage: function(){
			return isSupportLocalStorage();
		},
		hasUserStorage: function(){
			return hasUserStorage();
		},
		setUserStorage: function(data){
			return setUserStorage(data)
		},
		clearUserStorage: function(){
			return clearUserStorage();
		},
		getUserStorage: function(){
			return getUserStorage();
		}
	}
}])


appServer.factory('Socket', ['socketFactory', function (socketFactory) {
  var myIoSocket = io.connect('http://www.hirabbit.cn:80');
  mySocket = socketFactory({
    ioSocket: myIoSocket
  });
  return mySocket;
}]);

appServer.factory('loginSocket',[ 'Socket', function(Socket){
	var login = function(msg){
		console.log('用户登录中...')
		Socket.emit('login', msg);
	}
	return {
	    login: function(msg){
	    	return login(msg)
	    }
	    
	}
}])

appServer.factory('Chat',[ 'Socket', function(Socket){
	var sendMsg = function(msg){
		Socket.emit('publicMsg', msg);
	}
	return {
	    sendMsg: function(msg){
	    	return sendMsg(msg)
	    },
	    socketInstance: Socket
	    
	}
}])



