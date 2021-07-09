export interface Guild {
  id: string;
}

export const prepareGuild = ((payload: Record<string, any>): Guild => {
  const props: Guild = ({
    id: payload.id
  });

  return props;
});
