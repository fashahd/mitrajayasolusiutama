Ext.define('MitraJaya.view.Finance.OrderBook.WinFormImportOrderBook', {
    extend: 'Ext.window.Window',
    id: 'MitraJaya.view.Finance.OrderBook.WinFormImportOrderBook',
    title: 'Import Form',
    closable: true,
    modal: true,
    closeAction: 'destroy',
    width: '80%',
    height: '95%',
    overflowY: 'auto',
    initComponent: function () {
        var thisObj = this;

        var storeGridFailed = Ext.create('MitraJaya.store.Finance.OrderBook.MainGridImportFailed');

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
                        id: 'MitraJaya.view.Finance.OrderBook.WinFormImportOrderBook-DownloadTemplate',
                        style: 'margin-top:15px;',
                        text: 'Download Template Excel',
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
                                url: m_api + '/v1/finance/order/generate_template',
                                method: 'POST',
                                success: function (response) {
                                    var text = JSON.parse(response.responseText);
                                    // process server response here
                                    window.location = m_api + '/v1/finance/order/download_template' + "?url=" + text.url + '&namaFile=template_order_book.xlsx'
                                },
                                failure: function (response) {
                                    Ext.MessageBox.alert('Warning', 'Failed to generate template !');
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
                        id: 'MitraJaya.view.Finance.OrderBook.WinFormImportOrderBook-Form',
                        fileUpload: true,
                        items: [{
                            layout: 'column',
                            items: [{
                                columnWidth: 0.5,
                                style: 'margin-top:15px;',
                                xtype: 'fileuploadfield',
                                name: 'order_ImportFile',
                                id: 'MitraJaya.view.Finance.OrderBook.WinFormImportOrderBook-Form-ImportFile',
                                fieldLabel: 'Upload File',
                                alowBlank: false,
                                baseCls: 'Sfr_FormInputMandatory',
                                listeners: {
                                    'change': function (fb, v) {
                                        var form = Ext.getCmp('MitraJaya.view.Finance.OrderBook.WinFormImportOrderBook-Form').getForm();
                                        if (form.isValid()) {
                                            form.submit({
                                                url: m_api + '/v1/finance/order/import_order',
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
                                                        msg = 'Connection error';
                                                    }
                                                    Ext.getCmp('MitraJaya.view.Finance.OrderBook.WinFormImportOrderBook-Form-FileName').setValue(null)
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
                                                msg: 'Form not complete yet',
                                                buttons: Ext.MessageBox.OK,
                                                animateTarget: 'mb9',
                                                icon: 'ext-mb-info'
                                            });
                                        }
                                    }
                                }
                            }, {
                                xtype: 'hiddenfield',
                                id: 'MitraJaya.view.Finance.OrderBook.WinFormImportOrderBook-Form-FileName',
                                name: 'MitraJaya.view.Finance.OrderBook.WinFormImportOrderBook-Form-FileName',
                            }, {
                                columnWidth: 0.5,
                                items: [{
                                    xtype: 'button',
                                    id: 'MitraJaya.view.Finance.OrderBook.WinFormImportOrderBook-ClearData',
                                    style: 'margin-top:18px;margin-left:20px',
                                    text: 'Clear',
                                    handler: function () {
                                        Ext.Ajax.request({
                                            url: m_api + '/v1/finance/order/clear_data',
                                            method: 'GET',
                                            success: function(response){
												// refresh grid store
												storeGridFailed.load();
                                            },
                                            failure: function(response) {
                                                Ext.MessageBox.alert('Warning', 'Failed to generate template !');
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
                    id: 'MitraJaya.view.Finance.OrderBook.WinFormImportOrderBook-FailedData',
                    style: 'border:1px solid #CCC;margin-top:4px;margin-left:10px;margin-right:10px',
                    loadMask: true,
                    overflowX: 'scroll',
                    overflowY: 'scroll',
                    selType: 'rowmodel',
                    title: 'Failed Data',
                    store: storeGridFailed,
                    minHeight: 500,
                    viewConfig: {
                        deferEmptyText: false,
                        emptyText: 'No data Available',
                    },
                    dockedItems: [{
                        xtype: 'pagingtoolbar',
                        store: storeGridFailed,
                        dock: 'bottom',
                        displayInfo: true
                    }],
                    columns: [{
                        text: 'No',
                        flex: 0.2,
                        xtype: 'rownumberer'
                    }, {
                        text: 'OrderBookID',
                        dataIndex: 'OrderBookID',
                        hidden: true
                    }, {
                        text: 'PO Number',
                        dataIndex: 'ContractNumber',
                        flex: 1.5
                    }, {
                        text: 'PO Date',
                        dataIndex: 'ContractDate',
                        flex: 1.5
                    }, {
                        text: 'Description',
                        dataIndex: 'Description',
                        flex: 2
                    }, {
                        text: 'Project',
                        dataIndex: 'ProjectName',
                        flex: 2
                    }, {
                        text: 'Customer',
                        dataIndex: 'CustomerName',
                        flex: 2
                    }, {
                        text: 'Dept',
                        dataIndex: 'DeptName',
                        flex: 1
                    }, {
                        text: 'Total Amount',
                        dataIndex: 'TotalContactAmount',
                        flex: 2
                    }, {
                        text: 'Error',
                        dataIndex: 'ErrorMessages',
                        flex: 2
                    }]
                }]
            }]
        }]

        this.callParent(arguments);
    },
    buttons: [{
        text: 'Close',
        margin: '5px',
        scale: 'large',
        ui: 's-button',
        cls: 's-grey',
        handler: function () {
            Ext.getCmp('MitraJaya.view.Finance.OrderBook.WinFormImportOrderBook').close();
        }
    }],
    listeners: {
        afterRender: function (component, eOpts) {

        }
    }
});
