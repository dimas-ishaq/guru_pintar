import { appScript } from './apps/web/src/alpine/app.ts';
const script = appScript();
const appFunc = new Function(script + '; return app;')();
const appObj = appFunc();
console.log(Object.keys(appObj).join(", "));
