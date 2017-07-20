var constants = {
		isUser : "",
		getServerUrl : function() {
			return WsUtils.isDevice() ? "http://localhost:8081/IntellionWebUI/" : "";
			//return WsUtils.isDevice() ? "http://61.16.173.217:8080/hashtag/" : "";
			//return WsUtils.isDevice() ? "http://192.168.201.193:8080/hashtag/" : "";
			//return WsUtils.isDevice() ? "http://192.168.204.20:8085/hashtag/" : "";
		},
		isOnlineApp : true, // To identify if the app is browser based or will running in apk file
		isAPKFile : false, // To identify if the files are specific to APK
		reachUsRefreshTime : 60*30*1000,//Half an hour once
}

var gridServiceCallCollection = [];
var paginationObj = {};
function initPagination()
{
	/*paginationObj = {
		totalPages : ko.observable(0),
		currentPageNo : ko.observable(0),
		pageRowCount : ko.observable(10),
		
	}*/
}

initPagination();

function resetPagination()
{
	paginationObj.currentPageNo(0);
	paginationObj.totalPages(0);
}

/*paginationObj.pageNoToDisplay = ko.computed(function() 
{ 
	var currentPageNo = paginationObj.currentPageNo()+1;
	return currentPageNo
			
});*/

/**
 * This is the area to make service calls 
 */
var resultGlobalClass = {
			requestUrl 			: null, 
			additionalParams 	: {},
			requestData 		: null, 
			response 			: null, 
			callback 			: null,
			resultType 			: "json",
			isLoaderVisible     : true,
			isAsyncCall			: true,
			isTotalCountNeeded  : false,
			gridName	        : "",
};
		
var ServiceCalls = {

		/**
		 * To hit the server method
		 */
		call : function()
		{
			try
			{
				var totalCountNeeded = resultGlobalClass.isTotalCountNeeded;

				var url = constants.getServerUrl()+resultGlobalClass.requestUrl;
				if(resultGlobalClass.isLoaderVisible)
					loader.showLoader();
				
				var limit1 = "";
				
				if(paginationObj != undefined){
					limit1 = " limit " + (paginationObj.currentPageNo() * paginationObj.pageRowCount()) + "," + paginationObj.pageRowCount();
				}
				
				if(resultGlobalClass.requestData.data == undefined)
				{
					resultGlobalClass["requestData"]["data"] = {};
				}
				
				if(resultGlobalClass.requestData.data != undefined)
				{
					resultGlobalClass.requestData.data.limit = limit1;
					resultGlobalClass.requestData.totalCount = false;
				}
				
				if(resultGlobalClass.gridName != undefined && resultGlobalClass.gridName != "")
				{
					//if(gridServiceCallCollection[resultGlobalClass.gridName] == undefined || gridServiceCallCollection[resultGlobalClass.gridName] == null)
					//{
						var tempObj = {};
						tempObj["requestUrl"] = resultGlobalClass.requestUrl;
						tempObj["additionalParams"] = resultGlobalClass.additionalParams;
						tempObj["requestData"] = resultGlobalClass.requestData;
						tempObj["response"] = resultGlobalClass.response;
						tempObj["resultType"] = resultGlobalClass.resultType;
						tempObj["isLoaderVisible"] = resultGlobalClass.isLoaderVisible;
						tempObj["isAsyncCall"] = resultGlobalClass.isAsyncCall;
						tempObj["isTotalCountNeeded"] = resultGlobalClass.isTotalCountNeeded;
						tempObj["requestUrl"] = resultGlobalClass.requestUrl;
						tempObj["gridName"] = resultGlobalClass.gridName;
						tempObj["callback"] = resultGlobalClass.callback;
						
						
						gridServiceCallCollection[resultGlobalClass.gridName] = tempObj;	
					//}
					
				}
				//alert(resultGlobalClass.requestData)
				$.ajax({
					url : url ,
					type : "POST",
					dataType : resultGlobalClass.resultType,
					async : resultGlobalClass.isAsyncCall,
					data : {param : JSON.stringify(resultGlobalClass.requestData)},
					headers : {
						"Content-Type" : "application/x-www-form-urlencoded"
					}, 
					success : function(data){
						
						var hasLoginPageRedirection = false;
						try{
							var cookieVal = getCookie("response");
							if(cookieVal.page == 'ajax'){
								if(cookieVal.res == "login"){
									//alert('redirecting')
									localStorage.removeItem("UserId");
									window.location.href = "../index.html";
									hasLoginPageRedirection = true;
								}
							}
						}catch(e){alert(e.message)}
						
						console.log(data);
						
						resultGlobalObject.response = data;
						
						if(resultGlobalClass.callback != "")
						{
							if($.isFunction(resultGlobalClass.callback))
							{
								resultGlobalClass.callback.apply();
							}	
							else
							{
								eval(resultGlobalClass.callback + "();");
							}	
						}
						loader.hideLoader();

						if(totalCountNeeded){
							loadTotalPages(url,resultGlobalClass.requestData);
						}
						
						resultGlobalClass.isTotalCountNeeded = false;
						
					},
					error : function(XMLHttpRequest, textStatus, errorThrown){
						
						loader.hideLoader();
						
						if (XMLHttpRequest.readyState == 4) {
				            // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)
				        }
				        else if (XMLHttpRequest.readyState == 0) {
				        	alert("Network Error. Please check internet connection");
				        }
				        else {
				        	alert("Network Error. Please check internet connection");
				        }
						
						clearInterval(interval);
						
						interval = null;
						
						localStorage.removeItem("UserId");
						localStorage.removeItem("UserId");
						localStorage.removeItem("isUserLoggedIn");
						localStorage.removeItem("pageRefreshCount");
						localStorage.removeItem("userType");
						localStorage.removeItem("userId");
						localStorage.removeItem("rid");
						localStorage.removeItem("name");
						
						//navigateToDashboard();
						
						//window.location.href = "index.html";
						resultGlobalClass.response = errorThrown;
						
					}
				
				});
				
				resultGlobalClass.isAsyncCall = true;
			}
			catch(e)
			{
				alert(e.message);
			}
		},
		loadHtmlPage : function(url,callbackFunction){
			
			var url = constants.getServerUrl()+resultGlobalClass.requestUrl;
			$.ajax({
				url : url ,
				type : "POST",
				dataType : resultGlobalClass.resultType,
				async : resultGlobalClass.isAsyncCall,
				data : {param : JSON.stringify(resultGlobalClass.requestData)},
				headers : {
					"Content-Type" : "application/x-www-form-urlencoded"
				}, 
				success : function(data){
					
					var hasLoginPageRedirection = false;
										
					resultGlobalObject.response = data;
					
					if(resultGlobalClass.callback != "")
					{
						if($.isFunction(resultGlobalClass.callback))
						{
							resultGlobalClass.callback.apply();
						}	
						else
						{
							eval(resultGlobalClass.callback + "();");
						}	
					}
					loader.hideLoader();				
					
					resultGlobalClass.isTotalCountNeeded = false;
					
				},
				error : function(XMLHttpRequest, textStatus, errorThrown){
					
					//loader.hideLoader();
					
					if (XMLHttpRequest.readyState == 4) {
			            // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)
			        }
			        else if (XMLHttpRequest.readyState == 0) {
			        	alert("Network Error. Please check internet connection");
			        }
			        else {
			        	alert("Network Error. Please check internet connection");
			        }
					
					clearInterval(interval);
					
					interval = null;
				resultGlobalClass.response = errorThrown;
					
				}
			
			});
			
			resultGlobalClass.isAsyncCall = true;
			
		}
};

