import { Command, CommandData } from "../../interfaces/Command";
import { UrlEntity } from "../../database/entities/UrlEntity";
import { Response } from "express";

export class RedirectCommand implements Command {
  async execute(data: CommandData, res: Response) {
    const urlEntity = new UrlEntity(data.client);
    const url = await urlEntity.getUrl(data.params.id)

    if (url) {
      res.redirect(url);
    } else {
      res.redirect('/');
    }
  }
}