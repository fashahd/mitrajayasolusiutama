/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.view.Warehouse.Sparepart.MainGrid' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Warehouse.Sparepart.MainGrid',
    title:'Sparepart',
    style:'margin-top:30px',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
            document.getElementById('ContentTopBar').style.display = 'block';

            var sparepart_src = JSON.parse(localStorage.getItem('sparepart_src'));

            if(sparepart_src){
                // Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainGrid-keySearch').setValue(sparepart_src.keySearch);	    			
                // Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainGrid-keySearch2').setValue(sparepart_src.keySearch2);
            }
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Warehouse.Sparepart.MainGrid',{
        	storeVar: {
                ProductID: thisObj.viewVar.ProductID
            }
        });

        thisObj.combo_company = Ext.create('MitraJaya.store.General.CompanyList',{
        	storeVar: {
                CustomerID: ''
            }
        });

        thisObj.combo_brand = Ext.create('MitraJaya.store.General.BrandList');
		
        thisObj.combo_year = Ext.create('MitraJaya.store.General.StoreYear',{
            storeVar: {
                yearRange: 20
            }
        });

        //ContextMenu
        thisObj.ContextMenuGrid = Ext.create('Ext.menu.Menu',{
            cls:'Sfr_ConMenu',
	        items:[{
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
                text: lang('View'),
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.Warehouse.Sparepart.MainGrid-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainGrid-Grid').getSelectionModel().getSelection()[0];

                    var Code = Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-ProductCode').getValue();
                    var WinFormSparePart = Ext.create('MitraJaya.view.Warehouse.Product.WinFormSparePart');
                    WinFormSparePart.setViewVar({
                        OpsiDisplay:'view',
                        Code:Code,
                        SparepartID: sm.get('SparepartID'),
                        CallerStore: thisObj.StoreGridMain,
                        ProductID:thisObj.viewVar.ProductID
                    });
                    if (!WinFormSparePart.isVisible()) {
                        WinFormSparePart.center();
                        WinFormSparePart.show();
                    } else {
                        WinFormSparePart.close();
                    }
	            }
	        },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
                text: lang('Update'),
                cls:'Sfr_BtnConMenuWhite',
                hidden: m_act_update,
                itemId: 'MitraJaya.view.Warehouse.Sparepart.MainGrid-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainGrid-Grid').getSelectionModel().getSelection()[0];

                    var Code = Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-ProductCode').getValue();
                    var WinFormSparePart = Ext.create('MitraJaya.view.Warehouse.Product.WinFormSparePart');
                    WinFormSparePart.setViewVar({
                        OpsiDisplay:'update',
                        Code:Code,
                        SparepartID: sm.get('SparepartID'),
                        CallerStore: thisObj.StoreGridMain,
                        ProductID:thisObj.viewVar.ProductID
                    });
                    if (!WinFormSparePart.isVisible()) {
                        WinFormSparePart.center();
                        WinFormSparePart.show();
                    } else {
                        WinFormSparePart.close();
                    }
	            }
	        },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eraser.svg',
                text: lang('Delete'),
                cls:'Sfr_BtnConMenuWhite',
	            hidden: m_act_delete,
                itemId: 'MitraJaya.view.Warehouse.Sparepart.MainGrid-ContextMenuDelete',
	            handler: function(){
                    var sm = Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainGrid-Grid').getSelectionModel().getSelection()[0];

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
								url: m_api + '/v1/warehouse/sparepart/delete_sparepart',
								method: 'DELETE',
								params: {
									SparepartID: sm.get('SparepartID'),
									SparepartCode: sm.get('SparepartCode')
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
            id: 'MitraJaya.view.Warehouse.Sparepart.MainGrid-Grid',
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
                    id: 'MitraJaya.view.Warehouse.Sparepart.MainGrid-BtnAdd',
                    handler: function() {
                        var Code = Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-ProductCode').getValue();
                    	var WinFormSparePart = Ext.create('MitraJaya.view.Warehouse.Product.WinFormSparePart');
                        WinFormSparePart.setViewVar({
                            OpsiDisplay:'insert',
                            Code:Code,
                            CallerStore: thisObj.StoreGridMain,
                            ProductID:thisObj.viewVar.ProductID
                        });
                        if (!WinFormSparePart.isVisible()) {
                            WinFormSparePart.center();
                            WinFormSparePart.show();
                        } else {
                            WinFormSparePart.close();
                        }
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/download.svg',
                    text: lang('Export'),
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_export_excel,
                    id: 'MitraJaya.view.Warehouse.Sparepart.MainGrid-BtnExport',
                    handler: function() {
						var keySearch	= Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainGrid-keySearch').getValue();
						var keySearch2	= Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainGrid-keySearch2').getValue();

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
									url: m_api + '/v1/Warehouse/sparepart/export_sparepart',
									method: 'POST',
									waitMsg: lang('Please Wait'),
									params: {
										keySearch : keySearch,
										keySearch2 : keySearch2
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
                        var winAdvFilter = Ext.create('MitraJaya.view.Warehouse.Sparepart.WinAdvancedFilter');
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
                    id: 'MitraJaya.view.Warehouse.Sparepart.MainGrid-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainGrid-Grid').getStore().loadPage(1);
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
                text: lang('Sparepart ID'),
                dataIndex: 'SparepartID',
                hidden: true
            },{
                text: lang('Sparepart Code'),
                dataIndex: 'SparepartCode',
                flex:5
            },{
                text: lang('Sparepart Name'),
                dataIndex: 'SparepartName',
                flex: 10
            },{
                text: lang('Sparepart No'),
                dataIndex: 'SparepartNo',
                flex: 5
            },{
                text: lang('Sparepart Type'),
                dataIndex: 'SparepartType',
                flex: 8
            },{
                text: lang('Category'),
                dataIndex: 'SparepartCategory',
                flex: 5
            },{
                text: lang('Qty'),
                dataIndex: 'SparepartQty',
                flex: 3
            },{
                text: lang('Basic Price'),
                dataIndex: 'SparepartBasicPrice',
                flex: 5,
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.SparepartBasicPrice, 2);
					
                    return RetVal;
                }
            },{
                text: lang('Selling Price'),
                dataIndex: 'SparepartSellingPrice',
                flex: 5,
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.SparepartSellingPrice, 2);
					
                    return RetVal;
                }
            },{
                text: lang('Status'),
                dataIndex: 'SparepartStatus',
                flex: 5
            }]
        }];

        this.callParent(arguments);
    }, 
    submitOnEnterGrid: function (field, event) {        
		localStorage.setItem('sparepart_src', JSON.stringify({
			// keySearch		: Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainGrid-keySearch').getValue(),
			// keySearch2	    : Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainGrid-keySearch2').getValue()
		}));
		Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainGrid-Grid').getStore().loadPage(1);
    }
});

function setFilterLs() {
	localStorage.setItem('sparepart_src', JSON.stringify({
		// keySearch		: Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainGrid-keySearch').getValue(),
		// keySearch2	: Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainGrid-keySearch2').getValue()
	}));
	Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainGrid-Grid').getStore().loadPage(1);
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
