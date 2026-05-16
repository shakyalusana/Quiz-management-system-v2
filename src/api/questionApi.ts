import API from "@/request/request";

export const questionKeys = {
  all: ["questions"] as const,
};

export const questionApi = {
  getQuestions: async () => {
    const { data } = await API.get("/questions");
    return data;
  },

  createQuestion: async (payload: Record<string, unknown>) => {
    const { data } = await API.post("/questions", payload);

    return data;
  },

  updateQuestion: async ({
    id,
    payload,
  }: {
    id: string;
    payload: Record<string, unknown>;
  }) => {
    const { data } = await API.put(`/questions/${id}`, payload);

    return data;
  },

  deleteQuestion: async (id: string) => {
    const { data } = await API.delete(`/questions/${id}`);

    return data;
  },
};
