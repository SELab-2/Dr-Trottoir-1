import { ProgressImageType } from "@selab-2/groep-1-orm";

export default interface Address {
  image: File[];
  comments: string;
  type: ProgressImageType;
}
