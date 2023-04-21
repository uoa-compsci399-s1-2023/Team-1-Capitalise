  export type TProject = {
    _id: string,
    name: string,
    teamname: string,
    blurb: string,
    views: number,
    semester: { value: string },
    category: { value: 'Mobile Development' | 'Game Development' | 'Web Development'},
    links: 
      {
        value: string,
        type: 'github' | 'codesandbox' | 'deployedSite' | 'codepen' | 'notion' | 'kaggle'
        _id: string,
      }[]
    members: { _id: string, name: string}[]
    banner: string,
    thumbnail: string,
    content:
      {
        tabName: "My Goat Tab",
        tabContent:
          {
            type: string,
            subHeading?: string,
            value: string[],
            _id: string,
          }[]
        _id: string,
      }[]
    likes: number,
    comments: string[], // array of ids
    tags: {value: string}[],
    badges: {value: 'People\'s Choice' | 'Top Excellence' | 'Community Impact' }[],
    isBeingEdited: false,
    createdAt: string,
    updatedAt: string,
  }
  