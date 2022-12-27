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

Ext.define('MitraJaya.view.Warehouse.Toolkit.MainForm', {
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Warehouse.Toolkit.MainForm',
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
                    Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainForm-FormBasicData-BtnSave').setVisible(false);
                }

                //load formnya
                Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainForm-FormBasicData').getForm().load({
                    url: m_api + '/v1/warehouse/toolkit/form_toolkit',
                    method: 'GET',
                    params: {
                        ToolkitID: this.viewVar.ToolkitID
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

        //Panel Basic ==================================== (Begin)
        thisObj.ObjPanelBasicData = Ext.create('Ext.panel.Panel', {
            title: lang('Form Toolkit'),
            frame: true,
            cls: 'Sfr_PanelLayoutForm',
            id: 'MitraJaya.view.Warehouse.Toolkit-FormGeneralData',
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
                        id: 'MitraJaya.view.Warehouse.Toolkit.MainForm-FormBasicData',
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
                                    id: 'MitraJaya.view.Warehouse.Toolkit.MainForm-FormBasicData-ToolkitID',
                                    name: 'MitraJaya.view.Warehouse.Toolkit.MainForm-FormBasicData-ToolkitID'
                                },, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Toolkit.MainForm-FormBasicData-ToolkitCode',
                                    name: 'MitraJaya.view.Warehouse.Toolkit.MainForm-FormBasicData-ToolkitCode',
                                    fieldLabel: lang('Toolkit Code'),
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Toolkit.MainForm-FormBasicData-TookitName',
                                    name: 'MitraJaya.view.Warehouse.Toolkit.MainForm-FormBasicData-TookitName',
                                    fieldLabel: lang('Toolkit Name'),
                                    allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'
                                }, {
                                    xtype: 'numberfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Toolkit.MainForm-FormBasicData-ToolkitQty',
                                    name: 'MitraJaya.view.Warehouse.Toolkit.MainForm-FormBasicData-ToolkitQty',
                                    fieldLabel: lang('Toolkit Qty'),
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
                            id: 'MitraJaya.view.Warehouse.Toolkit.MainForm-FormBasicData-BtnSave',
                            handler: function () {
                                var Formnya = Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainForm-FormBasicData').getForm();

                                if (Formnya.isValid()) {
                                    Formnya.submit({
                                        url: m_api + '/v1/warehouse/toolkit/submit_toolkit',
                                        method: 'POST',
                                        waitMsg: 'Saving data toolkit...',
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
													Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainForm').destroy(); //destory current view
													var MainForm = [];
													if (Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainForm') == undefined) {
														MainForm = Ext.create('MitraJaya.view.Warehouse.Toolkit.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																ToolkitID: o.result.ToolkitID
															}
														});
													} else {
														Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainForm').destroy();
														MainForm = Ext.create('MitraJaya.view.Warehouse.Toolkit.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																ToolkitID: o.result.ToolkitID
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
                id: 'MitraJaya.view.Warehouse.Toolkit.MainForm-labelInfoInsert',
                html: '<div id="header_title_farmer">' + lang('Tookit Data') + '</div>'
            }]
        }, {
            items: [{
                id: 'MitraJaya.view.Warehouse.Toolkit.MainForm-LinkBackToList',
                html: '<div id="Sfr_IdBoxInfoDataGrid" class="Sfr_BoxInfoDataGridForm"><ul class="Sft_UlListInfoDataGrid">'
				+'<li class="Sft_ListInfoDataGrid"><a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Toolkit.MainForm\').BackToList()">'
				+'<img class="Sft_ListIconInfoDataGrid" src="' + varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/circle-chevron-left.svg" width="20" />&nbsp;&nbsp;' + lang('Back to Toolkit List') + '</a></li></div>'
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
        Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainForm').destroy(); //destory current view
        var GridMainGrower = [];
        if (Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid') == undefined) {
            GridMainGrower = Ext.create('MitraJaya.view.Warehouse.Toolkit.MainGrid');
        } else {
            //destroy, create ulang
            Ext.getCmp('MitraJaya.view.Warehouse.Toolkit.MainGrid').destroy();
            GridMainGrower = Ext.create('MitraJaya.view.Warehouse.Toolkit.MainGrid');
        }
    }
});
