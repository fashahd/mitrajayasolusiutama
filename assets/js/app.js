/**
 * Override radiogroup untuk validator DHIS
 */

Ext.override(Ext.form.RadioGroup, {
    getErrors: function(value) {
        var me = this,
            errors = me.callParent(arguments),
            validator = me.validator,
            vtype = me.vtype,
            vtypes = Ext.form.field.VTypes,
            regex = me.regex,
            format = Ext.String.format,
            msg, trimmed, isBlank;

        value = value || false;

        if (Ext.isFunction(validator)) {
            msg = validator.call(me, value);
            

            if (msg !== true) {
                errors.push(msg);
            }
        }

        return errors;
    }
});

/*
 * LOAD SCRIPTS
 * Usage:
 * Define function = myPrettyCode ()...
 * loadScript("js/my_lovely_script.js", myPrettyCode);
 */
var jsArray = {};

function loadScript(scriptName, callback) {
    if (!jsArray[scriptName]) {
        jsArray[scriptName] = true;
        // adding the script tag to the head as suggested before
        var body = document.getElementsByTagName('body')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = scriptName;
        // then bind the event to the callback function
        // there are several events for cross browser compatibility
        //script.onreadystatechange = callback;
        script.onload = callback;
        // fire the loading
        body.appendChild(script);
    } else if (callback) { // changed else to else if(callback)
        // console.log("JS file already added!");
        //execute function
        callback();
    }
}
/* ~ END: LOAD SCRIPTS */

Ext.util.Observable.observe(Ext.data.Connection, {
    requestexception: (conn, response, options) => {
        if (response.status == 403 && Ext.getCmp('frm-revoke-session-password') === undefined) {
            function unlock() {
                var passwd = Ext.getCmp('frm-revoke-session-password').getValue();
                Ext.Ajax.request({
                    url: '/api/common/revoke',
                    method: 'POST',
                    params: {
                        uid: ktv.ktv_session,
                        passwd: passwd
                    },
                    success: function(response) {
                        win.close();
                    },
                    failure: function(response) {
                        win.close();
                        Ext.MessageBox.show({
                            title: 'Failed',
                            msg: 'Relog failed, Please relogin',
                            buttons: Ext.MessageBox.OK,
                            animateTarget: 'mb9',
                            icon: 'ext-mb-error'
                        });
                        setTimeout(function(){
                            window.location = '/';
                        }, 1500);
                    }
                });
            }

            var win = Ext.create('Ext.Window', {
                modal: true,
                constraint: true,
                frame: true,
                title: 'Session Expired',
                items: [{
                    xtype: 'form',
                    padding: 10,
                    items: [{
                        xtype: 'panel',
                        flex: 1,
                        height: 80,
                        width: 350,
                        html: '<div>' + ktv.ktv_fullname + ', your session has expired, please submit your password below to revoke your session or click the logout button to sign in as a different user</div>'
                    }, {
                        xtype: 'textfield',
                        width: 350,
                        height: 40,
                        fieldStyle: 'text-align:center',
                        id: 'frm-revoke-session-password',
                        inputType: 'password',
                        allowBlank: false,
                        emptyText: 'Enter your password',
                        listeners: {
                            specialkey: function(field, e) {
                                if (e.getKey() == e.ENTER) {
                                    unlock();
                                }
                            }
                        }
                    }]
                }],
                buttonAlign: 'center',
                buttons: [{
                    xtype: 'button',
                    text: 'Unlock',
                    handler: function() {
                        unlock();
                    }
                }, {
                    xtype: 'button',
                    text: 'Logout',
                    handler: function() {
                        Ext.MessageBox.show({
                            title: 'Logout',
                            msg: 'Are you sure you want to logout?',
                            buttonText: {
                                yes: "Yes, I want to logout",
                            },
                            fn: (btn) => {
                                console.log('Application Logout..');
                                if (btn === 'yes') {
                                    window.location = '/';
                                }
                            }
                        });
                    }
                }]
            }).show();
        }
    },
    requestcomplete: (conn, response, options) => {
        // console.log('completes',response)
    }
});

//Added by fashahd@gmail.com (Sisipkan Token pemanggilan API) ================
// Ext.data.Connection.override({
//     //add an extra parameter to the request to denote that ext ajax is sending it
//     request: function(options){
//         var me = this;
//         var token = false;
//         var tokenexpired = false;
//         //console.log(options);

