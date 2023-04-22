import { TProject } from "./TProject";

// Backend accepts a different object when POST/PATCH compared to GET

export type TProjectPost = {
  name?: TProject['name']; // Max 100 characters
  blurb?: TProject['blurb'];
  teamname?: TProject['teamname'];
  banner?: TProject['banner']
  thumbnail?: TProject['thumbnail']
  semester?: TProject['semester']['value']
  category?: TProject['category']['value']
  links?: TProject['links']
  content?: TProject['content']
  badges?: TProject['badges']['value']
  tags?: TProject['badges']['value'][]
}