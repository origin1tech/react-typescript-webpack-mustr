
const path = require('path');
const inq = require('inquirer');
const stiks = require('stiks');
let pkg = stiks.pkg();

const fs = stiks.fs;
const chek = stiks.chek;
const colurs = stiks.colurs.get();
const log = stiks.log;
const argv = stiks.argv;
const cwd = process.cwd();
const args = argv.parse();

// Formats Author.
function toAuthor(str) {
  if (!str) return str;
  if (str.indexOf('<') === -1) {
    str = chek.titlecase(str);
    return {
      name: str,
      email: '',
      combined: str
    };
  }
  const split = str.split('<');
  split[1] = '<' + split[1];
  const result = {
    name: chek.titlecase((split[0] || '').trim()),
    email: chek.titlecase((split[1] || '').trim())
  };
  result.combined = result.name + ' ' + result.email;
  return result;
};

// Saves a file.
function saveFile(dest, data) {
  dest = path.resolve(cwd, dest)
  const parsed = path.parse(dest);
  fs.ensureDirSync(parsed.dir);
  fs.writeFileSync(dest, data, { encoding: 'utf8' });
};

// Cheesy wrapper to call Mustr cli,
// we'll hijack node's process args,
// prevents need to new up instance
// as we're just calling the one method.
function generate() {
  process.argv = process.argv.slice(0, 2);
  process.argv = process.argv.concat(['g', 'init']);
  require('../node_modules/mustr/bin/mustr');
}

// Build the package with
// user options.
function buildPackage(resp) {

  let github = resp.github;
  let slug = chek.slugify(resp.name);
  let trackingId = resp.analytics;

  const bkupPath = path.join('./.tmp', 'package.bak.json');
  log.write().info(`backing up ${colurs.magenta("package.json")} to ${colurs.cyan(bkupPath)}.`);

  // backup the existing package just
  // in case something goes haywire.
  saveFile(bkupPath, JSON.stringify(pkg, null, 2));

  // Backup the readme.
  if (fs.existsSync('./README.md'))
    fs.renameSync('./README.md', 'CONFIGURE.md');

  // Check if github settings were passed.
  if (typeof github !== 'undefined' && github.length) {

    let gitusr = github.trim().replace(/^\//, '').replace(/\.git$/, '');
    let gitbase = 'https://github.com/' + gitusr + '/' + slug;
    let repository = {
      type: 'git',
      url: 'git+' + gitbase + '.git'
    };
    let bugs = {
      url: gitbase + '/issues'
    };

    pkg.homepage = gitbase + '#readme';
    pkg.repository = chek.extend({}, pkg.repository, repository);
    pkg.bugs = chek.extend({}, pkg.bugs, bugs);

  }

  resp.author = toAuthor(resp.author);

  pkg.version = resp.version || pkg.version;
  pkg.author = resp.author.combined || pkg.author;
  pkg.description = resp.description || pkg.description;
  pkg.license = resp.license || pkg.license;

  if (resp.license === 'UNLICENSED')
    pkg.private = true;

  resp.html = {
    title: resp.name,
    appMountId: 'app',
    googleAnalytics: {
      trackingId: 'UA-XXXX-XX',
      pageViewOnLoad: true
    }
  };

  // Extend with Google Tracking Id.
  if (trackingId && trackingId.length)
    resp.html.googleAnalytics.trackingId = trackingId;

  if (resp.browserSync) {

    resp.browserSync = {
      // browser-sync-webpack-plugin options.
      options: {
        host: resp.host,
        port: resp.port,
        proxy: `http://${resp.host}:${resp.port}`,
      },

      // These are the options passed into
      // Browser Sync directly.
      plugin: {
        reload: false
      }
    }

  }

  // Delete redundant props.
  delete resp.version;
  delete resp.description;
  delete resp.github;
  delete resp.analytics;
  delete resp.license;

  chek.extend(pkg.build, resp);

  // Ensure package.json app name is lowered slug.
  pkg.name = slug;

  // Flag this package as initialized.
  pkg.build.initialized = true;

  // Save the package.json with user options.
  saveFile('package.json', JSON.stringify(pkg, null, 2));

  log.info(`successfully updated ${colurs.magenta('package.json')}`);
  log.info(`preparring to configure ${colurs.magenta('mustr templates')}`);

  // Generate templates based on settings.
  generate();

};

const ques = [

  {
    name: 'name',
    type: 'input',
    message: 'The name of your app?',
    filter: chek.titlecase,
    default: 'App'
  },

  {
    name: 'description',
    type: 'input',
    message: 'The app description?',
    filter: chek.capitalize,
    default: 'React App'
  },

  {
    name: 'version',
    type: 'input',
    message: 'What is the app version?',
    default: '1.0.0'
  },

  {
    name: 'author',
    type: 'input',
    message: 'Who is the author?',
    required: true,
    filter: (str) => {
      const author = toAuthor(str);
      return author.combined || str;
    },
    default: 'My Name <user@email.com>'
  },

  {
    name: 'browserSync',
    type: 'confirm',
    message: 'Use Browser Sync with Webpack Dev Server?',
    default: false
  },

  {
    name: 'host',
    type: 'input',
    message: 'What host address should be used?',
    default: 'localhost'
  },

  {
    name: 'port',
    type: 'input',
    message: 'What port should be used?',
    filter: Number,
    default: 3000
  },

  {
    name: 'analytics',
    type: 'input',
    message: 'Google Analytics tracking Id?',
    default: 'UA-XXXX-XX'
  },

  {
    name: 'github',
    type: 'input',
    message: 'What is your git username?',
    filter: chek.lowercase,
    required: true
  },

  {
    name: 'docker',
    type: 'confirm',
    message: 'Should we include Dockerfile?',
    default: false
  },

  {
    name: 'license',
    type: 'list',
    message: 'What license should be used?',
    choices: ['ISC', 'MIT', 'APACHE2', 'GPL3', 'UNLICENSED']
  }

];

module.exports = function (force) {

  log.write(colurs.bgBlue.white('\n React Typescript Webpack Configuration \n'));

  if ((!args.flags.f && !args.flags.force && !force) && (pkg.build && pkg.build.initialized))
    log.warn('project already initialized use flag -f to force.').exit();

  inq.prompt(ques)
    .then((resp) => {
      log.write();
      inq.prompt({
        name: 'confirm',
        type: 'confirm',
        message: 'All done, should we initialize the project?',
        default: false
      }).then((conf) => {
        if (!conf)
          log.error('whoops something when wrong failed to get configuration re-run node build configure.').exit();
        buildPackage(resp);
      });
    });

}
