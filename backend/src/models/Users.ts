import { Table, Column, Model, DataType, HasMany, Default, Unique, AllowNull } from "sequelize-typescript";
import Budget from "./budget";

@Table({
    tableName: 'users'
})

class User extends Model{
    @AllowNull(false)
    @Column({
        type: DataType.STRING(100)

    })
    declare name: string

    @AllowNull(false)
    @Column({
        type:DataType.STRING(60)

    })
    declare password:string

    @Unique(false)
    @AllowNull(false)
    @Column({
        type: DataType.STRING(50)
    })
    declare email: string

    @Column({
        type: DataType.STRING(6)
    })
    declare token: string


    @Default(false)
    @Column({
        type: DataType.BOOLEAN
    })
    declare confirmed: string

    @HasMany(()=> Budget, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' 
    })
    declare budgets: Budget[]
}

export default User