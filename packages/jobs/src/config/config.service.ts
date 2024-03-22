import { Injectable } from '@nestjs/common';
import { extractVars } from './config';

@Injectable()
export class ConfigService {
  async getConnString(): Promise<string> {
    const configs = await extractVars();

    return configs?.db_conn_string ?? '';
  }
}
