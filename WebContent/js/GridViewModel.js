var dataGridModel = {};
function initDataGridModel()
{
	dataGridModel = {
			gridHeaders : {},
			hiddenColumns : [],
			dataArray : [],
			callbackFunction : "", 
			isDeleteButton : true,
			deleteIconClass : "",
			isEditButton : true,
			editIconClass : "",
			isStatusCloseButton : false,
			closeIconClass : "",
			selectedRowData : {},
			isSearchVisible : false,
			isCustomPagination:false,
			primaryField : "",
			secondaryField : "",
			slideField : [],
			names : ko.observableArray([]),
			name : ko.observable(""),
			
	};
}
initDataGridModel();

var dataGridController = {
	
		formDataGrid : function(gridParam,tableId)
		{
			var tableHeader = [];
			var info = gridParam.dataArray;
			if (info != null && info != "" && info.length > 0) {
				for ( var key in info[0]) {
					var headerObj = {};
					headerObj.header = key;
					
					//To assign the custom header name
					var customHeaderObject = gridParam.gridHeaders;
					headerObj.headerName = key;
					for ( var headerName in customHeaderObject) {
						
						if(key == headerName)
						{
							headerObj.headerName = customHeaderObject[headerName];
						}
					}
					
					tableHeader.push(headerObj);
				}
			}

			if(gridParam.isDeleteButton)
			{
				var deleteHeaderObj = {};
				deleteHeaderObj.header = "delete";
				deleteHeaderObj.deleteIconClass = dataGridModel.deleteIconClass;
				deleteHeaderObj.headerName = "";
				deleteHeaderObj.deleteContent = '';
				tableHeader.push(deleteHeaderObj);
			}
			
			if(gridParam.isStatusCloseButton)
			{
				var closeStatusHeaderObj = {};
				closeStatusHeaderObj.header = "close";
				closeStatusHeaderObj.closeIconClass =  dataGridModel.closeIconClass;
				closeStatusHeaderObj.headerName = "";
				//closeStatusHeaderObj.deleteContent = '';
				tableHeader.push(closeStatusHeaderObj);
			}
			
			
			gridParam.gridHeaders = tableHeader;
			
			var dataGridString = " <div class='box'> <div class='box-body'> " +
					" <table class='table table-bordered table-striped' id='"+tableId+"'> " + 
			          "  <thead> " +
			          "		<tr data-bind='foreach:$root.gridHeaders'> " +
			                    " <th><span data-bind='text: headerName'></span></th> " +
			                " </tr> " +
			            "</thead> " +
			            "<tbody data-bind='foreach: $root.dataArray'> " +
			               " <tr class='odd gradeX' data-bind='foreach:$root.gridHeaders,click:function($data,event){event.stopPropagation();" +
			               "	if($.isFunction($root.callbackFunction))" +
			               "   {" +
			               "      $root.callbackFunction.apply(this,[$data,event,\"rowSelect\"])" +
			               "    }" + 
			               "   else" +
			               "    { " +
			               "		window[$root.callbackFunction].apply(this,[$data,event,\"rowSelect\"])" +
			               "	}}'> ";

					if(tableId=="areaGrid"){
							dataGridString +=   " <td data-bind='attr:{align:(WsUtils.isNumber($parent[header]))?\"left\":\"left\"}' >" ;
					}else{
							dataGridString +=   " <td data-bind='attr:{align:(WsUtils.isNumber($parent[header]))?\"right\":\"left\"}' >" ;}
			
				dataGridString +="	<div data-bind='css:($data[\"header\"] == \"delete\")?(($data[\"deleteIconClass\"] !=\"\")?$data[\"deleteIconClass\"]:\"deleteIcon\"):($data[\"header\"] == \"close\")?(($data[\"closeIconClass\"] !=\"\")?$data[\"closeIconClass\"]:\"closeIcon\"):\"\",text: ($data[\"header\"] == \"Delete\")?$data[\"deleteContent\"]: $parent[header]," +
						"  		click:function($data,event)" +
						"			  { " +
						"				" +
						" 				if($data[\"header\"] == \"delete\" || $data[\"header\"] == \"close\")" +
			            " 				{ event.stopPropagation();" +
			            "      				if($.isFunction($root.callbackFunction))" +
								               "  {" +
								               "      $root.callbackFunction.apply(this,[$parent,event,$data[\"header\"]])" +
								               "   }" + 
								               "   else" +
								               "   { " +
								               "		window[$root.callbackFunction].apply(this,[$parent,event,$data[\"header\"]])" +
								               "    }"+
			            " 				}" +
			            "			  }" + 
						"  '></div></td>" ;

				
				dataGridString +=  "</tr> " +
			            "</tbody> " +
			            " </table> " +
			            "</div> " +
			          "</div> </div> ";
			
			return dataGridString;
		},
		
		showDataGrid : function(gridObj,containerIdToReplaceHtml,dataGridTableId,hasScrollbar)
		{
			if(hasScrollbar == undefined)
			{
				hasScrollbar = false;
			}
			if(WsUtils.isDevice())
			{
				dataGridController.showDataSlide(gridObj,containerIdToReplaceHtml,dataGridTableId);
				return;
			}
			
			 ko.cleanNode( $("#"+containerIdToReplaceHtml)[0]);
			 $("#"+containerIdToReplaceHtml).html(dataGridController.formDataGrid(gridObj,dataGridTableId));
			 ko.cleanNode($('#'+containerIdToReplaceHtml)[0]);
	    	 ko.applyBindings(gridObj,document.getElementById(containerIdToReplaceHtml));
	    	 var hidddenColumns = gridObj.hiddenColumns;
	    	 
	    	 var dataTableParamObj = {};
	    	 
	    	 if(hidddenColumns != undefined && hidddenColumns.length > 0)
	    	 {
	    		 //===================================
	    		 //to get the index value of the hidden columns
	    		 var hiddenColumnIndex = [];
	    			for(var hiddenColumnsValue in hidddenColumns){
	    				var index = 0;
	    				var gridObjArr = [];
	    				if(gridObj.dataArray != null && gridObj.dataArray != undefined)
	    				{
	    					gridObjArr = gridObj.dataArray[0];
	    				}	
	    					
		 				for(var key in gridObjArr) {
		 					//console.log(key +">><<<" +  hidddenColumns[hiddenColumnsValue] + " <<< " + index)
		 					if( key == hidddenColumns[hiddenColumnsValue])
		 					{
		 						hiddenColumnIndex.push(index);
		 						
		 					}
		 					
		 					index++;
		 				}
	    			}
	    			//alert(JSON.stringify(hiddenColumnIndex));
	    		 //===================================
	    		 var hiddenColumnObjArray = [];
	    		 var hiddenColObj = {};
	    		 hiddenColObj["targets"] = hiddenColumnIndex;
	    		 
	    		 hiddenColObj["searchable"] = false;
	    		 hiddenColObj["visible"] = false;
	    		 /*
	    		  * To show Custom Content
	    		  * hiddenColObj["data"] = null;
	    		 	hiddenColObj["defaultContent"] = "<button>Click!</button>";
	    		 */
	    		 hiddenColumnObjArray.push(hiddenColObj);
	    		 dataTableParamObj["columnDefs"] = hiddenColumnObjArray ;
	    		 
	    		/* For Verical Scroll bar
	    		 * dataTableParamObj["scrollY"] = 200;
	    		 dataTableParamObj["scrollCollapse"] = true;
	    		 dataTableParamObj["jQueryUI"] = true;*/
	    		 
	    	 } 
	    	 
	    	 if(hasScrollbar)
	    	 {
	    		 dataTableParamObj["scrollX"] = hasScrollbar;
	    	 }
	    	 
	    	 dataTableParamObj["searching"] = gridObj.isSearchVisible;
	    	 dataTableParamObj["sort"] = false;
	    	 dataTableParamObj["processing"] = true;
	    	 dataTableParamObj["language"] = {"emptyTable":"No Data Available"};
	    	 dataTableParamObj["pagingType"] = "simple_numbers";

	    	 //dataTableParamObj["order"] = [[ 1, 'asc' ]];
	    	 
	    	// alert(JSON.stringify(dataTableParamObj));
	    	 
	       	var table =  $('#'+dataGridTableId).dataTable(dataTableParamObj);
	       	
	       	
	        if(hasScrollbar)
	    	{
	        	$(".dataTables_scroll").css("overflow","auto");
	        	$(".dataTables_scroll").css("width","100%");
	    	}
	       	
	      	$(".dataTables_length_ws").hide();
	      	$(".dataTables_info_ws").parent().remove();
	       	
	      	if(dataGridModel.isCustomPagination)
	      	{	
		      	/*var paginationStr = '<ul class="pagination" data=bind="visible:(totalPages == 0)?true:false">'+
					      				'<li class="paginate_button previous" aria-controls="'+dataGridTableId+'" tabindex="0" id="'+dataGridTableId+'_previous">'+
					      					//Prev Button
					      					'<a href="#">Previous</a></li><li class="paginate_button active"'+' aria-controls="'+dataGridTableId+'" tabindex="0">'+
					      					//Page No
					      					'<a href="#">'+'<div style="float: left;"><span data-bind="text:pageNoToDisplay"></span></div>  ' +
					      					//Total Page Num
					      					' <div class="totalPageDiv">/<span data-bind="text:totalPages"></span></div></a>'+
							  			'</li> '+
							  			//Next Button
							  			'<li class="paginate_button next" tabindex="0"  id="'+dataGridTableId+'_next"><a href="#">Next</a></li></ul>'
	  			
	  	
			  	$(".dataTables_paginate").html(paginationStr);
			  	
				ko.cleanNode($('.dataTables_paginate')[0]);
				ko.applyBindings(paginationObj,$('.dataTables_paginate')[0]);*/
				
				WsUtils.showCustomPagination(".dataTables_paginate",dataGridTableId);

				
	      	}
	       	
		},

		
		//Sliding Function
		showDataSlide : function(gridObj,containerIdToReplaceHtml,dataGridTableId)
		{
			var nums = gridObj.length;
			 ko.cleanNode( $("#"+containerIdToReplaceHtml)[0]);
			 $("#"+containerIdToReplaceHtml).html(dataGridController.formDataSlide(gridObj,dataGridTableId));
			 ko.cleanNode($('#'+containerIdToReplaceHtml)[0]);
	    	 ko.applyBindings(gridObj,document.getElementById(containerIdToReplaceHtml));
	    	 var hidddenColumns = gridObj.hiddenColumns;
	    	 
	    	 var dataTableParamObj = {};
	    	 
	    	 if(hidddenColumns != undefined && hidddenColumns.length > 0)
	    	 {
	    		 //===================================
	    		 //to get the index value of the hidden columns
	    		 var hiddenColumnIndex = [];
	    			for(var hiddenColumnsValue in hidddenColumns){
	    				var index = 0;
	    				var gridObjArr = [];
	    				if(gridObj.dataArray != null && gridObj.dataArray != undefined)
	    				{
	    					gridObjArr = gridObj.dataArray[0];
	    				}	
	    					
		 				for(var key in gridObjArr) {
		 					//console.log(key +">><<<" +  hidddenColumns[hiddenColumnsValue] + " <<< " + index)
		 					if( key == hidddenColumns[hiddenColumnsValue])
		 					{
		 						hiddenColumnIndex.push(index);
		 						
		 					}
		 					
		 					index++;
		 				}
	    			}
	    		 //===================================
	    		 var hiddenColumnObjArray = [];
	    		 var hiddenColObj = {};
	    		 hiddenColObj["targets"] = hiddenColumnIndex;
	    		 hiddenColObj["searchable"] = false;
	    		 hiddenColObj["visible"] = false;
	    		 hiddenColumnObjArray.push(hiddenColObj);
	    		 
	    		 dataTableParamObj["columnDefs"] = hiddenColumnObjArray ;
	    		 
	    	 } 
	    	 
	    	 dataTableParamObj["searching"] = gridObj.isSearchVisible;
	    	 dataTableParamObj["sort"] = false;

	    	 //dataTableParamObj["order"] = [[ 1, 'asc' ]];
	    	 
	       	var table =  $('#'+dataGridTableId).dataTable(dataTableParamObj);
	       	
	      	$(".dataTables_length_ws").hide();
	      	$(".dataTables_info_ws").parent().remove();
	       	
	       	
		},
		
		formDataSlide : function(gridParam,tableId)
		{
			var primaryFieldArray = [];
			var tableHeader = [];
			var data = gridParam.dataArray;
			var primaryField = gridParam.primaryField;
			var hiddenCols = dataGridModel.hiddenColumns;
			var secondaryField = gridParam.secondaryField;
			
			if (data != null && data != "" && data.length > 0) {
					
				for(var i =0; i<data.length; i++)
				{
						var obj = {};
						obj.secondayValue = "";
						obj.divName = tableId;
						
						var hasData = false;
						for ( var headerName in data[i]) {
							
							if(primaryField == "" && !dataGridController.hasKeyExists(hiddenCols,headerName)){
								primaryField = headerName;
							}
							
							if(primaryField == headerName)
							{
								hasData = true;
								obj.primaryValue = data[i][headerName];
							}
							
							if(secondaryField == headerName)
							{
								hasData = true;
								obj.secondayValue = data[i][headerName];
							}
						}
						
						if(hasData)
						{
							obj.details = data[i];
							obj.hiddenColumns = hiddenCols;
							obj.gridHeaders = dataGridModel.gridHeaders;
							primaryFieldArray.push(obj);
							
						}
				}
				
				
			}
			
			//gridParam.primaryField = tableHeader;
			
			dataGridModel.names(primaryFieldArray);
			var loop = '';
			//dataGridModel.name(key);
			loop ='<div style="width: 100%; float: left; overflow: hidden;" id="permaDiv">'+
					'<div id="MainDiv_'+tableId+'" class="MainDiv table-responsive">'+ 
					'<div id="first" class="firstMain" data-bind = "foreach : dataGridModel.names">'+
				
					'<div class="designing" style="cursor:pointer;" data-bind = ' +
					 ' "click: function(data,event) {dataGridController.showDetails(data,event,$root.callbackFunction)}" >'+
					
					'<div style=" width: 70%; float: left; word-wrap: break-word;">'+
						'<span data-bind="text : primaryValue"></span>'+
						'<div data-bind="text : secondayValue" class="bottomTip"></div>'+
					'</div>'+
					
					'<div style="float:right;padding: 0% 0% 0% 0%;">'+
					'<div class="editIcon" style="float:left;margin-right: 5px;" data-bind ="visible:$root.isEditButton,'+
					
					'click:function($data,event){event.stopPropagation();' +
		               '	if($.isFunction($root.callbackFunction))'+
		               '   {' +
		               '      $root.callbackFunction.apply(this,[$data.details,event,\'rowSelect\'])' +
		               '    }' + 
		               '   else' +
		               '    { ' +
		               '		window[$root.callbackFunction].apply(this,[$data.details,event,\'rowSelect\'])' +
		               '	}}'+
					
					
					'" style="float:left;"></div>'+
					'<div class="deleteIcon" style="float:left;margin-right: 5px;" data-bind ="visible:$root.isDeleteButton,'+
						
						'click:function($data,event){event.stopPropagation();' +
			               '	if($.isFunction($root.callbackFunction))'+
			               '   {' +
			               '      $root.callbackFunction.apply(this,[$data.details,event,\'delete\'])' +
			               '    }' + 
			               '   else' +
			               '    { ' +
			               '		window[$root.callbackFunction].apply(this,[$data.details,event,\'delete\'])' +
			               '	}}'+
						
						
						'" style="float:left;"></div>'+
						
						'<div class="closeIcon"  data-bind ="visible:$root.isStatusCloseButton,'+
						
						'click:function($data,event){event.stopPropagation();' +
			               '	if($.isFunction($root.callbackFunction))'+
			               '   {' +
			               '      $root.callbackFunction.apply(this,[$data.details,event,\'close\'])' +
			               '    }' + 
			               '   else' +
			               '    { ' +
			               '		window[$root.callbackFunction].apply(this,[$data.details,event,\'close\'])' +
			               '	}}'+
						
						
						'" style="float:left;"></div>'+
					'</div>'+
						'</div>'+
					'</div>'+
				'<div id="secondMain_'+tableId+'" class="secondMain">'+
				'<div id="num"></div>'+
				/*'<button type="button" id="forBack" onclick="dataGridController.goBack()">Back</button>'+*/
			'</div>'+
			
			'</div>'+
		'</div>';
			
				
			
			return loop;
		},
		showDetails : function(data,event,callbackFunction)
		{
			try{
				var detailObj = data.details;
				var divName = data.divName;
				var customHeaderObject = data.gridHeaders;
				var htmlStr = "";
				htmlStr += '<div class="detailsHeader"> Details <span class="forGoBack" onclick=dataGridController.commonGoBack("'+divName+'") <a style="cursor:pointer;"><img src="../img/back_arrow.png" ></a></span> </div>';
				
				for ( customHeaderKey in detailObj) 
				{
					
					var incomingHeaderName = customHeaderObject[customHeaderKey];
					var hiddenCols = data.hiddenColumns;
					
					if(!dataGridController.hasKeyExists(hiddenCols,customHeaderKey))
					{
						//alert("hidval"+ JSON.stringify(hiddenCols));
						var labelToDisplay = "";
						if(incomingHeaderName == undefined)
						{
							labelToDisplay = customHeaderKey;
						}
						else
						{
							labelToDisplay = incomingHeaderName;
						}
						
						htmlStr +='<div class="detailsDiv">'+
										'<span ><label>'+labelToDisplay+'</label>&nbsp;:&nbsp;'+detailObj[customHeaderKey]+'</span>'+
									'</div>';
					}
				}
				
				
				var detailsDivName = "#secondMain_"+divName;
				
				
				var third = "";
				htmlStr += '<div class="detailsHeader historyHeader"> History </div>';
				third += '<div id="tempDiv"></div>';
				
				$(detailsDivName).html(htmlStr);
				$(detailsDivName).append(third);
				$("#MainDiv_"+divName).addClass("infoScreen");
				$(".historyHeader").css("display","none");
				
				$(detailsDivName).swipe({
					swipeRight:function(event, direction, distance, duration, fingerCount) {
						event.stopPropagation();
						$("#num").html('');
						$("#MainDiv_"+divName).removeClass("infoScreen");
						//$(".historyHeader").css("display","block");
						if(divName == 'tempDiv1' && localStorage.getItem("userType") == 5)
						{
							$(".historyHeader").css("display","block");
						}
					}
				});
				

				$("#tempDiv").swipe({
					swipeRight:function(event, direction, distance, duration, fingerCount) {
						event.stopPropagation();
						$("#num").html('');
						$("#secondMain_"+divName).removeClass("infoScreen");
					}
				});
				
				try{
				 if(callbackFunction != null && callbackFunction != undefined){
		             if($.isFunction(callbackFunction))
		             {
		            	 callbackFunction.apply(this,[data.details,event,'rowSelectOnMobile']);
		             } 
		             else
		             { 
		               window[callbackFunction].apply(this,[data.details,event,'rowSelectOnMobile']);
		             }
				 }
				}catch(e){}
				
			}
			catch(e){alert(e.message);}
		},
		
		commonGoBack : function(divName){
						$("#num").html('');
						$("#MainDiv_"+divName).removeClass("infoScreen");
						//$("#secondMain_"+divName).removeClass("infoScreen");
						if(divName == 'tempDiv1' && localStorage.getItem("userType") == 5)
						{
							$(".historyHeader").css("display","block");
						}
					
		},
	
		hasKeyExists : function(arr,val)
		{
			
			var hasKey = false;
			
			for(key in arr)
			{
				if(arr[key] == val)
					hasKey = true;
			}
			return hasKey;
		},
		goBack : function()
		{
			$("#num").html('');
			$("#MainDiv").removeClass("infoScreen");
		}
		
		
};
$(document).ready(function(){

	$("#secondMain").swipe({
		swipeRight:function(event, direction, distance, duration, fingerCount) {
		
			$("#num").html('');
			$("#MainDiv").removeClass("infoScreen");
			$(".historyHeader").css("display","block");
		}
			
	});
	
});



