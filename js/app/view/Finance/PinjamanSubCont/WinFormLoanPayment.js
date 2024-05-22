/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Wed Jan 29 2020
 *  File : WinFormFarmStatus.js
 *******************************************/

/*
    Param2 yg diperlukan ketika load View ini
    - OpsiDisplay
    - CallerStore
    - SupplierID
    - FarmNr
*/

Ext.define('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment' ,{
    extend: 'Ext.window.Window',
    id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment',
    cls: 'Sfr_LayoutPopupWindows',
    title:lang('Loan Payment Form'),
    closable: true,
    modal: true,
    closeAction: 'destroy',
    width: '30%',
    height: 450,
    overflowY: 'auto',
    viewVar: false,
    setViewVar: function(value){
        this.viewVar = value;
    },
    listeners: {
        afterRender: function(){
            var thisObj = this;

            //form reset
            var FormNya = Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment-Form');
            FormNya.getForm().reset();


            if(thisObj.viewVar.OpsiDisplay == 'insert'){
                
            }

            if(thisObj.viewVar.OpsiDisplay == 'update' || thisObj.viewVar.OpsiDisplay == 'view'){
                if(thisObj.viewVar.OpsiDisplay == 'view') {
                    Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment-Form-BtnSave').setVisible(false);
                }

                FormNya.getForm().load({
                    url: m_api + '/v1/finance/loan/form_payment_loan',
                    method: 'GET',
                    params: {
                        LoanPaymentID: thisObj.viewVar.LoanPaymentID
                    },
                    success: function (form, action) {
                        var r = Ext.decode(action.response.responseText);
                        //Title
                        // Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-labelInfoInsert').update('<div id="header_title_farmer">' + Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanID').getValue() + ' - <strong>' + Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-SupplierName').getValue() + '</strong></div>');
                        // Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment-labelInfoInsert').doLayout();
                    },
                    failure: function (form, action) {
                        Swal.fire({
							icon: 'error',
							text: 'Failed to Retreive Data',
							// footer: '<a href="">Why do I have this issue?</a>'
						})
                    }
                });
            }

            // Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment').initMap('map-picker-plot', Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment-Form-Latitude').getValue(), Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment-Form-Longitude').getValue());
        }
    },
    initComponent: function() {
        var thisObj = this;
        let labelWidth = 150;


        //items -------------------------------------------------------------- (begin)
        thisObj.items = [{
        	xtype: 'form',
            id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment-Form',
            padding:'5 25 5 8',
            items:[{
                layout: 'column',
                border: false,
                items:[{
                    columnWidth: 1,
                    layout:'form',
                    items:[{
                    	xtype: 'textfield',
                        id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment-Form-DocumentNo',
                        name: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment-Form-DocumentNo',
                        fieldLabel: lang('Document Number'),
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                    }, {
                    	xtype: 'numericfield',
                        id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment-Form-LoanPaymentAmount',
                        name: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment-Form-LoanPaymentAmount',
                        fieldLabel: lang('Loan Payment Amount'),
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                    },
                    {
                    	xtype: 'datefield',
                        id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment-Form-LoanPaymentDate',
                        name: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment-Form-LoanPaymentDate',
                        fieldLabel: lang('Loan Payment Date'),
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                        format: 'Y-m-d'
                    }, {
                        xtype: 'textareafield',
                        labelAlign:'top',
                        id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment-Form-PaymentLoanDescription',
                        name: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment-Form-PaymentLoanDescription',
                        fieldLabel: lang('Payment Loan Description')
                    }]
                }]
            }]
        }];
        //items -------------------------------------------------------------- (end)

        //buttons -------------------------------------------------------------- (begin)
        thisObj.buttons = [{
            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
            cls:'Sfr_BtnFormBlue',
            overCls:'Sfr_BtnFormBlue-Hover',
            text: lang('Save'),
            id: 'MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment-Form-BtnSave',
            handler: function () {
            	var FormNya = Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.WinFormLoanPayment-Form').getForm();
                if (FormNya.isValid()) {
                    FormNya.submit({
                        url: m_api + '/v1/finance/loan/submit_payment_loan',
                        method:'POST',
                        params: {
                            OpsiDisplay: thisObj.viewVar.OpsiDisplay,
                            LoanPaymentID: thisObj.viewVar.LoanPaymentID,
                            LoanID: thisObj.viewVar.LoanID
                        },
                        waitMsg: 'Saving data...',
                        success: function(fp, o) {
                            Ext.MessageBox.show({
                                title: 'Information',
                                msg: lang('Data saved'),
                                buttons: Ext.MessageBox.OK,
                                animateTarget: 'mb9',
                                icon: 'ext-mb-success'
                            });

                            //refresh store FamLab yg manggil
                            thisObj.viewVar.CallerStore.load();

                            
                            //tutup popup
                            thisObj.close();

                            Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData').getForm().load({
                                url: m_api + '/v1/finance/loan/form_loan',
                                method: 'GET',
                                params: {
                                    LoanID: o.result.LoanID
                                },
                                success: function (form, action) {
                                    Ext.MessageBox.hide();
                                    var r = Ext.decode(action.response.responseText);
                                    //Title
                                    // Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-labelInfoInsert').update('<div id="header_title_farmer">' + Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-LoanID').getValue() + ' - <strong>' + Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-SupplierName').getValue() + '</strong></div>');
                                    Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-labelInfoInsert').doLayout();
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
                        failure: function(fp, o){
                            try {
                                var r = Ext.decode(o.response.responseText);
                                Ext.MessageBox.show({
                                    title: 'Error',
                                    msg: r.message,
                                    buttons: Ext.MessageBox.OK,
                                    animateTarget: 'mb9',
                                    icon: 'ext-mb-error'
                                });
                            }
                            catch(err) {
                                Ext.MessageBox.show({
                                    title: 'Error',
                                    msg: 'Connection Error',
                                    buttons: Ext.MessageBox.OK,
                                    animateTarget: 'mb9',
                                    icon: 'ext-mb-error'
                                });
                            }
                        }
                    });
                }else{
                    Ext.MessageBox.show({
                        title: 'Attention',
                        msg: lang('Form not valid yet'),
                        buttons: Ext.MessageBox.OK,
                        animateTarget: 'mb9',
                        icon: 'ext-mb-info'
                    });
                }
            }
        },{
            icon: varjs.config.base_url + 'images/icons/new/close.png',
			text: lang('Close'),
			cls:'Sfr_BtnFormGrey',
			overCls:'Sfr_BtnFormGrey-Hover',
            handler: function() {
                thisObj.close();
            }
        }];
        //buttons -------------------------------------------------------------- (end)

        this.callParent(arguments);
    },
    
});
