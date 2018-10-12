import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { IsString } from "class-validator";

import { Interfaces } from '../config/base';
import { Crypto } from './crypto';

@Entity()
export class Cipherparams {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsString()
  iv: string;

  @OneToMany(type => Crypto, Crypto => Crypto)
  crypto: Crypto[];

  constructor(data?: Interfaces.IEncryptAccaunt) {
    if (data) {
      this.iv = data.crypto.cipherparams.iv;
    }
  }

}
