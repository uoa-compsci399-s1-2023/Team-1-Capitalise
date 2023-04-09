import { TProject, getProjects } from "../api/getProjects";
import { useEffect, useState } from "react";

// we fetch all the projects here.   // this is causing an issue
const [projects, setProjects] = useState<TProject[]>([]);

async function fetchProjects() {
  const newProjects = await getProjects();
  setProjects(newProjects);
}
fetchProjects();

const service = {
  getData: ({ from, to }: { from: number; to: number }) => {
    return new Promise((resolve, reject) => {
      const data = projects.slice(from, to); // slice the project array

      resolve({
        count: projects.length,
        data: data,
      });
    });
  },
};

export default service;
