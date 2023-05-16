import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";
import { MailTemplateQuery, Result } from "@selab-2/groep-1-query";

export class Template implements TableEntity<Result<MailTemplateQuery>> {
  headers(): Array<Header<Result<MailTemplateQuery>>> {
    return Template.headers();
  }

  static headers(): Array<Header<Result<MailTemplateQuery>>> {
    return [
      {
        id: 0,
        name: "Template naam",
        fit: false,
        get: (e: Result<MailTemplateQuery>) => e.name,
        type: RowType.TEXT,
        sortable: true,
      },
    ].map((e) => new Header<Result<MailTemplateQuery>>(e));
  }

  route(item: Result<MailTemplateQuery>): {
    name: string;
    params: { id: number };
  } {
    return Template.route(item);
  }

  static route(item: Result<MailTemplateQuery>): {
    name: string;
    params: { id: number };
  } {
    return {
      name: "building_id",
      params: { id: item.id },
    };
  }
}
