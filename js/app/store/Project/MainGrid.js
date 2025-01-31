/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGrid.js
 *******************************************/
Ext.define('MitraJaya.store.Project.MainGrid', {
	extend: 'Ext.data.Store',
	id: 'MitraJaya.store.Project.MainGrid',
	storeId: 'MitraJaya.store.Project.MainGrid',
	fields: ['ProjectID', 'ProjectName', 'CustomerName', 'TotalPO', 'TotalInvoice'],
	pageSize: 50,
	autoLoad: true,
	storeVar: false,
	setStoreVar: function (value) {
		this.storeVar = value;
	},
	remoteSort: true,
	proxy: {
		type: 'ajax',
		url: m_api + '/v1/finance/project/list',
		reader: {
			type: 'json',
			root: 'data',
			totalProperty: 'total'
		}
	},
	listeners: {
		load: function (store, records, success) {
			var thisObj = this;
			if (success == true) {
				thisObj.loadInfoFilter();
			}
		},
		sort: function (store, records, success) {
			var thisObj = this;
			if (success == true) {
				thisObj.loadInfoFilter();
			}
		},
		beforeload: function (store, operation, options) {
			var project_list_ls = JSON.parse(localStorage.getItem('project_list_ls'));

			if (project_list_ls != null) {
				store.proxy.extraParams.keySearch = project_list_ls.keySearch;
				store.proxy.extraParams.CustomerID = project_list_ls.CustomerID;
			} else {
				store.proxy.extraParams.keySearch = '';
				store.proxy.extraParams.CustomerID = '';
			}
		}
	},
	loadInfoFilter: function () {
		Ext.Ajax.request({
			url: m_api + '/page/information_grid',
			waitMsg: lang('Please Wait'),
			success: function (data) {
				document.getElementById('Sfr_IdBoxInfoDataGrid').innerHTML = data.responseText;
			}
		});
	}
});
