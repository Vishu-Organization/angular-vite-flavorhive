const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// List of apps (dynamically find apps based on the 'apps' folder)
const apps = fs
  .readdirSync('apps')
  .filter((dir) => fs.existsSync(path.join('apps', dir, 'project.json')))
  .map((dir) => path.join('apps', dir));

apps.forEach((app) => {
  const appName = path.basename(app);

  // Build each app
  console.log(`Building ${appName}...`);
  execSync(`npx nx build ${appName}`, { stdio: 'inherit' });

  const sourcePath = path.join('dist', 'apps', appName);
  const destinationPath = path.join('dist', appName);

  // Ensure the output directory exists before copying
  if (fs.existsSync(sourcePath)) {
    // Create the destination directory if it doesn't exist
    if (!fs.existsSync(destinationPath)) {
      console.log(`Creating directory: ${destinationPath}`);
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    // Copy the files to the destination
    console.log(`Copying ${appName} files...`);
    execSync(`cp -r ${sourcePath}/* ${destinationPath}`, { stdio: 'inherit' });
  } else {
    console.error(
      `Error: Build output for ${appName} not found at ${sourcePath}`
    );
    process.exit(1); // Exit if build output is missing
  }
});

console.log('Build and copy complete!');
