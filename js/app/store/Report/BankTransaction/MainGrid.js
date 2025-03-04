/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.store.Report.BankTransaction.MainGrid', {
    extend: 'Ext.data.Store',
    id: 'MitraJaya.store.Report.BankTransaction.MainGrid',
    storeId: 'MitraJaya.store.Report.BankTransaction.MainGrid',
    fields: [
		'BankTransactionID','DateTransaction',
		'CheckingAccount',
		'NoVoucher','CostElement',
		'CostElementID',
		'TransactionAmountDebitVal',
		'TransactionAmountDebit',
		'TransactionAmountCreditVal',
		'TransactionAmountCredit',
		'TransactionType',
		'ProjectID',
		'Balance','Project',
		'Description','CostElementID'
	],
    pageSize: 50,
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/report/bank_transaction/list',
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    },
    listeners: {
        load: function(store, records, success) {
            var thisObj = this;
            if(success == true){
                thisObj.loadInfoFilter();
            }
        },
        sort: function(store, records, success){
            var thisObj = this;
            if(success == true){
                thisObj.loadInfoFilter();
            }
        },
        beforeload: function(store, operation, options){
            var bank_transaction_storage = JSON.parse(localStorage.getItem('bank_transaction_storage'));
            
            if(bank_transaction_storage != null){
                store.proxy.extraParams.Month = bank_transaction_storage.Month;
                store.proxy.extraParams.Year = bank_transaction_storage.Year;
            }else{
                store.proxy.extraParams.Month = '';
                store.proxy.extraParams.Year = '';
            }
        }
    },
    loadInfoFilter: function() {
        Ext.Ajax.request({
            url: m_api + '/page/information_grid',
            waitMsg: lang('Please Wait'),
            success: function(data) {
                // document.getElementById('Sfr_IdBoxInfoDataGrid').innerHTML = data.responseText;
                
                // let bank_transaction_storage = JSON.parse(localStorage.getItem('bank_transaction_storage'));
                // if(bank_transaction_storage != null){
                //     if(bank_transaction_storage.length > 0)
                //         document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '<strong>'+lang('Data filter by')+':</strong>&nbsp;&nbsp;<span style="color:#895608;">'+bank_transaction_storage.join(', ')+'</span>';
                //     else
                //         document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '';
                // } else {
                //     document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '';
                // }
            }
        });
    }
});
