/**
 * Applies the given function sequentially to each element in the provided array.
 * Waits for the specified time after each function call.
 *
 * @param list The array of elements to process sequentially.
 * @param f The function to apply to each element. Returns a T, Promise<T>, void, or Promise<void>.
 * @param waitFor The time to wait after each function call, in **milliseconds**. Defaults to 500 milliseconds.
 * @returns A Promise that resolves when all elements have been processed. If the function returns void or Promise<void>, a Promise<void> is returned. Otherwise, the array of results from applying the function to each element is returned.
 * @throws TypeError If the function f is null or undefined.
 */
export const executeSequentially = async <S, T>(
  list: S[],
  f: (item: S, index: number) => Promise<T> | T,
  waitFor = 0,
): Promise<T[]> => {
  if (f == null) {
    throw new TypeError('The function f is null or undefined.');
  }

  const results: T[] = [];
  let index = 0;

  for (const item of list) {
    const result = await Promise.resolve(f(item, index));
    if (result !== undefined) {
      results.push(result);
    }
    await new Promise((resolve) => setTimeout(resolve, waitFor));
    index++;
  }

  return results;
};
