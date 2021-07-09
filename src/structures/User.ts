export interface User {
  id: string;
}

export const create = ((payload: Record<string, any>): User => {
  const props: User = ({
    id: payload.id
  });

  return props;
});