function loadTotalPages(url,paramData)
{
	paramData["totalCount"] = "true";
	
	$(".totalPageDiv").html("Loading...");
	
	$.ajax({
		url : url ,
		type : "POST",
		dataType : resultGlobalClass.resultType,
		async : true,
		data : {param : JSON.stringify(paramData)},
		headers : {
			"Content-Type" : "application/x-www-form-urlencoded"
		}, 
		success : function(data){

			var hasLoginPageRedirection = false;
			try{
				var cookieVal = getCookie("response");
				if(cookieVal.page == 'ajax'){
					if(cookieVal.res == "login"){
						//alert('redirecting')
						localStorage.removeItem("UserId");
						window.location.href = "../index.html";
						hasLoginPageRedirection = true;
					}
				}
			}catch(e){alert(e.message)}
			
			var countVal = data["serverResult"]["response"][0]["count"];
			if(countVal != undefined)
			{
				var pageCount = parseInt(countVal/paginationObj.pageRowCount());
				
				if( (countVal %  paginationObj.pageRowCount()) > 0)
				{
					pageCount = pageCount +1;
				}
				if(pageCount == 0)
					pageCount = 1;
				
				paginationObj.totalPages(pageCount);
				$(".totalPageDiv").html("/"+pageCount);
				
			}	
			
			loader.hideLoader();
			
			
			
		},
		error : function(error){
			
			loader.hideLoader();
			
			if (XMLHttpRequest.readyState == 4) {
	            // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)
	        }
	        else if (XMLHttpRequest.readyState == 0) {
	            alert("Network Error");
	        }
	        else {
	        	alert("Network Error");
	        }
			
			clearInterval(interval);
			
			interval = null;
			
			localStorage.removeItem("UserId");
			localStorage.removeItem("UserId");
			localStorage.removeItem("isUserLoggedIn");
			localStorage.removeItem("pageRefreshCount");
			localStorage.removeItem("userType");
			localStorage.removeItem("userId");
			localStorage.removeItem("rid");
			localStorage.removeItem("name");
			
			navigateToDashboard();
			
			//window.location.href = "index.html";
			resultGlobalClass.response = errorThrown;
		}
	});
}

var loader = {
	showLoader : function()
	{
		if($('#loaderContainer').length == 0)
		{
			$('body').append('<div id="loaderContainer"><div id="ajaxloader" ></div></div>');
		}
		$('#loaderContainer').css({ 'height' : $(document).height(), 'width' : $(document).width()});
		$('#loaderContainer').show();
	},
	hideLoader : function()
	{
		$('#loaderContainer').hide();
	}
};
