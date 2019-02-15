export const getTimeFromInput = (time: string): { hours: string, minutes: string } => {
  return {
    hours: time.slice(0, 2),
    minutes: time.slice(3, 5)
  };
};

