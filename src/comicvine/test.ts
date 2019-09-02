import {Field, Int, ObjectType} from 'type-graphql';

@ObjectType()
export class Test {
    @Field(type => Int)
    id: number;

    @Field({nullable: true})
    firstName?: string;

    @Field({nullable: true})
    lastName?: string;
}
