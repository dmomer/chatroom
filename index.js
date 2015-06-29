var http = require('http');
var mime = require('mime');
var fs = require('fs');
var path = require('path');

var cache = {};//keşlenmiş dosyaların içeriğini saklamak için

var send404 = function(response){
	response.writeHead(404,{'Content-Type' : 'text/plain'});
	response.write('404 NOT FOUND!!');
	response.end();
}

var sendFile = function(response,filePath,fileContent){
	response.writeHead(
			200,
			{'Content-Type' : mime.lookup(path.basename(filePath))}
	);
	console.log(path.basename(filePath));
	response.end(fileContent);
}

var serveStatic = function(response,cache,absPath){
	
	if(cache[absPath]){
		sendFile(response,absPath,cache[absPath])
	}else{
		fs.exists(absPath,function(exists){
			if(exists){
				fs.readFile(absPath,function(err,data){
					if(err){
						send404(response);
					}else{
						cache[absPath] = data;
						console.log(absPath);
						sendFile(response,absPath,data);						
					}
				});
				}else{
					send404(response);
				}
		});
	}
}
	
http.createServer(function(request,response){
	
	var filePath = false;
	if(request.url=='/'){
		filePath = 'public/index.html';
	}else{
		filePath = 'public' + request.url;//url to relative path
	}
	var absPath = './'+filePath;//relative path to absolute path
	serveStatic(response,cache,absPath);
}).listen(3000,'127.0.0.1',function(){
	console.log('listening localhost:3000/');
});
	

