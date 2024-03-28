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
  private sender = '';
  constructor(private configService: ConfigService) {
    this.apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      this.configService.get<string>('BREVO_API_KEY'),
    );
    this.sender = this.configService.get<string>('EMAIL_SENDER');
  }

  async sendEmail(email: string, subject: string, body: string) {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.htmlContent = `
      <html>
        <body>
          <h3>{{params.subject}}</h3>
          <p>{{params.body}}</p>
          </p>
        </body>
        </body>
      </html>
      `;
    sendSmtpEmail.params = { body, subject };
    sendSmtpEmail.subject = `${subject}`;
    sendSmtpEmail.sender = {
      email: this.sender,
      name: 'Incourage Sales Tracking',
    };
    sendSmtpEmail.replyTo = {
      email: this.sender,
      name: 'Incourage Sales Tracking',
    };
    sendSmtpEmail.to = [{ email }];

    try {
      this.logger.log(`sending emails now...${email}, ${subject} ${body}`);
      const data = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      this.logger.log('Email API called successfully. Returned data:', data);
    } catch (error) {
      this.logger.error('Failed to send email to email service', error);
    }
  }
}
