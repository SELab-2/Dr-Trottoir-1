import { Header } from "@/components/table/Header";
import { TableEntity } from "@/components/table/TableEntity";
import { RowType } from "@/components/table/RowType";
import { MailTemplateQuery, Result } from "@selab-2/groep-1-query";
import { tryOrAlertAsync } from "@/try";
import router from "@/router";

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
      {
        id: 1,
        name: "",
        fit: true,
        get: () => "mdi-pencil",
        type: RowType.ICONBUTTON,
        sortable: false,
        onClick: (e: Result<MailTemplateQuery>) => {
          router.push({ name: "template_new", params: { id: e.id } });
        },
      },
      {
        id: 2,
        name: "",
        fit: true,
        get: () => "mdi-delete",
        type: RowType.ICONBUTTON,
        sortable: false,
        onClick: (
          e: Result<MailTemplateQuery>,
          list: Array<Result<MailTemplateQuery> | null>,
        ) => {
          tryOrAlertAsync(async () => {
            await new MailTemplateQuery().deleteOne({ id: e.id });
            const index = list.findIndex((x) => x === e);
            list[index] = null;
          });
        },
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
