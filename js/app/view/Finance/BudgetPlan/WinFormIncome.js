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

Ext.define('MitraJaya.view.Finance.BudgetPlan.WinFormIncome' ,{
    extend: 'Ext.window.Window',
    id: 'MitraJaya.view.Finance.BudgetPlan.WinFormIncome',
    cls: 'Sfr_LayoutPopupWindows',
    title: lang('Income Form'),
    closable: true,
    modal: true,
    closeAction: 'destroy',
    width: '40%',
    height: 500,
    overflowY: 'auto',
    viewVar: false,
    setViewVar: function(value){
        this.viewVar = value;
    },
    initComponent: function() {
        var thisObj = this;

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
                        id: 'MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData',
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
                                    id: 'MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData-BudgetPlanID',
                                    name: 'MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData-BudgetPlanID'
                                }, {
                                    xtype: 'textfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData-BudgetItem',
                                    name: 'MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData-BudgetItem',
                                    fieldLabel: lang('Item'),
									allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory',
                                }, {
                                    xtype: 'datefield',
                                    format:'Y-m-d',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData-BudgetDate',
                                    name: 'MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData-BudgetDate',
                                    fieldLabel: lang('Date'),
									allowBlank:false,
									baseCls: 'Sfr_FormInputMandatory'
                                }, {
                                    xtype: 'numericfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData-BudgetAmount',
                                    name: 'MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData-BudgetAmount',
                                    fieldLabel: lang('Budget Amount')
                                },{
                                    xtype: 'numericfield',
                                    labelAlign:'top',
                                    id: 'MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData-BudgetActual',
                                    name: 'MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData-BudgetActual',
                                    fieldLabel: lang('Budget Actual')
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
			text: lang('Save'),
			cls: 'Sfr_BtnFormBlue',
			overCls: 'Sfr_BtnFormBlue-Hover',
			id: 'MitraJaya.view.Finance.BudgetPlan.WinFormIncome-BtnSave',
			handler: function () {
				var Formnya = Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData').getForm();

				if (Formnya.isValid()) {

					Formnya.submit({
						url: m_api + '/v1/finance/budgetplan/submit_income',
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
                                    title: lang('Error'),
                                    msg: r.message,
                                    buttons: Ext.MessageBox.OK,
                                    animateTarget: 'mb9',
                                    icon: 'ext-mb-info'
                                });
							} catch (err) {
								Ext.MessageBox.show({
                                    title: lang('Error'),
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
					// 	title: lang('Attention'),
					// 	msg: lang('Form not complete yet'),
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
    listeners: {
        afterRender: function(){
            var thisObj = this;
            // Map Initialize

            // Conditionanl Add Newa or view/update
                if(thisObj.viewVar.OpsiDisplay == 'view') {
					Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.WinFormIncome-BtnSave').setVisible(false);
                }

				//load data form
				Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData').getForm().load({
					url: m_api + '/v1/finance/pajak/form_pajak',
					method: 'GET',
					params: {
						Month: this.viewVar.Month,
						Year:thisObj.viewVar.Year
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
    AddValidationBasicForm: function(){
        var thisObj = this;
        var ArrMsg = [];
        thisObj.AddValidation = true;
        //thisObj.MsgAddValidation = "Cihuy";

        //Cek Umur ================================================== (Begin)
        if(Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData-FamRelation').getValue() == '1'){
            var YearBirth = parseInt(Ext.getCmp('MitraJaya.view.Finance.BudgetPlan.WinFormIncome-FormBasicData-BirthYear').getValue());
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
