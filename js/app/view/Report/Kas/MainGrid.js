/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.view.Report.Kas.MainGrid' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Report.Kas.MainGrid',
    renderTo: 'ext-content',
    style:'padding: 0px ; margin: 0px;',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;

			var bank_transaction_storage = JSON.parse(localStorage.getItem('bank_transaction_storage'));

            if(bank_transaction_storage){
                Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-Month').setValue(bank_transaction_storage.Month);				
                Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-Year').setValue(bank_transaction_storage.Year);
            }
            // document.getElementById('ContentTopBar').style.display = 'block';
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Report.Kas.MainGrid');
		thisObj.combo_project_bank = Ext.create('MitraJaya.store.General.ProjectBankList');
		

		thisObj.combo_month = Ext.create('MitraJaya.store.General.StoreMonth');
		

		thisObj.combo_year = Ext.create('MitraJaya.store.General.StoreYear',{
        	storeVar: {
                yearRange: 20
            }
        });
		

		thisObj.combo_company = Ext.create('MitraJaya.store.General.CompanyList',{
        	storeVar: {
                CustomerID: ''
            }
        });

		thisObj.cost_element = Ext.create('MitraJaya.store.General.CostComponent');

        //ContextMenu
        thisObj.ContextMenuGrid = Ext.create('Ext.menu.Menu',{
            cls:'Sfr_ConMenu',
	        items:[{
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
                text: 'View',
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.Report.Kas.MainGrid-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid').destroy(); //destory current view
                    
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
                text: 'Update',
                cls:'Sfr_BtnConMenuWhite',
                hidden: m_act_update,
                itemId: 'MitraJaya.view.Report.Kas.MainGrid-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid').destroy(); //destory current view
                    
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
					xtype: 'panel',
					title: 'Kas Form',
					frame: true,
                    hidden: m_act_add,
					cls: 'Sfr_PanelLayoutForm',
					id: 'MitraJaya.view.Report.Kas.MainGrid-FormGeneralData',
					collapsible: true,
					items: [{
						layout: 'column',
						border: false,
						padding: 10,
						items: [{
							columnWidth: 1,
							layout: 'form',
							cls: 'Sfr_PanelLayoutFormContainer',
							items: [{
								xtype: 'form',
								id: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData',
								fileUpload: true,
								buttonAlign: 'center',
								items: [{
									layout: 'column',
									border: false,
									items: [{
										columnWidth: 0.35,
										layout: 'form',
										style: 'padding:10px 20px 10px 5px; margin-right: 20px; border-right: 1px dotted #666',
										items: [{
											xtype: 'textfield',
											inputType: 'hidden',
											id: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-BankTransactionID',
											name: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-BankTransactionID'
										},{
											xtype: 'datefield',
											format:'Y-m-d',
											value: new Date(),
											fieldLabel: 'Date Transaction',
											labelWidth:180,
											allowBlank: false,
											baseCls: 'Sfr_FormInputMandatory',
											id: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-DateTransaction',
											name: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-DateTransaction',
											listeners:{
												'change': function(th,a){
													Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-FormBasicData-CheckingAccount').setMinValue(a);
												}
											}
										},{
											html:'<div style="margin-bottom:5px"></div>'
										},{
											xtype: 'datefield',
											format:'Y-m-d',
											value: new Date(),
											fieldLabel: 'Checking Account',
											hidden:true,
											labelWidth:180,
											id: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-CheckingAccount',
											name: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-CheckingAccount',
											listeners:{
												'change': function(th,a){
													Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-FormBasicData-DateTransaction').setMaxValue(a);
												}
											}
										},{
											html:'<div style="margin-bottom:5px"></div>'
										},{
											xtype: 'textfield',
											fieldLabel: 'Transaction No',
											hidden:true,
											id: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-NoVoucher',
											name: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-NoVoucher'
										},{
											html:'<div style="margin-bottom:5px"></div>'
										},{
											xtype: 'combobox',
											fieldLabel: 'Cost Element',
											store:thisObj.cost_element,
											queryMode:'local',
											displayField:'label',
											valueField:'id',
											id: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-CostElement',
											name: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-CostElement'
										}]
									},{
										columnWidth: 0.35,
										layout: 'form',
										style: 'padding:10px 20px 10px 5px; margin-right: 20px; border-right: 1px dotted #666',
										items: [{
											xtype: 'radiogroup',
											fieldLabel: 'Transaction Type',
											msgTarget: 'side',
											labelWidth:180,
											allowBlank:false,
											baseCls: 'Sfr_FormInputMandatory',
											columns: 2,
											items: [{
												boxLabel: 'Debet',
												name: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-TransactionType',
												inputValue: 'debit',
												id: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-TransactionTypeDebit',
												listeners: {
													change: function () {
														return false;
													}
												}
											}, {
												boxLabel: 'Credit',
												name: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-TransactionType',
												inputValue: 'credit',
												id: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-TransactionTypeKredit',
												listeners: {
													change: function () {
														return false;
													}
												}
											}]
										},{
											html:'<div style="margin-bottom:5px"></div>'
										},{
											xtype: 'numberfield',
											fieldLabel: 'Amount',
											allowBlank:false,
											baseCls: 'Sfr_FormInputMandatory',
											id: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-TransactionAmount',
											name: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-TransactionAmount'
										},{
											html:'<div style="margin-bottom:5px"></div>'
										},{
											xtype: 'combobox',
											id:'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-ProjectID',
											name:'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-ProjectID',
											store:thisObj.combo_project_bank,
											fieldLabel:'Project',
											queryMode:'local',
											displayField:'label',
											valueField:'id'								
										}]
									},{
										columnWidth: 0.3,
										layout: 'form',
										style: 'padding:10px 20px 10px 5px; margin-right: 20px; border-right: 1px dotted #666',
										items: [{
											xtype: 'textareafield',
											fieldLabel: 'Description',
											labelAlign:'top',
											id: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-Description',
											name: 'MitraJaya.view.Report.Kas.MainGrid-FormBasicData-Description'
										}]
									}]
								}]
							}]
						}]
					}],
					buttons: [{
						xtype: 'button',
						icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
						text: 'Save Transaction',
						cls: 'Sfr_BtnFormBlue',
						overCls: 'Sfr_BtnFormBlue-Hover',
						id: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-BtnSave',
						handler: function () {
							var Formnya = Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-FormBasicData').getForm();

							if (Formnya.isValid()) {

								Formnya.submit({
									url: m_api + '/v1/report/kas/submit_transaction',
									method: 'POST',
									waitMsg: 'Saving data...',
									params: {
										
									},
									success: function (fp, o) {
										Swal.fire({
											text: "Data saved",
											icon: 'success',
											confirmButtonColor: '#3085d6',
										}).then((result) => {
											if (result.isConfirmed) {
												thisObj.StoreGridMain.load();
											}
										})
										
										Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-FormBasicData').getForm().reset();
									},
									failure: function (fp, o) {
										try {
											var r = Ext.decode(o.response.responseText);
											
											Swal.fire({
												icon: 'error',
												text: r.message,
												// footer: '<a href="">Why do I have this issue?</a>'
											})
										} catch (err) {
											Swal.fire({
												icon: 'error',
												text: 'Connection Error',
												// footer: '<a href="">Why do I have this issue?</a>'
											})
										}
									}
								});

							} else {
								Swal.fire({
									icon: 'warning',
									text: 'Form not complete yet',
									// footer: '<a href="">Why do I have this issue?</a>'
								})
							}
						}
					},{
						xtype: 'button',
						text: 'Cancel',
						cls: 'Sfr_BtnFormBlue',
						overCls: 'Sfr_BtnFormBlue-Hover',
						id: 'MitraJaya.view.Finance.OrderBook.MainForm-FormBasicData-BtnCancel',
						handler: function () {
							Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-FormBasicData').getForm().reset();
						}
					}]
				}]
			}]
		},
		{
            xtype: 'grid',
            id: 'MitraJaya.view.Report.Kas.MainGrid-Grid',
            style: 'border:1px solid #CCC;margin-top:4px;',
            cls:'Sfr_GridNew',
			height: 600,
			autoScroll: true,
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
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/file-export.svg',
                    text: 'Export',
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_export_excel,
                    id: 'MitraJaya.view.Report.Kas.MainGrid-BtnExport',
                    handler: function() {
						var keySearch	= Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-keySearch').getValue();
						var StartDate	= Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-StartDate').getValue();
						var EndDate		= Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-EndDate').getValue();
						var CustomerID	= Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-CustomerID').getValue();

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
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
                    text: 'Update',
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_update,
                    id: 'MitraJaya.view.Report.Kas.MainGrid-BtnUpdate',
                    handler: function() {
						var sm = Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-Grid').getSelectionModel().getSelection()[0];

						if(sm == undefined){
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

						if(sm.get('BankTransactionID') == ''){
							Swal.fire(
								'Can\'t Update This Data',
								'',
								'warning'
							)
							return false;
						}
						
						Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-FormBasicData-BankTransactionID').setValue(sm.get('BankTransactionID'));
						Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-FormBasicData-DateTransaction').setValue(sm.get('DateTransaction'));
						Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-FormBasicData-CheckingAccount').setValue(sm.get('CheckingAccount'));
						Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-FormBasicData-NoVoucher').setValue(sm.get('NoVoucher'));
						Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-FormBasicData-CostElement').setValue(sm.get('CostElementID'));
						Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-FormBasicData-ProjectID').setValue(sm.get('ProjectID'));
						Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-FormBasicData-Description').setValue(sm.get('Description'));
						if(sm.get('TransactionType') == 'debit'){
							Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-FormBasicData-TransactionTypeDebit').setValue(true);
							Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-FormBasicData-TransactionAmount').setValue(sm.get('TransactionAmountDebitVal'));
						}
						if(sm.get('TransactionType') == 'credit'){
							Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-FormBasicData-TransactionTypeKredit').setValue(true);
							Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-FormBasicData-TransactionAmount').setValue(sm.get('TransactionAmountCreditVal'));
						}
						
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eraser.svg',
                    text: 'Delete',
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_delete,
                    id: 'MitraJaya.view.Report.Kas.MainGrid-BtnDelete',
                    handler: function() {                        
						var sm = Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-Grid').getSelectionModel().getSelection()[0];

						if(sm == undefined){
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

						if(sm.get('BankTransactionID') == ''){
							Swal.fire(
								'Can\'t Delete This Data',
								'',
								'warning'
							)
							return false;
						}

						Swal.fire({
							title: 'Do you want to delete this data ?',
							html: "Date Transaction : "+sm.get("DateTransaction")
							+"<br> Description : "+sm.get("Description")
							+"<br> Transaction : "+sm.get("TransactionType"),
							icon: 'warning',
							showCancelButton: true,
							confirmButtonColor: '#3085d6',
							cancelButtonColor: '#d33',
							confirmButtonText: 'Yes, delete it!'
						}).then((result) => {
							if (result.isConfirmed) {
								Ext.Ajax.request({
									waitMsg: 'Please Wait',
									url: m_api + '/v1/report/kas/delete_transaction',
									method: 'DELETE',
									params: {
										BankTransactionID: sm.get('BankTransactionID')
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
                    xtype:'tbspacer',
                    flex:1
                },{
					xtype: 'combobox',
					id:"MitraJaya.view.Report.Kas.MainGrid-Month",
					name:"MitraJaya.view.Report.Kas.MainGrid-Month",
					store:thisObj.combo_month,
					queryMode:'local',
					displayField:'label',
					valueField:'id',
					value:m_month
				},{
					xtype: 'combobox',
					id:"MitraJaya.view.Report.Kas.MainGrid-Year",
					name:"MitraJaya.view.Report.Kas.MainGrid-Year",
					store:thisObj.combo_year,
					queryMode:'local',
					displayField:'label',
					valueField:'id',
					value:m_year
				},{
                    cls: 'Sfr_BtnGridPaleBlue',
                    text: 'Apply',
					cls: 'Sfr_BtnFormBlue',
					overCls: 'Sfr_BtnFormBlue-Hover',
					style:'margin-right:20px',
                    handler: function () {
						setFilterLs();
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/file-export.svg',
                    text: 'Export',
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    id: 'MitraJaya.view.Report.Kas.MainGrid-BtnExport',
                    handler: function() {
						
						var Month	= Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-Month').getValue();
						var Year	= Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-Year').getValue();

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
									url: m_api + '/v1/report/kas/export_excel',
									method: 'POST',
									waitMsg: 'Please Wait',
									params: {
										Month 	: Month,
										Year 	: Year
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
                    text: 'Import',
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_add,
                    id: 'MitraJaya.view.Report.Kas.MainGrid-BtnImport',
                    handler: function() {
						var WinFormImportKas = Ext.create('MitraJaya.view.Report.Kas.WinFormImportKas');
                        if (!WinFormImportKas.isVisible()) {
                            WinFormImportKas.center();
                            WinFormImportKas.show();
                        } else {
                            WinFormImportKas.close();
                        }
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/recycle.svg',
                    cls:'Sfr_BtnGridBlue',
                    overCls:'Sfr_BtnGridBlue-Hover',
                    id: 'MitraJaya.view.Report.Kas.MainGrid-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-Grid').getStore().loadPage(1);
                    }
                }]
            }],
            columns:[{
                text: 'No',
                flex: 1,
                xtype: 'rownumberer'
            },{
                text: 'BankTransactionID',
                dataIndex: 'BankTransactionID',
                hidden: true
            },{
                text: 'Date Transaction',
                dataIndex: 'DateTransaction',
                flex: 10
            },{
                text: 'Cost Element',
                dataIndex: 'CostElement',
                flex: 10
            },{
                text: 'Description',
                dataIndex: 'Description',
                flex: 20
            },{
                text: 'Debit',
                dataIndex: 'TransactionAmountDebit',
                flex: 15,
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.TransactionAmountDebit, 2);
					
                    return RetVal;
                }
            },{
                text: 'Credit',
                dataIndex: 'TransactionAmountCredit',
                flex: 15,
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.TransactionAmountCredit, 2);
					
                    return RetVal;
                }
            },{
                text: 'Balance',
                dataIndex: 'Balance',
                flex: 15,
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.Balance, 2);
					
                    return RetVal;
                }
            },{
                text: 'Project',
                dataIndex: 'Project',
                flex: 15
            }]
        }];

        this.callParent(arguments);
    }
});

function setFilterLs() {
	localStorage.setItem('bank_transaction_storage', JSON.stringify({
		Month	: Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-Month').getValue(),
		Year	: Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-Year').getValue()
	}));
	Ext.getCmp('MitraJaya.view.Report.Kas.MainGrid-Grid').getStore().loadPage(1);
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
