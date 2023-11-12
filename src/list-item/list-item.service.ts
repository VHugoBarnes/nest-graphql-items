import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateListItemInput } from "./dto/create-list-item.input";
import { UpdateListItemInput } from "./dto/update-list-item.input";
import { InjectRepository } from "@nestjs/typeorm";
import { ListItem } from "./entities/list-item.entity";
import { Repository } from "typeorm";
import { List } from "src/lists/entities/list.entity";
import { PaginationArgs, SearchArgs } from "src/common/dto/args";

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
  ) { }

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;

    const newListItem = this.listItemRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId }
    });

    return this.listItemRepository.save(newListItem);
  }

  async findAll(list: List, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listItemRepository.createQueryBuilder("listItem")
      .innerJoin("listItem.item", "item")
      .take(limit)
      .skip(offset)
      .where("\"listId\" = :listId", { listId: list.id });

    if (search) {
      queryBuilder.andWhere("LOWER(item.name) like :name", { name: `%${search.toLowerCase()}%` });
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.listItemRepository.findOneBy({ id });

    if (!listItem) throw new NotFoundException("[item-not-found]");

    return listItem;
  }

  update(id: number, updateListItemInput: UpdateListItemInput) {
    return `This action updates a #${id} listItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
