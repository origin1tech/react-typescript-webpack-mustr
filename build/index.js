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

// Normalizes the command and appends
// all other options passed via command line.
function normalize(cmds, opts) {
  opts = opts || argv.options;
  if (chek.isString(cmds))
    cmds = cmds.split(' ');
  if (chek.isString(opts))
    opts = [opts];
  const output = cmds;
  // Ensure we don't append dupes.
  opts.forEach((o) => {
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

  // RE-CONFIGURE // - re-runs config tool but does not run npm install.

  case 'reconfigure':
    config(true);
    break;

  // CLEAN // - cleans the project

  case 'clean':
    stiks.clean(build.clean);
    break;

  // COPY // - copies files to dist or specified output directory.

  case 'copy':
    stiks.copy(build.copy);
    break;

  // DEV // - starts project in development mode.

  case 'dev':
    cmd = './node_modules/webpack-dev-server/bin/webpack-dev-server';
    process.env.NODE_ENV = 'development';
    process.env.BROWSER = true;
    exec.node('./node_modules/webpack-dev-server/bin/webpack-dev-server -d --hot --colors --watch --progress --profile --config build/webpack');
    break;

  // PROD // - starts project in production mode.

  case 'prod':
    cmd = './node_modules/webpack/bin/webpack';
    process.env.NODE_ENV = 'production';
    process.env.BROWSER = true;
    exec.node('./node_modules/webpack/bin/webpack --progress --env=prod --profile --config build/webpack')
    break;

  // CLEAN // - builds Typedoc documents.

  case 'docs':
    exec.node('./node_modules/typedoc/bin/typedoc --out ./docs ./src --options ./typedoc.json')
    break;

  // COMMIT // - commits the project to git repo.

  case 'commit':

    let opts;

    // If -m not detected add auto commit message.
    if (!/-[a-zA-Z]{0,7}?m/g.test(argv.options.join(' ')))
      opts = ['-m', '"auto commit"'];

    // Normalize the git commit args.
    const cmd = normalize('commit', opts);

    // Add files commit and push.
    exec.command('git', 'add .');
    exec.command('git', cmd)
    exec.command('git', 'push');
    break;

  // RELEASE // - builds then releases the project.

  case 'release':
    exec.npm('run release');
    break;

  // BUMP // - bumps the project version.

  case 'bump':
    stiks.bump();
    break;

  // DEFAUL // - command not found.

  default:
    log.write(colurs.bgRed.white(` Whoops command "${parsed.cmd}" was not found`))
      .write()
      .exit();

}