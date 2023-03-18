Ext.define('MitraJaya.store.General.SubDistrictList', {
    extend: 'Ext.data.Store',
    storeId: 'store.General.SubDistrictList',
    id: 'store.General.SubDistrictList',
    fields: ['id', 'label'],
    remoteSort: true,
    autoLoad: false,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_subdistrict',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
            store.proxy.extraParams.DistrictID = this.storeVar.DistrictID;
        }
    }
});
