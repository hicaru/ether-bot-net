import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsString, IsBoolean, IsNumber } from "class-validator";

import { Address } from './address';

@Entity()
export class Tx {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsString()
  blockHash: string;

  @Column({ nullable: true })
  @IsNumber()
  blockNumber: number;

  @Column({ nullable: true })
  @IsString()
  contractAddress: string;

  @Column({ nullable: true })
  @IsNumber()
  cumulativeGasUsed: number;

  @Column({ nullable: true })
  @IsNumber()
  gasUsed: number;

  @Column({ nullable: false, default: false })
  @IsBoolean()
  status: boolean;

  @Column({ nullable: false })
  @IsString()
  transactionHash: string;

  @Column({ nullable: true })
  @IsNumber()
  transactionIndex: number;

  @ManyToOne(type => Address, { nullable: false })
  address: Address;

}
