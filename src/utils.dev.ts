export const getRandomArray = (length: number, max: number): number[] =>
  [...new Array(length)].map(() =>
    Math.round(Math.random() * max)
  )

export const getRandomNumber = (max: number): number => Math.round(Math.random() * max)
