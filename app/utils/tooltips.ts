import type { IMarkdownString, languages } from "monaco-editor";

type Tooltip = {
  type: "method" | "property";
  strings: IMarkdownString[];
};

// source: mdn web docs
export const consoleTooltips = {
  log: {
    type: "method",
    strings: [
      {
        value: "`method) Console.log(...data: any[]): void`",
      },
      {
        value:
          "The `console.log()` static method outputs a message to the console.",
      },
    ],
  },

  warn: {
    type: "method",
    strings: [
      {
        value: "`method) Console.warn(...data: any[]): void`",
      },
      {
        value:
          'The `console.warn()` static method outputs a warning message to the console at the "warning" log level. The message receives special formatting in the form of yellow colors and a warning icon.',
      },
    ],
  },
  error: {
    type: "method",
    strings: [
      {
        value: "`method) Console.error(...data: any[]): void`",
      },
      {
        value:
          'The `console.error()` static method outputs a message to the console at the "error" log level. The message receives special formatting in the form of red colors and call stack information.',
      },
    ],
  },
} as const satisfies Record<string, Tooltip>;

export function insertConsoleTooltips(
  word: string,
  lineText: string
): languages.ProviderResult<languages.Hover> | void {
  // @ts-expect-error shut up
  const consoleTooltip = consoleTooltips[word];
  if (!consoleTooltip) return;

  const consoleRegex = /\bconsole\.\w+\b/g;
  const consoleMatch = lineText.match(consoleRegex);

  if (consoleMatch && consoleMatch.some((match) => match.includes(word)))
    return {
      contents: consoleTooltip.strings,
    };
}

