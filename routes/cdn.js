var express = require('express');
var router = express.Router();

var ALY = require('aliyun-sdk/lib/aly');
ALY.MEMCACHED = require('node_memcached');

var oss = new ALY.OSS({
  accessKeyId: "Z0VbjM061Uid3xEb",
  secretAccessKey: "9fT5Ia9MAklZeqbwDmOi5inJ43K1Yk",
//  accessKeyId: "x4apnrCRvGLI4v2L",
//  secretAccessKey: "KhWyfCiuJqXEKNJtUtaM1Xvc1o1HwD",
  endpoint: 'http://oss-cn-beijing.aliyuncs.com',
  apiVersion: '2013-10-15'
});

var fs = require('fs');

router.get('/save_cdn', function(req, res) {
    console.log(req.param('ad_id'));
    console.log(req.param('file'));
    console.log(req.param('ext'));
    
    var contentType = '';
    if(req.param('ext') == 'jpg') {
        contentType = 'image/jpeg';
    } else if(req.param('ext') == 'png') {
        contentType = 'image/png';
    }
    
    console.log(contentType);
    
    fs.readFile(req.param('file'), function (err, data) {
      if (err) {
        console.log('error:', err);
        return;
      }
      
      var key = 'resource/creative/'+req.param('ad_id')+'/banner.' + req.param('ext');
      
      oss.putObject({
          Bucket: 'cogtucdn',
          Key: key,
          Body: data,
          AccessControlAllowOrigin: '',
          ContentType: contentType,
          CacheControl: 'no-cache',
          ContentDisposition: 'inline',
          ContentEncoding: 'utf-8',
          ServerSideEncryption: 'AES256'
        },
        function (err, data) {
          if (err) {
            res.send('error!');
            return;
          }
          console.log('success:', data);
          res.send("http://cogtucdn.com/" + key);
        });
    });
    
});

module.exports = router;
