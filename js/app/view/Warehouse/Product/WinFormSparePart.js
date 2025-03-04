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

Ext.define('MitraJaya.view.Warehouse.Product.WinFormSparePart' ,{
    extend: 'Ext.window.Window',
    id: 'MitraJaya.view.Warehouse.Product.WinFormSparePart',
    cls: 'Sfr_LayoutPopupWindows',
    title:lang('Actual Location Form'),
    closable: true,
    modal: true,
    closeAction: 'destroy',
    width: '95%',
    height: 650,
    overflowY: 'auto',
    viewVar: false,
    setViewVar: function(value){
        this.viewVar = value;
    },
    listeners: {
        afterRender: function(){
            var thisObj = this;

            //form reset
            var FormNya = Ext.getCmp('MitraJaya.view.Warehouse.Product.WinFormSparePart-Form');
            FormNya.getForm().reset();



            if(thisObj.viewVar.OpsiDisplay == 'insert'){
                Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartCode').setValue(thisObj.viewVar.Code);
                Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-ProductID').setValue(thisObj.viewVar.ProductID);
            }

            if(thisObj.viewVar.OpsiDisplay == 'update' || thisObj.viewVar.OpsiDisplay == 'view'){
                if(thisObj.viewVar.OpsiDisplay == 'view') {
                    Ext.getCmp('MitraJaya.view.Warehouse.Product.WinFormSparePart-Form-BtnSave').setVisible(false);
                }

                FormNya.getForm().load({
                    url: m_api + '/v1/warehouse/sparepart/form_sparepart',
                    method: 'GET',
                    params: {
                        SparepartID: this.viewVar.SparepartID
                    },
                    success: function (form, action) {
                        Ext.MessageBox.hide();
                        var r = Ext.decode(action.response.responseText);
    
                        if(r.data.FilePath != ''){
                            
                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-Photo').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/' + r.data.FilePath + '\')"><img src="' + m_api_base_url + '/' + r.data.FilePath + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld').setValue(r.data.FilePath);
                        }
    
                        if(r.data.FilePath2 != ''){
                            
                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-Photo2').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/' + r.data.FilePath2 + '\')"><img src="' + m_api_base_url + '/' + r.data.FilePath2 + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld2').setValue(r.data.FilePath2);
                        }
    
                        if(r.data.FilePath3 != ''){
                            
                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-Photo3').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/' + r.data.FilePath3 + '\')"><img src="' + m_api_base_url + '/' + r.data.FilePath3 + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld3').setValue(r.data.FilePath3);
                        }
                    },
                    failure: function (form, action) {
                        Ext.MessageBox.hide();
                        Swal.fire({
                            icon: 'error',
                            text: 'Failed to retrieve data',
                            // footer: '<a href="">Why do I have this issue?</a>'
                        })
                    }
                });
            }

            // Ext.getCmp('MitraJaya.view.Warehouse.Product.WinFormProduct').initMap('map-picker-plot', Ext.getCmp('MitraJaya.view.Warehouse.Product.WinFormProduct-Form-Latitude').getValue(), Ext.getCmp('MitraJaya.view.Warehouse.Product.WinFormProduct-Form-Longitude').getValue());
        }
    },
    initComponent: function() {
        var thisObj = this;
        let labelWidth = 150;
        thisObj.combo_rack_list = Ext.create('MitraJaya.store.General.RackList');


        //items -------------------------------------------------------------- (begin)
        thisObj.items = [{
        	xtype: 'form',
            id: 'MitraJaya.view.Warehouse.Product.WinFormSparePart-Form',
            padding:'5 25 5 8',
            items:[{
                layout: 'column',
                border: false,
                items:[{
                    columnWidth: 1,
                    layout: 'form',
                    cls: 'Sfr_PanelLayoutFormContainer',
                    items: [{
                        xtype: 'form',
                        id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData',
                        fileUpload: true,
                        buttonAlign: 'center',
                        
                        items: [{
                            layout: 'column',
                            border: false,
                            items: [{
                                columnWidth: 0.2,
                                layout: 'form',
                                style: 'padding:10px 0px 10px 5px;',
                                items: [{
                                    xtype: 'textfield',
                                    inputType: 'hidden',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartID',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartID'
                                }, {
                                    xtype: 'textfield',
                                    inputType: 'hidden',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-ProductID',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-ProductID'
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartCode',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartCode',
                                    fieldLabel: lang('Sparepart Code'),
                                    readOnly:true
                                }, {
                                    xtype: 'numberfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartNumberCode',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartNumberCode',
                                    fieldLabel: lang('Sparepart Number Code'),
                                    allowBlank: false,
                                    baseCls: 'Sfr_FormInputMandatory',
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartName',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartName',
                                    fieldLabel: lang('Sparepart Name'),
                                    allowBlank: false,
                                    baseCls: 'Sfr_FormInputMandatory',
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartNo',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartNo',
                                    fieldLabel: lang('Sparepart No')
                                }, {
                                    xtype: 'radiogroup',
                                    labelAlign:'top',
                                    fieldLabel: lang('Sparepart Type'),
                                    msgTarget: 'side',
                                    allowBlank: false,
                                    baseCls: 'Sfr_FormInputMandatory',
                                    columns: 3,
                                    items: [{
                                        boxLabel: lang('Mech.'),
                                        name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartType',
                                        inputValue: 'mech',
                                        id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartTypeMech',
                                    }, {
                                        boxLabel: lang('Elect.'),
                                        name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartType',
                                        inputValue: 'elect',
                                        id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartTypeElect',
                                    }, {
                                        boxLabel: lang('PCBs'),
                                        name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartType',
                                        inputValue: 'pcbs',
                                        id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartTypePCBs',
                                    }]
                                }, {
                                    xtype: 'radiogroup',
                                    labelAlign:'top',
                                    fieldLabel: lang('Category'),
                                    msgTarget: 'side',
                                    allowBlank: false,
                                    baseCls: 'Sfr_FormInputMandatory',
                                    columns: 3,
                                    items: [{
                                        boxLabel: lang('C'),
                                        name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartCategory',
                                        inputValue: 'c',
                                        id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartCategoryCritical',
                                    }, {
                                        boxLabel: lang('F'),
                                        name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartCategory',
                                        inputValue: 'f',
                                        id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartCategoryFastMoving',
                                    }, {
                                        boxLabel: lang('S'),
                                        name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartCategory',
                                        inputValue: 's',
                                        id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartCategoryStandard',
                                    }]
                                }]
                            }, {
                                columnWidth: 0.2,
                                layout: 'form',
                                style: 'padding:10px 0px 10px 5px;',
                                items: [{
                                    xtype: 'numberfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartQty',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartQty',
                                    fieldLabel: lang('Base Qty')
                                },{
                                    xtype: 'combobox',
									id:'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-RackID',
									name:'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-RackID',
									labelAlign:'top',
									fieldLabel:'Rak No',
                                    store:thisObj.combo_rack_list,
                                    queryMode:'local',
                                    displayField:'label',
                                    valueField:'id',
                                }, {
                                    xtype: 'combobox',
									id:'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-RakNumber',
									name:'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-RakNumber',
									labelAlign:'top',
									fieldLabel:'Rak No',
                                    store:thisObj.combo_rack_list,
                                    queryMode:'local',
                                    displayField:'label',
                                    valueField:'id',
                                }, {
                                    xtype: 'numericfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartBasicPrice',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartBasicPrice',
                                    fieldLabel: lang('Basic Price')
                                }, {
                                    xtype: 'numericfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartSellingPrice',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartSellingPrice',
                                    fieldLabel: lang('Selling Price')
                                }, {
                                    xtype: 'radiogroup',
                                    labelAlign:'top',
                                    fieldLabel: lang('Sparepart Status'),
                                    msgTarget: 'side',
                                    allowBlank: false,
                                    baseCls: 'Sfr_FormInputMandatory',
                                    columns: 2,
                                    items: [{
                                        boxLabel: lang('Ready'),
                                        name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartStatus',
                                        inputValue: 'ready',
                                        id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartStatusReady',
                                    }, {
                                        boxLabel: lang('Indent'),
                                        name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartStatus',
                                        inputValue: 'indent',
                                        id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartStatusIndent',
                                    }]
                                }, {
                                    xtype: 'textareafield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartRemark',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartRemark',
                                    fieldLabel: lang('Remarks / Vendor')
                                }]
                            }, {
                                columnWidth: 0.2,
                                layout: 'form',
                                style: 'padding:10px 5px 10px 20px;',
                                defaults: {
                                    labelAlign: 'left',
                                    labelWidth: 150
                                },
                                items: [{
                                    layout: 'column',
                                    border: false,
                                    items: [{
                                        columnWidth: 1,
                                        layout: 'form',
                                        style: 'padding:10px 0px 10px 5px;',
                                        items: [{
                                            xtype: 'panel',
                                            id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-Photo2',
                                            html: '<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/assets/images/no_data.png' +'\')"><img src="' + m_api_base_url + '/assets/images/no_data.png" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>'
                                        }, {
                                            xtype: 'fileuploadfield',
                                            id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoInput2',
                                            name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoInput2',
                                            buttonText: lang('Browse'),
                                            cls: 'Sfr_FormBrowseBtn',
                                            listeners: {
                                                'change': function (fb, v) {
                                                    Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData').getForm().submit({
                                                        url: m_api + '/v1/warehouse/sparepart/upload2',
                                                        clientValidation: false,
                                                        params: {
                                                            OpsiDisplay: thisObj.viewVar.OpsiDisplay
                                                        },
                                                        waitMsg: 'Sending Photo...',
                                                        success: function (fp, o) {
                                                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-Photo2').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/' + o.result.file + '\')"><img src="' + m_api_base_url + '/' + o.result.file + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
                                                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld2').setValue(o.result.file);
                                                        },
                                                        failure: function (fp, o) {
                                                            Ext.MessageBox.show({
                                                                title: lang('Error'),
                                                                msg: o.result.message,
                                                                buttons: Ext.MessageBox.OK,
                                                                animateTarget: 'mb9',
                                                                icon: 'ext-mb-error'
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        }, {
                                            xtype: 'textfield',
                                            id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld2',
                                            name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld2',
                                            inputType: 'hidden'
                                        }]
                                    }]
                                }]
                            }, {
                                columnWidth: 0.2,
                                layout: 'form',
                                style: 'padding:10px 5px 10px 20px;',
                                defaults: {
                                    labelAlign: 'left',
                                    labelWidth: 150
                                },
                                items: [{
                                    layout: 'column',
                                    border: false,
                                    items: [{
                                        columnWidth: 1,
                                        layout: 'form',
                                        style: 'padding:10px 0px 10px 5px;',
                                        items: [{
                                            xtype: 'panel',
                                            id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-Photo',
                                            html: '<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/assets/images/no_data.png' +'\')"><img src="' + m_api_base_url + '/assets/images/no_data.png" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>'
                                        }, {
                                            xtype: 'fileuploadfield',
                                            id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoInput',
                                            name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoInput',
                                            buttonText: lang('Browse'),
                                            cls: 'Sfr_FormBrowseBtn',
                                            listeners: {
                                                'change': function (fb, v) {
                                                    Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData').getForm().submit({
                                                        url: m_api + '/v1/warehouse/sparepart/upload',
                                                        clientValidation: false,
                                                        params: {
                                                            OpsiDisplay: thisObj.viewVar.OpsiDisplay
                                                        },
                                                        waitMsg: 'Sending Photo...',
                                                        success: function (fp, o) {
                                                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-Photo').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/' + o.result.file + '\')"><img src="' + m_api_base_url + '/' + o.result.file + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
                                                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld').setValue(o.result.file);
                                                        },
                                                        failure: function (fp, o) {
                                                            Ext.MessageBox.show({
                                                                title: lang('Error'),
                                                                msg: o.result.message,
                                                                buttons: Ext.MessageBox.OK,
                                                                animateTarget: 'mb9',
                                                                icon: 'ext-mb-error'
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        }, {
                                            xtype: 'textfield',
                                            id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld',
                                            name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld',
                                            inputType: 'hidden'
                                        }]
                                    }]
                                }]
                            }, {
                                columnWidth: 0.2,
                                layout: 'form',
                                style: 'padding:10px 5px 10px 20px;',
                                defaults: {
                                    labelAlign: 'left',
                                    labelWidth: 150
                                },
                                items: [{
                                    layout: 'column',
                                    border: false,
                                    items: [{
                                        columnWidth: 1,
                                        layout: 'form',
                                        style: 'padding:10px 0px 10px 5px;',
                                        items: [{
                                            xtype: 'panel',
                                            id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-Photo3',
                                            html: '<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/assets/images/no_data.png' +'\')"><img src="' + m_api_base_url + '/assets/images/no_data.png" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>'
                                        }, {
                                            xtype: 'fileuploadfield',
                                            id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoInput3',
                                            name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoInput3',
                                            buttonText: lang('Browse'),
                                            cls: 'Sfr_FormBrowseBtn',
                                            listeners: {
                                                'change': function (fb, v) {
                                                    Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData').getForm().submit({
                                                        url: m_api + '/v1/warehouse/sparepart/upload3',
                                                        clientValidation: false,
                                                        params: {
                                                            OpsiDisplay: thisObj.viewVar.OpsiDisplay
                                                        },
                                                        waitMsg: 'Sending Photo...',
                                                        success: function (fp, o) {
                                                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-Photo3').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/' + o.result.file + '\')"><img src="' + m_api_base_url + '/' + o.result.file + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
                                                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld3').setValue(o.result.file);
                                                        },
                                                        failure: function (fp, o) {
                                                            Ext.MessageBox.show({
                                                                title: lang('Error'),
                                                                msg: o.result.message,
                                                                buttons: Ext.MessageBox.OK,
                                                                animateTarget: 'mb9',
                                                                icon: 'ext-mb-error'
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        }, {
                                            xtype: 'textfield',
                                            id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld3',
                                            name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld3',
                                            inputType: 'hidden'
                                        }]
                                    }]
                                }]
                            }]
                        }],
                    }],
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
            id: 'MitraJaya.view.Warehouse.Product.WinFormSparePart-Form-BtnSave',
            handler: function () {
            	var FormNya = Ext.getCmp('MitraJaya.view.Warehouse.Product.WinFormSparePart-Form').getForm();
                if (FormNya.isValid()) {
                    FormNya.submit({
                        url: m_api + '/v1/warehouse/sparepart/submit',
                        method:'POST',
                        params: {
                            OpsiDisplay: thisObj.viewVar.OpsiDisplay,
                            PartCategoryID: thisObj.viewVar.PartCategoryID,
                            ProductID: thisObj.viewVar.ProductID
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

                            Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData').getForm().load({
                                url: m_api + '/v1/warehouse/product/form_product',
                                method: 'GET',
                                params: {
                                    ProductID: o.result.ProductID
                                },
                                success: function (form, action) {
                                    Ext.MessageBox.hide();
                                    var r = Ext.decode(action.response.responseText);
                                    //Title
                                    // Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-labelInfoInsert').update('<div id="header_title_farmer">' + Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-ProductID').getValue() + ' - <strong>' + Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-SupplierName').getValue() + '</strong></div>');
                                    Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-labelInfoInsert').doLayout();
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
