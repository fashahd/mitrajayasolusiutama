/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.view.Report.Aktiva.MainGrid' ,{
    extend: 'Ext.panel.Panel',
    id: 'MitraJaya.view.Report.Aktiva.MainGrid',
    renderTo: 'ext-content',
    style:'padding: 0px ; margin: 0px;',
    listeners: {
        afterRender: function(component, eOpts){
            var thisObj = this;

			var aktiva_src = JSON.parse(localStorage.getItem('aktiva_src'));

            if(aktiva_src){
                Ext.getCmp('MitraJaya.view.Report.Aktiva.MainGrid-Month').setValue(aktiva_src.Month);				
                Ext.getCmp('MitraJaya.view.Report.Aktiva.MainGrid-Year').setValue(aktiva_src.Year);
            }
            // document.getElementById('ContentTopBar').style.display = 'block';
        }
    },
    initComponent: function() {
        var thisObj = this;

		// console.log(m_api);
        //Store
        thisObj.StoreGridMain = Ext.create('MitraJaya.store.Report.Aktiva.MainGrid');

		thisObj.combo_month = Ext.create('MitraJaya.store.General.StoreMonth');
		

		thisObj.combo_year = Ext.create('MitraJaya.store.General.StoreYear',{
        	storeVar: {
                yearRange: 20
            }
        });

		thisObj.cost_element = Ext.create('MitraJaya.store.General.CostComponent');

        //ContextMenu
        thisObj.ContextMenuGrid = Ext.create('Ext.menu.Menu',{
            cls:'Sfr_ConMenu',
	        items:[{
                icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/eye.svg',
                text: 'View',
                cls:'Sfr_BtnConMenuWhite',
                itemId: 'MitraJaya.view.Report.Aktiva.MainGrid-ContextMenuView',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Report.Aktiva.MainGrid-Grid').getSelectionModel().getSelection()[0];

                    var WinFormAktiva = Ext.create('MitraJaya.view.Report.Aktiva.WinFormAktiva');

                    WinFormAktiva.setViewVar({
                        OpsiDisplay:'view',
                        AktivaID:sm.get('AktivaID'),
                        CallerStore: thisObj.StoreGridMain
                    });

                    if (!WinFormAktiva.isVisible()) {
                        WinFormAktiva.center();
                        WinFormAktiva.show();
                    } else {
                        WinFormAktiva.close();
                    }
	            }
	        },{
	            icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/pen-to-square.svg',
                text: 'Update',
                cls:'Sfr_BtnConMenuWhite',
                hidden: m_act_update,
                itemId: 'MitraJaya.view.Report.Aktiva.MainGrid-ContextMenuUpdate',
	            handler: function() {
                    var sm = Ext.getCmp('MitraJaya.view.Report.Aktiva.MainGrid-Grid').getSelectionModel().getSelection()[0];

                    var WinFormAktiva = Ext.create('MitraJaya.view.Report.Aktiva.WinFormAktiva');

                    WinFormAktiva.setViewVar({
                        OpsiDisplay:'update',
                        AktivaID:sm.get('AktivaID'),
                        CallerStore: thisObj.StoreGridMain
                    });

                    if (!WinFormAktiva.isVisible()) {
                        WinFormAktiva.center();
                        WinFormAktiva.show();
                    } else {
                        WinFormAktiva.close();
                    }
	            }
	        }]
	    });

        thisObj.items = [
		{
            xtype: 'grid',
            id: 'MitraJaya.view.Report.Aktiva.MainGrid-Grid',
            style: 'border:1px solid #CCC;margin-top:4px;',
            cls:'Sfr_GridNew',
			minHeight: 600,
			autoScroll: true,
            loadMask: true,
            selType: 'rowmodel',
            features: [{
                ftype: 'summary'
            }],
            store: thisObj.StoreGridMain,
            enableColumnHide: false,
            viewConfig: {
                deferEmptyText: false,
                emptyText: GetDefaultContentNoData()
            },
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: thisObj.StoreGridMain,
                dock: 'bottom',
                displayInfo: true,
                displayMsg: 'Showing'+' {0} '+'to'+' {1} '+'of'+' {2} '+'data'
            },{
                xtype: 'toolbar',
                dock:'top',
                items: [{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/regular/square-plus.svg',
                    text: 'Add',
                    hidden: m_act_add,
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    id: 'MitraJaya.view.Finance.OrderBook.MainGrid-BtnAdd',
                    handler: function() {
                        var WinFormAktiva = Ext.create('MitraJaya.view.Report.Aktiva.WinFormAktiva');
						var month 	= Ext.getCmp('MitraJaya.view.Report.Aktiva.MainGrid-Month').getValue();
						var year 	= Ext.getCmp('MitraJaya.view.Report.Aktiva.MainGrid-Year').getValue();

                        WinFormAktiva.setViewVar({
                            OpsiDisplay:'insert',
							month:month,
							year:year,
                            CallerStore: thisObj.StoreGridMain
                        });
                        if (!WinFormAktiva.isVisible()) {
                            WinFormAktiva.center();
                            WinFormAktiva.show();
                        } else {
                            WinFormAktiva.close();
                        }
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/file-export.svg',
                    text: 'Export',
                    cls:'Sfr_BtnGridNewWhite',
                    overCls:'Sfr_BtnGridNewWhite-Hover',
                    hidden: m_act_export_excel,
                    id: 'MitraJaya.view.Finance.OrderBook.MainGrid-BtnExport',
                    handler: function() {
						var keySearch	= Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-keySearch').getValue();
						var StartDate	= Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-StartDate').getValue();
						var EndDate		= Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-EndDate').getValue();
						var CustomerID	= Ext.getCmp('MitraJaya.view.Finance.OrderBook.MainGrid-CustomerID').getValue();

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
									url: m_api + '/v1/finance/order/export_order',
									method: 'POST',
									waitMsg: 'Please Wait',
									params: {
										keySearch : keySearch,
										StartDate : StartDate,
										EndDate : EndDate,
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
                    xtype:'tbspacer',
                    flex:1
                },{
					xtype: 'combobox',
					id:"MitraJaya.view.Report.Aktiva.MainGrid-Month",
					name:"MitraJaya.view.Report.Aktiva.MainGrid-Month",
					store:thisObj.combo_month,
					queryMode:'local',
					displayField:'label',
					valueField:'id',
					value:m_month
				},{
					xtype: 'combobox',
					id:"MitraJaya.view.Report.Aktiva.MainGrid-Year",
					name:"MitraJaya.view.Report.Aktiva.MainGrid-Year",
					store:thisObj.combo_year,
					queryMode:'local',
					displayField:'label',
					valueField:'id',
					value:m_year
				},{
                    cls: 'Sfr_BtnGridPaleBlue',
                    text: 'Apply',
					cls: 'Sfr_BtnFormBlue',
					overCls: 'Sfr_BtnFormBlue-Hover',
					style:'margin-right:20px',
                    handler: function () {
						setFilterLs();
                    }
                },{
                    xtype:'button',
                    icon: varjs.config.base_url + 'assets/icons/font-awesome/svgs/solid/recycle.svg',
                    cls:'Sfr_BtnGridBlue',
                    overCls:'Sfr_BtnGridBlue-Hover',
                    id: 'MitraJaya.view.Report.Aktiva.MainGrid-BtnReload',
                    handler: function() {
                        Ext.getCmp('MitraJaya.view.Report.Aktiva.MainGrid-Grid').getStore().loadPage(1);
                    }
                }]
            }],
            columns:[{
            	text: '',
                xtype:'actioncolumn',
                flex: 0.2,
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
                text: 'AktivaID',
                dataIndex: 'AktivaID',
                hidden: true
            },{
                text: 'Keterangan',
                dataIndex: 'Description',
                flex: 10,
				summaryRenderer: function(value, summaryData, dataIndex) {
					return 'Total Peralatan';
				}
            },{
                text: 'Unit',
                dataIndex: 'Unit',
                flex: 5
            },{
                text: 'Tarif',
                dataIndex: 'Tarif',
                flex: 5,
				renderer: function (t, meta, record) {

                    let RetVal;

					RetVal  = record.data.Rate+' %';
					
                    return RetVal;
                }
            },{
                text: 'TH Pembelian',
                dataIndex: 'Month',
                flex: 10,
				renderer: function (t, meta, record) {
					const monthNames = ["January", "February", "March", "April", "May", "June",
					"July", "August", "September", "October", "November", "December"
					];

                    let RetVal;

					RetVal  = monthNames[record.data.Month-1]+ '-'+record.data.Year;
					
                    return RetVal;
                }
            },{
                text: 'Nilai Perolehan',
                dataIndex: 'InputValue',
                flex: 15,
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.InputValue, 2);
					
                    return RetVal;
                }
            },{
                text: 'Total',
                dataIndex: 'Total',
                flex: 15,
                summaryType: 'sum',
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.Total, 2);
					
                    return RetVal;
                }
            },{
                text: 'Akumulasi Penyusutan Akhir',
                dataIndex: 'FinalAccumulated',
                flex: 15,
                summaryType: 'sum',
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.FinalAccumulated, 2);
					
                    return RetVal;
                }
            },{
                text: 'Nilai Buku Akhir',
                dataIndex: 'FinalBookValue',
                flex: 15,
                summaryType: 'sum',
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.FinalBookValue, 2);
					
                    return RetVal;
                }
            },{
                text: 'Biaya Penyusutan Bulan Ini',
                dataIndex: 'CostDecreasing',
                flex: 15,
                summaryType: 'sum',
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.CostDecreasing, 2);
					
                    return RetVal;
                }
            },{
                text: 'Akumulasi Penyusutan Akhir',
                dataIndex: 'FinalAccumulatedCost',
                flex: 15,
                summaryType: 'sum',
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.FinalAccumulatedCost, 2);
					
                    return RetVal;
                }
            },{
                text: 'Nilai Buku Akhir',
                dataIndex: 'FinalBookValueCost',
                flex: 15,
                summaryType: 'sum',
				renderer: function (t, meta, record) {
                    let RetVal;

					RetVal  = 'Rp '+number_format(record.data.FinalBookValueCost, 2);
					
                    return RetVal;
                }
            }]
        }];

        this.callParent(arguments);
    }
});

function setFilterLs() {
	localStorage.setItem('aktiva_src', JSON.stringify({
		Month	: Ext.getCmp('MitraJaya.view.Report.Aktiva.MainGrid-Month').getValue(),
		Year	: Ext.getCmp('MitraJaya.view.Report.Aktiva.MainGrid-Year').getValue()
	}));
	Ext.getCmp('MitraJaya.view.Report.Aktiva.MainGrid-Grid').getStore().loadPage(1);
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
