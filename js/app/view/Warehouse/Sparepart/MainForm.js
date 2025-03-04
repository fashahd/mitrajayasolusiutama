/******************************************
 *  Author : fashahd@gmail.com.com
 *  Created On : Mon Jan 20 2020
 *  File : MainForm.js
 *******************************************/
/*
    Param2 yg diperlukan ketika load View ini
    - OpsiDisplay
    - SupplierID
    - PanelDisplayID
*/

Ext.define('MitraJaya.view.Warehouse.Sparepart.MainForm', {
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm',
    style: 'padding:0 15px 15px 15px;margin:5px 0 0 0;',
    viewVar: false,
    setViewVar: function (value) {
        this.viewVar = value;
    },
    renderTo: 'ext-content',
    listeners: {
        afterRender: function () {
            var thisObj = this;
            document.getElementById('ContentTopBar').style.display = 'none';
            
            //Isi nilai default

            if (thisObj.viewVar.OpsiDisplay == 'insert') {
				
				
            }

            if (thisObj.viewVar.OpsiDisplay == 'view' || thisObj.viewVar.OpsiDisplay == 'update') {
                //default
                if (thisObj.viewVar.OpsiDisplay == 'view') {
                    Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-BtnSave').setVisible(false);
                }

                //load formnya
                Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData').getForm().load({
                    url: m_api + '/v1/warehouse/sparepart/form_sparepart',
                    method: 'GET',
                    params: {
                        SparepartID: this.viewVar.SparepartID
                    },
                    success: function (form, action) { 
                        Ext.MessageBox.hide();
                        var r = Ext.decode(action.response.responseText);

                        if (r.data.FilePath != '') {
                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-Photo').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/' + r.data.FilePath + '\')"><img src="' + m_api_base_url + '/' + r.data.FilePath + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
						    Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld').setValue(r.data.FilePath);
                        }

                        if (r.data.FilePath2 != '') {
                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-Photo2').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/' + r.data.FilePath2 + '\')"><img src="' + m_api_base_url + '/' + r.data.FilePath2 + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
						    Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld2').setValue(r.data.FilePath2);
                        }

                        if (r.data.FilePath3 != '') {
                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-Photo3').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/' + r.data.FilePath3 + '\')"><img src="' + m_api_base_url + '/' + r.data.FilePath3 + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
						    Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld3').setValue(r.data.FilePath3);
                        }
                    },
                    failure: function (form, action) {
                        Swal.fire({
							icon: 'error',
							text: 'Failed to Retreive Data',
						})
                    }
                });

            }
        },
        beforerender: function () {
            var thisObj = this;

            if (thisObj.viewVar.OpsiDisplay != 'insert') {
                Ext.MessageBox.show({
                    msg: 'Please wait...',
                    progressText: 'Loading...',
                    width: 300,
                    wait: true,
                    waitConfig: {
                        interval: 200
                    },
                    icon: 'ext-mb-info', //custom class in msg-box.html
                    animateTarget: 'mb9'
                });
            }
        }
    },
    initComponent: function () {
        var thisObj = this;

        
        thisObj.combo_product = Ext.create('MitraJaya.store.General.ProductList');
        thisObj.combo_rack_list = Ext.create('MitraJaya.store.General.RackList');

        //Panel Basic ==================================== (Begin)
        thisObj.ObjPanelBasicData = Ext.create('Ext.panel.Panel', {
            title: lang('Form Sparepart'),
            frame: true,
            cls: 'Sfr_PanelLayoutForm',
            id: 'MitraJaya.view.Warehouse.Sparepart-FormGeneralData',
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
                                    xtype: 'combobox',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-ProductID',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-ProductID',
                                    labelAlign:'top',
                                    fieldLabel:'Sparepart Code',
                                    store:thisObj.combo_product,
                                    queryMode:'local',
                                    displayField:'label',
                                    valueField:'id',
                                    allowBlank: false,
                                    baseCls: 'Sfr_FormInputMandatory',
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
                                style: 'padding:10px 0px 10px 15px;',
                                items: [{
                                    xtype: 'numberfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartQty',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartQty',
                                    fieldLabel: lang('Base Qty')
                                }, {
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
                        buttons: [{
                            xtype: 'button',
                            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
                            text: lang('Save'),
                            cls: 'Sfr_BtnFormBlue',
                            overCls: 'Sfr_BtnFormBlue-Hover',
                            id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-BtnSave',
                            handler: function () {
                                var Formnya = Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData').getForm();

                                if (Formnya.isValid()) {
                                    Formnya.submit({
                                        url: m_api + '/v1/warehouse/sparepart/submit_sparepart',
                                        method: 'POST',
                                        waitMsg: 'Saving Data Sparepart...',
                                        params: {
                                            OpsiDisplay: thisObj.viewVar.OpsiDisplay
                                        },
                                        success: function (fp, o) {
											Swal.fire({
												text: "Data saved",
												icon: 'success',
												confirmButtonColor: '#3085d6',
											}).then((result) => {
												if (result.isConfirmed) {
													Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm').destroy(); //destory current view
													var MainForm = [];
													if (Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm') == undefined) {
														MainForm = Ext.create('MitraJaya.view.Warehouse.Sparepart.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																SparepartID: o.result.SparepartID
															}
														});
													} else {
														Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm').destroy();
														MainForm = Ext.create('MitraJaya.view.Warehouse.Sparepart.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																SparepartID: o.result.SparepartID
															}
														});
													}
												}
											})
                                        },
                                        failure: function (fp, o) {
                                            try {
                                                var r = Ext.decode(o.response.responseText);
                                                Swal.fire({
													icon: 'error',
													text: r.message,
												})
                                            } catch (err) {

                                                Swal.fire({
													icon: 'error',
													text: 'Connection Error',
												})
                                            }
                                        }
                                    });
                                } else {
                                    Swal.fire({
										icon: 'warning',
										text: 'Form not complete yet',
									})
                                }
                            }
                        }]
                    }],
                }]
            }]
        });
        //Panel Basic ==================================== (End)

        //============================= End DQ =========================================//

        //========================================================== LAYOUT UTAMA (Begin) ========================================//
        thisObj.items = [{
            xtype: 'panel',
            border: false,
            layout: {
                type: 'hbox'
            },
            items: [{
                id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-labelInfoInsert',
                html: '<div id="header_title_farmer">' + lang('Sparepart Data') + '</div>'
            }]
        }, {
            items: [{
                id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-LinkBackToList',
                html: '<div id="Sfr_IdBoxInfoDataGrid" class="Sfr_BoxInfoDataGridForm"><ul class="Sft_UlListInfoDataGrid">'
				+'<li class="Sft_ListInfoDataGrid"><a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').BackToList()">'
				+'<img class="Sft_ListIconInfoDataGrid" src="' + varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/circle-chevron-left.svg" width="20" />&nbsp;&nbsp;' + lang('Back to Sparepart List') + '</a></li></div>'
            }]
        }, {
            html: '<br />'
        }, {
            layout: 'column',
            border: false,
            items: [{
                //LEFT CONTENT
                columnWidth: 1,
                items: [
                    thisObj.ObjPanelBasicData
                ]
            }]
        }];
        //========================================================== LAYOUT UTAMA (END) ========================================//

        this.callParent(arguments);
    },
    BackToList: function () {
        Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm').destroy(); //destory current view
        var GridMainGrower = [];
        if (Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.GridMain') == undefined) {
            GridMainGrower = Ext.create('MitraJaya.view.Warehouse.Sparepart.GridMain');
        } else {
            //destroy, create ulang
            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.GridMain').destroy();
            GridMainGrower = Ext.create('MitraJaya.view.Warehouse.Sparepart.GridMain');
        }
    }
});