function showPrevPage(event)
{
	if( (paginationObj.currentPageNo()+1) > 1)
	{
		currentPageNo = paginationObj.currentPageNo() - 1;
		paginationObj.currentPageNo(currentPageNo);
		
		var id = $(event.currentTarget).attr("dataObj");
		if(id != undefined && gridServiceCallCollection[id] != undefined)
		{
			 var tempObj = gridServiceCallCollection[id];
			 resultGlobalClass.requestUrl = tempObj["requestUrl"]
			 resultGlobalClass.additionalParams = tempObj["additionalParams"];
			 resultGlobalClass.requestData = tempObj["requestData"];
			 resultGlobalClass.response = tempObj["response"]; 
			 resultGlobalClass.resultType = tempObj["resultType"];
			 resultGlobalClass.isLoaderVisible = tempObj["isLoaderVisible"];
			 resultGlobalClass.isAsyncCall = tempObj["isAsyncCall"] ;
			 resultGlobalClass.isTotalCountNeeded= tempObj["isTotalCountNeeded"];
			 resultGlobalClass.requestUrl = tempObj["requestUrl"];
			 resultGlobalClass.gridName = tempObj["gridName"];
			 resultGlobalClass.callback = tempObj["callback"];

		}
		
		if(resultGlobalClass.requestData.totalCount != undefined){
			resultGlobalClass.requestData.totalCount = false;
		}

		ServiceCalls.call();
		
	}
	
};

