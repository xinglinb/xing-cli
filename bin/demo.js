const download = require('download-git-repo')
const url = 'https://github.com/xinglinb/react-demo'

download(url, 'test/tmp', function (err) {
  if (err) {
    console.log('err', err);
  }
});
