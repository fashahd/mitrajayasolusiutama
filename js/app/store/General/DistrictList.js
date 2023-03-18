Ext.define('MitraJaya.store.General.DistrictList', {
    extend: 'Ext.data.Store',
    storeId: 'store.General.DistrictList',
    id: 'store.General.DistrictList',
    fields: ['id', 'label'],
    remoteSort: true,
    autoLoad: false,
    storeVar: false,
    setStoreVar: function(value){
        this.storeVar = value;
    },
    proxy: {
        type: 'ajax',
        url: m_api + '/v1/general/combo/combo_district',
        reader: {
            type: 'json'
        }
    },
    listeners: {
        beforeload: function(store, operation, options){
            store.proxy.extraParams.ProvinceID = this.storeVar.ProvinceID;
        }
    }
});
