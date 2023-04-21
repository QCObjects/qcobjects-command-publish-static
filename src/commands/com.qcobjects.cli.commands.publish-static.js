/**
 * QCObjects CLI 2.4.x
 * ________________
 *
 * Author: Jean Machuca <correojean@gmail.com>
 *
 * Cross Browser Javascript Framework for MVC Patterns
 * QuickCorp/QCObjects is licensed under the
 * GNU Lesser General Public License v3.0
 * [LICENSE] (https://github.com/QuickCorp/QCObjects/blob/master/LICENSE.txt)
 *
 * Permissions of this copyleft license are conditioned on making available
 * complete source code of licensed works and modifications under the same
 * license or the GNU GPLv3. Copyright and license notices must be preserved.
 * Contributors provide an express grant of patent rights. However, a larger
 * work using the licensed work through interfaces provided by the licensed
 * work may be distributed under different terms and without source code for
 * the larger work.
 *
 * Copyright (C) 2015 Jean Machuca,<correojean@gmail.com>
 *
 * Everyone is permitted to copy and distribute verbatim copies of this
 * license document, but changing it is not allowed.
*/
/*eslint no-unused-vars: "off"*/
/*eslint no-redeclare: "off"*/
/*eslint no-empty: "off"*/
/*eslint strict: "off"*/
/*eslint no-mixed-operators: "off"*/
/*eslint no-undef: "off"*/
"use strict";
const fs = require("fs");
const path = require("path");
const absolutePath = path.resolve( __dirname, "./" );
const { exec,execSync } = require("child_process");
const process = require ("process");

Package("com.qcobjects.cli.commands.publish-static",[

  class CommandHandler extends InheritClass {

    choiceOption={
      publish_static(source, dest, options){
        function copyDir(source, dest, exclude) {
          const fs = require("fs");

          // usage: dislist ("./build/", "./public/")
          function dirlist(sourcePath, destPath) {
              const dirs = fs.readdirSync(path.resolve(sourcePath), {
                  withFileTypes: true
              }).filter(d => d.isDirectory()).map(d => {
                  return {
                      name: d.name,
                      source: path.resolve(sourcePath, `${d.name}`),
                      dest: path.resolve(destPath, `${d.name}`),
                      children: dirlist(path.resolve(sourcePath, `${d.name}`), path.resolve(destPath, `${d.name}`)),
                      files: fs.readdirSync(path.resolve(sourcePath), {
                          withFileTypes: true
                      }).filter(f => f.isFile()).map(f => {
                          return {
                              name: f.name,
                              source: path.resolve(sourcePath, `${f.name}`),
                              dest: path.resolve(destPath, `${f.name}`)
                          }
                      })
                  }
              });
              return dirs;
          }
      
      
      
          fs.mkdirSync(dest, {recursive:true});
          logger.debug(`Copying directory ${source} to ${dest}...`);
          dirlist(source, dest).filter(dirl => !exclude.includes(dirl.name)).map(dirl => {
              fs.mkdirSync(dirl.dest, {recursive:true});
              if (typeof dirl.files !== "undefined") {
                  dirl.files.filter(f => !exclude.includes(f.name)).map((f) => {
                      logger.debug(`Copying file ${f.source} to ${f.dest}...`);
                      fs.copyFileSync(f.source, f.dest);
                      logger.debug(`Copying file ${f.source} to ${f.dest}... DONE.`);
                  });
              }
              if (typeof dirl.children !== "undefined") {
                  dirl.children.filter(d => !exclude.includes(d.name)).map(d => {
                      copyDir(d.source, d.dest, exclude);
                  });
              }
          });
          logger.debug(`Copying directory ${source} to ${dest}... DONE.`);
        }

        try {
          logger.info(`[publish:static] Copying files from ${source} to ${dest} excluding ${options.exclude}...`);
          copyDir(source, dest, (typeof options.exclude !== "undefined")?(options.exclude):([]));
        } catch (e){
          logger.warn(`Something went wrong trying to publish static files: ${e.message}`);
          process.exit(1);
        }
      }
    };

    constructor({switchCommander}){
      super({switchCommander});

      let commandHandler = this;
      logger.debug("Loading command publish-static...");

      switchCommander.program.command("publish:static <source> <dest>")
        .allowExcessArguments(false)
        .option("-e, --exclude <excludePaths...>", "Exclude some paths or files")
        .description("Publishes (copy) all files and directories from source to dest")
        .action(function(source, dest, options){
            commandHandler.choiceOption.publish_static.call(commandHandler,source, dest, options);
        });

      logger.debug("Loading command publish-static... DONE.");

    }

  }

]);
