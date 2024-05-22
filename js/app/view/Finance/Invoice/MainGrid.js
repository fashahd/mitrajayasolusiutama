/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.view.Finance.Invoice.MainGrid' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Finance.Invoice.MainGrid',
    renderTo: 'ext-content',
    style:'padding:0 7px 7px 7px;margin:2px 0 0 0;',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
            document.getElementById('ContentTopBar').style.display = 'block';

            var invoice_src = JSON.parse(localStorage.getItem('invoice_src'));

            if(invoice_src){
                Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-keySearch').setValue(invoice_src.keySearch);				
                Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-Month').setValue(invoice_src.Month);
                Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-Year').setValue(invoice_src.Year);
				Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-CustomerID').setValue(invoice_src.CustomerID);
            }
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Finance.Invoice.MainGrid');

        thisObj.combo_company = Ext.create('MitraJaya.store.General.CompanyList',{
        	storeVar: {
                CustomerID: ''
            }
        });

        thisObj.combo_month = Ext.create('MitraJaya.store.General.StoreMonth');
		
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
                itemId: 'MitraJaya.view.Finance.Invoice.MainGrid-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Finance.Invoice.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'view',
                                InvoiceID: sm.get('InvoiceID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Finance.Invoice.MainForm', {
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
                itemId: 'MitraJaya.view.Finance.Invoice.MainGrid-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Finance.Invoice.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                InvoiceID: sm.get('InvoiceID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Finance.Invoice.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                InvoiceID: sm.get('InvoiceID'),
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
                itemId: 'MitraJaya.view.Finance.Invoice.MainGrid-ContextMenuDelete',
	            handler: function(){
                    var sm = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-Grid').getSelectionModel().getSelection()[0];

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
								url: m_api + '/v1/finance/invoice/delete_invoice',
								method: 'DELETE',
								params: {
									InvoiceID: sm.get('InvoiceID'),
									InvoiceNumber : sm.get("InvoiceNumber")
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
	        },{
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
                text: lang('Print Invoice'),
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.Finance.Invoice.MainGrid-ContextMenuPrint',
	            handler: function() {
					Ext.MessageBox.show({
						title: "",
						msg: "Include PPH 23 ?",
						icon: Ext.MessageBox.INFO,
						buttons: Ext.MessageBox.YESNO,
						fn: function(buttonId) {
							if (buttonId === "yes") {						
								var sm = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-Grid').getSelectionModel().getSelection()[0];
								
								var url = m_api + '/v1/report/printout/print_invoice';
								preview_cetak_surat(url + '?pph=yes&InvoiceID='+sm.get("InvoiceID"));
							}else{
								var sm = Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-Grid').getSelectionModel().getSelection()[0];
					
								var url = m_api + '/v1/report/printout/print_invoice';
								preview_cetak_surat(url + '?pph=no&InvoiceID='+sm.get("InvoiceID"));
							}
						}
					});
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
								name: 'MitraJaya.view.Finance.Invoice.MainGrid-keySearch',
								id: 'MitraJaya.view.Finance.Invoice.MainGrid-keySearch',
								xtype: 'textfield',
								baseCls: 'Sfr_TxtfieldSearchGrid',
								fieldLabel:'Invoice / Contract Number',
								labelAlign:'top',
								emptyText: lang('Search by Invoice / Contract Number')
							}]
						},{
							columnWidth: 0.15,
							layout: 'form',
							style: 'padding-right:10px',
							items: [{
								xtype: 'combobox',
								id:'MitraJaya.view.Finance.Invoice.MainGrid-Month',
								name:'MitraJaya.view.Finance.Invoice.MainGrid-Month',
								labelAlign:'top',
								fieldLabel:'Invoice Period Month',
								store:thisObj.combo_month,
								queryMode:'local',
								displayField:'label',
								valueField:'id',
							}]
						},{
							columnWidth: 0.15,
							layout: 'form',
							style: 'padding-right:10px',
							items: [{
								xtype: 'combobox',
								id:'MitraJaya.view.Finance.Invoice.MainGrid-Year',
								name:'MitraJaya.view.Finance.Invoice.MainGrid-Year',
								labelAlign:'top',
								fieldLabel:'Invoice Period Year',
								store:thisObj.combo_year,
								queryMode:'local',
								displayField:'label',
								valueField:'id',
							}]
						},{
							columnWidth: 0.2,
							layout: 'form',
							items: [{
								xtype: 'combobox',
								id:'MitraJaya.view.Finance.Invoice.MainGrid-CustomerID',
								name:'MitraJaya.view.Finance.Invoice.MainGrid-CustomerID',
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
								id: 'MitraJaya.view.Finance.Invoice.MainGrid-BtnApplyFilter',
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
            id: 'MitraJaya.view.Finance.Invoice.MainGrid-Grid',
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
                    id: 'MitraJaya.view.Finance.Invoice.MainGrid-BtnAdd',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid').destroy(); //destory current view
                    	var FormMainFarmer = [];

                        //create object View untuk FormMainGrower
                        if(Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm') == undefined){
                            FormMainFarmer = Ext.create('MitraJaya.view.Finance.Invoice.MainForm', {
                            	viewVar: {
                                    OpsiDisplay: 'insert',
                                    PanelDisplayID: null
		                        }
                            });
                        }else{
                            //destroy, create ulang
                            Ext.getCmp('MitraJaya.view.Finance.Invoice.MainForm').destroy();
                            FormMainFarmer = Ext.create('MitraJaya.view.Finance.Invoice.MainForm', {
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
                    id: 'MitraJaya.view.Finance.Invoice.MainGrid-BtnExport',
                    handler: function() {
						var keySearch	= Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-keySearch').getValue();
						var Month	= Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-Month').getValue();
						var Year		= Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-Year').getValue();
						var CustomerID	= Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-CustomerID').getValue();

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
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/file-import.svg',
                    text: lang('Import'),
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_add,
                    id: 'MitraJaya.view.Finance.Invoice.MainGrid-BtnImport',
                    handler: function() {
						var WinFormImportInvoice = Ext.create('MitraJaya.view.Finance.Invoice.WinFormImportInvoice');
                        if (!WinFormImportInvoice.isVisible()) {
                            WinFormImportInvoice.center();
                            WinFormImportInvoice.show();
                        } else {
                            WinFormImportInvoice.close();
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
                        var winAdvFilter = Ext.create('MitraJaya.view.Finance.Invoice.WinAdvancedFilter');
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
                    id: 'MitraJaya.view.Finance.Invoice.MainGrid-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-Grid').getStore().loadPage(1);
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
                text: lang('Invoice ID'),
                dataIndex: 'InvoiceID',
                hidden: true
            },{
                text: lang('Invoice Number'),
                dataIndex: 'InvoiceNumber',
                flex:10
            },{
                text: lang('Contract Number'),
                dataIndex: 'ContractNumber',
                flex: 15
            },{
                text: lang('Customer Name'),
                dataIndex: 'CustomerName',
                flex: 15
            },{
                text: lang('Invoice Period Month'),
                dataIndex: 'InvoicePeriodMonth',
                flex: 10
            },{
                text: lang('Invoice Period Year'),
                dataIndex: 'InvoicePeriodYear',
                flex: 10
            },{
                text: lang('Gross Income'),
                dataIndex: 'GrossIncome',
                flex: 15
            },{
                text: lang('Nett Income'),
                dataIndex: 'NettIncome',
                flex: 15 
            }]
        }];

        this.callParent(arguments);
    }, 
    submitOnEnterGrid: function (field, event) {        
		localStorage.setItem('invoice_src', JSON.stringify({
			keySearch	: Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-keySearch').getValue(),
			Month	: Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-Month').getValue(),
			Year		: Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-Year').getValue(),
			CustomerID	: Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-CustomerID').getValue()
		}));
		Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-Grid').getStore().loadPage(1);
    }
});

function setFilterLs() {
	localStorage.setItem('invoice_src', JSON.stringify({
		keySearch	: Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-keySearch').getValue(),
		Month	: Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-Month').getValue(),
		Year		: Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-Year').getValue(),
		CustomerID	: Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-CustomerID').getValue()
	}));
	Ext.getCmp('MitraJaya.view.Finance.Invoice.MainGrid-Grid').getStore().loadPage(1);
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
