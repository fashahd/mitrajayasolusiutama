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

Ext.define('MitraJaya.view.Warehouse.Product.WinFormPart' ,{
    extend: 'Ext.window.Window',
    id: 'MitraJaya.view.Warehouse.Product.WinFormPart',
    cls: 'Sfr_LayoutPopupWindows',
    title:lang('Actual Location Form'),
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
            var FormNya = Ext.getCmp('MitraJaya.view.Warehouse.Product.WinFormPart-Form');
            FormNya.getForm().reset();



            if(thisObj.viewVar.OpsiDisplay == 'insert'){
                Ext.getCmp('MitraJaya.view.Warehouse.Product.WinFormPart-Form-PartCategoryCode').setValue(thisObj.viewVar.Code)
            }

            if(thisObj.viewVar.OpsiDisplay == 'update' || thisObj.viewVar.OpsiDisplay == 'view'){
                if(thisObj.viewVar.OpsiDisplay == 'view') {
                    Ext.getCmp('MitraJaya.view.Warehouse.Product.WinFormPart-Form-BtnSave').setVisible(false);
                }

                FormNya.getForm().load({
                    url: m_api + '/v1/warehouse/product/form_part',
                    method: 'GET',
                    params: {
                        PartCategoryID: thisObj.viewVar.PartCategoryID
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

            // Ext.getCmp('MitraJaya.view.Warehouse.Product.WinFormProduct').initMap('map-picker-plot', Ext.getCmp('MitraJaya.view.Warehouse.Product.WinFormProduct-Form-Latitude').getValue(), Ext.getCmp('MitraJaya.view.Warehouse.Product.WinFormProduct-Form-Longitude').getValue());
        }
    },
    initComponent: function() {
        var thisObj = this;
        let labelWidth = 150;


        //items -------------------------------------------------------------- (begin)
        thisObj.items = [{
        	xtype: 'form',
            id: 'MitraJaya.view.Warehouse.Product.WinFormPart-Form',
            padding:'5 25 5 8',
            items:[{
                layout: 'column',
                border: false,
                items:[{
                    columnWidth: 1,
                    layout:'form',
                    items:[{
                    	xtype: 'textfield',
                        id: 'MitraJaya.view.Warehouse.Product.WinFormPart-Form-PartCategoryCode',
                        name: 'MitraJaya.view.Warehouse.Product.WinFormPart-Form-PartCategoryCode',
                        fieldLabel: lang('Part Code'),
                        labelAlign: "top",
                        readOnly:true,
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                    }, {
                    	xtype: 'numberfield',
                        id: 'MitraJaya.view.Warehouse.Product.WinFormPart-Form-StartRangePartCode',
                        name: 'MitraJaya.view.Warehouse.Product.WinFormPart-Form-StartRangePartCode',
                        fieldLabel: lang('Start Range'),
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                    },
                    {
                    	xtype: 'numberfield',
                        id: 'MitraJaya.view.Warehouse.Product.WinFormPart-Form-EndRangePartCode',
                        name: 'MitraJaya.view.Warehouse.Product.WinFormPart-Form-EndRangePartCode',
                        fieldLabel: lang('End Range Code'),
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                    }, {
                        xtype: 'textfield',
                        labelAlign:'top',
                        id: 'MitraJaya.view.Warehouse.Product.WinFormPart-Form-ActualLocation',
                        name: 'MitraJaya.view.Warehouse.Product.WinFormPart-Form-ActualLocation',
                        fieldLabel: lang('Actual Location'),
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
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
            id: 'MitraJaya.view.Warehouse.Product.WinFormPart-Form-BtnSave',
            handler: function () {
            	var FormNya = Ext.getCmp('MitraJaya.view.Warehouse.Product.WinFormPart-Form').getForm();
                if (FormNya.isValid()) {
                    FormNya.submit({
                        url: m_api + '/v1/warehouse/product/submit_part',
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
