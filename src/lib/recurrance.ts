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

  if (instances === 0) {
    return [];
  }

  return instances !== 0 && Array.isArray(instances) ? instances : [instances];
};

export const recurrance = (text: string, to: Date) => {
  const start = new Date();
  start.setDate(start.getDate() + 1);

  const found = rruleRecurrance(text, start, to);

  if (found.length === 0) {
    return laterReccurance(text, start, to);
  }

  return found;
};

export const getDates = (text: string, to: Date, max?: number) => {
  const all = recurrance(text, to);
  if (all.length === 0) {
    const result = chrono.parseDate(text);
    return result ? [result] : [];
  }

  return max === undefined ? all : all.slice(0, max);
};
