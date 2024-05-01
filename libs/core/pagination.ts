import { ApiProperty } from "@nestjs/swagger"

export abstract class Paginated<T> {
    abstract items: Array<T>

    @ApiProperty()
    totalCount: number

    // @ApiProperty()
    // pagesCount: number

    // @ApiProperty()
    // page: number

    @ApiProperty()
    size: number

    public static new<T>(data: {
        items: Array<T>,
        //  page,
        size,
        count
    }): Paginated<T> {
        return {
            totalCount: data.count,
            // pagesCount: Math.ceil(data.count / data.size),
            // page: data.page,
            size: data.size,
            items: data.items
        }
    }
}