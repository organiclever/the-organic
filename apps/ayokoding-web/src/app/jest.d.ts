import "@testing-library/jest-dom";
import { Matchers } from "@jest/expect";

declare global {
  function describe(name: string, fn: () => void): void;
  function it(name: string, fn: () => void): void;
  function expect<T = unknown>(actual: T): Matchers<T>;
}
