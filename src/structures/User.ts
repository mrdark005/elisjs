export interface User {
  id: string;
}

export const create = ((payload: Record<string, unknown>): User => {
  const props: User = ({
    id: payload.id as string
  });

  return props;
});
