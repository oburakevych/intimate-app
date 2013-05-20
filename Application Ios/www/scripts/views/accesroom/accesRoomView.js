define(
    [
        'backbone',
        'text!templates/accesRoom/accesRoom.html',
        'vendor/BaseView',
    ],
    
    function(Backbone,accesRoomTemplate,BaseView){
        
        var AccesRoomView = BaseView.extend({
            
            initialize: function(){
            },
            
            el: '#container',

            template: _.template(accesRoomTemplate),

            events: {
              "click #enter_safeRoom" : "accesRoom",
              "click #add_safeRoom": "addSafeRoom",
              "click #parameters":"dropdown"
            },
            
            accesRoom : function(){
            var mdp = $("#saferoom_input").val();
            var token = localStorage.getItem("token");
            $.get("http://kevinlarosa.fr:3001/api/room?api-key=foo&token="+token+"&password="+mdp)
                .success(function(data){
                         localStorage.setItem("currentRoom", data._id);
                         localStorage.setItem("currentRoomMdp", mdp);
                         navigator.notification.vibrate(2500);
                         this.router.navigate('timelineRoom', true);
                 }.bind(this))
                .error(function(error){navigator.notification.vibrate(2500);navigator.notification.alert(error.responseText, null, "Notification")});
            
            },
            
            dropdown: function(){
              var parameters_dropdown = document.getElementById('parameters_dropdown');
              if(parameters.className == 'parameters_shown'){
				parameters.className = '';
				return;
              }
                parameters.className = 'parameters_shown';
            },
            
            addSafeRoom: function(){
              this.router.navigate('createRoom', true);
            },
            
            render: function(){
                this.$el.empty();
                this.$el.append(this.template());
                return this;
            }
        });
        
        return AccesRoomView;
    }
);