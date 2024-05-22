/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.view.InternalData.VendorPayment.MainGrid' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.InternalData.VendorPayment.MainGrid',
    renderTo: 'ext-content',
    style:'padding:0 7px 7px 7px;margin:2px 0 0 0;',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
            document.getElementById('ContentTopBar').style.display = 'block';

			var vendor_payment_src = JSON.parse(localStorage.getItem('vendor_payment_src'));

            if(vendor_payment_src){
                Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-keySearch').setValue(vendor_payment_src.keySearch);
				Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-VendorID').setValue(vendor_payment_src.VendorID);
				Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-ProjectID').setValue(vendor_payment_src.ProjectID);
            }
        }
    },
    initComponent: function() {
        var thisObj = this;

        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.InternalData.VendorPayment.MainGrid');
		

		thisObj.combo_company = Ext.create('MitraJaya.store.General.CompanyList',{
        	storeVar: {
                CustomerID: ''
            }
        });

        thisObj.combo_vendor = Ext.create('MitraJaya.store.General.VendorList');
		thisObj.combo_project = Ext.create('MitraJaya.store.General.ProjectList');

        //ContextMenu
        thisObj.ContextMenuGrid = Ext.create('Ext.menu.Menu',{
            cls:'Sfr_ConMenu',
	        items:[{
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
                text: 'View',
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.InternalData.VendorPayment.MainGrid-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.InternalData.VendorPayment.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'view',
                                PaymentID: sm.get('PaymentID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.InternalData.VendorPayment.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'view',
                                PaymentID: sm.get('PaymentID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }
	            }
	        },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
                text: 'Update',
                cls:'Sfr_BtnConMenuWhite',
                hidden: m_act_update,
                itemId: 'MitraJaya.view.InternalData.VendorPayment.MainGrid-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.InternalData.VendorPayment.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                PaymentID: sm.get('PaymentID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.InternalData.VendorPayment.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                PaymentID: sm.get('PaymentID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }
	            }
	        },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eraser.svg',
                text: 'Delete',
                cls:'Sfr_BtnConMenuWhite',
	            hidden: m_act_delete,
                itemId: 'MitraJaya.view.InternalData.VendorPayment.MainGrid-ContextMenuDelete',
	            handler: function(){
                    var sm = Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-Grid').getSelectionModel().getSelection()[0];

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
								url: m_api + '/v1/internaldata/vendorpayment/delete_payment',
								method: 'DELETE',
								params: {
									PaymentID: sm.get('PaymentID'),
									DocumentNo: sm.get('DocumentNo')
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
						hidden:false,
						items: [{
							columnWidth: 0.18,
							layout: 'form',
							style: 'padding-right:10px',
							items: [{
								name: 'MitraJaya.view.InternalData.VendorPayment.MainGrid-keySearch',
								id: 'MitraJaya.view.InternalData.VendorPayment.MainGrid-keySearch',
								xtype: 'textfield',
								baseCls: 'Sfr_TxtfieldSearchGrid',
								fieldLabel:'Document No',
								labelAlign:'top',
								emptyText: 'Search by Document No'
							}]
						},{
							columnWidth: 0.2,
							layout: 'form',
							items: [{
								xtype: 'combobox',
								id:'MitraJaya.view.InternalData.VendorPayment.MainGrid-VendorID',
								name:'MitraJaya.view.InternalData.VendorPayment.MainGrid-VendorID',
								store:thisObj.combo_vendor,
								labelAlign:'top',
								fieldLabel:'Vendor',
								queryMode:'local',
								displayField:'label',
								valueField:'id'										
							}]
						},{
							columnWidth: 0.2,
							layout: 'form',
							items: [{
								xtype: 'combobox',
								id:'MitraJaya.view.InternalData.VendorPayment.MainGrid-ProjectID',
								name:'MitraJaya.view.InternalData.VendorPayment.MainGrid-ProjectID',
								store:thisObj.combo_project,
								labelAlign:'top',
								fieldLabel:'PO Number',
								queryMode:'local',
								displayField:'label',
								valueField:'id'								
							}]
						},{
							columnWidth: 0.1,
							layout: 'form',
							items: [{
								xtype:'button',
								text:'Search',
								style:'margin-left:20px; margin-top:30px',
								cls:'Sfr_BtnFormCyan',
								overCls:'Sfr_BtnFormCyan-Hover',
								id: 'MitraJaya.view.InternalData.VendorPayment.MainGrid-BtnApplyFilter',
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
            id: 'MitraJaya.view.InternalData.VendorPayment.MainGrid-Grid',
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
                    id: 'MitraJaya.view.InternalData.VendorPayment.MainGrid-BtnAdd',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid').destroy(); //destory current view
                    	var FormMainFarmer = [];

                        //create object View untuk FormMainGrower
                        if(Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm') == undefined){
                            FormMainFarmer = Ext.create('MitraJaya.view.InternalData.VendorPayment.MainForm', {
                            	viewVar: {
                                    OpsiDisplay: 'insert',
                                    PanelDisplayID: null
		                        }
                            });
                        }else{
                            //destroy, create ulang
                            Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm').destroy();
                            FormMainFarmer = Ext.create('MitraJaya.view.InternalData.VendorPayment.MainForm', {
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
                    text: 'Export',
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_export_excel,
                    id: 'MitraJaya.view.InternalData.VendorPayment.MainGrid-BtnExport',
                    handler: function() {
						var keySearch	= Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-keySearch').getValue();
						var VendorID	= Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-VendorID').getValue();
						var ProjectID	= Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-ProjectID').getValue();

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
									url: m_api + '/v1/internaldata/vendorpayment/export_payment',
									method: 'POST',
									waitMsg: 'Please Wait',
									params: {
										keySearch : keySearch,
										VendorID : VendorID,
										ProjectID : ProjectID
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
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/file-import.svg',
                    text: 'Import',
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_add,
                    id: 'MitraJaya.view.InternalData.VendorPayment.MainGrid-BtnImport',
                    handler: function() {
						var WinFormImport = Ext.create('MitraJaya.view.InternalData.VendorPayment.WinFormImport');
                        if (!WinFormImport.isVisible()) {
                            WinFormImport.center();
                            WinFormImport.show();
                        } else {
                            WinFormImport.close();
                        }
                    }
                },{
                    xtype:'tbspacer',
                    flex:1
                },{
                    icon: varjs.config.base_url + 'images/icons/new/add-filter.png',
                    cls: 'Sfr_BtnGridPaleBlue',
                    text: 'Advanced Filter',
					hidden:true,
                    handler: function () {
                        //advanced search
                        var winAdvFilter = Ext.create('MitraJaya.view.InternalData.VendorPayment.WinAdvancedFilter');
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
                    id: 'MitraJaya.view.InternalData.VendorPayment.MainGrid-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-Grid').getStore().loadPage(1);
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
                text: 'PaymentID',
                dataIndex: 'PaymentID',
                hidden: true
            },{
                text: 'Document No',
                dataIndex: 'DocumentNo',
                flex: 10
            },{
                text: 'PO Number',
                dataIndex: 'ProjectName',
                flex: 10
            },{
                text: 'Vendor Name',
                dataIndex: 'VendorName',
                flex: 10
            },{
                text: 'Description',
                dataIndex: 'Description',
                flex: 10
            },{
                text: 'Due Date',
                dataIndex: 'DueDate',
                flex: 8
            },{
                text: 'Amount',
                dataIndex: 'Amount',
                flex: 10
            },{
                text: 'Outstanding',
                dataIndex: 'Outstanding',
                flex: 10
            },{
                text: 'Status',
                dataIndex: 'PaidStatus',
                flex: 10
            }]
        }];

        this.callParent(arguments);
    },
    submitOnEnterGrid: function (field, event) {        
		localStorage.setItem('vendor_payment_src', JSON.stringify({
			keySearch	: Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-keySearch').getValue(),
			VendorID	: Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-VendorID').getValue(),
			ProjectID	: Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-ProjectID').getValue()
		}));
		Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-Grid').getStore().loadPage(1);
    }
});



function setFilterLs() {
	localStorage.setItem('vendor_payment_src', JSON.stringify({
		keySearch	: Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-keySearch').getValue(),
		VendorID	: Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-VendorID').getValue(),
		ProjectID	: Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-ProjectID').getValue()
	}));
	Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid-Grid').getStore().loadPage(1);
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
