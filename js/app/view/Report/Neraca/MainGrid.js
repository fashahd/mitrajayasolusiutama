/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
// Currency Component
Ext.ux.NumericField = function(config){
    var defaultConfig = 
    {
        style: 'text-align:right;'
    };

    Ext.ux.NumericField.superclass.constructor.call(this, Ext.apply(defaultConfig, config));

    //Only if thousandSeparator doesn't exists is assigned when using decimalSeparator as the same as thousandSeparator
    if(this.useThousandSeparator && this.decimalSeparator == ',' && Ext.isEmpty(config.thousandSeparator))
        this.thousandSeparator = '.';
    else
        if(this.allowDecimals && this.thousandSeparator == '.' && Ext.isEmpty(config.decimalSeparator))
            this.decimalSeparator = ',';

    this.onFocus = this.onFocus.createSequence(this.onFocus);
};

Ext.extend(Ext.ux.NumericField, Ext.form.NumberField, 
{
    currencySymbol: null,
    useThousandSeparator: true,
    thousandSeparator: ',',
    alwaysDisplayDecimals: false,
    setValue: function(v){
       Ext.ux.NumericField.superclass.setValue.call(this, v);

       this.setRawValue(this.getFormattedValue(this.getValue()));
    },
    /**
     * No more using Ext.util.Format.number, Ext.util.Format.number in ExtJS versions
     * less thant 4.0 doesn't allow to use a different thousand separator than "," or "."
     * @param {Number} v
     */
    getFormattedValue: function(v){

        if (Ext.isEmpty(v) || !this.hasFormat()) 
            return v;
        else 
        {
            var neg = null;

            v = (neg = v < 0) ? v * -1 : v; 
            v = this.allowDecimals && this.alwaysDisplayDecimals ? v.toFixed(this.decimalPrecision) : v;

            if(this.useThousandSeparator)
            {
                if(this.useThousandSeparator && Ext.isEmpty(this.thousandSeparator))
                    throw ('NumberFormatException: invalid thousandSeparator, property must has a valid character.');

                if(this.thousandSeparator == this.decimalSeparator)
                    throw ('NumberFormatException: invalid thousandSeparator, thousand separator must be different from decimalSeparator.');

                var v = String(v);

                var ps = v.split('.');
                ps[1] = ps[1] ? ps[1] : null;

                var whole = ps[0];

                var r = /(\d+)(\d{3})/;

                var ts = this.thousandSeparator;

                while (r.test(whole)) 
                    whole = whole.replace(r, '$1' + ts + '$2');

                v = whole + (ps[1] ? this.decimalSeparator + ps[1] : '');
            }

            return String.format('{0}{1}{2}', (neg ? '-' : ''), (Ext.isEmpty(this.currencySymbol) ? '' : this.currencySymbol + ' '), v);
        }
    },
    /**
     * overrides parseValue to remove the format applied by this class
     */
    parseValue: function(v){
        //Replace the currency symbol and thousand separator
        return Ext.ux.NumericField.superclass.parseValue.call(this, this.removeFormat(v));
    },
    /**
     * Remove only the format added by this class to let the superclass validate with it's rules.
     * @param {Object} v
     */
    removeFormat: function(v){
        if (Ext.isEmpty(v) || !this.hasFormat()) 
            return v;
        else 
        {
            v = v.replace(this.currencySymbol + ' ', '');

            v = this.useThousandSeparator ? v.replace(new RegExp('[' + this.thousandSeparator + ']', 'g'), '') : v;
            //v = this.allowDecimals && this.decimalPrecision > 0 ? v.replace(this.decimalSeparator, '.') : v;

            return v;
        }
    },
    /**
     * Remove the format before validating the the value.
     * @param {Number} v
     */
    getErrors: function(v){
        return Ext.ux.NumericField.superclass.getErrors.call(this, this.removeFormat(v));
    },
    hasFormat: function()
    {
        return this.decimalSeparator != '.' || this.useThousandSeparator == true || !Ext.isEmpty(this.currencySymbol) || this.alwaysDisplayDecimals;    
    },
    /**
     * Display the numeric value with the fixed decimal precision and without the format using the setRawValue, don't need to do a setValue because we don't want a double
     * formatting and process of the value because beforeBlur perform a getRawValue and then a setValue.
     */
    onFocus: function(){
        this.setRawValue(this.removeFormat(this.getRawValue()));
    }
});
// END Currency Component

 Ext.define('MitraJaya.view.Report.Neraca.MainGrid' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Report.Neraca.MainGrid',
    renderTo: 'ext-content',
    style:'padding:0 7px 7px 7px;margin:2px 0 0 0;',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
            document.getElementById('ContentTopBar').style.display = 'block';

            var neraca = JSON.parse(localStorage.getItem('neraca'));

            if(neraca){
                Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').setValue(neraca.year);
                Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').setValue(neraca.month);
				var month 	= neraca.month;
				var year 	= neraca.year;
			}else{
                var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();
            }

            thisObj.LoadForm(month, year);
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain 		    = Ext.create('MitraJaya.store.Finance.BudgetPlan.MainGrid');
        thisObj.StoreGridMainExpense 	= Ext.create('MitraJaya.store.Finance.BudgetPlan.MainGridExpense');
        thisObj.combo_month             = Ext.create('MitraJaya.store.General.StoreMonth');

        thisObj.TotalIncomePlaning      = 0;
        thisObj.TotalIncomeActual       = 0;
        thisObj.TotalExpensePlaning     = 0;
        thisObj.TotalExpenseActual      = 0;
		
        thisObj.combo_year = Ext.create('MitraJaya.store.General.StoreYear',{
            storeVar: {
                yearRange: 20
            }
        });

		thisObj.GridOption = [{
            xtype: 'form',
            fileUpload: true,
            buttonAlign: 'center',
            items: [{
                layout: 'column',
                border: false,
                items: [{
                    columnWidth: 0.3,
                    layout: 'form',
                    style: 'padding-right:10px',
                    items: [{
                        xtype: 'combobox',
                        id:'MitraJaya.view.Report.Neraca.MainGrid-Month',
                        name:'MitraJaya.view.Report.Neraca.MainGrid-Month',
                        store:thisObj.combo_month,
                        labelAlign:'top',
                        fieldLabel:'Period Month',
                        queryMode:'local',
                        displayField:'label',
                        valueField:'id',
                        value:m_month										
                    }]
                },{
                    columnWidth: 0.3,
                    layout: 'form',
                    style: 'padding-right:10px',
                    items: [{
                        xtype: 'combobox',
                        id:'MitraJaya.view.Report.Neraca.MainGrid-Year',
                        name:'MitraJaya.view.Report.Neraca.MainGrid-Year',
                        labelAlign:'top',
                        fieldLabel:'Period Year',
                        store:thisObj.combo_year,
                        queryMode:'local',
                        displayField:'label',
                        valueField:'id',
                        value:m_year
                    }]
                },{
                    columnWidth: 0.2,
                    layout: 'form',
                    items: [{
                        xtype:'button',
                        // icon: varjs.config.base_url + 'images/icons/new/add-filter.png',
                        text:lang('Search'),
                        style:'margin-left:20px; margin-top:30px',
                        cls:'Sfr_BtnGridPaleBlueNew',
                        overCls:'Sfr_BtnGridPaleBlueNew-Hover',
                        id: 'MitraJaya.view.Report.Neraca.MainGrid-BtnApplyFilter',
                        handler: function() {
                            setFilterLs();
                        }
                    }]
                }]
            }]
        }];

		thisObj.FormNeraca = Ext.create('Ext.panel.Panel', {
            title: lang('Form Neraca'),
            frame: true,
            cls: 'Sfr_PanelLayoutForm',
            id: 'MitraJaya.view.Report.Neraca.MainGrid-FormNeraca',
            collapsible: true,
            items: [{
                xtype: 'form',
                id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca',
                buttonAlign: 'center',
                items: [{
                    layout: 'column',
                    border: false,
                    items: [{
                        columnWidth: 0.5,
                        layout: 'form',
                        style:'padding: 10px 10px 10px 10px',
                        cls: 'Sfr_PanelLayoutFormContainer',
                        items: [{
                            xtype: 'panel',
                            title: lang('AKTIVA LANCAR'),
                            frame: false,
                            id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionGeneralData',
                            style: 'margin-top:5px;',
                            cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    // style: 'padding:10px 10px 10px 0px;',
                                    id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionGeneralData-Left',
                                    items: [{
                                        xtype: 'numericfield',
                                        id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Kas',
                                        name: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Kas',
                                        fieldLabel: lang('Kas'),
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateActivaLancar();
                                            }
                                        }
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionUpload',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileKas',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileKas',
												buttonText: lang('Upload Kas'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel',
															clientValidation: false,
															params: {
																type:'Kas',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionDownload',
											items: [{
												xtype: 'button',
												text: lang('Download Kas Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-BtnDownload',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'Kas'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},
                                    {
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-KasKecil',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-KasKecil',
                                        fieldLabel:'Kas Kecil',
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateActivaLancar();
                                            }
                                        }
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionUploadKasKecil',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileKasKecil',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileKasKecil',
												buttonText: lang('Upload Kas Kecil'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel',
															clientValidation: false,
															params: {
																type:'KasKecil',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionDownloadKasKecil',
											items: [{
												xtype: 'button',
												text: lang('Download Kas Kecil Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-BtnDownloadKasKecil',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'KasKecil'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Bank1',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Bank1',
                                        fieldLabel:'Bank BCA 1',
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateActivaLancar();
                                            }
                                        }
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionUploadBankBCA1',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileBankBCA1',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileBankBCA1',
												buttonText: lang('Upload Bank BCA 1'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel',
															clientValidation: false,
															params: {
																type:'BankBCA1',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionDownloadBankBCA1',
											items: [{
												xtype: 'button',
												text: lang('Download Bank BCA 1 Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-BtnDownloadBankBCA1',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'BankBCA1'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Bank2',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Bank2',
                                        fieldLabel:'Bank BCA 2',
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateActivaLancar();
                                            }
                                        }
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionUploadBankBCA2',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileBankBCA2',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileBankBCA2',
												buttonText: lang('Upload Bank BCA 2'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel',
															clientValidation: false,
															params: {
																type:'BankBCA2',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionDownloadBankBCA2',
											items: [{
												xtype: 'button',
												text: lang('Download Bank BCA 2 Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-BtnDownloadBankBCA2',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'BankBCA2'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-PiutangKaryawan',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-PiutangKaryawan',
                                        fieldLabel:'Piutang Karyawan',
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateActivaLancar();
                                            }
                                        }
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionUploadPiutangKaryawan',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FilePiutangKaryawan',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FilePiutangKaryawan',
												buttonText: lang('Upload Piutang Karyawan'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel',
															clientValidation: false,
															params: {
																type:'PiutangKaryawan',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionDownloadPiutangKaryawan',
											items: [{
												xtype: 'button',
												text: lang('Download Piutang Karyawan'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-BtnDownloadPiutangKaryawan',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'PiutangKaryawan'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Persediaan',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Persediaan',
                                        fieldLabel:'Persediaan',
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateActivaLancar();
                                            }
                                        }
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionUploadPersediaan',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FilePersediaan',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FilePersediaan',
												buttonText: lang('Upload Persediaan'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel',
															clientValidation: false,
															params: {
																type:'Persediaan',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionDownloadPersediaan',
											items: [{
												xtype: 'button',
												text: lang('Download Persediaan Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-BtnDownloadPersediaan',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'Persediaan'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-PiutangDagang',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-PiutangDagang',
                                        fieldLabel:'Piutang Dagang',
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateActivaLancar();
                                            }
                                        }
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionUploadPiutangDagang',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FilePiutangDagang',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FilePiutangDagang',
												buttonText: lang('Upload Piutang Dagang'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel',
															clientValidation: false,
															params: {
																type:'PiutangDagang',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionDownloadPiutangDagang',
											items: [{
												xtype: 'button',
												text: lang('Download Piutang Dagang Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-BtnDownloadPiutangDagang',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'PiutangDagang'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-PajakDimuka',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-PajakDimuka',
                                        fieldLabel:'Pajak Dibayar Dimuka',
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateActivaLancar();
                                            }
                                        }
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionUploadPajakDimuka',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FilePajakDimuka',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FilePajakDimuka',
												buttonText: lang('Upload Pajak Dimuka'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel',
															clientValidation: false,
															params: {
																type:'PajakDimuka',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionDownloadPajakDimuka',
											items: [{
												xtype: 'button',
												text: lang('Download Pajak Dimuka Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-BtnDownloadPajakDimuka',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'PajakDimuka'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-TotalAktivaLancar',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-TotalAktivaLancar',
                                        fieldLabel:'Total Aktiva Lancar',
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        readOnly: true,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculatorTotal();
                                            }
                                        }
                                    }]
                                }]
                            }]
                        },{
                            xtype: 'panel',
                            title: lang('AKTIVA TETAP'),
                            frame: false,
                            id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionActivaTetap',
                            style: 'margin-top:12px;',
                            cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    // style: 'padding:10px 0px 10px 5px;',
                                    id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionActivaTetap-Left',
                                    items: [{
                                        xtype: 'numericfield',
                                        id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-PerlengkapanKantor',
                                        name: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-PerlengkapanKantor',
                                        fieldLabel: lang('Perlengkapan Kantor'),
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        readOnly:m_act_update,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateActivaTetap();
                                            }
                                        }
                                    }, {
                                        xtype: 'numericfield',
                                        id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Akumulasi',
                                        name: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Akumulasi',
                                        fieldLabel: lang('Akumulasi'),
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        readOnly:m_act_update,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateActivaTetap();
                                            }
                                        }
                                    },{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-TotalAktivTetap',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-TotalAktivTetap',
                                        fieldLabel:'Total Aktiva Tetap',
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        readOnly: true,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculatorTotal();
                                            }
                                        }
                                    }]
                                }]
                            }]
                        },{
                            xtype: 'panel',
                            title: lang('Total'),
                            frame: false,
                            id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionTotal',
                            style: 'margin-top:12px;',
                            cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    style: 'padding:10px 0px 10px 5px;',
                                    id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionTotal-Left',
                                    items: [{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Total',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Total',
                                        fieldLabel:'Total',
                                        readOnly: true,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    }]
                                }]
                            }]
                        }]
                    },{
                        columnWidth: 0.5,
                        layout: 'form',
                        style:'padding: 10px 10px 10px 10px',
                        cls: 'Sfr_PanelLayoutFormContainer',
                        items: [{
                            xtype: 'panel',
                            title: lang('PASIVA'),
                            frame: false,
                            id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionPasiva',
                            style: 'margin-top:5px;',
                            cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    // style: 'padding:10px 10px 10px 0px;',
                                    id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionPasiva-Right',
                                    items: [{
                                        xtype: 'numericfield',
                                        id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-HutangDireksi',
                                        name: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-HutangDireksi',
                                        fieldLabel: lang('Hutang Direksi'),
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculatePasiva();
                                            }
                                        }
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionUploadHutangDireksi',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileHutangDireksi',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileHutangDireksi',
												buttonText: lang('Upload Pajak Dimuka'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel',
															clientValidation: false,
															params: {
																type:'HutangDireksi',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionDownloadHutangDireksi',
											items: [{
												xtype: 'button',
												text: lang('Download Pajak Dimuka Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-BtnDownloadHutangDireksi',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'HutangDireksi'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        html:'<div style="margin-bottom:5px"></div>'
                                    },{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-HutangPajak',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-HutangPajak',
                                        fieldLabel:'Hutang Pajak',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculatePasiva();
                                            }
                                        }
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionUploadHutangPajak',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileHutangPajak',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileHutangPajak',
												buttonText: lang('Upload Pajak Dimuka'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel',
															clientValidation: false,
															params: {
																type:'HutangPajak',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionDownloadHutangPajak',
											items: [{
												xtype: 'button',
												text: lang('Download Pajak Dimuka Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-BtnDownloadHutangPajak',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'HutangPajak'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        html:'<div style="margin-bottom:5px"></div>'
                                    },{
                                        xtype: 'numericfield',
                                        id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Modal',
                                        name: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Modal',
                                        fieldLabel: lang('Modal'),
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculatePasiva();
                                            }
                                        }
                                    },{
                                        html:'<div style="margin-bottom:5px"></div>'
                                    },{
                                        xtype: 'numericfield',
                                        id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-LabaRugiBertahan',
                                        name: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-LabaRugiBertahan',
                                        fieldLabel: lang('Laba/Rugi Bertahan'),
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculatePasiva();
                                            }
                                        }
                                    },{
                                        html:'<div style="margin-bottom:5px"></div>'
                                    }, {
                                        xtype: 'numericfield',
                                        id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-LabaRugiBerjalan',
                                        name: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-LabaRugiBerjalan',
                                        fieldLabel: lang('Laba Rugi Berjalan'),
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculatePasiva();
                                            }
                                        }
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionUploadLabaRugiBerjalan',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileLabaRugiBerjalan',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileLabaRugiBerjalan',
												buttonText: lang('Upload Laba Rugi'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel',
															clientValidation: false,
															params: {
																type:'LabaRugiBerjalan',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionDownloadLabaRugiBerjalan',
											items: [{
												xtype: 'button',
												text: lang('Download Laba Rugi Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-BtnDownloadLabaRugiBerjalan',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'LabaRugiBerjalan'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									}]
                                }]
                            }]
                        },{
							html:"<div style='margin-top:433px'></div>"
						},{
                            xtype: 'panel',
                            title: lang('Total'),
                            frame: false,
                            id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionTotalPasiva',
                            style: 'margin-top:12px;',
                            cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    style: 'padding:10px 0px 10px 5px;',
                                    id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionTotalPasiva-Right',
                                    items: [{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-TotalPasiva',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-TotalPasiva',
                                        fieldLabel:'Total',
                                        readOnly: true,
                                        labelWidth:200
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }],
            buttons: [{
                xtype: 'button',
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
                text: lang('Save'),
                hidden:m_act_update,
                cls: 'Sfr_BtnFormBlue',
                overCls: 'Sfr_BtnFormBlue-Hover',
                id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-BtnSave',
                handler: function () {
                    var Formnya         = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca').getForm();

                    if (Formnya.isValid()) {
                        Formnya.submit({
                            url: m_api + '/v1/report/Neraca/submit',
                            method: 'POST',
                            waitMsg: 'Saving data Neraca...',
                            params:{
                                month   : Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
                                year    : Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
                            },
                            success: function (fp, o) {
                                Swal.fire({
                                    text: "Data saved",
                                    icon: 'success',
                                    confirmButtonColor: '#3085d6',
                                }).then((result) => {
                                    
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
            },{
                xtype: 'button',
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/print.svg',
                text: lang('Cetak'),
                cls: 'Sfr_BtnFormBlue',
                overCls: 'Sfr_BtnFormBlue-Hover',
                id: 'MitraJaya.view.Admin.Vendor.MainForm-FormBasicData-BtnCetak',
                handler: function () {
                    var url = m_api + '/v1/report/printout/print_neraca';
                    preview_cetak_surat(url + '?Month='+Ext.getCmp("MitraJaya.view.Report.Neraca.MainGrid-Month").getValue()+'&Year='+Ext.getCmp("MitraJaya.view.Report.Neraca.MainGrid-Year").getValue());
                }
            }]
        });

        thisObj.FormLabaRugi = Ext.create('Ext.panel.Panel', {
            title: lang('Form Laba Rugi'),
            frame: true,
            cls: 'Sfr_PanelLayoutForm',
            id: 'MitraJaya.view.Report.Neraca.MainGrid-FormLabaRugi',
            collapsible: true,
            items: [{
                xtype: 'form',
                id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi',
                buttonAlign: 'center',
                items: [{
                    layout: 'column',
                    border: false,
                    items: [{
                        columnWidth: 0.5,
                        layout: 'form',
                        style:'padding: 10px 10px 10px 10px',
                        cls: 'Sfr_PanelLayoutFormContainer',
                        items: [{
							xtype:'label',
							id:'LabaRugi-Text',
							text:'Bulan Ini',
						},{
                            xtype: 'panel',
                            title: lang('Pendapatan'),
                            frame: false,
                            style: 'margin-top:5px;',
                            cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    // style: 'padding:10px 10px 10px 0px;',
                                    items: [{
                                        xtype: 'numericfield',
                                        id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Pendapatan',
                                        name: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Pendapatan',
                                        fieldLabel: lang('Pendapatan'),
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        }
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-SectionUploadPendapatan',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FilePendapatan',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FilePendapatan',
												buttonText: lang('Upload Pendapatan'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'Pendapatan',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadPendapatan',
											items: [{
												xtype: 'button',
												text: lang('Download Pendapatan Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadPendapatan',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'Pendapatan'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									}]
                                }]
                            }]
                        },{
                            xtype: 'panel',
                            title: lang('Biaya Operasional'),
                            frame: false,
                            style: 'margin-top:5px;',
                            cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    // style: 'padding:10px 10px 10px 0px;',
                                    items: [{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Proyek',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Proyek',
                                        fieldLabel:'Proyek',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionUploadProyek',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileProyek',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileProyek',
												buttonText: lang('Upload Proyek'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'Proyek',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadProyek',
											items: [{
												xtype: 'button',
												text: lang('Download Proyek Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadProyek',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'Proyek'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Transport',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Transport',
                                        fieldLabel:'Transport',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionUploadTransport',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileTransport',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileTransport',
												buttonText: lang('Upload Transport'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'Transport',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadTransport',
											items: [{
												xtype: 'button',
												text: lang('Download Transport Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadTransport',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'Transport'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Antigen',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Antigen',
                                        fieldLabel:'Antigen',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionUploadAntigen',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileAntigen',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileAntigen',
												buttonText: lang('Upload Antigen'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'Antigen',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadAntigen',
											items: [{
												xtype: 'button',
												text: lang('Download Antigen Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadAntigen',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'Antigen'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ATK',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ATK',
                                        fieldLabel:'ATK',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionUploadATK',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileATK',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileATK',
												buttonText: lang('Upload ATK'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'ATK',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadATK',
											items: [{
												xtype: 'button',
												text: lang('Download ATK Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadATK',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'ATK'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Entertaint',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Entertaint',
                                        fieldLabel:'Entertain',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionUploadEntertain',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileEntertain',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileEntertain',
												buttonText: lang('Upload Entertain'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'Entertain',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadEntertain',
											items: [{
												xtype: 'button',
												text: lang('Download Entertain Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadEntertain',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'Entertain'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Materai',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Materai',
                                        fieldLabel:'Materai',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionUploadMaterai',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileMaterai',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileMaterai',
												buttonText: lang('Upload Materai'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'Materai',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadMaterai',
											items: [{
												xtype: 'button',
												text: lang('Download Materai Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadMaterai',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'Materai'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ADM',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ADM',
                                        fieldLabel:'ADM',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionUploadADM',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileADM',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileADM',
												buttonText: lang('Upload ADM'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'ADM',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadADM',
											items: [{
												xtype: 'button',
												text: lang('Download ADM Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadADM',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'ADM'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ART',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ART',
                                        fieldLabel:'ART',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionUploadART',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileART',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileART',
												buttonText: lang('Upload ART'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'ART',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadART',
											items: [{
												xtype: 'button',
												text: lang('Download ART Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadART',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'ART'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengirimanBarang',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengirimanBarang',
                                        fieldLabel:'Pengiriman Barang',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionUploadPengirimanBarang',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FilePengirimanBarang',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FilePengirimanBarang',
												buttonText: lang('Upload Pengiriman Barang'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'PengirimanBarang',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadPengirimanBarang',
											items: [{
												xtype: 'button',
												text: lang('Download Pengiriman Barang'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadPengirimanBarang',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'PengirimanBarang'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Iuran',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Iuran',
                                        fieldLabel:'Iuran',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionUploadIuran',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileIuran',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileIuran',
												buttonText: lang('Upload Iuran'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'Iuran',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadIuran',
											items: [{
												xtype: 'button',
												text: lang('Download Iuran Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadIuran',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'Iuran'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Pengobatan',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Pengobatan',
                                        fieldLabel:'Pengobatan',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionUploadPengobatan',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FilePengobatan',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FilePengobatan',
												buttonText: lang('Upload Pengobatan'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'Pengobatan',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadPengobatan',
											items: [{
												xtype: 'button',
												text: lang('Download Pengobatan Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadPengobatan',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'Pengobatan'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ART2',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ART2',
                                        fieldLabel:'ART',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionUploadART2',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileART2',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileART2',
												buttonText: lang('Upload ART'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'ART2',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadART2',
											items: [{
												xtype: 'button',
												text: lang('Download ART Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadART2',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'ART2'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BPJS',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BPJS',
                                        fieldLabel:'BPJS',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionUploadBPJS',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileBPJS',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileBPJS',
												buttonText: lang('Upload BPJS'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'BPJS',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadBPJS',
											items: [{
												xtype: 'button',
												text: lang('Download BPJS Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadBPJS',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'BPJS'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ListrikInet',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ListrikInet',
                                        fieldLabel:'Listrik & Internet',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionUploadListrikInternet',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileListrikInternet',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileListrikInternet',
												buttonText: lang('Upload Listrik & Internet'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'ListrikInternet',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadListrikInternet',
											items: [{
												xtype: 'button',
												text: lang('Download Listrik Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadListrikInternet',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'ListrikInternet'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Insentive',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Insentive',
                                        fieldLabel:'Insentive',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionUploadInsentive',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileInsentive',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileInsentive',
												buttonText: lang('Upload Insentive'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'Insentive',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadInsentive',
											items: [{
												xtype: 'button',
												text: lang('Download Insentive Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadInsentive',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'Insentive'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Salary',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Salary',
                                        fieldLabel:'Salary',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionUploadSalary',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileSalary',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileSalary',
												buttonText: lang('Upload Salary'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'Salary',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadSalary',
											items: [{
												xtype: 'button',
												text: lang('Download Salary Detail'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadSalary',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'Salary'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaPenyusutan',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaPenyusutan',
                                        fieldLabel:'Biaya Penyusutan',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										layout: 'column',
										border: false,
										items: [{
											columnWidth: 0.5,
											layout: 'form',
											hidden:m_act_update,
											style: 'margin-bottom:5px',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionUploadBiayaPenyusutan',
											items: [{
												xtype: 'fileuploadfield',
												buttonOnly: true,
												id: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileBiayaPenyusutan',
												name: 'MitraJaya.view.Report.Balance.MainForm-FormBasicData-FileBiayaPenyusutan',
												buttonText: lang('Upload Biaya Penyusutan'),
												cls: 'Sfr_FormBrowseBtn',
												listeners: {
													'change': function (fb, v) {
														Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().submit({
															url: m_api + '/v1/report/Neraca/upload_excel_neraca',
															clientValidation: false,
															params: {
																type:'BiayaPenyusutan',
																month: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
																year: Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
															},
															waitMsg: 'Sending Photo...',
															success: function (fp, o) {
																var r = Ext.decode(o.response.responseText);
																
																Ext.MessageBox.show({
																	title: lang('Success'),
																	msg: o.result.message,
																	buttons: Ext.MessageBox.OK,
																	animateTarget: 'mb9',
																	icon: 'ext-mb-success'
																});
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
											}]
										},{
											columnWidth: 0.5,
											layout: 'form',
											style: 'margin-bottom:5px;',
											id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SectionDownloadBiayaPenyusutan',
											items: [{
												xtype: 'button',
												text: lang('Download Biaya Penyusutan'),
												cls: 'Sfr_FormBrowseBtn',
												style:'float:right',
												id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnDownloadBiayaPenyusutan',
												handler: function () {
													var month   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
                                					var year    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

													Swal.fire({
														text: "Export data ?",
														icon: 'warning',
														showCancelButton: true,
														confirmButtonColor: '#3085d6',
														cancelButtonColor: '#d33',
														confirmButtonText: 'Yes, Export it!'
													}).then((result) => {
														if (result.isConfirmed) {
															Ext.Ajax.request({
																url: m_api + '/v1/report/Neraca/download_excel',
																method: 'GET',
																waitMsg: lang('Please Wait'),
																params: {
																	month : month,
																	year : year,
																	type : 'BiayaPenyusutan'
																},
																success: function(data) {
																	// console.log(data);
																	if(!fetchJSON(data.responseText)){
																		Swal.fire({
																			icon: 'error',
																			text: 'Connection Failed',
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;
																	}
							
																	var jsonResp = JSON.parse(data.responseText);
																		if (jsonResp.success == true) {
																		window.location = jsonResp.filenya;
																	} else if (jsonResp.message == 'Empty') {
																		Swal.fire({
																			icon: 'warning',
																			text: jsonResp.filenya,
																			// footer: '<a href="">Why do I have this issue?</a>'
																		})
																		return false;                                                    
																	}
																},
																failure: function() {									
																	Swal.fire({
																		icon: 'warning',
																		text: 'File Not Found',
																		// footer: '<a href="">Why do I have this issue?</a>'
																	})
																}
															});
														}
													})
												}
											}]
										}]
									}]
                                }]
                            }]
                        },{
                            xtype: 'panel',
                            title: lang('Pendapatan / Biaya Lain Lain'),
                            frame: false,
                            style: 'margin-top:12px;',
                            cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    style: 'padding:10px 0px 10px 5px;',
                                    items: [{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaAdminBank',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaAdminBank',
                                        fieldLabel:'Biaya Administrasi Bank',
                                        readOnly:m_act_update,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugi();
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    }]
                                }]
                            }]
                        },{
                            xtype: 'panel',
                            title: lang('Total Biaya Operasinal'),
                            frame: false,
                            style: 'margin-top:5px;',
                            cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    // style: 'padding:10px 10px 10px 0px;',
                                    items: [{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalBiayaOperasional',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalBiayaOperasional',
                                        fieldLabel:'Total Biaya Operasinal',
                                        readOnly: true,
                                        labelWidth:200,
                                        listeners:{
                                            change:function(){
                                                thisObj.CalculateLabaRugiCompute();
                                            }
                                        },
                                    }]
                                }]
                            }]
                        },{
                            xtype: 'panel',
                            title: lang('Total Pendapatan / Biaya Lain'),
                            frame: false,
                            style: 'margin-top:5px;',
                            cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    // style: 'padding:10px 10px 10px 0px;',
                                    items: [{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalPendapatanLain',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalPendapatanLain',
                                        fieldLabel:'Total Pendapatan / Biaya Lain',
                                        readOnly: true,
                                        labelWidth:200,
                                    }]
                                }]
                            }]
                        },{
                            xtype: 'panel',
                            title: lang('Laba (Rugi)'),
                            frame: false,
                            style: 'margin-top:5px;',
                            cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    // style: 'padding:10px 10px 10px 0px;',
                                    items: [{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-LabaRugi',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-LabaRugi',
                                        fieldLabel:'Laba (Rugi)',
                                        readOnly: true,
                                        labelWidth:200,
                                    }]
                                }]
                            }]
                        }]
                    },{
                        columnWidth: 0.5,
                        layout: 'form',
                        style:'padding: 10px 10px 10px 10px',
                        cls: 'Sfr_PanelLayoutFormContainer',
                        items: [{
							xtype:'label',
							id:'LabaRugiNew-Text',
							text:'Bulan Ini',
						},{
                            xtype: 'panel',
                            title: lang('Pendapatan'),
                            frame: false,
                            style: 'margin-top:5px;',
                            cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    // style: 'padding:10px 10px 10px 0px;',
                                    items: [{
                                        xtype: 'numericfield',
                                        id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PendapatanCalculate',
                                        name: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PendapatanCalculate',
                                        readOnly:m_act_update,
										readOnly:true,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false
                                    },{
                                        xtype: 'hiddenfield',
                                        id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PendapatanCalculateTemp',
                                        name: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PendapatanCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200
                                    },{
										html:"<div style='margin-top:33px'></div>"
									}]
                                }]
                            }]
                        },{
                            xtype: 'panel',
                            title: lang('Biaya Operasional'),
                            frame: false,
                            style: 'margin-top:5px;',
                            cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    // style: 'padding:10px 10px 10px 0px;',
                                    items: [{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ProyekCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ProyekCalculate',
										readOnly:true,
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ProyekCalculateTemp',
                                        name: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ProyekCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200
                                    },{
										html:"<div style='margin-top:33px'></div>"
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TransportCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TransportCalculate',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TransportCalculateTemp',
                                        name: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TransportCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200
                                    },{
										html:"<div style='margin-top:33px'></div>"
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-AntigenCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-AntigenCalculate',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-AntigenCalculateTemp',
                                        name: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-AntigenCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200
                                    },{
										html:"<div style='margin-top:33px'></div>"
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ATKCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ATKCalculate',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ATKCalculateTemp',
                                        name: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ATKCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200
                                    },{
										html:"<div style='margin-top:33px'></div>"
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-EntertaintCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-EntertaintCalculate',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-EntertaintCalculateTemp',
                                        name: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-EntertaintCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200
                                    },{
										html:"<div style='margin-top:33px'></div>"
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-MateraiCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-MateraiCalculate',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-MateraiCalculateTemp',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-MateraiCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										html:"<div style='margin-top:33px'></div>"
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ADMCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ADMCalculate',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ADMCalculateTemp',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ADMCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										html:"<div style='margin-top:33px'></div>"
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ARTCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ARTCalculate',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ARTCalculateTemp',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ARTCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										html:"<div style='margin-top:33px'></div>"
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengirimanBarangCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengirimanBarangCalculate',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengirimanBarangCalculateTemp',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengirimanBarangCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										html:"<div style='margin-top:33px'></div>"
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-IuranCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-IuranCalculate',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-IuranCalculateTemp',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-IuranCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										html:"<div style='margin-top:33px'></div>"
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengobatanCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengobatanCalculate',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengobatanCalculateTemp',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengobatanCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										html:"<div style='margin-top:33px'></div>"
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ART2Calculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ART2Calculate',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ART2CalculateTemp',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ART2CalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										html:"<div style='margin-top:33px'></div>"
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BPJSCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BPJSCalculate',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BPJSCalculateTemp',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BPJSCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										html:"<div style='margin-top:33px'></div>"
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ListrikInetCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ListrikInetCalculate',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ListrikInetCalculateTemp',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ListrikInetCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										html:"<div style='margin-top:33px'></div>"
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-InsentiveCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-InsentiveCalculate',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-InsentiveCalculateTemp',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-InsentiveCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										html:"<div style='margin-top:33px'></div>"
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SalaryCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SalaryCalculate',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SalaryCalculateTemp',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SalaryCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										html:"<div style='margin-top:33px'></div>"
									},{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaPenyusutanCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaPenyusutanCalculate',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaPenyusutanCalculateTemp',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaPenyusutanCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
										html:"<div style='margin-top:34px'></div>"
									}]
                                }]
                            }]
                        },{
                            xtype: 'panel',
                            title: lang('Pendapatan / Biaya Lain Lain'),
                            frame: false,
                            style: 'margin-top:12px;',
                            cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    style: 'padding:10px 0px 10px 5px;',
                                    items: [{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaAdminBankCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaAdminBankCalculate',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    },{
                                        xtype: 'hiddenfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaAdminBankCalculateTemp',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaAdminBankCalculateTemp',
                                        readOnly:m_act_update,
                                        labelWidth:200,
                                        // Remove spinner buttons, and arrow key and mouse wheel listeners
                                        hideTrigger: true,
                                        keyNavEnabled: false,
                                        mouseWheelEnabled: false,
                                    }]
                                }]
                            }]
                        },{
                            xtype: 'panel',
                            title: lang('Total Biaya Operasinal'),
                            frame: false,
                            style: 'margin-top:5px;',
                            cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    // style: 'padding:10px 10px 10px 0px;',
                                    items: [{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalBiayaOperasionalCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalBiayaOperasionalCalculate',
                                        readOnly: true,
                                        labelWidth:200,
                                    },{
                                        xtype: 'hiddenfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalBiayaOperasionalCalculateTemp',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalBiayaOperasionalCalculateTemp',
                                        readOnly: true,
                                        labelWidth:200,
                                    }]
                                }]
                            }]
                        },{
                            xtype: 'panel',
                            title: lang('Total Pendapatan / Biaya Lain'),
                            frame: false,
                            style: 'margin-top:5px;',
                            cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    // style: 'padding:10px 10px 10px 0px;',
                                    items: [{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalPendapatanLainCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalPendapatanLainCalculate',
                                        readOnly: true,
                                        labelWidth:200,
                                    },{
                                        xtype: 'hiddenfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalPendapatanLainCalculateTemp',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalPendapatanLainCalculateTemp',
                                        readOnly: true,
                                        labelWidth:200,
                                    }]
                                }]
                            }]
                        },{
                            xtype: 'panel',
                            title: lang('Laba (Rugi)'),
                            frame: false,
                            style: 'margin-top:5px;',
                            cls: 'Sfr_PanelSubLayoutFormRoundedGray',
                            items: [{
                                layout: 'column',
                                border: false,
                                items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    // style: 'padding:10px 10px 10px 0px;',
                                    items: [{
                                        xtype: 'numericfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-LabaRugiCalculate',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-LabaRugiCalculate',
                                        readOnly: true,
                                        labelWidth:200,
                                    },{
                                        xtype: 'hiddenfield',
                                        id:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-LabaRugiCalculateTemp',
                                        name:'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-LabaRugiCalculateTemp',
                                        readOnly: true,
                                        labelWidth:200,
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            }],
            buttons: [{
                xtype: 'button',
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/floppy-disk.svg',
                text: lang('Save'),
                hidden:m_act_update,
                cls: 'Sfr_BtnFormBlue',
                overCls: 'Sfr_BtnFormBlue-Hover',
                id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnSave',
                handler: function () {
                    var Formnya         = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm();

                    if (Formnya.isValid()) {
                        Formnya.submit({
                            url: m_api + '/v1/report/Neraca/submit_laba_rugi',
                            method: 'POST',
                            waitMsg: 'Saving data Neraca...',
                            params:{
                                month   : Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue(),
                                year    : Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue()
                            },
                            success: function (fp, o) {
                                Swal.fire({
                                    text: "Data saved",
                                    icon: 'success',
                                    confirmButtonColor: '#3085d6',
                                }).then((result) => {
                                    
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
            },{
                xtype: 'button',
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/print.svg',
                text: lang('Cetak'),
                cls: 'Sfr_BtnFormBlue',
                overCls: 'Sfr_BtnFormBlue-Hover',
                id: 'MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BtnCetak',
                handler: function () {
                    var url = m_api + '/v1/report/printout/print_laba_rugi';
                    preview_cetak_surat(url + '?Month='+Ext.getCmp("MitraJaya.view.Report.Neraca.MainGrid-Month").getValue()+'&Year='+Ext.getCmp("MitraJaya.view.Report.Neraca.MainGrid-Year").getValue());
                }
            }]
        });

        thisObj.items = [{
            layout: 'column',
            border: false,
            items: [{
                //LEFT CONTENT
                columnWidth: 0.5,
                style:"padding-right:10px",
                items: {
                    layout: 'column',
                    border: false,
                    items: [{
                        columnWidth: 1,
                        layout: 'form',
                        cls: 'Sfr_PanelLayoutFormContainer',
                        items: thisObj.GridOption
                    },{
                        columnWidth: 1,
                        layout: 'form',
                        cls: 'Sfr_PanelLayoutFormContainer',
                        items:thisObj.FormNeraca
                    }]
                }
            },{
                //RIGHT CONTENT
                columnWidth: 0.5,
                items: {
                    layout: 'column',
                    border: false,
                    items: [{
                        columnWidth: 1,
                        layout: 'form',
                        style:'margin-top:80px',
                        cls: 'Sfr_PanelLayoutFormContainer',
                        items:thisObj.FormLabaRugi
                    }]
                }
            }]
        }];

        this.callParent(arguments);
    }, 
    CalculateActivaLancar: function (field, event) { 
        let Kas         = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Kas').getValue();
        let KasKecil    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-KasKecil').getValue();
        let Bank1       = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Bank1').getValue();
        let Bank2       = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Bank2').getValue();
        let PiutangKaryawan       = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-PiutangKaryawan').getValue();
        let Persediaan            = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Persediaan').getValue();
        let PiutangDagang         = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-PiutangDagang').getValue();
        let PajakDimuka           = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-PajakDimuka').getValue();

        let TotalNeraca = Kas+KasKecil+Bank1+Bank2+PiutangKaryawan+Persediaan+PiutangDagang+PajakDimuka;

        Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-TotalAktivaLancar').setValue(TotalNeraca);
    },CalculateActivaTetap(str, n) {
        let PerlengkapanKantor  = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-PerlengkapanKantor').getValue();
        let Akumulasi           = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Akumulasi').getValue();

        let TotalNeracaTetap    = PerlengkapanKantor+Akumulasi;

        Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-TotalAktivTetap').setValue(TotalNeracaTetap);
    },CalculatorTotal(str, n){
        let ActivaLancar    = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-TotalAktivaLancar').getValue();
        let ActivaTetap     = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-TotalAktivTetap').getValue();

        let Total           = ActivaLancar+ActivaTetap;
        Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Total').setValue(Total);
    },CalculatePasiva(str, n){
        let HutangDireksi   = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-HutangDireksi').getValue();
        let HutangPajak     = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-HutangPajak').getValue();
        let Modal           = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-Modal').getValue();
        let LabaRugiBertahan           = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-LabaRugiBertahan').getValue();
        let LabaRugiBerjalan           = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-LabaRugiBerjalan').getValue();

        let TotalPasiva           = HutangDireksi+HutangPajak+Modal+LabaRugiBertahan+LabaRugiBerjalan;
        Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca-TotalPasiva').setValue(TotalPasiva);
    },CalculateLabaRugi(){
        let Pendapatan = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Pendapatan').getValue();
        let Proyek = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Proyek').getValue();
        let Transport = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Transport').getValue();
        let Antigen = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Antigen').getValue();
        let ATK = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ATK').getValue();
        let Entertaint = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Entertaint').getValue();
        let Materai = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Materai').getValue();
        let ADM = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ADM').getValue();
        let ART = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ART').getValue();
        let ART2 = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ART2').getValue();
        let Pengobatan = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Pengobatan').getValue();
        let PengirimanBarang = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengirimanBarang').getValue();
        let Iuran = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Iuran').getValue();
        let BPJS = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BPJS').getValue();
        let ListrikInet = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ListrikInet').getValue();
        let Insentive = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Insentive').getValue();
        let Salary = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Salary').getValue();
        let BiayaPenyusutan = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaPenyusutan').getValue();
        let BiayaAdminBank = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaAdminBank').getValue();

        let TotalPengeluaran = Proyek+Transport+Antigen+ATK+Entertaint+Materai+ADM+ART+PengirimanBarang+Iuran+ART2+Pengobatan+BPJS+ListrikInet+Insentive+Salary+BiayaPenyusutan;

        let LabaRugi = Pendapatan - TotalPengeluaran - BiayaAdminBank;


        Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalBiayaOperasional').setValue(TotalPengeluaran);
        Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalPendapatanLain').setValue(BiayaAdminBank);
        Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-LabaRugi').setValue(LabaRugi);
    },CalculateLabaRugiCompute(){
        let Pendapatan 					= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Pendapatan').getValue());
        let PendapatanCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PendapatanCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PendapatanCalculate').setValue(Pendapatan+PendapatanCalculateTemp);
		
        let Proyek = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Proyek').getValue();
        let ProyekCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ProyekCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ProyekCalculate').setValue(Proyek+ProyekCalculateTemp);

        let Transport = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Transport').getValue();
        let TransportCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TransportCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TransportCalculate').setValue(Transport+TransportCalculateTemp);

        let Antigen = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Antigen').getValue();
        let AntigenCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-AntigenCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-AntigenCalculate').setValue(Antigen+AntigenCalculateTemp);

        let ATK = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ATK').getValue();
        let ATKCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ATKCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ATKCalculate').setValue(ATK+ATKCalculateTemp);

        let Entertaint = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Entertaint').getValue();
        let EntertaintCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-EntertaintCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-EntertaintCalculate').setValue(Entertaint+EntertaintCalculateTemp);

        let Materai = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Materai').getValue();
        let MateraiCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-MateraiCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-MateraiCalculate').setValue(Materai+MateraiCalculateTemp);

        let ADM = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ADM').getValue();
        let ADMCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ADMCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ADMCalculate').setValue(ADM+ADMCalculateTemp);

        let ART = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ART').getValue();
        let ARTCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ARTCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ARTCalculate').setValue(ART+ARTCalculateTemp);

        let ART2 = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ART2').getValue();
        let ART2CalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ART2CalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ART2Calculate').setValue(ART2+ART2CalculateTemp);

        let Pengobatan = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Pengobatan').getValue();
        let PengobatanCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengobatanCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengobatanCalculate').setValue(Pengobatan+PengobatanCalculateTemp);

        let PengirimanBarang = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengirimanBarang').getValue();
        let PengirimanBarangCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengirimanBarangCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-PengirimanBarangCalculate').setValue(PengirimanBarang+PengirimanBarangCalculateTemp);

        let Iuran = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Iuran').getValue();
        let IuranCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-IuranCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-IuranCalculate').setValue(Iuran+IuranCalculateTemp);

        let BPJS = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BPJS').getValue();
        let BPJSCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BPJSCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BPJSCalculate').setValue(BPJS+BPJSCalculateTemp);

        let ListrikInet = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ListrikInet').getValue();
        let ListrikInetCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ListrikInetCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-ListrikInetCalculate').setValue(ListrikInet+ListrikInetCalculateTemp);

        let Insentive = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Insentive').getValue();
        let InsentiveCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-InsentiveCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-InsentiveCalculate').setValue(Insentive+InsentiveCalculateTemp);

        let Salary = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-Salary').getValue();
        let SalaryCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SalaryCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-SalaryCalculate').setValue(Salary+SalaryCalculateTemp);

        let BiayaPenyusutan = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaPenyusutan').getValue();
        let BiayaPenyusutanCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaPenyusutanCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaPenyusutanCalculate').setValue(BiayaPenyusutan+BiayaPenyusutanCalculateTemp);

        let BiayaAdminBank = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaAdminBank').getValue();
        let BiayaAdminBankCalculateTemp 	= parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaAdminBankCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-BiayaAdminBankCalculate').setValue(BiayaAdminBank+BiayaAdminBankCalculateTemp);

		let TotalBiayaOperasional = parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalBiayaOperasional').getValue());
		let TotalBiayaOperasionalCalculateTemp = parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalBiayaOperasionalCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalBiayaOperasionalCalculate').setValue(TotalBiayaOperasional+TotalBiayaOperasionalCalculateTemp);

		let TotalPendapatanLain = parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalPendapatanLain').getValue());
		let TotalPendapatanLainCalculateTemp = parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalPendapatanLainCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-TotalPendapatanLainCalculate').setValue(TotalPendapatanLain+TotalPendapatanLainCalculateTemp);

		
		let LabaRugi = parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-LabaRugi').getValue());
		let LabaRugiCalculateTemp = parseInt(Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-LabaRugiCalculateTemp').getValue());
		Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi-LabaRugiCalculate').setValue(LabaRugi+LabaRugiCalculateTemp);
	},LoadForm(month,year){
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        if(month === undefined){
            month = m_month;
        }
        if(year === undefined){
            year = m_year;
        }

        Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-FormNeraca').setTitle("Neraca "+ monthNames[month-1]+' '+year);

		MonthText = (month == 1) ? "Bulan Januari" : "Bulan Januari - "+ monthNames[month-1];
		Ext.getCmp('LabaRugiNew-Text').setText(MonthText);

        //load formnya
        Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormNeraca').getForm().load({
            url: m_api + '/v1/report/Neraca/data',
            method: 'GET',
            params: {
                month: month,
                year:year
            },
            success: function (form, action) {
                // Ext.MessageBox.hide();
                var r = Ext.decode(action.response.responseText);

                console.log(r);
            },
            failure: function (form, action) {
                Swal.fire({
                    icon: 'error',
                    text: 'Failed to Retreive Data',
                })
            }
        });

        Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-FormLabaRugi').setTitle("Laba (Rugi) "+ monthNames[month-1]+' '+year);

        //load formnya
        Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid.Form-FormLabaRugi').getForm().load({
            url: m_api + '/v1/report/Neraca/data_laba_rugi',
            method: 'GET',
            params: {
                month: month,
                year:year
            },
            success: function (form, action) {
                // Ext.MessageBox.hide();
                var r = Ext.decode(action.response.responseText);
                
				setTimeout( function(){
					Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid').CalculateLabaRugiCompute();
				}, 1000)
            },
            failure: function (form, action) {
                Swal.fire({
                    icon: 'error',
                    text: 'Failed to Retreive Data',
                })
            }
        });
    }
});

function setFilterLs() {
    thisObj = this;
    var month = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Month').getValue();
    var year = Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid-Year').getValue();

    localStorage.setItem('neraca', JSON.stringify({
        month	: month,
        year	: year
    }));
    
    Ext.getCmp('MitraJaya.view.Report.Neraca.MainGrid').LoadForm(month, year);
}   

function fetchJSON(text){
    try{
        JSON.parse(text);
        return true;
    }
    catch (error){
        return false;
    }
}
