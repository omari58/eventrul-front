/*******************************
          Update Repos
*******************************/

/*

 This task update all SUI individual component repos with new versions of components

  * Commits changes from create repo
  * Pushes changes to GitHub
  * Tag new releases if version changed in main repo

*/

const fs = require('fs')
const path = require('path')
const gulp = require('gulp')

// node dependencies
const console = require('better-console')
const git = require('gulp-git')

// admin files
const github = require('../../config/admin/github.js')
const release = require('../../config/admin/release')
const project = require('../../config/project/release')

// oAuth configuration for GitHub
const oAuth = fs.existsSync(__dirname + '/../../config/admin/oauth.js')
  ? require('../../config/admin/oauth')
  : false

// shorthand
const version = project.version
module.exports = function(callback) {
  let index = -1
  const total = release.components.length
  let timer
  let stream
  let stepRepo

  if (!oAuth) {
    console.error(
      'Must add oauth token for GitHub in tasks/config/admin/oauth.js'
    )
    return
  }

  // Do Git commands synchronously per component, to avoid issues
  stepRepo = function() {
    index = index + 1
    if (index >= total) {
      callback()
      return
    }

    const component = release.components[index]
    const outputDirectory = path.resolve(
      path.join(release.outputRoot, component)
    )
    const capitalizedComponent =
      component.charAt(0).toUpperCase() + component.slice(1)
    const repoName = release.componentRepoRoot + capitalizedComponent

    const gitURL = 'https://github.com/' + release.org + '/' + repoName + '.git'
    const repoURL = 'https://github.com/' + release.org + '/' + repoName + '/'

    const commitArgs =
      oAuth.name !== undefined && oAuth.email !== undefined
        ? '--author "' + oAuth.name + ' <' + oAuth.email + '>"'
        : ''

    const componentPackage = fs.existsSync(outputDirectory + 'package.json')
      ? require(outputDirectory + 'package.json')
      : false

    const isNewVersion = version && componentPackage.version != version

    const commitMessage = isNewVersion
      ? 'Updated component to version ' + version
      : 'Updated files from main repo'

    const gitOptions = { cwd: outputDirectory }
    const commitOptions = { args: commitArgs, cwd: outputDirectory }
    const releaseOptions = {
      tag_name: version,
      owner: release.org,
      repo: repoName
    }

    const fileModeOptions = {
      args: 'config core.fileMode false',
      cwd: outputDirectory
    }
    const usernameOptions = {
      args: 'config user.name "' + oAuth.name + '"',
      cwd: outputDirectory
    }
    const emailOptions = {
      args: 'config user.email "' + oAuth.email + '"',
      cwd: outputDirectory
    }
    const versionOptions = {
      args: 'rev-parse --verify HEAD',
      cwd: outputDirectory
    }

    const localRepoSetup = fs.existsSync(path.join(outputDirectory, '.git'))
    const canProceed = true
    console.info('Processing repository:' + outputDirectory)

    function setConfig() {
      git.exec(fileModeOptions, function() {
        git.exec(usernameOptions, function() {
          git.exec(emailOptions, function() {
            commitFiles()
          })
        })
      })
    }

    // standard path
    function commitFiles() {
      // commit files
      console.info('Committing ' + component + ' files', commitArgs)
      gulp
        .src('./', gitOptions)
        .pipe(git.add(gitOptions))
        .pipe(git.commit(commitMessage, commitOptions))
        .on('error', function(error) {
          // canProceed = false; bug in git commit <https://github.com/stevelacy/gulp-git/issues/49>
        })
        .on('finish', function(callback) {
          if (canProceed) {
            pushFiles()
          } else {
            console.info('Nothing new to commit')
            nextRepo()
          }
        })
    }

    // push changes to remote
    function pushFiles() {
      console.info('Pushing files for ' + component)
      git.push('origin', 'master', { args: '', cwd: outputDirectory }, function(
        error
      ) {
        console.info('Push completed successfully')
        getSHA()
      })
    }

    // gets SHA of last commit
    function getSHA() {
      git.exec(versionOptions, function(error, version) {
        version = version.trim()
        createRelease(version)
      })
    }

    // create release on GitHub.com
    function createRelease(version) {
      if (version) {
        releaseOptions.target_commitish = version
      }
      github.repos.createRelease(releaseOptions, function() {
        nextRepo()
      })
    }

    // Steps to next repository
    function nextRepo() {
      console.log('Sleeping for 1 second...')
      // avoid rate throttling
      global.clearTimeout(timer)
      timer = global.setTimeout(stepRepo, 100)
    }

    if (localRepoSetup) {
      setConfig()
    } else {
      console.error('Repository must be setup before running update components')
    }
  }

  stepRepo()
}
