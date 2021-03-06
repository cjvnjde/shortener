import { Command, CommandData } from "../../interfaces/Command";
import { UrlEntity } from "../../database/entities/UrlEntity";
import { Response } from "express";

export class ShortenCommand implements Command {
  async execute(data: CommandData, res: Response) {
    const urlEntity = new UrlEntity(data.client);
    const key = await urlEntity.generateKey(String(data.body.url))

    res.json({ key })
  }
}