const stiks = require('stiks');
const path = require('path');
const config = require('./configure');
const exec = stiks.exec;
const log = stiks.log;
const argv = stiks.argv;
const colurs = stiks.colurs.get();
const chek = stiks.chek;

const parsed = argv.parse();
const pkg = stiks.pkg();
const build = pkg && pkg.build;
const changeTimer = 500;

// Ensure build info.
if (!build)
  log.error('whoops looks like you forgot to configure package.json "build".').exit();

let cmd, baseCmd;

// Normalizes the command and appends
// all other options passed via command line.
function normalize(cmds) {
  if (chek.isString(cmds))
    cmds = [cmds];
  const output = cmds;
  // Ensure we don't append dupes.
  argv.options.forEach((o) => {
    if (!chek.contains(output, o))
      output.push(o);
  });
  return output;
}

// Swtich on cmd exec requested action.
switch (parsed.cmd) {

  // CONFIGURE // - Installs project, runs config tool.

  case 'configure':
    exec.npm('install')
    exec.npm('install mustr -g');
    config();
    break;

  case 'reconfigure':
    config(true);
    break;

  case 'clean':
    stiks.clean(build.clean);
    break;

  case 'copy':
    stiks.copy(build.copy);
    break;

  case 'dev':
    baseCmd = './node_modules/webpack-dev-server/bin/webpack-dev-server';
    process.env.NODE_ENV = 'development';
    process.env.BROWSER = true;
    exec.node('./node_modules/webpack-dev-server/bin/webpack-dev-server -d --hot --colors --watch --progress --profile --config build/webpack');
    break;

  case 'prod':
    baseCmd = './node_modules/webpack/bin/webpack';
    process.env.NODE_ENV = 'production';
    process.env.BROWSER = true;
    exec.node('./node_modules/webpack/bin/webpack --progress --env=prod --profile --config build/webpack')
    break;

  case 'docs':
    // exec.npm('run docs');
    exec.node('./node_modules/typedoc/bin/typedoc --out ./docs ./src --options ./typedoc.json')
    break;

  case 'commit':

    baseCmd = 'commit';

    // Check if -m was provided if not
    // add auto commit message.
    const tmpOpts = argv.options.join(' ');
    if (!/-[a-zA-Z]{0,7}?m/g.test(tmpOpts))
      baseCmd = baseCmd.concat(['-am', 'auto commit']);

    cmd = normalize(['commit']);
    exec.command('git', 'add .');
    exec.command('git', cmd)
    exec.command('git', 'push');
    break;

  case 'release':
    exec.npm('run release');
    break;

  case 'bump':
    stiks.bump();
    break;

  case 'serve':

    // Clean and copy before starting server
    stiks.clean(build.clean);
    stiks.copy(build.copy);

    const config = build.devServer;
    const files = config.files;
    delete config.files; // handle watch manuall.
    let changeTimeout;
    const server = stiks.serve(config);
    const changed = [];

    server.watch(files).on('change', (file) => {
      if (!chek.contains(changed, file))
        changed.push(file);
      if (changeTimeout)
        clearTimeout(changeTimeout);
      changeTimeout = setTimeout(() => {
        const toBeCopied = [];
        changed.forEach((src) => {
          const dest = src.replace(/^src/, './dist');
          toBeCopied.push([src, dest])
        });
        // Use blocking copy
        stiks.copyAll(toBeCopied);
        server.reload();
      }, changeTimer);
    });
    break;

  default:
    log.write(colurs.bgRed.white(` Whoops command "${parsed.cmd}" was not found`))
      .write()
      .exit();

}