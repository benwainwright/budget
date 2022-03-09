import RRule from "rrule";
import * as chrono from "chrono-node";
import later from "later";

const rruleRecurrance = (text: string, from: Date, to: Date) => {
  try {
    const options = RRule.parseText(text);
    if (options) {
      options.dtstart = from;
      options.until = to;
      return new RRule(options).all();
    }
    return [];
  } catch (error) {
    return [];
  }
};

const laterReccurance = (text: string, from: Date, to: Date) => {
  const schedule = later.parse.text(text);

  const instances = later.schedule(schedule).next(999, from, to) as
    | Date
    | Date[]
    | number;

  if (typeof instances === "number") {
    return [];
  }

  return Array.isArray(instances) ? instances : [instances];
};

export const recurrance = (text: string, to: Date, from?: Date) => {
  const start = new Date();
  start.setDate(start.getDate() + 1);

  const found = rruleRecurrance(text, from ?? start, to);

  if (found.length === 0) {
    console.log(`text`, text);
    console.log(`from`, from);
    console.log(`start`, start);
    console.log(`to`, to);
    return laterReccurance(text, from ?? start, to);
  }

  return found;
};

export const getDates = (text: string, to: Date, from?: Date, max?: number) => {
  const all = recurrance(text, to, from);
  if (all.length === 0) {
    const result = chrono.parseDate(text);
    return result ? [result] : [];
  }
  return max === undefined ? all : all.slice(0, max);
};
