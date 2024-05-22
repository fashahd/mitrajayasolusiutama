/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : GridLoanPaymentEmployee.js
 *******************************************/
 Ext.define('MitraJaya.view.Finance.PinjamanSubCont.GridLoanPaymentEmployee' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Finance.PinjamanSubCont.GridLoanPaymentEmployee',
    style:'padding:0 7px 7px 7px;margin:2px 0 0 0;',
    title:'Payment Loan Employee',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Finance.PinjamanSubCont.GridLoanPaymentEmployee',{
        	storeVar: {
                LoanID: thisObj.viewVar.LoanID
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
                text: 'View',
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.Finance.PinjamanSubCont.GridLoanPaymentEmployee-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.GridLoanPaymentEmployee-Grid').getSelectionModel().getSelection()[0];
                    var WinFormLoanPayment = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment');
                    WinFormLoanPayment.setViewVar({
                        OpsiDisplay:'view',
                        CallerStore: thisObj.StoreGridMain,
                        LoanPaymentID:sm.get('LoanPaymentID')
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
                text: 'Update',
                cls:'Sfr_BtnConMenuWhite',
                hidden: m_act_update,
                itemId: 'MitraJaya.view.Finance.PinjamanSubCont.GridLoanPaymentEmployee-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.GridLoanPaymentEmployee-Grid').getSelectionModel().getSelection()[0];
                    var WinFormLoanPayment = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment');
                    WinFormLoanPayment.setViewVar({
                        OpsiDisplay:'update',
                        CallerStore: thisObj.StoreGridMain,
                        LoanPaymentID:sm.get('LoanPaymentID'),
                        LoanID: thisObj.viewVar.LoanID
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
                text: 'Delete',
                cls:'Sfr_BtnConMenuWhite',
	            hidden: m_act_delete,
                itemId: 'MitraJaya.view.Finance.PinjamanSubCont.GridLoanPaymentEmployee-ContextMenuDelete',
	            handler: function(){
                    var sm = Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.GridLoanPaymentEmployee-Grid').getSelectionModel().getSelection()[0];

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
								url: m_api + '/v1/finance/loan/delete_payment_loan',
								method: 'DELETE',
								params: {
									LoanPaymentID: sm.get('LoanPaymentID')
								},
								success: function(response, opts) {
									Swal.fire(
										'Deleted!',
										'Your file has been deleted.',
										'success'
									)

									//refresh store
									thisObj.StoreGridMain.load();

                                    Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData').getForm().load({
                                        url: m_api + '/v1/finance/loan/form_loan',
                                        method: 'GET',
                                        params: {
                                            LoanID: thisObj.viewVar.LoanID
                                        },
                                        success: function (form, action) {
                                            Ext.MessageBox.hide();
                                            var r = Ext.decode(action.response.responseText);
                                            //Title
                                            Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-labelInfoInsert').doLayout();
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
            id: 'MitraJaya.view.Finance.PinjamanSubCont.GridLoanPaymentEmployee-Grid',
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
                displayMsg: 'Showing'+' {0} '+'to'+' {1} '+'of'+' {2} '+'data'
            },{
                xtype: 'toolbar',
                dock:'top',
                items: [{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/square-plus.svg',
                    text: 'Add',
                    hidden: m_act_add,
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    id: 'MitraJaya.view.Finance.PinjamanSubCont.GridLoanPaymentEmployee-BtnAdd',
                    handler: function() {
                    	var WinFormLoanPayment = Ext.create('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment');
                        WinFormLoanPayment.setViewVar({
                            OpsiDisplay:'insert',
                            CallerStore: thisObj.StoreGridMain,
                            LoanID:thisObj.viewVar.LoanID
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
                text: 'LoanPaymentID',
                dataIndex: 'LoanPaymentID',
                hidden: true
            },{
                text: 'Doc No',
                dataIndex: 'DocumentNo',
                flex: 20
            },{
                text: 'Paid Amount',
                dataIndex: 'LoanPaymentAmount',
                flex: 20
            },{
                text: 'Paid Date',
                dataIndex: 'LoanPaymentDate',
                flex: 20
            },{
                text: 'Description',
                dataIndex:'PaymentLoanDescription',
                flex:20
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
