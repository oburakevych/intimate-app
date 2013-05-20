define(
    [
        'backbone',
        'text!templates/connect/connect.html',
        'vendor/BaseView',
    ],
    
    function(Backbone,connectTemplate,BaseView){
        
        var ConnectView = BaseView.extend({
            
            initialize: function(){
            },
            
            el: '#container',

            template: _.template(connectTemplate),

            events: {
              "click #auth-btn":"connect",
            },
            
            connect : function(){
            
              var form = $('#form_auth');
              var pwd = form.find('input[name$="password"]').val();
              var login = form.find('input[name$="username"]').val();
              
              $.get("http://kevinlarosa.fr:3001/api/signin?api-key=foo&login="+login+"&password="+pwd)
                .success(function(data){
                    localStorage.setItem("token", data);
                    this.router.navigate('accesRoom', true);
                 }.bind(this))
                .error(function(error){navigator.notification.alert(error.responseText, null, "Notification")});
            },

            render: function(){
                this.$el.empty();
                this.$el.append(this.template());
                return this;
            }
        });
        
        return ConnectView;
    }
);