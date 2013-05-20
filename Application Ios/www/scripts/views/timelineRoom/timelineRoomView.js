define(
    [
        'backbone',
        'text!templates/timelineRoom/timelineRoom.html',
        'vendor/BaseView',
        'text!templates/timelineRoom/liTimeline.html',
    ],
    
    function(Backbone,timelineRoomTemplate,BaseView,liTimelineTemplate){
        
        var TimelineRoomView = BaseView.extend({
            
            initialize: function(){
            },
            
            el: '#container',

            template: _.template(timelineRoomTemplate),

            events: {
              "click #barometer_btn":"barometer",
              "click #widget-video" : "addVideo",
              "click #widget-text" : "addText",
              "click #widget-watch" : "addWatch",
              "click #widget-delete" : "addDelete",
              "click #widget-more" : "addMore",
              "click video.movie": "playmovie",
              "click #videoList": "test"
            },
            
            barometer : function(){
              var barometer = document.getElementById('barometer');
              if(barometer.className == 'barometer_shown'){
				barometer.className = '';
				return;
              }
              barometer.className = 'barometer_shown';
            },
            
            test : function(){
              var videoList = document.getElementById('videotest');
              videoList.play();
              //console.log(videoList);
            },
            
            addVideo: function(){
              this.recordVideo();
            },
            
            addText: function(){
              navigator.notification.alert("This feature will be available soon", null, "Oups !");
            },
            
            addText: function(){
              navigator.notification.alert("This feature will be available soon", null, "Oups !");
            },
            
            addWatch: function(){
              navigator.notification.alert("This feature will be available soon", null, "Oups !");
            },
            
            addDelete: function(){
              navigator.notification.alert("This feature will be available soon", null, "Oups !");
            },
            
            addMore: function(){
              navigator.notification.alert("This feature will be available soon", null, "Oups !");
            },

            recordVideo : function(){
               navigator.device.capture.captureVideo(this.captureSuccess.bind(this), this.captureError, { limit: 3 });
               //navigator.device.capture.captureAudio(this.captureSuccess.bind(this), this.captureError, { limit: 3});
                                      
            },
            
            playmovie: function(){
              alert("mpm");
            },
            captureSuccess : function(e){
               var i, len;
               for (i = 0, len = e.length; i < len; i += 1) {
                     this.uploadFile(e[i],self);
               }
                                         
            },
                         
            captureError : function(error){
               var msg = 'An error occurred during capture: ' + error.code;
               navigator.notification.alert(msg, null, 'Uh oh!');
            },
                        
            uploadFile : function(media) {
                var ft = new FileTransfer(),
                path = media.fullPath,
                name = media.name;
                
                ft.upload(path,"http://kevinlarosa.fr:3001/api/content?api-key=foo&idRoom="+localStorage.getItem("currentRoom"),function(result) {
                   console.log('Upload success: ' + result.responseCode);
                   console.log(result.bytesSent + ' bytes sent');
                   },
                   function(error) {
                       console.log('Error uploading file ' + path + ': ' + error.code);
                   },
                   { fileName: name }
                );
                                    
            },
            
            getContents : function(){
              var zoneTimelineElm = $('#saferoom_timeline');
              var token = localStorage.getItem("token");
              var mdp = localStorage.getItem("currentRoomMdp");
              //zoneTimelineElm.append(_.template(liTimelineTemplate));
              $.get("http://kevinlarosa.fr:3001/api/room?api-key=foo&token="+token+"&password="+mdp)
                .success(function(datas){
                 //alert(JSON.stringify(datas.contents[0].path));
                 //alert(datas.contents.path);
  
                    _.each(datas.contents,function(content){
                      if(content.path != null){
                        console.log(content.path);
                         zoneTimelineElm.append(_.template(liTimelineTemplate,{path:content.path}));
                      }
                    });
                 }.bind(this))
                .error(function(error){navigator.notification.alert(error.responseText, null, "Notification")});
            },

            render: function(){
                this.$el.empty();
                this.$el.append(this.template());
                this.getContents();
                return this;
            }
        });
        
        return TimelineRoomView;
    }
);