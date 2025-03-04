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

Ext.define('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm', {
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm',
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
                    Ext.getCmp('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-BtnSave').setVisible(false);
                }

                //load formnya
                Ext.getCmp('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData').getForm().load({
                    url: m_api + '/v1/warehouse/pengeluaranbarang/form_pengeluaran_barang',
                    method: 'GET',
                    params: {
                        PengeluaranBarangID: this.viewVar.PengeluaranBarangID
                    },
                    success: function (form, action) {
                        Ext.MessageBox.hide();
                        var r = Ext.decode(action.response.responseText);
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
        thisObj.combo_toolkit = Ext.create('MitraJaya.store.General.ToolkitList');
        thisObj.combo_employee = Ext.create('MitraJaya.store.General.EmployeeList');
        thisObj.combo_rack_list = Ext.create('MitraJaya.store.General.RackList');

        //Panel Basic ==================================== (Begin)
        thisObj.ObjPanelBasicData = Ext.create('Ext.panel.Panel', {
            title: lang('Form Pengeluaran Barang'),
            frame: true,
            cls: 'Sfr_PanelLayoutForm',
            id: 'MitraJaya.view.Warehouse.PengeluaranBarang-FormGeneralData',
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
                        id: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData',
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
                                    id: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-PengeluaranBarangID',
                                    name: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-PengeluaranBarangID'
                                }, {
                                    xtype: 'radiogroup',
                                    fieldLabel: lang('Type'),
                                    msgTarget: 'side',
                                    labelWidth:180,
                                    allowBlank:false,
                                    labelAlign:'top',
                                    baseCls: 'Sfr_FormInputMandatory',
                                    columns: 2,
                                    items: [{
                                        boxLabel: lang('Toolkit'),
                                        name: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-Type',
                                        inputValue: 'toolkit',
                                        id: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-TypeToolkit',
                                        listeners: {
                                            change: function () {
												if(this.checked == true){
													Ext.getCmp('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-PartCode').setVisible(false);
													Ext.getCmp('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-ToolkitCode').setVisible(true);
												}else{
													Ext.getCmp('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-PartCode').setVisible(true);
													Ext.getCmp('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-ToolkitCode').setVisible(false);
												}
                                                return false;
                                            }
                                        }
                                    }, {
                                        boxLabel: lang('Product'),
                                        name: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-Type',
                                        inputValue: 'product',
                                        id: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-TypeProduct',
                                        listeners: {
                                            change: function () {
												if(this.checked == true){
													Ext.getCmp('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-PartCode').setVisible(true);
													Ext.getCmp('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-ToolkitCode').setVisible(false);
												}else{
													Ext.getCmp('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-PartCode').setVisible(false);
													Ext.getCmp('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-ToolkitCode').setVisible(true);
												}
                                                return false;
                                            }
                                        }
                                    }] 
                                }, {
                                    xtype: 'combobox',
									id:'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-PartCode',
									name:'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-PartCode',
									labelAlign:'top',
									fieldLabel:'Part Code',
                                    store:thisObj.combo_part_code,
                                    queryMode:'local',
                                    displayField:'label',
                                    valueField:'id',
                                    hidden: true
                                }, {
                                    xtype: 'combobox',
									id:'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-ToolkitCode',
									name:'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-ToolkitCode',
									labelAlign:'top',
									fieldLabel:'Toolkit',
                                    store:thisObj.combo_toolkit,
                                    queryMode:'local',
                                    displayField:'label',
                                    valueField:'id',
                                    hidden: true
                                }, {
                                    xtype: 'radiogroup',
                                    labelAlign:'top',
                                    fieldLabel: lang('Category'),
                                    msgTarget: 'side',
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory',
                                    columns: 2,
                                    items: [{
                                        boxLabel: lang('Peminjaman'),
                                        name: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-PartCategory',
                                        inputValue: 'peminjaman',
                                        id: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-PartCategoryPeminjaman',
                                        listeners: {
                                            
                                        }
                                    }, {
                                        boxLabel: lang('Barang Keluar'),
                                        name: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-PartCategory',
                                        inputValue: 'barangkeluar',
                                        id: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-PartCategoryBarangKeluar',
                                        listeners: {
                                            
                                        }
                                    }]
                                }, {
                                    xtype: 'datefield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-TanggalPengeluaran',
                                    name: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-TanggalPengeluaran',
                                    fieldLabel: lang('Tanggal Pengeluaran'),
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory',
                                    format: 'Y-m-d',
                                }, {
                                    xtype: 'combobox',
									id:'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-PjCode',
									name:'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-PjCode',
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
                                    id: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-DocNo',
                                    name: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-DocNo',
                                    fieldLabel: lang('Document No'),
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'
                                }, {
                                    xtype: 'numberfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-Qty',
                                    name: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-Qty',
                                    fieldLabel: lang('Qty'),
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'
                                }, {
                                    xtype: 'combobox',
									id:'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-RakNumber',
									name:'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-RakNumber',
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
                                    id: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-RowNumber',
                                    name: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-RowNumber',
                                    fieldLabel: lang('Baris No'),
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-ColumnNumber',
                                    name: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-ColumnNumber',
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
                            id: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData-BtnSave',
                            handler: function () {
                                var Formnya = Ext.getCmp('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-FormBasicData').getForm();

                                if (Formnya.isValid()) {
                                    Formnya.submit({
                                        url: m_api + '/v1/warehouse/pengeluaranbarang/submit_pengeluaran_barang',
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
													Ext.getCmp('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm').destroy(); //destory current view
													var MainForm = [];
													if (Ext.getCmp('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm') == undefined) {
														MainForm = Ext.create('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																PengeluaranBarangID: o.result.PengeluaranBarangID
															}
														});
													} else {
														Ext.getCmp('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm').destroy();
														MainForm = Ext.create('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																PengeluaranBarangID: o.result.PengeluaranBarangID
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
                id: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-labelInfoInsert',
                html: '<div id="header_title_farmer">' + lang('Pengeluaran Barang Data') + '</div>'
            }]
        }, {
            items: [{
                id: 'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm-LinkBackToList',
                html: '<div id="Sfr_IdBoxInfoDataGrid" class="Sfr_BoxInfoDataGridForm"><ul class="Sft_UlListInfoDataGrid">'
				+'<li class="Sft_ListInfoDataGrid"><a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.PengeluaranBarang.MainForm\').BackToList()">'
				+'<img class="Sft_ListIconInfoDataGrid" src="' + varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/circle-chevron-left.svg" width="20" />&nbsp;&nbsp;' + lang('Back to Pengeluaran Barang List') + '</a></li></div>'
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
        Ext.getCmp('MitraJaya.view.Warehouse.PengeluaranBarang.MainForm').destroy(); //destory current view
        var GridMainGrower = [];
        if (Ext.getCmp('MitraJaya.view.Warehouse.PengeluaranBarang.MainGrid') == undefined) {
            GridMainGrower = Ext.create('MitraJaya.view.Warehouse.PengeluaranBarang.MainGrid');
        } else {
            //destroy, create ulang
            Ext.getCmp('MitraJaya.view.Warehouse.PengeluaranBarang.MainGrid').destroy();
            GridMainGrower = Ext.create('MitraJaya.view.Warehouse.PengeluaranBarang.MainGrid');
        }
    }
});
