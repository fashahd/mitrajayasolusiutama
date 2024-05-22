/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.view.Warehouse.Toolkit.MainGrid' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Warehouse.Toolkit.MainGrid',
    renderTo: 'ext-content',
    style:'padding:0 7px 7px 7px;margin:2px 0 0 0;',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
            document.getElementById('ContentTopBar').style.display = 'block';

            var toolkit_src = JSON.parse(localStorage.getItem('toolkit_src'));

            if(toolkit_src){
                Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid-ToolkitCode').setValue(toolkit_src.ToolkitCode);				
                Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid-ToolkitName').setValue(toolkit_src.ToolkitName);
            }
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Warehouse.Toolkit.MainGrid');

        //ContextMenu
        thisObj.ContextMenuGrid = Ext.create('Ext.menu.Menu',{
            cls:'Sfr_ConMenu',
	        items:[{
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
                text: lang('View'),
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.Warehouse.Toolkit.MainGrid-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Warehouse.Toolkit.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'view',
                                ToolkitID: sm.get('ToolkitID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Warehouse.Toolkit.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'view',
                                InvoiceID: sm.get('InvoiceID'),
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
                itemId: 'MitraJaya.view.Warehouse.Toolkit.MainGrid-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Warehouse.Toolkit.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                ToolkitID: sm.get('ToolkitID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Warehouse.Toolkit.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                ToolkitID: sm.get('ToolkitID'),
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
                itemId: 'MitraJaya.view.Warehouse.Toolkit.MainGrid-ContextMenuDelete',
	            handler: function(){
                    var sm = Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid-Grid').getSelectionModel().getSelection()[0];

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
								url: m_api + '/v1/warehouse/toolkit/delete_toolkit',
								method: 'DELETE',
								params: {
									ToolkitID: sm.get('ToolkitID')
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
						items: [{
							columnWidth: 0.18,
							layout: 'form',
							style: 'padding-right:10px',
							items: [{
								name: 'MitraJaya.view.Warehouse.Toolkit.MainGrid-ToolkitCode',
								id: 'MitraJaya.view.Warehouse.Toolkit.MainGrid-ToolkitCode',
								xtype: 'textfield',
								baseCls: 'Sfr_TxtfieldSearchGrid',
								fieldLabel:'Toolkit Code',
								labelAlign:'top',
								emptyText: lang('Search by Toolkit Code')
							}]
						},{
							columnWidth: 0.18,
							layout: 'form',
							style: 'padding-right:10px',
							items: [{
								name: 'MitraJaya.view.Warehouse.Toolkit.MainGrid-ToolkitName',
								id: 'MitraJaya.view.Warehouse.Toolkit.MainGrid-ToolkitName',
								xtype: 'textfield',
								baseCls: 'Sfr_TxtfieldSearchGrid',
								fieldLabel:'Toolkit Name',
								labelAlign:'top',
								emptyText: lang('Search by Toolkit Name')
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
								id: 'MitraJaya.view.Warehouse.Toolkit.MainGrid-BtnApplyFilter',
								handler: function() {
									console.log("test");
									setFilterLs();
								}
							}]
						}]
					}]
				}]
			}]
        }, {
            xtype: 'grid',
            id: 'MitraJaya.view.Warehouse.Toolkit.MainGrid-Grid',
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
                    id: 'MitraJaya.view.Warehouse.Toolkit.MainGrid-BtnAdd',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid').destroy(); //destory current view
                    	var FormMainFarmer = [];

                        //create object View untuk FormMainGrower
                        if(Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainForm') == undefined){
                            FormMainFarmer = Ext.create('MitraJaya.view.Warehouse.Toolkit.MainForm', {
                            	viewVar: {
                                    OpsiDisplay: 'insert',
                                    PanelDisplayID: null
		                        }
                            });
                        }else{
                            //destroy, create ulang
                            Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainForm').destroy();
                            FormMainFarmer = Ext.create('MitraJaya.view.Warehouse.Toolkit.MainForm', {
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
                    id: 'MitraJaya.view.Warehouse.Toolkit.MainGrid-BtnExport',
                    handler: function() {
						var keySearch	= Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid-keySearch').getValue();
						var Month	= Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid-Month').getValue();
						var Year		= Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid-Year').getValue();
						var CustomerID	= Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid-CustomerID').getValue();

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
										Month : Month,
										Year : Year,
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
                    xtype:'tbspacer',
                    flex:1
                },{
                    icon: varjs.config.base_url + 'images/icons/new/add-filter.png',
                    cls: 'Sfr_BtnGridPaleBlue',
                    text: lang('Advanced Filter'),
					hidden:true,
                    handler: function () {
                        //advanced search
                        var winAdvFilter = Ext.create('MitraJaya.view.Warehouse.Toolkit.WinAdvancedFilter');
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
                    id: 'MitraJaya.view.Warehouse.Toolkit.MainGrid-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid-Grid').getStore().loadPage(1);
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
                text: lang('Toolkit ID'),
                dataIndex: 'ToolkitID',
                hidden: true
            },{
                text: lang('Toolkit Code'),
                dataIndex: 'ToolkitCode',
                flex:10
            },{
                text: lang('Toolkit Name'),
                dataIndex: 'ToolkitName',
                flex: 15
            },{
                text: lang('Toolkit Qty'),
                dataIndex: 'ToolkitQty',
                flex: 25
            }]
        }];

        this.callParent(arguments);
    }, 
    submitOnEnterGrid: function (field, event) {        
		localStorage.setItem('toolkit_src', JSON.stringify({
			ToolkitCode	: Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid-ToolkitCode').getValue(),
			ToolkitName	: Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid-ToolkitName').getValue()
		}));
		Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid-Grid').getStore().loadPage(1);
    }
});

function setFilterLs() {
	localStorage.setItem('toolkit_src', JSON.stringify({
		ToolkitCode	: Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid-ToolkitCode').getValue(),
		ToolkitName	: Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid-ToolkitName').getValue()
	}));
	Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid-Grid').getStore().loadPage(1);
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
