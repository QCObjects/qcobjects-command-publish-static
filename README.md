# QCObjects Publish Static Command

QCObjects Command that allows you to publish static resources from a source to a destination folder.

## Instructions

1. Install this dependency in your project using npm

```shell
npm i --save qcobjects-command-publish-static
```

2. Usage:

```shell
npx qcobjects publish:static ./src/ ./build/ --exclude ts --exclude js 
```

```shell
npx qcobjects publish:static ./build/ ./public/ --exclude ts --exclude js --exclude index.html 
```