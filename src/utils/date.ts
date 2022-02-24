import { DateTime } from "luxon";
import Is from "@mongez/supportive-is";
import { applicationConfigurations } from "config";

/**
 * Parse the given date and return a new DateTime instance
 */
export default function date(
  date: any,
  format?: string,
  timezone?: string
): DateTime {
  let returnedDate: DateTime;

  if (Is.numeric(date)) {
    returnedDate = DateTime.fromSeconds(date);
  } else if (Is.string(date)) {
    returnedDate = DateTime.fromFormat(
      date,
      format || (applicationConfigurations?.date?.format as string)
    );
  } else {
    returnedDate = DateTime.fromJSDate(date);
  }

  if (applicationConfigurations.locale) {
    returnedDate.setLocale(applicationConfigurations.locale);
  }

  if (!timezone && applicationConfigurations.date?.timezone) {
    timezone = applicationConfigurations.date?.timezone;
  }

  if (timezone) {
    returnedDate.setZone(timezone);
  }

  return returnedDate;
}

/**
 * Get a new instance of current time
 */
export function now(): DateTime {
  return DateTime.now();
}
