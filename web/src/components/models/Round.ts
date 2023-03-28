import Building from "./RoundBuilding";

export default interface Round {
  name: string;
  due_date: Date;
  start_time: Date|null;
  end_time: Date|null;
  student: string;
  buildings: Building[];
}
