import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Permissions, ResponseMessage } from 'src/decorator/customize';
import {
  PermissionAction,
  PermissionModule,
} from 'src/common/constants/permission.constant';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,
  ) {}

  @Get()
  @Permissions(`${PermissionModule.MAIL}.${PermissionAction.SEND_EMAIL}`)
  @ResponseMessage('Test email sent successfully')
  async handleTestEmail() {
    await this.mailerService.sendMail({
      to: 'luluvlogmot23@gmail.com',
      from: '"Support Team" <support@example.com>',
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'verification-otp',
      // context: {
      //   receiver: subs.name,
      // },
    });
    return 'Test email sent successfully';
  }
}
