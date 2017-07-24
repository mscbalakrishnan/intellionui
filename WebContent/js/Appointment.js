var appointmentVo;
function initAppointmentVo() {
	doctorVo = {
		id : ko.observable(""),
		name : ko.observable(""),
		title : ko.observable(""),
		email : ko.observable(""),
		qualification : ko.observable(""),
		fees : ko.observable(""),
		mobile : ko.observable(""),
		category : ko.observable(""),
		categoryList:ko.observableArray([{"id":1,"name":"dentist"},{"id":2,"name":"Root Canel Splst"}]),
		title : ko.observable(""),
		titleList:ko.observableArray([{"id":1,"name":"Mr"},{"id":2,"name":"Ms/Mrs"}])
	};
};
initAppointmentVo();
var Appointment = function() {

	var self = this;
	self.loadAppointmentDetails = function(callback) {
		
		
		 resultGlobalObject = $.extend(resultGlobalClass, {
			callback : function(){
				var responseObj = resultGlobalClass.response;
				 var events = [];
					$.each(responseObj, function(i,v) {
			     		var st = v.time[3].split("T");
			     		var ed = v.time[3].split("T");
			     		var st1 = st[0]+'T'+v[4]+':00';
			     		var ed1 = ed[0]+'T'+v[4]+':00';
			              events.push({
			            	  	id:v[0],
				                title: v[2]+","+v[5],
				                start: st1,
				                backgroundColor: '#0073b7', //Blue
				                borderColor    : '#0073b7' //Blue
				              });
			     	});
		            callback(events);
				
			},
			requestUrl : "../data/appointment.json",				
			requestData : {},
			resultType : "text",
		});
		ServiceCalls.loadHtmlPage();
		
	};
	
}