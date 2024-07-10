import { InputType, Int, Field } from '@nestjs/graphql';
import { ItemRole } from '@prisma/client';

@InputType()
export class ItemAddressDto {
  @Field({ nullable: true })
  id?: string;

  @Field()
  longitude: number;

  @Field()
  latitude: number;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  country: string;

  @Field()
  address: string;
}

@InputType()
export class ItemImageDto {
  @Field({ nullable: true })
  id?: string;

  @Field()
  url: string;

  @Field()
  sequence: number;

  @Field({ nullable: true })
  itemId?: string;
}

@InputType()
export class ItemCategoryDto {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  itemId?: string;
}

@InputType()
export class CreateItemInput {
  @Field({ nullable: true })
  id?: string;

  @Field()
  email: string;

  @Field()
  title: string;

  @Field()
  phoneNumber: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  merchandisePhotoUrl?: string;

  @Field({ nullable: true })
  businessLogoUrl?: string;

  @Field({ nullable: true })
  setUpPictureUrl?: string;

  @Field()
  itemRole: ItemRole;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  itemDate?: Date;

  @Field({ nullable: true })
  availabilityStartDateTime?: Date;

  @Field({ nullable: true })
  availabilityEndDateTime?: Date;

  @Field({ nullable: true })
  approved?: boolean;

  @Field({ nullable: true })
  deletionDateTime?: Date;

  @Field({ nullable: true })
  approvalDateTime?: Date;

  @Field({ nullable: true })
  itemAddress?: ItemAddressDto;

  @Field({ nullable: true })
  itemImage?: ItemImageDto;

  @Field({ nullable: true })
  itemCategory?: ItemCategoryDto;
}
