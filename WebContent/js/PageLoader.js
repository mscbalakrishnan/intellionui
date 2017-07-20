var PageLoader = function() {

	var self = this;
	self.loadDoctorPage = function(selectionMode) {
		
		
		resultGlobalObject = $.extend(resultGlobalClass, {
			callback : function(){
				var responseObj = resultGlobalClass.response;
				$(".content").html(responseObj);				
			},
			requestUrl : "../pages/templates/doctor_add.html",			
			requestData : {},
			resultType : "text",
		});
		ServiceCalls.loadHtmlPage();
		
	};
	self.loadDoctorPageList = function(selectionMode) {
		
		
		resultGlobalObject = $.extend(resultGlobalClass, {
			callback : function(){
				var responseObj = resultGlobalClass.response;
				$(".content").html(responseObj);				
			},
			requestUrl : "../pages/templates/DoctorList.html",			
			requestData : {},
			resultType : "text",
		});
		ServiceCalls.loadHtmlPage();
		
	}
}