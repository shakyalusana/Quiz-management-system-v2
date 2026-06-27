import { useQuery } from "@tanstack/react-query";
import API from "@/request/request";
import { API_ENDPOINTS } from "@/libs/endPoints";

/* ----------------------------------
   QUERY KEYS
-----------------------------------*/
export const recommendationKeys = {
  all: ["recommendations"] as const,

  contentBased: () => [...recommendationKeys.all, "content-based"] as const,

  collaborative: () => [...recommendationKeys.all, "collaborative"] as const,

  popularity: () => [...recommendationKeys.all, "popularity"] as const,

  hybrid: () => [...recommendationKeys.all, "hybrid"] as const,

  kmeans: () => [...recommendationKeys.all, "kmeans"] as const,

  apriori: () => [...recommendationKeys.all, "apriori"] as const,

  allAlgorithms: () => [...recommendationKeys.all, "all"] as const,
};

/* ----------------------------------
   API FUNCTIONS
-----------------------------------*/

const recommendationAPI = {
  getContentBased: async () => {
    const { data } = await API.get(API_ENDPOINTS.RECOMMENDATION.CONTENT_BASED);
    return data;
  },

  getCollaborative: async () => {
    const { data } = await API.get(API_ENDPOINTS.RECOMMENDATION.COLLABORATIVE);
    return data;
  },

  getPopularity: async () => {
    const { data } = await API.get(API_ENDPOINTS.RECOMMENDATION.POPULARITY);
    return data;
  },

  getHybrid: async () => {
    const { data } = await API.get(API_ENDPOINTS.RECOMMENDATION.HYBRID);
    return data;
  },

  getKMeans: async () => {
    const { data } = await API.get(API_ENDPOINTS.RECOMMENDATION.KMEANS);
    return data;
  },

  getApriori: async () => {
    const { data } = await API.get(API_ENDPOINTS.RECOMMENDATION.APRIORI);
    return data;
  },

  getAllAlgorithms: async () => {
    const { data } = await API.get(API_ENDPOINTS.RECOMMENDATION.ALL);
    return data;
  },
};

/* ----------------------------------
   HOOKS
-----------------------------------*/

export const RECOMMENDATIONAPI = {
  useContentBased: () =>
    useQuery({
      queryKey: recommendationKeys.contentBased(),
      queryFn: recommendationAPI.getContentBased,
    }),

  useCollaborative: () =>
    useQuery({
      queryKey: recommendationKeys.collaborative(),
      queryFn: recommendationAPI.getCollaborative,
    }),

  usePopularity: () =>
    useQuery({
      queryKey: recommendationKeys.popularity(),
      queryFn: recommendationAPI.getPopularity,
    }),

  useHybrid: () =>
    useQuery({
      queryKey: recommendationKeys.hybrid(),
      queryFn: recommendationAPI.getHybrid,
    }),

  useKMeans: () =>
    useQuery({
      queryKey: recommendationKeys.kmeans(),
      queryFn: recommendationAPI.getKMeans,
    }),

  useApriori: () =>
    useQuery({
      queryKey: recommendationKeys.apriori(),
      queryFn: recommendationAPI.getApriori,
    }),

  useAllAlgorithms: () =>
    useQuery({
      queryKey: recommendationKeys.allAlgorithms(),
      queryFn: recommendationAPI.getAllAlgorithms,
    }),
} as const;
