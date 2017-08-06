
/**
 * Options are a limited subset of Webpack options
 * to simplify setup. It should work for many scenarios
 * but feel free to modify as required.
 */

// let options = {
//   env: process.env.NODE_ENV || 'production', // indicates the running environment.
//   browser: process.env.BROWSER, // indicates building in browser mode.
//   host: 'localhost',            // dev server host.
//   port: 3000,                   // dev server port.
//   src: 'src',                   // the source path.
//   dist: 'dist',                 // the dist path relative from cwd.
//   entry: 'main.tsx',            // main entry file relative from src.
//   assets: 'assets',             // path relative to src static vendor files.
//   publicPath: '/',              // public path from index to resolve assets.

// For additional template options
// see: https://github.com/jaketrent/html-webpack-template

//   html: {
//     template: 'index.ejs',       // relative template path from src.
//     title: 'App',                // index page title (defaults to app name);
//     inject: false,               // must be false if NOT using default template.
//     appMountId: 'app',            // The id where the app should be mounted.
//     mobile: true,                  // Adds scaling for mobile.
//     googleAnalytics: {
//      trackingId: 'UA-XXXX-XX',
//      pageViewOnLoad: true
//     }
//   }
//
// };

const base = require('./base');
let config = base();

module.exports = config;