var doctorVo;
function initDoctorVo() {
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
initDoctorVo();
var Doctor = function() {

	var self = this;
	self.loadDoctorPage = function(data) {
		
		
		resultGlobalObject = $.extend(resultGlobalClass, {
			callback : function(){
				var responseObj = resultGlobalClass.response;
				$(".content").html(responseObj);	
				
				if(data){
					doctorVo.id(data["id"]);
					doctorVo.name(data["name"]);
					doctorVo.title(data["title"]);
					doctorVo.email(data["email"]);
					doctorVo.qualification(data["qualification"]);
					doctorVo.fees(data["fees"]);
					doctorVo.mobile(data["mobile"]);
					doctorVo.category(data["categoryid"]);
				}
				ko.cleanNode($("#doctorForm")[0]);
				ko.applyBindings(doctorVo, $("#doctorForm")[0]);
			},
			requestUrl : "../pages/templates/doctor_add.html",			
			requestData : {},
			resultType : "text",
		});
		ServiceCalls.loadHtmlPage();
		
	};
	self.loadDoctorPageList = function(selectionMode) {
		
		$("#content").html(WsUtils.getGridFilterContainer());
		resultGlobalObject = $.extend(resultGlobalClass, {
			callback : function(){
				$("#comboDiv").html(WsUtils.getGridFilterContainer());
				var dataArr=resultGlobalClass.response;
			
						
				$("#addNewBtn").bind("click",function(){
					self.loadDoctorPage();
				});
				
				var dataArray =  dataArr;
				if(dataArray.length > 0 ){
					initDataGridModel();
					var dgm = $.extend(dataGridModel,{
							dataArray : dataArray ,
							gridHeaders : {"title":"Title","name":"Name","qualification":"Qualification","email" : "Email"},
							hiddenColumns : ["id","categoryid"],
							isDeleteButton : true,
							isCustomPagination : false,
							callbackFunction : function(data,event,type){
								if(type == 'delete')
								{	
									WsUtils.deleteOperation(function(){				
										resultGlobalObject = $.extend(resultGlobalClass, {
											callback : function(){
												if(WsUtils.isSuccess(resultGlobalObject.response))
												{
													WsUtils.showAlert("Delete Success");
													$(".alert").delay(3000).fadeOut("slow");
													self.loadDoctorPageList();
												}	
												else
												{
													WsUtils.showErrorMessage(resultGlobalObject.response);
												}	
											},
											requestUrl : "deleteExecutiveExecutives.aspx",			
											requestData : {
												"data" : data,
											},resultType : "json",
										});
										ServiceCalls.call();
									}, "");
									
								}
								else if(type = "rowSelect")
								{
									self.loadDoctorPage(data);
									
								}	
								
								
								
							},
					});
					dataGridController.showDataGrid(dgm, "gridContainer", "doctorgrid",false);
				}
				else
				{
				   WsUtils.showAlert(Language.noData);
				}	
			},
			requestUrl : "../data/doctorlist.json",			
			requestData : {
				"data" : {},
				"queryName" : "",
				"queryParamArray" : {}
			},resultType : "json",
		});
		
		ServiceCalls.call();
	
	}
}