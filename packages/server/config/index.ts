import * as path from 'path';
import { IConfig } from './iConfig';
import { defConfig } from './default';

async function getAppEnvContent(filePath): Promise<IConfig> {
  const contents = await import(filePath);
  return contents;
}

async function extractVars() {
  try {
    envConfig = await getAppEnvContent(path.join(__dirname, `${ENV}`));
  } catch (e) {
    console.log('Problem with sourcing env vars');
    console.log(e);
    process.exit(1);
  }
}

const ENV = process.env.NODE_ENV;
let envConfig: IConfig;

extractVars();

export default { ...defConfig, ...envConfig };
