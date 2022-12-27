/******************************************
 *  Author : fashahd@gmail.com.com   
 *  Created On : Thu Jan 16 2020
 *  File : Farmers.js
 *******************************************/
 Ext.define('MitraJaya.controller.InternalData.VendorPayment', {
    extend: 'Ext.app.Controller',
    init: function() {
        this.renderView();
    },
    renderView: function() {
    	var MainLayout = [];

        if(Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid') == undefined){
            MainLayout = Ext.create('MitraJaya.view.InternalData.VendorPayment.MainGrid');
        }else{
            //destroy, create ulang
            Ext.getCmp('MitraJaya.view.InternalData.VendorPayment.MainGrid').destroy();
            MainLayout = Ext.create('MitraJaya.view.InternalData.VendorPayment.MainGrid');
        }
    }
});
