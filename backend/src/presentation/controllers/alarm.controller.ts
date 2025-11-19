import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateAlarmUseCase } from '@application/use-cases/alarm/create-alarm.use-case';
import { CreateAlarmDto } from '../dto/alarm/create-alarm.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('alarms')
@UseGuards(JwtAuthGuard)
export class AlarmController {
  constructor(private readonly createAlarmUseCase: CreateAlarmUseCase) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateAlarmDto) {
    return this.createAlarmUseCase.execute({
      ...dto,
      userId: req.user.sub,
    });
  }

  // More endpoints will be added later
  @Get()
  async findAll(@Request() req) {
    return { message: 'Get all alarms for user', userId: req.user.sub };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { message: 'Get alarm by id', id };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    return { message: 'Update alarm', id, dto };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return { message: 'Delete alarm', id };
  }

  @Put(':id/toggle')
  async toggle(@Param('id') id: string) {
    return { message: 'Toggle alarm', id };
  }
}
