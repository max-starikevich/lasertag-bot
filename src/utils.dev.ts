export const getRandomArray = (length: number, max: number): number[] =>
  [...new Array(length)].map(() =>
    Math.round(Math.random() * max)
  )
