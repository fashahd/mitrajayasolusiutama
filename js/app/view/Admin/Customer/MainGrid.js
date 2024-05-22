/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.view.Admin.Customer.MainGrid' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Admin.Customer.MainGrid',
    renderTo: 'ext-content',
    style:'padding:0 7px 7px 7px;margin:2px 0 0 0;',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
            document.getElementById('ContentTopBar').style.display = 'block';

            var customer_src = JSON.parse(localStorage.getItem('customer_src'));

            if(customer_src){
                Ext.getCmp('MitraJaya.view.Admin.Customer.MainGrid-keySearch').setValue(customer_src.keySearch);
            }
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Admin.Customer.MainGrid');

        //ContextMenu
        thisObj.ContextMenuGrid = Ext.create('Ext.menu.Menu',{
            cls:'Sfr_ConMenu',
	        items:[{
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
                text: 'View',
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.Admin.Customer.MainGrid-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Admin.Customer.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Admin.Customer.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Admin.Customer.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Admin.Customer.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'view',
                                CustomerID: sm.get('CustomerID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Admin.Customer.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Admin.Customer.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'view',
                                CustomerID: sm.get('CustomerID'),
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
                itemId: 'MitraJaya.view.Admin.Customer.MainGrid-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Admin.Customer.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Admin.Customer.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Admin.Customer.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Admin.Customer.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                CustomerID: sm.get('CustomerID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Admin.Customer.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Admin.Customer.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                CustomerID: sm.get('CustomerID'),
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
                itemId: 'MitraJaya.view.Admin.Customer.MainGrid-ContextMenuDelete',
	            handler: function(){
                    var sm = Ext.getCmp('MitraJaya.view.Admin.Customer.MainGrid-Grid').getSelectionModel().getSelection()[0];

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
								url: m_api + '/v1/admin/customer/delete_customer',
								method: 'DELETE',
								params: {
									CustomerID: sm.get('CustomerID')
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
            xtype: 'grid',
            id: 'MitraJaya.view.Admin.Customer.MainGrid-Grid',
            style: 'border:1px solid #CCC;margin-top:4px;',
            cls:'Sfr_GridNew',
			minHeight:600,
            loadMask: true,
            selType: 'rowmodel',
            store: thisObj.StoreGridMain,
            enableColumnHide: false,
            viewConfig: {
                deferEmptyText: false,
                emptyText: GetDefaultContentNoData(),
                listeners:{
					itemdblclick: function(c,r,i,idx) {
						var uid = r.get('CustomerName');
						var clipboard = document.getElementById("clipboard");
						clipboard.value = uid;
						clipboard.select();
						document.execCommand("copy");
						alert('Copied ' + uid);
					}
				}
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
                    id: 'MitraJaya.view.Admin.Customer.MainGrid-BtnAdd',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Admin.Customer.MainGrid').destroy(); //destory current view
                    	var FormMainFarmer = [];

                        //create object View untuk FormMainGrower
                        if(Ext.getCmp('MitraJaya.view.Admin.Customer.MainForm') == undefined){
                            FormMainFarmer = Ext.create('MitraJaya.view.Admin.Customer.MainForm', {
                            	viewVar: {
                                    OpsiDisplay: 'insert',
                                    PanelDisplayID: null
		                        }
                            });
                        }else{
                            //destroy, create ulang
                            Ext.getCmp('MitraJaya.view.Admin.Customer.MainForm').destroy();
                            FormMainFarmer = Ext.create('MitraJaya.view.Admin.Customer.MainForm', {
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
                    id: 'MitraJaya.view.Admin.Customer.MainGrid-BtnExport',
                    handler: function() {
						var keySearch	= Ext.getCmp('MitraJaya.view.Admin.Customer.MainGrid-keySearch').getValue();
						var StartDate	= Ext.getCmp('MitraJaya.view.Admin.Customer.MainGrid-StartDate').getValue();
						var EndDate		= Ext.getCmp('MitraJaya.view.Admin.Customer.MainGrid-EndDate').getValue();
						var CustomerID	= Ext.getCmp('MitraJaya.view.Admin.Customer.MainGrid-CustomerID').getValue();

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
										CustomerID : CustomerID
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
                    id: 'MitraJaya.view.Admin.Customer.MainGrid-BtnImport',
                    handler: function() {
                        var winImportFarmers = Ext.create('MitraJaya.view.Admin.Customer.WinImportFarmers');
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
					name: 'MitraJaya.view.Admin.Customer.MainGrid-keySearch',
					id: 'MitraJaya.view.Admin.Customer.MainGrid-keySearch',
					xtype: 'textfield',
					baseCls: 'Sfr_TxtfieldSearchGrid',
					width:340,
					emptyText: 'Search by Customer Name, Press Enter to Search',
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
                        var winAdvFilter = Ext.create('MitraJaya.view.Admin.Customer.WinAdvancedFilter');
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
                    id: 'MitraJaya.view.Admin.Customer.MainGrid-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Admin.Customer.MainGrid-Grid').getStore().loadPage(1);
                    }
                },
				'<input type="text" value="" aria-hidden="true" id="clipboard" style="opacity:0;">']
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
                text: 'Customer ID',
                dataIndex: 'CustomerID',
                hidden: true
            },{
                text: 'Customer Name',
                dataIndex: 'CustomerName',
                flex:10
            },{
                text: 'Phone Number',
                dataIndex: 'PhoneNumber',
                flex: 15
            },{
                text: 'Email',
                dataIndex: 'Email',
                flex: 15
            },{
                text: 'Address',
                dataIndex: 'CustomerAddress',
                flex: 10
            }]
        }];

        this.callParent(arguments);
    }, 
    submitOnEnterGrid: function (field, event) {
		localStorage.setItem('customer_src', JSON.stringify({
			keySearch	: Ext.getCmp('MitraJaya.view.Admin.Customer.MainGrid-keySearch').getValue()
		}));
		Ext.getCmp('MitraJaya.view.Admin.Customer.MainGrid-Grid').getStore().loadPage(1);
    }
});

function fetchJSON(text){
    try{
        JSON.parse(text);
        return true;
    }
    catch (error){
        return false;
    }
}
