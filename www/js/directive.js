var appDirective = angular.module('appDirective', [])

appDirective.directive("checkPasswordRepeat", function(){
	return {
		restrict: 'AE', 
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl){
			var scopeReg = scope.reg;
			var watchPSWA = scope.$watch('reg.PSWA', function(newVal){
					if(newVal == scopeReg.PSW){
						ctrl.$setValidity('checkPasswordRepeat', true);
						scopeReg.PSWAtext = 'Password Again';
					}else{
						ctrl.$setValidity('checkPasswordRepeat', false);
						scopeReg.PSWAtext = 'Password not match';
					}
				
			})
			var watchPSW = scope.$watch('reg.PSW', function(newVal){
					if(newVal == scopeReg.PSWA){
						ctrl.$setValidity('checkPasswordRepeat', true);
						scopeReg.PSWAtext = 'Password Again';
					}else{
						ctrl.$setValidity('checkPasswordRepeat', false);
						scopeReg.PSWAtext = 'Password not match';
					}
				
			})
		}
	}
})


appDirective.directive("checkNameRepeat",['$resource', function($resource){
	return {
		restrict: 'AE', 
		require: 'ngModel',
		link: function(scope, ele, attrs, ctrl){
			var scopeReg = scope.reg;
			scope.$watch('reg.name', function(newVal){
				if(scopeReg.name){
					var User = $resource('http://www.hirabbit.cn/RabbitSoftware/users/:username', {
						username: '@username'
					});
					User.get({
						username: scopeReg.name
					}, function(data){
						if(data.statusText){
							ctrl.$setValidity('checkNameRepeat', false);
							scopeReg.userText = 'User has been exist'
						}else{
							ctrl.$setValidity('checkNameRepeat', true);
							scopeReg.userText = 'UserName'
						}
					}, function(err){
						console.log(err);
						ctrl.$setValidity('checkNameRepeat', false);
						scopeReg.userText = 'NetWork Break..'
					})					
				}
			})
			scope.$on('UserExisted', function(){
				ctrl.$setValidity('checkNameRepeat', false);
				scopeReg.userText = 'User has been exist'
			})	
			scope.$on('NetworkBreak', function(){
				ctrl.$setValidity('checkNameRepeat', false);
				scopeReg.userText = 'Please check your netWork'
			})	
			scope.$on('ServerDown', function(){
				ctrl.$setValidity('checkNameRepeat', false);
				scopeReg.userText = 'Server has something wrong..'
			})			
		}
	}
}])


appDirective.directive("checkNameRepeat2",['$resource','$ionicLoading', function($resource,$ionicLoading){
	return {
		restrict: 'AE', 
		require: 'ngModel',
		link: function(scope, ele, attrs, ctrl){
			var scopeLog = scope.log;
			scope.$watch('log.name', function(newVal){
				if(newVal){
					var User = $resource('http://www.hirabbit.cn/RabbitSoftware/users/:username', {
						username: '@username'
					});
					User.get({
						username: scopeLog.name
					}, function(data){
						if(data.statusText){
							ctrl.$setValidity('checkNameRepeat2', true);
							scopeLog.userText = 'UserName'
						}else{
							ctrl.$setValidity('checkNameRepeat2', false);
							scopeLog.userText = 'User is not exist'
						}
					}, function(err){
						console.log(err);
						ctrl.$setValidity('checkNameRepeat2', false);
						scopeLog.userText = 'NetWork Break..'
					})					
				}
			})

			scope.$on('UserNotExisted', function(){
				ctrl.$setValidity('checkNameRepeat2', false);
				scopeLog.userText = 'User is not exist'
				$ionicLoading.hide();
			})	
			scope.$on('NetworkBreak2', function(){
				ctrl.$setValidity('checkNameRepeat2', false);
				scopeLog.userText = 'Please check your netWork'
				$ionicLoading.hide();
			})	
			scope.$on('ServerDown2', function(){
				ctrl.$setValidity('checkNameRepeat2', false);
				scopeLog.userText = 'Server has something wrong..'
				$ionicLoading.hide();
			})			
		}
	}
}])

appDirective.directive("pswMatch",['$resource', '$ionicLoading',function($resource,$ionicLoading){
	return {
		restrict: 'AE', 
		require: 'ngModel',
		link: function(scope, ele, attrs, ctrl){
			var scopeLog = scope.log;
			scope.$watch('log.PSW', function(newVal){
				ctrl.$setValidity('pswMatch', true);
				scopeLog.pswText = "Password";
			})
			scope.$on('pswNotMatch', function(){
				ctrl.$setValidity('pswMatch', false);
				scopeLog.pswText = 'passwork not match'			
				$ionicLoading.hide();
			})
		}
	}
}])