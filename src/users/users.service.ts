import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  async findAll(): Promise<User[]> {
    return [];
  }

  async findOne(id: string): Promise<User> {
    throw new Error("findOne not implemented");
  }

  block(id: string): Promise<User> {
    throw new Error("block not implemented");
  }
}
