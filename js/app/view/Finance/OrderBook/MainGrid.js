/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.view.Finance.OrderBook.MainGrid' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Finance.OrderBook.MainGrid',
    renderTo: 'ext-content',
    style:'padding:0 7px 7px 7px;margin:2px 0 0 0;',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
            document.getElementById('ContentTopBar').style.display = 'block';

			var order_book_src = JSON.parse(localStorage.getItem('order_book_src'));

            if(order_book_src){
                Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-keySearch').setValue(order_book_src.keySearch);				
                Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-StartDate').setValue(order_book_src.StartDate);
                Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-EndDate').setValue(order_book_src.EndDate);
				Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-CustomerID').setValue(order_book_src.CustomerID);
            }
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Finance.OrderBook.MainGrid');
		

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
                itemId: 'MitraJaya.view.Finance.OrderBook.MainGrid-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Finance.OrderBook.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'view',
                                OrderBookID: sm.get('OrderBookID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Finance.OrderBook.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'view',
                                OrderBookID: sm.get('OrderBookID'),
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
                itemId: 'MitraJaya.view.Finance.OrderBook.MainGrid-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Finance.OrderBook.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                OrderBookID: sm.get('OrderBookID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Finance.OrderBook.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                OrderBookID: sm.get('OrderBookID'),
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
                itemId: 'MitraJaya.view.Finance.OrderBook.MainGrid-ContextMenuDelete',
	            handler: function(){
                    var sm = Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-Grid').getSelectionModel().getSelection()[0];

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
								url: m_api + '/v1/finance/order/delete_order',
								method: 'DELETE',
								params: {
									OrderBookID		: sm.get('OrderBookID'),
									ContractNumber	: sm.get('ContractNumber')
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
								name: 'MitraJaya.view.Finance.OrderBook.MainGrid-keySearch',
								id: 'MitraJaya.view.Finance.OrderBook.MainGrid-keySearch',
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
								id:"MitraJaya.view.Finance.OrderBook.MainGrid-StartDate",
								editable:false,
								//altFormats: 'Ymd',
								fieldLabel:'Start PO Date',
								labelAlign:'top',
								vtype: 'daterange',
								endDateField: 'MitraJaya.view.Finance.OrderBook.MainGrid-EndDate',
								listeners:{
									'change': function(th,a){
										Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-EndDate').setMinValue(a);
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
								id:"MitraJaya.view.Finance.OrderBook.MainGrid-EndDate",
								//altFormats: 'Ymd',
								editable:false,
								fieldLabel:'End PO Date',
								labelAlign:'top',
								vtype: 'daterange',
								endDateField: 'MitraJaya.view.Finance.OrderBook.MainGrid-StartDate',
								listeners:{
									'change': function(th,a){
										Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-StartDate').setMaxValue(a);
									}
								}
							}]
						},{
							columnWidth: 0.2,
							layout: 'form',
							items: [{
								xtype: 'combobox',
								id:'MitraJaya.view.Finance.OrderBook.MainGrid-CustomerID',
								name:'MitraJaya.view.Finance.OrderBook.MainGrid-CustomerID',
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
								id: 'MitraJaya.view.Finance.OrderBook.MainGrid-BtnApplyFilter',
								handler: function() {
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
            id: 'MitraJaya.view.Finance.OrderBook.MainGrid-Grid',
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
                    id: 'MitraJaya.view.Finance.OrderBook.MainGrid-BtnAdd',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid').destroy(); //destory current view
                    	var FormMainFarmer = [];

                        //create object View untuk FormMainGrower
                        if(Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm') == undefined){
                            FormMainFarmer = Ext.create('MitraJaya.view.Finance.OrderBook.MainForm', {
                            	viewVar: {
                                    OpsiDisplay: 'insert',
                                    PanelDisplayID: null
		                        }
                            });
                        }else{
                            //destroy, create ulang
                            Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainForm').destroy();
                            FormMainFarmer = Ext.create('MitraJaya.view.Finance.OrderBook.MainForm', {
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
                    id: 'MitraJaya.view.Finance.OrderBook.MainGrid-BtnExport',
                    handler: function() {
						var keySearch	= Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-keySearch').getValue();
						var StartDate	= Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-StartDate').getValue();
						var EndDate		= Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-EndDate').getValue();
						var CustomerID	= Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-CustomerID').getValue();

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
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/file-import.svg',
                    text: lang('Import'),
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_add,
                    id: 'MitraJaya.view.Finance.OrderBook.MainGrid-BtnImport',
                    handler: function() {
						var WinFormImportOrderBook = Ext.create('MitraJaya.view.Finance.OrderBook.WinFormImportOrderBook');
                        if (!WinFormImportOrderBook.isVisible()) {
                            WinFormImportOrderBook.center();
                            WinFormImportOrderBook.show();
                        } else {
                            WinFormImportOrderBook.close();
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
                        var winAdvFilter = Ext.create('MitraJaya.view.Finance.OrderBook.WinAdvancedFilter');
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
                    id: 'MitraJaya.view.Finance.OrderBook.MainGrid-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-Grid').getStore().loadPage(1);
                    }
                }]
            }],
            columns:[{
            	text: '',
                xtype:'actioncolumn',
                flex: 0.2,
                items:[{
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/caret-down.svg',
                    handler: function(grid, rowIndex, colIndex, item, e, record) {
                        thisObj.ContextMenuGrid.showAt(e.getXY());
                    }
                }]
            },{
                text: 'No',
                flex: 0.2,
                xtype: 'rownumberer'
            },{
                text: lang('OrderBookID'),
                dataIndex: 'OrderBookID',
                hidden: true
            },{
                text: lang('PO Number'),
                dataIndex: 'ContractNumber',
                flex: 1.5
            },{
                text: lang('PO Date'),
                dataIndex: 'ContractDate',
                flex: 1
            },{
                text: lang('Description'),
                dataIndex: 'Description',
                flex: 2
            },{
                text: lang('Project'),
                dataIndex: 'ProjectName',
                flex: 2
            },{
                text: lang('Customer'),
                dataIndex: 'CustomerName',
                flex: 2
            },{
                text: lang('Dept'),
                dataIndex: 'DeptName',
                flex: 2
            },{
                text: lang('Total Amount'),
                dataIndex: 'TotalContactAmount',
                flex: 2
            },{
                text: lang('Total Paid'),
                dataIndex: 'TotalPaid',
                flex: 2
            },{
                text: lang('Potential Paid'),
                dataIndex: 'TotalUnpaid',
                flex: 2
            }]
        }];

        this.callParent(arguments);
    },
    submitOnEnterGrid: function (field, event) {        
		localStorage.setItem('order_book_src', JSON.stringify({
			keySearch	: Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-keySearch').getValue(),
			StartDate	: Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-StartDate').getValue(),
			EndDate		: Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-EndDate').getValue(),
			CustomerID	: Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-CustomerID').getValue()
		}));
		Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-Grid').getStore().loadPage(1);
    }
});



function setFilterLs() {
	localStorage.setItem('order_book_src', JSON.stringify({
		keySearch	: Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-keySearch').getValue(),
		StartDate	: Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-StartDate').getValue(),
		EndDate		: Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-EndDate').getValue(),
		CustomerID	: Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-CustomerID').getValue()
	}));
	Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-Grid').getStore().loadPage(1);
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
