export interface User {
  id: string;
}

export const prepareUser = ((payload: Record<string, any>): User => {
  const props: User = ({
    id: payload.id
  });

  return props;
});
