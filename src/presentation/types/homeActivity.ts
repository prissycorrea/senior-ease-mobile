export type HomeActivity = {
  id: string;
  title: string;
  subtitle: string;
  done: boolean;
  /** YYYY-MM-DD (data local) para filtrar na agenda. */
  scheduleDate: string;
};
