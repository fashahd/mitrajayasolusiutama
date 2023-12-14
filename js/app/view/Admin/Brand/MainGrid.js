/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.view.Admin.Brand.MainGrid' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Admin.Brand.MainGrid',
    renderTo: 'ext-content',
    style:'padding:0 7px 7px 7px;margin:2px 0 0 0;',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
            document.getElementById('ContentTopBar').style.display = 'block';

            var Brand_src = JSON.parse(localStorage.getItem('Brand_src'));

            if(Brand_src){
                Ext.getCmp('MitraJaya.view.Admin.Brand.MainGrid-keySearch').setValue(Brand_src.keySearch);
            }
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Admin.Brand.MainGrid');

        //ContextMenu
        thisObj.ContextMenuGrid = Ext.create('Ext.menu.Menu',{
            cls:'Sfr_ConMenu',
	        items:[{
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
                text: lang('View'),
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.Admin.Brand.MainGrid-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Admin.Brand.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Admin.Brand.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Admin.Brand.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Admin.Brand.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'view',
                                BrandID: sm.get('BrandID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Admin.Brand.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Admin.Brand.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'view',
                                BrandID: sm.get('BrandID'),
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
                itemId: 'MitraJaya.view.Admin.Brand.MainGrid-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Admin.Brand.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Admin.Brand.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Admin.Brand.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Admin.Brand.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                BrandID: sm.get('BrandID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Admin.Brand.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Admin.Brand.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                BrandID: sm.get('BrandID'),
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
                itemId: 'MitraJaya.view.Admin.Brand.MainGrid-ContextMenuDelete',
	            handler: function(){
                    var sm = Ext.getCmp('MitraJaya.view.Admin.Brand.MainGrid-Grid').getSelectionModel().getSelection()[0];

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
								url: m_api + '/v1/admin/brand/delete_brand',
								method: 'DELETE',
								params: {
									BrandID: sm.get('BrandID')
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
            id: 'MitraJaya.view.Admin.Brand.MainGrid-Grid',
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
						var uid = r.get('BrandName');
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
                    id: 'MitraJaya.view.Admin.Brand.MainGrid-BtnAdd',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Admin.Brand.MainGrid').destroy(); //destory current view
                    	var FormMainFarmer = [];

                        //create object View untuk FormMainGrower
                        if(Ext.getCmp('MitraJaya.view.Admin.Brand.MainForm') == undefined){
                            FormMainFarmer = Ext.create('MitraJaya.view.Admin.Brand.MainForm', {
                            	viewVar: {
                                    OpsiDisplay: 'insert',
                                    PanelDisplayID: null
		                        }
                            });
                        }else{
                            //destroy, create ulang
                            Ext.getCmp('MitraJaya.view.Admin.Brand.MainForm').destroy();
                            FormMainFarmer = Ext.create('MitraJaya.view.Admin.Brand.MainForm', {
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
                    id: 'MitraJaya.view.Admin.Brand.MainGrid-BtnExport',
                    handler: function() {
						var keySearch	= Ext.getCmp('MitraJaya.view.Admin.Brand.MainGrid-keySearch').getValue();
						var StartDate	= Ext.getCmp('MitraJaya.view.Admin.Brand.MainGrid-StartDate').getValue();
						var EndDate		= Ext.getCmp('MitraJaya.view.Admin.Brand.MainGrid-EndDate').getValue();
						var BrandID	= Ext.getCmp('MitraJaya.view.Admin.Brand.MainGrid-BrandID').getValue();

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
										BrandID : BrandID
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
                    id: 'MitraJaya.view.Admin.Brand.MainGrid-BtnImport',
                    handler: function() {
                        var winImportFarmers = Ext.create('MitraJaya.view.Admin.Brand.WinImportFarmers');
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
					name: 'MitraJaya.view.Admin.Brand.MainGrid-keySearch',
					id: 'MitraJaya.view.Admin.Brand.MainGrid-keySearch',
					xtype: 'textfield',
					baseCls: 'Sfr_TxtfieldSearchGrid',
					width:340,
					emptyText: lang('Search by Brand Name, Press Enter to Search'),
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
                        var winAdvFilter = Ext.create('MitraJaya.view.Admin.Brand.WinAdvancedFilter');
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
                    id: 'MitraJaya.view.Admin.Brand.MainGrid-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Admin.Brand.MainGrid-Grid').getStore().loadPage(1);
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
                text: lang('Brand ID'),
                dataIndex: 'BrandID',
                hidden: true
            },{
                text: lang('Brand Name'),
                dataIndex: 'BrandName',
                flex:10
            }]
        }];

        this.callParent(arguments);
    }, 
    submitOnEnterGrid: function (field, event) {
		localStorage.setItem('Brand_src', JSON.stringify({
			keySearch	: Ext.getCmp('MitraJaya.view.Admin.Brand.MainGrid-keySearch').getValue()
		}));
		Ext.getCmp('MitraJaya.view.Admin.Brand.MainGrid-Grid').getStore().loadPage(1);
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
