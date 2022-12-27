/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : GridLoanPayment.js
 *******************************************/
 Ext.define('MitraJaya.view.Finance.Loan.GridLoanPayment' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Finance.Loan.GridLoanPayment',
    style:'padding:0 7px 7px 7px;margin:2px 0 0 0;',
    title:'Payment Loan',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Finance.Loan.GridLoanPayment',{
        	storeVar: {
                EmployeeLoanID: thisObj.viewVar.EmployeeLoanID
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
                itemId: 'MitraJaya.view.Finance.Loan.GridLoanPayment-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Finance.Loan.GridLoanPayment-Grid').getSelectionModel().getSelection()[0];
                    var WinFormLoanPayment = Ext.create('MitraJaya.view.Finance.Loan.WinFormLoanPayment');
                    WinFormLoanPayment.setViewVar({
                        OpsiDisplay:'view',
                        CallerStore: thisObj.StoreGridMain,
                        EmployeeLoanPaymentID:sm.get('EmployeeLoanPaymentID'),
						EmployeeLoanID: thisObj.viewVar.EmployeeLoanID
                    });
                    if (!WinFormLoanPayment.isVisible()) {
                        WinFormLoanPayment.center();
                        WinFormLoanPayment.show();
                    } else {
                        WinFormLoanPayment.close();
                    }
	            }
	        },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
                text: lang('Update'),
                cls:'Sfr_BtnConMenuWhite',
                hidden: m_act_update,
                itemId: 'MitraJaya.view.Finance.Loan.GridLoanPayment-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Finance.Loan.GridLoanPayment-Grid').getSelectionModel().getSelection()[0];
                    var WinFormLoanPayment = Ext.create('MitraJaya.view.Finance.Loan.WinFormLoanPayment');
                    WinFormLoanPayment.setViewVar({
                        OpsiDisplay:'update',
                        CallerStore: thisObj.StoreGridMain,
                        EmployeeLoanPaymentID:sm.get('EmployeeLoanPaymentID'),
						EmployeeLoanID: thisObj.viewVar.EmployeeLoanID
                    });
                    if (!WinFormLoanPayment.isVisible()) {
                        WinFormLoanPayment.center();
                        WinFormLoanPayment.show();
                    } else {
                        WinFormLoanPayment.close();
                    }
	            }
	        },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eraser.svg',
                text: lang('Delete'),
                cls:'Sfr_BtnConMenuWhite',
	            hidden: m_act_delete,
                itemId: 'MitraJaya.view.Finance.Loan.GridLoanPayment-ContextMenuDelete',
	            handler: function(){
                    var sm = Ext.getCmp('MitraJaya.view.Finance.Loan.GridLoanPayment-Grid').getSelectionModel().getSelection()[0];

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
								url: m_api + '/v1/finance/employeeloan/delete_payment_loan',
								method: 'DELETE',
								params: {
									EmployeeLoanPaymentID: sm.get('EmployeeLoanPaymentID')
								},
								success: function(response, opts) {
									Swal.fire(
										'Deleted!',
										'Your file has been deleted.',
										'success'
									)

									//refresh store
									thisObj.StoreGridMain.load();

                                    Ext.getCmp('MitraJaya.view.Finance.Loan.MainForm-FormBasicData').getForm().load({
                                        url: m_api + '/v1/finance/employeeloan/form_loan',
                                        method: 'GET',
                                        params: {
                                            EmployeeLoanID: thisObj.viewVar.EmployeeLoanID
                                        },
                                        success: function (form, action) {
                                            Ext.MessageBox.hide();
                                            var r = Ext.decode(action.response.responseText);
                                            //Title
                                            // Ext.getCmp('MitraJaya.view.Finance.Loan.MainForm-labelInfoInsert').update('<div id="header_title_farmer">' + Ext.getCmp('MitraJaya.view.Finance.Loan.MainForm-FormBasicData-EmployeeLoanID').getValue() + ' - <strong>' + Ext.getCmp('MitraJaya.view.Finance.Loan.MainForm-FormBasicData-SupplierName').getValue() + '</strong></div>');
                                            Ext.getCmp('MitraJaya.view.Finance.Loan.MainForm-labelInfoInsert').doLayout();
                                        },
                                        failure: function (form, action) {
                                            Swal.fire({
                                                icon: 'error',
                                                text: 'Failed to Retreive Data',
                                                // footer: '<a href="">Why do I have this issue?</a>'
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
            id: 'MitraJaya.view.Finance.Loan.GridLoanPayment-Grid',
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
                    id: 'MitraJaya.view.Finance.Loan.GridLoanPayment-BtnAdd',
                    handler: function() {
                    	var WinFormLoanPayment = Ext.create('MitraJaya.view.Finance.Loan.WinFormLoanPayment');
                        WinFormLoanPayment.setViewVar({
                            OpsiDisplay:'insert',
                            CallerStore: thisObj.StoreGridMain,
                            EmployeeLoanID:thisObj.viewVar.EmployeeLoanID
                        });
                        if (!WinFormLoanPayment.isVisible()) {
                            WinFormLoanPayment.center();
                            WinFormLoanPayment.show();
                        } else {
                            WinFormLoanPayment.close();
                        }
                    }
                }]
            }],
            columns:[{
            	text: '',
                xtype:'actioncolumn',
                flex: 0.1,
                items:[{
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/caret-down.svg',
                    handler: function(grid, rowIndex, colIndex, item, e, record) {
                        thisObj.ContextMenu.showAt(e.getXY());
                    }
                }]
            },{
                text: 'No',
                flex: 0.1,
                xtype: 'rownumberer'
            },{
                text: lang('EmployeeLoanPaymentID'),
                dataIndex: 'EmployeeLoanPaymentID',
                hidden: true
            },{
                text: lang('Loan ID'),
                dataIndex: 'EmployeeLoanID',
                flex: 1
            },{
                text: lang('Loan Payment Amount'),
                dataIndex: 'LoanPaymentAmount',
                flex: 1
            },{
                text: lang('Loan Payment Date'),
                dataIndex: 'LoanPaymentDate',
                flex: 1
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
