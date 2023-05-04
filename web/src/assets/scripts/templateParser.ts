import { BuildingQuery, Result } from "@selab-2/groep-1-query";


export function parseTemplate(building: Result<BuildingQuery>, template: string){
    const variables: { name: string; description: string }[] = [
        { name: "$(syndicus_voornaam)", description: "Voornaam van een syndicus" },
        {
          name: "$(syndicus_achternaam)",
          description: "Achternaam van een syndicus",
        },
        { name: "$(syndicus_naam)", description: "Volledige naam van een syndicus" },
        { name: "$(gebouw_naam)", description: "Naam van het gebouw" },
        { name: "$(gebouw_adres)", description: "Adres van het gebouw" },
        {name: '$(ivago_id)', description: 'Ivago ID van het gebouw'}
      ];
      
      const regex = new RegExp(
        variables.map((v) => v.name).join("|").replace(/\$/g, "\\$"),
        "g"
      );
      
      const replacedTemplate = template.replace(regex, (match) =>
        variables.findIndex((v) => v.name === match).toString()
      );
      
      console.log(replacedTemplate); // Output: Hello 0 3
}