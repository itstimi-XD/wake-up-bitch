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
import {
  CreateAlarmUseCase,
  GetUserAlarmsUseCase,
  GetAlarmByIdUseCase,
  UpdateAlarmUseCase,
  DeleteAlarmUseCase,
  ToggleAlarmUseCase,
} from '@application/use-cases/alarm';
import { CreateAlarmDto } from '../dto/alarm/create-alarm.dto';
import { UpdateAlarmDto } from '../dto/alarm/update-alarm.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('alarms')
@UseGuards(JwtAuthGuard)
export class AlarmController {
  constructor(
    private readonly createAlarmUseCase: CreateAlarmUseCase,
    private readonly getUserAlarmsUseCase: GetUserAlarmsUseCase,
    private readonly getAlarmByIdUseCase: GetAlarmByIdUseCase,
    private readonly updateAlarmUseCase: UpdateAlarmUseCase,
    private readonly deleteAlarmUseCase: DeleteAlarmUseCase,
    private readonly toggleAlarmUseCase: ToggleAlarmUseCase,
  ) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateAlarmDto) {
    return this.createAlarmUseCase.execute({
      ...dto,
      userId: req.user.sub,
    });
  }

  @Get()
  async findAll(@Request() req) {
    return this.getUserAlarmsUseCase.execute(req.user.sub);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.getAlarmByIdUseCase.execute(id, req.user.sub);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateAlarmDto,
  ) {
    return this.updateAlarmUseCase.execute(id, req.user.sub, dto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    await this.deleteAlarmUseCase.execute(id, req.user.sub);
    return { message: 'Alarm deleted successfully' };
  }

  @Put(':id/toggle')
  async toggle(@Request() req, @Param('id') id: string) {
    return this.toggleAlarmUseCase.execute(id, req.user.sub);
  }
}
