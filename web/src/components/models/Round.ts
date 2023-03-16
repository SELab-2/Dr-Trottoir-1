import Building from "./RoundBuilding";

export default interface Round {
  name: string;
  start: string;
  end: string;
  started: boolean;
  student: string;
  comments: boolean;
  current_building: number;
  buildings: Building[];
}
