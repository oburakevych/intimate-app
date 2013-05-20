define(
    [
        'backbone',
        'text!templates/createRoom/createRoom.html',
        'vendor/BaseView',
    ],
    
    function(Backbone,connectTemplate,BaseView){
        
        var CreateRoomView = BaseView.extend({
            
            initialize: function(){
            },
            
            el: '#container',

            template: _.template(connectTemplate),

            events: {
              "click #btnCreateRoom":"createRoom"
            },
            
            createRoom : function(){
            
              var form = $('#formNewRoom');
              var email = form.find('input[name$="2nd_participant"]').val();
              var pwc = form.find('input[name$="passcode"]').val();
              var token = localStorage.getItem("token");
              
              $.post("http://kevinlarosa.fr:3001/api/room?api-key=foo&token="+token,{partner:email,password:pwc} )
                .success(function(data){
                    localStorage.setItem("currentRoom", data._id);
                    localStorage.setItem("currentRoomMdp", pwc);
                    this.router.navigate('timelineRoom', true);
                 }.bind(this))
                .error(function(error){navigator.notification.alert(error.responseText, null, "Notification")});
            },

            render: function(){
                this.$el.empty();
                this.$el.append(this.template());
                return this;
            }
        });
        
        return CreateRoomView;
    }
);