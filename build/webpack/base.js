const path = require('path');
const stiks = require('stiks');
const chek = stiks.chek;
const pkg = stiks.pkg();
const cwd = process.cwd();

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconWebpackPlugin = require('favicons-webpack-plugin');
const BrowserSyncWebpackPlugin = require('browser-sync-webpack-plugin');

module.exports = () => {

  let config;

  // Merge options from pkg.webpack key.
  let options = pkg.build || {};

  // Ensure environment.
  options.env = process.env.NODE_ENV || 'production'
  options.browser = stiks.chek.toBoolean(process.env.BROWSER, false);

  options.host = options.host || 'localhost';
  options.port = options.port || 3000;

  /*
   * Handle Common Rules & Plugins
   **************************************/

  let rules = [];
  let plugins = [];

  // Common copy plugin.
  const copyPlugin = new CopyWebpackPlugin([
    {
      context: path.resolve(options.src),
      from: path.resolve(options.src, '**/*.html'),
      ignore: [options.html.template, '**/*.md']
    },
    {
      from: path.resolve(options.src, options.assets),
      to: path.resolve(options.dist, options.assets),
      ignore: ['**/*.md']
    }
  ]);

  rules = rules.concat([
    {
      test: /\.tsx?$/,
      loader: 'react-hot-loader!ts-loader?jsx=true',
      exclude: /(\.spec.tsx?$|node_modules)/
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    },
    {
      test: /\.eot(\?.*)?$/,
      loader: 'file-loader?name=fonts/[hash].[ext]'
    },
    {
      test: /\.(woff|woff2)(\?.*)?$/,
      loader: 'file-loader?name=fonts/[hash].[ext]'
    },
    {
      test: /\.ttf(\?.*)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[hash].[ext]'
    },
    {
      test: /\.svg(\?.*)?$/,
      loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=fonts/[hash].[ext]'
    },
    {
      test: /\.(jpe?g|png|gif)$/i,
      loader: 'url-loader?limit=1000&name=images/[hash].[ext]'
    }
  ]);

  plugins = plugins.concat([

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(options.env),
        BROWSER: options.browser
      }
    }),

    new FaviconWebpackPlugin({
      title: pkg.name,
      prefix: 'favicons-[hash]/',
      logo: options.favicon || './favicon.png'
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.[hash].js'
    }),

    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          require('postcss-import')({ addDependencyTo: webpack }),
          require("postcss-url")(),
          require("postcss-cssnext")(),
          // ADDITIONAL PLUGINS HERE
          // END
          require("postcss-browser-reporter")(),
          require("postcss-reporter")(),
        ]
      }
    })

  ]);

  // Resolve the html/ejs template.
  options.html.template = path.resolve(options.src, options.html.template || 'index.ejs');

  // No title then update from package.
  if (typeof options.html.title === 'undefined')
    options.html.title = chek.titlecase(pkg.name);

  /*
   * Handle Produciton Rules & Plugins
   **************************************/

  if (options.env === 'prod' || options.env === 'production') {

    let htmlProd = options.html;

    // Extend html for compression on production.
    htmlProd.minify = {
      collapseWhitespace: true,
      removeComments: true
    };

    rules = rules.concat([

      {
        test: /\.css$/,
        include: path.resolve(cwd, options.src),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]',
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.scss$/,
        include: path.resolve(cwd, options.src),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]',
            'sass-loader'
          ]
        })
      }


    ]);

    plugins = plugins.concat([

      copyPlugin,
      new CleanWebpackPlugin(options.dist, { root: process.cwd(), exclude: [] }),
      new ExtractTextPlugin(path.join(options.assets, 'css', '[name].[contenthash:base64:5].css')),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
      new HtmlWebpackPlugin(htmlProd)

    ]);

  }

  /*
   * Handle Development Rules & Plugins
   **************************************/
  else if (options.env === 'dev' || options.env === 'development') {

    options.devtool = options.devtool || 'source-map';

    rules = rules.concat([
      {
        test: /\.css$/,
        include: path.resolve(cwd, options.src),
        use: [
          'style-loader',
          'css-loader?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]',
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        include: path.resolve(cwd, options.src),
        use: [
          'style-loader',
          'css-loader?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]',
          'sass-loader'
        ]
      }

    ])

    plugins = plugins.concat([

      // new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new HtmlWebpackPlugin(options.html)

    ]);

  }

  // Enable Browser Sync if specified.
  if (options.browserSync)
    plugins.push(new BrowserSyncWebpackPlugin(options.browserSync.options, options.browserSync.plugin));

  config = {

    entry: path.resolve(options.src, options.entry),

    output: {

      path: path.resolve(cwd, options.dist), 	// absolute output path.
      publicPath: options.publicPath,               // path relative to index.
      filename: '[name].js',                        // must be relative.
      chunkFilename: '[id].js',                     // must be relative.
      sourceMapFilename: '[file].map',              // must be relative.
      libraryTarget: undefined,               		  // global type 'commonjs', 'var' etc.
      library: undefined                            // name global lib exported as.

    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },

    module: {

      rules: []

    },

    plugins: []

  };

  // Add env specific rules.
  config.module.rules = config.module.rules.concat(rules);

  // Add env specific plugins.
  config.plugins = config.plugins.concat(plugins);

  // Extend with dev server options.
  config.devServer = {
    host: options.host,
    port: options.port,
    historyApiFallback: true
  }

  return config;

}



