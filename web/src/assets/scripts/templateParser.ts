import { BuildingQuery, Result } from "@selab-2/groep-1-query";

export function parseTemplate(
  building: Result<BuildingQuery>,
  template: string,
) {
  const variables: { name: string; description: string }[] = [
    {
      name: "\\$\\(syndicus_voornaam\\)",
      description: building.syndicus.first_name,
    },
    {
      name: "\\$\\(syndicus_achternaam\\)",
      description: building.syndicus.last_name,
    },
    {
      name: "\\$\\(syndicus_naam\\)",
      description: `${building.syndicus.first_name} ${building.syndicus.last_name}`,
    },
    { name: "\\$\\(gebouw_naam\\)", description: building.name },
    {
      name: "\\$\\(gebouw_adres\\)",
      description: `${building.address.street} ${building.address.number}, ${building.address.zip_code} ${building.address.city}`,
    },
    { name: "\\$\\(ivago_id\\)", description: building.ivago_id },
  ];

  let parsedString = template;
  variables.forEach((variable) => {
    const { name, description } = variable;
    parsedString = parsedString.replace(new RegExp(name, "g"), description);
  });

  return parsedString;
}
