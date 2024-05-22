/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.view.Report.BankTransaction.MainGrid' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Report.BankTransaction.MainGrid',
    renderTo: 'ext-content',
    style:'padding: 0px ; margin: 0px;',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;

			var bank_transaction_storage = JSON.parse(localStorage.getItem('bank_transaction_storage'));

            if(bank_transaction_storage){
                Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-Month').setValue(bank_transaction_storage.Month);				
                Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-Year').setValue(bank_transaction_storage.Year);
            }
            // document.getElementById('ContentTopBar').style.display = 'block';
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Report.BankTransaction.MainGrid');
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
                text: lang('View'),
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.Report.BankTransaction.MainGrid-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Report.BankTransaction.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'view',
                                OrderBookID: sm.get('OrderBookID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Report.BankTransaction.MainForm', {
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
                itemId: 'MitraJaya.view.Report.BankTransaction.MainGrid-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid').destroy(); //destory current view
                    
                    var FormMainFarmer = [];
                    if(Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainForm') == undefined){
                        FormMainFarmer = Ext.create('MitraJaya.view.Report.BankTransaction.MainForm', {
                            viewVar: {
                                OpsiDisplay: 'update',
                                OrderBookID: sm.get('OrderBookID'),
                                PanelDisplayID: sm.get('PanelDisplayID')
                            }
                        });
                    }else{
                        //destroy, create ulang
                        Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainForm').destroy();
                        FormMainFarmer = Ext.create('MitraJaya.view.Report.BankTransaction.MainForm', {
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
                itemId: 'MitraJaya.view.Report.BankTransaction.MainGrid-ContextMenuDelete',
	            handler: function(){
                    var sm = Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-Grid').getSelectionModel().getSelection()[0];

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
									OrderBookID: sm.get('OrderBookID')
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
					xtype: 'panel',
					title: lang('Bank Transaction Form'),
					frame: true,
                    hidden: m_act_add,
					cls: 'Sfr_PanelLayoutForm',
					id: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormGeneralData',
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
								id: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData',
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
											id: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-BankTransactionID',
											name: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-BankTransactionID'
										},{
											xtype: 'datefield',
											format:'Y-m-d',
											value: new Date(),
											fieldLabel: lang('Date Transaction'),
											labelWidth:180,
											allowBlank: false,
											baseCls: 'Sfr_FormInputMandatory',
											id: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-DateTransaction',
											name: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-DateTransaction',
											listeners:{
												'change': function(th,a){
													Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-CheckingAccount').setMinValue(a);
												}
											}
										},{
											html:'<div style="margin-bottom:5px"></div>'
										},{
											xtype: 'datefield',
											format:'Y-m-d',
											value: new Date(),
											fieldLabel: lang('Checking Account'),
											labelWidth:180,
											id: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-CheckingAccount',
											name: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-CheckingAccount',
											listeners:{
												'change': function(th,a){
													Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-DateTransaction').setMaxValue(a);
												}
											}
										},{
											html:'<div style="margin-bottom:5px"></div>'
										},{
											xtype: 'textfield',
											fieldLabel: lang('Transaction No'),
											id: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-NoVoucher',
											name: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-NoVoucher'
										},{
											html:'<div style="margin-bottom:5px"></div>'
										},{
											xtype: 'combobox',
											fieldLabel: lang('Cost Element'),
											store:thisObj.cost_element,
											queryMode:'local',
											displayField:'label',
											valueField:'id',
											id: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-CostElement',
											name: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-CostElement'
										}]
									},{
										columnWidth: 0.35,
										layout: 'form',
										style: 'padding:10px 20px 10px 5px; margin-right: 20px; border-right: 1px dotted #666',
										items: [{
											xtype: 'radiogroup',
											fieldLabel: lang('Transaction Type'),
											msgTarget: 'side',
											labelWidth:180,
											allowBlank:false,
											baseCls: 'Sfr_FormInputMandatory',
											columns: 2,
											items: [{
												boxLabel: lang('Debet'),
												name: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-TransactionType',
												inputValue: 'debit',
												id: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-TransactionTypeDebit',
												listeners: {
													change: function () {
														return false;
													}
												}
											}, {
												boxLabel: lang('Credit'),
												name: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-TransactionType',
												inputValue: 'credit',
												id: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-TransactionTypeKredit',
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
											fieldLabel: lang('Amount'),
											allowBlank:false,
											baseCls: 'Sfr_FormInputMandatory',
											id: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-TransactionAmount',
											name: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-TransactionAmount'
										},{
											html:'<div style="margin-bottom:5px"></div>'
										},{
											xtype: 'combobox',
											id:'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-ProjectID',
											name:'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-ProjectID',
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
											fieldLabel: lang('Description'),
											labelAlign:'top',
											id: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-Description',
											name: 'MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-Description'
										}]
									}]
								}]
							}]
						}]
					}],
					buttons: [{
						xtype: 'button',
						icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
						text: lang('Save Transaction'),
						cls: 'Sfr_BtnFormBlue',
						overCls: 'Sfr_BtnFormBlue-Hover',
						id: 'MitraJaya.view.Report.BankTransaction.MainForm-FormBasicData-BtnSave',
						handler: function () {
							var Formnya = Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData').getForm();

							if (Formnya.isValid()) {

								Formnya.submit({
									url: m_api + '/v1/report/bank_transaction/submit_transaction',
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
										
										Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData').getForm().reset();
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
						text: lang('Cancel'),
						cls: 'Sfr_BtnFormBlue',
						overCls: 'Sfr_BtnFormBlue-Hover',
						id: 'MitraJaya.view.Report.BankTransaction.MainForm-FormBasicData-BtnCancel',
						handler: function () {
							Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData').getForm().reset();
						}
					}]
				}]
			}]
		},
		{
            xtype: 'grid',
            id: 'MitraJaya.view.Report.BankTransaction.MainGrid-Grid',
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
                displayMsg: lang('Showing')+' {0} '+lang('to')+' {1} '+lang('of')+' {2} '+lang('data')
            },{
                xtype: 'toolbar',
                dock:'top',
                items: [{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
                    text: lang('Update'),
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_update,
                    id: 'MitraJaya.view.Report.BankTransaction.MainGrid-BtnUpdate',
                    handler: function() {
						var sm = Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-Grid').getSelectionModel().getSelection()[0];

						if(sm == undefined){
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}
						
						Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-BankTransactionID').setValue(sm.get('BankTransactionID'));
						Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-DateTransaction').setValue(sm.get('DateTransaction'));
						Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-CheckingAccount').setValue(sm.get('CheckingAccount'));
						Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-NoVoucher').setValue(sm.get('NoVoucher'));
						Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-CostElement').setValue(sm.get('CostElementID'));
						Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-ProjectID').setValue(sm.get('ProjectID'));
						Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-Description').setValue(sm.get('Description'));
						if(sm.get('TransactionType') == 'debit'){
							Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-TransactionTypeDebit').setValue(true);
							Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-TransactionAmount').setValue(sm.get('TransactionAmountDebitVal'));
						}
						if(sm.get('TransactionType') == 'credit'){
							Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-TransactionTypeKredit').setValue(true);
							Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-FormBasicData-TransactionAmount').setValue(sm.get('TransactionAmountCreditVal'));
						}
						
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eraser.svg',
                    text: lang('Delete'),
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_delete,
                    id: 'MitraJaya.view.Report.BankTransaction.MainGrid-BtnDelete',
                    handler: function() {                        
						var sm = Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-Grid').getSelectionModel().getSelection()[0];

						if(sm == undefined){
							Swal.fire(
								'Please Select Data!',
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
									url: m_api + '/v1/report/bank_transaction/delete_transaction',
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
					id:"MitraJaya.view.Report.BankTransaction.MainGrid-Month",
					name:"MitraJaya.view.Report.BankTransaction.MainGrid-Month",
					store:thisObj.combo_month,
					queryMode:'local',
					displayField:'label',
					valueField:'id',
					value:m_month
				},{
					xtype: 'combobox',
					id:"MitraJaya.view.Report.BankTransaction.MainGrid-Year",
					name:"MitraJaya.view.Report.BankTransaction.MainGrid-Year",
					store:thisObj.combo_year,
					queryMode:'local',
					displayField:'label',
					valueField:'id',
					value:m_year
				},{
                    cls: 'Sfr_BtnGridPaleBlue',
                    text: lang('Apply'),
					cls: 'Sfr_BtnFormBlue',
					overCls: 'Sfr_BtnFormBlue-Hover',
					style:'margin-right:20px',
                    handler: function () {
						setFilterLs();
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/file-export.svg',
                    text: lang('Export'),
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    id: 'MitraJaya.view.Report.BankTransaction.MainGrid-BtnExport',
                    handler: function() {
						
						var Month	= Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-Month').getValue();
						var Year	= Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-Year').getValue();

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
									url: m_api + '/v1/report/bank_transaction/export_excel',
									method: 'POST',
									waitMsg: lang('Please Wait'),
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
                    text: lang('Import'),
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_add,
                    id: 'MitraJaya.view.Report.BankTransaction.MainGrid-BtnImport',
                    handler: function() {
						var WinFormImportBankTransaction = Ext.create('MitraJaya.view.Report.BankTransaction.WinFormImportBankTransaction');
                        if (!WinFormImportBankTransaction.isVisible()) {
                            WinFormImportBankTransaction.center();
                            WinFormImportBankTransaction.show();
                        } else {
                            WinFormImportBankTransaction.close();
                        }
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/recycle.svg',
                    cls:'Sfr_BtnGridBlue',
                    overCls:'Sfr_BtnGridBlue-Hover',
                    id: 'MitraJaya.view.Report.BankTransaction.MainGrid-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-Grid').getStore().loadPage(1);
                    }
                }]
            }],
            columns:[{
                text: 'No',
                flex: 1,
                xtype: 'rownumberer'
            },{
                text: lang('BankTransactionID'),
                dataIndex: 'BankTransactionID',
                hidden: true
            },{
                text: lang('Date Transaction'),
                dataIndex: 'DateTransaction',
                flex: 10
            },{
                text: lang('Checking Account'),
                dataIndex: 'CheckingAccount',
                flex: 10
            },{
                text: lang('Transaction No'),
                dataIndex: 'NoVoucher',
                flex: 10
            },{
                text: lang('Cost Element'),
                dataIndex: 'CostElement',
                flex: 10
            },{
                text: lang('Description'),
                dataIndex: 'Description',
                flex: 20
            },{
                text: lang('Debit'),
                dataIndex: 'TransactionAmountDebit',
                flex: 15
            },{
                text: lang('Credit'),
                dataIndex: 'TransactionAmountCredit',
                flex: 15
            },{
                text: lang('Balance'),
                dataIndex: 'Balance',
                flex: 15
            },{
                text: lang('Project'),
                dataIndex: 'Project',
                flex: 15
            }]
        }];

        this.callParent(arguments);
    }
});

function setFilterLs() {
	localStorage.setItem('bank_transaction_storage', JSON.stringify({
		Month	: Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-Month').getValue(),
		Year	: Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-Year').getValue()
	}));
	Ext.getCmp('MitraJaya.view.Report.BankTransaction.MainGrid-Grid').getStore().loadPage(1);
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
