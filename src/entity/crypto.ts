import {
  Entity, PrimaryGeneratedColumn,
  Column, ManyToOne, OneToMany
} from 'typeorm';
import { IsString, MinLength } from "class-validator";

import { Cipherparams } from './cipherparams';
import { Kdfparams } from './kdfparams';
import { Account } from './accaunt';
import { Interfaces } from '../config/base';


@Entity()
export class Crypto {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsString()
  @MinLength(64)
  ciphertext: string;

  @Column({ nullable: false, default: 'aes-128-ctr' })
  @IsString()
  cipher: string;

  @Column({ nullable: false, default: 'scrypt' })
  @IsString()
  kdf: string;

  @Column({ nullable: false })
  @IsString()
  @MinLength(64)
  mac: string;

  @OneToMany(type => Account, Account => Account)
  account: Account[];

  @ManyToOne(type => Cipherparams, { nullable: false })
  cipherparams: Cipherparams;

  @ManyToOne(type => Kdfparams, { nullable: false })
  kdfparams: Kdfparams;

  constructor(data?: Interfaces.IEncryptAccaunt) {
    if (data && data.crypto) {
      this.ciphertext = data.crypto.ciphertext;
      this.cipher = data.crypto.cipher;
      this.kdf = data.crypto.kdf;
      this.mac = data.crypto.mac;

      this.cipherparams = new Cipherparams(data);
      this.kdfparams = new Kdfparams(data);
    }
  }

}
