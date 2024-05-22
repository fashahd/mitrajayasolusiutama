/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGrid.js
 *******************************************/
Ext.define('MitraJaya.store.Finance.Claim.GridClaimDetail', {
	extend: 'Ext.data.Store',
	id: 'MitraJaya.store.Finance.Claim.GridClaimDetail',
	storeId: 'MitraJaya.store.Finance.Claim.GridClaimDetail',
	fields: ['ClaimDetailID', 'ClaimID', 'ClaimDetailDate', 'Amount', 'Description', 'CostElement'],
	pageSize: 50,
	autoLoad: true,
	storeVar: false,
	setStoreVar: function (value) {
		this.storeVar = value;
	},
	remoteSort: true,
	proxy: {
		type: 'ajax',
		url: m_api + '/v1/finance/claim/claim_detail_list',
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
			store.proxy.extraParams.ClaimID = this.storeVar.ClaimID;
		}
	},
	loadInfoFilter: function () {
		Ext.Ajax.request({
			url: m_api + '/page/information_grid',
			waitMsg: 'Please Wait',
			success: function (data) {
				document.getElementById('Sfr_IdBoxInfoDataGrid').innerHTML = data.responseText;
			}
		});
	}
});
