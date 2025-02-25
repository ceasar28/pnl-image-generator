import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express'; // Import Response from Express
import { PnlService } from './pnl.service';

@Controller('pnl')
export class PnlController {
  constructor(private readonly pnlService: PnlService) {}

  @Post()
  async generatePnl(@Body() createPnlDto: any) {
    const pnlImage = await this.pnlService.generatePnlShot(createPnlDto);

    // res.set('Content-Type', 'image/png');
    // res.send(pnlImage);

    // console.log(pnlImage);
    return pnlImage;
  }
}
