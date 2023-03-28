export default interface RoundBuilding {
  name: string;
  address: string;
  start_time: Date|null;
  end_time: Date|null;
  comments: boolean;
  amount_of_pics: number;
}
