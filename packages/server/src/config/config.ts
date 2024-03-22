import * as path from 'path';
import { IConfig } from './iConfig';
import { defConfig } from './default';

async function getAppEnvContent(filePath): Promise<IConfig> {
  const { default: defaultContent } = await import(`./${filePath}`);
  return defaultContent;
}

async function extractVars() {
  const ENV = process.env.NODE_ENV;
  let envConfig: IConfig;

  try {
    envConfig = await getAppEnvContent(path.join('.', `${ENV}`));

    const configObj = { ...defConfig, ...envConfig };

    return configObj;
  } catch (e) {
    console.log('Problem with sourcing env vars');
    console.log(e);
    process.exit(1);
  }
}

export { extractVars };
