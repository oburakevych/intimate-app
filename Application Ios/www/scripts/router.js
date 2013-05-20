define(
    ['backbone','views/home/homeView','views/accesroom/accesRoomView','views/timelineRoom/timelineRoomView','views/connect/connectView','views/createRoom/createRoomView'],
    
    function(backbone,HomeView,AccesRoomView,TimelineRoomView,ConnectView,CreateRoomView){
         
       var Router = Backbone.Router.extend({
            
            routes: {
             "": "home",
             "accesRoom":"accesRoom",
             "timelineRoom":"timelineRoom",
             "signin":"signin",
             "logout":"logout",
             "createRoom":"createRoom"
            },
             
            app : {},
            
            home: function() {
            
              localStorage.removeItem("token");
              localStorage.removeItem("currentRoomMdp");
              localStorage.removeItem("currentRoom");
              
              if(!localStorage.getItem("token")){
                if(this.app.home == null){
                  this.app.home = new HomeView({router:this});
                  this.app.home.render();
                }else{
                  this.app.home.render();
                }
              }else{
                this.navigate('accesRoom', true);
              }
            },
            
            signin: function(){
            if(this.app.signin == null){
              this.app.signin = new ConnectView({router:this});
              this.app.signin.render();
             }else{
              this.app.signin.render();
             }
            },
             
            logout: function(){
              localStorage.removeItem("token");
              this.navigate('#', true);
            },

            accesRoom : function(){
             if(this.app.accesRoom == null){
                this.app.accesRoom = new AccesRoomView({router:this});
                this.app.accesRoom.render();
             }else{
             this.app.accesRoom.render();
             }
             
            },
            timelineRoom: function(){
              if(this.app.timelineRoom == null){
                this.app.timelineRoom = new TimelineRoomView({router:this});
                this.app.timelineRoom.render();
              }else{
                this.app.timelineRoom.render();
              }
            },
            
            createRoom: function(){
              if(this.app.createRoom == null){
                this.app.createRoom = new CreateRoomView({router:this});
                this.app.createRoom.render();
              }else{
                this.app.createRoom.render();
              }
            }
        });
       
       initialize = function(){
            var router = new Router();
            Backbone.history.start();
       };
      

        return {
            initialize: initialize
        };
    }
);