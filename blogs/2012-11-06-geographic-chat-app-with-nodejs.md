---
title: Geographic chat app with Node.js, Socket.IO, and Google Maps - Part one
date: 2012-11-06
tags:
- javascript
- socket.io
- node.js
author: maximo
category: development
permalink: /:year/:month/:day/:title/
---

<span>
  <a href="/2012/12/21/geographic-chat-app-with-nodejs-part2/">Part two</a> | <a href="/2013/01/29/geographic-chat-app-with-nodejs-part3/">Part three</a>
</span>
<br />
<br />In this series of posts we are going to show you how to use&nbsp;<a href="https://nodejs.org/">node.js</a> and <a href="http://socket.io/">Socket.IO</a>&nbsp;to build a simple chat application, and then mix it up with Google Maps and the Geolocation API
to create a cool geographic app. We will use&nbsp;<a href="https://twitter.github.com/bootstrap/">Bootstrap</a>&nbsp;with a modified css&nbsp;to get a nice look for the website.
<br />
<br />Node.js is a great platform for building event based applications,&nbsp;if you haven't heard about it&nbsp;or want to get hands on work&nbsp;you may want to check out&nbsp;<a href="http://nodemanual.org/">nodemanual.org</a>, its short tutorials provide
a good introduction of how node.js works.
<br />
<br />In this post we will show you how to use Node.js as a simple web server.&nbsp;In a future post we will show you how to build the same application with the <a href="http://expressjs.com/">express</a> framework, which provides a nice and thin layer of features
on top of node, but this time we will do it by hand.
<br />
<br />
<p>Let's get started!&nbsp;Create&nbsp;a text file with the name 'app.js' to start coding. First we need to include the modules that our server is going to use, which in node.js is done with the
<code>require</code> function.
</p>


```
var fs = require('fs'),
url = require('url'),
http = require('http'),
path = require('path'),
mime = require('mime');
```
<p>
Next we create the server, passing the function that handles the HTTP requests as an argument.
</p>

```
httpServer = http.createServer(function(request, response) {
  var pathname = url.parse(request.url).pathname;
  if(pathname == "/") pathname = "index.html";
  var filename = path.join(process.cwd(), 'public', pathname);

  path.exists(filename, function(exists) {
    if(!exists) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.write("404 Not Found");
    response.end();
    return;
  }
```


Then we obtain the name of the file we need to return from the request, and set a default file for the root ("/index.html"). After that we check if the file exists inside a 'public' folder located in the same directory of the script, returning a 404 response
in case the file does not exist.
<br />
<br />
<p>If the file exists, we obtain its MIME type with help of the <a href="https://github.com/broofa/node-mime">node-mime</a> plugin and prepare a read stream to asynchronously write chunks of the file to the response, avoiding the server to block on the IO
reading operation.
</p>

<pre>
```
response.writeHead(200, { 'Content-Type': mime.lookup(filename) });
fs.createReadStream(filename, {
  'flags': 'r',
  'encoding': 'binary',
  'mode': 0666,
  'bufferSize': 4 * 1024
}).addListener("data", function(chunk) {
  response.write(chunk, 'binary');
}).addListener("close", function() {
  response.end();
});
```
</pre>

<p>
There you go, we have a working web server! Right? Ehm, not yet. We need the server to open a port so it can listen to requests. Add this line at the bottom of your script.
</p>

```
httpServer.listen(process.env.PORT || 8080, "0.0.0.0");
```

<p>
Make sure you have a 'public' folder in the same directory where you saved the script and put an 'index.html' with the content of your choice. Next open a terminal and type:
</p>

```
node app.js
```
Now we're ready! You can test if the server is working by opening a tab in your browser at 'localhost:8080'.
<br />
<br />Now that we have a basic web server we can start building the chat application, in the following posts we will show you how to use Socket.IO to send chat messages and geographic updates in real time. If you are impacient and can't wait for the next post
you can <a href="https://xmart-chat.herokuapp.com/">try our live demo</a>!
<br />
<br />Check out the next posts in this series:
<br /><a href="/2012/12/21/geographic-chat-app-with-nodejs-part2/">Part two</a>
<br /><a href="/2013/01/29/geographic-chat-app-with-nodejs-part3/">Part three</a>
<br />
