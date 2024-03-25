import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Mailchimp from '@mailchimp/mailchimp_transactional';

export interface EmailEvent {
  agentIds: string;
  message: string;
  startDate: string;
  endDate: string;
}

@Injectable()
export class EmailService {
  private client: Mailchimp.ApiClient;
  constructor(private configService: ConfigService) {
    this.client = Mailchimp(
      this.configService.get<string>('MAILCHIMP_API_KEY'),
    );
  }

  async sendEmail(email: string, subject: string, body: string) {
    // try {
    //   const message = {
    //     from_email: this.configService.get<string>('FROM_EMAIL'),
    //     subject,
    //     text: body,
    //     to: [
    //       {
    //         email,
    //         type: 'to',
    //       },
    //     ],
    //   };

    //   // await this.client.messages.send({ message });
    // } catch (error) {
    //   throw new InternalServerErrorException('Failed to send email');
    // }

    console.log('sending emails now', email, subject, body);
  }
}
