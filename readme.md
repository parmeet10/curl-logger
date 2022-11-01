# curl-logger

curl-logger is a tool used which helps server to record incoming request in curl format thus enables the developer to debug the code accordingly.

## Installation
```
npm install --save curl-logger
```

## Usage
1.Include express framework and curl-logger 
```
const express = require('express');
const Curl = require('curl-logger'); // require as a dependency , it is a class

let app = express();
```
2.Now, add it to use as a middleware function 
```
app.use(express.json());
app.use(new Curl().logcurl); // new class instance
```
3.If want a txt file for every curl request provide an option object as contructor function
```
app.use(express.json());
app.use(new Curl({createFile:true}).logcurl); // new class instance with createFile flag
```
now, observe terminal and your directory if provided with createFile option 
![Alt text](https://imgur.com/a/f4Zh7eG "curl")
