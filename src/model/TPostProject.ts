import { TProject } from "./TProject";

// Backend accepts a different project object when POST/PATCH compared to GET

export type TProjectPost = {
  name?: TProject['name']; // Max 100 characters
  blurb?: TProject['blurb'];
  teamname?: TProject['teamname'];
  banner?: TProject['banner']
  thumbnail?: TProject['thumbnail']
  semester?: TProject['semester']['value']
  category?: TProject['category']['value']
  links?: {
    type: TProject['links'][0]['type']
    value: string
  }[]
  content?: TProject['content']
  badges?: TProject['badges']['value']
  tags?: TProject['badges']['value'][] // Max 20 characters
}