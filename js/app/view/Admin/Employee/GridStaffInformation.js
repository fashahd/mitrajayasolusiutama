/******************************************
 *  Author : n1colius.lau@gmail.com   
 *  Created On : Wed Jul 24 2019
 *  File : PanelFormAdditionalKrakakoa.js
 *******************************************/

/*
    Param2 yg diperlukan ketika load View ini
    - FarmerID
*/

Ext.define('MitraJaya.view.Admin.Employee.GridStaffInformation', {
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Admin.Employee.GridStaffInformation',
    listeners: {
        afterRender: function(component, eOpts){
			
        }
    },
    initComponent: function () {
        var thisObj = this;

        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Admin.Employee.MainGrid');

        thisObj.items = [{
            xtype: 'grid',
            id: 'MitraJaya.view.Admin.Employee.GridStaffInformation-Grid',
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
                displayMsg: 'Showing'+' {0} '+'to'+' {1} '+'of'+' {2} '+'data'
            },{
                xtype: 'toolbar',
                dock:'top',
                items: [{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/square-plus.svg',
                    text: 'Add',
                    hidden: m_act_add,
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    id: 'MitraJaya.view.Admin.Employee.GridStaffInformation-BtnAdd',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Admin.Employee.GridStaffInformation').destroy(); //destory current view
                    	var FormMainFarmer = [];

                        //create object View untuk FormMainGrower
                        if(Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm') == undefined){
                            FormMainFarmer = Ext.create('MitraJaya.view.Admin.Employee.MainForm', {
                            	viewVar: {
                                    OpsiDisplay: 'insert',
                                    PanelDisplayID: null
		                        }
                            });
                        }else{
                            //destroy, create ulang
                            Ext.getCmp('MitraJaya.view.Admin.Employee.MainForm').destroy();
                            FormMainFarmer = Ext.create('MitraJaya.view.Admin.Employee.MainForm', {
                                viewVar: {
                                    OpsiDisplay: 'insert',
                                    PanelDisplayID: null
		                        }
                            });
                        }
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/download.svg',
                    text: 'Export',
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_export_excel,
                    id: 'MitraJaya.view.Admin.Employee.GridStaffInformation-BtnExport',
                    handler: function() {
						var keySearch	= Ext.getCmp('MitraJaya.view.Admin.Employee.GridStaffInformation-keySearch').getValue();
						var StartDate	= Ext.getCmp('MitraJaya.view.Admin.Employee.GridStaffInformation-StartDate').getValue();
						var EndDate		= Ext.getCmp('MitraJaya.view.Admin.Employee.GridStaffInformation-EndDate').getValue();
						var people_id	= Ext.getCmp('MitraJaya.view.Admin.Employee.GridStaffInformation-people_id').getValue();

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
									url: m_api + '/v1/finance/invoice/export_invoice',
									method: 'POST',
									waitMsg: 'Please Wait',
									params: {
										keySearch : keySearch,
										StartDate : StartDate,
										EndDate : EndDate,
										people_id : people_id
									},
									success: function(data) {
										// console.log(data);
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
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/upload.svg',
                    text: 'Import',
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_export_excel,
                    id: 'MitraJaya.view.Admin.Employee.GridStaffInformation-BtnImport',
                    handler: function() {
                        var winImportFarmers = Ext.create('MitraJaya.view.Admin.Employee.WinImportFarmers');
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
					name: 'MitraJaya.view.Admin.Employee.GridStaffInformation-keySearch',
					id: 'MitraJaya.view.Admin.Employee.GridStaffInformation-keySearch',
					xtype: 'textfield',
					baseCls: 'Sfr_TxtfieldSearchGrid',
					width:340,
					emptyText: 'Search by Employee Name, Press Enter to Search',
					listeners: {
						specialkey: thisObj.submitOnEnterGrid
					}
				},{
                    icon: varjs.config.base_url + 'images/icons/new/add-filter.png',
                    cls: 'Sfr_BtnGridPaleBlue',
                    text: 'Advanced Filter',
					hidden:true,
                    handler: function () {
                        //advanced search
                        var winAdvFilter = Ext.create('MitraJaya.view.Admin.Employee.WinAdvancedFilter');
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
                    id: 'MitraJaya.view.Admin.Employee.GridStaffInformation-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Admin.Employee.GridStaffInformation-Grid').getStore().loadPage(1);
                    }
                }]
            }],
            columns:[{
            	text: '',
                xtype:'actioncolumn',
                flex: 5,
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
                text: 'People ID',
                dataIndex: 'people_id',
                hidden: true
            },{
                text: 'Employee ID',
                dataIndex: 'people_ext_id',
                flex:10
            },{
                text: 'Name',
                dataIndex: 'people_name',
                flex:10
            },{
                text: 'Gender',
                dataIndex: 'people_gender',
                flex: 5
            },{
                text: 'Phone Number',
                dataIndex: 'phone_number',
                flex: 10
            },{
                text: 'Email',
                dataIndex: 'people_email',
                flex: 10
			},{
                text: 'Address',
                dataIndex: 'address',
                flex: 20
            }]
        }];

        this.callParent(arguments);
    }
});
