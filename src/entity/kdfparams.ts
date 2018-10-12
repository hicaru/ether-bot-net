import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsString, IsInt, MinLength } from "class-validator";

import { Crypto } from './crypto';
import { Interfaces } from '../config/base';


@Entity()
export class Kdfparams {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsInt()
  dklen: number;

  @Column({ nullable: false })
  @IsString()
  @MinLength(64)
  salt: string;

  @Column({ nullable: false })
  @IsInt()
  n: number;

  @Column({ nullable: false })
  @IsInt()
  r: number;

  @Column({ nullable: false })
  @IsInt()
  p: number;

  @OneToMany(type => Crypto, Crypto => Crypto)
  crypto: Crypto[];

  constructor(data?: Interfaces.IEncryptAccaunt) {
    if (data) {
      this.dklen = data.crypto.kdfparams.dklen;
      this.salt = data.crypto.kdfparams.salt;
      this.n = data.crypto.kdfparams.n;
      this.r = data.crypto.kdfparams.r;
      this.p = data.crypto.kdfparams.p;
    }
  }

}