//         if(!options.params)
//             options.params = {};

//         if(
//             options.url != "/api/auth/api_token" &&
//             options.url != "/api/auth/notifications_load" &&
//             options.url != "/api/auth/notifications_clear" &&
//             options.url != "/api/common/revoke"
//         ){
//             Ext.Ajax.request({
//                 url: api_url+'/api/v1/auth/api_token',
//                 method:'POST',
//                 async: false,
//                 params: {
//                     url_call: options.url
//                 },
//                 success: function(response){
//                     var r = Ext.decode(response.responseText);
//                     token = r.token;
//                 },
//                 failure: function(response){
//                     if(response.status == 403){
//                         tokenexpired = true;
//                     }else{
//                         Ext.MessageBox.show({
//                             title: 'Failed',
//                             msg: 'Failed to retrieve API token, Please relogin',
//                             buttons: Ext.MessageBox.OK,
//                             animateTarget: 'mb9',
//                             icon: 'ext-mb-error'
//                         });
//                     }
//                 }
//             });

//             if(tokenexpired == true){
//                 return me.callOverridden(arguments);
//             }

//             if(token != false){
//                 options.params.apiUid = token;
//                 return me.callOverridden(arguments);
//             }
//         }else{
//             return me.callOverridden(arguments);
//         }
//     }
// });
//Added by fashahd@gmail.com (Sisipkan Token pemanggilan API) ================

//Added by fashahd@gmail.com (Code run on loop) ================== (Begin)
function UpdateNotification(){
    Ext.Ajax.request({
        url: '/api/tools/notifications_load',
        method:'GET',
        success: function(response){
            var r = Ext.decode(response.responseText);
            //console.log(r);

            if(parseInt(r.DataCount) > 0){
                //muncul kan indicator
                document.getElementById("notif-indicator-header").className = "indicator";

                var ContentNotif = `<div class="title">Notifications<span class="badge">`+r.DataCount+`</span></div>
                <div class="list">
                    <div class="am-scroller nano">
                        <div class="content nano-content">
                        <ul>`;
                for (var i = 0; i < r.data.length; i++) {
                    ContentNotif += '<li><a style="cursor:default;" href="#"><div class="user-content"><span class="text-content"> '+r.data[i].Notif+' </span><span class="date">'+r.data[i].NotifTime+'</span></div></a></li>';
                }
                ContentNotif += `</ul>
                        </div>
                    </div>
                </div>
                <div class="footer"> <a href="/system/notif" onclick="link(this.href); return false;">View all notifications</a></div>
                `;

                document.getElementById('NotificationPanel').innerHTML = '<li>'+ContentNotif+'</li>';
            }else{
                document.getElementById("notif-indicator-header").className = "indicator hidden";
                document.getElementById('NotificationPanel').innerHTML = '<li><div class="title">No New Notification, <a href="/system/notif" onclick="link(this.href); return false;">View all notifications</a></div></li>';
            }
        },
        failure: function(response){
            console.log('Failed to fetch notifications');
        }
    });
}

/* disable dulu
setInterval(function() {
    //For Notifications
    UpdateNotification();
}, 60 * 1000); // Jalan tiap 60 detik
*/
$(document).ready(function(){
    //Listener ketika click Icon Notifikasi
    // document.getElementById("notif-indicator-header-icon").addEventListener("click", function(){
    //     document.getElementById("notif-indicator-header").className = "indicator hidden";

    //     //Set Notifikasi isRead
    //     Ext.Ajax.request({
    //         url: '/api/tools/notifications_clear',
    //         method:'POST',
    //         success: function(response){
    //             console.log('Notification clear');
    //         },
    //         failure: function(response){
    //             console.log('Failed to clear notifications');
    //         }
    //     });
    // });

    //Langsung jalankan untuk yg pertama kali
    // UpdateNotification();
});
//Added by fashahd@gmail.com (Code run on loop) ================== (End)


/*
 * ExtJS MVC Application
 *
 */
Ext.application({
    requires: [],
    name: 'MitraJaya',
    appFolder: '/js/app',
    launch: function() {
        /* Nothin happened yaww... */
    }
});


