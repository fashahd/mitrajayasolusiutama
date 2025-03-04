/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.view.Finance.Loan.MainGrid' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Finance.Loan.MainGrid',
    renderTo: 'ext-content',
    style:'padding:0 7px 7px 7px;margin:2px 0 0 0;',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
            document.getElementById('ContentTopBar').style.display = 'block';

			var employee_loan_src = JSON.parse(localStorage.getItem('employee_loan_src'));

            if(employee_loan_src){
                Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-keySearch').setValue(employee_loan_src.keySearch);				
                Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-StartDate').setValue(employee_loan_src.StartDate);
                Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-EndDate').setValue(employee_loan_src.EndDate);
				Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-CustomerID').setValue(employee_loan_src.CustomerID);
            }
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Finance.Loan.MainGrid');
		

		thisObj.combo_company = Ext.create('MitraJaya.store.General.CompanyList',{
        	storeVar: {
                CustomerID: ''
            }
        });

        //ContextMenu
        thisObj.ContextMenuGrid = Ext.create('Ext.menu.Menu',{
            cls:'Sfr_ConMenu',
	        items:[{
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
                text: lang('View'),
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.Finance.Loan.MainGrid-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Finance.Loan.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Finance.Loan.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'view',
                                EmployeeLoanID: sm.get('EmployeeLoanID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Finance.Loan.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Finance.Loan.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'view',
                                EmployeeLoanID: sm.get('EmployeeLoanID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }
	            }
	        },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
                text: lang('Update'),
                cls:'Sfr_BtnConMenuWhite',
                hidden: m_act_update,
                itemId: 'MitraJaya.view.Finance.Loan.MainGrid-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Finance.Loan.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Finance.Loan.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                EmployeeLoanID: sm.get('EmployeeLoanID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Finance.Loan.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Finance.Loan.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                EmployeeLoanID: sm.get('EmployeeLoanID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }
	            }
	        },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eraser.svg',
                text: lang('Delete'),
                cls:'Sfr_BtnConMenuWhite',
	            hidden: m_act_delete,
                itemId: 'MitraJaya.view.Finance.Loan.MainGrid-ContextMenuDelete',
	            handler: function(){
                    var sm = Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-Grid').getSelectionModel().getSelection()[0];

					Swal.fire({
						title: 'Do you want to delete this data ?',
						text: "You won't be able to revert this!",
						icon: 'warning',
						showCancelButton: true,
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33',
						confirmButtonText: 'Yes, delete it!'
					}).then((result) => {
						if (result.isConfirmed) {
							Ext.Ajax.request({
								waitMsg: 'Please Wait',
								url: m_api + '/v1/finance/loan/delete_loan',
								method: 'DELETE',
								params: {
									EmployeeLoanID: sm.get('EmployeeLoanID')
								},
								success: function(response, opts) {
									Swal.fire(
										'Deleted!',
										'Your file has been deleted.',
										'success'
									)

									//refresh store
									thisObj.StoreGridMain.load();
								},
								failure: function(rp, o) {
									try {
										var r = Ext.decode(rp.responseText);
										Swal.fire(
											'Failed!',
											r.message,
											'warning'
										)
									}
									catch(err) {										
										Swal.fire(
											'Failed!',
											'Connection Error',
											'warning'
										)
									}
								}
							});
						}
					})
	            }
	        }]
	    });

        thisObj.items = [{
            layout: 'column',
            border: false,
            items: [{
				columnWidth: 1,
				layout: 'form',
				cls: 'Sfr_PanelLayoutFormContainer',
				items: [{
					xtype: 'form',
					fileUpload: true,
					buttonAlign: 'center',
					items: [{
						layout: 'column',
						border: false,
						hidden:true,
						items: [{
							columnWidth: 0.18,
							layout: 'form',
							style: 'padding-right:10px',
							items: [{
								name: 'MitraJaya.view.Finance.Loan.MainGrid-keySearch',
								id: 'MitraJaya.view.Finance.Loan.MainGrid-keySearch',
								xtype: 'textfield',
								baseCls: 'Sfr_TxtfieldSearchGrid',
								fieldLabel:'PO Number',
								labelAlign:'top',
								emptyText: lang('Search by PO Number')
							}]
						},{
							columnWidth: 0.15,
							layout: 'form',
							style: 'padding-right:10px',
							items: [{
								xtype: 'datefield',
								format: 'Y-m-d',
								id:"MitraJaya.view.Finance.Loan.MainGrid-StartDate",
								//altFormats: 'Ymd',
								fieldLabel:'Start Contract Date',
								labelAlign:'top',
								vtype: 'daterange',
								endDateField: 'MitraJaya.view.Finance.Loan.MainGrid-EndDate',
								listeners:{
									'change': function(th,a){
										Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-EndDate').setMinValue(a);
									}
								}
							}]
						},{
							columnWidth: 0.15,
							layout: 'form',
							style: 'padding-right:10px',
							items: [{
								xtype: 'datefield',
								format: 'Y-m-d',
								id:"MitraJaya.view.Finance.Loan.MainGrid-EndDate",
								//altFormats: 'Ymd',
								fieldLabel:'End Contract Date',
								labelAlign:'top',
								vtype: 'daterange',
								endDateField: 'MitraJaya.view.Finance.Loan.MainGrid-StartDate',
								listeners:{
									'change': function(th,a){
										Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-StartDate').setMaxValue(a);
									}
								}
							}]
						},{
							columnWidth: 0.2,
							layout: 'form',
							items: [{
								xtype: 'combobox',
								id:'MitraJaya.view.Finance.Loan.MainGrid-CustomerID',
								name:'MitraJaya.view.Finance.Loan.MainGrid-CustomerID',
								store:thisObj.combo_company,
								labelAlign:'top',
								fieldLabel:'Customer',
								queryMode:'local',
								displayField:'label',
								valueField:'id',
								allowBlank:false,
								baseCls: 'Sfr_FormInputMandatory'										
							}]
						},{
							columnWidth: 0.1,
							layout: 'form',
							items: [{
								xtype:'button',
								// icon: varjs.config.base_url + 'images/icons/new/add-filter.png',
								text:lang('Search'),
								style:'margin-left:20px; margin-top:30px',
								cls:'Sfr_BtnFormCyan',
								overCls:'Sfr_BtnFormCyan-Hover',
								id: 'MitraJaya.view.Finance.Loan.MainGrid-BtnApplyFilter',
								handler: function() {
									console.log("test");
									setFilterLs();
								}
							}]
						}]
					}]
				}]
			}]
		},
		{
            xtype: 'grid',
            id: 'MitraJaya.view.Finance.Loan.MainGrid-Grid',
            style: 'border:1px solid #CCC;margin-top:4px;',
            cls:'Sfr_GridNew',
			minHeight:600,
            loadMask: true,
            selType: 'rowmodel',
            store: thisObj.StoreGridMain,
            enableColumnHide: false,
            viewConfig: {
                deferEmptyText: false,
                emptyText: GetDefaultContentNoData()
            },
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: thisObj.StoreGridMain,
                dock: 'bottom',
                displayInfo: true,
                displayMsg: lang('Showing')+' {0} '+lang('to')+' {1} '+lang('of')+' {2} '+lang('data')
            },{
                xtype: 'toolbar',
                dock:'top',
                items: [{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/square-plus.svg',
                    text: lang('Add'),
                    hidden: m_act_add,
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    id: 'MitraJaya.view.Finance.Loan.MainGrid-BtnAdd',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid').destroy(); //destory current view
                    	var FormMainFarmer = [];

                        //create object View untuk FormMainGrower
                        if(Ext.getCmp('MitraJaya.view.Finance.Loan.MainForm') == undefined){
                            FormMainFarmer = Ext.create('MitraJaya.view.Finance.Loan.MainForm', {
                            	viewVar: {
                                    OpsiDisplay: 'insert',
                                    PanelDisplayID: null
		                        }
                            });
                        }else{
                            //destroy, create ulang
                            Ext.getCmp('MitraJaya.view.Finance.Loan.MainForm').destroy();
                            FormMainFarmer = Ext.create('MitraJaya.view.Finance.Loan.MainForm', {
                                viewVar: {
                                    OpsiDisplay: 'insert',
                                    PanelDisplayID: null
		                        }
                            });
                        }
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/file-export.svg',
                    text: lang('Export'),
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_export_excel,
                    id: 'MitraJaya.view.Finance.Loan.MainGrid-BtnExport',
                    handler: function() {
						var keySearch	= Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-keySearch').getValue();
						var StartDate	= Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-StartDate').getValue();
						var EndDate		= Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-EndDate').getValue();
						var CustomerID	= Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-CustomerID').getValue();

						Swal.fire({
							text: "Export data ?",
							icon: 'warning',
							showCancelButton: true,
							confirmButtonColor: '#3085d6',
							cancelButtonColor: '#d33',
							confirmButtonText: 'Yes, Export it!'
						}).then((result) => {
							if (result.isConfirmed) {
								Ext.Ajax.request({
									url: m_api + '/v1/finance/order/export_order',
									method: 'POST',
									waitMsg: lang('Please Wait'),
									params: {
										keySearch : keySearch,
										StartDate : StartDate,
										EndDate : EndDate,
										CustomerID : CustomerID
									},
									success: function(data) {
										console.log(data);
										if(!fetchJSON(data.responseText)){
											Swal.fire({
												icon: 'error',
												text: 'Connection Failed',
												// footer: '<a href="">Why do I have this issue?</a>'
											})
											return false;
										}

										var jsonResp = JSON.parse(data.responseText);
											if (jsonResp.success == true) {
											window.location = jsonResp.filenya;
										} else if (jsonResp.message == 'Empty') {
											Swal.fire({
												icon: 'warning',
												text: jsonResp.filenya,
												// footer: '<a href="">Why do I have this issue?</a>'
											})
											return false;                                                    
										}
									},
									failure: function() {
										Ext.MessageBox.hide();										
										Swal.fire({
											icon: 'error',
											text: 'Failed to export, Please try again',
											// footer: '<a href="">Why do I have this issue?</a>'
										})
									}
								});
							}
						})

                        // Ext.MessageBox.confirm(lang('Message'), lang('Export data ?') , function(btn){
						// 	if (btn == 'yes') {
						// 		Ext.MessageBox.show({
						// 			msg: lang('Please wait...'),
						// 			progressText: lang('Exporting...'),
						// 			width: 300,
						// 			wait: true,
						// 			waitConfig: {
						// 				interval: 200
						// 			},
						// 			icon: 'ext-mb-download', //custom class in msg-box.html
						// 			animateTarget: 'mb7'
						// 		});
								
						// 		var cof_gridfarmers_params = JSON.parse(localStorage.getItem('cof_gridfarmers_params'));
						// 		if(cof_gridfarmers_params != null){       
										
						// 		} else {
									
						// 		}
								
						// 		Ext.Ajax.request({
						// 			url: m_api + '/farmers/farmer_export_excel',
						// 			method: 'POST',
						// 			waitMsg: lang('Please Wait'),
						// 			params: {
						// 			},
						// 			success: function(data) {
						// 				Ext.MessageBox.hide();
						// 				if(!fetchJSON(data.responseText)){
						// 					Ext.MessageBox.show({
						// 						title: 'Failed',
						// 						msg: 'Connection Failed',
						// 						buttons: Ext.MessageBox.OK,
						// 						animateTarget: 'mb9',
						// 						icon: 'ext-mb-error'
						// 					});
						// 					return false;
						// 				}

						// 				var jsonResp = JSON.parse(data.responseText);
						// 					if (jsonResp.success == true) {
						// 					window.location = jsonResp.filenya;
						// 				} else if (jsonResp.message == 'Empty') {
						// 					Ext.MessageBox.show({
						// 						title: lang('Success'),
						// 						msg: lang(jsonResp.filenya),
						// 						buttons: Ext.MessageBox.OK,
						// 						animateTarget: 'mb9',
						// 						icon: 'ext-mb-info'
						// 					});
						// 					return false;                                                    
						// 				}
						// 			},
						// 			failure: function() {
						// 				Ext.MessageBox.hide();
						// 				Ext.MessageBox.show({
						// 					title: 'Notifications',
						// 					msg: 'Failed to export, Please try again.',
						// 					buttons: Ext.MessageBox.OK,
						// 					animateTarget: 'mb9',
						// 					icon: 'ext-mb-error'
						// 				});
						// 			}
						// 		});
						// 	}
						// });
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/upload.svg',
                    text: lang('Import'),
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_export_excel,
                    id: 'MitraJaya.view.Finance.Loan.MainGrid-BtnImport',
                    handler: function() {
                        var winImportFarmers = Ext.create('MitraJaya.view.Finance.Loan.WinImportFarmers');
                        if (!winImportFarmers.isVisible()) {
                            winImportFarmers.center();
                            winImportFarmers.show();
                        } else {
                            winImportFarmers.close();
                        }
                    }
                },{
                    xtype:'tbspacer',
                    flex:1
                },{
                    icon: varjs.config.base_url + 'images/icons/new/add-filter.png',
                    cls: 'Sfr_BtnGridPaleBlue',
                    text: lang('Advanced Filter'),
					hidden:true,
                    handler: function () {
                        //advanced search
                        var winAdvFilter = Ext.create('MitraJaya.view.Finance.Loan.WinAdvancedFilter');
                        if (!winAdvFilter.isVisible()) {
                            winAdvFilter.center();
                            winAdvFilter.show();
                        } else {
                            winAdvFilter.close();
                        }
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/recycle.svg',
                    cls:'Sfr_BtnGridBlue',
                    overCls:'Sfr_BtnGridBlue-Hover',
                    id: 'MitraJaya.view.Finance.Loan.MainGrid-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-Grid').getStore().loadPage(1);
                    }
                }]
            }],
            columns:[{
            	text: '',
                xtype:'actioncolumn',
                flex: 1,
                items:[{
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/caret-down.svg',
                    handler: function(grid, rowIndex, colIndex, item, e, record) {
                        thisObj.ContextMenuGrid.showAt(e.getXY());
                    }
                }]
            },{
                text: 'No',
                flex: 1,
                xtype: 'rownumberer'
            },{
                text: lang('EmployeeLoanID'),
                dataIndex: 'EmployeeLoanID',
                hidden: true
            },{
                text: lang('Doc Number'),
                dataIndex: 'DocNumber',
                flex: 10
            },{
                text: lang('Name'),
                dataIndex: 'Name',
                flex: 10
            },{
                text: lang('Loan Date'),
                dataIndex: 'LoanDate',
                flex: 5
            },{
                text: lang('Transfer Date'),
                dataIndex: 'LoanTransferDate',
                flex: 5
            },{
                text: lang('Loan Amount'),
                dataIndex: 'LoanAmount',
                flex: 10
            },{
                text: lang('Total Payment'),
                dataIndex: 'TotalPayment',
                flex: 10
            },{
                text: lang('Loan Remaining'),
                dataIndex: 'LoanRemaining',
                flex: 10
            },{
                text: lang('Description'),
                dataIndex: 'LoanDescription',
                flex: 10
            }]
        }];

        this.callParent(arguments);
    },
    submitOnEnterGrid: function (field, event) {        
		localStorage.setItem('employee_loan_src', JSON.stringify({
			keySearch	: Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-keySearch').getValue(),
			StartDate	: Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-StartDate').getValue(),
			EndDate		: Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-EndDate').getValue(),
			CustomerID	: Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-CustomerID').getValue()
		}));
		Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-Grid').getStore().loadPage(1);
    }
});



function setFilterLs() {
	localStorage.setItem('employee_loan_src', JSON.stringify({
		keySearch	: Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-keySearch').getValue(),
		StartDate	: Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-StartDate').getValue(),
		EndDate		: Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-EndDate').getValue(),
		CustomerID	: Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-CustomerID').getValue()
	}));
	Ext.getCmp('MitraJaya.view.Finance.Loan.MainGrid-Grid').getStore().loadPage(1);
}   

function fetchJSON(text){
    try{
        JSON.parse(text);
        return true;
    }
    catch (error){
        return false;
    }
}
