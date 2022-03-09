export const getTimer = () => {
  let i = 0;
  const start = performance.now();
  return () => {
    const end = performance.now();
    console.log(`${++i}: ${(end - start) / 1000}`);
  };
};