// source: typescript esXXXX type declarations
// https://github.com/microsoft/TypeScript/blob/main/src/lib
export const mathTooltips = {
  floor: [
    {
      value: "`(method) Math.floor(x: number): number`",
    },
    {
      value:
        "Returns the greatest integer less than or equal to its numeric argument.",
    },
    {
      value: "**@param** `x` — A numeric expression.",
    },
  ],
  max: [
    {
      value: "`(method) Math.max(...values: number[]): number`",
    },
    {
      value: "Returns the larger of a set of supplied numeric expressions.",
    },
    {
      value: "**@param** `values` — Numeric expressions to be evaluated.",
    },
  ],
  min: [
    {
      value: "`(method) Math.min(...values: number[]): number`",
    },
    {
      value: "Returns the smaller of a set of supplied numeric expressions.",
    },
    {
      value: "**@param** `values` — Numeric expressions to be evaluated.",
    },
  ],
  round: [
    {
      value: "`(method) Math.round(x: number): number`",
    },
    {
      value:
        "Returns a supplied numeric expression rounded to the nearest integer.",
    },
    {
      value: "**@param** `x` — The value to be rounded to the nearest integer.",
    },
  ],
  random: [
    {
      value: "`(method) Math.random(): number`",
    },
    {
      value: "Returns a pseudorandom number between 0 and 1.",
    },
  ],
  E: [
    {
      value: "`(property) Math.E: number`",
    },
    {
      value:
        "The mathematical constant e. This is Euler's number, the base of natural logarithms.",
    },
  ],
  LN10: [
    {
      value: "`(property) Math.LN10: number`",
    },
    {
      value: "The natural logarithm of 10.",
    },
  ],
  LN2: [
    {
      value: "`(property) Math.LN2: number`",
    },
    {
      value: "The natural logarithm of 2.",
    },
  ],
  LOG10E: [
    {
      value: "`(property) Math.LOG10E: number`",
    },
    {
      value: "The base-10 logarithm of e.",
    },
  ],
  LOG2E: [
    {
      value: "`(property) Math.LOG2E: number`",
    },
    {
      value: "The base-2 logarithm of e.",
    },
  ],
  PI: [
    {
      value: "`(property) Math.PI: number`",
    },
    {
      value:
        "Pi. This is the ratio of the circumference of a circle to its diameter.",
    },
  ],
  SQRT1_2: [
    {
      value: "`(property) Math.SQRT1_2: number`",
    },
    {
      value:
        "The square root of 0.5, or, equivalently, one divided by the square root of 2.",
    },
  ],
  SQRT2: [
    {
      value: "`(property) Math.SQRT2: number`",
    },
    {
      value: "The square root of 2.",
    },
  ],
  abs: [
    {
      value: "`(method) Math.abs(x: number): number`",
    },
    {
      value:
        "Returns the absolute value of a number (the value without regard to whether it is positive or negative). For example, the absolute value of -5 is the same as the absolute value of 5.",
    },
    {
      value:
        "**@param** `x` — A numeric expression for which the absolute value is needed.",
    },
  ],
  acos: [
    {
      value: "`(method) Math.acos(x: number): number`",
    },
    {
      value: "Returns the arc cosine (or inverse cosine) of a number.",
    },
    {
      value: "**@param** `x` - A numeric expression.",
    },
  ],
  acosh: [
    {
      value: "`(method) Math.acosh(x: number): number`",
    },
    {
      value: "Returns the inverse hyperbolic cosine of a number.",
    },
    {
      value:
        "**@param** `x` - A numeric expression that contains an angle measured in radians.",
    },
  ],
  asin: [
    {
      value: "`(method) Math.asin(x: number): number`",
    },
    {
      value: "Returns the arcsine of a number.",
    },
    {
      value: "**@param** `x` - A numeric expression.",
    },
  ],
  asinh: [
    {
      value: "`(method) Math.asinh(x: number): number`",
    },
    {
      value: "Returns the inverse hyperbolic sine of a number.",
    },
    {
      value:
        "**@param** `x` — A numeric expression that contains an angle measured in radians.",
    },
  ],
  atan: [
    {
      value: "`(method) Math.atan(x: number): number`",
    },
    {
      value: "Returns the arctangent of a number.",
    },
    {
      value:
        "**@param** `x` - A numeric expression for which the arctangent is needed.",
    },
  ],
  atan2: [
    {
      value: "`(method) Math.atan2(y: number, x: number): number`",
    },
    {
      value:
        "Returns the angle (in radians) between the X axis and the line going through both the origin and the given point.",
    },
    {
      value:
        "**@param** `y` - A numeric expression representing the cartesian y-coordinate.",
    },
    {
      value:
        "**@param** `x` - A numeric expression representing the cartesian x-coordinate.",
    },
  ],
  atanh: [
    {
      value: "`(method) Math.atanh(x: number): number`",
    },
    {
      value: "Returns the inverse hyperbolic tangent of a number.",
    },
    {
      value:
        "**@param** `x` - A numeric expression that contains an angle measured in radians.",
    },
  ],
  cbrt: [
    {
      value: "`(method) Math.cbrt(x: number): number`",
    },
    {
      value:
        "Returns an implementation-dependent approximation to the cube root of number.",
    },
    {
      value: "**@param** `x` - A numeric expression.",
    },
  ],
  ceil: [
    {
      value: "`(method) Math.ceil(x: number): number`",
    },
    {
      value:
        "Returns the smallest integer greater than or equal to its numeric argument.",
    },
    {
      value: "**@param** `x` - A numeric expression.",
    },
  ],
  clz32: [
    {
      value: "`(method) Math.clz32(x: number): number`",
    },
    {
      value:
        "Returns the number of leading zero bits in the 32-bit binary representation of a number.",
    },
    {
      value: "**@param** `x` - A numeric expression.",
    },
  ],
  cos: [
    {
      value: "`(method) Math.cos(x: number): number`",
    },
    {
      value: "Returns the cosine of a number.",
    },
    {
      value:
        "**@param** `x` - A numeric expression that contains an angle measured in radians.",
    },
  ],
  cosh: [
    {
      value: "`(method) Math.cosh(x: number): number`",
    },
    {
      value: "Returns the hyperbolic cosine of a number.",
    },
    {
      value:
        "**@param** `x` - A numeric expression that contains an angle measured in radians.",
    },
  ],
  exp: [
    {
      value: "`(method) Math.exp(x: number): number`",
    },
    {
      value: "Returns e (the base of natural logarithms) raised to a power.",
    },
    {
      value:
        "**@param** `x` - A numeric expression representing the power of e.",
    },
  ],
  expm1: [
    {
      value: "`(method) Math.expm1(x: number): number`",
    },
    {
      value:
        "Returns the result of (e^x - 1), which is an implementation-dependent approximation to subtracting 1 from the exponential function of x (e raised to the power of x, where e is the base of the natural logarithms).",
    },
    {
      value: "**@param** `x` - A numeric expression.",
    },
  ],
  f16round: [
    {
      value: "`(method) Math.f16round(x: number): number`",
    },
    {
      value:
        "Returns the nearest half precision float representation of a number.",
    },
    {
      value: "**@param** `x` - A numeric expression.",
    },
  ],
  fround: [
    {
      value: "`(method) Math.fround(x: number): number`",
    },
    {
      value:
        "Returns the nearest single precision float representation of a number.",
    },
    {
      value: "**@param** `x` - A numeric expression.",
    },
  ],
  hypot: [
    {
      value: "`(method) Math.hypot(...values: number[]): number`",
    },
    {
      value: "Returns the square root of the sum of squares of its arguments.",
    },
    {
      value:
        "**@param** `values` - Values to compute the square root for. If no arguments are passed, the result is +0. If there is only one argument, the result is the absolute value. If any argument is +Infinity or -Infinity, the result is +Infinity. If any argument is NaN, the result is NaN. If all arguments are either +0 or -0, the result is +0.",
    },
  ],
  imul: [
    {
      value: "`(method) Math.imul(x: number, y: number): number`",
    },
    {
      value: "Returns the result of 32-bit multiplication of two numbers.",
    },
    {
      value: "**@param** `x` - First number",
    },
    {
      value: "**@param** `y` - Second number",
    },
  ],
  log: [
    {
      value: "`(method) Math.log(x: number): number`",
    },
    {
      value: "Returns the natural logarithm (base e) of a number.",
    },
    {
      value: "**@param** `x` - A numeric expression.",
    },
  ],
  log10: [
    {
      value: "`(method) Math.log10(x: number): number`",
    },
    {
      value: "Returns the base 10 logarithm of a number.",
    },
    {
      value: "**@param** `x` - A numeric expression.",
    },
  ],
  log1p: [
    {
      value: "`(method) Math.log1p(x: number): number`",
    },
    {
      value: "Returns the natural logarithm of 1 + x.",
    },
    {
      value: "**@param** `x` - A numeric expression.",
    },
  ],
  log2: [
    {
      value: "`(method) Math.log2(x: number): number`",
    },
    {
      value: "Returns the base 2 logarithm of a number.",
    },
    {
      value: "**@param** `x` - A numeric expression.",
    },
  ],
  pow: [
    {
      value: "`(method) Math.pow(x: number, y: number): number`",
    },
    {
      value:
        "Returns the value of a base expression taken to a specified power.",
    },
    {
      value: "**@param** `x` - The base value of the expression.",
    },
    {
      value: "**@param** `y` - The exponent value of the expression.",
    },
  ],
  sign: [
    {
      value: "`(method) Math.sign(x: number): number`",
    },
    {
      value:
        "Returns the sign of the x, indicating whether x is positive, negative or zero.",
    },
    {
      value: "**@param** `x` - The numeric expression to test",
    },
  ],
  sin: [
    {
      value: "`(method) Math.sin(x: number): number`",
    },
    {
      value: "Returns the sine of a number.",
    },
    {
      value:
        "**@param** `x` - A numeric expression that contains an angle measured in radians.",
    },
  ],
  sinh: [
    {
      value: "`(method) Math.sinh(x: number): number`",
    },
    {
      value: "Returns the hyperbolic sine of a number.",
    },
    {
      value:
        "**@param** `x` - A numeric expression that contains an angle measured in radians.",
    },
  ],
  sqrt: [
    {
      value: "`(method) Math.sqrt(x: number): number`",
    },
    {
      value: "Returns the square root of a number.",
    },
    {
      value: "**@param** `x` - A numeric expression.",
    },
  ],
  tan: [
    {
      value: "`(method) Math.tan(x: number): number`",
    },
    {
      value: "Returns the tangent of a number.",
    },
    {
      value:
        "**@param** `x` - A numeric expression that contains an angle measured in radians.",
    },
  ],
  tanh: [
    {
      value: "`(method) Math.tanh(x: number): number`",
    },
    {
      value: "Returns the hyperbolic tangent of a number.",
    },
    {
      value:
        "**@param** `x` - A numeric expression that contains an angle measured in radians.",
    },
  ],
  trunc: [
    {
      value: "`(method) Math.trunc(x: number): number`",
    },
    {
      value:
        "Returns the integral part of the a numeric expression, x, removing any fractional digits. If x is already an integer, the result is x.",
    },
    {
      value: "**@param** `x` - A numeric expression.",
    },
  ],
} as const satisfies Record<string, IMarkdownString[]>;

export function insertMathTooltips(
  word: string,
  lineText: string
): languages.ProviderResult<languages.Hover> | void {
  // @ts-expect-error shut up
  const mathTooltip = mathTooltips[word];
  const mathRegex = /\bMath\.\w+\b/g;
  const mathMatch = lineText.match(mathRegex);

  if (
    mathTooltip &&
    mathMatch &&
    mathMatch.some((match) => match.includes(word))
  )
    return {
      contents: mathTooltip,
    };
}
