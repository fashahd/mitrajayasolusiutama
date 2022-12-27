/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.store.Finance.Pajak.MainGrid', {
    extend: 'Ext.data.Store',
    id: 'MitraJaya.store.Finance.Pajak.MainGrid',
    storeId: 'MitraJaya.store.Finance.Pajak.MainGrid',
    fields: ['PajakID','Period','Month','Year','Amount','PaidAmount','OverPaid', 'ReportStatus','VATAmount','OverpaidVal','PaidAmountVal'],
    pageSize: 50,
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/finance/pajak/list',
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
            var pajak_src = JSON.parse(localStorage.getItem('pajak_src'));
            
            if(pajak_src != null){
                store.proxy.extraParams.Year = pajak_src.Year;
            }else{
                store.proxy.extraParams.Year = '';
            }
        }
    },
    loadInfoFilter: function() {
        Ext.Ajax.request({
            url: m_api + '/page/information_grid',
            waitMsg: lang('Please Wait'),
            success: function(data) {
                document.getElementById('Sfr_IdBoxInfoDataGrid').innerHTML = data.responseText;
                
                // let cof_gridfarmers_params = JSON.parse(localStorage.getItem('cof_gridfarmers_params'));
                // if(cof_gridfarmers_params != null){
                //     if(cof_gridfarmers_params.length > 0)
                //         document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '<strong>'+lang('Data filter by')+':</strong>&nbsp;&nbsp;<span style="color:#895608;">'+cof_gridfarmers_params.join(', ')+'</span>';
                //     else
                //         document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '';
                // } else {
                //     document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '';
                // }
            }
        });
    }
});
