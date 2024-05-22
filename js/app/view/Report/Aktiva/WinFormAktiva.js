/******************************************
 *  Author : n1colius.lau@gmail.com   
 *  Created On : Wed Jan 22 2020
 *  File : WinFormFamily.js
 *******************************************/

/*
    Param2 yg diperlukan ketika load View ini
    - OpsiDisplay
    - SupplierID
    - SupFamID
    - CallerStore
*/

Ext.define('MitraJaya.view.Report.Aktiva.WinFormAktiva' ,{
    extend: 'Ext.window.Window',
    id: 'MitraJaya.view.Report.Aktiva.WinFormAktiva',
    cls: 'Sfr_LayoutPopupWindows',
    title: 'Aktiva Form',
    closable: true,
    modal: true,
    closeAction: 'destroy',
    width: '60%',
    height: 600,
    overflowY: 'auto',
    viewVar: false,
    setViewVar: function(value){
        this.viewVar = value;
    },
    initComponent: function() {
        var thisObj = this;

		thisObj.ComboMonth = Ext.create("MitraJaya.store.General.StoreMonth");
		thisObj.ComboYear = Ext.create("MitraJaya.store.General.StoreYear");

        //items -------------------------------------------------------------- (begin)
        thisObj.items = Ext.create('Ext.panel.Panel', {
            frame: false,
            items: [{
                layout: 'column',
                border: false,
                padding: 10,
                items: [{
                    columnWidth: 1,
                    style:'padding:0px 10px 0px 20px',
                    layout: 'form',
                    items: [{
                        xtype: 'form',
                        id: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData',
                        fileUpload: true,
                        buttonAlign: 'center',
                        items: [{
                            layout: 'column',
                            border: false,
                            items: [{
                                columnWidth: 0.5,
                                layout: 'form',
                                style: 'padding:10px 20px 10px 5px;',
								defaults:{
									labelAlign: 'top',
								},
                                items: [{
                                    xtype: 'textfield',
                                    inputType: 'hidden',
                                    id: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-AktivaID',
                                    name: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-AktivaID'
                                }, {
                                    xtype: 'combobox',
                                    labelAlign:'top',
									fieldLabel:'Bulan Pembelian',
                                    id: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-Month',
                                    name: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-Month',
                                    store:thisObj.ComboMonth,
									queryModel:'local',
									displayField:'label',
									valueField:'id',
									allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory',
                                }, {
                                    xtype: 'combobox',
                                    labelAlign:'top',
									fieldLabel:'Tahun Pembelian',
                                    id: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-Year',
                                    name: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-Year',
                                    store:thisObj.ComboYear,
									queryModel:'local',
									displayField:'label',
									valueField:'id',
									allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory',
                                },{
									xtype:'textfield',
									fieldLabel:'Keterangan',
									name:'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-Description',
									id:'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-Description',
								},{
									xtype:'numericfield',
									fieldLabel:'Unit',
									name:'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-Unit',
									id:'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-Unit',
									listeners:{
										change:function(ob, val){
											thisObj.CalculateAll();
										}
									}
								},{
									xtype:'textfield',
									fieldLabel:'Gol',
									name:'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-Gol',
									id:'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-Gol'
								},{
									xtype:'numericfield',
									fieldLabel:'Tarif (%)',
									name:'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-Rate',
									id:'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-Rate',
								},{
									xtype:'numericfield',
									fieldLabel:'Nilai Perolehan',
									name:'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-InputValue',
									id:'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-InputValue',
									listeners:{
										change:function(ob, val){
											thisObj.CalculateAll();
										}
									}
								}]
                            },{
                                columnWidth: 0.5,
                                layout: 'form',
                                style: 'padding:10px 0px 10px 5px;',
								defaults:{
									labelAlign: 'top',
								},
                                items: [{
									xtype:'numericfield',
									fieldLabel:'Total',
									name:'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-Total',
									id:'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-Total',
									readOnly:true,
									listeners:{
										change:function(ob, val){
											thisObj.CalculateAll();
										}
									}
								},{
                                    xtype: 'numericfield',
									fieldLabel:'Akumulasi Penyusutan Akhir',
                                    id: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-FinalAccumulated',
                                    name: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-FinalAccumulated',
									listeners:{
										change:function(ob, val){
											thisObj.CalculateAll();
										}
									}
                                }, {
                                    xtype: 'numericfield',
									fieldLabel:'Nilai Buku Akhir',
                                    id: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-FinalBookValue',
                                    name: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-FinalBookValue'
                                }, {
                                    xtype: 'numericfield',
									fieldLabel:'Biaya Penyusutan Bulan Ini',
                                    id: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-CostDecreasing',
                                    name: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-CostDecreasing',
									listeners:{
										change:function(ob, val){
											thisObj.CalculateAll();
										}
									}
                                }, {
                                    xtype: 'numericfield',
									fieldLabel:'Akumulasi Penyusutan Akhir',
                                    id: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-FinalAccumulatedCost',
                                    name: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-FinalAccumulatedCost',
									readOnly:true,
									listeners:{
										change:function(ob, val){
											thisObj.CalculateAll();
										}
									}
                                }, {
                                    xtype: 'numericfield',
									fieldLabel:'Nilai Buku Akhir',
                                    id: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-FinalBookValueCost',
                                    name: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-FinalBookValueCost',
									readOnly:true
                                }]
                            }]
                        }]
                    }]
                }]
            }]
        });
        //items -------------------------------------------------------------- (end)

        //buttons -------------------------------------------------------------- (begin)
        thisObj.buttons = [{
			icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
			text: 'Save',
			cls: 'Sfr_BtnFormBlue',
			overCls: 'Sfr_BtnFormBlue-Hover',
			id: 'MitraJaya.view.Report.Aktiva.WinFormAktiva-BtnSave',
			handler: function () {
				var Formnya = Ext.getCmp('MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData').getForm();

				if (Formnya.isValid()) {

					Formnya.submit({
						url: m_api + '/v1/report/aktiva/submit',
						method: 'POST',
						waitMsg: 'Saving data...',
						params: {
							OpsiDisplay: thisObj.viewVar.OpsiDisplay
						},
						success: function (fp, o) {
							
							thisObj.viewVar.CallerStore.load();
    
							//tutup popup
							thisObj.close();

							Swal.fire({
								text: "Data saved",
								icon: 'success',
								confirmButtonColor: '#3085d6',
							}).then((result) => {
								if (result.isConfirmed) {
									thisObj.close();
								}
							})
						},
						failure: function (fp, o) {
							try {
								var r = Ext.decode(o.response.responseText);
								
								Ext.MessageBox.show({
                                    title: 'Error',
                                    msg: r.message,
                                    buttons: Ext.MessageBox.OK,
                                    animateTarget: 'mb9',
                                    icon: 'ext-mb-info'
                                });
							} catch (err) {
								Ext.MessageBox.show({
                                    title: 'Error',
                                    msg: 'Connection Error',
                                    buttons: Ext.MessageBox.OK,
                                    animateTarget: 'mb9',
                                    icon: 'ext-mb-info'
                                });
							}
						}
					});

				} else {
					// Ext.MessageBox.show({
					// 	title: 'Attention',
					// 	msg: 'Form not complete yet',
					// 	buttons: Ext.MessageBox.OK,
					// 	animateTarget: 'mb9',
					// 	icon: 'ext-mb-info'
					// });

					
					Swal.fire({
						icon: 'warning',
						text: 'Form not complete yet',
						// footer: '<a href="">Why do I have this issue?</a>'
					})
				}
			}
		},{
            icon: varjs.config.base_url + 'images/icons/new/close.png',
            text: 'Close',
            cls:'Sfr_BtnFormGrey',
            overCls:'Sfr_BtnFormGrey-Hover',
            handler: function() {
                thisObj.close();
            }
        }];
        //buttons -------------------------------------------------------------- (end)

        this.callParent(arguments);
    },
    listeners: {
        afterRender: function(){
            var thisObj = this;
            // Map Initialize

            // Conditionanl Add Newa or view/update
                if(thisObj.viewVar.OpsiDisplay == 'view') {
					Ext.getCmp('MitraJaya.view.Report.Aktiva.WinFormAktiva-BtnSave').setVisible(false);
                }

				//load data form
				Ext.getCmp('MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData').getForm().load({
					url: m_api + '/v1/report/aktiva/form_aktiva',
					method: 'GET',
					params: {
						AktivaID:thisObj.viewVar.AktivaID
					},
					success: function (form, action) {
						// Ext.MessageBox.hide();
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
	CalculateAll:function(){
		var unit 		= Ext.getCmp('MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-Unit').getValue();
		var inputval 	= Ext.getCmp('MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-InputValue').getValue();
		var FinalAccumulated = Ext.getCmp('MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-FinalAccumulated').getValue();
		var CostDecreasing = Ext.getCmp('MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-CostDecreasing').getValue();

		var Total		= unit*inputval;
		var FinalAccumulatedCost = FinalAccumulated + CostDecreasing;
		var FinalBookValueCost = Total - FinalAccumulatedCost;

		Ext.getCmp('MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-Total').setValue(Total);
		Ext.getCmp('MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-FinalAccumulatedCost').setValue(FinalAccumulatedCost);
		Ext.getCmp('MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-FinalBookValueCost').setValue(FinalBookValueCost);
	},
    AddValidationBasicForm: function(){
        var thisObj = this;
        var ArrMsg = [];
        thisObj.AddValidation = true;
        //thisObj.MsgAddValidation = "Cihuy";

        //Cek Umur ================================================== (Begin)
        if(Ext.getCmp('MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-FamRelation').getValue() == '1'){
            var YearBirth = parseInt(Ext.getCmp('MitraJaya.view.Report.Aktiva.WinFormAktiva-FormBasicData-BirthYear').getValue());
            var today = new Date();
            var age = today.getFullYear() - YearBirth;            
            if(age <= 16){
                thisObj.AddValidation = false;
                ArrMsg.push("Minimal Age is 16 years old");
            }
        }
        //Cek Umur ================================================== (End)


        if(thisObj.AddValidation == false){
            var HtmlMsg = '<ul>';
            for (var index = 0; index < ArrMsg.length; index++) {
                HtmlMsg += '<li>'+ArrMsg[index]+'</li>'
            }
            HtmlMsg+='</ul>';
            thisObj.MsgAddValidation = HtmlMsg;
        }
    }
});
