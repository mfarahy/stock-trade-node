import * as inversify from 'inversify';

function logger(next: inversify.interfaces.Next): inversify.interfaces.Next {
  return (args: inversify.interfaces.NextArgs) => {
    let start = new Date().getTime();
    let result = next(args);
    let end = new Date().getTime();
    console.log(`wooooo  ${end - start}`);
    return result;
  };
}

export default logger;
