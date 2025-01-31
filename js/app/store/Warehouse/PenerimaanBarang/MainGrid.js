/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Fri Jan 17 2020
 *  File : MainGrid.js
 *******************************************/
 Ext.define('MitraJaya.store.Warehouse.PenerimaanBarang.MainGrid', {
    extend: 'Ext.data.Store',
    id: 'MitraJaya.store.Warehouse.PenerimaanBarang.MainGrid',
    storeId: 'MitraJaya.store.Warehouse.PenerimaanBarang.MainGrid',
    fields: ['PenerimaanBarangID','PartCode','PartCategory','TanggalPenerimaan','DocNo','Qty','RakNumber','RowNumber','ColumnNumber','SparepartCode','SparepartNumberCode','SparepartName','SparepartNo','RackNumber'],
    pageSize: 50,
    autoLoad: true,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    remoteSort: true,
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/warehouse/penerimaanbarang/list',
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
            store.proxy.extraParams.PenerimaanBarangID = this.storeVar.PenerimaanBarangID;

            var penerimaanbarang_src = JSON.parse(localStorage.getItem('penerimaanbarang_src'));
            
            if(penerimaanbarang_src != null){
                store.proxy.extraParams.TanggalBarangMasuk = penerimaanbarang_src.TanggalBarangMasuk;
                store.proxy.extraParams.DocumentNo = penerimaanbarang_src.DocumentNo;
            }else{
                store.proxy.extraParams.TanggalBarangMasuk = '';
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
