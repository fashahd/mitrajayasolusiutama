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

Ext.define('MitraJaya.view.Admin.Employee.WinFormCertification' ,{
    extend: 'Ext.window.Window',
    id: 'MitraJaya.view.Admin.Employee.WinFormCertification',
    cls: 'Sfr_LayoutPopupWindows',
    title:lang('Training & Certification Form'),
    closable: true,
    modal: true,
    closeAction: 'destroy',
    width: '50%',
    height: 400,
    overflowY: 'auto',
    viewVar: false,
    setViewVar: function(value){
        this.viewVar = value;
    },
    listeners: {
        afterRender: function(){
            var thisObj = this;

            //form reset
            var FormNya = Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormCertification-Form');
            FormNya.getForm().reset();


            if(thisObj.viewVar.OpsiDisplay == 'insert'){
                
            }

            if(thisObj.viewVar.OpsiDisplay == 'update' || thisObj.viewVar.OpsiDisplay == 'view'){
                if(thisObj.viewVar.OpsiDisplay == 'view') {
                    Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormCertification-Form-BtnSave').setVisible(false);
                }

                FormNya.getForm().load({
                    url: m_api + '/v1/admin/employee/form_certification',
                    method: 'GET',
                    params: {
                        cert_id: thisObj.viewVar.cert_id
                    },
                    success: function (form, action) {
                        var r = Ext.decode(action.response.responseText);

						if(r.data.document != ''){
							Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormCertification-Form-FileDocument').update('<a href="'+m_api_base_url+'/'+r.data.document+'" title="Download File" target="_blank">'+lang('Download File')+'    <img src="'+m_api_base_url+'/assets/images/pdf-icon.png" height="24" /></a>');
							Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormCertification-Form-FileDocument').doLayout();
						}
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

            // Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormCertification').initMap('map-picker-plot', Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormCertification-Form-Latitude').getValue(), Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormCertification-Form-Longitude').getValue());
        }
    },
    initComponent: function() {
        var thisObj = this;
        let labelWidth = 150;

        //items -------------------------------------------------------------- (begin)
        thisObj.items = [{
        	xtype: 'form',
            id: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form',
            padding:'5 25 5 8',
            items:[{
                layout: 'column',
                border: false,
                items:[{
                    columnWidth: 0.5,
                    layout:'form',
                    items:[{
                    	xtype: 'hiddenfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form-cert_id',
                        name: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form-cert_id',
                        fieldLabel: lang('Certification ID')
                    },{
                    	xtype: 'textfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form-cert_code',
                        name: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form-cert_code',
                        fieldLabel: lang('Certification ID'),
                        labelAlign: "top"
                    },{
                    	xtype: 'textfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form-cert_name',
                        name: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form-cert_name',
                        fieldLabel: lang('Certification Name'),
                        labelAlign: "top"
                    },{
                    	xtype: 'datefield',
						format:'Y-m-d',
                        id: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form-start_date',
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                        name: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form-start_date',
                        fieldLabel: lang('Start Date')
                    },{
                    	xtype: 'datefield',
						format:'Y-m-d',
                        id: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form-end_date',
                        labelAlign: "top",
                        allowBlank: false,
                        baseCls: 'Sfr_FormInputMandatory',
                        name: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form-end_date',
                        fieldLabel: lang('End Date')
                    }]
                },{
                    columnWidth: 0.5,
                    layout:'form',
					style:'margin-left:20px',
                    items:[{
                    	xtype: 'textfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form-description',
                        name: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form-description',
                        fieldLabel: lang('Description'),
                        labelAlign: "top"
                    },{
                        xtype: 'hiddenfield',
                        id: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form-document_old',
                        name: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form-document_old'
                    },{
                        xtype: 'fileuploadfield',
                        labelWidth: 125,
						labelAlign:'top',
                        fieldLabel: lang('Attachment') + ' <sup style="color:#FF0000;">(Max:10MB)</sup>' + ' *',
                        id: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form-document',
                        name: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form-document',
                        buttonText: lang('Browse'),
                        listeners: {
							afterrender: function (cmp) {
								cmp.fileInputEl.set({
									accept: '.pdf'
								});
							},
                            'change': function (fb, v) {

                                if (Math.floor(fb.fileInputEl.dom.files[0].size / 1000000) > 10) { //maksimal 10MB
                                    alert(lang("file size more than 10MB"));
                                    Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormCertification-Form-document').reset(true);
                                } else {
                                    Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormCertification-Form').getForm().submit({
                                        url: m_api + '/v1/admin/employee/document_certification_upload',
                                        clientValidation: false,
                                        params: {
                                            OpsiDisplay: thisObj.viewVar.OpsiDisplay,
											people_id: thisObj.viewVar.people_id,
                                            cert_id: Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormCertification-Form-cert_id').getValue()
                                        },
                                        waitMsg: lang('Sending Image'),
                                        success: function (fp, o) {
                                            Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormCertification-Form-document_old').setValue(o.result.FilePath);
											Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormCertification-Form-FileDocument').update('<a href="'+o.result.file+'" title="Download File" target="_blank">'+lang('Download File')+'    <img src="'+m_api_base_url+'/assets/images/pdf-icon.png" height="24" /></a>');
											Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormCertification-Form-FileDocument').doLayout();
                                        },
                                        failure: function (fp, o) {
                                            Ext.MessageBox.show({
                                                title: lang('Attention'),
                                                msg: o.result.message,
                                                buttons: Ext.MessageBox.OK,
                                                animateTarget: 'mb9',
                                                icon: 'ext-mb-error'
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    },{
                        id:'MitraJaya.view.Admin.Employee.WinFormCertification-Form-FileDocument',
                        html:'<img src="'+m_api_base_url+'/assets/images/no-images.png" height="200" />'        
                    },{
                        html:'<div style="margin-top:5px;font-size:10px;font-style:italic;">'+lang('File must PDF')+'</div>'
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
            id: 'MitraJaya.view.Admin.Employee.WinFormCertification-Form-BtnSave',
            handler: function () {
            	var FormNya = Ext.getCmp('MitraJaya.view.Admin.Employee.WinFormCertification-Form').getForm();
                if (FormNya.isValid()) {
                    FormNya.submit({
                        url: m_api + '/v1/admin/employee/submit_certification',
                        method:'POST',
                        params: {
                            OpsiDisplay: thisObj.viewVar.OpsiDisplay,
                            people_id: thisObj.viewVar.people_id
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

                            Ext.getCmp('MitraJaya.view.Finance.Loan.MainForm-FormBasicData').getForm().load({
                                url: m_api + '/v1/finance/employeeloan/form_loan',
                                method: 'GET',
                                params: {
                                    EmployeeLoanID: thisObj.viewVar.EmployeeLoanID
                                },
                                success: function (form, action) {
                                    // Ext.MessageBox.hide();
                                    var r = Ext.decode(action.response.responseText);
                                    //Title
                                    // Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-labelInfoInsert').update('<div id="header_title_farmer">' + Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-EmployeeLoanID').getValue() + ' - <strong>' + Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-FormBasicData-SupplierName').getValue() + '</strong></div>');
                                    // Ext.getCmp('MitraJaya.view.Finance.PinjamanSubCont.MainForm-labelInfoInsert').doLayout();
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
