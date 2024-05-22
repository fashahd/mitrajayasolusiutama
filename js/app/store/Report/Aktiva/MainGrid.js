/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.store.Report.Aktiva.MainGrid', {
    extend: 'Ext.data.Store',
    id: 'MitraJaya.store.Report.Aktiva.MainGrid',
    storeId: 'MitraJaya.store.Report.Aktiva.MainGrid',
    fields: [
		'AktivaID'
        , 'Month'
        , 'Year'
        , 'Description'
        , 'Unit'
        , 'Gol'
        , 'Rate'
        , 'InputValue'
        , 'Total'
        , 'FinalAccumulated'
        , 'FinalBookValue'
        , 'CostDecreasing'
        , 'FinalAccumulatedCost'
        , 'FinalBookValueCost'
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
        url: m_api + '/v1/report/aktiva/data',
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
            var aktiva_src = JSON.parse(localStorage.getItem('aktiva_src'));
            
            if(aktiva_src != null){
                store.proxy.extraParams.month = aktiva_src.Month;
                store.proxy.extraParams.year = aktiva_src.Year;
            }else{
                store.proxy.extraParams.month = '';
                store.proxy.extraParams.year = '';
            }
        }
    },
    loadInfoFilter: function() {
        Ext.Ajax.request({
            url: m_api + '/page/information_grid',
            waitMsg: 'Please Wait',
            success: function(data) {
                // document.getElementById('Sfr_IdBoxInfoDataGrid').innerHTML = data.responseText;
                
                // let aktiva_src = JSON.parse(localStorage.getItem('aktiva_src'));
                // if(aktiva_src != null){
                //     if(aktiva_src.length > 0)
                //         document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '<strong>'+'Data filter by'+':</strong>&nbsp;&nbsp;<span style="color:#895608;">'+aktiva_src.join(', ')+'</span>';
                //     else
                //         document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '';
                // } else {
                //     document.getElementById('Sfr_IdBoxInfoFilterGrid').innerHTML = '';
                // }
            }
        });
    }
});