function showNextPage(event)
{
	if((paginationObj.currentPageNo()+1) < paginationObj.totalPages())
	{	
		paginationObj.currentPageNo(paginationObj.currentPageNo() + 1);
		
		var id = $(event.currentTarget).attr("dataObj");
		if(id != undefined && gridServiceCallCollection[id] != undefined)
		{
			//resultGlobalClass = gridServiceCallCollection[id];
			 var tempObj = gridServiceCallCollection[id];
			 resultGlobalClass.requestUrl = tempObj["requestUrl"]
			 resultGlobalClass.additionalParams = tempObj["additionalParams"];
			 resultGlobalClass.requestData = tempObj["requestData"];
			 resultGlobalClass.response = tempObj["response"]; 
			 resultGlobalClass.resultType = tempObj["resultType"];
			 resultGlobalClass.isLoaderVisible = tempObj["isLoaderVisible"];
			 resultGlobalClass.isAsyncCall = tempObj["isAsyncCall"] ;
			 resultGlobalClass.isTotalCountNeeded= tempObj["isTotalCountNeeded"];
			 resultGlobalClass.requestUrl = tempObj["requestUrl"];
			 resultGlobalClass.gridName = tempObj["gridName"];
			 resultGlobalClass.callback = tempObj["callback"];
		}
		
		if(resultGlobalClass.requestData.totalCount != undefined){
			resultGlobalClass.requestData.totalCount = false;
		}
		
		ServiceCalls.call();
	}
	
	
};