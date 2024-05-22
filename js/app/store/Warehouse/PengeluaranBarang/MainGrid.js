/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.store.Warehouse.PengeluaranBarang.MainGrid', {
    extend: 'Ext.data.Store',
    id: 'MitraJaya.store.Warehouse.PengeluaranBarang.MainGrid',
    storeId: 'MitraJaya.store.Warehouse.PengeluaranBarang.MainGrid',
    fields: ['PengeluaranBarangID','PartCode','PartCategory','TanggalPengeluaran','DocNo','Qty','RakNumber','RowNumber','ColumnNumber','SparepartCode','SparepartNumberCode','SparepartName','SparepartNo','RackNumber'],
    pageSize: 50,
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/warehouse/pengeluaranbarang/list',
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
            store.proxy.extraParams.PengeluaranBarangID = this.storeVar.PengeluaranBarangID;

            var pengeluaranbarang_src = JSON.parse(localStorage.getItem('pengeluaranbarang_src'));
            
            if(pengeluaranbarang_src != null){
                store.proxy.extraParams.TanggalBarangKeluar = pengeluaranbarang_src.TanggalBarangKeluar;
                store.proxy.extraParams.DocumentNo = pengeluaranbarang_src.DocumentNo;
            }else{
                store.proxy.extraParams.TanggalBarangKeluar = '';
                store.proxy.extraParams.DocumentNo = '';
            }
        }
    },
    loadInfoFilter: function() {
        Ext.Ajax.request({
            url: m_api + '/page/information_grid',
            waitMsg: lang('Please Wait'),
            success: function(data) {
                document.getElementById('Sfr_IdBoxInfoDataGrid').innerHTML = data.responseText;
            }
        });
    }
});
