/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid',
    renderTo: 'ext-content',
    style:'padding:0 7px 7px 7px;margin:2px 0 0 0;',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
            document.getElementById('ContentTopBar').style.display = 'block';

            var penerimaanbarang_src = JSON.parse(localStorage.getItem('penerimaanbarang_src'));

            if(penerimaanbarang_src){
                Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-TanggalBarangMasuk').setValue(penerimaanbarang_src.TanggalBarangMasuk);				
                Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-DocumentNo').setValue(penerimaanbarang_src.DocumentNo);
            }
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Warehouse.PenerimaanBarang.MainGrid');

        //ContextMenu
        thisObj.ContextMenuGrid = Ext.create('Ext.menu.Menu',{
            cls:'Sfr_ConMenu',
	        items:[{
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
                text: lang('View'),
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'view',
                                PenerimaanBarangID: sm.get('PenerimaanBarangID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm', {
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
                itemId: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                PenerimaanBarangID: sm.get('PenerimaanBarangID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                PenerimaanBarangID: sm.get('PenerimaanBarangID'),
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
                itemId: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-ContextMenuDelete',
	            handler: function(){
                    var sm = Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-Grid').getSelectionModel().getSelection()[0];

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
								url: m_api + '/v1/warehouse/penerimaanbarang/delete_penerimaan_barang',
								method: 'DELETE',
								params: {
									PenerimaanBarangID: sm.get('PenerimaanBarangID')
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
								name: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-TanggalBarangMasuk',
								id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-TanggalBarangMasuk',
								xtype: 'datefield',
								baseCls: 'Sfr_TxtfieldSearchGrid',
								fieldLabel:'Tanggal Barang Masuk',
								labelAlign:'top',
								format: 'Y-m-d',
                                value: new Date(),
							}]
						},{
							columnWidth: 0.15,
							layout: 'form',
							style: 'padding-right:10px',
							items: [{
                                xtype: 'textfield',
                                labelAlign:'top',
                                id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-DocumentNo',
                                name: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-DocumentNo',
                                fieldLabel: lang('Document No'),
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
								id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-BtnApplyFilter',
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
            id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-Grid',
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
                    id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-BtnAdd',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid').destroy(); //destory current view
                    	var FormMainFarmer = [];

                        //create object View untuk FormMainGrower
                        if(Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm') == undefined){
                            FormMainFarmer = Ext.create('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm', {
                            	viewVar: {
                                    OpsiDisplay: 'insert',
                                    PanelDisplayID: null
		                        }
                            });
                        }else{
                            //destroy, create ulang
                            Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm').destroy();
                            FormMainFarmer = Ext.create('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm', {
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
                    id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-BtnExport',
                    handler: function() {
						var keySearch	= Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-keySearch').getValue();
						var Month	= Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-Month').getValue();
						var Year		= Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-Year').getValue();
						var CustomerID	= Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-CustomerID').getValue();

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
                        var winAdvFilter = Ext.create('MitraJaya.view.Warehouse.PenerimaanBarang.WinAdvancedFilter');
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
                    id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-Grid').getStore().loadPage(1);
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
                text: lang('Penerimaan Barang ID'),
                dataIndex: 'PenerimaanBarangID',
                hidden: true
            },{
                text: lang('Tanggal Penerimaan'),
                dataIndex: 'TanggalPenerimaan',
                flex:20
            },{
                text: lang('Document No'),
                dataIndex: 'DocNo',
                flex:15
            },{
                text: lang('Part Code'),
                dataIndex: 'SparepartCode',
                flex:10
            },{
                text: lang('Part Number Code'),
                dataIndex: 'SparepartNumberCode',
                flex: 15
            },{
                text: lang('Part Name'),
                dataIndex: 'SparepartName',
                flex: 20
            },{
                text: lang('Part No'),
                dataIndex: 'SparepartNo',
                flex: 10
            },{
                text: lang('Category'),
                dataIndex: 'PartCategory',
                flex: 10
            },{
                text: lang('Qty'),
                dataIndex: 'Qty',
                flex: 10
            },{
                text: lang('Rak No.'),
                dataIndex: 'RackNumber',
                flex: 10 
            },{
                text: lang('Baris No.'),
                dataIndex: 'RowNumber',
                flex: 10 
            },{
                text: lang('Kolom No.'),
                dataIndex: 'ColumnNumber',
                flex: 10 
            }]
        }];

        this.callParent(arguments);
    }, 
    submitOnEnterGrid: function (field, event) {        
		localStorage.setItem('penerimaanbarang_src', JSON.stringify({
			TanggalBarangMasuk	: Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-TanggalBarangMasuk').getValue(),
			DocumentNo	: Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-DocumentNo').getValue()
		}));
		Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-Grid').getStore().loadPage(1);
    }
});

function setFilterLs() {
	localStorage.setItem('penerimaanbarang_src', JSON.stringify({
		TanggalBarangMasuk	: Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-TanggalBarangMasuk').getValue(),
		DocumentNo	: Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-DocumentNo').getValue()
	}));
	Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid-Grid').getStore().loadPage(1);
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
