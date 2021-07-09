export interface Guild {
  id: string;
}

export const create = ((payload: Record<string, any>): Guild => {
  const props: Guild = ({
    id: payload.id
  });

  return props;
});
