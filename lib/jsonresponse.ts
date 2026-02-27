interface JsonResponse<T> {
  status: number;
  body: T;
}

const jsonresponse = <T>(status: number, body: T): JsonResponse<T> => {
  return {
    status,
    body,
  };
};

export default jsonresponse;