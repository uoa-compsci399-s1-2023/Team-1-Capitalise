import React, { useState, useEffect } from 'react'
import getSearchParams from "../api/getSearchParameters"
import { TProject } from "../api/getProjects";

type TAvailParameters = {
    category: { _id: string; value: string; qParam?: string; parameterType: string }[];
    semester: { _id: string; value: string; qParam?: string; parameterType: string }[];
    award: { _id: string; value: string; qParam?: string; parameterType: string }[];
    sortBy: { _id: string; qParam: keyof TProject; value: string; parameterType: string }[];
};


// Returns new object literal of default params each time.
const getDefaultParams = (): TAvailParameters => {
    return {
        category: [{ _id: '0', value: "All (Default)", parameterType: "category" }],
        semester: [{ _id: '0', value: "All (Default)", parameterType: "semester" }],
        award: [{ _id: '0', value: "All (Default)", parameterType: "award" }],
        sortBy: [
            { _id: '0', qParam: "name", value: "Name (Default)", parameterType: "sortBy" },
            { _id: '1', qParam: "semester", value: "Semester", parameterType: "sortBy" },
            { _id: '2', qParam: "category", value: "Category", parameterType: "sortBy" },
            { _id: '3', qParam: "likes", value: "Likes", parameterType: "sortBy" },
            { _id: '4', qParam: "badges", value: "Awards", parameterType: "sortBy" }
        ]
    }
}

export default function useSearchParams(): TAvailParameters {
    // main variable that holds the currently available parameters

    type TAvailableParams = TAvailParameters
    const [params, setParams] = useState<TAvailParameters>(getDefaultParams);

    // Calls api and sets params
    async function fetchCurrentParameters() {
        const [cats, sems, awards, sorts] = await getSearchParams();
        setParams({
            category: [...(getDefaultParams().category), ...cats],
            semester: [...(getDefaultParams().semester), ...sems],
            award: [...(getDefaultParams().award), ...awards],
            sortBy: [...(getDefaultParams().sortBy)],
        })
    }

    useEffect(() => {
        fetchCurrentParameters();
    })

    return params
}
