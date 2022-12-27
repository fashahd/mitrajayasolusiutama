/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.view.Finance.BudgetPlan.MainGrid' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Finance.BudgetPlan.MainGrid',
    renderTo: 'ext-content',
    style:'padding:0 7px 7px 7px;margin:2px 0 0 0;',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
            document.getElementById('ContentTopBar').style.display = 'block';

            var budget_plan_src = JSON.parse(localStorage.getItem('budget_plan_src'));

            if(budget_plan_src){
                Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Year').setValue(budget_plan_src.Year);
                Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Month').setValue(budget_plan_src.Month);
			}
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain 		    = Ext.create('MitraJaya.store.Finance.BudgetPlan.MainGrid');
        thisObj.StoreGridMainExpense 	= Ext.create('MitraJaya.store.Finance.BudgetPlan.MainGridExpense');
        thisObj.combo_month             = Ext.create('MitraJaya.store.General.StoreMonth');

        thisObj.TotalIncomePlaning      = 0;
        thisObj.TotalIncomeActual       = 0;
        thisObj.TotalExpensePlaning     = 0;
        thisObj.TotalExpenseActual      = 0;
		
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
                itemId: 'MitraJaya.view.Finance.BudgetPlan.MainGrid-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    
					var WinPajak = Ext.create('MitraJaya.view.Finance.BudgetPlan.WinPajak',{
                        viewVar:{
							OpsiDisplay: 'view',
							Month: sm.get('Month'),
							Period: sm.get('Period'),
							Year: sm.get('Year'),
							Amount: sm.get('Amount'),
							VATAmount: sm.get('VATAmount'),
                            CallerStore: thisObj.StoreGridMain,
							PaidAmountVal: sm.get('PaidAmountVal'),
							ReportStatus: sm.get('ReportStatus')
                        }
                    });

                    if (!WinPajak.isVisible()) {
                        WinPajak.center();
                        WinPajak.show();
                    } else {
                        WinPajak.close();
                    }
	            }
	        },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
                text: lang('Update'),
                cls:'Sfr_BtnConMenuWhite',
                hidden: m_act_update,
                itemId: 'MitraJaya.view.Finance.BudgetPlan.MainGrid-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    
					var WinPajak = Ext.create('MitraJaya.view.Finance.BudgetPlan.WinPajak',{
                        viewVar:{
							OpsiDisplay: 'update',
							Month: sm.get('Month'),
							Period: sm.get('Period'),
							Year: sm.get('Year'),
							Amount: sm.get('Amount'),
							VATAmount: sm.get('VATAmount'),
							PaidAmountVal: sm.get('PaidAmountVal'),
                            CallerStore: thisObj.StoreGridMain,
							ReportStatus: sm.get('ReportStatus')
                        }
                    });

                    if (!WinPajak.isVisible()) {
                        WinPajak.center();
                        WinPajak.show();
                    } else {
                        WinPajak.close();
                    }
	            }
	        }]
	    });

		thisObj.GridIncome = [{
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
							columnWidth: 0.3,
							layout: 'form',
							style: 'padding-right:10px',
							items: [{
								xtype: 'combobox',
								id:'MitraJaya.view.Finance.BudgetPlan.MainGrid-Month',
								name:'MitraJaya.view.Finance.BudgetPlan.MainGrid-Month',
								labelAlign:'top',
								fieldLabel:'Budget Period Month',
								store:thisObj.combo_month,
								queryMode:'local',
								displayField:'label',
								valueField:'id',
								value:m_month
							}]
						},{
							columnWidth: 0.3,
							layout: 'form',
							style: 'padding-right:10px',
							items: [{
								xtype: 'combobox',
								id:'MitraJaya.view.Finance.BudgetPlan.MainGrid-Year',
								name:'MitraJaya.view.Finance.BudgetPlan.MainGrid-Year',
								labelAlign:'top',
								fieldLabel:'Budget Period Year',
								store:thisObj.combo_year,
								queryMode:'local',
								displayField:'label',
								valueField:'id',
								value:m_year
							}]
						},{
							columnWidth: 0.2,
							layout: 'form',
							items: [{
								xtype:'button',
								// icon: varjs.config.base_url + 'images/icons/new/add-filter.png',
								text:lang('Search'),
								style:'margin-left:20px; margin-top:30px',
								cls:'Sfr_BtnFormCyan',
								overCls:'Sfr_BtnFormCyan-Hover',
								id: 'MitraJaya.view.Finance.BudgetPlan.MainGrid-BtnApplyFilter',
								handler: function() {
									setFilterLs();
								}
							}]
						},{
							columnWidth: 0.2,
							layout: 'form',
							items: [{
								xtype:'button',
								icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/file-export.svg',
								text: lang('Export'),
								cls:'Sfr_BtnGridNewWhite',
								overCls:'Sfr_BtnGridNewWhite-Hover',
								style:'margin-top:25px',
								id: 'MitraJaya.view.Finance.OrderBook.MainGrid-BtnExport',
								handler: function() {
									var Year	= Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Year').getValue();
									var Month	= Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Month').getValue();
			
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
												url: m_api + '/v1/finance/budgetplan/export_data',
												method: 'GET',
												waitMsg: lang('Please Wait'),
												params: {
													Year : Year,
													Month : Month
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
							}]
						}]
					}]
				}]
			}]
        }, {
            xtype: 'grid',
            id: 'MitraJaya.view.Finance.BudgetPlan.MainGrid-Grid',
            style: 'border:1px solid #CCC;margin-top:4px;',
            cls:'Sfr_GridNew',
			minHeight:600,
            loadMask: true,
            selType: 'rowmodel',
            features: [{
                groupHeaderTpl: '{name}',
                ftype: 'groupingsummary',
                collapsible: false,
            }],
            store: thisObj.StoreGridMain,
            enableColumnHide: false,
            viewConfig: {
                deferEmptyText: false,
                emptyText: GetDefaultContentNoData()
            },
            dockedItems: [{
                xtype: 'toolbar',
                dock:'top',
                items: [{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/download.svg',
                    text: lang('Export'),
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_export_excel,
                    id: 'MitraJaya.view.Finance.BudgetPlan.MainGrid-BtnExport',
                    handler: function() {
						var Year		= Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Year').getValue();

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
										// Ext.MessageBox.hide();										
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
                    html:'<div>Income</div>'
                },{
                    xtype:'tbspacer',
                    flex:1
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/square-plus.svg',
                    text: lang('Add'),
                    hidden: m_act_add,
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    id: 'MitraJaya.view.Finance.BudgetPlan.MainGrid-Income-Grid-BtnAdd',
                    handler: function() {
                        var WinFormIncome = Ext.create('MitraJaya.view.Finance.BudgetPlan.WinFormIncome');
                        WinFormIncome.setViewVar({
                            OpsiDisplay:'insert',
                            CallerStore: thisObj.StoreGridMain
                        });
                        if (!WinFormIncome.isVisible()) {
                            WinFormIncome.center();
                            WinFormIncome.show();
                        } else {
                            WinFormIncome.close();
                        }
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
                    text: lang('Update'),
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_update,
                    id: 'MitraJaya.view.Finance.BudgetPlan.MainGrid-Income-Grid-BtnUpdate',
                    handler: function() {
						var sm = Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Grid').getSelectionModel().getSelection()[0];

						if(sm == undefined){
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

                        if(sm.data.BudgetPlanID == '' || sm.data.BudgetPlanID == null){
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

                        var WinFormIncome = Ext.create('MitraJaya.view.Finance.BudgetPlan.WinFormIncome');
                        WinFormIncome.setViewVar({
                            OpsiDisplay:'update',
                            CallerStore: thisObj.StoreGridMain
                        });
                        if (!WinFormIncome.isVisible()) {
                            WinFormIncome.center();
                            WinFormIncome.show();
                        } else {
                            WinFormIncome.close();
                        }
						
						Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData-BudgetPlanID').setValue(sm.data.BudgetPlanID);
						Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData-BudgetItem').setValue(sm.data.Item);
						Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData-BudgetDate').setValue(sm.data.BudgetDate);
						Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData-BudgetAmount').setValue(sm.data.Budget);
						Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData-BudgetActual').setValue(sm.data.Actual);
						
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eraser.svg',
                    text: lang('Delete'),
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_delete,
                    id: 'MitraJaya.view.Finance.BudgetPlan.MainGrid-Income-Grid-BtnDelete',
                    handler: function() {
						var sm = Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Grid').getSelectionModel().getSelection()[0];

                        // console.log(sm);

						if(sm == undefined){
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

                        if(sm.data.BudgetPlanID == '' || sm.data.BudgetPlanID == null){
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}
                        
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
                                    url: m_api + '/v1/finance/budgetplan/delete_income',
                                    method: 'DELETE',
                                    params: {
                                        BudgetPlanID: sm.data.BudgetPlanID
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
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/recycle.svg',
                    cls:'Sfr_BtnGridBlue',
                    overCls:'Sfr_BtnGridBlue-Hover',
                    id: 'MitraJaya.view.Finance.BudgetPlan.MainGrid-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Grid').getStore().loadPage(1);
                    }
                }]
            }],
            columns:[{
                text: lang(''),
                dataIndex: 'Item',
                flex: 1
            },{
                text: lang('Budget'),
                dataIndex: 'Budget',
                flex: 1,
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.Budget, 2);
					
                    return RetVal;
                }
            },{
                text: lang('Actual'),
                dataIndex: 'Actual',
                flex: 1,
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.Actual, 2);
					
                    return RetVal;
                }
            },{
                text: lang('Outstanding'),
                dataIndex: 'Outstanding',
                flex: 1,
				renderer: function (t, meta, record) {
                    let RetVal;

                    if(record.data.Outstanding != ''){
                        RetVal  = 'Rp '+number_format(record.data.Outstanding, 2);
                        
                        return RetVal;
                    }
                }
            }],
            listeners: {
                afterrender: {
                    fn: function(grid) {
                        var myStoreBudget = grid.getStore();
                        myStoreBudget.on({
                            load: {
                                fn: function(storeBudget) {
                                    var totalData = storeBudget.getTotalCount();

                                    var Budget = 0;
                                    var Actual = 0;
                                    for(i=0; i<totalData;i++){
                                        var dataBudget = storeBudget.getAt(i).data;

                                        // console.log(dataBudget)

                                        Budget += parseFloat(dataBudget.Budget);
                                        Actual += parseFloat(dataBudget.Actual);
                                    }

                                    thisObj.TotalIncomePlaning = Budget;
                                    thisObj.TotalIncomeActual  = Actual;

                                    var Outstanding = Budget + Actual;

                                    myStoreBudget.add({
                                        'Week'   : 'Total Budget',
                                        'Budget' : Budget,
                                        'Actual' : Actual,
                                        'Outstanding' : Outstanding
                                    })
                                }
                            }
                        });
                        myStoreBudget.load();
                    }
                }
            }
        }];

		thisObj.GridExpenses = [{
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
							columnWidth: 1,
							layout: 'form',
							style: 'padding-right:10px',
							items: [{
                                html:'<div><h6 style="float:right"><b>Total Difference</b>  <br><b>Planing :</b> <span id="TotalBudget">Rp 0</span> <b>| Actual :</b> <span id="TotalExpenses">Rp 0</span></h6></div>'
                            }]
						}]
                    }]
                }]
            }]
        },{
            xtype: 'grid',
            id: 'MitraJaya.view.Finance.BudgetPlan.MainGrid-Expense-Grid',
            style: 'border:1px solid #CCC;margin-top:15px;',
            cls:'Sfr_GridNew',
			minHeight:600,
			features: [{
                groupHeaderTpl: 'Week - {name}',
                ftype: 'groupingsummary',
                collapsible: false,
            }],
            loadMask: true,
            selType: 'rowmodel',
            store: thisObj.StoreGridMainExpense,
            enableColumnHide: false,
            viewConfig: {
                deferEmptyText: false,
                emptyText: GetDefaultContentNoData()
            },
            dockedItems: [{
                xtype: 'toolbar',
                dock:'top',
                items: [{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/download.svg',
                    text: lang('Export'),
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_export_excel,
                    id: 'MitraJaya.view.Finance.BudgetPlan.MainGrid-Expense-BtnExport',
                    handler: function() {
						var Year		= Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Expense-Year').getValue();

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
										// Ext.MessageBox.hide();
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
                    html:'<div>Expenses</div>'
                },{
                    xtype:'tbspacer',
                    flex:1
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/square-plus.svg',
                    text: lang('Add'),
                    hidden: m_act_add,
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    id: 'MitraJaya.view.Finance.BudgetPlan.MainGrid-Expense-Grid-BtnAdd',
                    handler: function() {
                        var WinFormExpenses = Ext.create('MitraJaya.view.Finance.BudgetPlan.WinFormExpenses');
                        WinFormExpenses.setViewVar({
                            OpsiDisplay:'insert',
                            CallerStore: thisObj.StoreGridMainExpense
                        });
                        if (!WinFormExpenses.isVisible()) {
                            WinFormExpenses.center();
                            WinFormExpenses.show();
                        } else {
                            WinFormExpenses.close();
                        }
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
                    text: lang('Update'),
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_update,
                    id: 'MitraJaya.view.Finance.BudgetPlan.MainGrid-Expense-Grid-BtnUpdate',
                    handler: function() {
						var sm = Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Expense-Grid').getSelectionModel().getSelection()[0];

                        // console.log(sm);

						if(sm == undefined){
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

                        if(sm.data.BudgetPlanID == ''){
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

                        var WinFormExpenses = Ext.create('MitraJaya.view.Finance.BudgetPlan.WinFormExpenses');
                        WinFormExpenses.setViewVar({
                            OpsiDisplay:'update',
                            CallerStore: thisObj.StoreGridMainExpense
                        });
                        if (!WinFormExpenses.isVisible()) {
                            WinFormExpenses.center();
                            WinFormExpenses.show();
                        } else {
                            WinFormExpenses.close();
                        }
						
						Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.WinFormExpenses-FormBasicData-BudgetPlanID').setValue(sm.data.BudgetPlanID);
						Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.WinFormExpenses-FormBasicData-BudgetItem').setValue(sm.data.Item);
						Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.WinFormExpenses-FormBasicData-BudgetCategoryID').setValue(sm.data.BudgetCategoryID);
						Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.WinFormExpenses-FormBasicData-BudgetDate').setValue(sm.data.BudgetDate);
						Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.WinFormExpenses-FormBasicData-BudgetAmount').setValue(sm.data.BudgetAmount);
						Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.WinFormExpenses-FormBasicData-BudgetActual').setValue(sm.data.BudgetActual);
						
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eraser.svg',
                    text: lang('Delete'),
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_delete,
                    id: 'MitraJaya.view.Finance.BudgetPlan.MainGrid-Expense-Grid-BtnDelete',
                    handler: function() {
						var sm = Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Expense-Grid').getSelectionModel().getSelection()[0];

                        // console.log(sm);

						if(sm == undefined){
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}

                        if(sm.data.BudgetPlanID == ''){
							Swal.fire(
								'Please Select Data!',
								'',
								'warning'
							)
							return false;
						}
                        
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
                                    url: m_api + '/v1/finance/budgetplan/delete_expenses',
                                    method: 'DELETE',
                                    params: {
                                        BudgetPlanID: sm.data.BudgetPlanID
                                    },
                                    success: function(response, opts) {
                                        Swal.fire(
                                            'Deleted!',
                                            'Your file has been deleted.',
                                            'success'
                                        )
    
                                        //refresh store
                                        thisObj.StoreGridMainExpense.load();
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
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/recycle.svg',
                    cls:'Sfr_BtnGridBlue',
                    overCls:'Sfr_BtnGridBlue-Hover',
                    id: 'MitraJaya.view.Finance.BudgetPlan.MainGrid-Expense-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Expense-Grid').getStore().loadPage(1);
                    }
                }]
            }],
            columns:[{
                text: lang(''),
                dataIndex: 'Item',
                flex: 1
            },{
                text: lang('Category'),
                dataIndex: 'Category',
                flex: 1
            },{
                text: lang('Budget'),
                dataIndex: 'Budget',
                flex: 1,
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.Budget, 2);
					
                    return RetVal;
                }
            },{
                text: lang('Actual'),
                dataIndex: 'Actual',
                flex: 1,
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.Actual, 2);
					
                    return RetVal;
                }
            },{
                text: lang('Outstanding'),
                dataIndex: 'Outstanding',
                flex: 1,
				renderer: function (t, meta, record) {
                    let RetVal;

                    if(record.data.Outstanding != ''){
                        RetVal  = 'Rp '+number_format(record.data.Outstanding, 2);
                        
                        return RetVal;
                    }
                }
            }],
            listeners: {
                afterrender: {
                    fn: function(grid) {
                        var myStore = grid.getStore();
                        myStore.on({
                            load: {
                                fn: function(store) {
                                    var total = store.getTotalCount();

                                    var BudgetExpenses = 0;
                                    var ActualExpesnses = 0;
                                    for(i=0; i<total;i++){
                                        var data = store.getAt(i).data;

                                        if(data.Item != "<b>TOTAL</b>" && data.Budget > 0){
                                            BudgetExpenses += parseFloat(data.Budget);
                                        }
                                        if(data.Item != "<b>TOTAL</b>" && data.Actual > 0){
                                            ActualExpesnses += parseFloat(data.Actual);
                                        }
                                    }
                                    
                                    thisObj.TotalExpensePlaning = BudgetExpenses;
                                    thisObj.TotalExpenseActual  = ActualExpesnses;

                                    let dollarUSLocale = Intl.NumberFormat('en-US');

                                    var DifferencePlaning  = thisObj.TotalIncomePlaning - thisObj.TotalExpensePlaning;
                                    var DifferenceExpenses = thisObj.TotalIncomeActual - thisObj.TotalExpensePlaning;

                                    // document.getElementById('TotalBudget').innerHTML(thisObj.TotalIncomePlaning);
                                    document.getElementById('TotalBudget').textContent = "Rp "+(dollarUSLocale.format(DifferencePlaning));
                                    document.getElementById('TotalExpenses').textContent = "Rp "+(dollarUSLocale.format(DifferenceExpenses));

                                    // Ext.getCmp('TotalBudget').update(thisObj.TotalIncomePlaning);

                                    var OutstandingExpesnses = BudgetExpenses + ActualExpesnses;

                                    myStore.add({
                                        'Week'   : 'Total Expense',
                                        'Budget' : BudgetExpenses,
                                        'Actual' : ActualExpesnses,
                                        'Outstanding' : OutstandingExpesnses
                                    })
                                }
                            }
                        });
                        myStore.load();
                    }
                }
            }
        }];

        thisObj.items = [{
            layout: 'column',
            border: false,
            items: [{
                //LEFT CONTENT
                columnWidth: 0.5,
                items: thisObj.GridIncome
            },{
                //LEFT CONTENT
                columnWidth: 0.5,
				style:'padding-left:20px',
                items: thisObj.GridExpenses
            }]
        }];

        this.callParent(arguments);
    }, 
    submitOnEnterGrid: function (field, event) {        
		localStorage.setItem('budget_plan_src', JSON.stringify({
			Year		: Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Year').getValue()
		}));
		Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Grid').getStore().loadPage(1);
		Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Expense-Grid').getStore().loadPage(1);
    }
});

function setFilterLs() {
	localStorage.setItem('budget_plan_src', JSON.stringify({
		Year		: Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Year').getValue(),
		Month		: Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Month').getValue()
	}));

	Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Grid').getStore().loadPage(1);
	Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.MainGrid-Expense-Grid').getStore().loadPage(1);
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
