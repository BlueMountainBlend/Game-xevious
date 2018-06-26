let {link,script,googleAnalytics,args} = require('html-dist');
module.exports = {
  // where to write to
//  outputFile: 'dist/gradius.html',
  // minify the HTML 
  minify: true,
  head:{
    remove:'link',
    appends:[
      link({rel:'apple-touch-icon',href:'images/homeicon.jpg'})
    ]
 },
 body: {
   // append the following things to the body 
   remove:'script',
   appends: [
    script({src:'./xevious_main.js?_date='+(new Date().getTime())}),
    googleAnalytics('UA-117905768-2')
   ]
 }
}