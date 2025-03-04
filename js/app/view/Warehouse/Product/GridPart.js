/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : GridVendorPayment.js
 *******************************************/
 Ext.define('MitraJaya.view.Warehouse.Product.GridPart' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Warehouse.Product.GridPart',
    style:'padding:0 7px 7px 7px;margin:2px 0 0 0;',
    title:'Part Actual Location',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Warehouse.Product.GridPart',{
        	storeVar: {
                ProductID: thisObj.viewVar.ProductID
            }
        });
		

		thisObj.combo_company = Ext.create('MitraJaya.store.General.CompanyList',{
        	storeVar: {
                CustomerID: ''
            }
        });

        //ContextMenu
        thisObj.ContextMenu = Ext.create('Ext.menu.Menu',{
            cls:'Sfr_ConMenu',
	        items:[{
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
                text: lang('View'),
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.Warehouse.Product.GridPart-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Warehouse.Product.GridPart-Grid').getSelectionModel().getSelection()[0];
                    var WinFormPart = Ext.create('MitraJaya.view.Warehouse.Product.WinFormPart');
                    WinFormPart.setViewVar({
                        OpsiDisplay:'view',
                        CallerStore: thisObj.StoreGridMain,
                        PartCategoryID:sm.get('PartCategoryID')
                    });
                    if (!WinFormPart.isVisible()) {
                        WinFormPart.center();
                        WinFormPart.show();
                    } else {
                        WinFormPart.close();
                    }
	            }
	        },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
                text: lang('Update'),
                cls:'Sfr_BtnConMenuWhite',
                hidden: m_act_update,
                itemId: 'MitraJaya.view.Warehouse.Product.GridPart-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Warehouse.Product.GridPart-Grid').getSelectionModel().getSelection()[0];
                    var WinFormPart = Ext.create('MitraJaya.view.Warehouse.Product.WinFormPart');
                    WinFormPart.setViewVar({
                        OpsiDisplay:'update',
                        CallerStore: thisObj.StoreGridMain,
                        PartCategoryID:sm.get('PartCategoryID'),
                        ProductID: thisObj.viewVar.ProductID
                    });
                    if (!WinFormPart.isVisible()) {
                        WinFormPart.center();
                        WinFormPart.show();
                    } else {
                        WinFormPart.close();
                    }
	            }
	        },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eraser.svg',
                text: lang('Delete'),
                cls:'Sfr_BtnConMenuWhite',
	            hidden: m_act_delete,
                itemId: 'MitraJaya.view.Warehouse.Product.GridPart-ContextMenuDelete',
	            handler: function(){
                    var sm = Ext.getCmp('MitraJaya.view.Warehouse.Product.GridPart-Grid').getSelectionModel().getSelection()[0];

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
								url: m_api + '/v1/warehouse/product/delete_part',
								method: 'DELETE',
								params: {
									PartCategoryID: sm.get('PartCategoryID')
								},
								success: function(response, opts) {
									Swal.fire(
										'Deleted!',
										'Your file has been deleted.',
										'success'
									)

									//refresh store
									thisObj.StoreGridMain.load();

                                    Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData').getForm().load({
                                        url: m_api + '/v1/warehouse/product/form_product',
                                        method: 'GET',
                                        params: {
                                            ProductID: thisObj.viewVar.ProductID
                                        },
                                        success: function (form, action) {
                                            Ext.MessageBox.hide();
                                            var r = Ext.decode(action.response.responseText);
                                            //Title
                                            Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-labelInfoInsert').doLayout();
                                        },
                                        failure: function (form, action) {
                                            Swal.fire({
                                                icon: 'error',
                                                text: 'Failed to Retreive Data',
                                            })
                                        }
                                    });
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
            id: 'MitraJaya.view.Warehouse.Product.GridPart-Grid',
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
                    id: 'MitraJaya.view.Warehouse.Product.GridPart-BtnAdd',
                    handler: function() {
                        var Code = Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-ProductCode').getValue();
                    	var WinFormPart = Ext.create('MitraJaya.view.Warehouse.Product.WinFormPart');
                        WinFormPart.setViewVar({
                            OpsiDisplay:'insert',
                            Code:Code,
                            CallerStore: thisObj.StoreGridMain,
                            ProductID:thisObj.viewVar.ProductID
                        });
                        if (!WinFormPart.isVisible()) {
                            WinFormPart.center();
                            WinFormPart.show();
                        } else {
                            WinFormPart.close();
                        }
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
                        thisObj.ContextMenu.showAt(e.getXY());
                    }
                }]
            },{
                text: 'No',
                flex: 1,
                xtype: 'rownumberer'
            },{
                text: lang('Part Category ID'),
                dataIndex: 'PartCategoryID',
                hidden: true
            },{
                text: lang('Product ID'),
                dataIndex: 'ProductID',
                hidden:true,
                flex: 10
            },{
                text: lang('Code'),
                dataIndex: 'PartCategoryCode',
                flex: 10
            },{
                text: lang('Actual Location'),
                dataIndex: 'ActualLocation',
                flex: 10
            }]
        }];

        this.callParent(arguments);
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
