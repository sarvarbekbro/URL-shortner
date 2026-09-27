import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import express from 'express';

import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';

@Controller()
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post('links')
  createLink(@Body() body: CreateLinkDto) {
    if (!body?.url) {
      throw new BadRequestException('"url" maydoni majburiy');
    }

    const record = this.linksService.create(body.url);

    return {
      code: record.code,
      url: record.url,
      shortUrl: `/r/${record.code}`,
      hits: record.hits,
      createdAt: record.createdAt,
    };
  }

  @Get('r/:code')
  followLink(@Param('code') code: string, @Res() res: express.Response) {
    const url = this.linksService.follow(code);

    return res.redirect(302, url);
}
  @Get('links/:code')
  getStats(@Param('code') code: string) {
    const record = this.linksService.stats(code);

    return {
      code: record.code,
      url: record.url,
      shortUrl: `/r/${record.code}`,
      hits: record.hits,
      createdAt: record.createdAt,
    };
  }
}
