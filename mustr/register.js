/**
 * See examples/register.js
 * for example register.
 */

const pkg = require('../package.json');

module.exports = (mu, Compiler) => {

  const year = (new Date()).getFullYear();
  const author = (pkg.build && pkg.build.author) || { name: 'Your Name', email: 'name@email.com' };

  const ownermeta = {
    owner: author.name,
    email: author.email,
    year: year
  };

  let initTemplates = ['readme', 'main.spec', 'typedoc'];

  // Check for license.
  if (pkg.license) {
    const lic = pkg.license.toLowerCase();
    initTemplates.push(`license.${lic}`)
  }

  // Check if should include docker file.
  if (pkg.build.docker)
    initTemplates = initTemplates.concat(['docker.file', 'docker.ignore']);

  // Override auto registered licenses
  // include metadata from package.json.
  mu.register('license.apache2', { metadata: ownermeta });
  mu.register('license.gpl3', { metadata: ownermeta });
  mu.register('license.isc', { metadata: ownermeta });
  mu.register('license.mit', { metadata: ownermeta });
  mu.register('main.spec', 'spec', { outputPath: './src/main.spec.ts', metadata: { describe: pkg.build.name } });

  mu.register('readme', { metadata: pkg });
  mu.register('typedoc', { metadata: { app: pkg.build.name } });

  // Override register for Docker.
  mu.register('docker.file', { metadata: ownermeta });

  // Init Templates
  mu.registerComponent('init', initTemplates);

  // Primary Templates
  mu.registerComponent('component', 'index', 'view', 'service');

};