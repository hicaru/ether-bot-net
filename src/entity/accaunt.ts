import {
  Entity, PrimaryGeneratedColumn,
  Column, ManyToOne
} from 'typeorm';
import { IsString, IsInt, MinLength } from "class-validator";

import { Crypto } from './crypto';
import { Interfaces } from '../config/base';


@Entity()
export class Account {

  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, default: 3 })
  @IsInt()
  version: number;

  @Column({ nullable: false, unique: true })
  @IsString()
  @MinLength(40)
  address: string;

  @ManyToOne(type => Crypto, { nullable: false })
  crypto: Crypto;

  constructor(data?: Interfaces.IEncryptAccaunt) {
    if (data) {
      this.version = data.version;
      this.address = data.address;
      this.crypto = new Crypto(data);
    }
  }

}
