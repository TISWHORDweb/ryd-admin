import moment from 'moment-timezone';

export const totalCohortChild = (programs, id) => {
  const filteredPrograms = programs.filter((program) => program.partnerId === id);
  const programCount = filteredPrograms.reduce((count, program) => {
    const childId = program.childId;
    if (!count.has(childId)) {
      count.set(childId, 1);
    }
    return count;
  }, new Map());

  return programCount.size
};


export const totalCohortParent = (programs, id) => {
  const filteredPrograms = programs.filter((program) => program.partnerId === id);
  const programCount = filteredPrograms.reduce((count, program) => {
    const parentId = program.child.parentId;
    if (!count.has(parentId)) {
      count.set(parentId, 1);
    }
    return count;
  }, new Map());

  return programCount.size
};


export function newFormatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, '0'); // Get day and pad with zero if needed
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
  const year = date.getUTCFullYear(); // Get full year

  return `${day}/${month}/${year}`; // Format as DD/MM/YYYY
}

export function calculateDebt(programs) {
  const debt = programs.filter((program) => program.partner_package && !program.isPaid)
    .reduce((total, program) => total + program.partner_package.amount, 0);
  return debt
}

export function convertLessonTimes(times, parentTimezone) {
  const defaultTimezone = "Africa/Lagos";

  const convertedTimes = times.map(slot => {
    const time = moment.tz(
      `${slot.timeText} ${slot.dayText}`,
      "hA dddd",
      defaultTimezone
    );

    const convertedTime = defaultTimezone === parentTimezone
      ? time
      : time.clone().tz(parentTimezone);

    return `${slot.dayText} ${convertedTime.format('h:mmA')}`;
  });

  return convertedTimes.join(', ');
}


export function convertTimeGroup(times) {
  try {
    let formatted = [];

    if (Array.isArray(times[0]) && Array.isArray(times)) {
      formatted = times.map((slotPair, index) => {
        const [start, end] = slotPair;
        return {
          value: index,
          name: `${start.dayText} ${start.timeText}, ${end.dayText} ${end.timeText}`,
        };
      });
    }

    else if (Array.isArray(times)) {
      formatted = times.map((slot) => ({
        value: slot.id,
        name: `${slot.dayText} ${slot.timeText}`,
      }));
    }

    return formatted;
  } catch (error) {
    console.error('Error parsing time slots:', error);
    return [];
  }
}

export function convertTimegroupToParentTimezone(timegroup, parentTimezone) {

  const defaultTimezone = "Africa/Lagos"; 

  const timeStrings = timegroup.split('/').map(str => str.trim());

  const convertedTimes = timeStrings.map(timeString => {
    try {
      const match = timeString.match(/([A-Za-z]+ \d+), ([A-Za-z]+) (\d+)(?::(\d+))?([AP]M)/i);
      if (!match) throw new Error('Invalid format');

      const [, datePart, dayPart, hours, minutes = '00', ampm] = match;
      const currentYear = new Date().getFullYear();
      const dateStr = `${datePart} ${currentYear} ${hours}:${minutes} ${ampm}`;

      const time = moment.tz(dateStr, 'MMMM D YYYY h:mm A', defaultTimezone);

      if (!time.isValid()) {
        throw new Error(`Invalid date: ${dateStr}`);
      }

      if (parentTimezone === defaultTimezone) {
        return `${time.format('MMMM D')}, ${dayPart} ${time.format('h:mmA')}`;
      }

      const convertedTime = time.clone().tz(parentTimezone);

      const isDST = convertedTime.isDST();
      const timeZoneType = isDST ? "(DST)" : "(ST)"; 

      return `${convertedTime.format('MMMM D')}, ${dayPart} ${convertedTime.format('h:mmA')} ${timeZoneType}`;

    } catch (error) {
      return 'Invalid date';
    }
  });

  return convertedTimes.join(' / ');
}


