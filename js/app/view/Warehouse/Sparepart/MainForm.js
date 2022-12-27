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
                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-Photo').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/files/sparepart/' + r.data.FilePath + '\')"><img src="' + m_api_base_url + '/files/sparepart/' + r.data.FilePath + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
						    Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld').setValue(r.data.FilePath);
                        }

                        if (r.data.FilePath2 != '') {
                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-Photo2').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/files/sparepart/' + r.data.FilePath + '\')"><img src="' + m_api_base_url + '/files/sparepart/' + r.data.FilePath + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
						    Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld2').setValue(r.data.FilePath);
                        }

                        if (r.data.FilePath3 != '') {
                            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-Photo3').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Sparepart.MainForm\').ZoomImage(\'' + m_api_base_url + '/files/sparepart/' + r.data.FilePath + '\')"><img src="' + m_api_base_url + '/files/sparepart/' + r.data.FilePath + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
						    Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PhotoOld3').setValue(r.data.FilePath);
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

        thisObj.combo_part_code = Ext.create('MitraJaya.store.General.PartCodeList');
        thisObj.combo_employee = Ext.create('MitraJaya.store.General.EmployeeList');
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
                    columnWidth: 0.3,
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
                                columnWidth: 1,
                                layout: 'form',
                                style: 'padding:10px 0px 10px 5px;',
                                items: [{
                                    xtype: 'textfield',
                                    inputType: 'hidden',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartID',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-SparepartID'
                                }, {
                                    xtype: 'combobox',
									id:'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PartCode',
									name:'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PartCode',
									labelAlign:'top',
									fieldLabel:'Part Code',
									allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory',
                                    store:thisObj.combo_part_code,
                                    queryMode:'local',
                                    displayField:'label',
                                    valueField:'id',
                                }, {
                                    xtype: 'radiogroup',
                                    labelAlign:'top',
                                    fieldLabel: lang('Category'),
                                    msgTarget: 'side',
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory',
                                    columns: 2,
                                    items: [{
                                        boxLabel: lang('Pembelian'),
                                        name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PartCategory',
                                        inputValue: 'pembelian',
                                        id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PartCategoryPembelian',
                                        listeners: {
                                            
                                        }
                                    }, {
                                        boxLabel: lang('Pengembalian'),
                                        name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PartCategory',
                                        inputValue: 'pengembalian',
                                        id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PartCategoryPengembalian',
                                        listeners: {
                                            
                                        }
                                    }]
                                }, {
                                    xtype: 'datefield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-TanggalPenerimaan',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-TanggalPenerimaan',
                                    fieldLabel: lang('Tanggal Penerimaan'),
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory',
                                    format: 'Y-m-d',
                                },  {
                                    xtype: 'combobox',
									id:'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PjCode',
									name:'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-PjCode',
									labelAlign:'top',
									fieldLabel:'Penanggung Jawab',
									allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory',
                                    store:thisObj.combo_employee,
                                    queryMode:'local',
                                    displayField:'label',
                                    valueField:'id',
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-DocNo',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-DocNo',
                                    fieldLabel: lang('Document No'),
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'
                                }, {
                                    xtype: 'numberfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-Qty',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-Qty',
                                    fieldLabel: lang('Qty'),
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'
                                }, {
                                    xtype: 'combobox',
									id:'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-RakNumber',
									name:'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-RakNumber',
									labelAlign:'top',
									fieldLabel:'Rak No',
									allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory',
                                    store:thisObj.combo_rack_list,
                                    queryMode:'local',
                                    displayField:'label',
                                    valueField:'id',
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-RowNumber',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-RowNumber',
                                    fieldLabel: lang('Baris No'),
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-ColumnNumber',
                                    name: 'MitraJaya.view.Warehouse.Sparepart.MainForm-FormBasicData-ColumnNumber',
                                    fieldLabel: lang('Kolom No'),
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'
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
                                        waitMsg: 'Saving data invoice...',
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
        if (Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainGrid') == undefined) {
            GridMainGrower = Ext.create('MitraJaya.view.Warehouse.Sparepart.MainGrid');
        } else {
            //destroy, create ulang
            Ext.getCmp('MitraJaya.view.Warehouse.Sparepart.MainGrid').destroy();
            GridMainGrower = Ext.create('MitraJaya.view.Warehouse.Sparepart.MainGrid');
        }
    }
});
