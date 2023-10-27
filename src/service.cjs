var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'BodyRoomQA',
  description: 'Backend para el sitio Bodyroom QA',
  script: 'C:\\inetpub\\wwwroot\\BodyRoom_QA_API\\tbr-backend\\src\\server.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();