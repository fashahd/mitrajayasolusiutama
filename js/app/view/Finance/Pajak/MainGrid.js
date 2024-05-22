/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.view.Finance.Pajak.MainGrid' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Finance.Pajak.MainGrid',
    renderTo: 'ext-content',
    style:'padding:0 7px 7px 7px;margin:2px 0 0 0;',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;
            document.getElementById('ContentTopBar').style.display = 'block';

            var pajak_src = JSON.parse(localStorage.getItem('pajak_src'));

            if(pajak_src){
                Ext.getCmp('MitraJaya.view.Finance.Pajak.MainGrid-Year').setValue(pajak_src.Year);
			}
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain 		= Ext.create('MitraJaya.store.Finance.Pajak.MainGrid');
        thisObj.StoreGridMainPPNDN 	= Ext.create('MitraJaya.store.Finance.Pajak.MainGridPPNDN');

        thisObj.combo_month = Ext.create('MitraJaya.store.General.StoreMonth');
		
        thisObj.combo_year = Ext.create('MitraJaya.store.General.StoreYear',{
            storeVar: {
                yearRange: 20
            }
        });

        //ContextMenu
        thisObj.ContextMenuGrid = Ext.create('Ext.menu.Menu',{
            cls:'Sfr_ConMenu',
	        items:[{
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
                text: 'View',
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.Finance.Pajak.MainGrid-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Finance.Pajak.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    
					var WinPajak = Ext.create('MitraJaya.view.Finance.Pajak.WinPajak',{
                        viewVar:{
							OpsiDisplay: 'view',
							Month: sm.get('Month'),
							Period: sm.get('Period'),
							Year: sm.get('Year'),
							Amount: sm.get('Amount'),
							VATAmount: sm.get('VATAmount'),
                            CallerStore: thisObj.StoreGridMain,
							PaidAmountVal: sm.get('PaidAmountVal'),
							ReportStatus: sm.get('ReportStatus')
                        }
                    });

                    if (!WinPajak.isVisible()) {
                        WinPajak.center();
                        WinPajak.show();
                    } else {
                        WinPajak.close();
                    }
	            }
	        },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
                text: 'Update',
                cls:'Sfr_BtnConMenuWhite',
                hidden: m_act_update,
                itemId: 'MitraJaya.view.Finance.Pajak.MainGrid-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Finance.Pajak.MainGrid-Grid').getSelectionModel().getSelection()[0];
                    
					var WinPajak = Ext.create('MitraJaya.view.Finance.Pajak.WinPajak',{
                        viewVar:{
							OpsiDisplay: 'update',
							Month: sm.get('Month'),
							Period: sm.get('Period'),
							Year: sm.get('Year'),
							Amount: sm.get('Amount'),
							VATAmount: sm.get('VATAmount'),
							PaidAmountVal: sm.get('PaidAmountVal'),
                            CallerStore: thisObj.StoreGridMain,
							ReportStatus: sm.get('ReportStatus')
                        }
                    });

                    if (!WinPajak.isVisible()) {
                        WinPajak.center();
                        WinPajak.show();
                    } else {
                        WinPajak.close();
                    }
	            }
	        }]
	    });

		thisObj.gridPPN = [{
            layout: 'column',
            border: false,
            items: [{
				columnWidth: 1,
				layout: 'form',
				cls: 'Sfr_PanelLayoutFormContainer',
				items: [{
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
								id:'MitraJaya.view.Finance.Pajak.MainGrid-Year',
								name:'MitraJaya.view.Finance.Pajak.MainGrid-Year',
								labelAlign:'top',
								fieldLabel:'Tax Period Year',
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
								text:'Search',
								style:'margin-left:20px; margin-top:30px',
								cls:'Sfr_BtnFormCyan',
								overCls:'Sfr_BtnFormCyan-Hover',
								id: 'MitraJaya.view.Finance.Pajak.MainGrid-BtnApplyFilter',
								handler: function() {
									console.log("test");
									setFilterLs();
								}
							}]
						}]
					}]
				}]
			}]
        }, {
            xtype: 'grid',
            id: 'MitraJaya.view.Finance.Pajak.MainGrid-Grid',
            style: 'border:1px solid #CCC;margin-top:4px;',
            cls:'Sfr_GridNew',
			minHeight:600,
			features: [{
				ftype: 'summary'
			}],
            loadMask: true,
            selType: 'rowmodel',
            store: thisObj.StoreGridMain,
            enableColumnHide: false,
            viewConfig: {
                deferEmptyText: false,
                emptyText: GetDefaultContentNoData()
            },
            dockedItems: [{
                xtype: 'toolbar',
                dock:'top',
                items: [{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/download.svg',
                    text: 'Export',
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_export_excel,
                    id: 'MitraJaya.view.Finance.Pajak.MainGrid-BtnExport',
                    handler: function() {
						var Year		= Ext.getCmp('MitraJaya.view.Finance.Pajak.MainGrid-Year').getValue();

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
									url: m_api + '/v1/finance/invoice/export_invoice',
									method: 'POST',
									waitMsg: 'Please Wait',
									params: {
										keySearch : keySearch,
										Month : Month,
										Year : Year,
										CustomerID : CustomerID
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
										Ext.MessageBox.hide();										
										Swal.fire({
											icon: 'error',
											text: 'Failed to export, Please try again',
											// footer: '<a href="">Why do I have this issue?</a>'
										})
									}
								});
							}
						})
                    }
                },{
                    html:'<div>PPN DN Keluaran</div>'
                },{
                    xtype:'tbspacer',
                    flex:1
                },{
                    icon: varjs.config.base_url + 'images/icons/new/add-filter.png',
                    cls: 'Sfr_BtnGridPaleBlue',
                    text: 'Advanced Filter',
					hidden:true,
                    handler: function () {
                        //advanced search
                        var winAdvFilter = Ext.create('MitraJaya.view.Finance.Invoice.WinAdvancedFilter');
                        if (!winAdvFilter.isVisible()) {
                            winAdvFilter.center();
                            winAdvFilter.show();
                        } else {
                            winAdvFilter.close();
                        }
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/recycle.svg',
                    cls:'Sfr_BtnGridBlue',
                    overCls:'Sfr_BtnGridBlue-Hover',
                    id: 'MitraJaya.view.Finance.Pajak.MainGrid-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Finance.Pajak.MainGrid-Grid').getStore().loadPage(1);
                    }
                }]
            }],
            columns:[{
            	text: '',
                xtype:'actioncolumn',
                flex: 5,
                items:[{
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/caret-down.svg',
                    handler: function(grid, rowIndex, colIndex, item, e, record) {
                        thisObj.ContextMenuGrid.showAt(e.getXY());
                    }
                }]
            },{
                text: 'No',
                flex: 1,
                xtype: 'rownumberer'
            },{
                text: 'PajakID',
                dataIndex: 'PajakID',
                hidden: true
            },{
                text: 'Period',
                dataIndex: 'Period',
                flex:10,
				summaryRenderer: function(value, summaryData, dataIndex) {
					return 'Total'; 
				}
            },{
                text: 'Amount',
                dataIndex: 'VATAmount',
                flex: 15,
				summaryType: 'sum',
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.VATAmount, 2);
					
                    return RetVal;
                }
            },{
                text: 'Paid Amount',
                dataIndex: 'PaidAmountVal',
                flex: 15,
				summaryType: 'sum',
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.PaidAmountVal, 2);
					
                    return RetVal;
                }
            },{
                text: 'Over Paid',
                dataIndex: 'OverpaidVal',
                flex: 10,
				summaryType: 'sum',
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.OverpaidVal, 2);
					
                    return RetVal;
                }
				// summaryType: function(records){
				// 	var totals = records.reduce(function(sums, record){
				// 		console.log(record.data.OverpaidVal);
				// 		return [record.data.OverpaidVal + record.data.OverpaidVal];
				// 	}, [0]);
				
				// 	return totals[0];
				// }
            },{
                text: 'Report Status',
                dataIndex: 'ReportStatus',
                flex: 10,
                renderer: function (t, meta, record) {
                    let RetVal;
					if(record.data.ReportStatus == "1"){
						RetVal = `<span class="external-event bg-success ui-draggable ui-draggable-handle"><i class="fas fa-check"></i></span>`;
					}else{
						RetVal = `<span class="external-event bg-danger ui-draggable ui-draggable-handle"><i class="fas fa-times"></i></span>`;
					}
                    return RetVal;
                }
            }]
        }];

		thisObj.PPNdn = [{
            xtype: 'grid',
            id: 'MitraJaya.view.Finance.Pajak.MainGrid-PPNDN-Grid',
            style: 'border:1px solid #CCC;margin-top:80px;',
            cls:'Sfr_GridNew',
			minHeight:600,
			features: [{
				ftype: 'summary'
			}],
            loadMask: true,
            selType: 'rowmodel',
            store: thisObj.StoreGridMainPPNDN,
            enableColumnHide: false,
            viewConfig: {
                deferEmptyText: false,
                emptyText: GetDefaultContentNoData()
            },
            dockedItems: [{
                xtype: 'toolbar',
                dock:'top',
                items: [{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/download.svg',
                    text: 'Export',
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_export_excel,
                    id: 'MitraJaya.view.Finance.Pajak.MainGrid-PPNDN-BtnExport',
                    handler: function() {
						var Year		= Ext.getCmp('MitraJaya.view.Finance.Pajak.MainGrid-PPNDN-Year').getValue();

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
									url: m_api + '/v1/finance/invoice/export_invoice',
									method: 'POST',
									waitMsg: 'Please Wait',
									params: {
										keySearch : keySearch,
										Month : Month,
										Year : Year,
										CustomerID : CustomerID
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
										Ext.MessageBox.hide();										
										Swal.fire({
											icon: 'error',
											text: 'Failed to export, Please try again',
											// footer: '<a href="">Why do I have this issue?</a>'
										})
									}
								});
							}
						})
                    }
                },{
                    html:'<div>PPN DN Masukan</div>'
                },{
                    xtype:'tbspacer',
                    flex:1
                },{
                    icon: varjs.config.base_url + 'images/icons/new/add-filter.png',
                    cls: 'Sfr_BtnGridPaleBlue',
                    text: 'Advanced Filter',
					hidden:true,
                    handler: function () {
                        //advanced search
                        var winAdvFilter = Ext.create('MitraJaya.view.Finance.Invoice.WinAdvancedFilter');
                        if (!winAdvFilter.isVisible()) {
                            winAdvFilter.center();
                            winAdvFilter.show();
                        } else {
                            winAdvFilter.close();
                        }
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/recycle.svg',
                    cls:'Sfr_BtnGridBlue',
                    overCls:'Sfr_BtnGridBlue-Hover',
                    id: 'MitraJaya.view.Finance.Pajak.MainGrid-PPNDN-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Finance.Pajak.MainGrid-PPNDN-Grid').getStore().loadPage(1);
                    }
                }]
            }],
            columns:[{
                text: 'No',
                flex: 0.5,
                xtype: 'rownumberer'
            },{
                text: 'PajakID',
                dataIndex: 'PajakID',
                hidden: true
            },{
                text: 'Period',
                dataIndex: 'Period',
                flex:15,
				summaryRenderer: function(value, summaryData, dataIndex) {
					return 'Total'; 
				}
            },{
                text: 'Amount',
                dataIndex: 'VATAmount',
                flex: 15,
				summaryType: 'sum',
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.VATAmount, 2);
					
                    return RetVal;
                }
            }]
        }];

        thisObj.items = [{
            layout: 'column',
            border: false,
            items: [{
                //LEFT CONTENT
                columnWidth: 0.6,
                items: thisObj.gridPPN
            },{
                //LEFT CONTENT
                columnWidth: 0.4,
				style:'padding-left:20px',
                items: thisObj.PPNdn
            }]
        }];

        this.callParent(arguments);
    }, 
    submitOnEnterGrid: function (field, event) {        
		localStorage.setItem('pajak_src', JSON.stringify({
			Year		: Ext.getCmp('MitraJaya.view.Finance.Pajak.MainGrid-Year').getValue()
		}));
		Ext.getCmp('MitraJaya.view.Finance.Pajak.MainGrid-Grid').getStore().loadPage(1);
		Ext.getCmp('MitraJaya.view.Finance.Pajak.MainGrid-PPNDN-Grid').getStore().loadPage(1);
    }
});

function setFilterLs() {
	localStorage.setItem('pajak_src', JSON.stringify({
		Year		: Ext.getCmp('MitraJaya.view.Finance.Pajak.MainGrid-Year').getValue()
	}));
	Ext.getCmp('MitraJaya.view.Finance.Pajak.MainGrid-Grid').getStore().loadPage(1);
	Ext.getCmp('MitraJaya.view.Finance.Pajak.MainGrid-PPNDN-Grid').getStore().loadPage(1);
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
