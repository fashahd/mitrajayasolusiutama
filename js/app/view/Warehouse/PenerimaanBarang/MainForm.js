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

Ext.define('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm', {
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm',
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
                    Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-BtnSave').setVisible(false);
                }

                //load formnya
                Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData').getForm().load({
                    url: m_api + '/v1/warehouse/penerimaanbarang/form_penerimaan_barang',
                    method: 'GET',
                    params: {
                        PenerimaanBarangID: this.viewVar.PenerimaanBarangID
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
            title: 'Form Penerimaan Barang',
            frame: true,
            cls: 'Sfr_PanelLayoutForm',
            id: 'MitraJaya.view.Warehouse.PenerimaanBarang-FormGeneralData',
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
                        id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData',
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
                                    id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-PenerimaanBarangID',
                                    name: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-PenerimaanBarangID'
                                }, {
                                    xtype: 'radiogroup',
                                    fieldLabel: 'Type',
                                    msgTarget: 'side',
                                    labelWidth:180,
                                    allowBlank:false,
                                    labelAlign:'top',
                                    baseCls: 'Sfr_FormInputMandatory',
                                    columns: 2,
                                    items: [{
                                        boxLabel: 'Toolkit',
                                        name: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-Type',
                                        inputValue: 'toolkit',
                                        id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-TypeToolkit',
                                        listeners: {
                                            change: function () {
												if(this.checked == true){
													Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-PartCode').setVisible(false);
													Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-ToolkitCode').setVisible(true);
												}else{
													Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-PartCode').setVisible(true);
													Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-ToolkitCode').setVisible(false);
												}
                                                return false;
                                            }
                                        }
                                    }, {
                                        boxLabel: 'Product',
                                        name: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-Type',
                                        inputValue: 'product',
                                        id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-TypeProduct',
                                        listeners: {
                                            change: function () {
												if(this.checked == true){
													Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-PartCode').setVisible(true);
													Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-ToolkitCode').setVisible(false);
												}else{
													Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-PartCode').setVisible(false);
													Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-ToolkitCode').setVisible(true);
												}
                                                return false;
                                            }
                                        }
                                    }] 
                                }, {
                                    xtype: 'combobox',
									id:'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-PartCode',
									name:'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-PartCode',
									labelAlign:'top',
									fieldLabel:'Part Code',
                                    store:thisObj.combo_part_code,
                                    queryMode:'local',
                                    displayField:'label',
                                    valueField:'id',
                                    hidden: true
                                }, {
                                    xtype: 'combobox',
									id:'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-ToolkitCode',
									name:'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-ToolkitCode',
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
                                    fieldLabel: 'Category',
                                    msgTarget: 'side',
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory',
                                    columns: 2,
                                    items: [{
                                        boxLabel: 'Pembelian',
                                        name: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-PartCategory',
                                        inputValue: 'pembelian',
                                        id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-PartCategoryPembelian',
                                        listeners: {
                                            
                                        }
                                    }, {
                                        boxLabel: 'Pengembalian',
                                        name: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-PartCategory',
                                        inputValue: 'pengembalian',
                                        id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-PartCategoryPengembalian',
                                        listeners: {
                                            
                                        }
                                    }]
                                }, {
                                    xtype: 'datefield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-TanggalPenerimaan',
                                    name: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-TanggalPenerimaan',
                                    fieldLabel: 'Tanggal Penerimaan',
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory',
                                    format: 'Y-m-d',
                                },  {
                                    xtype: 'combobox',
									id:'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-PjCode',
									name:'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-PjCode',
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
                                    id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-DocNo',
                                    name: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-DocNo',
                                    fieldLabel: 'Document No',
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'
                                }, {
                                    xtype: 'numberfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-Qty',
                                    name: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-Qty',
                                    fieldLabel: 'Qty',
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'
                                }, {
                                    xtype: 'combobox',
									id:'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-RakNumber',
									name:'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-RakNumber',
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
                                    id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-RowNumber',
                                    name: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-RowNumber',
                                    fieldLabel: 'Baris No',
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-ColumnNumber',
                                    name: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-ColumnNumber',
                                    fieldLabel: 'Kolom No',
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'
                                }]
                            }]
                        }],
                        buttons: [{
                            xtype: 'button',
                            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
                            text: 'Save',
                            cls: 'Sfr_BtnFormBlue',
                            overCls: 'Sfr_BtnFormBlue-Hover',
                            id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData-BtnSave',
                            handler: function () {
                                var Formnya = Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-FormBasicData').getForm();

                                if (Formnya.isValid()) {
                                    Formnya.submit({
                                        url: m_api + '/v1/warehouse/penerimaanbarang/submit_penerimaan_barang',
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
													Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm').destroy(); //destory current view
													var MainForm = [];
													if (Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm') == undefined) {
														MainForm = Ext.create('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																PenerimaanBarangID: o.result.PenerimaanBarangID
															}
														});
													} else {
														Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm').destroy();
														MainForm = Ext.create('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																PenerimaanBarangID: o.result.PenerimaanBarangID
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
                id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-labelInfoInsert',
                html: '<div id="header_title_farmer">' + 'Penerimaan Barang Data' + '</div>'
            }]
        }, {
            items: [{
                id: 'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm-LinkBackToList',
                html: '<div id="Sfr_IdBoxInfoDataGrid" class="Sfr_BoxInfoDataGridForm"><ul class="Sft_UlListInfoDataGrid">'
				+'<li class="Sft_ListInfoDataGrid"><a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.PenerimaanBarang.MainForm\').BackToList()">'
				+'<img class="Sft_ListIconInfoDataGrid" src="' + varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/circle-chevron-left.svg" width="20" />&nbsp;&nbsp;' + 'Back to Penerimaan Barang List' + '</a></li></div>'
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
        Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainForm').destroy(); //destory current view
        var GridMainGrower = [];
        if (Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid') == undefined) {
            GridMainGrower = Ext.create('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid');
        } else {
            //destroy, create ulang
            Ext.getCmp('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid').destroy();
            GridMainGrower = Ext.create('MitraJaya.view.Warehouse.PenerimaanBarang.MainGrid');
        }
    }
});
