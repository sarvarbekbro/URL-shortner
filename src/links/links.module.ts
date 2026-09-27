import { Module } from '@nestjs/common';

import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { LinksStore } from './links.store';

@Module({
  controllers: [LinksController],
  providers: [LinksService, LinksStore],
  exports: [LinksService],
})
export class LinksModule {}