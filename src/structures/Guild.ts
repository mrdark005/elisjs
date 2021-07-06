export interface Guild {
  id: string;
}

export const create = ((payload: Record<string, unknown>): Guild => {
  const props: Guild = ({
    id: payload.id as string
  });

  return props;
});
