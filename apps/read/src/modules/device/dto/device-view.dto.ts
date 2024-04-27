import { ApiProperty } from "@nestjs/swagger"

export class DeviceViewDto {
    @ApiProperty()
    id: string

    @ApiProperty()
    title: string

    @ApiProperty()
    ip: string

    @ApiProperty()
    createdAt: string

    @ApiProperty()
    updatedAt: string
}
