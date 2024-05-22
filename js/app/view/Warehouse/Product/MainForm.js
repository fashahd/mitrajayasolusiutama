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

Ext.define('MitraJaya.view.Warehouse.Product.MainForm', {
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Warehouse.Product.MainForm',
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


            Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData').getForm().load({
				url: m_api + '/v1/warehouse/product/form_product',
				method: 'GET',
				params: {
					ProductID: this.viewVar.ProductID
				},
				success: function (form, action) {
					Ext.MessageBox.hide();
					var r = Ext.decode(action.response.responseText);

					if(r.data.FilePath != ''){
						
						Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-Photo').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Product.MainForm\').ZoomImage(\'' + m_api_base_url + '/files/product/' + r.data.FilePath + '\')"><img src="' + m_api_base_url + '/files/product/' + r.data.FilePath + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
						Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-PhotoOld').setValue(r.data.FilePath);
					}

                    if(r.data.FilePath2 != ''){
						
						Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-Photo2').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Product.MainForm\').ZoomImage(\'' + m_api_base_url + '/files/product/' + r.data.FilePath2 + '\')"><img src="' + m_api_base_url + '/files/product/' + r.data.FilePath2 + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
						Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-PhotoOld2').setValue(r.data.FilePath2);
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
            
            //Isi nilai default

            if (thisObj.viewVar.OpsiDisplay == 'insert') {
				
				
            }

            if (thisObj.viewVar.OpsiDisplay == 'view' || thisObj.viewVar.OpsiDisplay == 'update') {
                //default
                if (thisObj.viewVar.OpsiDisplay == 'view') {
                    Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-BtnSave').setVisible(false);
                }

                //load formnya
                Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData').getForm().load({
                    url: m_api + '/v1/warehouse/product/form_product',
                    method: 'GET',
                    params: {
                        ProductID: this.viewVar.ProductID
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

        thisObj.combo_brand = Ext.create('MitraJaya.store.General.BrandList');

        //Panel Basic ==================================== (Begin)
        thisObj.ObjPanelBasicData = Ext.create('Ext.panel.Panel', {
            title: 'Form Product',
            frame: true,
            cls: 'Sfr_PanelLayoutForm',
            id: 'MitraJaya.view.Warehouse.Product-FormGeneralData',
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
                        id: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData',
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
                                    id: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-ProductID',
                                    name: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-ProductID'
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-ProductCode',
                                    name: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-ProductCode',
                                    fieldLabel: 'Product Code',
                                    allowBlank: false,
                                    baseCls: 'Sfr_FormInputMandatory',
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-ProductName',
                                    name: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-ProductName',
                                    fieldLabel: 'Product Name',
                                    allowBlank: false,
                                    baseCls: 'Sfr_FormInputMandatory',
                                }, {
                                    xtype: 'combobox',
                                    id: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-ProductBrand',
                                    name: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-ProductBrand',
                                    labelAlign:'top',
                                    fieldLabel:'Product Brand',
                                    store:thisObj.combo_brand,
                                    queryMode:'local',
                                    displayField:'label',
                                    valueField:'id',
                                    allowBlank: false,
                                    baseCls: 'Sfr_FormInputMandatory',
                                }]
                            }, {
                                columnWidth: 0.5,
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
                                            id: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-Photo2',
                                            html: '<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Product.MainForm\').ZoomImage(\'' + m_api_base_url + '/assets/images/no_data.png' +'\')"><img src="' + m_api_base_url + '/assets/images/no_data.png" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>'
                                        }, {
                                            xtype: 'fileuploadfield',
                                            id: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-PhotoInput2',
                                            name: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-PhotoInput2',
                                            buttonText: 'Browse',
                                            cls: 'Sfr_FormBrowseBtn',
                                            listeners: {
                                                'change': function (fb, v) {
                                                    Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData').getForm().submit({
                                                        url: m_api + '/v1/warehouse/product/upload2',
                                                        clientValidation: false,
                                                        params: {
                                                            OpsiDisplay: thisObj.viewVar.OpsiDisplay
                                                        },
                                                        waitMsg: 'Sending Photo...',
                                                        success: function (fp, o) {
                                                            Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-Photo2').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Product.MainForm\').ZoomImage(\'' + m_api_base_url + '/files/product/' + o.result.file + '\')"><img src="' + m_api_base_url + '/files/product/' + o.result.file + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
                                                            Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-PhotoOld2').setValue(o.result.file);
                                                        },
                                                        failure: function (fp, o) {
                                                            Ext.MessageBox.show({
                                                                title: 'Error',
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
                                            id: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-PhotoOld2',
                                            name: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-PhotoOld2',
                                            inputType: 'hidden'
                                        }]
                                    }]
                                }]
                            }, {
                                columnWidth: 0.5,
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
                                            id: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-Photo',
                                            html: '<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Product.MainForm\').ZoomImage(\'' + m_api_base_url + '/assets/images/no_data.png' +'\')"><img src="' + m_api_base_url + '/assets/images/no_data.png" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>'
                                        }, {
                                            xtype: 'fileuploadfield',
                                            id: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-PhotoInput',
                                            name: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-PhotoInput',
                                            buttonText: 'Browse',
                                            cls: 'Sfr_FormBrowseBtn',
                                            listeners: {
                                                'change': function (fb, v) {
                                                    Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData').getForm().submit({
                                                        url: m_api + '/v1/warehouse/product/upload',
                                                        clientValidation: false,
                                                        params: {
                                                            OpsiDisplay: thisObj.viewVar.OpsiDisplay
                                                        },
                                                        waitMsg: 'Sending Photo...',
                                                        success: function (fp, o) {
                                                            Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-Photo').update('<a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Product.MainForm\').ZoomImage(\'' + m_api_base_url + '/files/product/' + o.result.file + '\')"><img src="' + m_api_base_url + '/files/product/' + o.result.file + '" style="height:300px;margin:0px 5px 5px 0px;float:left;" /></a>');
                                                            Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-PhotoOld').setValue(o.result.file);
                                                        },
                                                        failure: function (fp, o) {
                                                            Ext.MessageBox.show({
                                                                title: 'Error',
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
                                            id: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-PhotoOld',
                                            name: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-PhotoOld',
                                            inputType: 'hidden'
                                        }]
                                    }]
                                }]
                            }]
                        }],
                        buttons: [{
                            xtype: 'button',
                            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
                            text: 'Save',
                            cls: 'Sfr_BtnFormBlue',
                            overCls: 'Sfr_BtnFormBlue-Hover',
                            id: 'MitraJaya.view.Warehouse.Product.MainForm-FormBasicData-BtnSave',
                            handler: function () {
                                var Formnya = Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm-FormBasicData').getForm();

                                if (Formnya.isValid()) {
                                    Formnya.submit({
                                        url: m_api + '/v1/warehouse/product/submit',
                                        method: 'POST',
                                        waitMsg: 'Saving data product...',
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
													Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm').destroy(); //destory current view
													var MainForm = [];
													if (Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm') == undefined) {
														MainForm = Ext.create('MitraJaya.view.Warehouse.Product.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																ProductID: o.result.ProductID
															}
														});
													} else {
														Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm').destroy();
														MainForm = Ext.create('MitraJaya.view.Warehouse.Product.MainForm', {
															viewVar: {
																OpsiDisplay: 'update',
																ProductID: o.result.ProductID
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

        var ObjPanelGridPart = [];
        var ObjPanelGridSparepart = [];

        if (thisObj.viewVar.OpsiDisplay == 'view' || thisObj.viewVar.OpsiDisplay == 'update') {
            thisObj.ObjPanelGridPart = Ext.create('MitraJaya.view.Warehouse.Product.GridPart', {
                viewVar: {
                    ProductID: thisObj.viewVar.ProductID
                }
            });
            ObjPanelGridPart.push(thisObj.ObjPanelGridPart);
        }

        if (thisObj.viewVar.OpsiDisplay == 'view' || thisObj.viewVar.OpsiDisplay == 'update') {
            thisObj.ObjPanelGridSparepart = Ext.create('MitraJaya.view.Warehouse.Sparepart.MainGrid', {
                viewVar: {
                    ProductID: thisObj.viewVar.ProductID
                }
            });
            ObjPanelGridSparepart.push(thisObj.ObjPanelGridSparepart);
        }

        //============================= End DQ =========================================//

        //========================================================== LAYOUT UTAMA (Begin) ========================================//
        thisObj.items = [{
            xtype: 'panel',
            border: false,
            layout: {
                type: 'hbox'
            },
            items: [{
                id: 'MitraJaya.view.Warehouse.Product.MainForm-labelInfoInsert',
                html: '<div id="header_title_farmer">' + 'Product Data' + '</div>'
            }]
        }, {
            items: [{
                id: 'MitraJaya.view.Warehouse.Product.MainForm-LinkBackToList',
                html: '<div id="Sfr_IdBoxInfoDataGrid" class="Sfr_BoxInfoDataGridForm"><ul class="Sft_UlListInfoDataGrid">'
				+'<li class="Sft_ListInfoDataGrid"><a href="javascript:Ext.getCmp(\'MitraJaya.view.Warehouse.Product.MainForm\').BackToList()">'
				+'<img class="Sft_ListIconInfoDataGrid" src="' + varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/circle-chevron-left.svg" width="20" />&nbsp;&nbsp;' + 'Back to Product List' + '</a></li></div>'
            }]
        }, {
            html: '<br />'
        }, {
            layout: 'column',
            border: false,
            items: [{
                //LEFT CONTENT
                columnWidth: 0.5,
                items: [
                    thisObj.ObjPanelBasicData
                ]
            },{
				columnWidth: 0.5,
				layout: 'form',
				style: 'padding:10px 0px 10px 5px;',
				items: ObjPanelGridPart
			},{
				columnWidth: 1,
				layout: 'form',
				items: ObjPanelGridSparepart
			}]
        }];
        //========================================================== LAYOUT UTAMA (END) ========================================//

        this.callParent(arguments);
    },
    BackToList: function () {
        Ext.getCmp('MitraJaya.view.Warehouse.Product.MainForm').destroy(); //destory current view
        var GridMainGrower = [];
        if (Ext.getCmp('MitraJaya.view.Warehouse.Product.MainGrid') == undefined) {
            GridMainGrower = Ext.create('MitraJaya.view.Warehouse.Product.MainGrid');
        } else {
            //destroy, create ulang
            Ext.getCmp('MitraJaya.view.Warehouse.Product.MainGrid').destroy();
            GridMainGrower = Ext.create('MitraJaya.view.Warehouse.Product.MainGrid');
        }
    },
    ZoomImage:function(val){
		Swal.fire({
			imageUrl: val,
			imageWidth: 1280,
			imageAlt: 'A tall image'
		  })
	}
});
