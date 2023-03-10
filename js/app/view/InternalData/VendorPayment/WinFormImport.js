Ext.define('MitraJaya.view.InternalData.VendorPayment.WinFormImport', {
    extend: 'Ext.window.Window',
    id: 'MitraJaya.view.InternalData.VendorPayment.WinFormImport',
    title: lang('Import Form'),
    closable: true,
    modal: true,
    closeAction: 'destroy',
    width: '80%',
    height: '95%',
    overflowY: 'auto',
    initComponent: function () {
        var thisObj = this;

        var storeGridFailed = Ext.create('MitraJaya.store.InternalData.VendorPayment.MainGridImportFailed');

        thisObj.items = [{
            layout: 'column',
            border: false,
            padding: '5 20 5 5',
            items: [{
                columnWidth: 1,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'fieldset',
                    style: 'margin-top:10px;',
                    frame: true,
                    border: true,
                    height: 55,
                    items: [{
                        xtype: 'button',
                        id: 'MitraJaya.view.InternalData.VendorPayment.WinFormImport-DownloadTemplate',
                        style: 'margin-top:15px;',
                        text: lang('Download Template Excel'),
                        handler: function () {
                            Ext.MessageBox.show({
                                msg: 'Please wait...',
                                progressText: 'Generating...',
                                width: 300,
                                wait: true,
                                waitConfig: {
                                    interval: 200
                                },
                                icon: 'ext-mb-download',
                                animateTarget: 'mb7'
                            });

                            Ext.Ajax.request({
                                url: m_api + '/v1/internaldata/vendorpayment/generate_template',
                                method: 'POST',
                                success: function (response) {
                                    var text = JSON.parse(response.responseText);
                                    // process server response here
                                    window.location = m_api + '/v1/finance/order/download_template' + "?url=" + text.url + '&namaFile=template_vendor_subcont_payment.xlsx'
                                },
                                failure: function (response) {
                                    Ext.MessageBox.alert(lang('Warning'), lang('Failed to generate template !'));
                                }
                            });
                            Ext.MessageBox.hide();
                        }
                    }]
                }, {
                    html: '<div></div>',
                }, {
                    html: '<div></div>',
                }, {
                    xtype: 'fieldset',
                    frame: true,
                    border: true,
                    height: 55,
                    items: [{
                        xtype: 'form',
                        id: 'MitraJaya.view.InternalData.VendorPayment.WinFormImport-Form',
                        fileUpload: true,
                        items: [{
                            layout: 'column',
                            items: [{
                                columnWidth: 0.5,
                                style: 'margin-top:15px;',
                                xtype: 'fileuploadfield',
                                name: 'payment_ImportFile',
                                id: 'MitraJaya.view.InternalData.VendorPayment.WinFormImport-Form-ImportFile',
                                fieldLabel: 'Upload File',
                                alowBlank: false,
                                baseCls: 'Sfr_FormInputMandatory',
                                listeners: {
                                    'change': function (fb, v) {
                                        var form = Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.WinFormImport-Form').getForm();
                                        if (form.isValid()) {
                                            form.submit({
                                                url: m_api + '/v1/internaldata/vendorpayment/import_payment',
                                                method: 'POST',
                                                clientValidation: false,
                                                waitMsg: 'Importing Data...',
                                                success: function (fp, o) {
                                                    var msg = o.result.message;

                                                    console.log(msg);

                                                    Ext.MessageBox.show({
                                                        title: 'Success',
                                                        msg: "Success : " + msg.Success + ", Failed : " + msg.Failed,
                                                        buttons: Ext.MessageBox.OK,
                                                        animateTarget: 'mb9',
                                                        icon: 'ext-mb-success'
                                                    });

                                                    // refresh grid store
                                                    storeGridFailed.load();
                                                },
                                                failure: function (fp, o) {
                                                    var msg;
                                                    if (o.result.message != undefined) {
                                                        msg = o.result.message;
                                                    } else {
                                                        msg = lang('Connection error');
                                                    }
                                                    Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.WinFormImport-Form-FileName').setValue(null)
                                                    Ext.MessageBox.show({
                                                        title: 'Error',
                                                        msg: msg,
                                                        buttons: Ext.MessageBox.OK,
                                                        animateTarget: 'mb9',
                                                        icon: 'ext-mb-error'
                                                    });
                                                }
                                            });

                                        } else {
                                            Ext.MessageBox.show({
                                                title: 'Attention',
                                                msg: lang('Form not complete yet'),
                                                buttons: Ext.MessageBox.OK,
                                                animateTarget: 'mb9',
                                                icon: 'ext-mb-info'
                                            });
                                        }
                                    }
                                }
                            }, {
                                xtype: 'hiddenfield',
                                id: 'MitraJaya.view.InternalData.VendorPayment.WinFormImport-Form-FileName',
                                name: 'MitraJaya.view.InternalData.VendorPayment.WinFormImport-Form-FileName',
                            }, {
                                columnWidth: 0.5,
                                items: [{
                                    xtype: 'button',
                                    id: 'MitraJaya.view.InternalData.VendorPayment.WinFormImport-ClearData',
                                    style: 'margin-top:18px;margin-left:20px',
                                    text: lang('Clear'),
                                    handler: function () {
                                        Ext.Ajax.request({
                                            url: m_api + '/v1/internaldata/vendorpayment/clear_data',
                                            method: 'GET',
                                            success: function(response){
												// refresh grid store
												storeGridFailed.load();
                                            },
                                            failure: function(response) {
                                                Ext.MessageBox.alert(lang('Warning'), lang('Failed to generate template !'));
                                            }
                                        });
                                    }
                                }]
                            }]
                        }]
                    }]
                }, {
                    html: '<div></div>',
                }, {
                    html: '<div></div>',
                }, {
                    xtype: 'grid',
                    id: 'MitraJaya.view.InternalData.VendorPayment.WinFormImport-FailedData',
                    style: 'border:1px solid #CCC;margin-top:4px;margin-left:10px;margin-right:10px',
                    loadMask: true,
                    overflowX: 'scroll',
                    overflowY: 'scroll',
                    selType: 'rowmodel',
                    title: lang('Failed Data'),
                    store: storeGridFailed,
                    minHeight: 500,
                    viewConfig: {
                        deferEmptyText: false,
                        emptyText: lang('No data Available'),
                    },
                    dockedItems: [{
                        xtype: 'pagingtoolbar',
                        store: storeGridFailed,
                        dock: 'bottom',
                        displayInfo: true
                    }],
                    columns: [
					{
						text: 'No',
						flex: 0.2,
						xtype: 'rownumberer'
					},
					{
						text: lang('Document No'),
						dataIndex: 'DocumentNo',
					},
					{
						text: lang('PO Number'),
						dataIndex: 'ProjectID',
					},
					{
						text: lang('Name'),
						dataIndex: 'MitraName',
					},
					{
						text: lang('Description'),
						dataIndex: 'Description',
					},
					{
						text: lang('Inv Date'),
						dataIndex: 'InvoiceComplete',
					},
					{
						text: lang('Due Date'),
						dataIndex: 'DueDate',
					},
					{
						text: lang('Amount'),
						dataIndex: 'Amount',
					},
					{
						text: lang('Insurance'),
						dataIndex: 'Insurance',
					},
					{
						text: lang('PPH23'),
						dataIndex: 'PPH23Option',
					},
					{
						text: lang('PPH'),
						dataIndex: 'PPHValue',
					},
					{
						text: lang('Cashbon Document No'),
						dataIndex: 'CashbonDocumentNumber',
					},
					{
						text: lang('Cashbon Amount'),
						dataIndex: 'CashbonAmount',
					},
					{
						text: lang('SIOK3Name'),
						dataIndex: 'SIOK3Name',
					},
					{
						text: lang('SIOK3 Amount'),
						dataIndex: 'SIOK3Amount',
					},
					{
						text: lang('Outstanding'),
						dataIndex: 'Outstanding',
					},
					{
						text: lang('Paid Date'),
						dataIndex: 'PaidDate',
					},
					{
						text: lang('Paid Amount'),
						dataIndex: 'PaidAmount',
					},
					{
						text: lang('Error'),
						dataIndex: 'ErrorMessages'	
					}]
                }]
            }]
        }]

        this.callParent(arguments);
    },
    buttons: [{
        text: lang('Close'),
        margin: '5px',
        scale: 'large',
        ui: 's-button',
        cls: 's-grey',
        handler: function () {
            Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.WinFormImport').close();
        }
    }],
    listeners: {
        afterRender: function (component, eOpts) {

        }
    }
});
