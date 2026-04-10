export const createMapper = (
  startX: number, endX: number,
  minY: number, maxY: number,
  width: number, height: number,
  padding: number
) => {
  const rangeX = endX - startX || 1;
  const rangeY = maxY - minY || 1;

  const mapX = (x: number) =>
    padding + ((x - startX) / rangeX) * (width - 2 * padding);

  const mapY = (y: number) =>
    height - padding - ((y - minY) / rangeY) * (height - 2 * padding);

  return { mapX, mapY };
};
