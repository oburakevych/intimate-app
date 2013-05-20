define(
    [
        'backbone',
        'text!templates/home/home.html',
        'vendor/BaseView',
    ],
    
    function(Backbone,homeTemplate,BaseView){
        
        var HomeView = BaseView.extend({
            
            initialize: function(){
            },
            
            el: '#container',

            template: _.template(homeTemplate),

            events: {
                "click #submit_register" : "register"
            },
            
            register : function(){
              var form = $('#form_register');
              var pwd = form.find('input[name$="password"]').val();
              var login = form.find('input[name$="username"]').val();
              var email = form.find('input[name$="email"]').val();
              
   
              $.post("http://kevinlarosa.fr:3001/api/signup?api-key=foo", {login:login,email:email,password:pwd} )
                .success(function(data){
                         localStorage.setItem("token", data.token);
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
        
        return HomeView;
    }
);