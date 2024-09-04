import { Controller, Get } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) {}

    @Get()
    async index() {
        const data = await this.menuService.getMenuData();
        return data;
    }
}