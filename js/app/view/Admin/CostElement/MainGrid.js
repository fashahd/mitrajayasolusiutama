/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.view.Admin.CostElement.MainGrid' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Admin.CostElement.MainGrid',
    renderTo: 'ext-content',
    style:'padding:0 7px 7px 7px;margin:2px 0 0 0;',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
            document.getElementById('ContentTopBar').style.display = 'block';

            var customer_src = JSON.parse(localStorage.getItem('customer_src'));

            if(customer_src){
                Ext.getCmp('MitraJaya.view.Admin.CostElement.MainGrid-keySearch').setValue(customer_src.keySearch);
            }
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Admin.CostElement.MainGrid');

        //ContextMenu
        thisObj.ContextMenuGrid = Ext.create('Ext.menu.Menu',{
            cls:'Sfr_ConMenu',
	        items:[{
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
                text: lang('View'),
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.Admin.CostElement.MainGrid-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Admin.CostElement.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Admin.CostElement.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Admin.CostElement.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Admin.CostElement.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'view',
                                ComponentID: sm.get('ComponentID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Admin.CostElement.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Admin.CostElement.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'view',
                                ComponentID: sm.get('ComponentID'),
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
                itemId: 'MitraJaya.view.Admin.CostElement.MainGrid-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Admin.CostElement.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Admin.CostElement.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Admin.CostElement.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Admin.CostElement.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                ComponentID: sm.get('ComponentID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Admin.CostElement.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Admin.CostElement.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                ComponentID: sm.get('ComponentID'),
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
                itemId: 'MitraJaya.view.Admin.CostElement.MainGrid-ContextMenuDelete',
	            handler: function(){
                    var sm = Ext.getCmp('MitraJaya.view.Admin.CostElement.MainGrid-Grid').getSelectionModel().getSelection()[0];

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
								url: m_api + '/v1/admin/component/delete_component',
								method: 'DELETE',
								params: {
									ComponentID: sm.get('ComponentID')
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
            id: 'MitraJaya.view.Admin.CostElement.MainGrid-Grid',
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
                    id: 'MitraJaya.view.Admin.CostElement.MainGrid-BtnAdd',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Admin.CostElement.MainGrid').destroy(); //destory current view
                    	var FormMainFarmer = [];

                        //create object View untuk FormMainGrower
                        if(Ext.getCmp('MitraJaya.view.Admin.CostElement.MainForm') == undefined){
                            FormMainFarmer = Ext.create('MitraJaya.view.Admin.CostElement.MainForm', {
                            	viewVar: {
                                    OpsiDisplay: 'insert',
                                    PanelDisplayID: null
		                        }
                            });
                        }else{
                            //destroy, create ulang
                            Ext.getCmp('MitraJaya.view.Admin.CostElement.MainForm').destroy();
                            FormMainFarmer = Ext.create('MitraJaya.view.Admin.CostElement.MainForm', {
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
                    text: lang('Export'),
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_export_excel,
                    id: 'MitraJaya.view.Admin.CostElement.MainGrid-BtnExport',
                    handler: function() {
						var keySearch	= Ext.getCmp('MitraJaya.view.Admin.CostElement.MainGrid-keySearch').getValue();
						var StartDate	= Ext.getCmp('MitraJaya.view.Admin.CostElement.MainGrid-StartDate').getValue();
						var EndDate		= Ext.getCmp('MitraJaya.view.Admin.CostElement.MainGrid-EndDate').getValue();
						var ComponentID	= Ext.getCmp('MitraJaya.view.Admin.CostElement.MainGrid-ComponentID').getValue();

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
									waitMsg: lang('Please Wait'),
									params: {
										keySearch : keySearch,
										StartDate : StartDate,
										EndDate : EndDate,
										ComponentID : ComponentID
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
                    text: lang('Import'),
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_export_excel,
                    id: 'MitraJaya.view.Admin.CostElement.MainGrid-BtnImport',
                    handler: function() {
                        var winImportFarmers = Ext.create('MitraJaya.view.Admin.Vendor.WinImportFarmers');
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
					name: 'MitraJaya.view.Admin.CostElement.MainGrid-keySearch',
					id: 'MitraJaya.view.Admin.CostElement.MainGrid-keySearch',
					xtype: 'textfield',
					baseCls: 'Sfr_TxtfieldSearchGrid',
					width:340,
					emptyText: lang('Search by Code, Press Enter to Search'),
					listeners: {
						specialkey: thisObj.submitOnEnterGrid
					}
				},{
                    icon: varjs.config.base_url + 'images/icons/new/add-filter.png',
                    cls: 'Sfr_BtnGridPaleBlue',
                    text: lang('Advanced Filter'),
					hidden:true,
                    handler: function () {
                        //advanced search
                        var winAdvFilter = Ext.create('MitraJaya.view.Admin.Vendor.WinAdvancedFilter');
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
                    id: 'MitraJaya.view.Admin.CostElement.MainGrid-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Admin.CostElement.MainGrid-Grid').getStore().loadPage(1);
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
                text: lang('ComponentID'),
                dataIndex: 'ComponentID',
                hidden: true
            },{
                text: lang('Component ID'),
                dataIndex: 'Code',
                flex:10
            },{
                text: lang('Description'),
                dataIndex: 'Description',
                flex:20
            }]
        }];

        this.callParent(arguments);
    }, 
    submitOnEnterGrid: function (field, event) {   
		localStorage.setItem('customer_src', JSON.stringify({
			keySearch	: Ext.getCmp('MitraJaya.view.Admin.CostElement.MainGrid-keySearch').getValue()
		}));
		Ext.getCmp('MitraJaya.view.Admin.CostElement.MainGrid-Grid').getStore().loadPage(1);
    }
});

function setFilterLs() {
	localStorage.setItem('customer_src', JSON.stringify({
		keySearch	: Ext.getCmp('MitraJaya.view.Admin.CostElement.MainGrid-keySearch').getValue()
	}));
	Ext.getCmp('MitraJaya.view.Admin.CostElement.MainGrid-Grid').getStore().loadPage(1);
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
