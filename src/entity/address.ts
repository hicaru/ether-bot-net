import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsString, MinLength } from "class-validator";


@Entity()
export class Address {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  @IsString()
  @MinLength(42)
  address: string;

  constructor(address?: string) {
    if (address) {
      this.address = address;
    }
  }

}
