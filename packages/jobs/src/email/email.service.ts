import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SibApiV3Sdk from '@getbrevo/brevo';

export interface EmailEvent {
  agentIds: string;
  message: string;
  startDate: string;
  endDate: string;
}

@Injectable()
export class EmailService {
  private apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  private logger = new Logger(EmailService.name);
  constructor(private configService: ConfigService) {
    this.apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      this.configService.get<string>('BREVO_API_KEY'),
    );
  }

  async sendEmail(email: string, subject: string, body: string) {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.params = { body, subject };
    sendSmtpEmail.subject = '{{params.subject}}';

    try {
      this.logger.log(`sending emails now...${email}, ${subject} ${body}`);
      const data = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      this.logger.log('Email API called successfully. Returned data:', data);
    } catch (error) {
      this.logger.error('Failed to send email to email service', error);
    }
  }
}
