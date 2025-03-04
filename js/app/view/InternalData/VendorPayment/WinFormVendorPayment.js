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

Ext.define('MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment' ,{
    extend: 'Ext.window.Window',
    id: 'MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment',
    cls: 'Sfr_LayoutPopupWindows',
    title:lang('Vendor Payment Form'),
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
            var FormNya = Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment-Form');
            FormNya.getForm().reset();


            if(thisObj.viewVar.OpsiDisplay == 'insert'){
                
            }

            if(thisObj.viewVar.OpsiDisplay == 'update' || thisObj.viewVar.OpsiDisplay == 'view'){
                if(thisObj.viewVar.OpsiDisplay == 'view') {
                    Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment-Form-BtnSave').setVisible(false);
                }

                FormNya.getForm().load({
                    url: m_api + '/v1/internaldata/vendorpayment/form_payment_vendor',
                    method: 'GET',
                    params: {
                        VendorPaymentID: thisObj.viewVar.VendorPaymentID
                    },
                    success: function (form, action) {
                        var r = Ext.decode(action.response.responseText);
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

            // Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment').initMap('map-picker-plot', Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment-Form-Latitude').getValue(), Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment-Form-Longitude').getValue());
        }
    },
    initComponent: function() {
        var thisObj = this;
        let labelWidth = 150;


        //items -------------------------------------------------------------- (begin)
        thisObj.items = [{
        	xtype: 'form',
            id: 'MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment-Form',
            padding:'5 25 5 8',
            items:[{
                layout: 'column',
                border: false,
                items:[{
                    columnWidth: 1,
                    layout:'form',
                    items:[{
                    	xtype: 'textfield',
                        id: 'MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment-Form-DocumentNo',
                        name: 'MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment-Form-DocumentNo',
                        fieldLabel: lang('Document Number'),
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                    }, {
                    	xtype: 'numberfield',
                        id: 'MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment-Form-VendorPaymentAmount',
                        name: 'MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment-Form-VendorPaymentAmount',
                        fieldLabel: lang('Payment Amount'),
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                    },
                    {
                    	xtype: 'datefield',
                        id: 'MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment-Form-VendorPaymentDate',
                        name: 'MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment-Form-VendorPaymentDate',
                        fieldLabel: lang('Payment Date'),
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                        format: 'Y-m-d'
                    }, {
                        xtype: 'textareafield',
                        labelAlign:'top',
                        id: 'MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment-Form-VendorPaymentDescription',
                        name: 'MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment-Form-VendorPaymentDescription',
                        fieldLabel: lang('Vendor Payment Description')
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
            id: 'MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment-Form-BtnSave',
            handler: function () {
            	var FormNya = Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.WinFormVendorPayment-Form').getForm();
                if (FormNya.isValid()) {
                    FormNya.submit({
                        url: m_api + '/v1/internaldata/vendorpayment/submit_payment_vendor',
                        method:'POST',
                        params: {
                            OpsiDisplay: thisObj.viewVar.OpsiDisplay,
                            VendorPaymentID: thisObj.viewVar.VendorPaymentID,
                            PaymentID: thisObj.viewVar.PaymentID
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

                            Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData').getForm().load({
                                url: m_api + '/v1/internaldata/vendorpayment/form_payment',
                                method: 'GET',
                                params: {
                                    PaymentID: o.result.PaymentID
                                },
                                success: function (form, action) {
                                    Ext.MessageBox.hide();
                                    var r = Ext.decode(action.response.responseText);
                                    //Title
                                    // Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-labelInfoInsert').update('<div id="header_title_farmer">' + Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-PaymentID').getValue() + ' - <strong>' + Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-FormBasicData-SupplierName').getValue() + '</strong></div>');
                                    Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainForm-labelInfoInsert').doLayout();
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
