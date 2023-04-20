import Round from "./Round";

export default interface RoundPlanning {
  date: string;
  round: Round | null;
  showinfo: boolean;
  edit: boolean;
}
