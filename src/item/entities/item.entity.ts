import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ItemRole } from '@prisma/client';
import { ItemAddress } from './item-address.entity';
import { ItemImage } from './item-image.entity';
import { ItemCategory } from './item-category.entity.';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Item {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  merchandisePhotoUrl?: string;

  @Field({ nullable: true })
  businessLogoUrl?: string;

  @Field({ nullable: true })
  setUpPictureUrl?: string;

  @Field({ nullable: true })
  itemRole?: ItemRole;

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
  itemAddress?: ItemAddress;

  @Field(() => [ItemImage], { nullable: true })
  itemImage?: ItemImage[];

  @Field({ nullable: true })
  itemCategory?: ItemCategory;

  @Field({ nullable: true })
  createdAt?: Date;
  @Field({ nullable: true })
  updatedAt?: Date;

  @Field({ nullable: true })
  isFavorite?: Boolean;

  @Field({ nullable: true })
  user?: User;
}
